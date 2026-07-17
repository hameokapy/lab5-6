import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table, Card } from 'react-bootstrap';

const ListPage = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workons, setWorkons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepts, setSelectedDepts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes, projRes, workonRes] = await Promise.all([
          axios.get('http://localhost:9999/employees'),
          axios.get('http://localhost:9999/departments'),
          axios.get('http://localhost:9999/projects'),
          axios.get('http://localhost:9999/workons')
        ]);

        const sortedEmployees = empRes.data.sort((a, b) => b.empSalary - a.empSalary);

        setEmployees(sortedEmployees);
        setDepartments(deptRes.data);
        setProjects(projRes.data);
        setWorkons(workonRes.data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeptCheckboxChange = (deptId) => {
    setSelectedDepts((prevSelected) => {
      if (prevSelected.includes(deptId)) {
        return prevSelected.filter((id) => id !== deptId);
      } else {
        return [...prevSelected, deptId];
      }
    });
  };

  const handleDelete = async (empId) => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:9999/employees/${empId}`);
        setEmployees((prev) => prev.filter((emp) => emp.id !== empId));
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.empName.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empName.firstName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDepts.length === 0 ||
      selectedDepts.includes(emp.depId.toString());

    return matchesSearch && matchesDept;
  });

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4 text-center">
        <Col>
          <h1 className="fw-bold">EMPLOYEE MANAGEMENT SYSTEM</h1>
        </Col>
      </Row>

      <Row>
        <Col md={2}>
          <Card className="p-3 mb-4 border-0">
            <Card.Title className="border-bottom pb-2 mb-3 fw-semibold">
              Department
            </Card.Title>
            <Form>
              {departments.map((dept) => (
                <Form.Check
                  key={dept.id}
                  type="checkbox"
                  id={`dept-${dept.id}`}
                  label={dept.depName}
                  checked={selectedDepts.includes(dept.id.toString())}
                  onChange={() => handleDeptCheckboxChange(dept.id.toString())}
                  className="mb-2"
                />
              ))}
            </Form>
          </Card>
        </Col>

        <Col md={10}>
          <Row className="mb-4 ">
            <Col>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm nhân viên theo họ tên"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2"
              />
            </Col>
            <Col className="text-end mt-2 mt-md-0" xs='auto'>
              <Button
                variant="primary"
                onClick={() => navigate('/employee/create')}
                className="py-2 fw-semibold"
              >
                Create Employee
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
            <div className='rounded-3 overflow-hidden'>
              <Table hover responsive className="align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Salary</th>
                    <th>Gender</th>
                    <th>Department</th>
                    <th>Dependents</th>
                    <th>Project (Total Hours)</th>
                    <th className="text-center" style={{width:'200px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => {
                    const dept = departments.find(
                      (d) => d.id.toString() === emp.depId.toString()
                    );
                    const deptName = dept ? dept.depName : 'N/A';

                    const empWorkons = workons.filter(
                      (w) => w.empId.toString() === emp.id.toString()
                    );
                    const projectDetails = empWorkons
                      .map((w) => {
                        const proj = projects.find(
                          (p) => p.id.toString() === w.proId.toString()
                        );
                        const projName = proj ? proj.proName : 'Unknown';
                        return `${projName} (${w.workHours} giờ)`;
                      })
                      .join('; ');

                    return (
                      <tr key={emp.id}>
                        <td>{emp.id}</td>
                        <td>{`${emp.empName.lastName} ${emp.empName.firstName}`}</td>
                        <td>{emp.empSalary?.toLocaleString('vi-VN')} VND</td>
                        <td>{emp.empGender}</td>
                        <td>{deptName}</td>
                        <td>{emp.dependents ? emp.dependents.length : 0} người</td>
                        <td>{projectDetails || 'Has not participated'}</td>
                        <td className="text-center">
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2 text-white fw-semibold"
                          >
                            Detail
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(emp.id)}
                            className="fw-semibold"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No employees found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ListPage;