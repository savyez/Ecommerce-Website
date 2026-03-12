import React, { useEffect } from "react";
import "../pageStyles/Home.css";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import Product from "../components/Product.jsx";
import ImageSlider from "../components/ImageSlider.jsx";
import PageTitle from "../components/PageTitle.jsx";
import {useDispatch, useSelector} from "react-redux";
import { getProduct } from "../features/products/productSlice.js";



function Home() {

    const {loading, error, products, productCount} = useSelector((state) => state.product)
    const dispatch = useDispatch();

    useEffect(() => {
    dispatch(getProduct());
    }, [dispatch]);


    return (
    <>
    <PageTitle title = "Home" />
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