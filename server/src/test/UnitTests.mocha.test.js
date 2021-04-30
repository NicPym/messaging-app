const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const path = require("path");
const root = require("../util/root");
const server = require(path.join(root, "src", "index"));

chai.use(chaiHttp);
process.env.NODE_ENV = "dev";

//TODO add tests for all end points
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let token = "";
describe("[Unit Tests] - Test Endpoints", () => {
  it("/ Route Is Running", (done) => {
    chai
      .request(server)
      .get("/tr")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal("[testRoutes.js] Hello From The API");
        done();
      });
  });
});
