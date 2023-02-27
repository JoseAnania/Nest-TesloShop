// Modulo generado para agrupar un conjunto de funcionalidad de Producto.

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [

    // conexión a Postgres (desde el entity)
    TypeOrmModule.forFeature([Product])
  ],
})
export class ProductsModule {}
