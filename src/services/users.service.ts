import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDataEntity } from '../models/user.entity';
import { userData } from '../models/user.interface';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserDataEntity)
        private readonly userDataRepo: Repository<UserDataEntity> 
        ) {}    
        
        // add user data into the database
        async createUser( user: userData ){
            try {
                return await this.userDataRepo.save(user);
            } catch (error) {
                throw new Error("Unsuccesful due to error: " + error);
                
            }
            
        }
        // Get all users from the database
        async getUsers( ){
            try {
                return await this.userDataRepo.find();
            } catch (error) {
                throw new Error("Unsuccesful due to error: " + error);
            }
            
        }
}
