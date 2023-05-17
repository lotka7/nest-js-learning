import { OnModuleInit } from '@nestjs/common';
import { Cat } from '../inerfaces/cat.interface';

export abstract class ICatsService implements OnModuleInit {
  // Example for Lifecycle event
  onModuleInit() {
    console.log(`The CatService module has been initialized.`);
  }

  public abstract create(cat: Cat): void;
  public abstract findAll(): Cat[];
  public abstract findOne(id: number): Cat;
  public abstract delete(id: number): void;
}
