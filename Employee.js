const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await db.collection('employees').find().toArray();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle employee verification status
router.patch('/:id/toggle-verification', async (req, res) => {
  try {
    const employee = await db.collection('employees').findOne({ _id: ObjectId(req.params.id) });

    if (employee) {
      const updatedEmployee = await db.collection('employees').updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { verified: !employee.verified } }
      );

      if (updatedEmployee.modifiedCount > 0) {
        res.json({ _id: req.params.id, verified: !employee.verified });
      } else {
        res.status(500).json({ message: 'Error updating employee verification status' });
      }
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
