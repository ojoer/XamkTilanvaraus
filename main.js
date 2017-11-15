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

    if ( (!req.body.etunimi) || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.etunimi) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita etunimesi. Etunimi voi sisältää vain kirjaimia"});

        return false;
    }
    
    if (!req.body.sukunimi || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.sukunimi) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita sukunimesi. Sukunimi voi sisältää vain kirjaimia"});

        return false;
    }

    if (!req.body.pnumero) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita puhelinnumerosi"});

        return false;
    }
    
    if (!req.body.email) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita sähköpostiosoitteesi tai tarkista oikeinkirjoitus"});

        return false;
    }

    if (!req.body.osoite || (/^[a-zA-ZåäöÅÄÖ0-9]+$/.test(req.body.osoite) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita osoitteesi"});

        return false;
    }

    if (!req.body.postiNumero) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita postinumerosi"});

        return false;
    }

    if (!req.body.postiToimipaikka || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.postiToimipaikka) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita postitoimipaikkasi"});

        return false;
    }

    console.log(req.body);
});

app.listen(8000, () => {
    
    console.log("Varauspalvelin käynnistyi porttiin 8000");
    
});
