import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import s from './Login.module.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const handleSubmit = () => {};

  useEffect(() => {
    document.title = 'Instagram Login';
  }, []);

  useEffect(() => {
    if (email && password && /^.+@.+$/.test(email) && password.length >= 6) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [email, password]);

  return (
    <main className={`container ${s.container}`}>
      <div className={s.phoneImage}>
        <img
          className={s.phoneImage__image}
          alt=""
          src="./images/iphone-with-profile.jpg"
        />
      </div>
      <section className={s.content}>
        <div className={s.content__logo}>
          <img alt="Instagram" src="./images/logo.png" />
        </div>
        <form
          className={`${s.content__form} ${s.form}`}
          onSubmit={handleSubmit}
          method="POST"
        >
          <input
            className={s.form__input}
            type="text"
            placeholder="Email address"
            aria-label="Enter your email address here"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
          <input
            className={s.form__input}
            type="password"
            placeholder="Password"
            aria-label="Enter your password here"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />

          <button className={s.form__button} disabled={!isValid}>
            Login
          </button>
        </form>

        <section className={s.content__signUp}>
          <p>
            Don't have an account?
            <Link to="/sign-up" className={s.content__link}>
              Sign Up
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
};

export default Login;
