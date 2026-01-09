import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "../../../infrastructure/database/entities/member.entity";
import { User } from "../../../infrastructure/database/entities/user.entity";
import { Chama } from "../../../infrastructure/database/entities/chama.entity";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";
import { ClerkService } from "../../../core/security/clerk.service";


@Module({
    imports: [TypeOrmModule.forFeature([Member, User, Chama])],
    controllers: [MembersController],
    providers: [MembersService, ClerkService],
    exports: [MembersService],
})
export class MembersModule {}