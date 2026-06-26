import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FriendshipService } from './friendship.service';
import { SendFriendRequestDto } from './dto/friendship.dto';

@Controller('friendships')
@UseGuards(JwtAuthGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  async sendRequest(@CurrentUser('id') userId: string, @Body() dto: SendFriendRequestDto) {
    return this.friendshipService.sendRequest(userId, dto.receiverId);
  }

  @Patch(':id/accept')
  async accept(@CurrentUser('id') userId: string, @Param('id') friendshipId: string) {
    return this.friendshipService.acceptRequest(userId, friendshipId);
  }

  @Patch(':id/reject')
  async reject(@CurrentUser('id') userId: string, @Param('id') friendshipId: string) {
    return this.friendshipService.rejectRequest(userId, friendshipId);
  }

  @Get()
  async getFriends(@CurrentUser('id') userId: string) {
    return this.friendshipService.getFriends(userId);
  }

  @Get('status/:otherUserId')
  async getStatus(@CurrentUser('id') userId: string, @Param('otherUserId') otherUserId: string) {
    return this.friendshipService.getStatus(userId, otherUserId);
  }
  
}
