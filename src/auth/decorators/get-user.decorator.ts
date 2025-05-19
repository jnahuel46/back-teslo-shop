import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * Custom decorator to extract the authenticated user from the request
 * This decorator can be used in controller methods to get the current authenticated user
 * 
 * @example
 * // Get the entire user object
 * @Get('profile')
 * getProfile(@GetUser() user: User) {
 *   return user;
 * }
 * 
 * @example
 * // Get a specific property of the user
 * @Get('email')
 * getEmail(@GetUser('email') email: string) {
 *   return email;
 * }
 * 
 * @param data - Optional property name to extract from the user object
 * @param ctx - The execution context containing the request object
 * @returns The user object or a specific property if data parameter is provided
 * @throws InternalServerErrorException if user is not found in the request
 */
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new InternalServerErrorException('User not found in the request');
    }
    return data ? user?.[data] : user;
  },
);
