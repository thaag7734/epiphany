import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { type FormEvent, type ReactElement, useEffect, useState } from "react";
import { login, signup, sessionSlice } from "../../redux/reducers/session";
import ErrorMessage from "../ErrorMessage";
import type { User } from "../../types/Models";
import { IoIosLogIn } from "react-icons/io";
import { getBoards } from "../../redux/reducers/boards";
import "./LoginSignup.css";

export default function LoginSignup() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [rootBoardId, setRootBoardId] = useState<number | null>(null);
  const [formToggle, setFormToggle] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: ReactElement }>({});
  const [doDemoLogin, setDoDemoLogin] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    //const csrf_token = await getCsrf();

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
      } else {
        const root = (payload as User).root_board_id!;
        setRootBoardId(root);
        await dispatch(getBoards());

        dispatch(sessionSlice.actions.changeBoard(root));
      }
    });
  };

  useEffect(() => {
    if (!rootBoardId) return;

    navigate(`/boards/${rootBoardId}`);
  }, [rootBoardId, navigate]);

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
                disabled={
                  formToggle
                    ? !email ||
                    !password ||
                    !email.includes("@") ||
                    password.length < 6
                    : !username ||
                    username.length < 4 ||
                    !email ||
                    !password ||
                    !email.includes("@") ||
                    password.length < 6 ||
                    password !== verifyPassword
                }
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
                disabled={
                  formToggle
                    ? !email ||
                    !password ||
                    !email.includes("@") ||
                    password.length < 6
                    : !username ||
                    username.length < 4 ||
                    !email ||
                    !password ||
                    !email.includes("@") ||
                    password.length < 6 ||
                    password !== verifyPassword
                }
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
