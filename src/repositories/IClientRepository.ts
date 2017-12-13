import { Client } from "../Client";

export interface IClientRepository {
  create(client: Client);
  update(client: Client);
  delete(client: Client);
  getById(clientID: number);
}