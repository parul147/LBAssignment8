import {Entity, model, property} from '@loopback/repository';
import { SoftDeleteEntity } from './soft-delete-entity';

@model()
export class Job extends SoftDeleteEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
  })
  title?: string;


  constructor(data?: Partial<Job>) {
    super(data);
  }
}

export interface JobRelations {
  // describe navigational properties here
}

export type JobWithRelations = Job & JobRelations;
