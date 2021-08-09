import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Job, JobRelations} from '../models';
import { SoftCrudRepository } from './soft-crud.repository.base';

export class JobRepository extends SoftCrudRepository<
  Job,
  typeof Job.prototype.id,
  JobRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Job, dataSource);
  }
}
