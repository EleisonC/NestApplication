import { DriverProfile } from 'src/entities/drivers.entity';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { RideRequest } from 'src/entities/rideRequest.entity';
import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import 'dotenv/config';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'testdb',
  host: process.env.HOST || 'nestapp-db-1',
  port: parseInt(process.env.PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  entities: [User, RefreshToken, DriverProfile, RideRequest],
  synchronize: true,
};

export default config;
