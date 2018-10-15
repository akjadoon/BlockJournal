import React from 'react'


const review = (props) => {
    return(
        <div>
            <hr/>
            <h5><strong>Author:</strong> {props.author}</h5>
            <h5><strong>Rating: {props.rating.toString()}</strong></h5>
            <h5><strong><a>PDF link</a> </strong> </h5>       
        </div>
    )
}

export default review;