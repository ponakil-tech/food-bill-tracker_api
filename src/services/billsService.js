const billsRepository = require('../repository/billsRepository');

async function listBills() {
  return billsRepository.findAll();
}

async function getBillById(id) {
  return billsRepository.findById(id);
}

async function createBill(data) {
  return billsRepository.create(data);
}

async function updateBill(id, data) {
  return billsRepository.update(id, data);
}

async function deleteBill(id) {
  return billsRepository.remove(id);
}

async function getSummary() {
  return billsRepository.summaryByCategory();
}

module.exports = { listBills, getBillById, createBill, updateBill, deleteBill, getSummary };
