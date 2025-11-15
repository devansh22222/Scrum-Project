import { Link } from "react-router-dom";


export default function Home(){
    return(
        <div>
            <h1>Welcome!! Create your first poll</h1>

            <br />

            <Link to={"/auth"}><button>Login</button></Link>
        </div>
    )
}