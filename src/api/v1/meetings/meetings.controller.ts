import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

@Controller('meetings')
@UseGuards(ClerkAuthGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto, @Request() req) {
    return this.meetingsService.create(createMeetingDto, req.user.clerkId);
  }

  @Get('chama/:chamaId')
  findAllByChama(@Param('chamaId') chamaId: string) {
    return this.meetingsService.findAllByChama(chamaId);
  }

  @Get('upcoming/chama/:chamaId')
  findUpcomingByChama(@Param('chamaId') chamaId: string) {
    return this.meetingsService.findUpcomingByChama(chamaId);
  }

  @Get('count/chama/:chamaId')
  getCountByStatus(
    @Param('chamaId') chamaId: string,
    @Query('status') status: string,
  ) {
    return this.meetingsService.getCountByStatus(chamaId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @Request() req,
  ) {
    return this.meetingsService.update(id, updateMeetingDto, req.user.clerkId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.meetingsService.remove(id, req.user.clerkId);
  }
}