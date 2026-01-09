import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./core/config/configuration";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./api/v1/auth/auth.module";
import { ChamasModule } from "./api/v1/chamas/chamas.module";
import { MembersModule } from "./api/v1/members/members.module";
import { ContributionsModule } from "./api/v1/contributions/contributions.module";
import { LoansModule } from "./api/v1/loans/loans.module";
import { PaymentsModule } from "./api/v1/payments/payments.module";
import { MeetingsModule } from "./api/v1/meetings/meetings.module";
import { MpesaModule } from "./api/v1/mpesa/mpesa.module";



@Module({
  imports: [
    //Load Environments Globally
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    DatabaseModule,
    AuthModule,
    ChamasModule,
    MembersModule,
    ContributionsModule,
    LoansModule,
    PaymentsModule,
    MeetingsModule,
    MpesaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}