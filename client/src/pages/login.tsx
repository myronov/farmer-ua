import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPass from '../components/auth/LoginPass';
import SocialLogin from '../components/auth/SocialLogin';

import { RootStore } from '../utils/TypeScript';

const Login = () => {
  const history = useHistory();

  const { auth } = useSelector((state: RootStore) => state);

  useEffect(() => {
    if (auth.access_token) {
      let url = history.location.search.replace('?', '/');
      return history.push(url);
    }
  }, [auth.access_token, history]);

  return (
    <div className="auth_page">
      <div className="auth_box">
        <h3 className="text-uppercase text-center mb-4">Увійти</h3>

        <SocialLogin />

        <LoginPass />

        <small className="row my-2 text-primary" style={{ cursor: 'pointer' }}>
          <span className="col-6">
            <Link to="/forgot_password">Забули пароль?</Link>
          </span>
        </small>

        <p>
          {`Не маєте акаунту? `}
          <Link
            to={`/register${history.location.search}`}
            style={{ color: 'teal' }}
          >
            Зареєструватись
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
