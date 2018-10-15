var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var bcrypt = require('bcryptjs')
var sigUtil = require('eth-sig-util');

var mongoose = require('mongoose')
var nev = require('email-verification')(mongoose)
mongoose.connect("mongodb://admin:adminpassurop2018@ds031661.mlab.com:31661/journaldb")

var admin = require('firebase-admin');
var serviceAccount = require('./block-journal-firebase-adminsdk-9q0jj-c7684dc8b0.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://block-journal.firebaseio.com"
  });
var db = admin.database();
var ref = db.ref()

var User = require('./rec/userModel');


var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

var abiFile = require('./smartcontract/build/contracts/Journal.json');
var contract = web3.eth.contract(abiFile['abi']);
var contractInstance = contract.at('0x345ca3e014aaf5dca488057592ee47305d9b3e10');

// let regEvent = contractInstance.Register({}, {fromBlock: 0, toBlock: 'latest'});
// regEvent.get((error, logs)=> {logs.forEach(log=> console.log(log.args.reciever + web3.toAscii(log.args.email).replace(/\u0000/g, '')))});




nev.configure({
    verificationURL: 'http://localhost:8000/api/email-verification/${URL}',
    persistentUserModel: User,
    expirationTime: 600, // 10 minutes
 
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'votingjournalservice@gmail.com',
            pass: 'dappsuccess1'
        }
    },
    passwordFieldName: 'pw',

}, function(err, options){
    if (err) {
        console.log(err);
        return;
    }

    console.log('configured: ' + (typeof options === 'object'));
});

nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

// Express stuff =========================
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json()); // <--- Here
app.use(bodyParser.urlencoded());
app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: __dirname
    });
});

app.post('/api/register', function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var organization = req.body.UniOrComp;
    var email = req.body.email;
    var address = req.body.address;
    console.log(req.body);
    // register button was clicked
    if (req.body.type === 'register') {
        var newUser = new User({
            email: email,
            address: address
        });

        nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
            if (err) {
                return res.status(404).send('ERROR: creating temp user FAILED');
            }

            // user already exists in persistent collection
            if (existingPersistentUser) {
                return res.json({
                    msg: 'You have already signed up and confirmed your account. Did you forget your password?'
                });
            }

            // new user created
            if (newTempUser) {
                var URL = newTempUser[nev.options.URLFieldName];

                nev.sendVerificationEmail(email, URL, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending verification email FAILED');
                    }
                    res.json({
                        msg: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    });
                    var tempUserRef = ref.child('temp-users')
                    tempUserRef.child(address).set({
                        firstName: firstName,
                        lastName: lastName,
                        organization: organization,
                        address: address,
                        email: email
                    })

                });

                // user already exists in temporary collection!
            } else {
                res.json({
                    msg: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });

        // resend verification button was clicked
    } else {
        nev.resendVerificationEmail(email, function(err, userFound) {
            if (err) {
                return res.status(404).send('ERROR: resending verification email FAILED');
            }
            if (userFound) {
                res.json({
                    msg: 'An email has been sent to you, yet again. Please check it to verify your account.'
                });
            } else {
                res.json({
                    msg: 'Your verification code has expired. Please sign up again.'
                });
            }
        });
    }
});


// user accesses the link that is sent
app.get('/api/email-verification/:URL', function(req, res) {
    var url = req.params.URL;

    nev.confirmTempUser(url, function(err, user) {
        if (user) {
            nev.sendConfirmationEmail(user.email, function(err, info) {
                if (err) {
                    return res.status(404).send('ERROR: sending confirmation email FAILED');
                }
                //Write email + Pass association to blockchain. 
                res.json({
                    msg: 'CONFIRMED!',
                    info: info
                });

                // Write new user to blockchain
                ref.child('temp-users').child(user.address).once('value', function(data){
                    const userData = {
                        firstName:data.val()['firstName'],
                        lastName: data.val()['lastName'],
                        organization: data.val()['organization'],
                        address: data.val()['address'],
                        email: data.val()['email'],
                        nonce: Math.floor(Math.random() * 1000000),
                        reviewed: 0,
                        rating: "None"
                    }
                    ref.child('users').child(user.address).set(userData);
                });

                contractInstance.register(user.address, user.email);
            });
        } else {
            return res.status(404).send('ERROR: confirming temp user FAILED');
        }
    });
});

app.get('/api/users', function(req,res){
    const publicAddress = req.query.publicAddress;
    ref.child('users').child(publicAddress).once('value', function(data){
        if(data.exists()){
            res.json({
                nonce: data.val()['nonce'],
                found: true
            }) 
        } else {
            res.json({
                nonce: "",
                found: false
            })
        }
    })

})


app.get('/api/users/list', function(req, res){
    let users = [];
    ref.child('users').orderByChild('rating').once('value', function(data){
        data.forEach(pers => {
            users.push(pers.val())
            console.log("USERS")
        })
        // console.log(data.val())
        // console.log('__________')
    }).then(()=>{
        res.json({
            users: users
        })
    }
    )
})

app.post('/api/auth', function(req, res){
    const publicAddress = req.query.publicAddress;
    var signedNonce = req.body.signedNonce;
    
    ref.child('users').child(req.query.publicAddress).once('value').then(function(data){
    
        const msgParams = [  {
            type: 'string',      // Any valid solidity type
            name: 'nonce',     // Any string label you want
            value: data.val()['nonce']
         }]
        console.log(signedNonce)
 
        const recovered = sigUtil.recoverTypedSignature({
            data: msgParams,
            sig: signedNonce
          })
          if (recovered === publicAddress ) {
            res.json({
                message: 'successfully proven'
            })


            const update = {nonce: Math.floor(Math.random() * 1000000)};
            ref.child('users').child(req.query.publicAddress).update(update);
          } else {
            res.json({
                message: 'failed to prove'
            })
          }
    })
})

app.listen(8000);
console.log('Express & NEV example listening on 8000...');