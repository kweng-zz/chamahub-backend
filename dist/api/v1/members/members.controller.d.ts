import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Repository } from 'typeorm';
import { Member } from '../../../infrastructure/database/entities/member.entity';
export declare class MembersController {
    private readonly membersService;
    private memberRepository;
    constructor(membersService: MembersService, memberRepository: Repository<Member>);
    create(createMemberDto: CreateMemberDto, req: any): Promise<Member>;
    requestMembership(createMemberDto: CreateMemberDto): Promise<Member>;
    findByChamaId(chamaId: string): Promise<Member[]>;
    findByUserId(userId: string): Promise<Member[]>;
    update(id: string, updateMemberDto: UpdateMemberDto, req: any): Promise<Member>;
    remove(id: string, req: any): Promise<void>;
}
