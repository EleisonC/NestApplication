import { Module } from '@nestjs/common';
import { RideRequestService } from './ride-request.service';
import { RideRequestController } from './ride-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideRequest } from 'src/entities/rideRequest.entity';
import { DriverProfile } from 'src/entities/drivers.entity';
import { DriversService } from 'src/drivers/drivers.service';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([RideRequest, DriverProfile, User])],
  providers: [RideRequestService, DriversService, UserService],
  controllers: [RideRequestController],
})
export class RideRequestModule {}
