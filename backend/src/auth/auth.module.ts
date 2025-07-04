import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
