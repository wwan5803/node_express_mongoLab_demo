const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
const config = require("./config")

var db;
var username;
var password;
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
if(process.env.NODE_ENV === 'production'){
    username = config.production.dbuser;
    password = config.production.dbpassword;
}else{
    username = config.dev.dbuser;
    password = config.dev.dbpassword;
}

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

app.set('view engine', 'ejs')
console.log('username', username)


MongoClient.connect(`mongodb://${username}:${password}@ds255797.mlab.com:55797/star-wars-quotes`, (err, client) => {
    if (err) return console.log(err);
    db = client.db('star-wars-quotes');  
    app.listen(3000, function(){
        console.log('listen to 3000 port')
    })

    app.get('/', (req, res)=>{
        db.collection('quotes').find().toArray((err, result)=>{
            console.log('result', result)
            res.render('index.ejs', {quotes: result})        
        });
    
        // res.sendFile(__dirname + '/index.html')
    })
    
    app.post('/quotes', (req, res) => {
        console.log(req.body)
        db.collection('quotes').save(req.body, (err, result) => {
            if(err) return console.log(err)
            res.redirect('/')
        })
      })
    
})
