const express = require('express');
let books = require("./booksdb.js");
const { default: axios } = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Username or password not provided" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve) => {
        resolve(JSON.stringify(books, null, 4));
    }).then((successData) => {
        res.send(successData);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve) => {
        const isbn = req.params.isbn;
        resolve(books[isbn]);
    }).then((successData) => {
        res.send(successData);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    new Promise((resolve) => {
        const author = req.params.author;
        let matchingBooks = [];

        for (var i in books) {
            let details = books[i];

            if (details && details.author === author)
                matchingBooks.push(books[i]);
        }

        resolve(JSON.stringify(matchingBooks, null, 4));
    }).then((successData) => {
        res.send(successData);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    new Promise((resolve) => {
        const title = req.params.title;
        let matchingBooks = [];

        for (var i in books) {
            let details = books[i];

            if (details && details.title === title)
                matchingBooks.push(books[i]);
        }

        resolve(JSON.stringify(matchingBooks, null, 4));
    }).then((successData) => {
        res.send(successData);
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    let reviews = [];

    if (book)
        reviews = book.reviews;

    res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
