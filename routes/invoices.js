const express = require("express");
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")


router.get("/", async function(req, res, next) {
    try {
      const results = await db.query("SELECT id,comp_code FROM invoices")
      return res.json({ "invoices": results.rows });
      
    } catch(err){
      return next(err)
    }
  });

  router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        const result = await db.query(`SELECT i.id,i.comp_code,i.amt,i.paid,i.add_date,i.paid_date,c.name,c.description
         FROM invoices AS i INNER JOIN companies AS c ON i.comp_code = c.code WHERE id = $1`, [id])
        if (result.rows.length === 0) {
            throw new ExpressError('Invoice not found',404);
        }
        const data = result.rows[0];
        const invoice = {
            id: data.id, company: { code: data.comp_code, name: data.name, description: data.description },
            amt: data.amt, paid: data.paid, add_date: data.add_date, paid_date: data.paid_date,
        };
        return res.json({ 'Invoice': invoice })
    
    } catch (error) {
        return next(error);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let {comp_code, amt} = req.body;
        
        const result = await db.query(
            `INSERT into companies
            (comp_code, amt) VALUES ($1,$2) RETURNING id,comp_code, amt,paid,add_date,paid_date`, [comp_code,amt])
        return res.json({ "invoice": result.rows[0] })
    } catch (error) {
        return next(error);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let { amt, paid } = req.body;
        let id = req.params.id;
        let paidDate = null;
        
        const datePaid = await db.query(`SELECT paid from invoices WHERE id=$1`, [id]);

        if (result.rows.length === 0) {
            throw new ExpressError('Invoice not found',404);
        }   
        const didPayDate = datePaid.rows[0].paid_date;
        if (!didPayDate && paid) {
            paidDate = new Date();
        } else if(!paid){
            paidDate = null;
        } else {
            paidDate = didPayDate;
        }            
        const result = await db.query(`UPDATE invoices SET amt=$1,paid=$2,paid_date=$3,add_date=$4 WHERE id=$5 RETURNING id,comp_code,amt,paid,add_date,paid_date`,
            [amt,paid,paid_date,id,add_date])        
        return res.json({ 'Invoice': result.rows[0] })    
    } catch (error) {
        return next(error);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        const companyQuery = await db.query('DELETE from invoices WHERE id=$1', [id])
        if (companyQuery.rows.length === 0) {
            throw new ExpressError('Company not found', 404);
        }
        return res.json({ msg: 'Invoice Deleted!' })
    
    } catch (error) {
        return next(error);
    }
});

module.exports = router;