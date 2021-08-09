
import {Entity, model, property} from '@loopback/repository';

@model()
export class Taskprogress extends Entity {
  @property({
    // type: 'number',
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  desc?: string;

  @property({
    type: 'boolean',
  })
  isComplete?: boolean;

  @property({
    type: 'string',
  })
  remindAtAddress?: string; // address,city,zipcode


  @property({
    type: 'string',
  })
  remindAtGeo?: string; // latitude,longitude

  constructor(data?: Partial<Taskprogress>) {
    super(data);
  }
}
