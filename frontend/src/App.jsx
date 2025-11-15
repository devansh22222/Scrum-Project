import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";


export default function App(){
    return(
        <div>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/auth" element= {<Login/>}/>
            </Routes>
            
        </div>
    )
}