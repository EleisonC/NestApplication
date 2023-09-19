import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverProfile } from '../entities/drivers.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverProfile, User])],
  providers: [DriversService, UserService],
  controllers: [DriversController],
})
export class DriversModule {}
