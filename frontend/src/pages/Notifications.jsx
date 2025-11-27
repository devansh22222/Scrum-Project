
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function Notifications() {
  const { backendURL } = useContext(AppContext);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendURL}/api/notifications`);
        if (data.success) setNotifs(data.notifications || []);
      } catch (err) { console.error(err); }
    })();
  }, [backendURL]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Notifications</h1>
      {notifs.length === 0 && <div>No notifications</div>}
      {notifs.map(n => (
        <div key={n._id} style={{ border: "1px solid #eee", padding: 10, margin: 8 }}>
          <h4>{n.title}</h4>
          <div>{n.description}</div>
          <div>Start: {n.meta?.startTime ? new Date(n.meta.startTime).toLocaleString() : "N/A"}</div>
          <div>End: {n.meta?.endTime ? new Date(n.meta.endTime).toLocaleString() : "N/A"}</div>
          {n.link && <Link to={n.link}><button>Open</button></Link>}
        </div>
      ))}
    </div>
  );
}
