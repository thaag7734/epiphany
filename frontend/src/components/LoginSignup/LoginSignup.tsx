import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { type FormEvent, type ReactElement, useState } from "react";
import { login, signup } from "../../redux/reducers/session";
import ErrorMessage from "../ErrorMessage";
import type { User } from "../../types/Models";
import { getCsrf } from "../../util/cookies";
import { IoIosLogIn } from "react-icons/io";

export default function LoginSignup() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formToggle, setFormToggle] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: ReactElement }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const csrf_token = await getCsrf();

    const errors: { [key: string]: ReactElement } = {};
    const promise = formToggle
      ? dispatch(login({ csrf_token, email, password }))
      : dispatch(signup({ csrf_token, username, email, password }));

    promise.then(({ payload, type }) => {
      if (["session/signup/rejected", "session/login/rejected"].includes(type)) {
        for (const error in payload.errors) {
          errors[error] = <ErrorMessage msg={payload.errors[error]} />;
        }
        setErrors(errors);
      } else {
        const rootBoardId: number = (payload as User).root_board_id!;
        navigate(`/boards/${rootBoardId}`);
      }
    });
  }

  return (
    <div className="loginSignup">
      <h1>{formToggle ? "Login:" : "Sign Up:"}</h1>
      <form className="loginSignupForm" onSubmit={handleSubmit}>
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
          placeholder="Please enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email}
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
        >
          <IoIosLogIn />
        </button>
        {errors.password}
      </form>
      <button
        type="button"
        className="toggleLoginSignupButton"
        onClick={() => setFormToggle(!formToggle)}
      >
        {formToggle ? "Sign Up" : "Login"}
      </button>
    </div>
  );
};
