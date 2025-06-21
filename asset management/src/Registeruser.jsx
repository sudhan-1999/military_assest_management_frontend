import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Registeruser() {
  const [name, setName] = useState("");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [base, setBase] = useState("");

  const userrole = localStorage.getItem("role");
    const token = localStorage.getItem("token");
  const authorizeroles = ["logistic officer", "admin", "commander"];

  const handleSubmit = async () => {
    if (!name || !userid || !password || !role || !base) {
      alert("Please fill all fields");
      return;
    }
    if (userrole !== "admin") {
      alert("You are not authorized to register users");
      return;
    }
    
    await axios
      .post("https://miltary-assest-managemnet-backend.onrender.com/api/registeruser", {
        name: name,
        userid: userid,
        password: password,
        role: role,
        base: base,
      },{
            headers: {
              Authorization: token,
            },
          })
      .then((res) => {
        
        alert("User registered successfully");
        setName("");
        setUserid("");
        setPassword("");
        setRole("");
        setBase("");
      })
      .catch((err) => {
        console.error("Error registering user", err);
        alert("Error registering user");
      });
  };

  return (
    <>
      <div className="container">
        <div className="row g-3">
          <div className="col-12">
            <input
              id="name"
              type="text"
              placeholder="Enter name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-12">
            <input
              id="userid"
              type="text"
              placeholder="Enter userid"
              className="form-control"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
            />
          </div>

          <div className="col-12">
            <input
              id="password"
              type="text"
              placeholder="Enter password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="col-12">
            <input
              id="role"
              type="text"
              placeholder="Enter role"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="col-12">
            <input
              id="base"
              type="text"
              placeholder="Enter base"
              className="form-control"
              value={base}
              onChange={(e) => setBase(e.target.value)}
            />
          </div>

          <div className="col-12 d-flex justify-content-md-center justify-content-center">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registeruser;
