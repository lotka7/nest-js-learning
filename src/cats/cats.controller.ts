import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from 'src/guards/roles.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { Roles } from '../decorators/roles.decorator';
import { CreateCatDto } from './dtos/create-cat.dto';
import { UpdateCatDto } from './dtos/update-cat.dto';
import { ICatsService } from './services/cat-service.interface';

@Controller('cats')
// It can be used at the method level as well
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
// Just for test Response mapping
// @UseInterceptors(ErrorsInterceptor)
// @UseFilters(new HttpExceptionFilter()) - Controller scoped ExceptionFilter
export class CatsController {
  constructor(
    private readonly catsService: ICatsService,
    private configService: ConfigService /*<EnvironmentVariables>*/,
  ) {}

  @Post()
  @Roles('admin')
  async create(@Body() createCatDto: CreateCatDto) {
    const dbHost = this.configService.get<string>('database.host');
    console.log('DB_HOST', dbHost);

    console.log(
      'Config DB_USER',
      this.configService.get<string>(
        'DATABASE_USER',
        'DEFAULT_VAL_IF_ENV_DOESNT_EXIST',
      ),
    );
    this.catsService.create(createCatDto);
    return 'This action adds a new cat';
  }

  @Get()
  async findAll(
    @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe)
    activeOnly: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    console.log('Providing default calues by pipe', activeOnly, page);
    try {
      return this.catsService.findAll();
    } catch (error) {
      // throw new ForbiddenException(); - Custom exceptions
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  // It can be transformad globally in main.ts trandform: true
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.catsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return `This action removes a #${id} cat`;
  }
}
