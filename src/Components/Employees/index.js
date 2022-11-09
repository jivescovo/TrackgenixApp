import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './employees.module.css';
import Table from '../Shared/Table/index';
import Modal from '../Shared/Modal';
import Button from '../Shared/Button';

function Employees() {
  const history = useHistory();
  const [employees, saveEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState();
  const [showModal, setShowModal] = useState(false);
  const values = ['name', 'lastName', 'phone', 'email'];
  const headers = ['Name', 'Last Name', 'Phone', 'Email'];

  useEffect(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/employees`);
      const data = await response.json();
      saveEmployees(data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteEmployee = async () => {
    const id = employeeId;
    await fetch(`${process.env.REACT_APP_API_URL}/employees/${id}`, {
      method: 'DELETE'
    });
    saveEmployees([...employees.filter((employee) => employee._id !== id)]);
  };

  const onDelete = (id, showModal) => {
    setEmployeeId(id);
    setShowModal(showModal);
  };

  const onRowClick = (id) => {
    history.push(`/employees/form/${id}`);
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Employees</h1>
        <Table
          data={employees}
          headers={headers}
          values={values}
          onDelete={onDelete}
          onRowClick={onRowClick}
        />
        <Modal
          isOpen={showModal}
          handleClose={setShowModal}
          isActionModal={true}
          action={deleteEmployee}
          actionButton="Delete"
        >
          <div>
            <h4>Delete employee</h4>
            <p>Are you sure you want to delete this employee?</p>
            <p>Changes cannot be undone.</p>
          </div>
        </Modal>
        <Button
          text="Add Employee"
          type="submit"
          variant="primary"
          onClick={() => {
            history.push(`/employees/form`);
          }}
        />
      </div>
    </>
  );
}

export default Employees;
