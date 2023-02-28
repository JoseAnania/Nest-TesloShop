// DTO creado para definir la creación (POST) de un Producto (Data Transfer Object son un tipo de objetos que sirven únicamente para transportar datos)

import { IsString, MinLength, IsNumber, IsOptional, IsPositive, IsInt, IsArray, IsIn } from "class-validator";

export class CreateProductDto {

    // el id se genera automáticamente

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;
    
    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;
    
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags: string[];
}
