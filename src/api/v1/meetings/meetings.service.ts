import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from '../../../infrastructure/database/entities/meeting.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Chama)
    private chamaRepository: Repository<Chama>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto, clerkId: string): Promise<Meeting> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: createMeetingDto.chamaId },
    });

    if (!chama) {
      throw new NotFoundException('Chama not found');
    }

    // Only chama creator can schedule meetings
    if (chama?.createdById !== user.id) {
      throw new ForbiddenException('Only the chama creator can schedule meetings');
    }

    const meeting = this.meetingRepository.create(createMeetingDto);
    return this.meetingRepository.save(meeting);
  }

  async findAllByChama(chamaId: string): Promise<Meeting[]> {
    return this.meetingRepository.find({
      where: { chamaId },
      relations: ['chama'],
      order: { scheduledAt: 'DESC' },
    });
  }

  async findUpcomingByChama(chamaId: string): Promise<Meeting[]> {
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .where('meeting.chamaId = :chamaId', { chamaId })
      .andWhere('meeting.scheduledAt > :now', { now: new Date() })
      .andWhere('meeting.status = :status', { status: 'scheduled' })
      .orderBy('meeting.scheduledAt', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['chama'],
    });

    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }

    return meeting;
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto, clerkId: string): Promise<Meeting> {
    const meeting = await this.findOne(id);

    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: meeting.chamaId },
    });

    // Only chama creator can update meetings
    if (chama?.createdById !== user.id) {
      throw new ForbiddenException('Only the chama creator can update meetings');
    }

    Object.assign(meeting, updateMeetingDto);
    return this.meetingRepository.save(meeting);
  }

  async remove(id: string, clerkId: string): Promise<void> {
    const meeting = await this.findOne(id);

    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: meeting.chamaId },
    });

    // Only chama creator can delete meetings
    if (chama?.createdById !== user.id) {
      throw new ForbiddenException('Only the chama creator can delete meetings');
    }

    await this.meetingRepository.remove(meeting);
  }

  // Get meeting count by status for a chama
  async getCountByStatus(chamaId: string, status: string): Promise<number> {
    return this.meetingRepository.count({
      where: { chamaId, status },
    });
  }
}