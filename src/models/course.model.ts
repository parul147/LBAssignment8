import {Entity, model, property, hasMany} from '@loopback/repository';
import {Student} from './student.model';

@model()
export class Course extends Entity {
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

  @hasMany(() => Student)
  students: Student[];

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
}

export type CourseWithRelations = Course & CourseRelations;
