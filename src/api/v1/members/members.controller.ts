import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../../infrastructure/database/entities/member.entity';
import { ConflictException } from '@nestjs/common';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  create(@Body() createMemberDto: CreateMemberDto, @Request() req) {
    return this.membersService.create(createMemberDto, req.user.clerkId);
  }

  // Self-registration endpoint - NO AUTH GUARD (moved before @UseGuards decorator)
  @Post('request')
  async requestMembership(@Body() createMemberDto: CreateMemberDto) {
    // Check if user is already a member
    const existingMember = await this.memberRepository.findOne({
      where: {
        chamaId: createMemberDto.chamaId,
        userId: createMemberDto.userId,
      },
    });

    if (existingMember) {
      throw new ConflictException('You have already applied to this chama');
    }

    // Create pending membership directly (bypass admin check)
    const member = this.memberRepository.create({
      ...createMemberDto,
      status: 'pending',
      role: 'member',
    });

    return this.memberRepository.save(member);
  }

  @Get('chama/:chamaId')
  @UseGuards(ClerkAuthGuard)
  findByChamaId(@Param('chamaId') chamaId: string) {
    return this.membersService.findAllByChama(chamaId);
  }

  @Get('user/:userId')
  @UseGuards(ClerkAuthGuard)
  findByUserId(@Param('userId') userId: string) {
    return this.membersService.findByUser(userId);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto, @Request() req) {
    return this.membersService.update(id, updateMemberDto, req.user.clerkId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.membersService.remove(id, req.user.clerkId);
  }
}