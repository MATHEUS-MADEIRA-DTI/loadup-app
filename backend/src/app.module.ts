import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { ProgressionModule } from './progression/progression.module';
import { TrainingSessionModule } from './training-session/training-session.module';
import { TrainingSheetModule } from './training-sheet/training-sheet.module';
import { UsersModule } from './users/users.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ExercisesApiModule } from './exercises-api/exercises-api.module';
import { PlateauModule } from './plateau/plateau.module';
import { databaseConfig } from './config/database.config';
import { FriendshipModule } from './friendship/friendship.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => databaseConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    TrainingSheetModule,
    ExercisesModule,
    ExercisesApiModule,
    TrainingSessionModule,
    CalendarModule,
    ProgressionModule,
    PlateauModule,
    FriendshipModule,
    NotificationModule,
    NotificationsModule,
  ],
})
export class AppModule {}
