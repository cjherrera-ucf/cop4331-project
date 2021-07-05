// Init
var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080;
var path = require('path');
app.use(express.json());


// const request = require("request");
const async = require("async");
// const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.JWT_SECRET) {
    console.error("[ERROR] Environment variables are not set!");
    console.debug(`[DEBUG] JWT_SECRET=${process.env.DB_USERNAME}`);
    console.debug(`[DEBUG] DB_USERNAME=${process.env.DB_USERNAME}`);
    try {
        console.debug(`[DEBUG] DB_PASSWORD=${(process.env.DB_PASSWORD).substring(0, 3)}**********`);
    } catch(err) {
        console.debug(`[DEBUG] DB_PASSWORD=(null)`);
    }
}
// security guard
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 40) {
    console.error("[WARNING] The JWT secret defined is not secure enough! If the secret is guessable, you might as well not have passwords! Remedy this ASAP.");
}

// Note: make sure you authenticate correctly!
    const MongoClient = require('mongodb').MongoClient;
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qaihg.mongodb.net/HotelManagement?retryWrites=true&w=majority`;
    const db_client = new MongoClient(uri, { useNewUrlParser: true });
    db_client.connect();

console.log(`[HospitalityPlatform] Server running on port ${port}`);

global.errGen = (errCode, desc) => {
    if (!desc) {
        let desc = "Something bad happened.";
        if (errCode == 400) desc = "Asset already exists.";
        else if (errCode == 401) desc = "You are not logged in.";
        else if (errCode == 403) desc = "You do not have permission to view this asset.";
        else if (errCode == 404) desc = "Asset not found.";
        else if (errCode >= 400 && errCode < 500) desc = "Malformed request.";
        else if (errCode >= 500 && errCode < 600) desc = "The server is having some issues. Please report this!";
        else if (errCode == 200) desc = "Success!";
    }
    return {
        "err_code": errCode,
        "description": desc
    }
}

let api = require('./api.js');
api.setApp( app, db_client );

// Web server stuff.
app.all("/", (req, res) => {
    let options = {
        root: path.join(__dirname, 'static'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    res.send("<h1>Hello COP4331</h1>");
})
app.all("/static/:file", (req, res) => {
    let options = {
        root: path.join(__dirname, 'static'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    res.sendFile(req.params.file, options);
})

app.listen(port);
