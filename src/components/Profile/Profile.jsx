import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchUserById, updateUserById } from "../../firebase/auth";
import "./Profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    if (userId) {
      const getUserData = async () => {
        const userData = await fetchUserById(userId);

        if (userData) {
          setUser(userData);
        }
        setLoading(false);
      };
      getUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const toggleEdit = () => {
    if (isEditing) {
      updateUserById(userId, user).then(() => {
        setIsEditing(false);
      });
    } else {
      setIsEditing(true);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="App">
      <h1>Edit Profile</h1>
      <div className="profile-container">
        <div className="profile-photo">
          <img
            src={
              user?.profilePhoto ||
              "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
            }
            alt="Profile"
          />
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <label>Employee ID:</label>
            {isEditing ? (
              <input
                type="text"
                name="employeeId"
                value={user.employeeId || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user?.employeeId}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user?.name}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={user.email || ""}
                readOnly
              />
            ) : (
              <span>{user?.email}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={user.phoneNumber || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user?.phoneNumber}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Region:</label>
            {isEditing ? (
              <input
                type="text"
                name="region"
                value={user.region || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user?.region}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Location:</label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={user.location || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user?.location}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Title:</label>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={user.title || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user?.title}</span>
            )}
          </div>
        </div>
      </div>
      <button onClick={toggleEdit}>{isEditing ? "Save" : "Edit"}</button>
    </div>
  );
};
export default Profile;
