import React, {Component} from 'react'

class Login extends Component{


    
    render(){

        return(
            <div>
                <div>
                    <h1>Existing User</h1>
                    <button onClick={this.checkUserExists}>SIGN ON</button>
                </div>
                <div>
                    <h1>New User</h1>
                    <h3>Enter your public key and email</h3>
                    Public Key <input/> Email <input/>
                </div>
            </div>
        )
    }
}

export default Login