import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  empSalary: '',
  empGender: 'Male', 
  empBirthdate: '',
  depId: ''
};

const CreatePage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('http://localhost:9999/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.lastName || !formData.lastName.trim()) {
      tempErrors.lastName = 'Last Name (Họ) is required and cannot be empty.';
    }
    
    if (!formData.firstName || !formData.firstName.trim()) {
      tempErrors.firstName = 'First Name (Tên) is required and cannot be empty.';
    }
    
    if (!formData.empSalary) {
      tempErrors.empSalary = 'Salary (Mức lương) is required.';
    } else if (Number(formData.empSalary) <= 0) {
      tempErrors.empSalary = 'Salary must be a positive number greater than 0.';
    }
    
    if(!formData.empBirthdate) {
      tempErrors.empBirthdate = 'Birth date is required.'
    }

    if (!formData.depId) {
      tempErrors.depId = 'Please select a Department (Phòng ban).';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return; 

    const newEmployee = {
      empName: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim()
      },
      empSalary: Number(formData.empSalary),
      empGender: formData.empGender,
      empBirthdate: formData.empBirthdate,
      depId: Number(formData.depId), 
      supervisorId: null,            
      dependents: []                 
    };

    try {
      await axios.post('http://localhost:9999/employees', newEmployee);
      alert('Employee created successfully!');
      navigate('/'); 
    } catch (error) {
      console.error('Error saving new employee:', error);
      alert('Failed to save employee. Please try again.');
    }
  };

  return (
    <Container className='p-4' style={{width:'700px'}}>
          <h3 className="text-center pb-2">Create New Employee</h3>
          <Form onSubmit={handleSubmit}>
            
              <Form.Group controlId="formLastName" className='pb-3'>
                <Form.Label className="fw-semibold">Last Name (Họ)</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formFirstName" className='pb-3'>
                <Form.Label className="fw-semibold">First Name (Tên)</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formSalary" className='pb-3'>
                <Form.Label className="fw-semibold">Salary (Mức lương)</Form.Label>
                <Form.Control
                  type="number"
                  name="empSalary"
                  value={formData.empSalary}
                  onChange={handleChange}
                  isInvalid={!!errors.empSalary}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.empSalary}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formGender" className='pb-3'>
                <Form.Label className="fw-semibold">Gender (Giới tính)</Form.Label>
                <Form.Select
                  name="empGender"
                  value={formData.empGender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formBirthdate" className='pb-3'>
                <Form.Label className="fw-semibold">Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  name="empBirthdate"
                  value={formData.empBirthdate}
                  onChange={handleChange}
                  isInvalid={!!errors.empBirthdate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.empBirthdate}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDepartment" className='pb-3'>
                <Form.Label className="fw-semibold">Department (Phòng ban)</Form.Label>
                <Form.Select
                  name="depId"
                  value={formData.depId}
                  onChange={handleChange}
                  isInvalid={!!errors.depId}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.depName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.depId}
                </Form.Control.Feedback>
              </Form.Group>


            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button 
                variant="secondary" 
                type="button" 
                onClick={() => navigate('/')}
                className="px-4 w-50"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="px-4 w-50"
              >
                Save
              </Button>
            </div>

          </Form>
    </Container>
  );
};

export default CreatePage;