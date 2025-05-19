import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    //we could just use the proccess.env.JWT_SECRET,
    // but we use the ConfigModule to get the secret from the .env file
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  exports: [TypeOrmModule, PassportModule, JwtStrategy, JwtModule],
})
export class AuthModule {}
