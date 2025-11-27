
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import axios from "axios";
import CreateModal from "../components/CreateModal";

export default function Home() {
    const { backendURL, isLoggedIn } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendURL + "/api/polls/all");
            if (data.success) setPolls(data.polls);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="homePage">

            <div className="navBar">
                <h1>Online Voting System</h1>
                <div>
                     {/* LOGIN BUTTON SHOULD ALWAYS BE SHOWN */}
                        {!isLoggedIn && (
                        <Link to={"/auth"}>
                            <button style={{ marginLeft: "10px" }}>Login</button>
                        </Link>
                    )}

                    {
                        isLoggedIn && (
                            <button>Log Out</button>
                        )
                    }

                    
                </div>
               
            </div>
            
            <div className="homeBg">

                <div className="availablePolls">
                    <h2>Available Polls</h2>

                    {polls.length === 0 ? (
                    <p>No polls available...</p>
                    ) : (
                    polls.map((p, i) => (
                        <div key={i} style={{ marginBottom: "20px" }}>
                            <h3>{p.question}</h3>
                            <p>Created by: {p.creator?.name}</p>
                            <p>Ends: {new Date(p.endTime).toLocaleString()}</p>

                            {p.options.map((o, j) => (
                                <p key={j}>• {o.text}</p>
                            ))}
                        </div>
                    ))
                    )}

                    {open && <CreateModal close={() => setOpen(false)} />}
                </div>


                
                <div className="createBtns">
                    {isLoggedIn && (
                        <>
                            <Link to={"/mypolls"}><button style={{ marginLeft: "10px" }}>My Polls</button></Link> 
                            <Link to={"/notifications"}><button style={{ marginLeft: "10px" }}>Notifications</button></Link>
                        </>
                    )}
                    &nbsp;&nbsp;
                <button onClick={() => setOpen(true)}>Create</button>
                </div>
                

            

                
                </div>
            </div>
            
    );
}
