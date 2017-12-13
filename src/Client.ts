import { IClient } from "./IClient";

export class Client implements IClient {
  _id: number;
  id: string;
  secret: string;
  redirectUrl: string;

  static createFromRequest(request) {
    const client = new Client();

    client._id = request.body._id;
    client.id = request.body.id;
    client.redirectUrl = request.body.redirectUrl;
    client.secret = request.body.secret;

    return client;
  }
}
