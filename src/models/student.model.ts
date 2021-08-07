import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';

import {Department} from './department.model';

@model()
export class Student extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

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
  courseId?: string;

  @belongsTo(() => Department)
  departmentId: string;

  
  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
  

}

export type StudentWithRelations = Student & StudentRelations;
