import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './form.module.css';
import Table from '../../Shared/Table';
import Modal from '../../Shared/Modal';
import Button from '../../Shared/Button';
import Select from '../../Shared/Select';
import TextInput from '../../Shared/TextInput/index';
import Spinner from '../../Shared/Spinner/spinner';
import { postProject } from '../../../redux/projects/thunks';

const ProjectForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const [projectEmployees, setProjectEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [nameValue, setNameValue] = useState();
  const [descriptionValue, setDescriptionValue] = useState();
  const [clientValue, setClientValue] = useState();
  const [startDateValue, setStartDateValue] = useState();
  const [endDateValue, setEndDateValue] = useState();
  const [roleValue, setRoleValue] = useState();
  const [rateValue, setRateValue] = useState();
  const [isEditing, setIsEditing] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isActionModal, setIsActionModal] = useState(false);
  const [serverError, setServerError] = useState();
  const roles = ['PM', 'QA', 'DEV', 'TL'];

  const { isLoading } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  const newArr = () => {
    const headers = [];
    projectEmployees.map((employee) => {
      const selectedEmployee = employees.find((item) => item._id === employee.employee);
      if (selectedEmployee) {
        headers.push({
          name: selectedEmployee.name,
          role: employee.role,
          rate: employee.rate,
          _id: employee.employee
        });
      }
    });
    return headers;
  };

  const onRowClick = () => {};

  const onChangeNameInput = (event) => {
    setNameValue(event.target.value);
  };
  const onChangeDescriptionInput = (event) => {
    setDescriptionValue(event.target.value);
  };
  const onChangeClientInput = (event) => {
    setClientValue(event.target.value);
  };
  const onChangeStartDateInput = (event) => {
    setStartDateValue(event.target.value);
  };
  const onChangeEndDateInput = (event) => {
    setEndDateValue(event.target.value);
  };
  const onChangeRateInput = (event) => {
    setRateValue(event.target.value);
  };
  const handleRoleChange = (event) => {
    setRoleValue(event.target.value);
  };
  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const addEmployee = (e) => {
    e.preventDefault();
    setProjectEmployees([
      ...projectEmployees,
      {
        employee: selectedEmployee,
        rate: rateValue,
        role: roleValue
      }
    ]);
  };

  const handleDelete = (index) => {
    const newProjectEmployees = [...projectEmployees];
    newProjectEmployees.splice(index, 1);
    setProjectEmployees(newProjectEmployees);
  };

  const onCancel = () => {
    history.goBack();
  };

  const handleConfirmModal = (e) => {
    e.preventDefault();
    setShowModal(true);
    if (
      projectEmployees.length &&
      nameValue &&
      startDateValue &&
      endDateValue &&
      descriptionValue &&
      clientValue
    ) {
      setIsActionModal(true);
    }
  };

  const getModalContent = () => {
    if (serverError) {
      return (
        <div>
          <h4>Server error</h4>
          <p>{serverError}</p>
        </div>
      );
    }
    if (
      projectEmployees.length &&
      nameValue &&
      startDateValue &&
      endDateValue &&
      descriptionValue &&
      clientValue
    ) {
      return (
        <div>
          <h4>{isEditing ? 'Edit' : 'Add'} New Project</h4>
          <p>
            Are you sure you want to {isEditing ? 'save' : 'add'} {nameValue}{' '}
            {isEditing ? 'changes' : ''}?
          </p>
        </div>
      );
    }
    return (
      <div>
        <h4>Form incomplete</h4>
        <p>Please complete all fields before submit.</p>
      </div>
    );
  };

  const onSubmit = () => {
    const body = JSON.stringify({
      employees: projectEmployees,
      name: nameValue,
      startDate: startDateValue,
      endDate: endDateValue,
      description: descriptionValue,
      clientName: clientValue
    });

    if (isEditing) {
      dispatch(postProject);
      fetch(`${process.env.REACT_APP_API_URL}/projects/${id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: body
      })
        .then((response) => response.json())
        .catch((error) => alert(error));
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      })
        .then((response) => response.json())
        .then((content) => {
          if (!content.error) {
            history.push('/projects');
          } else {
            setServerError(content.message);
            setShowModal(true);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    if (id) {
      fetch(`${process.env.REACT_APP_API_URL}/projects/${id}`)
        .then((response) => response.json())
        .then((response) => {
          if (!response.error) {
            const employeeList = response.data.employees.map((item) => {
              return {
                employee: item.employee,
                role: item.role,
                rate: item.rate
              };
            });
            setNameValue(response.data.name);
            setClientValue(response.data.clientName);
            setStartDateValue(response.data.startDate);
            setEndDateValue(response.data.endDate);
            setDescriptionValue(response.data.description);
            setProjectEmployees(employeeList);
            setIsEditing(true);
          } else {
            setServerError(response.message);
            setShowModal(true);
          }
        })
        .catch((error) => alert(error));
    }
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/employees`)
      .then((response) => response.json())
      .then((content) => {
        if (!content.error) {
          setEmployees(content.data);
        } else {
          setServerError(content.message);
          setShowModal(true);
        }
      })
      .catch((error) => alert(error));
  }, []);

  return (
    <>
      <Spinner isLoading={isLoading} />
      <h1>{isEditing ? 'Edit' : 'Add'} Project</h1>
      <form className={styles.container}>
        <TextInput
          label="Project Name"
          id="name"
          name="name"
          value={nameValue}
          onChange={onChangeNameInput}
          type="text"
          placeholder="Project Name"
        />
        <TextInput
          label="Client Name"
          id="client"
          name="client"
          value={clientValue}
          onChange={onChangeClientInput}
          type="text"
          placeholder="Client Name"
        />
        <TextInput
          label="Description"
          id="description"
          name="description"
          value={descriptionValue}
          onChange={onChangeDescriptionInput}
          type="text"
          placeholder="Description"
        />
        <TextInput
          label="Start date"
          id="startDate"
          name="startDate"
          value={startDateValue}
          onChange={onChangeStartDateInput}
          type="date"
          placeholder="Start date"
        />
        <TextInput
          label="End date"
          id="endDate"
          name="endDate"
          value={endDateValue}
          onChange={onChangeEndDateInput}
          type="date"
          placeholder="End date"
        />
        <div className={styles.listContainer}>
          <div>
            <h4>Employees</h4>
            <div>
              <div className={styles.newEmployeeInputs}>
                <Select
                  name="employees"
                  placeholder="Select an employee"
                  required
                  onSelect={handleEmployeeChange}
                  data={employees.map((employee) => ({
                    id: employee._id,
                    value: employee.name
                  }))}
                />
                <Select
                  name="role"
                  placeholder="Select Role"
                  required
                  onSelect={handleRoleChange}
                  data={roles.map((role) => ({
                    value: role
                  }))}
                />
                <input
                  id="rate"
                  name="rate"
                  value={rateValue}
                  onChange={onChangeRateInput}
                  type="text"
                  placeholder="Rate"
                />
              </div>
              <div className={styles.buttonAssign}>
                <Button text="Assign new employee" variant="secondary" onClick={addEmployee} />
              </div>
            </div>
            <Table
              data={newArr()}
              headers={['name', 'role', 'rate']}
              onDelete={handleDelete}
              onRowClick={onRowClick}
              values={['name', 'role', 'rate']}
            />
          </div>
          <Modal
            isOpen={showModal}
            handleClose={setShowModal}
            isActionModal={isActionModal}
            action={onSubmit}
            actionButton="Submit"
          >
            {getModalContent()}
          </Modal>
          <div className={styles.formButtons}>
            <Button text="Cancel" type="button" variant="secondary" onClick={onCancel} />
            <Button text="Submit" variant="primary" onClick={handleConfirmModal} />
          </div>
        </div>
      </form>
    </>
  );
};

export default ProjectForm;
