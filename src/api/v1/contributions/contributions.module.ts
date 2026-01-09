import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contribution } from "../../../infrastructure/database/entities/contribution.entity";
import { User } from "../../../infrastructure/database/entities/user.entity";
import { Chama } from "../../../infrastructure/database/entities/chama.entity";
import { ContributionsController } from "./contributions.controller";
import { ContributionsService } from "./contributions.service";
import { ClerkService } from "../../../core/security/clerk.service";


@Module({
    imports: [TypeOrmModule.forFeature([Contribution, User, Chama])],
    controllers: [ContributionsController],
    providers: [ContributionsService, ClerkService],
    exports: [ContributionsService],
})
export class ContributionsModule {}