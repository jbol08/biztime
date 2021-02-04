const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { createData } = require("../_test-sql");


beforeEach(createData);

afterEach(async () => {
    await db.query(`DELETE FROM companies`)
});

afterAll(async () => {
    await db.end()
})

describe("GET /", () => {
    test("Get an array of companies", async () => {
      const res = await request(app).get('/companies');
      expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            'companies': [
            { code: 'apple', name: 'Apple' },
            { code:'ibm', name:'IBM' },
      ]})
    })
  })
  
  
  
describe("POST /", () => {
    test("add a company", async () => {
        const res = await request(app).post('/companies').send({ name: 'BillyBob', description: 'beds' });
        expect(res.body).toEqual({
            'company': { code: 'billybob', name: 'BillyBob', description: 'beds' }
        }
        );
    });
});

  
describe("PUT /", () => {
    test("Updates a single company", async () => {
        const res = await request(app).put('/companies/apple').send({ name: 'Applenew', description: 'update' });
        expect(res.body).toEqual({
            'company': { code: 'apple', name: 'Applenew', description: 'update' }
            }
        );
    });
    test("Responds with 404 because company name doesnt exist ", async () => {
        const res = await request(app).patch('/companies/eight').send({ name: 'eight' });
        expect(res.statusCode).toBe(404);
    });
});
  describe("DELETE /", () => {
    test("Deletes a single user", async () => {
      const res = await request(app).delete('/companies/apple');
      expect(res.body).toStrictEqual({ 'msg': 'Company Deleted!' })
    })
  })
  
  
