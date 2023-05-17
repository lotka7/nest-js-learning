import { Test } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './services/cats.service';

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(catsService, 'findAll').mockImplementation(() => {
        const cat1 = { id: 1, name: 'Fluffy', age: 1, breed: 'bread1' };
        const cat2 = { id: 2, name: 'Whiskers', age: 1, breed: 'bread1' };
        return [cat1, cat2];
      });

      console.log('result');

      expect(await catsController.findAll(true, 1)).toBe(result);
    });
  });
});
