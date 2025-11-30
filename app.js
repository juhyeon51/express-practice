const express = require('express');
const logger = require('morgan');
const axios = require('axios');
const firebase = require('./firebase');

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(logger('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/user/:id', (req, res) => {
    res.send(`User id is ${req.params.id}`);
})

app.get('/user', (req, res) => {
    res.send(`User id is ${req.query.id}`);
})

// curl -X POST localhost:3000/user -d '{"id" : "juhyeon51", "name" : "Ju Hyeon"}' -H "Content-Type: application/json"
app.post('/user', (req, res) => {
    console.log(req.body.name);
    res.send(req.body);
})

// curl localhost:3000/musicSearch/aespa | jq
app.get('/musicSearch/:term', async (req, res) => {
    const params = {
        term : req.params.term,
        entity : "album",
    }
    var response = await axios.get('https://itunes.apple.com/search', {params : params});
    console.log(response.data);
    res.json(response.data);
})

// curl localhost:3000/likes
app.get('/likes', async (req, res) => {
    var db = firebase.firestore();
    const snapshot = await db.collection('likes').get().catch(e => console.log(e));
    var results = [];
    if (snapshot.empty) {
        console.log("No result");
        res.json([]);
        return;
    } else {
        snapshot.forEach(doc => {
            results.push(doc.data())
        })
        res.json(results);
    }
})

app.post('/likes', async (req, res) => {
    let item = req.body;
    let db = firebase.firestore();
    let r = await db.collection('likes').doc(item.collectionId.toString()).set(item);

    res.json({msg : 'OK'});
})

app.delete('/likes/:id', async (req, res) => {
    let db = firebase.firestore();
    let r = await db.collection('likes').doc(req.params.id).delete();

    res.json({msg : 'OK'});
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})