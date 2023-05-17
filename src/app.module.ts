import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule as DefaultConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { Cat } from './cats/cats.entity';
import { CatsModule } from './cats/cats.module';
import { ConfigModule } from './config/config.module';
import configuration from './config/configuration';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

// ----- Dynamic determination of a class (useClass)
// const configServiceProvider = {
//   // Any class depends on ConfigService, Nest will inject an instance of the provided class
//   provide: ConfigService,
//   useClass:
//     process.env.NODE_ENV === 'development'
//       ? DevelopmentConfigService
//       : ProductionConfigService,
// };

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // configServiceProvider
  ],
  imports: [
    CatsModule,
    UsersModule,
    ConfigModule.register({ folder: './config' }),
    // Partial registration in other modules instead of the route module
    // Like here: ConfigModule.forFeature(databaseConfig)
    DefaultConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nest-test',
      password: 'super-secret-password',
      database: 'nest-test',
      entities: [User, Cat],
      // It shouldn't be used in prod, otherwise it can couse data loss.
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // Middleware can be used as Functional Middleware
      .apply(LoggerMiddleware)
      //  Routes can be excludid here
      // .exclude(
      //   { path: 'cats', method: RequestMethod.GET },
      //   { path: 'cats', method: RequestMethod.POST },
      //   'cats/(.*)',
      // )
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
    // .forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
  }
}
