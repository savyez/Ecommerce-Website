import React from "react";
import "../pageStyles/Home.css";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import ImageSlider from "../components/ImageSlider.jsx";

function Home() {
    return (
    <>
    <Navbar />
    <ImageSlider />
    <div className="home-container">
        <h2 className="home-heading">Trending Now</h2>
        <Footer />
    </div>
    </>
    )
}


export default Home;