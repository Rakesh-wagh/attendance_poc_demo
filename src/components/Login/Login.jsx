import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        const user = auth.currentUser;
        const userId = user.uid;
        navigate(`/profile/${userId}`);
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const userId = await doSignInWithGoogle();
        navigate(`/profile/${userId}`);
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="container box">
      <form onSubmit={onSubmit}>
        <h3>Login</h3>
        {errorMessage && <p className="error">{errorMessage}</p>}{" "}
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing In..." : "Submit"}
          </button>
        </div>
        <div className="d-grid">
          <button
            onClick={onGoogleSignIn}
            className="btn btn-secondary"
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing In..." : "Continue with Google"}
          </button>
        </div>
        <p className="forgot-password text-right">
          New user? <Link to="/register">Register Here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
