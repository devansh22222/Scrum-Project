import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn } = useContext(AppContext);

    if (!isLoggedIn) return <Navigate to="/auth" />;

    return children;
}
