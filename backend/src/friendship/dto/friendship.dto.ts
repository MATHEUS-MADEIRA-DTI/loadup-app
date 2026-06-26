import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SendFriendRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  receiverId: string;
}
