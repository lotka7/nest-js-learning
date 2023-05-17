import { Global, Module } from '@nestjs/common';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { CatsController } from './cats.controller';
import { ICatsService } from './services/cat-service.interface';
import { CatsService } from './services/cats.service';

@Global()
// It is globally available
// it doesn't have to be imported in other modules,
// but it is not a good practice to make everything to global
@Module({
  controllers: [CatsController],
  providers: [{ provide: ICatsService, useClass: CatsService }, MyLogger],
})
export class CatsModule {}
