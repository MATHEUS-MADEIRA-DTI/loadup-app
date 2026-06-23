import { ConfigService } from '@nestjs/config';

export const jwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_SECRET') || 'change_this_secret',
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
  },
});
