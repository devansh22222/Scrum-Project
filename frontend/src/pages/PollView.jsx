import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function PollView(){
  const { id } = useParams();
  const { backendURL } = useContext(AppContext);
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(()=>{ fetchPoll(); }, []);

  const fetchPoll = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/polls/${id}`, { withCredentials: true });
      setPoll(res.data.poll);
    } catch (err) { console.error(err); }
  };

  const toggle = (idx) => {
    if (!poll) return;
    if (poll.multiple) {
      setSelected(s => s.includes(idx) ? s.filter(i=>i!==idx) : [...s, idx]);
    } else {
      setSelected([idx]);
    }
  };

  const submit = async () => {
    try {
      await axios.post(`${backendURL}/api/polls/${id}/submit`, { optionIndexes: selected }, { withCredentials: true });
      alert("Submitted");
      fetchPoll();
    } catch (err) { alert(err?.response?.data?.message || "Error"); }
  };

  if (!poll) return <div>Loading...</div>;
  return (
    <div>
      <h2>{poll.question}</h2>
      <p>Ends: {poll.endTime ? new Date(poll.endTime).toLocaleString() : "No end"}</p>

      <div>
        {poll.options && poll.options.map((o, idx) => (
          <div key={idx}>
            <label>
              <input
                type={poll.multiple ? "checkbox" : "radio"}
                name="opt"
                checked={selected.includes(idx)}
                onChange={() => toggle(idx)}
              /> {o.text} { typeof o.votes !== 'undefined' && `(votes: ${o.votes})` }
            </label>
          </div>
        ))}
      </div>

      <button onClick={submit}>Submit</button>
    </div>
  );
}
