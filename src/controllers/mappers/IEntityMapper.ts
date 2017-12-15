import { IEntity } from "../../IEntity";
import { EntityCrudRepositoryError } from "../../repositories/EntityCrudRepositoryError";

export interface IEntityMapper {
    mapRequestToEntity(request): IEntity;
    mapRequestToEntityId(request): number;

    // response
    mapEntityToResponseBody(entity: IEntity): any;
    mapEntityErrorToResponseBody(error: EntityCrudRepositoryError): any;
}

interface RequestToIEntityMapper {
    mapRequestToEntity(request): IEntity;
    mapRequestToEntityId(request): number;    
}

interface IEntityToResponseMapper {
    getResp
}

interface IEntityCrudRepositoryErrorToResponseMapper {
    mapRepositoryErrorToResponseBody();
    map
}