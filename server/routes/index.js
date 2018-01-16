var router = require("express").Router();
var db = require('../db')

router.get('/', (req, res)=>{
    db.get().collection('quotes').find().toArray((err, result)=>{
        console.log('result', result)
        res.render('index.ejs', {quotes: result})        
    });

    // res.sendFile(__dirname + '/index.html')
})

router.post('/quotes', (req, res) => {
    if(!req.body.name || !req.body.quotes){
        res.status(404).send({ error: 'name and quotes is required' })
    }
    db.get().collection('quotes').save(req.body, (err, result) => {
        if(err) return console.log(err)
        res.redirect('/')
    })
  })


module.exports = router;