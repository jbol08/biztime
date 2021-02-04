const request = require("supertest");
const { createData } = require("../_test-sql");
const app = require("../app");
const db = require("../db");



beforeEach(createData);

afterEach(async () => {
    await db.query(`DELETE FROM invoices`)
});

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
        const res = await request(app).post('/invoices').send({ amt: 1000, comp_code: 'BillyBob' });
        expect(res.body).toEqual({
            'invoice': { id: 3, comp_code: 'BillyBob', amt: 1000, add_date: expect.any(String), paid: false, paid_date: null, }
        })
    });
});
  
  describe("PUT /", () => {
      test("Updates a single invoice", async () => {
          const res = await request(app).patch('/invoices/1').send({ amt: 1, paid: false });
          expect(res.body).toEqual({
              'invoice': { id: 1, comp_code: 'apple', amt: 1, paid: false, add_date: expect.any(String), paid_date: null }
          });
      });
    test("Responds with 404 for invalid id", async () => {
      const res = await request(app).patch('/invoice/5').send({ comp_code: 'BillyBob'});
      expect(res.statusCode).toBe(404);
    })
  })
describe("DELETE /", () => {
    test("Deletes a single invoice", async () => {
        const res = await request(app).delete('/invoices/1');
      
        expect(res.body).toEqual({ 'msg': 'DELETED!' })
    });
});
  
  