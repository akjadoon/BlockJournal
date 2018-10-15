import React from 'react'
import {Card, CardContent, CardDescription} from 'semantic-ui-react'

const user = (props) => {
    const style={
        margin: "auto",
        fontSize: '1.2em',
        marginBottom: "0.5em",
        width: "45vw",
        textAlign: 'left'
        
    }

    return(
    <div style={style}>
    <Card fluid >
        <Card.Content header={props.firstName + " " + props.lastName} meta={props.organization} ></Card.Content>
        <Card.Content >
            <Card.Description>
                <strong>Rating:</strong> {props.rating}
            </Card.Description>
            <Card.Description>
                <strong>Reviewed </strong>{props.numReviewed} articles
            </Card.Description>
            <Card.Description>
            <strong>Email: </strong>{props.email}
            </Card.Description>
            <Card.Description>
            <strong>    Public Address: </strong>{props.publicAddress}
            </Card.Description>
        </Card.Content>
    </Card>
    </div>
)
}
export default user;