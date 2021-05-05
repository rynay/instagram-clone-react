import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    <main>
      <div>
        <img alt="" src="./images/iphone-with-profile.jpg" />
      </div>
      <section>
        <div>
          <img alt="Instagram" src="./images/logo.png" />
        </div>
        <form onSubmit={handleSubmit} method="POST">
          <input
            type="text"
            placeholder="Email address"
            aria-label="Enter your email address here"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Enter your password here"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />

          <button disabled={!isValid}>Login</button>
        </form>

        <section>
          <p>
            Don't have an account?
            <Link to="/sign-up">Sign Up</Link>
          </p>
        </section>
      </section>
    </main>
  );
};

export default Login;
