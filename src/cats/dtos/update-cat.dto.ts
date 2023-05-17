import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto';

// There are a lor of various opportunitie (like: omit, pick, partial, intersection...) to extend types
export class UpdateCatDto extends PartialType(CreateCatDto) {}
