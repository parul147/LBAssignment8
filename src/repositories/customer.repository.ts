import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Customer, CustomerRelations} from '../models';
import { SoftCrudRepository } from './soft-crud.repository.base';

export class CustomerRepository extends SoftCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Customer, dataSource);
  }
}
