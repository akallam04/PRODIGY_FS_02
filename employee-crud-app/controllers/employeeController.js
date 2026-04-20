const Employee = require('../models/Employee');

exports.getEmployees = async (req, res) => {
  try {
    const { search, department, sort, order } = req.query;
    const query = {};

    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [{ name: re }, { email: re }, { position: re }];
    }
    if (department) query.department = department;

    const sortField = ['name', 'salary', 'hireDate'].includes(sort) ? sort : 'name';
    const sortDir = order === 'desc' ? -1 : 1;

    const employees = await Employee.find(query).sort({ [sortField]: sortDir });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, position, department, salary, phone, hireDate } = req.body;
    if (!name || !email || !position || !department || salary === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (salary < 0) {
      return res.status(400).json({ success: false, message: 'Salary cannot be negative' });
    }
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const employee = await Employee.create({ name, email, position, department, salary, phone, hireDate });
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    if (req.body.salary !== undefined && req.body.salary < 0) {
      return res.status(400).json({ success: false, message: 'Salary cannot be negative' });
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const departmentBreakdown = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { department: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    const avgResult = await Employee.aggregate([
      { $group: { _id: null, avg: { $avg: '$salary' } } },
    ]);
    const averageSalary = avgResult.length ? Math.round(avgResult[0].avg) : 0;

    const highestPaidDoc = await Employee.findOne().sort({ salary: -1 }).select('name salary');
    const newestHireDoc = await Employee.findOne().sort({ hireDate: -1 }).select('name hireDate');

    res.json({
      success: true,
      data: {
        totalEmployees,
        departmentBreakdown,
        averageSalary,
        highestPaid: highestPaidDoc
          ? { name: highestPaidDoc.name, salary: highestPaidDoc.salary }
          : null,
        newestHire: newestHireDoc
          ? { name: newestHireDoc.name, hireDate: newestHireDoc.hireDate }
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
