import { Repository } from 'typeorm';
import { Contribution } from '../../../infrastructure/database/entities/contribution.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
export declare class ContributionsService {
    private contributionRepository;
    private userRepository;
    private chamaRepository;
    constructor(contributionRepository: Repository<Contribution>, userRepository: Repository<User>, chamaRepository: Repository<Chama>);
    create(createContributionDto: CreateContributionDto, clerkId: string): Promise<Contribution>;
    findAllByChama(chamaId: string): Promise<Contribution[]>;
    findAllByUser(userId: string): Promise<Contribution[]>;
    findOne(id: string): Promise<Contribution>;
    update(id: string, updateContributionDto: UpdateContributionDto, clerkId: string): Promise<Contribution>;
    remove(id: string, clerkId: string): Promise<void>;
    getTotalByChama(chamaId: string): Promise<number>;
    getTotalByUserInChama(userId: string, chamaId: string): Promise<number>;
}
