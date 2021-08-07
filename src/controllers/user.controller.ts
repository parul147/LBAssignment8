// Uncomment these imports to begin using these cool features!

import { repository } from "@loopback/repository";
import { getJsonSchemaRef, post, requestBody } from "@loopback/rest";
import { User } from "../models";
import { Credentials, UserRepository } from "../repositories";
import {validateCredentials} from '../services/validator';
import * as _ from 'lodash';
import { inject } from "@loopback/core";
import{BcryptHasher} from '../services/hasher.password.bcrypt';
import { promises } from "dns";
import {MyuserService} from '../services/user-service'
import {CredentialsRequestBody} from './specs/user.controller.spec';
import { JWTService } from "../services/jwt-service";
import { PasswordHasherBinding, TokenServiceBindings, UserServiceBindings } from "../keys";
import { UserProfile } from "@loopback/security";
import { get } from "@loopback/rest";
import { authenticate, AuthenticationBindings } from "@loopback/authentication";
import { permissionKeys } from "../authorization/permission-keys";
// import {inject} from '@loopback/core';


export class UserController {
  constructor( @repository(UserRepository)
  public UserRepository: UserRepository,
  @inject(PasswordHasherBinding.PASSWORD_HASHER)
  public hasher:BcryptHasher,
  @inject(UserServiceBindings.USER_SERVICE)
  public userService: MyuserService,
  
  @inject(TokenServiceBindings.TOKEN_SERVICE)
  public jwtService: JWTService,
  ) 
  
  {
   
  }
@post('/users/signup',{
  responses: {
    '200':{
      description:'User Signed Up',
      content:{
        schema: getJsonSchemaRef(User)
    }
  }
}
})
  async signup(@requestBody() userData:User){

    validateCredentials(_.pick(userData, ['email','password']));
userData.permissions = [permissionKeys.AccessAuthFeatures];
//encrypt the user password
// eslint-disable-next-line require-atomic-updates
userData.password = await this.hasher.hashPasword(userData.password!)

    const savedUser = await this.UserRepository.create(userData);
delete savedUser.password;
return savedUser;


}




//login route
@post('/users/login', {
  responses: {
    '200': {
      description: 'Token',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
})
async login(
  @requestBody(CredentialsRequestBody) credentials: Credentials,
): Promise<{token: string}> {
  //Make sure user exist, password should be valid

const user = await this.userService.verifyCredentials(credentials);
 console.log(user);
 const userProfile =  this.userService.convertToUserProfile(user);
 console.log("userProfile",userProfile);

 //to generate a json web token
const token = await this.jwtService.generateToken(userProfile);
console.log('this is token',token);

return Promise.resolve({token});
}

//to check who the user is
@get('/users/whoamI')
@authenticate('jwt')
async whoamI(
  @inject(AuthenticationBindings.CURRENT_USER)
  currentuser:UserProfile
): Promise<UserProfile>{
  console.log(currentuser);
  return Promise.resolve(currentuser);
}


}



