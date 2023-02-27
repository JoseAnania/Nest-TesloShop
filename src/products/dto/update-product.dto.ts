// DTO creado para definir la modificación (PATCH) de un Producto (Data Transfer Object son un tipo de objetos que sirven únicamente para transportar datos)

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
