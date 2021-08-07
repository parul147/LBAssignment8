import { Http2ServerRequest } from 'http2';
import * as isEmail from 'isemail';
import {Credentials} from '../repositories/user.repository';
import {HttpErrors} from '@loopback/rest';

export function validateCredentials(credentials: Credentials){

    if(!isEmail.validate(credentials.email!)){
        throw new HttpErrors.UnprocessableEntity('Email Is Invalid');
    }

    if(credentials.password.length < 8){
        throw new HttpErrors.UnprocessableEntity('Password Lenght should be greater than 8');
    }


}