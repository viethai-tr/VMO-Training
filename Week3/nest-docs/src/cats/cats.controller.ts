import { Body, Controller, Get, HttpCode, Param, Post, Redirect } from '@nestjs/common';
import { CreateCatsDto } from 'src/dto/create-cat.dto';
import { Cat } from 'src/interfaces/cat.interface';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
    constructor(private catsService: CatsService) {}

    @Get()
    @Redirect('https://docs.nestjs.com', 302)
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }

    @Post()
    @HttpCode(204)
    async create(@Body() createCatDto: CreateCatsDto) {
        return this.catsService.create(createCatDto);
    }
    
    /*

    */

    @Get('ab*cd')
    wildcards(): string {
        return 'This route uses a wildcard';
    }

    @Get(':id')
    findOne(@Param('id') params): string {
        console.log(params.id);
        return `#${params.id} cat`;
    }
    
}
