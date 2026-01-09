import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
export declare class ContributionsController {
    private readonly contributionsService;
    constructor(contributionsService: ContributionsService);
    create(createContributionDto: CreateContributionDto, req: any): Promise<import("../../../infrastructure/database/entities/contribution.entity").Contribution>;
    findAllByChama(chamaId: string): Promise<import("../../../infrastructure/database/entities/contribution.entity").Contribution[]>;
    findAllByUser(userId: string): Promise<import("../../../infrastructure/database/entities/contribution.entity").Contribution[]>;
    getTotalByChama(chamaId: string): Promise<number>;
    getTotalByUserInChama(userId: string, chamaId: string): Promise<number>;
    findOne(id: string): Promise<import("../../../infrastructure/database/entities/contribution.entity").Contribution>;
    update(id: string, updateContributionDto: UpdateContributionDto, req: any): Promise<import("../../../infrastructure/database/entities/contribution.entity").Contribution>;
    remove(id: string, req: any): Promise<void>;
}
