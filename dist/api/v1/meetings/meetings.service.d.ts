import { Repository } from 'typeorm';
import { Meeting } from '../../../infrastructure/database/entities/meeting.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
export declare class MeetingsService {
    private meetingRepository;
    private userRepository;
    private chamaRepository;
    constructor(meetingRepository: Repository<Meeting>, userRepository: Repository<User>, chamaRepository: Repository<Chama>);
    create(createMeetingDto: CreateMeetingDto, clerkId: string): Promise<Meeting>;
    findAllByChama(chamaId: string): Promise<Meeting[]>;
    findUpcomingByChama(chamaId: string): Promise<Meeting[]>;
    findOne(id: string): Promise<Meeting>;
    update(id: string, updateMeetingDto: UpdateMeetingDto, clerkId: string): Promise<Meeting>;
    remove(id: string, clerkId: string): Promise<void>;
    getCountByStatus(chamaId: string, status: string): Promise<number>;
}
