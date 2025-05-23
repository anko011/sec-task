import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { EntityManager, MikroORM } from '@mikro-orm/better-sqlite';
import { useContainer } from 'class-validator';
import { Role, User } from '~/users/application/entities';
import { genSalt, hash } from 'bcryptjs';
import { Seeder } from '@mikro-orm/seeder';

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.persist(
      new User(
        'Иван',
        'Иванов',
        'Иванович',
        'admin@mail.ru',
        Role.Admin,
        await hash('admin', await genSalt()),
      ),
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const orm = app.get(MikroORM);
  try {
    const pendingMigrations = await orm.getMigrator().getPendingMigrations();

    if (pendingMigrations.length > 0) {
      await orm.getMigrator().createMigration();
      await orm.getMigrator().up();
    }

    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();

    const em = orm.em.fork();
    const adminExists = await em.count(User, { email: 'admin@mail.ru' });

    if (!adminExists) {
      await orm.getSeeder().seed(AdminSeeder);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('SecTask')
    .setDescription('The api for SecTask application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
