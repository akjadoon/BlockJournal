import React, {Component} from 'react'
import ArticleCard from './ArticleCard/ArticleCard'

class Articles extends Component{

    
  getDumbData = () => {
    const data = [
        {key: 0,title: "Equihash: Asymmetric Proof-of-Work Based on the Generalized Birthday Problem", author: "Alex Biryukov,	Dmitry Khovratovich", abstract: "Proof-of-work is a central concept in modern cryptocurrencies and denial-ofservice protection tools, but the requirement for fast verification so far has made it an easy prey for GPU-, ASIC-, and botnet-equipped users. The attempts to rely on memory-intensive computations in order to remedy the disparity between architectures have resulted in slow or broken schemes. In this paper we solve this open problem and show how to construct an asymmetric proof-of-work (PoW) based on a computationally-hard problem, which requires a great deal of memory to generate a proof (called a ”memory-hardness” feature) but is instant to verify. Our primary proposal, Equihash, is a PoW based on the generalized birthday problem and enhanced Wagner’s algorithm for it. We introduce the new technique of algorithm binding to prevent cost amortization and demonstrate that possible parallel implementations are constrained by memory bandwidth. Our scheme has tunable and steep time-space tradeoffs, which impose large computational penalties if less memory is used. Our solution is practical and ready to deploy: a reference implementation of a proof-of-work requiring 700 MB of RAM runs in 15 seconds on a 2.1 GHz CPU, increases the computations by a factor of 1000 if memory is halved, and presents a proof of just 120 bytes long."},
        {key: 1, title: "Ring Confidential Transactions", author: "Shen Noether,	Adam Mackenzie,	the Monero Research Lab", abstract: "This article introduces a method of hiding transaction amounts in the strongly decentralized anonymous cryptocurrency Monero. Similar to Bitcoin, Monero is a cryptocurrency which is distributed through a proof-of-work “mining” process having no central party or trusted setup. The original Monero protocol was based on CryptoNote, which uses ring signatures and one-time keys to hide the destination and origin of transactions. Recently the technique of using a commitment scheme to hide the amount of a transaction has been discussed and implemented by Bitcoin Core developer Gregory Maxwell. In this article, a new type of ring signature, A Multilayered Linkable Spontaneous Anonymous Group signature is described which allows one to include a Pedersen Commitment in a ring signature. This construction results in a digital currency with hidden amounts, origins and destinations of transactions with reasonable efficiency and verifiable, trustless coin generation. The author would like to note that early drafts of this were publicized in the Monero Community and on the #bitcoin-wizards IRC channel. Blockchain hashed drafts are available showing that this work was started in Summer 2015, and completed in early October 2015. An eprint is also available at http://eprint.iacr.org/2015/1098. "},
        {key: 2, title: "Game Channels for Trustless Off-Chain Interactions in Decentralized Virtual Worlds", author:"Daniel Kraft" , abstract: "Blockchains can be used to build multi-player online games and virtual worlds that require no central server. This concept is pioneered by Huntercoin, but it leads to large growth of the blockchain and heavy resource requirements. In this paper, we present a new protocol inspired by payment channels and sidechains that allows for trustless off-chain interactions of players in private turn-based games. They are usually performed without requiring space in the public blockchain, but if a dispute arises, the public network can be used to resolve the conflict. We also analyze the resulting security guarantees and describe possible extensions to games with shared turns and for near real-time interaction. Our proposed concept can be used to scale Huntercoin to very large or even infinite worlds and to enable almost real-time interactions between players. "}
    ]

    return data
  }

    



    render(){
        var dumbData = this.getDumbData();
        const articlesInfo = Array.from(Array(dumbData.length).keys()).map((i) => 
            <ArticleCard key={i} index={i}  title={dumbData[i].title} author={dumbData[i].author} abstract={dumbData[i].abstract.slice(1, 1000) + "..."} />
        )

        return(
            <div >
                {articlesInfo}
            </div>
        )
    }
}

export default Articles