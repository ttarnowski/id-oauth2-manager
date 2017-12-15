import { stubInterface, stubObject } from "ts-sinon";

import { IClientRepository } from "../repositories/IClientRepository";
import { IClient } from "../IClient";
import { Client } from "../Client";
import { ClientController } from "./ClientController";
import { HttpStatusCodes } from "../HttpStatusCodes";

describe('ClientController', () => {
    let clientRepositoryStub: IClientRepository;
    let clientStub: IClient;
    let createFromRequestStub;
    let requestStub;
    let responseStub;
    
    const getController = (): ClientController => {
        return new ClientController(clientRepositoryStub);
    };

    beforeEach(() => {
        clientRepositoryStub = stubInterface<IClientRepository>();
        clientStub = stubInterface<IClient>();
        requestStub = stubObject({});
        responseStub = stubObject({ 
            sendStatus: () => {}, 
            status: () => {}, 
            json: () => {} 
        });
        
        createFromRequestStub = sinon.stub(Client, 'createFromRequest');
    });

    afterEach(() => {
        createFromRequestStub.restore();
    });

    it('constructor construct an object with IClientRepository dependency', () => {
        expect(getController()).to.be.an.instanceof(ClientController);
    });

    describe('::create', () => {
        it('stores Client mapped from request in the repository', () => {
            createFromRequestStub.returns(clientStub);

            getController().create(requestStub, responseStub);

            expect(clientRepositoryStub.create).to.have.been.calledWith(clientStub);
        });

        it('responds with CREATED http status when operation succeeded', () => {
            getController().create(requestStub, responseStub);
            
            expect(responseStub.sendStatus).to.have.been.calledWith(HttpStatusCodes.CREATED);
        });
    });

    describe('::update', () => {
        it('updates Client mapped from request and stores in the repository', () => {
            createFromRequestStub.returns(clientStub);

            getController().update(requestStub, responseStub);

            expect(clientRepositoryStub.update).to.have.been.calledWith(clientStub);
        });

        it('responds with CREATED http status when operation succeeded', () => {
            getController().update(requestStub, responseStub);
            
            expect(responseStub.sendStatus).to.have.been.calledWith(HttpStatusCodes.CREATED);
        });
    });

    describe('::delete', () => {
        it('deletes client from the repository based on client _id request param', () => {
            const expectedId = 123;
            requestStub.params = { _id: expectedId };

            getController().delete(requestStub, responseStub);

            expect(clientRepositoryStub.delete).to.have.been.calledWith(expectedId);            
        });

        it('responds with NO_CONTENT http status when operation succeeded', () => {
            requestStub.params = { _id: 1 };

            getController().delete(requestStub, responseStub);
            
            expect(responseStub.sendStatus).to.have.been.calledWith(HttpStatusCodes.NO_CONTENT);            
        });
    });

    describe('::get', () => {
        it('gets client by id from the repository', () => {
            const expectedID = 1;
            requestStub.params = { _id: expectedID };
            const storedClient = new Client();

            clientRepositoryStub
                .getById
                .returns(storedClient);

            getController().get(requestStub, responseStub);

            expect(clientRepositoryStub.getById).to.have.been.calledWith(expectedID);
        });

        it('responds with json data mapped from client object returned by repository', () => {
            requestStub.params = { _id: 12 };
            const storedClient = new Client();
            storedClient._id = 1;
            storedClient.id = 'client_a';
            storedClient.secret = 'secret pass';
            storedClient.redirectUrl = 'http://url';

            clientRepositoryStub
            .getById
            .withArgs(requestStub.params._id)
            .returns(storedClient);

            getController().get(requestStub, responseStub);

            expect(responseStub.json).to.have.been.calledWith({
                _id: storedClient._id,
                id: storedClient.id,
                secret: storedClient.secret,
                redirectUrl: storedClient.redirectUrl                        
            });
        });

        it('responds with OK http status when client has been retrieved successfully', () => {
            requestStub.params = { _id: 1 };
            const storedClient = new Client();

            clientRepositoryStub
                .getById
                .returns(storedClient);

            getController().get(requestStub, responseStub);

            expect(responseStub.status).to.have.been.calledWith(HttpStatusCodes.OK);            
        });
    });
});