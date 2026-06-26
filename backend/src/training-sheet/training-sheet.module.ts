import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingSheetController } from './training-sheet.controller';
import { TrainingSheetService } from './training-sheet.service';
import { TrainingSheet, TrainingSheetSchema } from './schemas/training-sheet.schema';
import { ExercisesApiModule } from '../exercises-api/exercises-api.module';
import { FriendshipModule } from '../friendship/friendship.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TrainingSheet.name, schema: TrainingSheetSchema }]),
    ExercisesApiModule,
    FriendshipModule,
    UsersModule,
  ],
  controllers: [TrainingSheetController],
  providers: [TrainingSheetService],
  exports: [TrainingSheetService],
})
export class TrainingSheetModule {}
