import { IsString } from 'class-validator';

export class RideRequestDto {
  @IsString()
  pickup_location: string;

  @IsString()
  destination: string;
}
