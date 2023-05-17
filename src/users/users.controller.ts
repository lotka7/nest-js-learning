import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './services/users.service';

@Controller('users')
// It can be used at the method level as well
@UseGuards(RolesGuard)
export class UsersController {
  // TODO - IUserService as type
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   console.log(createUserDto);
  //   return 'This action adds a new user';
  // }

  @Post()
  // Example for array validation
  createBulk(
    @Body(new ParseArrayPipe({ items: CreateUserDto }))
    createUserDtos: CreateUserDto[],
  ) {
    return 'This action adds new users';
  }

  // Example for custom decorator
  @Get()
  async findOne(@User('firstName') firstName: string) {
    console.log(`Hello ${firstName}`);
  }

  // It could be handy for queryparams e.g. GET /?ids=1,2,3
  @Get()
  findByIds(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ) {
    return 'This action returns users by ids';
  }

  //   // Working with pipes example
  //   @Get()
  // async findOne(
  //   @User(new ValidationPipe({ validateCustomDecorators: true }))
  //   user: UserEntity,
  // ) {
  //   console.log(user);
  // }
}
