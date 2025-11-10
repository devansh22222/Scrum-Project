import { useState } from "react"

export default function Login(){


    let [state, setState] = useState("Sign Up")
    let [userData, setUserData] = useState({
        name: "",
        age: "",
        email: "",
        password: "",
    })

    let handleChange = (e)=>{
        setUserData((currData)=>{
            return {...currData, [e.target.name]:e.target.value}
        })
    }

    let handleSubmit = (e)=>{
        e.preventDefault()
        console.log(userData)
        setUserData({
        name: "",
        age: "",
        email: "",
        password: "",
    })

    }





    return (
        <div>
            {state === "Sign Up" ? <div>
                <label htmlFor="name">Name: </label>
                <input type="text" placeholder="Enter Your Name" id="name" name="name" value={userData.name} onChange={handleChange} />
                <br /><br />
            </div> : null}
            

            {state === "Sign Up" ? <div>
                <label htmlFor="age">Age: </label>
                <input type="number" placeholder="Enter your Age" id="age" name="age" value={userData.age} onChange={handleChange} />
                 <br /><br />
            </div> : null}
            


            <label htmlFor="email">Email: </label>
            <input type="email" placeholder="Enter Email I'd" id="email" name="email" value={userData.email} onChange={handleChange} />


            <br /><br />

            <label htmlFor="password">Password: </label>
            <input type="password" placeholder="Enter password" id="password" name="password" value={userData.password} onChange={handleChange} />

            <br /><br />
            {state === "Sign Up" ? (<p>Already a user? <span onClick={()=>setState("Login")}>Login</span></p>) : (<p>Don't have an account? <span onClick={()=>setState("Sign Up")}>Sign Up</span></p>)
                
            }

            <br />

            <button onClick={handleSubmit}>Submit</button>


        </div>
    )
}