// Servicio creado para alojar la lógica de negocio (Producto) de tal manera que sea reutilizable mediante inyección de dependencias.

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  // creamos una propiedad para el manejo de errores
  private readonly logger = new Logger('ProductsService');

  // inyección de la entidad de Producto en Postgres
  constructor(
    @InjectRepository(Product)   
    private readonly productRepository: Repository<Product>,
    ) {}

  // método para crear un Producto
  async create(createProductDto: CreateProductDto) {
    
    try {
      
      // crea el nuevo producto
      const product = this.productRepository.create(createProductDto);

      // guarda el nuevo producto en PostgresBD
      await this.productRepository.save(product);

      // retornamos el producto creado
      return product;

    // manejo de errores
    } catch (error) {

      // llamo al método que maneja los errores
      this.handleExceptions(error);
    }
  }

  // método para obtener todos los Productos
  findAll() {

    // retornamos todos los productos
    return this.productRepository.find();
  }

  // método para obtener un Producto por Id
  async findOne(id: string) {

    // creamos una constante con la condición para encontrar el producto por id
    const product = await this.productRepository.findOneBy({id});

    // si no existe el producto
    if (!product)
      throw new NotFoundException(`Product whit id= "${id}" not found`);
    
    // si existe, retornamos el producto
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  // método para eliminar un Producto
  async remove(id: string) {

    // creamos una constante y buscamos el producto a eliminar
    const product = await this.findOne(id);

    // si encuentra, borra de la BD
    await this.productRepository.remove(product);
  }

  // método para los errores
  private handleExceptions(error: any) {

    // si el error es por los decoradores unique
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    // si no es error anterior, logueamos el error y mandamos unexpected
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
