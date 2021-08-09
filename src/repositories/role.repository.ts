import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Role, RoleRelations} from '../models';
import { SoftCrudRepository } from './soft-crud.repository.base';

export class RoleRepository extends SoftCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Role, dataSource);
  }
}
