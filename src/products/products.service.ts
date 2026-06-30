import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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
		const skip = (page - 1) * limit;
		const take = limit;
		const products = await this.prisma.product.findMany({
			skip,
			take,
			where: { available: true },
		});

		return {
			data: products,
			meta: {
				totalItems: totalProducts,
				totalPages: lastPage,
				currentPage: page,
				itemsPerPage: limit,
				hasPreviousPage: page > 1,
				hasNextPage: page < lastPage,
				nextPage: page < lastPage ? page + 1 : null,
				previousPage: page > 1 ? page - 1 : null,
			},
		};
	}

	async findOne(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id, available: true },
		});

		if (!product) {
			throw new RpcException({
				status: HttpStatus.NOT_FOUND,
				message: `Product with ID ${id} not found`,
			});
		}

		return product;
	}

	async update(id: number, updateProductDto: UpdateProductDto) {
		const { id: __, ...data } = updateProductDto;

		await this.findOne(id);

		return this.prisma.product.update({
			where: { id },
			data: data,
		});
	}

	async remove(id: number) {
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

	async validateProductIds(productIds: number[]) {
		const ids = Array.from(new Set(productIds)); // Remove duplicates
		const products = await this.prisma.product.findMany({
			where: {
				id: { in: ids },
				available: true,
			},
		});

		if (products.length !== ids.length) {
			const foundIds = products.map((product) => product.id);
			const notFoundIds = ids.filter((id) => !foundIds.includes(id));
			throw new RpcException({
				status: HttpStatus.NOT_FOUND,
				message: `Products with IDs ${notFoundIds.join(', ')} not found`,
			});
		}

		return products;
	}
}
