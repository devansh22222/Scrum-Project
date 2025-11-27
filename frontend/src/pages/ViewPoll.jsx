import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function ViewPoll() {
    const { id } = useParams();
    const { backendURL } = useContext(AppContext);

    const [poll, setPoll] = useState(null);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        axios.get(`${backendURL}/api/polls/${id}`, { withCredentials: true })
            .then(r => setPoll(r.data.poll))
            .catch(err => console.log(err));
    }, [id]);

    const voteNow = async () => {
        const { data } = await axios.post(
            `${backendURL}/api/polls/${id}/vote`,
            { selected },
            { withCredentials: true }
        );
        alert(data.message);
    };

    if (!poll) return <h3>Loading...</h3>;

    return (
        <div>
            <h2>{poll.question || poll.title}</h2>

            {poll.options.map((op, idx) => (
                <div key={op._id}>
                    <input type={poll.type === "single" ? "radio" : "checkbox"}
                        name="vote"
                        onChange={() => {
                            if (poll.type === "single") setSelected([op._id]);
                            else {
                                let arr = [...selected];
                                if (arr.includes(op._id))
                                    arr = arr.filter(i => i !== op._id);
                                else
                                    arr.push(op._id);
                                setSelected(arr);
                            }
                        }}
                    />
                    <label>{op.text}</label>
                </div>
            ))}

            <br />
            <button onClick={voteNow}>Submit Vote</button>
        </div>
    );
}
