import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function VisiblePolls() {
    const { backendURL } = useContext(AppContext);
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        axios
            .get(backendURL + "/api/polls/visible", { withCredentials: true })
            .then(res => setPolls(res.data.polls))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h2>Available Polls</h2>

            {polls.length === 0 ? (
                <p>No polls available</p>
            ) : (
                polls.map(p => (
                    <div key={p._id} style={{ marginBottom: "15px" }}>
                        <h3>{p.question}</h3>
                        <p>Ends: {new Date(p.endTime).toLocaleString()}</p>
                    </div>
                ))
            )}
        </div>
    );
}
