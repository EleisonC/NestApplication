import { Module } from '@nestjs/common';
import { RideRequestService } from './ride-request.service';
import { RideRequestController } from './ride-request.controller';

@Module({
  providers: [RideRequestService],
  controllers: [RideRequestController]
})
export class RideRequestModule {}
