import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {PasswordHasherBinding} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from './hasher.password.bcrypt';
export class MyuserService implements UserService<User, Credentials>{

    constructor(
        @repository(UserRepository)
        public UserRepository: UserRepository,
        @inject(PasswordHasherBinding.PASSWORD_HASHER)
        public hasher: BcryptHasher

    ) { }
    async verifyCredentials(credentials: Credentials): Promise<User> {

        const foundUser = await this.UserRepository.findOne({
            where: {
                email: credentials.email
            }
        });
        if (!foundUser) {
            throw new HttpErrors.NotFound(`user not found with this ${credentials.email}`);
        }
        const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password!);

        if (!passwordMatched) {
            throw new HttpErrors.Unauthorized('Password doesnt matches');
        }
        return foundUser;

    }
    convertToUserProfile(user: User): UserProfile {
        let username = ''
        if (user.firstname) {
            username = user.firstname;
        }
        if (user.lastname) {
            username = user.firstname ? `${user.firstname} ${user.lastname}` : user.lastname
        }

        return {id: user.id, name: username, permission: user.permissions}
    }



}
