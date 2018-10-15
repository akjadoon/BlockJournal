import React from 'react'
import Review from '../../Reviews/Review/Review'

const article = (props) => {

   
    const reviewData = [
        {Author: "Andrew Burnie", reviewRating: 10},
        {Author: "James Burnie", reviewRating: 7},
        {Author: "Andrew Henderson", reviewRating: 4}
    ]
    
    const data = props.data[props.match.params.id]
    const style = {
        width: "60vw",
        margin: "auto"
    }

    const reviews = Array.from(Array(reviewData.length).keys()).map((i) => 
        <Review key={i} author={reviewData[i].Author } rating={reviewData[i].reviewRating}/>
    );

    return(
        <div style={style}>
            <h1>{data.title}</h1>
            <h3>Authors: {data.author}</h3>
            <h3><a>Full Text: PDF</a></h3>
            <h3>Abstract: </h3>
            <p>{data.abstract}</p>
            <h3>{console.log(props)}</h3>
            <div>
                <h2>Reviews</h2>
                {reviews}
            </div>
        </div>
    )
}

export default article