import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ConsumerJwGuard extends AuthGuard('consumer-jwt') {}
