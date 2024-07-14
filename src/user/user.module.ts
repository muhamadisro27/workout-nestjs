import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { Connection, createConnection } from 'src/connection/connection';
import { LogMiddleware } from 'src/log/log.middleware';
import { ControllerController } from './controller/controller.controller';
import { UserService } from './user.service';
import { mailService, MailService } from './mail/mail.service';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  controllers: [ControllerController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService],
    },

    {
      provide: MailService,
      useValue: mailService,
    },
    {
      provide: 'EmailService',
      useExisting: MailService,
    },
    MemberService,
  ],
  exports: [UserService],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //     consumer.apply(AuthMiddleware).forRoutes({
  //       path: '/api/users/*',
  //       method: RequestMethod.ALL,

  //     })
  // }
}
