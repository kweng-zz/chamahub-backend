import { Repository } from 'typeorm';
import { Chama } from '../../../infrastructure/database/entities/chama.entity';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { CreateChamaDto } from './dto/create-chama.dto';
import { UpdateChamaDto } from './dto/update-chama.dto';
export declare class ChamasService {
    private chamaRepository;
    private userRepository;
    constructor(chamaRepository: Repository<Chama>, userRepository: Repository<User>);
    create(createChamaDto: CreateChamaDto, clerkId: string): Promise<Chama>;
    findAll(): Promise<Chama[]>;
    findOne(id: string): Promise<Chama>;
    update(id: string, updateChamaDto: UpdateChamaDto, clerkId: string): Promise<Chama>;
    remove(id: string, clerkId: string): Promise<void>;
}
