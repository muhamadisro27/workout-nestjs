import { Injectable } from '@nestjs/common';
import { ValidationService } from 'src/validation/validation/validation.service';
import { z } from 'zod';

@Injectable()
export class UserService {
  constructor(private validationService: ValidationService) {}

  async getHello(name: string = 'Guest'): Promise<string> {
    const schema = z.string().min(3).max(100);

    const result = this.validationService.validate(schema, name);

    return `Hello ${result || 'Guest'} `;
  }
}
