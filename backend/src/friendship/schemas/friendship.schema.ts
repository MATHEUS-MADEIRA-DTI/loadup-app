import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FriendshipDocument = Friendship & Document;

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';

@Schema({ timestamps: true })
export class Friendship {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  requesterId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  receiverId: Types.ObjectId;

  @Prop({
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: FriendshipStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
FriendshipSchema.index({ requesterId: 1, receiverId: 1 }, { unique: true });
