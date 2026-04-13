import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '@/src/common';
import { PrismaService } from '@/src/common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
	constructor(private prisma: PrismaService) {}

	async create(createProductDto: CreateProductDto) {
		const product = await this.prisma.product.create({
			data: createProductDto,
		});
		return product;
	}

	async findAll(paginationDto: PaginationDto) {
		const { page = 1, limit = 10 } = paginationDto;
		const totalProducts = await this.prisma.product.count({
			where: { available: true },
		});
		const lastPage = Math.ceil(totalProducts / limit);

		return {
			data: await this.prisma.product.findMany({
				skip: (page - 1) * limit,
				take: limit,
				where: { available: true },
			}),
			meta: {
				totalItems: totalProducts,
				page: page,
				lastPage: lastPage,
				hasNextPage: page < lastPage,
				hasPreviousPage: page > 1,
				itemsPerPage: limit,
				totalPages: lastPage,
				nextPage: page < lastPage ? page + 1 : null,
				previousPage: page > 1 ? page - 1 : null,
			},
		};
	}

	async findOne(id: string) {
		const product = await this.prisma.product.findUnique({
			where: { id, available: true },
		});

		if (!product) {
			throw new NotFoundException(`Product with ID ${id} not found`);
		}

		return product;
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		await this.findOne(id);

		return this.prisma.product.update({
			where: { id },
			data: updateProductDto,
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		// Hard delete the product
		// return this.prisma.product.delete({
		// 	where: { id },
		// });

		// Soft delete the product
		const product = await this.prisma.product.update({
			where: { id },
			data: { available: false, deletedAt: new Date() },
		});

		return product;
	}
}
