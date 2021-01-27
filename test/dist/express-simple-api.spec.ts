import app from './express-simple-api';
import { Server } from 'http';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('Dist Expresss Simple API', () => {
  let server: Server | null = null;
  before((done) => {
    server = app.listen(3000);
    done();
  });
  after((done) => {
    server.close();
    done();
  });

  it('test1', (done) => {
    chai
      .request(server)
      .get('/api/v1-0-0/testget1')
      .end((err, res) => {
        expect(res.body).to.deep.equal([
          'middle1 1.0.0',
          'middletestget1 1.0.0',
          'testget1 1.0.0',
        ]);
        done();
      });
  });

  it('test2', (done) => {
    chai
      .request(server)
      .get('/api/v1-0-1/testget1')
      .end((err, res) => {
        expect(res.body).to.deep.equal([
          'middletestget1 1.0.0',
          'middle1 1.0.1',
          'middle2 1.0.1',
          'middle3 1.0.1',
          'testget1 1.0.1',
        ]);
        done();
      });
  });

  it('test3', (done) => {
    chai
      .request(server)
      .get('/api/v1-0-0/testget2')
      .end((err, res) => {
        expect(res.body).to.deep.equal([
          'middle1 1.0.0',
          'middletestget2 1.0.0',
          'testget2 1.0.0',
        ]);
        done();
      });
  });
});
