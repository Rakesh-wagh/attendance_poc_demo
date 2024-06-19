import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../../firebase/firebaseConfig";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    empid: "",
  });
  const [uid, setuId] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doCreateUserWithEmailAndPassword(
          formData.email,
          formData.password
        );
        const user = auth.currentUser;
        setuId(user.uid);
        if (user) {
          await set(ref(db, `Employee/${user.uid}`), {
            userId: user.uid,
            employeeId: formData.empid,
            name: formData.name,
            email: user.email,
            phoneNumber: formData.phone,
            createdAt: new Date().toISOString(),
          });
        }
        setIsSuccess(true);
        navigate(`/profile/${user.uid}`);
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
            name="empid"
            value={formData.empid}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inline">
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="inline">
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
