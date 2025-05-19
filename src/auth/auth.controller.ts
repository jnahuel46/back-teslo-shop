import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: RegisterAuthDto, examples: { example: { value: { email: 'user@email.com', password: 'strongPassword123', fullName: 'John Doe' }}}})
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful, returns token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginAuthDto, examples: { example: { value: { email: 'user@email.com', password: 'strongPassword123' }}}})
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('private')
  @ApiOperation({ summary: 'Protected route, requires JWT' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Authenticated user.' })
  checkStatus(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      message: 'Hello World',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  @ApiOperation({ summary: 'Protected route for admin only' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Authenticated admin user.' })
  checkStatus2(@GetUser() user: User) {
    return {
      message: 'Hello World',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @ApiOperation({ summary: 'Protected route for admin only (custom decorator)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Authenticated admin user.' })
  checkStatus3(@GetUser() user: User) {
    return {
      message: 'Hello World',
      user,
    };
  }

  @Get('check-auth-status')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Authentication status.' })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
