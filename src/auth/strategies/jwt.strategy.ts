import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy for Passport authentication
 * This strategy is responsible for validating JWT tokens and retrieving the associated user
 * It extends PassportStrategy to implement JWT-based authentication
 * 
 * @requires JWT_SECRET environment variable to be set
 * @description This strategy validates JWT tokens from the Authorization header and
 * retrieves the corresponding user from the database using the user's ID
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy
   * @param userRepository - Repository for User entity to query user data
   * @param configService - Service to access configuration values and environment variables
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Validates the JWT payload and retrieves the associated user
   * This method is called by Passport after the JWT is verified
   * 
   * @param payload - The decoded JWT payload containing user information (includes user id)
   * @returns The authenticated user if found and active
   * @throws UnauthorizedException if:
   *  - The user is not found in the database
   *  - The user is not active
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    console.log(user);
    return user;
  }
}
