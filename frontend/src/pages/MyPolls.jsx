

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function MyPolls() {
    const { backendURL } = useContext(AppContext);
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        fetchMine();
    }, []);

    const fetchMine = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendURL + "/api/polls/mine");
            if (data.success) setPolls(data.polls);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h2>My Polls</h2>

            {polls.length === 0 ? (
                <p>No polls created yet</p>
            ) : (
                polls.map((p) => (
                    <div key={p._id} style={{ marginBottom: "20px" }}>
                        <h3>{p.question}</h3>
                        <p>Ends: {new Date(p.endTime).toLocaleString()}</p>
                    </div>
                ))
            )}
        </div>
    );
}
