import { firebase } from "../../lib/firebase";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import s from "../Login-SignUp.module.scss";

type Props = {
  currentUsername?: TUser["username"];
};

const Login = ({ currentUsername }: Props) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUsername) history.push("/");
  }, [currentUsername]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          history.push(ROUTES.DASHBOARD);
        })
        .catch((error) => {
          setError(error.message);
        });
    } catch (error) {
      setError(error.message);
    }
  };

  const fields = [
    {
      className: s.form__input,
      type: "email",
      placeholder: "Email address",
      "aria-label": "Enter your email address here",
      value: email,
      onChange(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
      },
    },
    {
      className: s.form__input,
      type: "password",
      placeholder: "Password",
      "aria-label": "Enter your password here",
      value: password,
      onChange(e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
      },
    },
  ];

  useEffect(() => {
    document.title = "Log In - Instagram";
  }, []);

  useEffect(() => {
    setError("");
    if (email && password && password.length >= 4) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [email, password]);

  return (
    <main className={`container ${s.container}`}>
      <div className={s.wrapper}>
        <div className={s.phoneImage}>
          <img
            className={s.phoneImage__image}
            alt=""
            src="/images/iphone-with-profile.jpg"
          />
        </div>
        <section className={s.content}>
          <div className={s.content__fields}>
            <div className={s.content__logo}>
              {/* <img alt="Instagram" src="/images/logo.png" /> */}
              <h2>Fakegram</h2>
            </div>
            {error && <p className={s.error}>{error}</p>}
            <form
              className={`${s.content__form} ${s.form}`}
              onSubmit={handleSubmit}
            >
              {fields.map((field) => (
                <input
                  key={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  className={field.className}
                  placeholder={field.placeholder}
                  type={field.type}
                />
              ))}

              <button className={s.form__button} disabled={!isValid}>
                Log In
              </button>
            </form>
          </div>
          <section className={s.content__other}>
            <p>
              Don't have an account?
              <Link to={ROUTES.SIGN_UP} className={s.content__link}>
                Sign Up
              </Link>
            </p>
          </section>
        </section>
      </div>
    </main>
  );
};

export default Login;
