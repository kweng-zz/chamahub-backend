import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../infrastructure/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async syncUser(userData: any): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { clerkId: userData.clerkId },
    });

    if (existingUser) {
      Object.assign(existingUser, userData);
      return this.userRepository.save(existingUser);
    }

    // Create and save new user
    const newUser = this.userRepository.create(userData);
    const saved = await this.userRepository.save(newUser);
    
    // If save returns array, return first element, otherwise return as-is
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findByClerkId(clerkId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }
}