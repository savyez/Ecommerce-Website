import React from "react";
import "../pageStyles/Home.css";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import Product from "../components/Product.jsx";
import ImageSlider from "../components/ImageSlider.jsx";


const products= [
        {
            "_id": "69b05df9adc499dfd081eeec",
            "name": "Denim Jeans",
            "description": "This is the first product",
            "price": 499,
            "ratings": 5,
            "image": [
                {
                    "public_id": "This is an id",
                    "url": "This is image url",
                    "_id": "69b1b4a56386a1b6e294fcf7"
                }
            ],
            "category": "Jeans",
            "stock": 7,
            "numOfReviews": 1,
            "reviews": [
                {
                    "user": "69b1c949707af9d928d76bbd",
                    "name": "Prem",
                    "rating": 5,
                    "comment": "Great Quality, good price and comfortable",
                    "_id": "69b1cee66ba497a27161bbfe"
                }
            ],
            "createdAt": "2026-03-10T18:07:53.404Z",
            "__v": 2
        },
        {
            "_id": "69b1114dc282898b08bf9684",
            "name": "product2",
            "description": "This is the second product",
            "price": 1499,
            "ratings": 3,
            "image": [
                {
                    "public_id": "This is an id",
                    "url": "This is image url",
                    "_id": "69b1114dc282898b08bf9685"
                }
            ],
            "category": "Shoes",
            "stock": 40,
            "numOfReviews": 0,
            "reviews": [],
            "createdAt": "2026-03-11T06:53:01.054Z",
            "__v": 0
        }
    ]

function Home() {
    return (
    <>
    <Navbar />
    <ImageSlider />
    <div className="home-container">
        <h2 className="home-heading">Trending Now</h2>
        {products.map((product, index) => (
        <Product product={product} key={index} />
        ))}
        <Footer />
    </div>
    </>
    )
}


export default Home;