import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { Auth } from 'src/auth/auth.decorator';
import { Connection } from 'src/connection/connection';
import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { ValidationFilter } from 'src/validation/validation.filter';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { MailService } from '../mail/mail.service';
import { MemberService } from '../member/member.service';
import { LoginUserRequest, loginUserValidation } from '../model/login.model';
import { UserRepository } from '../user-repository/user-repository';
import { UserService } from '../user.service';

@UseInterceptors(TimeInterceptor)
@Controller('api/users')
export class ControllerController {
  constructor(
    private readonly userService: UserService,
    private readonly connection: Connection,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
    @Inject('EmailService') private readonly emailService: MailService,
    private readonly memberService: MemberService,
  ) {}

  @Get('/hello')
  async sayHello(@Query('name') name: string): Promise<string> {
    const user = await this.userService.getHello(name);
    return user;
  }

  @Get('/create')
  @HttpCode(HttpStatus.OK)
  @Header('Accept', 'application/json')
  async create(
    @Query('first_name') first_name: string,
    @Query('last_name') last_name: string,
  ) {
    try {
      if (!first_name) {
        throw new HttpException(
          {
            code: HttpStatus.BAD_REQUEST,
            errors: 'first_name is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.userRepository.save(first_name, last_name);

      return {
        data: result,
      };
    } catch (error) {
      console.error(error);
    }
  }
  // @Get('/connection')
  // async GetConnection(): Promise<string> {
  //   this.userRepository.save();
  //   this.mailService.send();
  //   this.emailService.send();
  //   this.memberService.sendEmail()
  //   console.log(this.memberService.getConnectionName())
  //   return this.connection.getName();
  // }

  @Post('/sample')
  post(@Body() body: FormData): string {
    return `post`;
  }

  @Get('/redirect')
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: HttpStatus.MOVED_PERMANENTLY,
    };
  }

  @Get('/current')
  @UseGuards(RoleGuard)
  @Roles(['USER'])
  current(@Auth() user: User): Record<string, string> {
    return {
      data: `Hello ${user.first_name} ${user.last_name}`,
    };
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(HttpStatus.OK)
  sampleResponse(): Record<string, string> {
    return {
      data: 'Hello JSON',
    };
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string = 'guest', @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send(`success set cookie`);
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request) {
    return request.cookies['name'];
  }

  @Post('/login')
  @UseFilters(ValidationFilter)
  @UsePipes(new ValidationPipe(loginUserValidation))
  @Header('Content-Type', 'application/json')
  login(@Query('name') name: string, @Body() request: LoginUserRequest): any {
    return {
      data: `hello ${request.username}`,
    };
  }

  @Get('/:id')
  get(@Param('id', ParseIntPipe) id: number): string {
    return `GET ${id * 10}`;
  }
}
