import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Connection } from 'src/connection/connection';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MemberService {
  constructor(private moduleRef: ModuleRef) {}

  getConnectionName(): string {
    const connection = this.moduleRef.get(Connection);

    return connection.getName();
  }

  sendEmail(): void {
    const sendEmail = this.moduleRef.get(MailService);

    return sendEmail.send();
  }
}
