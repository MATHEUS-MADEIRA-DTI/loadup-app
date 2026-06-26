import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['friend_request', 'friend_accepted'],
  })
  type: 'friend_request' | 'friend_accepted';

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  fromUserId: Types.ObjectId;

  @Prop({ required: true })
  fromUserName: string;

  @Prop({ type: Types.ObjectId, ref: 'Friendship' })
  friendshipId?: Types.ObjectId;

  @Prop({ default: false })
  read: boolean;

  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ userId: 1, read: 1 });
