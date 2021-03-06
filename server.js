let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')


let app = express()
let db

let port = process.env.PORT
if (port == null || port == "") {
  port = 3000
}

let connectionString = 'mongodb+srv://dbTodoApp:ipaSoDSiHtCq695z@cluster0.cifvz.mongodb.net/todoApp?retryWrites=true&w=majority'

mongodb.MongoClient.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db()
  app.listen(port)
})

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({extended: false}))

app.use(passwordProtection);

function passwordProtection(req, res, next) {
  res.set('WWW-Authenticate','Basic real="Simple Todo App"')
  if(req.headers.authorization == "Basic bGVhcm46anM=") {
    next()
  } else {
    res.status(401).send('Error Auhentication')
  }
}

app.get('/', function(req, res) {
  db.collection('items').find().toArray(function(err, items) {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
    <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App!</h1>
    
    <div class="jumbotron p-3 shadow-sm">
    <form id="formTodo" action="/create-item" method="POST">
    <div class="d-flex align-items-center">
    <input id="inputTodo" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
    <button class="btn btn-primary">Add New Item</button>
    </div>
    </form>
    </div>
    
    <ul id="listTodo" class="list-group pb-5">
    </ul>
    
    </div>
    <script>let items = ${JSON.stringify(items)}</script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/browser.js"></script>
    </body>
    </html>`)
  });
  
})

// app.post('/create-item', function(req, res) {
//   db.collection('items').insertOne({text: req.body.item}, function() {
//     res.redirect('/')
//   })
// })

// app.post('/create-item', function(req, res) {
//   db.collection('items').insertOne({text: req.body.text}, function(error, info) {
//     res.json(info);
//   })
// })
app.post('/create-item', function(req, res) {
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} } )
  db.collection('items').insertOne({text: safeText}, function(err, response) {
    if(err) {
      res.json('Error occurred while inserting')
    } else {
      let data = {
        "_id":  response.insertedId,
        "text": req.body.text
      }
      res.json(data)
    }
  })
})


app.post('/edit-item', function(req, res) {
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} } )
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id) }, {$set: {text: safeText}}, function(){
    res.json("Edit Success")
  })
})

app.post('/delete-item', function(req, res) {
  db.collection('items').deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, function() {
    res.json("Delete Success")
  })
})

