import { stubInterface, stubObject } from "ts-sinon";

import { IEntityCrudRepository } from "../repositories/IEntityCrudRepository";
import { IEntityMapper } from "./mappers/IEntityMapper";
import { IEntity } from "../IEntity";
import { EntityController } from "./EntityController";
import { HttpStatusCodes } from "../HttpStatusCodes";

import { EntityAlreadyExistsError } from "../repositories/EntityAlreadyExistsError";
import { EntityNotFoundError } from "../repositories/EntityNotFoundError";

describe('EntityController', () => {
    let entityCrudRepositoryStub: IEntityCrudRepository;
    let entityMapper: IEntityMapper;
    let entityStub: IEntity;

    let createFromRequestStub;
    let requestStub;
    let responseStub;
    
    const getController = (): EntityController => {
        return new EntityController(entityMapper, entityCrudRepositoryStub);
    };

    beforeEach(() => {
        entityMapper = stubInterface<IEntityMapper>();
        entityCrudRepositoryStub = stubInterface<IEntityCrudRepository>();
        entityStub = stubInterface<IEntity>();

        requestStub = stubObject({});
        responseStub = stubObject({ 
            sendStatus: () => {}, 
            status: () => {}, 
            send: () => {},
            end: () => {}
        });
    });

    it('creates an instance of EntityController object', () => {
        expect(getController()).to.be.an.instanceof(EntityController);
    });

    describe('::create', () => {
        it('maps request to entity', () => {
            getController().create(requestStub, responseStub);

            expect(entityMapper.mapRequestToEntity).to.have.been.calledWith(requestStub);
        });

        it('stores entity mapped from the request in the repository', () => {
            entityMapper.mapRequestToEntity.returns(entityStub);

            getController().create(requestStub, responseStub);

            expect(entityCrudRepositoryStub.create).to.have.been.calledWith(entityStub);
        });

        it('responds with CREATED http status code when operation succeeded', () => {
            getController().create(requestStub, responseStub);
            
            expect(responseStub.sendStatus).to.have.been.calledWith(HttpStatusCodes.CREATED);
        });

        it('responds with CONFLICT http status code when entity already exist', () => {
            entityCrudRepositoryStub.create.throws(new EntityAlreadyExistsError());

            getController().create(requestStub, responseStub);

            expect(responseStub.status).to.have.been.calledWith(HttpStatusCodes.CONFLICT);
        });

        describe('when entity already exists', () => {
            let error;

            beforeEach(() => {
                error = new EntityAlreadyExistsError();
                entityCrudRepositoryStub.create.throws(error);
            });

            it('responds with CONFLICT http status code', () => {
                getController().create(requestStub, responseStub);
    
                expect(responseStub.status).to.have.been.calledWith(HttpStatusCodes.CONFLICT);
            });            

            it('maps error to response body', () => {
                getController().create(requestStub, responseStub);

                expect(entityMapper.mapEntityErrorToResponseBody).to.have.been.calledWith(error);
            });

            it('sends response body mapped from error', () => {
                const expectedResponseBody = '{}';
                entityMapper.mapEntityErrorToResponseBody.returns(expectedResponseBody);

                getController().create(requestStub, responseStub);
                
                expect(responseStub.send).to.have.been.calledWith(expectedResponseBody);
            });
        });
    });

    describe('::update', () => {
        it('responds with NOT_FOUND http status if entity does not exist', () => {
            entityMapper.mapRequestToEntity.returns(entityStub);
            entityCrudRepositoryStub.update.throws(new EntityNotFoundError());

            getController().update(requestStub, responseStub);

            expect(responseStub.sendStatus).to.have.been.calledWith(HttpStatusCodes.NOT_FOUND);
        });

        it('updates entity mapped from request and stores in the repository', () => {
            entityMapper.mapRequestToEntity.returns(entityStub);

            getController().update(requestStub, responseStub);

            expect(entityCrudRepositoryStub.update).to.have.been.calledWith(entityStub);
        });

        it('responds with CREATED http status when operation succeeded', () => {
            getController().update(requestStub, responseStub);
            
            expect(responseStub.sendStatus).to.have.been.calledWith(HttpStatusCodes.CREATED);
        });
    });

    describe('::delete', () => {
        it('deletes entity from the repository based on entity _id request param', () => {
            const expectedId = 123;
            requestStub.params = { _id: expectedId };
            entityMapper
                .mapRequestToEntityId
                .withArgs(requestStub)
                .returns(expectedId);

            getController().delete(requestStub, responseStub);

            expect(entityCrudRepositoryStub.delete).to.have.been.calledWith(expectedId);
        });

        it('responds with NO_CONTENT http status when operation succeeded', () => {
            requestStub.params = { _id: 1 };

            getController().delete(requestStub, responseStub);
            
            expect(responseStub.sendStatus).to.have.been.calledWith(HttpStatusCodes.NO_CONTENT);            
        });
    });

    xdescribe('::get', () => {
        it('gets client by id from the repository', () => {
            const expectedID = 1;
            requestStub.params = { _id: expectedID };
            const storedClient = new Client();

            entityCrudRepositoryStub
                .getById
                .returns(storedClient);

            getController().get(requestStub, responseStub);

            expect(entityCrudRepositoryStub.getById).to.have.been.calledWith(expectedID);
        });

        it('responds with json data mapped from client object returned by repository', () => {
            requestStub.params = { _id: 12 };
            const storedClient = new Client();
            storedClient._id = 1;
            storedClient.id = 'client_a';
            storedClient.secret = 'secret pass';
            storedClient.redirectUrl = 'http://url';

            entityCrudRepositoryStub
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

            entityCrudRepositoryStub
                .getById
                .returns(storedClient);

            getController().get(requestStub, responseStub);

            expect(responseStub.status).to.have.been.calledWith(HttpStatusCodes.OK);            
        });
    });
});