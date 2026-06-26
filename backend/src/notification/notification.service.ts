import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { toObjectId } from '../common/utils/object-id.util';

interface CreateNotificationDto {
  userId: Types.ObjectId;
  type: 'friend_request' | 'friend_accepted';
  fromUserId: Types.ObjectId;
  fromUserName: string;
  friendshipId?: Types.ObjectId;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(dto: CreateNotificationDto) {
    return this.notificationModel.create(dto);
  }

  async getForUser(userId: string) {
    return this.notificationModel
      .find({ userId: toObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async getUnreadCount(userId: string) {
    return this.notificationModel
      .countDocuments({
        userId: toObjectId(userId),
        read: false,
      })
      .exec();
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.notificationModel
      .findOneAndUpdate(
        { _id: toObjectId(notificationId), userId: toObjectId(userId) },
        { $set: { read: true } },
        { new: true },
      )
      .exec();
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel
      .updateMany({ userId: toObjectId(userId), read: false }, { $set: { read: true } })
      .exec();
  }
}
