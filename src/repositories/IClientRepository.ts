import { IClient } from "../IClient";

export interface IClientRepository {
  create(client: IClient): void;
  update(client: IClient): void;
  delete(client: IClient): void;
  getById(clientID: number): IClient;
}