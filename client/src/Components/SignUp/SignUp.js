import React, {Component} from 'react'
import {Button, Form, Message, Header} from 'semantic-ui-react'
import axios from 'axios'
import sigUtil from 'eth-sig-util'

class SignUp extends Component {
    
    state = {
        firstName: "",
        lastName: "",
        UniOrComp: "",
        email: "",
        emailError: false,
        formError: false,
        submitSuccess: false,
        loginError: false
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value }, ()=>{
            
        });
    }

    handleEmailChange = (evt) => {
        const emailError = (!/^.+@.+\..+$/.test(evt.target.value));
        this.setState({email: evt.target.value, emailError: emailError }, ()=>{
            console.log(this.state.email)
            console.log(this.state.emailError)
        });
    }

    handleSubmit = () => {
        if (this.state.firstName.length < 3 || this.state.lastName.length < 3 || this.state.UniOrComp.length < 3 || this.state.emailError ){
            this.setState({formError: true})
        } else {
            const body = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                UniOrComp: this.state.UniOrComp,
                email: this.state.email,
                address: this.props.address,
                type: "register"
            }
            axios.post('/register', body).then(res => {
                console.log(res)
                this.setState({formError: false, submitSuccess: true});
            })
            .catch(error => {
                console.log(error)
            })
           

        }
    }

    handleSignIn = () => {

        axios.get('/users?publicAddress=' + this.props.address).then(res => {
            if (res.data.found == false){
                this.setState({loginError: true})
            } else {

                const msgParams = [
                    {   
                        type: 'string',
                        name: 'nonce',
                        value: res.data.nonce
                    }
                ]
                const from = this.props.address;

                this.props.web3.currentProvider.sendAsync({
                    method: 'eth_signTypedData',
                    params: [msgParams, from],
                    from: from,
                  }, function (err, result) {
                    if (err) return console.error(err)
                    if (result.error) {
                      return console.error(result.error.message)
                    }
                    
                    const body = {
                        signedNonce: result.result
                    }
                 
                    axios.post('/auth?publicAddress='+ from, body).then(res=>{
                        console.log(res)
                    })

                  })
               
            
            }
        })
    }

    render() {
        const style = {
            width: "50vw",
            margin: "auto",
            fontSize: "1.3em",
            textAlign: "left"
        }
        
        const {firstName, lastName, UniOrComp, email} = this.state;
        let loginErrorMessage = null;
        if (this.state.loginError) {
            loginErrorMessage = <Message warning>You have not registered an account yet</Message>;
        }


        return(
            <React.Fragment>
                <Form style={style} error={this.state.formError} success={this.state.submitSuccess}>
                    
                    <Header as='h1'>
                        Existing User
                        
                        <Header.Subheader>Make sure MetaMask is enabled to Login</Header.Subheader>
                    </Header>
                    <hr/>
                    <Button size='huge' type='submit' onClick={this.handleSignIn}>One Click Login</Button>
                    {loginErrorMessage}
                    <h1 >New User</h1>
                    <hr/>
                    <Form.Field>
                        <label>First Name</label>
                        <Form.Input placeholder='First Name' type="text" maxLength="20" name="firstName" value={firstName} onChange={this.handleChange} >
                        </Form.Input>
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <Form.Input placeholder='Last Name' type="text" maxLength="20" name="lastName" value={lastName} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>University/Company</label>
                        <Form.Input placeholder='University or Company' type="text" maxLength="30" name="UniOrComp" value={UniOrComp} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Email</label>
                        <Form.Input placeholder='Email' type="text" maxLength="30" name="email" value={this.state.email} onChange={evt => this.handleEmailChange(evt)} error={this.state.emailError} />
                    </Form.Field>
                    <Form.Field>
                        <Message>
                            <p>
                                Install Meta Mask for your Browser before registering. We will use it to automatically retrieve your Public Key. 
                                <a href='https://metamask.io/' target="_blank"> https://metamask.io/ </a>
                            </p>
                        </Message>
                    </Form.Field>
                    <Message error header="Invalid Input" />
                    <Message success header="Verification Email Sent!" />
                    <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
                </Form>
            </React.Fragment>
        );
    }

}

export default SignUp