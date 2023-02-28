// Entidad creada para definir el objeto Producto (una entidad se asociará directamente con una tabla de una base de datos)

import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Definimos la entidad y la estructura que tendrá la tabla Product en Postgres (BD relacional)
@Entity()
export class Product {

    // columna clave primaria (usamos uuid)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // columna Titulo (es unique para no repetir el nombre)
    @Column('text', {unique: true})
    title: string;

    // columna Precio (si no especifico valor, será 0 por defecto)
    @Column('float', {default: 0})
    price: number;

    // columna Descripción (acepta nulos)
    @Column('text', {nullable: true})
    description: string;

    // columna Slug para el url (es unique porque no hay dos productos iguales)
    @Column('text', {unique: true})
    slug: string;

    // columna de Stock (cantidades del producto, será 0 por defecto)
    @Column('int', {default: 0})
    stock: number;

    // columna Tamaño que será un arreglo de string
    @Column('text', {array: true})
    sizes: string[];

    // columna Género
    @Column('text')
    gender: string;

    // columna Tag que será un arreglo de string (por defecto será un arreglo vacío)
    @Column('text', {array: true, default: []})
    tags: string[]

    // método para autogenerar el Slug a partir del Title al crear un Producto
    @BeforeInsert()
    checkSlugInsert() {

        // si no viene en el POST
        if (!this.slug) {
            
            this.slug = this.title;
        }

        this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }

    // método para validar el Slug al actualizar un Producto
    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
