import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

// Query parameters are strings: only plain digits are converted to a number,
// anything else stays as is and is rejected by @IsInt().
const toInteger = ({ value }: { value: unknown }): unknown =>
  typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;

export class PaginationQueryDto {
  @Transform(toInteger)
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  page: number = 1;

  @Transform(toInteger)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
