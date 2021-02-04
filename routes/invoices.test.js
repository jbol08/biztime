const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { createData } = require("../_test-sql");


beforeEach(createData);

afterAll(async () => {
    await db.end()
})

describe("GET /", () => {
    test("Get a list of invoices", async () => {
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            'invoices': [
                { id: 1, comp_code: 'apple' },
                { id: 2, comp_code: 'ibm' },
            ]
        })
    });
});
  
   
describe("POST /", () => {
    test("Creates a single invoice", async () => {
        const res = await request(app).post('/invoices').send({ amt: 1000, comp_code: 'billybob' });
        expect(res.body).toEqual({
            'invoice': { id: 4, comp_code: 'billybob', amt: 1000, add_date: expect.any(String), paid: false, paid_date: null, }
        })
    });
});
  
describe("PUT /", () => {
    test("Updates a single invoice", async () => {
        const res = await request(app).put('/invoices/1').send({ amt: 1, paid: false });
        expect(res.body).toEqual({
              'invoice': { id: 1, comp_code: 'apple', amt: 1, paid: false, add_date: expect.any(String), paid_date: null }
          });
      });
    test("Responds with 404 for invalid id", async () => {
      const res = await request(app).put('/invoice/51').send({ comp_code: 'BillyBob'});
      expect(res.statusCode).toBe(404);
    })
  })
describe("DELETE /", () => {
    test("Deletes a single invoice", async () => {
        const res = await request(app).delete('/invoices/1');
      
        expect(res.body).toStrictEqual({ 'status': 'Deleted!' })
    });
});
  
  