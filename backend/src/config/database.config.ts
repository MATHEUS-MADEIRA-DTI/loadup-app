import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService) => {
  const uri = configService.get<string>('MONGODB_URI');
  return {
    uri,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
};
