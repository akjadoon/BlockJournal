import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import sigUtil from 'eth-sig-util'
import {BrowserRouter, Route, Link} from 'react-router-dom'

import {Navbar, Nav, NavItem} from 'react-bootstrap'


import Articles from './Components/Articles/Articles'
import Article from './Components/Articles/Article/Article';
import SignUp from './Components/SignUp/SignUp'
import Users from './Components/Users/Users'

class App extends Component {

  state = {
    address: "",
    web3: null
  }

  checkUserExists = () => {
    //Send account address and signed message
    //Verify that the message was written by user and
    //Verify that user exists on blockchain eventlogs
    //If yes continue
    //If no, 404 or something 

  }

  getDumbData = () => {
    const data = [
        {key: 0,title: "Equihash: Asymmetric Proof-of-Work Based on the Generalized Birthday Problem", author: "Alex Biryukov,	Dmitry Khovratovich", abstract: "Proof-of-work is a central concept in modern cryptocurrencies and denial-ofservice protection tools, but the requirement for fast verification so far has made it an easy prey for GPU-, ASIC-, and botnet-equipped users. The attempts to rely on memory-intensive computations in order to remedy the disparity between architectures have resulted in slow or broken schemes. In this paper we solve this open problem and show how to construct an asymmetric proof-of-work (PoW) based on a computationally-hard problem, which requires a great deal of memory to generate a proof (called a ”memory-hardness” feature) but is instant to verify. Our primary proposal, Equihash, is a PoW based on the generalized birthday problem and enhanced Wagner’s algorithm for it. We introduce the new technique of algorithm binding to prevent cost amortization and demonstrate that possible parallel implementations are constrained by memory bandwidth. Our scheme has tunable and steep time-space tradeoffs, which impose large computational penalties if less memory is used. Our solution is practical and ready to deploy: a reference implementation of a proof-of-work requiring 700 MB of RAM runs in 15 seconds on a 2.1 GHz CPU, increases the computations by a factor of 1000 if memory is halved, and presents a proof of just 120 bytes long."},
        {key: 1, title: "Ring Confidential Transactions", author: "Shen Noether,	Adam Mackenzie,	the Monero Research Lab", abstract: "This article introduces a method of hiding transaction amounts in the strongly decentralized anonymous cryptocurrency Monero. Similar to Bitcoin, Monero is a cryptocurrency which is distributed through a proof-of-work “mining” process having no central party or trusted setup. The original Monero protocol was based on CryptoNote, which uses ring signatures and one-time keys to hide the destination and origin of transactions. Recently the technique of using a commitment scheme to hide the amount of a transaction has been discussed and implemented by Bitcoin Core developer Gregory Maxwell. In this article, a new type of ring signature, A Multilayered Linkable Spontaneous Anonymous Group signature is described which allows one to include a Pedersen Commitment in a ring signature. This construction results in a digital currency with hidden amounts, origins and destinations of transactions with reasonable efficiency and verifiable, trustless coin generation. The author would like to note that early drafts of this were publicized in the Monero Community and on the #bitcoin-wizards IRC channel. Blockchain hashed drafts are available showing that this work was started in Summer 2015, and completed in early October 2015. An eprint is also available at http://eprint.iacr.org/2015/1098. "},
        {key: 2, title: "Game Channels for Trustless Off-Chain Interactions in Decentralized Virtual Worlds", author:"Daniel Kraft" , abstract: "Blockchains can be used to build multi-player online games and virtual worlds that require no central server. This concept is pioneered by Huntercoin, but it leads to large growth of the blockchain and heavy resource requirements. In this paper, we present a new protocol inspired by payment channels and sidechains that allows for trustless off-chain interactions of players in private turn-based games. They are usually performed without requiring space in the public blockchain, but if a dispute arises, the public network can be used to resolve the conflict. We also analyze the resulting security guarantees and describe possible extensions to games with shared turns and for near real-time interaction. Our proposed concept can be used to scale Huntercoin to very large or even infinite worlds and to enable almost real-time interactions between players. "}
    ]

    return data
  }

  getEthAddress = () =>{

  }

  //Write a method to sign arbitrary hash 
  componentWillMount = () =>{
    let web3 = null;

    if (typeof window.web3 !== 'undefined') {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    this.setState({web3: web3});
    web3.eth.getAccounts((error, accounts) => this.setState({address: accounts[0]}, () => console.log(this.state)));
  }

  

  signer = (web3) => {
    const msgParams = [
      {
        type: 'string',      // Any valid solidity type
        name: 'Message',     // Any string label you want
        value: 'Hi, Alice!'  // The value to sign
     },
     {   
       type: 'uint32',
          name: 'A number',
          value: '1337'
      }
    ]   
    // Get the current account:
    web3.eth.getAccounts(function (err, accounts) {
      if (!accounts) return
      signMsg(msgParams, accounts[0])
    })
    function signMsg(msgParams, from) {
      web3.currentProvider.sendAsync({
        method: 'eth_signTypedData',
        params: [msgParams, from],
        from: from,
      }, function (err, result) {
        if (err) return console.error(err)
        if (result.error) {
          return console.error(result.error.message)
        }
        const recovered = sigUtil.recoverTypedSignature({
          data: msgParams,
          sig: result.result 
        })
        if (recovered === from ) {
          alert('Recovered signer: ' + from)
        } else {
          alert('Failed to verify signer, got: ' + result)
        }
      })
    }
  }

  render() {

    
    
    
    

    const nav =
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">BlockJournal</Link>  
          </Navbar.Brand>       
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="/articles">Articles</NavItem>
          <NavItem eventKey={2} href="/reviewers">Reviewers</NavItem>
        </Nav>      
      </Navbar>
    


    return (
      <BrowserRouter>

        <div className="App">
          {nav}
          <Route path="/" exact render={(props) => <SignUp {...props} address={this.state.address} web3={this.state.web3} />} />
          <Route path="/articles/:id" render={(props) => <Article {...props} data={this.getDumbData()} />}  />
          <Route path="/articles"  exact component={Articles} />
          <Route path="/reviewers"  exact component={Users} />

        </div> 
      </BrowserRouter>

    );
  }
}

export default App;
