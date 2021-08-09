import {Entity, model, property} from '@loopback/repository';
import {RoleType} from '../role.enum';
@model()
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'number',
  })
  roletype?: RoleType;

  @property({
    type: 'string',
  })
  description?: string;


  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
