const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createEmployee = async (req, res) => {
  const { firstName, lastName, email, position, salary } = req.body;
  try {
    const newEmployee = new Employee({ firstName, lastName, email, position, salary });
    await newEmployee.save();
    res.json(newEmployee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await Employee.findByIdAndDelete(id);
    res.json({ msg: 'Employee deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
