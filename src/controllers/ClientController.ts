import { Client } from "../Client";
import { IClientRepository } from "../repositories/IClientRepository";
import { HttpStatusCodes } from "../HttpStatusCodes";

export class ClientController {
  private clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;    
  }

  get(request, response) {
    const client: Client = this.clientRepository.getById(request.params._id);
    
    const clientJson = {
      _id: client._id,
      id: client.id,
      secret: client.secret,
      redirectUrl: client.redirectUrl
    };

    response.status(HttpStatusCodes.OK);
    response.json(clientJson);
  }

  create(request, response) {
    this.clientRepository.create(Client.createFromRequest(request));

    response.sendStatus(HttpStatusCodes.CREATED);
  }

  update(request, response) {
    this.clientRepository.update(Client.createFromRequest(request));

    response.sendStatus(HttpStatusCodes.CREATED);  
  }

  delete(request, response) {
    this.clientRepository.delete(request.params._id);

    response.sendStatus(HttpStatusCodes.NO_CONTENT);
  }
}
