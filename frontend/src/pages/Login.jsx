
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(){
  let [state, setState] = useState("Sign Up");
  let [userData, setUserData] = useState({ name: "", age: "", email: "", password: "" });
  const { backendURL, setIsLoggedIn, setMe } = useContext(AppContext);
  const navigate = useNavigate();

  let handleChange = (e) => setUserData(curr => ({ ...curr, [e.target.name]: e.target.value }));

  let handleSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendURL + "/api/auth/register", userData);
        if (data.success) {
          setIsLoggedIn(true);
          setMe(data.user);
          navigate("/");
        } else {
          alert(data.message);
        }
      } else {
        const { data } = await axios.post(backendURL + "/api/auth/login", userData);
        if (data.success) {
          setIsLoggedIn(true);
          setMe(data.user);
          navigate("/");
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error(error?.response?.data || error);
      alert(error?.response?.data?.message || error.message);
    } finally {
      setUserData({ name: "", age: "", email: "", password: "" });
    }
  };

  return (
    <div className="mainBox">
      <h1 style={{textAlign:"center"}}>Authentication</h1>
      <br />
      {state === "Sign Up" && (
        <>
          <label>Name: </label>
          <input name="name" value={userData.name} onChange={handleChange}/>

          <br /><br />
          
          <label>Age: </label>
          <input name="age" type="number" value={userData.age} onChange={handleChange}/>
          <br /><br />
        </>
      )}
      <label>Email: </label>
      <input name="email" value={userData.email} onChange={handleChange}/>
      <br /><br />
      <label>Password: </label>
      <input name="password" type="password" value={userData.password} onChange={handleChange}/>
      <br /><br />
      <div>
        {state === "Sign Up" ? (<p>Already a user? <span onClick={()=>setState("Login")}>Login</span></p>) : (<p>Don't have an account? <span onClick={()=>setState("Sign Up")}>Sign Up</span></p>)}
      </div>
      <br /><br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
