import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import sinon from "ts-sinon";

chai.use(sinonChai);
global.expect = chai.expect;
global.sinon = sinon;
