import { IEntity } from "../IEntity";

export interface IEntityCrudRepository {
  create(entity: IEntity): void;
  update(entity: IEntity): void;
  delete(entityID: number): void;
  getById(entityID: number): IEntity;
}