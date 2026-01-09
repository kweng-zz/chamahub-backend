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
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

@Controller('contributions')
@UseGuards(ClerkAuthGuard)
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  create(@Body() createContributionDto: CreateContributionDto, @Request() req) {
    return this.contributionsService.create(createContributionDto, req.user.clerkId);
  }

  @Get('chama/:chamaId')
  findAllByChama(@Param('chamaId') chamaId: string) {
    return this.contributionsService.findAllByChama(chamaId);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.contributionsService.findAllByUser(userId);
  }

  @Get('total/chama/:chamaId')
  getTotalByChama(@Param('chamaId') chamaId: string) {
    return this.contributionsService.getTotalByChama(chamaId);
  }

  @Get('total/user/:userId/chama/:chamaId')
  getTotalByUserInChama(
    @Param('userId') userId: string,
    @Param('chamaId') chamaId: string,
  ) {
    return this.contributionsService.getTotalByUserInChama(userId, chamaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contributionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContributionDto: UpdateContributionDto,
    @Request() req,
  ) {
    return this.contributionsService.update(id, updateContributionDto, req.user.clerkId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.contributionsService.remove(id, req.user.clerkId);
  }
}