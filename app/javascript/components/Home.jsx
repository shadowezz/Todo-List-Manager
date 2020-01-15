import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container-fluid text-center">
            <h1>Todo List Manager</h1>
            <h3>Your number one site to get your shit together.</h3>
            <br></br>
            
            <Link className="btn btn-success btn-home" to="/signup">
                Sign up
            </Link>
            
            <br></br>
            <br></br>
            
            <Link className="btn btn-success btn-home" to="/login">
                Log in
            </Link>
            
        </div>
    );
};

export default Home;