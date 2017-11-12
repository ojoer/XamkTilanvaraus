const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const grunt = require("grunt");

app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

// grunt.tasks(['serve']);

app.post("/tallenna", (req, res) => {

    console.log("asd");

});

app.get("/", (req, res) => {
    
        console.log("asd");
    
    });

// app.listen(9000, () => {
    
//     console.log("Palvelin käynnistyi porttiin 1234");
    
// });