import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersService } from './services/users.service';
import { GithubStrategy } from './services/githubStrategy';
import { UserDataEntity } from './models/user.entity';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'github'}),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join('/tmp', 'database.db'),
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserDataEntity])
  ],
  controllers: [AppController],
  providers: [GithubStrategy,UsersService],
}) 
export class AppModule {}
