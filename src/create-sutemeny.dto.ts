import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateSutemenyDto {
  @IsString()
  @IsNotEmpty({ message: 'A nevet kötelező megadni!' })
  nev: string;

  @IsBoolean()
  laktozMentes: boolean;

  @IsInt()
  @Min(0)
  db: number;

  //@IsIn(['torta', 'fagylalt', 'édesség'])
  //tipus: string;
}
