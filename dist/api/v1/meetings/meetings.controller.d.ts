import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    create(createMeetingDto: CreateMeetingDto, req: any): Promise<import("../../../infrastructure/database/entities/meeting.entity").Meeting>;
    findAllByChama(chamaId: string): Promise<import("../../../infrastructure/database/entities/meeting.entity").Meeting[]>;
    findUpcomingByChama(chamaId: string): Promise<import("../../../infrastructure/database/entities/meeting.entity").Meeting[]>;
    getCountByStatus(chamaId: string, status: string): Promise<number>;
    findOne(id: string): Promise<import("../../../infrastructure/database/entities/meeting.entity").Meeting>;
    update(id: string, updateMeetingDto: UpdateMeetingDto, req: any): Promise<import("../../../infrastructure/database/entities/meeting.entity").Meeting>;
    remove(id: string, req: any): Promise<void>;
}
