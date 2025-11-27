import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { PieChart, Pie, Cell, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function PollResults() {
    const { id } = useParams();
    const { backendURL } = useContext(AppContext);

    const [results, setResults] = useState(null);

    useEffect(() => {
        axios.get(`${backendURL}/api/polls/${id}/results`, { withCredentials: true })
            .then(r => setResults(r.data))
            .catch(err => console.log(err));
    }, [id]);

    if (!results) return <h3>Loading results...</h3>;

    const data = results.options.map(o => ({
        name: o.text,
        value: o.votes
    }));

    return (
        <div>
            <h2>Results</h2>

            <PieChart width={400} height={400}>
                <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={100}>
                    {data.map((entry, index) => (
                        <Cell key={index} />
                    ))}
                </Pie>
            </PieChart>

            <BarChart width={500} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
            </BarChart>

            {!results.anonymous && (
                <>
                    <h3>Responses</h3>
                    {results.responses.map((r, idx) => (
                        <p key={idx}>{r.userEmail} → {r.optionText}</p>
                    ))}
                </>
            )}
        </div>
    );
}
