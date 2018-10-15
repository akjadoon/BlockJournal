import React from 'react'


const articleCard = (props) => (
    <React.Fragment>
        <div style={{width: "50vw", margin: "auto"}} >
            <h4>{props.title}</h4>
            <h6>Authors: {props.author}</h6>
            <a href={"/articles/" + props.index.toString()}  >View full article</a>
            <p>
                <strong>Abstract: </strong> 
                {props.abstract}
                {console.log(props)}
            </p>
        </div>
    </React.Fragment>
)

export default articleCard