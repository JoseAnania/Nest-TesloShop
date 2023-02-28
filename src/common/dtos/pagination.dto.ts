// DTO creado para definir la paginación (GetAll) (Data Transfer Object son un tipo de objetos que sirven únicamente para transportar datos)

import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

    // cantidad de Productos por página
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit?: number;
    
    // página que se muestra
    @IsOptional()
    @IsNumber()
    @Min(0)
    offset?: number;
}