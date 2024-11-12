import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Sutemeny } from './sutemeny';
import { CreateSutemenyDto } from './create-sutemeny.dto';
import { UpdateSutemenyDto } from './update-sutemeny.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  sutik: Sutemeny[] = [
    {
      id: 1,
      nev: 'Tiramisu',
      laktozMentes: true,
      db: 5,
    },
    {
      id: 2,
      nev: 'Dobostorta',
      laktozMentes: true,
      db: 0,
    },
    {
      id: 4,
      nev: 'Krémes',
      laktozMentes: false,
      db: 1,
    },
  ];
  nextID = 5;

  @Get('sutik')
  sutemenyekListazas() {
    return this.sutik;
  }

  @Get('sutik/:sutiid')
  sutemenyIdAlapjan(@Param('sutiid') id: string) {
    const idSzam = parseInt(id);
    const suti = this.sutik.find(suti => suti.id == idSzam);
    if (!suti) {
      throw new NotFoundException("Nincs ilyen ID-jű süti")
    }
    return suti;
  }

  @Delete('sutik/:sutiid')
  @HttpCode(204)
  sutiTorles(@Param('sutiid') id: string) {
    const idSzam = parseInt(id);
    const idx = this.sutik.findIndex(suti => suti.id == idSzam);
    if (idx == -1) {
      throw new NotFoundException("Nincs ilyen ID-jű süti")
    }
    this.sutik.splice(idx);

    //this.sutik = this.sutik.filter(suti => suti.id != idSzam)
  }

  @Get('sutiKereses')
  sutemenyKereses(@Query('kereses') kereses?: string) {
    if (!kereses) {
      return this.sutik;
    }
    return this.sutik.filter(suti => suti.nev.toLocaleLowerCase().includes(kereses.toLocaleLowerCase()));
  }

  @Post('ujSuti')
  ujSuti(@Body() ujSutiAdatok: CreateSutemenyDto) {
    const ujSutemeny: Sutemeny = {
      ...ujSutiAdatok,
      id: this.nextID,
    }
    this.nextID++;
    this.sutik.push(ujSutemeny);
    return ujSutemeny;
  }

  @Patch('sutiModositas/:sutiid')
  sutiModositas(@Param('sutiid') id: string, @Body() sutiAdatok: UpdateSutemenyDto) {
    const idSzam = parseInt(id);
    const eredetiSutiID = this.sutik.findIndex(suti => suti.id == idSzam);
    if (eredetiSutiID == -1) {
      throw new NotFoundException("Nincs ilyen ID-jű süti")
    }

    const eredetiSuti = this.sutik[eredetiSutiID];

    if (typeof sutiAdatok.db != 'number') {
      throw new BadRequestException('A db típusa number kell legyen!');
    }
    if (sutiAdatok.db < 0) {
      throw new BadRequestException('A db nem lehet negatív!');
    }

    const ujSuti: Sutemeny = {
      ...eredetiSuti,
      ...sutiAdatok,
    };
    this.sutik[eredetiSutiID] = ujSuti;
    return ujSuti;
  }
}
