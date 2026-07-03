const express = require('express');
const router = express.Router();
const {
  listBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
  getSummary,
} = require('../controllers/billsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Bill:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         bill_date:
 *           type: string
 *           format: date
 *         notes:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     BillInput:
 *       type: object
 *       required: [title, amount]
 *       properties:
 *         title:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         bill_date:
 *           type: string
 *           format: date
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Bills
 *   description: Bill management
 */

/**
 * @swagger
 * /api/bills:
 *   get:
 *     summary: List all bills
 *     tags: [Bills]
 *     responses:
 *       200:
 *         description: List of bills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *   post:
 *     summary: Create a bill
 *     tags: [Bills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BillInput'
 *     responses:
 *       201:
 *         description: Created bill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       400:
 *         description: Validation error
 */
router.get('/', listBills);

/**
 * @swagger
 * /api/bills/summary:
 *   get:
 *     summary: Totals grouped by category
 *     tags: [Bills]
 *     responses:
 *       200:
 *         description: Summary of totals per category
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/bills/{id}:
 *   get:
 *     summary: Get a bill by id
 *     tags: [Bills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The bill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Bill not found
 *   put:
 *     summary: Update a bill
 *     tags: [Bills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BillInput'
 *     responses:
 *       200:
 *         description: Updated bill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Bill not found
 *   delete:
 *     summary: Delete a bill
 *     tags: [Bills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Bill not found
 */
router.get('/:id', getBill);
router.post('/', createBill);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);

module.exports = router;
