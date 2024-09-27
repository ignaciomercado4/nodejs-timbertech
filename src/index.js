import express from "express";

// init
const app = express();

// settings
app.set('port', process.env.PORT || 3000);

// middleware

// routes

// public files

// run server
app.listen(app.get('port'), () => {
    console.log('Server running on port ', app.get('port'))
});