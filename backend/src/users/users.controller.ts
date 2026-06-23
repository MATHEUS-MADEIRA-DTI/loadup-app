import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return {
      id: user._id?.toString() ?? user.id,
      email: user.email,
      timezone: user.timezone,
      createdAt: user.createdAt,
    };
  }
}
