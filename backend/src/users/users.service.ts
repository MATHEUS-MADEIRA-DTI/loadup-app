import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(name: string, email: string, password: string) {
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = new this.userModel({ name, email, passwordHash });
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async searchByName(name: string, excludeUserId: string) {
    return this.userModel
      .find({
        name: { $regex: name, $options: 'i' },
        _id: { $ne: excludeUserId },
      })
      .select('_id name isPublic')
      .limit(20)
      .exec();
  }

  async updateProfile(userId: string, data: { name?: string; isPublic?: boolean }) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: data }, { new: true })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getPublicProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('_id name isPublic createdAt').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
