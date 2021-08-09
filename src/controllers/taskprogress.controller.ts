

import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  param,
  patch,
  post,
  put,
  requestBody
} from '@loopback/rest';
import {Taskprogress} from '../models/taskprogress.model';
import {TaskprogressRepository} from '../repositories/taskprogress.repository';
import {GeocoderService} from '../services/geocoder.service';

export class TaskprogressController {
  constructor(
    @repository(TaskprogressRepository) protected TaskprogressRepo: TaskprogressRepository,
    @inject('services.GeocoderService') protected geoService: GeocoderService,
  ) { }

  @post('/Taskprogresss', {
    responses: {
      '200': {
        description: 'Taskprogress model instance',
        content: {'application/json': {schema: {'x-ts-type': Taskprogress}}},
      },
    },
  })
  async createTaskprogress(@requestBody() Taskprogress: Taskprogress): Promise<Taskprogress> {
    if (Taskprogress.remindAtAddress) {
      // Taskprogress(bajtos) handle "address not found"
      const geo = await this.geoService.geocode(Taskprogress.remindAtAddress);

      Taskprogress.remindAtGeo = `${geo[0].y},${geo[0].x}`;
    }
    return await this.TaskprogressRepo.create(Taskprogress);
  }

  @get('/Taskprogresss/{id}', {
    responses: {
      '200': {
        description: 'Taskprogress model instance',
        content: {'application/json': {schema: {'x-ts-type': Taskprogress}}},
      },
    },
  })
  async findTaskprogressById(
    @param.path.string('id') id: string,
    @param.query.boolean('items') items?: boolean,
  ): Promise<Taskprogress> {
    return await this.TaskprogressRepo.findById(id);
  }

  @get('/Taskprogresss', {
    responses: {
      '200': {
        description: 'Array of Taskprogress model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Taskprogress}},
          },
        },
      },
    },
  })
  async findTaskprogresss(
    @param.query.object('filter', getFilterSchemaFor(Taskprogress)) filter?: Filter,
  ): Promise<Taskprogress[]> {
    return await this.TaskprogressRepo.find(filter as any);
  }

  @put('/Taskprogresss/{id}', {
    responses: {
      '204': {
        description: 'Taskprogress PUT success',
      },
    },
  })
  async replaceTaskprogress(
    @param.path.string('id') id: string,
    @requestBody() Taskprogress: Taskprogress,
  ): Promise<void> {
    await this.TaskprogressRepo.replaceById(id, Taskprogress);
  }

  @patch('/Taskprogresss/{id}', {
    responses: {
      '204': {
        description: 'Taskprogress PATCH success',
      },
    },
  })
  async updateTaskprogress(
    @param.path.string('id') id: string,
    @requestBody() Taskprogress: Taskprogress,
  ): Promise<void> {
    await this.TaskprogressRepo.updateById(id, Taskprogress);
  }

  @del('/Taskprogresss/{id}', {
    responses: {
      '204': {
        description: 'Taskprogress DELETE success',
      },
    },
  })
  async deleteTaskprogress(@param.path.string('id') id: string): Promise<void> {
    await this.TaskprogressRepo.deleteById(id);
  }
}
