const Employee = require('../models/singup');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { s3, bucketName } = require('../config/awsconfig'); // Import AWS S3 config

// Utility to upload file to S3
const uploadToS3 = (file) => {
  const fileContent = fs.readFileSync(file.path);
  const key = `employees/${Date.now()}_${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  return s3.upload(params).promise();
};

// Create Employee with optional image upload
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;

    let imageUrl = '';
    if (req.file) {
      const result = await uploadToS3(req.file);
      imageUrl = result.Location; // Public URL from S3
    }

    const newEmployee = new Employee({
      employeeId: uuidv4(),
      profileImage: imageUrl,
      name,
      email,
      mobile,
      designation,
      gender,
      course
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Employees with search
exports.getEmployees = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ]
        }
      : {};

    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee with optional new image
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    let imageUrl = req.body.image; // fallback to old image

    if (req.file) {
      const result = await uploadToS3(req.file);
      imageUrl = result.Location;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { ...req.body, profileImage: imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
