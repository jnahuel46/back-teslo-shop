import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    try {
      const { email, password, fullName } = registerAuthDto;
      const passwordHash = await bcrypt.hashSync(password, 10);
      const user = this.userRepository.create({
        email,
        password: passwordHash,
        fullName,
      });
      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { email, password } = loginAuthDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: {
          email: true,
          password: true,
          id: true,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials (email)');
      }
      const isPasswordValid = await bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials (password)');
      }
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkAuthStatus(user: User) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
}
