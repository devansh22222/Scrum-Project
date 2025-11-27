
import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

export default function CreateModal({ close }) {
  const { backendURL } = useContext(AppContext);
  const [tab, setTab] = useState("poll");

  const [poll, setPoll] = useState({
    question: "",
    options: ["", ""],
    type: "single",
    anonymous: false,
    start: "",
    end: "",
    visibility: "public",
    allowedUsers: [],
  });

  const [vote, setVote] = useState({
    title: "",
    options: [{ name: "", desc: "" }, { name: "", desc: "" }],
    type: "single",
    start: "",
    end: "",
    visibility: "public",
    allowedUsers: [],
  });

  const handlePollOptionChange = (i, v) => {
    const opts = [...poll.options];
    opts[i] = v;
    setPoll({ ...poll, options: opts });
  };
  const addPollOption = () => setPoll({ ...poll, options: [...poll.options, ""] });

  const handleVoteOptionChange = (i, f, v) => {
    const opts = [...vote.options];
    opts[i][f] = v;
    setVote({ ...vote, options: opts });
  };
  const addVoteOption = () => setVote({ ...vote, options: [...vote.options, { name: "", desc: "" }] });

  const submitPoll = async () => {
    try {
      axios.defaults.withCredentials = true;
      const payload = {
        type: "poll",
        question: poll.question,
        options: poll.options,
        anonymous: poll.anonymous,
        start: poll.start || new Date().toISOString(),
        end: poll.end || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        visibility: poll.visibility,
        allowedUsers: poll.allowedUsers,
      };
      const { data } = await axios.post(`${backendURL}/api/polls/create`, payload);
      alert(data.message || "Created");
      close();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error");
    }
  };

  const submitVote = async () => {
    try {
      axios.defaults.withCredentials = true;
      const payload = {
        type: "vote",
        title: vote.title,
        options: vote.options.map(o => o.name || o.text || ""),
        start: vote.start || new Date().toISOString(),
        end: vote.end || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        visibility: vote.visibility,
        allowedUsers: vote.allowedUsers,
      };
      const { data } = await axios.post(`${backendURL}/api/polls/create`, payload);
      alert(data.message || "Created");
      close();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <button style={tab === "poll" ? styles.activeTab : styles.tab} onClick={() => setTab("poll")}>Poll Form</button>
            <button style={tab === "vote" ? styles.activeTab : styles.tab} onClick={() => setTab("vote")}>Vote Form</button>
          </div>
          <button onClick={close} style={styles.close}>X</button>
        </div>

        {tab === "poll" && (
          <div>
            <h3>Create Poll</h3>
            <input type="text" placeholder="Poll Question" value={poll.question} onChange={e => setPoll({ ...poll, question: e.target.value })} />
            <br /><br />
            <h4>Options</h4>
            {poll.options.map((o, i) => <input key={i} placeholder={`Option ${i+1}`} value={o} onChange={e => handlePollOptionChange(i, e.target.value)} />)}
            <button onClick={addPollOption}>+ Add Option</button>
            <br /><br />
            <h4>Type</h4>
            <select value={poll.type} onChange={e => setPoll({ ...poll, type: e.target.value })}><option value="single">Single</option><option value="multiple">Multiple</option></select>
            <br /><br />
            <h4>Anonymous</h4>
            <select value={String(poll.anonymous)} onChange={e => setPoll({ ...poll, anonymous: e.target.value === "true" })}><option value="false">No</option><option value="true">Yes</option></select>
            <br /><br />
            <h4>Start</h4><input type="datetime-local" value={poll.start} onChange={e => setPoll({ ...poll, start: e.target.value })} />
            <br /><br />
            <h4>End</h4><input type="datetime-local" value={poll.end} onChange={e => setPoll({ ...poll, end: e.target.value })} />
            <br /><br />
            <h4>Visibility</h4>
        
            <select value={poll.visibility} onChange={e => setPoll({ ...poll, visibility: e.target.value })}><option value="public">Public</option><option value="selected">Selected</option></select>
            <br /><br />
            {poll.visibility === "selected" && <input placeholder="Enter emails comma separated" onChange={e => setPoll({ ...poll, allowedUsers: e.target.value.split(",").map(s=>s.trim()) })} />}
            <br /><br />
            <button onClick={submitPoll}>Submit Poll</button>
          </div>
        )}

        {tab === "vote" && (
          <div>
            <h3>Create Vote</h3>
            <input type="text" placeholder="Voting Title" value={vote.title} onChange={e => setVote({ ...vote, title: e.target.value })} />
            <br /><br />
            <h4>Candidates</h4>
            {vote.options.map((c, i) => (
              <div key={i}>
                <input placeholder="Name" value={c.name} onChange={e => handleVoteOptionChange(i, "name", e.target.value)} />
                <input placeholder="Description" value={c.desc} onChange={e => handleVoteOptionChange(i, "desc", e.target.value)} />
                <br />
              </div>
            ))}
            <br />
            <button onClick={addVoteOption}>+ Add</button>
            <br /><br />
            <h4>Type</h4>
            <select value={vote.type} onChange={e => setVote({ ...vote, type: e.target.value })}><option value="single">Pick 1</option><option value="multiple">Pick multiple</option></select>
            
            <br /><br />
            <h4>Start</h4><input type="datetime-local" value={vote.start} onChange={e => setVote({ ...vote, start: e.target.value })} />
            
            <br /><br />
            <h4>End</h4><input type="datetime-local" value={vote.end} onChange={e => setVote({ ...vote, end: e.target.value })} />
            
            <br /><br />
            <h4>Visibility</h4>
            <select value={vote.visibility} onChange={e => setVote({ ...vote, visibility: e.target.value })}><option value="public">Public</option><option value="selected">Selected</option></select>
            {vote.visibility === "selected" && <input placeholder="Enter emails comma separated" onChange={e => setVote({ ...vote, allowedUsers: e.target.value.split(",").map(s=>s.trim()) })} />}
            <br /><br />
            <button onClick={submitVote}>Submit Vote</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "#fff", padding: 20, width: 640, borderRadius: 8, maxHeight: "90vh", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  tab: { padding: "8px 12px", border: "1px solid #888", cursor: "pointer", marginRight: 6 },
  activeTab: { padding: "8px 12px", borderBottom: "2px solid #111", fontWeight: "bold" },
  close: { background: "red", color: "#fff", border: "none", padding: "6px 10px", cursor: "pointer" },
};
