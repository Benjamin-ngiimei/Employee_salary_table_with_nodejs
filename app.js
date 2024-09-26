// app.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let employees = [];

// Load employees from file
const loadEmployees = () => {
  try {
    const data = fs.readFileSync('employees.json');
    employees = JSON.parse(data);
  } catch (error) {
    employees = [];
  }
};

// Save employees to file
const saveEmployees = () => {
  fs.writeFileSync('employees.json', JSON.stringify(employees, null, 2));
};

loadEmployees();

// Define a route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all employees
app.get('/employees', (req, res) => {
  res.json(employees);
});

// Create a new employee
app.post('/employees', (req, res) => {
  const newEmployee = {
    id: employees.length ? employees[employees.length - 1].id + 1 : 1,
    name: req.body.name,
    department: req.body.department,
    salary: req.body.salary,
    city: req.body.city
  };
  employees.push(newEmployee);
  saveEmployees();
  res.status(201).json(newEmployee);
});

// Update an employee's salary
app.put('/employees/:id', (req, res) => {
  const employee = employees.find(emp => emp.id === parseInt(req.params.id));
  if (!employee) return res.status(404).send('Employee not found');

  employee.salary = req.body.salary;
  saveEmployees();
  res.json(employee);
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
  employees = employees.filter(emp => emp.id !== parseInt(req.params.id));
  saveEmployees();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
