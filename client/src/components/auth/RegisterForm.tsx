import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { InputChange, FormSubmit } from '../../utils/TypeScript';
import { register } from '../../redux/actions/authAction';

const RegisterForm = () => {
  const initialState = {
    name: '',
    account: '',
    password: '',
    cf_password: '',
  };
  const [userRegister, setUserRegister] = useState(initialState);
  const { name, account, password, cf_password } = userRegister;

  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  const dispatch = useDispatch();

  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target;
    setUserRegister({ ...userRegister, [name]: value });
  };

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    dispatch(register(userRegister));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label htmlFor="name" className="form-label">
          Імя
        </label>

        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={name}
          onChange={handleChangeInput}
          placeholder="Імя може мати максимум 20 символів"
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="account" className="form-label">
          Електронна скринька
        </label>

        <input
          type="text"
          className="form-control"
          id="account"
          name="account"
          value={account}
          onChange={handleChangeInput}
          placeholder="example@gmail.com"
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">
          Пароль
        </label>

        <div className="pass">
          <input
            type={typePass ? 'text' : 'password'}
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={handleChangeInput}
            placeholder="Пароль має мати мінімум 6 символів."
          />

          <small onClick={() => setTypePass(!typePass)}>
            {typePass ? 'Сховати' : 'Показати'}
          </small>
        </div>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">
          Підтвердіть пароль
        </label>

        <div className="pass">
          <input
            type={typeCfPass ? 'text' : 'password'}
            className="form-control"
            id="cf_password"
            name="cf_password"
            value={cf_password}
            onChange={handleChangeInput}
            placeholder="Підтвердження паролю."
          />

          <small onClick={() => setTypeCfPass(!typeCfPass)}>
            {typeCfPass ? 'Сховати' : 'Показати'}
          </small>
        </div>
      </div>

      <button type="submit" className="btn btn-dark w-100 my-1">
        Зареєструватись
      </button>
    </form>
  );
};

export default RegisterForm;
