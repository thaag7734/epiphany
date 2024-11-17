import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { type FormEvent, type ReactElement, useEffect, useState } from "react";
import { login, signup } from "../../redux/reducers/session";
import ErrorMessage from "../ErrorMessage";
import { IoIosLogIn } from "react-icons/io";
import "./LoginSignup.css";

export default function LoginSignup() {
  const user = useAppSelector((state) => state.session.user);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formToggle, setFormToggle] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: ReactElement }>({});
  const [doDemoLogin, setDoDemoLogin] = useState<boolean>(false);

  const validate = (): boolean => {
    const error = (m: string) => {
      return <ErrorMessage msg={m} />;
    };

    const errors: { [key: string]: ReactElement } = {};

    if (!formToggle) {
      if (username.length < 4)
        errors.username = error("Username must be at least 4 characters");
      if (password !== verifyPassword)
        errors.verifyPassword = error("Passwords do not match");
    }

    // TODO proper email validation
    if (!email) errors.email = error("Please enter your email address");
    if (password.length < 6)
      errors.password = error("Password must be at least 6 characters");

    if (Object.entries(errors).length) {
      setErrors(errors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const errors: { [key: string]: ReactElement } = {};

    const promise = formToggle
      ? dispatch(login({ email, password }))
      : dispatch(signup({ username, email, password }));

    promise.then(async ({ payload, type }) => {
      if (
        ["session/signup/rejected", "session/login/rejected"].includes(type)
      ) {
        for (const error in payload.errors) {
          errors[error] = <ErrorMessage msg={payload.errors[error]} />;
        }
        setErrors(errors);
      }
    });
  };

  useEffect(() => {
    if (!user) return;

    navigate(`/boards/${user.root_board_id}`);
  }, [user, navigate]);

  useEffect(() => {
    setErrors({});
  }, [formToggle]);

  useEffect(() => {
    if (!doDemoLogin) return;

    (
      document.querySelector("form.login-signup-form") as HTMLFormElement
    ).requestSubmit(
      document.querySelector(
        "button.login-signup-form-btn",
      ) as HTMLButtonElement,
    );
  }, [doDemoLogin]);

  const demoLogin = () => {
    setEmail("demo@aa.io");
    setPassword("password");

    setDoDemoLogin(true);
  };

  return (
    <div className="login-signup-bg">
      <div className="login-signup">
        <img src="epiphany.svg" alt="Epiphany: Whatever Comes to Mind" />
        <h1>{formToggle ? "Login" : "Sign Up"}</h1>
        <form className="login-signup-form" onSubmit={handleSubmit}>
          {!formToggle && (
            <>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username}
            </>
          )}
          <input
            id="email"
            type="email"
            placeholder="Email"
            aaaaaaaa
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email}
          <div className="password-group">
            <input
              id="password"
              type="password"
              className={formToggle ? "has-button" : undefined}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formToggle && (
              <button
                className="login-signup-form-btn"
                type="submit"
                title="Login"
              >
                <IoIosLogIn />
              </button>
            )}
          </div>
          {!formToggle && (
            <div className="password-group">
              <input
                id="verifyPassword"
                type="password"
                className="has-button"
                placeholder="Verify Password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
              <button
                className="login-signup-form-btn"
                type="submit"
                title="Sign Up"
              >
                <IoIosLogIn />
              </button>
            </div>
          )}
          {errors.password}
          <div className="toggle-demo-group">
            {formToggle && (
              <button type="button" className="demo-login" onClick={demoLogin}>
                Login as Demo User
              </button>
            )}
            <button
              type="button"
              className="toggle-login-signup-btn"
              onClick={() => setFormToggle(!formToggle)}
            >
              {formToggle ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
