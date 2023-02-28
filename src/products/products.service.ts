// Servicio creado para alojar la lógica de negocio (Producto) de tal manera que sea reutilizable mediante inyección de dependencias.

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
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

  // método para obtener todos los Productos (con paginación)
  findAll(paginationDto: PaginationDto) {

    // creamos una constante desestructurada que por defecto (si no vienen los parámetros "limit" y "offset" será de 10 y 0 respectiva//)
    const {limit = 10, offset = 0} = paginationDto;

    // retornamos todos los productos según la paginación (por defecto o no)
    return this.productRepository.find({
      take: limit,
      skip: offset,
    })
  }

  // método para obtener un Producto por Id (uuid) (se puede buscar también por "slug" y "title")
  async findOne(id: string) {

    // creamos una variable del tipo de la Entidad
    let product: Product;

    // validamos si el término recibido es un uuid
    if (isUUID(id)) {

      // buscamos el producto por el "id" (uuid) en BD
      product = await this.productRepository.findOneBy({id: id});

    // si no es uuid, buscamos por "slug" o "title" con QueryBuilder
    } else {
      
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: id.toUpperCase(),
        slug: id.toLowerCase(),
      }).getOne();
    }

    // si no existe el producto
    if (!product)
      throw new NotFoundException(`Product whit id= "${id}" not found`);
    
    // si existe, retornamos el producto
    return product;
  }

  // método para modificar un Producto por id (sólo por uuid)
  async update(id: string, updateProductDto: UpdateProductDto) {
    
    // buscamos el producto por el id y carga sus propiedades
    const product = this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    // si no existe el producto
    if (!product) 
      throw new NotFoundException(`Product whit id= "${id}" not found`);

    try {
     
      // si existe, guardamos los cambios en BD
    await this.productRepository.save(await(product));

    // retornamos 
    return product;

    // manejo de errores
    } catch (error) {
      
      // llamo al método que maneja los errores
      this.handleExceptions(error);
    }
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
