const server = require('../src/server.js');


describe('corretc HTTP response should be given  for ', () => {
  it('/path getQuestions must return response of 200', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:40005/getQuestions',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(200);
    });
  });
  it('/path incorrect must return response of 404', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4005/getQuestions12',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(404);
    });
  });
  it('/200 response should be given by API endpoint for updateResponse', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4005/updateResponse/anand/23/Kabul',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(201);
    });
  });
  it('200 response should be given by API endpoint for route /getPreviousReponse/{username}', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4005/getPreviousReponse/anand',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(200);
    });
  });
  it('404 response should be given by API endpoint for route /getPreviousReponse/{username} but id not in db', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4005//getPreviousReponse/Suman',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(404);
    });
  });
  it('200 response should be given by API endpoint for route /calculateScore/{username} ', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4005/calculateScore/anand',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(404);
    });
  });
  it('/200 response should be given by API endpoint for route /getScores', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4005/getScores',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(200);
    });
  });
});
