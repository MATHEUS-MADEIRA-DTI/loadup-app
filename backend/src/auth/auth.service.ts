import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const user = await this.usersService.create(name, email, password);
    return this.createAuthResponse(user._id.toString(), user.name, user.email, user.createdAt);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.createAuthResponse(user._id.toString(), user.name, user.email, user.createdAt);
  }

  private createAuthResponse(id: string, name: string, email: string, createdAt: Date) {
    const token = this.jwtService.sign({ sub: id, email, name });
    return {
      id,
      name,
      email,
      token,
      expiresIn: 86400,
      createdAt,
    };
  }
}
