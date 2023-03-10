import {
  getEmployeesPending,
  getEmployeesSuccess,
  getEmployeesError,
  deleteEmployeePending,
  deleteEmployeeSuccess,
  deleteEmployeeError,
  postEmployeePending,
  postEmployeeSuccess,
  postEmployeeError,
  putEmployeePending,
  putEmployeeSuccess,
  putEmployeeError
} from './actions';

const getEmployees = () => {
  return (dispatch) => {
    dispatch(getEmployeesPending());
    fetch(`${process.env.REACT_APP_API_URL}/employees`, {
      headers: {
        token: sessionStorage.getItem('token')
      }
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error(response.message);
        } else {
          dispatch(getEmployeesSuccess(response.data));
        }
      })
      .catch((error) => {
        dispatch(getEmployeesError(error.toString()));
      });
  };
};

const deleteEmployee = (employeeId) => {
  return (dispatch) => {
    dispatch(deleteEmployeePending());
    fetch(`${process.env.REACT_APP_API_URL}/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        token: sessionStorage.getItem('token')
      }
    })
      .then(async (response) => {
        const json = response.headers.get('content-type')?.includes('application/json');
        const data = json && (await response.json());
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          throw new Error(error);
        }
        dispatch(deleteEmployeeSuccess(employeeId));
      })
      .catch((error) => {
        dispatch(deleteEmployeeError(error.toString()));
      });
  };
};

const postEmployee = (name, lastName, phone, email, password) => {
  return (dispatch) => {
    dispatch(postEmployeePending());
    return fetch(`${process.env.REACT_APP_API_URL}/employees/`, {
      method: 'POST',
      headers: {
        token: sessionStorage.getItem('token'),
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        lastName: lastName,
        phone: phone,
        email: email,
        password: password
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error(response.message);
        } else {
          return dispatch(postEmployeeSuccess(response.data));
        }
      })
      .catch((error) => {
        return dispatch(postEmployeeError(error.toString()));
      });
  };
};

const putEmployee = (name, lastName, phone, email, employeeId) => {
  return (dispatch) => {
    dispatch(putEmployeePending());
    return fetch(`${process.env.REACT_APP_API_URL}/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        token: sessionStorage.getItem('token'),
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        lastName: lastName,
        phone: phone,
        email: email
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error(response.message);
        } else {
          return dispatch(putEmployeeSuccess(response.data));
        }
      })
      .catch((error) => {
        return dispatch(putEmployeeError(error.toString()));
      });
  };
};

export { getEmployees, deleteEmployee, postEmployee, putEmployee };
