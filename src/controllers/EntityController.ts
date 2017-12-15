import { HttpStatusCodes } from "../HttpStatusCodes";

import { IEntityMapper } from "./mappers/IEntityMapper";
import { IEntityCrudRepository } from "../repositories/IEntityCrudRepository";

import { IEntity } from "../IEntity";
import { EntityNotFoundError } from "../repositories/EntityNotFoundError";
import { EntityAlreadyExistsError } from "../repositories/EntityAlreadyExistsError";

export class EntityController {
  private entityMapper: IEntityMapper;
  private entityCrudRepository: IEntityCrudRepository;

  constructor(
    entityMapper: IEntityMapper,
    entityCrudRepository: IEntityCrudRepository
  ) {
    this.entityMapper = entityMapper;
    this.entityCrudRepository = entityCrudRepository;    
  }

  get(request, response) {
    const entity: IEntity = this.entityCrudRepository.getById(request.params._id);
    const responseBody: any = this.entityMapper.mapEntityToResponseBody(entity);
    
    response.status(HttpStatusCodes.OK);
    response.send(responseBody);
  }

  create(request, response) {
    try {
      this.entityCrudRepository.create(
        this.entityMapper.mapRequestToEntity(request)
      );

      response.sendStatus(HttpStatusCodes.CREATED);
    } catch (e) {
      if (e instanceof EntityAlreadyExistsError) {
        response.status(HttpStatusCodes.CONFLICT);
      }

      this.sendResponseBodyMappedFromError(e, response);
    }

    response.end();    
  }

  private sendResponseBodyMappedFromError(e, response) {
    response.send(this.entityMapper.mapEntityErrorToResponseBody(e));  
  }

  update(request, response) {
    try {
      this.entityCrudRepository.update(
        this.entityMapper.mapRequestToEntity(request)
      );

      response.sendStatus(HttpStatusCodes.CREATED);  
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        response.sendStatus(HttpStatusCodes.NOT_FOUND);
      }
    }

    response.end();
  }

  delete(request, response) {
    const entityId: number = this.entityMapper.mapRequestToEntityId(request);

    this.entityCrudRepository.delete(entityId);

    response.sendStatus(HttpStatusCodes.NO_CONTENT);
  }
}
