import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { CreateChamaDto } from './dto/create-chama.dto';
import { UpdateChamaDto } from './dto/update-chama.dto';

@Injectable()
export class ChamasService {
  constructor(
    @InjectRepository(Chama)
    private chamaRepository: Repository<Chama>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createChamaDto: CreateChamaDto, clerkId: string): Promise<Chama> {
    // Find user by clerkId to get their UUID
    const user = await this.userRepository.findOne({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found. Please sync your account first.');
    }

    const chama = this.chamaRepository.create({
      ...createChamaDto,
      createdById: user.id, // Use UUID instead of clerkId
    });
    return this.chamaRepository.save(chama);
  }

  async findAll(): Promise<Chama[]> {
    return this.chamaRepository.find({
      relations: ['createdBy'],
    });
  }

  async findOne(id: string): Promise<Chama> {
    const chama = await this.chamaRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!chama) {
      throw new NotFoundException(`Chama with ID ${id} not found`);
    }

    return chama;
  }

  async update(id: string, updateChamaDto: UpdateChamaDto, clerkId: string): Promise<Chama> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.findOne(id);

    if (chama.createdById !== user.id) {
      throw new ForbiddenException('You can only update chamas you created');
    }

    Object.assign(chama, updateChamaDto);
    return this.chamaRepository.save(chama);
  }

  async remove(id: string, clerkId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chama = await this.findOne(id);

    if (chama.createdById !== user.id) {
      throw new ForbiddenException('You can only delete chamas you created');
    }

    await this.chamaRepository.remove(chama);
  }
}