import { tokenListener } from 'helpers/firebase';
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { getUserProfile } from 'redux/user/thunks';
import Spinner from 'Components/Shared/Spinner';

const AdminsRoutes = lazy(() => import('./admins'));
const SuperAdminsRouter = lazy(() => import('./superAdmins'));
const EmployeeRouter = lazy(() => import('./employees'));
const PrivateRoute = lazy(() => import('./PrivateRoute'));
const AuthRoutes = lazy(() => import('./auth'));
const HomeRouter = lazy(() => import('./home'));

const Routes = () => {
  const authenticated = useSelector((store) => store.auth.logged);
  const dispatch = useDispatch();

  useEffect(() => {
    tokenListener();
  }, []);

  useEffect(() => {
    if (authenticated) {
      dispatch(getUserProfile());
    }
  }, [authenticated]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner isLoading={true} />}>
        <Switch>
          <PrivateRoute path="/admin" role="ADMIN" component={AdminsRoutes} />
          <PrivateRoute path="/super-admin" role="SUPER_ADMIN" component={SuperAdminsRouter} />
          <PrivateRoute path="/employee" role="EMPLOYEE" component={EmployeeRouter} />
          <Route path="/auth" component={AuthRoutes} />
          <Route path="/home" component={HomeRouter} />
          <Redirect to="/home" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
