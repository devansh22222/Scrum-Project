
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyPolls from "./pages/MyPolls";
import Notifications from "./pages/Notifications";
import PollDetails from "./pages/PollDetails";
import Results from "./pages/Results";

export default function App(){
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/auth" element={<Login/>}/>
        <Route path="/mypolls" element={<MyPolls/>}/>
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/polls/:id" element={<PollDetails/>}/>
        <Route path="/polls/:pollId/results" element={<Results/>}/>
      </Routes>
    </div>
  );
}
