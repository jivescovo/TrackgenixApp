import Layout from 'Components/Layout';
import React, { lazy } from 'react';
import { useRouteMatch, Redirect, Route, Switch } from 'react-router-dom';
const Admins = lazy(() => import('Components/Admins'));
const Employees = lazy(() => import('Components/Employees'));
const EmployeeForm = lazy(() => import('Components/Employees/Form'));
const Projects = lazy(() => import('Components/Projects/index'));
const ProjectsForm = lazy(() => import('Components/Projects/Form/index'));
const Tasks = lazy(() => import('Components/Tasks/index'));
const TasksForm = lazy(() => import('Components/Tasks/Form/index'));
const TimeSheets = lazy(() => import('Components/TimeSheets'));
const TimeSheetsForm = lazy(() => import('Components/TimeSheets/Form'));

const routes = [
  { name: 'Home', path: '/admins' },
  { name: 'Employees', path: '/admins/employees' },
  { name: 'Projects', path: '/admins/projects' },
  { name: 'Tasks', path: '/admins/tasks' },
  { name: 'Timesheets', path: '/admins/time-sheets' }
];
const AdminsRouter = () => {
  const { url } = useRouteMatch();
  return (
    <Layout routes={routes}>
      <Switch>
        <Route exact path={`${url}/`} component={Admins} />
        <Route exact path={`${url}/employees`} component={Employees} />
        <Route path={`${url}/employees/form/:id`} component={EmployeeForm} />
        <Route exact path={`${url}/admins/projects`} component={Projects} />
        <Route exact path={`${url}/admins/projects/form`} component={ProjectsForm} />
        <Route path={`${url}/admins/projects/form/:id`} component={ProjectsForm} />
        <Route exact path={`${url}/admins/tasks`} component={Tasks} />
        <Route exact path={`${url}/admins/tasks/form`} component={TasksForm} />
        <Route path={`${url}/admins/tasks/form/:id`} component={TasksForm} />
        <Route exact path={`${url}/admins/time-sheets`} component={TimeSheets} />
        <Route exact path={`${url}/admins/time-sheets/form`} component={TimeSheetsForm} />
        <Route path={`${url}/admins/time-sheets/form/:id`} component={TimeSheetsForm} />
        <Redirect to={`${url}/`} />
      </Switch>
    </Layout>
  );
};

export default AdminsRouter;
