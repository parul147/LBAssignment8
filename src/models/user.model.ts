import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Customer} from './customer.model';
import {Role} from './role.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  firstname?: string;

  @property({
    type: 'string',
  })
  lastname?: string;
  @property({
    type: 'string',
  })
  middlename?: string;
  @property({
    type: 'string',
  })
  phonenumber?: string;

  @property.array(String)
  permissions?: String[];

  @belongsTo(() => Customer)
  customerId: string;

  @belongsTo(() => Role)
  roleId: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
