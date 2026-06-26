import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(@Query('name') name: string, @CurrentUser('id') userId: string) {
    if (!name || name.trim().length < 2) return [];
    return this.usersService.searchByName(name.trim(), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { name?: string; isPublic?: boolean },
  ) {
    return this.usersService.updateProfile(userId, body);
  }

  @Get(':id/profile')
  async getProfile(@Param('id') userId: string) {
    return this.usersService.getPublicProfile(userId);
  }
}
