import InputField from '../../components/InputField';
import { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import s from '../Login-SignUp.module.scss';
import { firebase } from '../../lib/firebase';
import * as FirebaseService from '../../services/firebase';

const SignUp = ({ history, currentUsername }) => {
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Sign Up - Instagram';
  }, []);

  useEffect(() => {
    if (currentUsername) history.push('/');
  }, [currentUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isUserNameExist = await FirebaseService.checkIsUserNameExist(
      userName
    );
    const isEmailExist = await FirebaseService.checkIsEmailExist(email);

    if (!isUserNameExist && !isEmailExist) {
      try {
        const userCreated = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        firebase.firestore().collection('users').add({
          dateCreated: Date.now(),
          emailAddress: email,
          followers: [],
          following: [],
          fullName,
          userId: userCreated.user.uid,
          username: userName,
          photo: '/images/avatars/default.png',
        });

        history.push(ROUTES.DASHBOARD);
      } catch (error) {
        setError(error.message);
      }
    } else {
      if (isUserNameExist) {
        setError(
          'User with this username is already exists. Please choose another one.'
        );
      } else if (isEmailExist) {
        setError(
          'User with this email address is already exists. Please Log In or choose another email address.'
        );
      }
    }
  };

  const [fields] = useState(() => [
    {
      className: s.form__input,
      type: 'text',
      placeholder: 'Username',
      'aria-label': 'Enter your username here',
      value: userName,
      onChange(e) {
        setUserName(e.target.value.toLowerCase());
      },
    },
    {
      className: s.form__input,
      type: 'text',
      placeholder: 'Full name',
      'aria-label': 'Enter your full name here',
      value: fullName,
      onChange(e) {
        setFullName(e.target.value);
      },
    },
    {
      className: s.form__input,
      type: 'email',
      placeholder: 'Email address',
      'aria-label': 'Enter your email address here',
      value: email,
      onChange(e) {
        setEmail(e.target.value.toLowerCase());
      },
    },
    {
      className: s.form__input,
      type: 'password',
      placeholder: 'Password',
      'aria-label': 'Enter your password here',
      value: password,
      onChange(e) {
        setPassword(e.target.value);
      },
    },
    {
      className: s.form__input,
      type: 'password',
      placeholder: 'Repeat password',
      'aria-label': 'Please repeat password',
      value: repeatPassword,
      onChange(e) {
        setRepeatPassword(e.target.value);
      },
    },
  ]);

  useEffect(() => {
    document.title = 'Sign Up - Instagram';
  }, []);

  useEffect(() => {
    setError('');
    if (
      fields.every((field) => field.value.length >= 4) &&
      password === repeatPassword &&
      /^.+@.+$/.test(email)
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [userName, fullName, email, password, repeatPassword, fields]);

  return (
    <main className={`container ${s.container}`}>
      <div className={s.wrapper}>
        <div className={s.phoneImage}>
          <img
            className={s.phoneImage__image}
            alt=""
            src="./images/iphone-with-profile.jpg"
          />
        </div>
        <section className={s.content}>
          <div className={s.content__fields}>
            <div className={s.content__logo}>
              <img alt="Instagram" src="./images/logo.png" />
            </div>
            {error && <p className={s.error}>{error}</p>}
            <form
              className={`${s.content__form} ${s.form}`}
              onSubmit={handleSubmit}
              method="POST"
            >
              {fields.map((field) => (
                <InputField key={field.placeholder} {...field} />
              ))}

              <button className={s.form__button} disabled={!isValid}>
                Sign Up
              </button>
            </form>
          </div>
          <section className={s.content__other}>
            <p>
              Have an account?
              <Link to={ROUTES.LOGIN} className={s.content__link}>
                Log In
              </Link>
            </p>
          </section>
        </section>
      </div>
    </main>
  );
};

export default withRouter(SignUp);
