import { IsInt, Min } from "class-validator";

export class UpdateSutemenyDto {
  nev?: string;
  laktozMentes?: boolean;

  @IsInt()
  @Min(0)
  db?: number;
}
