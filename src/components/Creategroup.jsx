import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Creategroup.css";
import axios from "axios";

function CreateGroup() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const nameRef = useRef();
  const introductionRef = useRef();

  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const introduction = introductionRef.current.value;

    if (!user) {
      showSuccessMessage("You must be logged in to create a group.");
      return;
    }

    try {
      console.log(`${url}/groups/creategroup`)
      
      const response = await axios.post(`${url}/groups/creategroup`, {
        group_name: name,
        group_users_id: user.users_id,
        group_owner_id: user.users_id,
        group_introduction: introduction,
      });

      console.log("Group created successfully:", response.data);

      showSuccessMessage("Group created successfully!");
      setTimeout(() => {
        navigate(`/group/${response.data.group.group_id}`);
      }, 2000);

      // Clear the form
      nameRef.current.value = "";
      introductionRef.current.value = "";
    } catch (error) {
      console.error("Error creating group:", error);

      showSuccessMessage(
        error.response?.data?.error || "Failed to create group. Try again later."
      );
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  return (
    <div className="create-group-container">
      <h1>Create a new group</h1>
      <form className="create-group-form" onSubmit={handleSubmit}>
        <div>
          <label>Group Name</label>
          <input type="text" name="name" ref={nameRef} required />
        </div>
        <div>
          <label>Group Introduction</label>
          <textarea
            className="form-textarea"
            name="introduction"
            ref={introductionRef}
            required
            placeholder="Write something about your group..."
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {/* Display success message popup */}
      {successMessage && <div className="success-popup">{successMessage}</div>}
    </div>
  );
}

export default CreateGroup;
