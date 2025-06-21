import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  
  
    const handleSubmit =async (e) => {
      e.preventDefault();
      console.log("userId", userId);
      console.log("password", password);
      try {
       const res= await  axios
          .post("http://localhost:3000/api/login", {
            userid: userId,
            password: password,
          })
          console.log("res", res);
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.user.role);
          localStorage.setItem("base", res.data.user.base);
          navigate("/dashboard");
      } catch (err) {
        console.log(err);
        setError(true);
      }
      
    };
  
  return (
    <>
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form className="w-100 p-4 rounded shadow-sm bg-white"
  style={{ maxWidth: "400px" }}>
    <h4 className="text-center mb-4" >Login</h4>
   {error?<h4 className="text-center mb-4" style={{color:"red"}}>Wrong Credentials</h4>:""}
      
    
        {/*<div className="row mb-3">
          <label for="inputEmail3" className="col-sm-2 col-form-label">
            User Id
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputEmail3"
              
              onChange={(e)=>{setUserId(e.target.value)}}
            />
          </div>
        </div>*/}
        <div className="mb-3">
    <label htmlFor="inputUserId" className="form-label">
      User ID
    </label>
    <input
      type="text"
      className="form-control"
      id="inputUserId"
      onChange={(e) => setUserId(e.target.value)}
    />
  </div>
         {/*<div className="row mb-3">
          <label for="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input type="password" className="form-control" id="inputPassword3"  value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
          </div>
        </div>*/}
        <div className="mb-3">
    <label htmlFor="inputPassword" className="form-label">
      Password
    </label>
    <input
      type="password"
      className="form-control"
      id="inputPassword"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
        <div id="signin">
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            Log in
          </button>
        </div>
      </form>
      </div>
    </>
  );
}

export default Login;