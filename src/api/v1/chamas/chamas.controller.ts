import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ClerkAuthGuard } from "../auth/guards/clerk-auth.guard";
import { ChamasService } from "./chamas.service";
import { CreateChamaDto } from "./dto/create-chama.dto";
import { UpdateChamaDto } from "./dto/update-chama.dto";




@Controller('chamas')
@UseGuards(ClerkAuthGuard)
export class ChamasController {
    constructor(private readonly chamasService: ChamasService) {}

    @Post()
    create(@Body() createChamaDto:  CreateChamaDto, @Request() req) {
        return this.chamasService.create(createChamaDto, req.user.clerkId);
    }

    @Get()
    findAll() {
        return this.chamasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.chamasService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateChamaDto: UpdateChamaDto,
        @Request() req,
    ) {
        return this.chamasService.update(id, updateChamaDto, req.user.clerkId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.chamasService.remove(id, req.user.clerkId);
    }
}