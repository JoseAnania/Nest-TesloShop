import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    
    // importamos el servicio que nos permite utilizar las variables de entorno (".env")
    ConfigModule.forRoot(),

    // importamos el servicio de conexión a la BD (Postgres) que se encuentra en las variables de entorno (".env")
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ProductsModule,
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
