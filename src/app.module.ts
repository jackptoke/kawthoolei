import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import 'dotenv/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { Member } from './members/entities/member.entity';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/entities/article.entity';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

const typeOrmModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: parseInt(process.env.KTL_DB_PORT),
  username: process.env.KTL_DB_USERNAME,
  password: process.env.KTL_DB_PASSWORD,
  database: process.env.KTL_DB_NAME,
  // entities: ['dist/**/*.entity{.ts,.js}'],
  entities: [Member, Article],
  autoLoadEntities: true,
  synchronize: true,
});

const graphQLModule = GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  sortSchema: true,
});

@Module({
  imports: [
    graphQLModule,
    typeOrmModule,
    AuthModule,
    MembersModule,
    ArticlesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
