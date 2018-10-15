import React, {Component} from 'react'
import axios from 'axios'

import User from './User/User'
import user from './User/User';

class Users extends Component {
    state = {
        users: []
    }

    
    componentDidMount(){
        axios.get('/users/list').then(res=> {
            const users = res.data.users;
            this.setState({users: users});
        })
    }


    render(){
        const users = this.state.users;
        let usersToRender= null;
        if (users.length > 0){
            
            usersToRender = Array.from(Array(users.length).keys()).map((i) => 
            <User key={i} firstName={users[i].firstName}  lastName={users[i].lastName} organization={users[i].organization} numReviewed={users[i].reviewed} rating={users[i].rating} email={users[i].email} publicAddress={users[i].address} />
        )
        }
        return(
            <div>{usersToRender}</div>
            
        )
    }
}

export default Users

