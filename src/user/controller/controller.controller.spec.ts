import { Test, TestingModule } from '@nestjs/testing';
import { ControllerController } from './controller.controller';

describe('ControllerController', () => {
  let controller: ControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControllerController],
    }).compile();

    controller = module.get<ControllerController>(ControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("should can say hello", async () => {
    const response = await controller.sayHello('Muhamad');

    expect(response).toBe("Hello Muhamad")
  })
});
