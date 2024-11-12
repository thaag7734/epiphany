import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ReactElement, useState } from "react";
import { login, signup } from "../../redux/reducers/session";
import ErrorMessage from "../ErrorMessage";
import { User } from "../../types/Models";

export default function LoginSignup() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formToggle, setFormToggle] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

//     const csrf= 

    const errors: { [key: string]: ReactElement } = {};
    const promise = formToggle
      ? dispatch(login({ email, password }))
      : dispatch(signup({ username, email, password }));
    promise.then(({ payload, type }) => {
      if (type === "session/signup/rejected") {
        for (const error in payload.errors) {
          errors[error] = <ErrorMessage msg={payload.errors[error]} />;
        }
        setErrors(errors);
      } else {
        const rootBoardId: Number = payload.user.root_board_id;
        navigate(`/boards/${rootBoardId}`);
      }
    });

    return (
      <div className="loginSignup">
        <h1>{formToggle ? "Login:" : "Sign Up:"}</h1>
        <form className="loginSignupForm" onSubmit={handleSubmit}>
          {!formToggle && (
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            id="email"
            type="email"
            placeholder="Please enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!formToggle && (
            <input
              id="verifyPassword"
              type="password"
              placeholder="Please verify password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          )}
          <button
            className="loginSignupFormButton"
            type="submit"
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
          ></button>
        </form>
        <button
          className="toggleLoginSignupButton"
          onClick={setFormToggle(!formToggle)}
        >
          {formToggle ? "Sign Up" : "Login"}
        </button>
      </div>
    );
  };
}
