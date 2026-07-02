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

router.get('/', listBills);
router.get('/summary', getSummary);
router.get('/:id', getBill);
router.post('/', createBill);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);

module.exports = router;
