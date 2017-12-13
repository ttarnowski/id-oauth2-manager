import { Client } from "../Client";
import { IClientRepository } from "../repositories/IClientRepository";

export class ClientController {
  private clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;    
  }

  get(request, response) {
    try {
      const client: Client = this.clientRepository.getById(request.params._id);
  
      response.status(200);
      response.json({
        _id: client._id,
        id: client.id,
        secret: client.secret,
        redirectUrl: client.redirectUrl
      });  
    } catch (error) {
      if (error instanceof TypeError) {
        response.sendStatus(404);      
      } else {
        throw error;
      }
    }
  }

  create(request, response) {
    this.clientRepository.create(Client.createFromRequest(request));
    response.sendStatus(201);
  }

  update(request, response) {
    this.clientRepository.update(Client.createFromRequest(request));
    response.sendStatus(201);  
  }

  delete(request, response) {
    this.clientRepository.delete(request.params._id);
    response.sendStatus(204);
  }
}
