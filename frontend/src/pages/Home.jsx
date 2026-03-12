import React from "react";
import "../pageStyles/Home.css";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

function Home() {
    return (
    <>
    <Navbar />
    <div className="home-container">
        <h2 className="home-heading">Trending Now</h2>
        <Footer />
    </div>
    </>
    )
}


export default Home;