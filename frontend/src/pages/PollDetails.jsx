
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function PollDetails() {
  const { backendURL } = useContext(AppContext);
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendURL}/api/polls/${id}`);
        if (data.success) setPoll(data.poll);
      } catch (err) { console.error(err); }
    })();
  }, [backendURL, id]);

  if (!poll) return <div>Loading...</div>;

  const toggleChoice = (idxOrId) => {
    if (poll.multiple) {
      setSelected(s => s.includes(idxOrId) ? s.filter(x => x !== idxOrId) : [...s, idxOrId]);
    } else {
      setSelected([idxOrId]);
    }
  };

  const submitVote = async () => {
    try {
      axios.defaults.withCredentials = true;

      const choices = selected.map(s => {

        return s;
      });
      const { data } = await axios.post(`${backendURL}/api/vote/${id}/submit`, { choices });
      alert(data.message || "Voted");
      navigate(`/polls/${id}/results`);
    } catch (err) {
      alert(err?.response?.data?.message || "Error voting");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{poll.question || poll.title}</h2>
      <div>Starts: {poll.startTime ? new Date(poll.startTime).toLocaleString() : "N/A"}</div>
      <div>Ends: {poll.endTime ? new Date(poll.endTime).toLocaleString() : "N/A"}</div>

      <div style={{ marginTop: 10 }}>
        {poll.options.map((op, idx) => {
          const optId = op._id || idx;
          const checked = selected.includes(optId) || selected.includes(String(optId)) || selected.includes(idx);
          return (
            <div key={optId} style={{ marginBottom: 8 }}>
              <label>
                <input
                  type={poll.multiple ? "checkbox" : "radio"}
                  name="opt"
                  checked={checked}
                  onChange={() => toggleChoice(op._id || idx)}
                />{" "}
                {op.text}
              </label>
            </div>
          );
        })}
      </div>

      <button onClick={submitVote}>Submit Vote</button>
      <Link to={`/polls/${id}/results`}><button style={{ marginLeft: 8 }}>Results</button></Link>
    </div>
  );
}
