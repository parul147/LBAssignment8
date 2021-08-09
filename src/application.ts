import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {AuthorizationComponent, AuthorizationDecision, AuthorizationOptions, AuthorizationTags} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {Application, ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTStrategy} from './authenticationStrategy/jwt-strategy';
import {PasswordHasherBinding, TokenServiceBindings, TokenServiceConstants, UserServiceBindings} from './keys';
import {MySequence} from './sequence';

import {BcryptHasher} from './services/hasher.password.bcrypt';
import {JWTService} from './services/jwt-service';
import {MyuserService} from './services/user-service';
export {ApplicationConfig};

export class AppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    //set up binding
    this.setupBinding();

    //register authentication component
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy)

    //register authorization component
    this.component(AuthorizationComponent);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setupBinding(): void {
    this.bind(PasswordHasherBinding.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBinding.ROUNDS).to(10);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyuserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);

  }
}
