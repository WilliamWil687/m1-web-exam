import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class UpdateBikeDto {
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsNumber()
  @IsPositive()
  frameSizeCm?: number;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsNumber()
  @IsPositive()
  wheelSizeInches?: number;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  gearCount?: number;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsNumber()
  @IsPositive()
  weightKg?: number;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsBoolean()
  electric?: boolean;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  priceCents?: number;
}
