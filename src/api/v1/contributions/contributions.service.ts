import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../../../infrastructure/database/entities/contribution.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private contributionRepository: Repository<Contribution>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Chama)
    private chamaRepository: Repository<Chama>,
  ) {}

  async create(createContributionDto: CreateContributionDto, clerkId: string): Promise<Contribution> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: createContributionDto.chamaId },
    });

    if (!chama) {
      throw new NotFoundException('Chama not found');
    }

    const contribution = this.contributionRepository.create(createContributionDto);
    return this.contributionRepository.save(contribution);
  }

  async findAllByChama(chamaId: string): Promise<Contribution[]> {
    return this.contributionRepository.find({
      where: { chamaId },
      relations: ['user'],
      order: { contributionDate: 'DESC' },
    });
  }

  async findAllByUser(userId: string): Promise<Contribution[]> {
    return this.contributionRepository.find({
      where: { userId },
      relations: ['chama'],
      order: { contributionDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contribution> {
    const contribution = await this.contributionRepository.findOne({
      where: { id },
      relations: ['user', 'chama'],
    });

    if (!contribution) {
      throw new NotFoundException(`Contribution with ID ${id} not found`);
    }

    return contribution;
  }

  async update(id: string, updateContributionDto: UpdateContributionDto, clerkId: string): Promise<Contribution> {
    const contribution = await this.findOne(id);

    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: contribution.chamaId },
    });

    // Only chama creator or the contributor can update
    if (chama?.createdById !== user.id && contribution.userId !== user.id) {
      throw new ForbiddenException('You can only update your own contributions or if you are the chama creator');
    }

    Object.assign(contribution, updateContributionDto);
    return this.contributionRepository.save(contribution);
  }

  async remove(id: string, clerkId: string): Promise<void> {
    const contribution = await this.findOne(id);

    const user = await this.userRepository.findOne({ where: { clerkId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.chamaRepository.findOne({
      where: { id: contribution.chamaId },
    });

    // Only chama creator can delete contributions
    if (chama?.createdById !== user.id) {
      throw new ForbiddenException('Only the chama creator can delete contributions');
    }

    await this.contributionRepository.remove(contribution);
  }

  // Get total contributions for a chama
  async getTotalByChama(chamaId: string): Promise<number> {
    const result = await this.contributionRepository
      .createQueryBuilder('contribution')
      .select('SUM(contribution.amount)', 'total')
      .where('contribution.chamaId = :chamaId', { chamaId })
      .andWhere('contribution.status = :status', { status: 'completed' })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  // Get total contributions by a user in a chama
  async getTotalByUserInChama(userId: string, chamaId: string): Promise<number> {
    const result = await this.contributionRepository
      .createQueryBuilder('contribution')
      .select('SUM(contribution.amount)', 'total')
      .where('contribution.userId = :userId', { userId })
      .andWhere('contribution.chamaId = :chamaId', { chamaId })
      .andWhere('contribution.status = :status', { status: 'completed' })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }
}