/*eslint-disable */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const varaukset = require("./models/varaukset");

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

app.post("/valiaikainenVaraus", (req, res) => {

    varaukset.tallenna(req.body);
    res.send("Onnistui");

});

app.post("/tallennaKalenteriin", (req, res) => {
    
        varaukset.tallennaAjat(req.body);
        res.send("Onnistui");
    
    });

app.post("/haeVarausTiedotLomakkeelle", (req, res) =>{

    varaukset.haeLomakkeelle(req.body, (err, rows) => {
        console.log(rows)
        res.send(rows);
    });

});

app.get("/haeVarausTiedot", (req, res) =>{
    varaukset.haeAjat((err,varaukset)=>{
        
       console.log(varaukset)
        res.send(varaukset);
    });
});

app.post("/tallennaVaraus", (req, res) => {


    if ( (!req.body.etunimi) || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.etunimi) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita etunimesi. Etunimi voi sisältää vain kirjaimia"});

        return false;
    }
    
    else if (!req.body.sukunimi || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.sukunimi) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita sukunimesi. Sukunimi voi sisältää vain kirjaimia"});

        return false;
    }

    else if (!req.body.pnumero) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita puhelinnumerosi"});

        return false;
    }
    
    else if (!req.body.email) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita sähköpostiosoitteesi tai tarkista oikeinkirjoitus"});

        return false;
    }

    else if (!req.body.osoite || (/^[a-zA-ZåäöÅÄÖ0-9]+$/.test(req.body.osoite) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita osoitteesi"});

        return false;
    }

    else if (!req.body.postiNumero) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita postinumerosi"});

        return false;
    }

    else if (!req.body.postiToimipaikka || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.postiToimipaikka) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita postitoimipaikkasi"});

        return false;
    }

    else{
        varaukset.tallennaTietokantaan(req.body);
    }

    
});

app.listen(8000, () => {
    
    console.log("Varauspalvelin käynnistyi porttiin 8000");
    
});
