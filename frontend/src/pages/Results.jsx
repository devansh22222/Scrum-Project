

import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Results({ pollId }) {
    const { backendURL } = useContext(AppContext);
    const [result, setResult] = useState(null);

    useEffect(() => {
        axios.get(backendURL + `/api/polls/${pollId}/results`, { withCredentials: true })
            .then(res => {
                if (res.data.success) setResult(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    if (!result) return <p>Loading...</p>;

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div>
            <h2>{result.poll.question}</h2>
            <p><b>Created by:</b> {result.poll.creator}</p>
            <p><b>Total votes:</b> {result.poll.totalVotes}</p>

            <PieChart width={400} height={400}>
                <Pie
                    data={result.results}
                    dataKey="votes"
                    nameKey="option"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                >
                    {result.results.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>

            <h3>Breakdown</h3>
            {result.results.map(r => (
                <div key={r.option}>
                    <p><b>{r.option}</b> — {r.votes} votes ({r.percentage.toFixed(1)}%)</p>
                    {!result.poll.anonymous &&
                        r.users.map(u => <p key={u.email}>➡ {u.name} ({u.email})</p>)
                    }
                </div>
            ))}
        </div>
    );
}
