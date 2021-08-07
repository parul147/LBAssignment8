import { authenticate } from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { permissionKeys } from '../authorization/permission-keys';
import {Job} from '../models';
import {JobRepository} from '../repositories';
import {authorize} from '@loopback/authorization';
import {
  basicAuthorization} from '../services/basic.authorizor';
export class JobController {
  constructor(
    @repository(JobRepository)
    public jobRepository : JobRepository,
  ) {}
//only admin can access this 
//admin should be authenticated
//interceptor- run x and y function before the below function
  @post('/jobs')
  @response(200, {
    description: 'Job model instance',
    content: {'application/json': {schema: getModelSchemaRef(Job)}},
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [permissionKeys.CreateJob],
    voters: [basicAuthorization],
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Job, {
            title: 'NewJob',
            
          }),
        },
      },
    })
    job: Job,
  ): Promise<Job> {
    return this.jobRepository.create(job);
  }

  @get('/jobs/count')
  @response(200, {
    description: 'Job model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Job) where?: Where<Job>,
  ): Promise<Count> {
    return this.jobRepository.count(where);
  }

  @get('/jobs')
  @response(200, {
    description: 'Array of Job model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Job, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Job) filter?: Filter<Job>,
  ): Promise<Job[]> {
    return this.jobRepository.find(filter);
  }
//only admin can access this 
//admin should be authenticated
  @patch('/jobs')
  @response(200, {
    description: 'Job PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Job, {partial: true}),
        },
      },
    })
    job: Job,
    @param.where(Job) where?: Where<Job>,
  ): Promise<Count> {
    return this.jobRepository.updateAll(job, where);
  }

  @get('/jobs/{id}')
  @response(200, {
    description: 'Job model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Job, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Job, {exclude: 'where'}) filter?: FilterExcludingWhere<Job>
  ): Promise<Job> {
    return this.jobRepository.findById(id, filter);
  }

//only admin can access this 
//admin should be authenticated

  @patch('/jobs/{id}')
  @response(204, {
    description: 'Job PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Job, {partial: true}),
        },
      },
    })
    job: Job,
  ): Promise<void> {
    await this.jobRepository.updateById(id, job);
  }

  //only admin can access this 
//admin should be authenticated
  @put('/jobs/{id}')
  @response(204, {
    description: 'Job PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() job: Job,
  ): Promise<void> {
    await this.jobRepository.replaceById(id, job);
  }


  //only admin can access this 
//admin should be authenticated
@authenticate('jwt', permissionKeys.DeleteJob)
  @authorize({
    allowedRoles: [permissionKeys.DeleteJob],
    voters: [basicAuthorization],
  })
  @del('/jobs/{id}')
  @response(204, {
    description: 'Job DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.jobRepository.deleteById(id);
  }
}
