import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../../firebase/firebaseConfig";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [empid, setEmpid] = useState("");
  const [uid, setuId] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        const user = auth.currentUser;
        setuId(user.uid);

        // Save To Realtime Database
        if (user) {
          await set(ref(db, `Employee/${user.uid}`), {
            userId: user.uid,
            name: name,
            email: user.email,
            phoneNumber: phone,
            createdAt: new Date().toISOString(),
          });
        }
        setIsSuccess(true);
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningUp(false);
      }
    }
  };

  return (
    <div className="container">
      <form className="signup-form" onSubmit={onSubmit}>
        <h2>Create a New Account</h2>
        <div>
          <label>User Id:</label>
          <input
            type="text"
            value={empid}
            onChange={(e) => setEmpid(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="inline">
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="inline">
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" disabled={isSigningUp} className="btn-primary">
          {isSigningUp ? "Signing Up..." : "Sign Up"}
        </button>
        {isSuccess && navigate(`/profile/${uid}`)}
        <p className="signup-links">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
