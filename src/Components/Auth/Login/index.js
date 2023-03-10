/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { loginSchema } from 'validations/login';
import { login } from 'redux/auth/thunks';
import { ButtonAdd, Modal, TextInput } from 'Components/Shared';
import styles from './login.module.css';

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(loginSchema),
    mode: 'onBlur'
  });

  const onSubmit = (inputData) => {
    dispatch(login(inputData)).then((data) => {
      switch (data) {
        case 'SUPER_ADMIN':
          history.push('/super-admin');
          break;
        case 'ADMIN':
          history.push('/admin');
          break;
        case 'EMPLOYEE':
          history.push(`/employee`);
          break;
        default:
          history.push('/auth/login');
          break;
      }
    });
  };

  useEffect(() => {
    if (error && !isLoading && getValues('email') && getValues('password')) {
      setShowModal(true);
      if (error === 'auth/user-not-found') {
        setErrorMessage('The entered email is not registered');
      } else if (error === 'auth/wrong-password') {
        setErrorMessage('The entered password is incorrect');
      } else if (error === 'auth/too-many-requests') {
        setErrorMessage('Too many failed attempts. Try again later');
      } else {
        setErrorMessage('An error has occurred. Please try again');
      }
    }
  }, [error, isLoading]);

  return (
    <div className={styles.loginContainer}>
      <Modal isOpen={showModal} handleClose={setShowModal} isActionModal={false}>
        <div className={styles.container}>
          <h2>Error trying to login:</h2>
          {errorMessage}
        </div>
      </Modal>
      <div className={styles.box1}>
        <h1>Trackgenix</h1>
        <p>
          Time tracking software used by millions. Trackgenix is a time tracker and timesheet app
          that lets you track work hours across different projects!
        </p>
      </div>
      <div className={styles.box2}>
        <h4>Login</h4>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formLogin}>
          <TextInput
            className={styles.input}
            label="Email"
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            register={register}
            error={errors.email?.message}
          />
          <TextInput
            className={styles.input}
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors.password?.message}
          />
          <div className={styles.butCont}>
            <ButtonAdd
              text="Cancel"
              type="reset"
              variant="second"
              onClick={() => {
                history.push('/home');
              }}
            />
            <ButtonAdd text="Login" type="submit" variant="main" />
          </div>
          <p>
            Don't have an account?{' '}
            <Link className={styles.link} to="sign-up">
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
