import { EntityMapperError } from "./mappers/EntityMapperError";
import { EntityCrudRepositoryError } from "../repositories/EntityCrudRepositoryError";

export class EntityErrorHandler {
    handle(error: any, request: any, response: any, next: any): void {
        if (error instanceof EntityMapperError) {
            return this.handleEntityMapperError(error, response);
        }

        if (error instanceof EntityCrudRepositoryError) {
            // could not find
        }
    }

    private handleEntityMapperError(error: EntityMapperError, response): void {
        switch (error.code) {
            // case // bad request could not find id could not find *entity*
        }
    }
}