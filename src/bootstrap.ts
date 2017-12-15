import * as express from "express";
import * as bodyParser from "body-parser";

import { InMemoryClientRepository } from "./repositories/InMemoryClientRepository";
import { ClientController } from "./controllers/ClientController";

const clientController = new ClientController(new InMemoryClientRepository());

const app = express();
app.use(bodyParser.json());

app.get('/client/:_id', clientController.get);
app.post('/client', clientController.create);
app.put('/client/:_id', clientController.update);
app.delete('/client/:_id', clientController.delete);



app.use((error, request, response, next) => {
  if (error && !response.finished) {
    response.sendStatus(500);
  }
});

export { app };