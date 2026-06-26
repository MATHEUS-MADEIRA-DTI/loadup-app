import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friendship, FriendshipDocument } from './schemas/friendship.schema';
import { NotificationService } from '../notification/notification.service';
import { UsersService } from '../users/users.service';
import { toObjectId } from '../common/utils/object-id.util';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship.name)
    private readonly friendshipModel: Model<FriendshipDocument>,
    private readonly notificationService: NotificationService,
    private readonly usersService: UsersService,
  ) {}

  async sendRequest(requesterId: string, receiverId: string) {
    if (requesterId === receiverId) {
      throw new BadRequestException('Cannot add yourself');
    }

    await this.usersService.findById(receiverId);

    const existing = await this.friendshipModel
      .findOne({
        $or: [
          { requesterId: toObjectId(requesterId), receiverId: toObjectId(receiverId) },
          { requesterId: toObjectId(receiverId), receiverId: toObjectId(requesterId) },
        ],
      })
      .exec();

    if (existing) {
      if (existing.status === 'accepted') {
        throw new BadRequestException('Already friends');
      }
      if (existing.status === 'pending') {
        throw new BadRequestException('Request already sent');
      }
      if (existing.status === 'rejected') {
        // Reativa o pedido em vez de criar um novo
        existing.requesterId = toObjectId(requesterId);
        existing.receiverId = toObjectId(receiverId);
        existing.status = 'pending';
        await existing.save();

        const requester = await this.usersService.findById(requesterId);
        await this.notificationService.create({
          userId: toObjectId(receiverId),
          type: 'friend_request',
          fromUserId: toObjectId(requesterId),
          fromUserName: requester.name,
          friendshipId: existing._id as Types.ObjectId,
        });

        return existing;
      }
    }

    const friendship = await this.friendshipModel.create({
      requesterId: toObjectId(requesterId),
      receiverId: toObjectId(receiverId),
    });

    const requester = await this.usersService.findById(requesterId);
    await this.notificationService.create({
      userId: toObjectId(receiverId),
      type: 'friend_request',
      fromUserId: toObjectId(requesterId),
      fromUserName: requester.name,
      friendshipId: friendship._id as Types.ObjectId,
    });

    return friendship;
  }

  async acceptRequest(userId: string, friendshipId: string) {
    const friendship = await this.friendshipModel.findById(friendshipId).exec();
    if (!friendship) throw new NotFoundException('Request not found');
    if (friendship.receiverId.toString() !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    if (friendship.status !== 'pending') {
      throw new BadRequestException('Request already handled');
    }

    friendship.status = 'accepted';
    await friendship.save();

    const receiver = await this.usersService.findById(userId);
    await this.notificationService.create({
      userId: friendship.requesterId,
      type: 'friend_accepted',
      fromUserId: toObjectId(userId),
      fromUserName: receiver.name,
    });

    return friendship;
  }

  async rejectRequest(userId: string, friendshipId: string) {
    const friendship = await this.friendshipModel.findById(friendshipId).exec();
    if (!friendship) throw new NotFoundException('Request not found');
    if (friendship.receiverId.toString() !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    friendship.status = 'rejected';
    return friendship.save();
  }

  async getFriends(userId: string) {
    const all = await this.friendshipModel.find({}).exec();
    console.log('ALL FRIENDSHIPS:', JSON.stringify(all, null, 2));
    console.log('LOOKING FOR userId:', userId);
    const friendships = await this.friendshipModel
      .find({
        $or: [
          { requesterId: toObjectId(userId), status: 'accepted' },
          { receiverId: toObjectId(userId), status: 'accepted' },
        ],
      })
      .populate('requesterId', '_id name isPublic')
      .populate('receiverId', '_id name isPublic')
      .exec();

    return friendships.map((f) => {
      const requester = f.requesterId as any;
      const receiver = f.receiverId as any;

      const friend = requester._id.toString() === userId ? receiver : requester;

      return {
        friendshipId: f._id,
        friend: {
          _id: friend._id.toString(),
          name: friend.name,
          isPublic: friend.isPublic,
        },
        since: f.createdAt,
      };
    });
  }

  async getStatus(userId: string, otherUserId: string) {
    const friendship = await this.friendshipModel
      .findOne({
        $or: [
          { requesterId: toObjectId(userId), receiverId: toObjectId(otherUserId) },
          { requesterId: toObjectId(otherUserId), receiverId: toObjectId(userId) },
        ],
      })
      .exec();

    if (!friendship) return { status: 'none' };
    return {
      status: friendship.status,
      friendshipId: friendship._id,
      isSender: friendship.requesterId.toString() === userId,
    };
  }

  async isFriend(userId: string, otherUserId: string): Promise<boolean> {
    console.log('=== isFriend check ===');
    console.log('userId:', userId);
    console.log('otherUserId:', otherUserId);

    const all = await this.friendshipModel.find({}).exec();
    console.log('All friendships in DB:', JSON.stringify(all, null, 2));

    const f = await this.friendshipModel
      .findOne({
        $or: [
          { requesterId: toObjectId(userId), receiverId: toObjectId(otherUserId) },
          { requesterId: toObjectId(otherUserId), receiverId: toObjectId(userId) },
        ],
        status: 'accepted',
      })
      .exec();

    console.log('Found friendship:', f);
    return !!f;
  }
}
