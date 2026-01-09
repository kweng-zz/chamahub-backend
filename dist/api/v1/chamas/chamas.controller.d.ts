import { ChamasService } from "./chamas.service";
import { CreateChamaDto } from "./dto/create-chama.dto";
import { UpdateChamaDto } from "./dto/update-chama.dto";
export declare class ChamasController {
    private readonly chamasService;
    constructor(chamasService: ChamasService);
    create(createChamaDto: CreateChamaDto, req: any): Promise<import("../../../infrastructure/database/entities/chama.entity").Chama>;
    findAll(): Promise<import("../../../infrastructure/database/entities/chama.entity").Chama[]>;
    findOne(id: string): Promise<import("../../../infrastructure/database/entities/chama.entity").Chama>;
    update(id: string, updateChamaDto: UpdateChamaDto, req: any): Promise<import("../../../infrastructure/database/entities/chama.entity").Chama>;
    remove(id: string, req: any): Promise<void>;
}
