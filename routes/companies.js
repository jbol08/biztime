const express = require("express");
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")
const slugify = require("slugify");


router.get("/", async function(req, res, next) {
    try {
      const companiesQuery = await db.query("SELECT code,name FROM companies")
      return res.json({ "companies": companiesQuery.rows });
      
    } catch(err){
      return next(err)
    }
  });
  
router.get('/:code', async function (req, res, next) {
    try {
        let code = req.params.code;
        const companyQuery = await db.query('SELECT code,name,description FROM companies WHERE code = $1', [code])
        if (companyQuery.rows.length === 0) {
            throw new ExpressError('Company not found', 404);
            
        }
        return res.json({ 'company': companyQuery.rows[0] })
        
    } catch (error) {
        return next(error);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let { name, description } = req.body;
        let code = slugify(name,{lower: true});

        const companyQuery = await db.query(
            `INSERT into companies
            (code,name,description) VALUES ($1,$2,3) RETURNING code, name,description`, [code,name,description])
        return res.json({ "company": companyQuery.rows[0] })
    } catch (error) {
        return next(error);
    }
});

router.put('/:code', async function (req, res, next) {
    try {
        let { name, description } = req.body;
        let code = req.params.code;
        const companyQuery = await db.query(`UPDATE companies SET name=$1, description=$2, WHERE code=$3 
        RETURNING name,description,code`, [name, description, code])
        if (companyQuery.rows.length === 0) {
            throw new ExpressError('Company not found', 404);
        }
        return res.json({ 'Company': companyQuery.rows[0] })
        
    } catch (error) {
        return next(error);
    }
});

router.delete('/:code', async function (req, res, next) {
    try {
        let code = req.params.code;
        const companyQuery = await db.query(`DELETE from companies WHERE code=$1 RETURNING code`, [code])
        if (companyQuery.rows.length === 0) {
            throw new ExpressError('Company not found', 404);
        }
        return res.json({ 'message': 'Company Deleted' })
        
    } catch (error) {
        return next(error);
    }
});

module.exports = router;