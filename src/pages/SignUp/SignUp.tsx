import { useEffect, useState, useMemo, FormEvent, ChangeEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import s from "../Login-SignUp.module.scss";
import { firebase } from "../../lib/firebase";
import * as FirebaseService from "../../services/firebase";

type Props = {
  currentUsername?: TUser["username"];
};

const SignUp = ({ currentUsername }: Props) => {
  const history = useHistory();
  const [state, setState] = useState<{ [key in string]: string }>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name: string, value: string) => {
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  useEffect(() => {
    document.title = "Sign Up - Instagram";
  }, []);

  useEffect(() => {
    if (currentUsername) history.push("/");
  }, [currentUsername]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUserNameExist = await FirebaseService.checkIsUserNameExist(
      state.username
    );
    const isEmailExist = await FirebaseService.checkIsEmailExist(state.email);

    if (!isUserNameExist && !isEmailExist) {
      try {
        const userCreated = await firebase
          .auth()
          .createUserWithEmailAndPassword(state.email, state.password);
        if (!userCreated.user) return;
        return firebase
          .firestore()
          .collection("users")
          .add({
            dateCreated: Date.now(),
            emailAddress: state.email,
            followers: [],
            following: [],
            fullName: state.fullName,
            userId: userCreated.user.uid,
            username: state.username,
            photo: "/images/avatars/default.png",
          })
          .then(() => {
            history.push(ROUTES.DASHBOARD);
          });
      } catch ({ message }) {
        setError(message)
      }
    } else {
      if (isUserNameExist) {
        setError("User with this username is already exists. Please choose another one.")
      } else if (isEmailExist) {
        setError("User with this email address is already exists. Please Log In or choose another email address.")
      }
    }
  };

  const fields: { [key in string]: {
    className: string,
    type: string,
    placeholder: string,
    "aria-label": string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  } } = useMemo(
    () => ({
      "username":{
        className: s.form__input,
        type: "text",
        placeholder: "Username",
        "aria-label": "Enter your username here",
        value: state.username,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          handleChange("username", e.target.value.toLowerCase());
        },
      },
      "fullName": {
        className: s.form__input,
        type: "text",
        placeholder: "Full name",
        "aria-label": "Enter your full name here",
        value: state.fullName,
        name: "fullName",
        onChange(e: ChangeEvent<HTMLInputElement>) {
          handleChange("fullName", e.target.value);
        },
      },
      "email": {
        className: s.form__input,
        type: "email",
        placeholder: "Email address",
        "aria-label": "Enter your email address here",
        value: state.email,
        name: "email",
        onChange(e: ChangeEvent<HTMLInputElement>) {
          handleChange("email", e.target.value.toLowerCase());
        },
      },
      "password": {
        className: s.form__input,
        type: "password",
        placeholder: "Password",
        "aria-label": "Enter your password here",
        value: state.password,
        name: "password",
        onChange(e: ChangeEvent<HTMLInputElement>) {
          handleChange("password", e.target.value);
        },
      },
      "repeatPassword": {
        className: s.form__input,
        type: "password",
        placeholder: "Repeat password",
        "aria-label": "Please repeat password",
        value: state.repeatPassword,
        name: "repeatPassword",
        onChange(e: ChangeEvent<HTMLInputElement>) {
          handleChange("repeatPassword", e.target.value);
        },
      },
    }),
    []
  );

  useEffect(() => {
    document.title = "Sign Up - Instagram";
  }, []);

  useEffect(() => {
    setError("");
    if (
      Object.keys(fields).every((key) => fields[key].value.length >= 4) &&
      state.password === state.repeatPassword &&
      /^.+@.+$/.test(state.email)
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [
    state.username,
    state.fullName,
    state.email,
    state.password,
    state.repeatPassword,
    fields,
  ]);

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
              method="POST"
            >
              {Object.keys(fields).map((key) => (
                <input
                  key={key}
                  {...fields[key]}
                  value={state[key]}
                />
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

export default SignUp;
