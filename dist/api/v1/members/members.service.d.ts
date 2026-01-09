import { Member } from "../../../infrastructure/database/entities/member.entity";
import { Repository } from "typeorm";
import { User } from "../../../infrastructure/database/entities/user.entity";
import { Chama } from "../../../infrastructure/database/entities/chama.entity";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
export declare class MembersService {
    private memberRepository;
    private userRepository;
    private chamaRepository;
    constructor(memberRepository: Repository<Member>, userRepository: Repository<User>, chamaRepository: Repository<Chama>);
    create(createMemberDto: CreateMemberDto, requestingClerkId: string): Promise<Member>;
    findAllByChama(chamaId: string): Promise<Member[]>;
    findByUser(userId: string): Promise<Member[]>;
    findOne(id: string): Promise<Member>;
    update(id: string, updateMemberDto: UpdateMemberDto, requestingClerkId: string): Promise<Member>;
    remove(id: string, requestingClerkId: string): Promise<void>;
}
