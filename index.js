const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sublease = require('mongoose-sublease')
const subleaseMiddleware = require('mongoose-sublease/express')
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb://murilo:senha@localhost/admin?authSource=admin')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

const clientSchema = new mongoose.Schema({
    name: String,
    client_db: String,
    active: Boolean,
})

const getTenant = sublease(mongoose.connection, {
    User: userSchema,
    Client: clientSchema
})

var main_db = getTenant('main')

app.use(bodyParser.json());

app.use(function(req, res, next) {
    if(req.path == '/addclient' || req.path == '/getclient')
        next()

    main_db.model('Client')
    .findOne({client_db: req.headers["client_db"]}).then(function(client){
        if(client == null || client.active == false){
            res.status(401).json({error: "Cliente não encontrado!"});
        }else{
            req.client = client
            next();
        }
    })
})

app.post('/addclient', function(req, res){
    console.log(req.body);
    main_db.model('Client')
    .create(req.body.client).then(function(user){
        res.json({user: user});
    })
})

app.get('/getclient', function(req, res){
    main_db.model('Client')
    .find().then(function(clients){
        res.json({clients: clients})
    })
})

app.post('/add', function(req, res){
    var client_db = getTenant(req.client.client_db)
    client_db.model('User')
    .create(req.body.user).then(function(user){
        res.json({user: user});
    })
});

app.get('/', function (req, res) {
    var client_db = getTenant(req.client.client_db)
    client_db.model('User').find().then(function(users){
        res.json({users:users});
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});