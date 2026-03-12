import React, { useState } from 'react';
import "../componentStyles/Rating.css";

function Rating({ value, onRatingChange, disabled }) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(value || 0);

    // Handle Star Hover
    const handleMouseEnter = (rating) => {
        if(!disabled) {
            setHoveredRating(rating)
        }
    }

    // Handle Mouse leave
    const handleMouseLeave = () => {
        if(!disabled) {
            setHoveredRating(0)
        }
    }

    // Handle Click
    const handleClick = (rating) => {
        if(!disabled) {
            setSelectedRating(0)
            if(onRatingChange){
                onRatingChange(rating)
            }
        }
    }

    // Function to generate stars based on the selected rating
    const generateStars = () => {
        const stars = [];
        for(let i=1; i<=5; i++){
            const isFilled = i <= (hoveredRating || selectedRating);
            stars.push(
                <span key= {i} 
                className={`star ${isFilled? 'filled': 'empty'}`}
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                style={{pointerEvents: disabled? 'none': 'auto'}}>★</span>
            )
        }
        return stars
    }

  return (
    <div>
        <div className="rating">
        {generateStars()}
        </div>
    </div>
  )
}

export default Rating;