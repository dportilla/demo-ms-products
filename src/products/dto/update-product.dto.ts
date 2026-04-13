import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
	@IsString()
	@IsUUID()
	id!: string;
}
