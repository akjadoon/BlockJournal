
//Get instance of smart contract 
var contract;
Journal.deployed().then(function(instance){contract =instance} );()

//Get Register event
let regEvent = contract.Register({}, {fromBlock: 0, toBlock: 'latest'})

//Get Register event filtered for a particualr address
let regEvent = contract.Register({user: userAddress}, {fromBlock: 0, toBlock: 'latest'})

//Get log arguments
regEvent.get((error, logs) => {logs.forEach(log => console.log(log.args))})

//Get emails to ascii
regEvent.get((error, logs) => {logs.forEach(log => console.log(web3.toAscii(log.args.email)))})

//    geth --fast --cache=1048 --testnet --unlock "0x78b4f8d9f1424ae3d2c66c531b7b57c02eaf93c6" --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr localhost --rpcport 8545


