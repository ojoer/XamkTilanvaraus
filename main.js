const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use((req, res, next) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
    next();
    
});

app.post("/tallenna", (req, res) => {


    if(req.body.etunimi){
        console.log(req.body.etunimi);
    }
    else{
        res.send("Ei etunimeä");
    }

    console.log(req.body);
});

app.listen(8000, () => {
    
    console.log("Varauspalvelin käynnistyi porttiin 8000");
    
});
