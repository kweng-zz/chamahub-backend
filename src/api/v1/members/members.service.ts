import { ConflictException, ForbiddenException, Injectable, NotFoundException, } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "../../../infrastructure/database/entities/member.entity";
import { Repository } from "typeorm";
import { User } from "../../../infrastructure/database/entities/user.entity";
import { Chama } from "../../../infrastructure/database/entities/chama.entity";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";


@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Chama)
        private chamaRepository: Repository<Chama>,

    ) {}

    async create(createMemberDto: CreateMemberDto, requestingClerkId: string): Promise<Member> {
        //Check if requesting user is admin/creator of chama
        const requestingUser = await this.userRepository.findOne({
            where: { clerkId: requestingClerkId}
        });

        if (!requestingUser) {
            throw new NotFoundException('User not found');
        }

        const chama = await this.chamaRepository.findOne({
            where: {id: createMemberDto.chamaId},
        });

        if (!chama) {
            throw new NotFoundException('Chama not Found');
        }

        //Check if requesting user is the creator
        if (chama?.createdById !== requestingUser.id) {
            throw new ForbiddenException('Only Admin can add members');
        }

        //Check if user is already a member
        const existingMember = await this.memberRepository.findOne({
            where: {
                chamaId: createMemberDto.chamaId,
                userId: createMemberDto.userId,
            },
        });

        if (existingMember) {
            throw new ConflictException('User is already a  member');
        }

        const member = this.memberRepository.create(createMemberDto);
        const savedMember = await this.memberRepository.save(member);

        //Update member count
        await this.chamaRepository.increment(
            {id: createMemberDto.chamaId},
            'memberCount',
            1,
        );

        return savedMember;
    }

    async findAllByChama(chamaId: string): Promise<Member[]> {
        return this.memberRepository.find({
            where: {chamaId},
            relations: ['user'],
        });
    }

    // ADD THIS NEW METHOD
    async findByUser(userId: string): Promise<Member[]> {
        return this.memberRepository.find({
            where: { userId },
            relations: ['chama', 'user'],
        });
    }

    async findOne(id: string): Promise<Member> {
        const member = await this.memberRepository.findOne({
            where: {id},
            relations: ['user', 'chama'],
        });

        if (!member) {
            throw new NotFoundException(`Member with ID ${id} not found`);
        }

        return member;
    }

    async update(id: string, updateMemberDto: UpdateMemberDto, requestingClerkId: string): Promise<Member> {
        const member = await this.findOne(id);

        const requestingUser = await this.userRepository.findOne({
            where: {clerkId: requestingClerkId}
        });

        if (!requestingUser) {
            throw new NotFoundException('User not found');
        }

        const chama = await this.chamaRepository.findOne({
            where: {id: member.chamaId},
        });

        //Only chama creator can update members
        if (chama?.createdById !== requestingUser.id) {
            throw new ForbiddenException('Only admin can update members');
        }

        Object.assign(member, updateMemberDto);
        return this.memberRepository.save(member);
    }

    async remove(id: string, requestingClerkId: string): Promise<void> {
        const member = await this.findOne(id);

        const requestingUser = await this.userRepository.findOne({
            where: {clerkId: requestingClerkId}
        });

        if (!requestingUser) {
            throw new NotFoundException('User not found');
        }

        const chama = await this.chamaRepository.findOne({
            where: {id: member.chamaId},
        });

        if (chama?.createdById !== requestingUser.id) {
            throw new ForbiddenException('Only admin can remove members');
        }

        await this.memberRepository.remove(member);

        //Update member count 
        await this.chamaRepository.decrement(
            {id: member.chamaId},
            'memberCount',
            1,
        );
    }
}