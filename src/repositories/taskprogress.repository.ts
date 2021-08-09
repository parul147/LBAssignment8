

import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Taskprogress} from '../models';

export class TaskprogressRepository extends DefaultCrudRepository<
  Taskprogress,
  typeof Taskprogress.prototype.id
> {
  constructor(@inject('datasources.db') dataSource: juggler.DataSource) {
    super(Taskprogress, dataSource);
  }
}
