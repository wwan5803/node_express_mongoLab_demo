const MongoClient = require('mongodb').MongoClient

var state = {
    db: null,
  }
  

exports.connect = function(url, done) {
if (state.db) return done()

MongoClient.connect(url, function(err, client) {
    if (err) return done(err)
    state.db = client.db('star-wars-quotes');  
    done()
})
}

exports.get = () => {
    return state.db
}

exports.close = (done) => {
    if(state.db) {
        state.db.close((err, result)=>{
            state.db = null;
            done(err)
        })
    }
}