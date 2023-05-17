import { Injectable, Logger } from '@nestjs/common';
import { MyLogger } from 'src/logger/services/my-logger.service';
import { Cat } from '../inerfaces/cat.interface';
import { ICatsService } from './cat-service.interface';

@Injectable()
export class CatsService extends ICatsService {
  constructor(private myLogger: MyLogger) {
    super();
    // Due to transient scope, CatsService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext('CatsService');
  }

  private cats: Cat[] = [];
  private readonly logger = new Logger(CatsService.name);

  create(cat: Cat) {
    this.cats.push(cat);
    this.logger.log('Cat has been created!!');
    this.myLogger.customLog('Please feed the cat!');
  }

  findAll(): Cat[] {
    console.log(this.cats);
    return this.cats;
  }

  findOne(id: number): Cat {
    return this.cats.find((cat) => cat.id === id);
  }

  delete(id: number) {
    this.cats = this.cats.filter((cat) => cat.id !== id);
  }
}
