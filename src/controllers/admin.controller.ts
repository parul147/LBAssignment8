// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import { repository } from '@loopback/repository';
import { getJsonSchemaRef, post, requestBody } from "@loopback/rest";
import { PasswordHasherBinding, TokenServiceBindings, UserServiceBindings } from '../keys';
import { User } from "../models";
import { Credentials, UserRepository } from "../repositories/user.repository";
import { BcryptHasher } from '../services/hasher.password.bcrypt';
import { JWTService } from '../services/jwt-service';
import { MyuserService } from '../services/user-service';
import {validateCredentials} from '../services/validator';
import * as _ from 'lodash';
import {permissionKeys} from '../authorization/permission-keys'

export class AdminController {
  constructor(@repository(UserRepository)
  public UserRepository: UserRepository,
  @inject(PasswordHasherBinding.PASSWORD_HASHER)
  public hasher:BcryptHasher,
  @inject(UserServiceBindings.USER_SERVICE)
  public userService: MyuserService,
  
  @inject(TokenServiceBindings.TOKEN_SERVICE)
  public jwtService: JWTService,) {}
  @post('/admin/createAdmin',{
    responses: {
      '200':{
        description:'Admin created',
        content:{
          schema: getJsonSchemaRef(User)
      }
    }
  }
  })
    async createAdmin(@requestBody() admin:User){
      validateCredentials(_.pick(admin, ['email','password']));
  admin.permissions = [permissionKeys.CreateJob, permissionKeys.DeleteJob, permissionKeys.CreateJob]
  //encrypt the user password
  // eslint-disable-next-line require-atomic-updates
admin.password = await this.hasher.hashPasword(admin.password!)
  
      const savedAdmin = await this.UserRepository.create(admin);
  delete savedAdmin.password;
  return savedAdmin;
  
  
  }
  
  
}
