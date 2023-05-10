import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  
  @Entity('userData')
  export class UserDataEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ default: '' , nullable: true })
    accessToken: string;

    @Column({ default: '' , nullable: true })
    refreshToken: string;
    
    @Column({ default: '' , nullable: true })
    username: string;

    @Column({ default: '' , nullable: true })
    displayName: string;

    @Column({ default: '' , nullable: true })
    email: string;

    @CreateDateColumn()
    createdAt: Date;
  
  }
  