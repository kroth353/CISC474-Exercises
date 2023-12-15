const express = require("express");
const fs = require("fs");
const path = require('path');

const app = express();
const port = 8080;
 
app.use( function ( req, res, next ) {
    const { url, path: routePath } = req ;
    console.log( 'Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').' ) ;
    next();
});

app.use('/', express.static(path.join(__dirname, '')))

app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
});

app.get('/api/v1/listUsers', function(req, res) {
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        console.log (data);
        res.end(data);
    });
});

app.delete('/api/v1/deleteUser', function(req, res){
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
        data = JSON.parse(data);
        delete data["user"+req.query["user"]];
        fs.writeFile(__dirname + "/data/users.json", JSON.stringify(data), err => {
            if (err) {
            console.error(err);
            return;
        }
        });
        console.log(data);
        res.end(JSON.stringify(data));
    });
})

app.post('/api/v1/addUser', function(req, res) {
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            return;
        }

        let users = JSON.parse(data);
        const newUser = {
            name: req.query.name,
            password: req.query.password,
            profession: req.query.profession,
            id: +req.query.id
        };

        users["user"+newUser.id] = newUser;
        fs.writeFile(__dirname + "/data/" + "users.json", JSON.stringify(users), 'utf8', function(err) {
            if (err) {
                console.error(err); 
                return; 
            }
            console.log(data); 
            res.end(JSON.stringify(data)); 
        });
    });
});
app.get('/api/v1/getUser', function(req, res) {
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let users = JSON.parse(data);
        const userId = req.query.id;
        console.log('Requested user ID:', userId);

        const user = users["user" + userId];
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Found user:', user);
        res.status(200).json(user);
    });
});
