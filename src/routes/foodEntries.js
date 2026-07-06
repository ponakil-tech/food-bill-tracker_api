const express = require('express');
const router = express.Router();
const {
  listEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} = require('../controllers/foodEntriesController');

/**
 * @swagger
 * components:
 *   schemas:
 *     FoodEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         entry_date:
 *           type: string
 *           format: date
 *         morning_meal:
 *           type: string
 *         morning_price:
 *           type: number
 *         afternoon_meal:
 *           type: string
 *         afternoon_price:
 *           type: number
 *         night_meal:
 *           type: string
 *         night_price:
 *           type: number
 *         total_price:
 *           type: number
 *         notes:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     FoodEntryInput:
 *       type: object
 *       required: [user_id, entry_date]
 *       properties:
 *         user_id:
 *           type: integer
 *         entry_date:
 *           type: string
 *           format: date
 *         morning_meal:
 *           type: string
 *         morning_price:
 *           type: number
 *         afternoon_meal:
 *           type: string
 *         afternoon_price:
 *           type: number
 *         night_meal:
 *           type: string
 *         night_price:
 *           type: number
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: FoodEntries
 *   description: Daily food entry management
 */

/**
 * @swagger
 * /api/food-entries:
 *   get:
 *     summary: List food entries
 *     tags: [FoodEntries]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: entry_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter entries with entry_date >= start_date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter entries with entry_date <= end_date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of food entries within the date range, ordered by created_at desc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FoodEntry'
 *                 total_amount:
 *                   type: number
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *   post:
 *     summary: Create a food entry
 *     tags: [FoodEntries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FoodEntryInput'
 *     responses:
 *       201:
 *         description: Created food entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodEntry'
 *       400:
 *         description: Validation error
 *       409:
 *         description: An entry already exists for this user and date
 */
router.get('/', listEntries);
router.post('/', createEntry);

/**
 * @swagger
 * /api/food-entries/{id}:
 *   get:
 *     summary: Get a food entry by id
 *     tags: [FoodEntries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The food entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodEntry'
 *       404:
 *         description: Food entry not found
 *   put:
 *     summary: Update a food entry
 *     tags: [FoodEntries]
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
 *             $ref: '#/components/schemas/FoodEntryInput'
 *     responses:
 *       200:
 *         description: Updated food entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodEntry'
 *       404:
 *         description: Food entry not found
 *       409:
 *         description: An entry already exists for this user and date
 *   delete:
 *     summary: Delete a food entry
 *     tags: [FoodEntries]
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
 *         description: Food entry not found
 */
router.get('/:id', getEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
