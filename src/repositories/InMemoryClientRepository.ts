import { IClient } from "../IClient";
import { IClientRepository } from "./IClientRepository";

export class InMemoryClientRepository implements IClientRepository {
  private clients: { [key: string] : IClient } = {};

  create(client: IClient) {
    this.clients[client._id] = client;
  }
  
  update(client: IClient) {
    if (!this.clients[client._id]) {
      throw new Error('Not found');
    }
    
    this.clients[client._id] = client;
  }

  delete(client: IClient) {
    delete this.clients[client._id];    
  }

  getById(clientID: number) {
    return this.clients[clientID];
  }
}