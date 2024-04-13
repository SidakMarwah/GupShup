import React, { useState, useEffect } from "react";
import Robot from "../assets/Robot.gif";

export default function Welcome() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("gupshup"));
        if (userData) {
            setUserName(userData.username);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-white my-auto">
            <img src={Robot} alt="" className="h-80 mb-6" />
            <h1 className="text-3xl">
                Welcome, <span className="text-blue-500">{userName}!</span>
            </h1>
            <h3>Please select a chat to start messaging.</h3>
        </div>
    );
}
