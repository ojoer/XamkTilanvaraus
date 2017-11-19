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

app.get("/haeVarausTiedot", (req, res) =>{
    varaukset.haeAjat((err,varaukset)=>{
        
        res.send(varaukset);
    });
});

app.get("/haeValiaikaistenVarausTiedot", (req, res) =>{
    varaukset.haeValiaikaisetAjat((err,varaukset)=>{
        
        res.send(varaukset);
    });
});



app.post("/valiaikainenVaraus", (req, res) => {

    var data =req.body;

    for(var i = 0; i<req.body.length;i++){

        data[i].startit = [];

        var aloitus = parseInt(req.body[i].start.slice(11,13))-1;
        var lopetus = parseInt(req.body[i].end.slice(11,13))-1;
        var loopMaara = lopetus - aloitus;

        for(var j = 0; j<loopMaara;j++){
            
            aloitus ++;
            var a = req.body[i].start;

            if(aloitus == 8){
                aloitus = "08"
            }

            if(aloitus == 9){
                aloitus = "09"
            }
            var b = aloitus.toString();

            var leikkaus = a.slice(0,11);
            var yhdistys = leikkaus.concat(b) + ":00:00";


            data[i].startit.push({start:yhdistys});
            

        }

    }

    var virheet = [];
    
     for(var i = 0; i < data.length;i++){

        varaukset.tarkistaOnkoValiaikaistaVarausta(data[i], (err, rows) => {
            if(rows.length === 0){
                return true;
            }
            else if(rows.length != 0){
                virheet.push({
                    virhe: "Tilaa ollaan jo varaamassa ajankohdalle: " + rows[0].start + " - " + rows[0].end + ". Lataa sivu uudestaan nähdäksesi tuoreimman varaustilanteen."
                });
                res.statusCode =500;
                res.end(JSON.stringify(virheet));
            }
            
        });
    }console.log(virheet)
    

});

app.post("/tallennaKalenteriin", (req, res) => {
    
        varaukset.tallennaAjat(req.body);
        res.send("Onnistui");
    
    });

app.post("/haeVarausTiedotLomakkeelle", (req, res) =>{

    varaukset.haeLomakkeelle(req.body, (err, rows) => {
        res.send(rows);
    });

});



app.post("/tallennaVaraus", (req, res) => {

    if ( (!req.body.lomake.etunimi) || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.lomake.etunimi) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita etunimesi. Etunimi voi sisältää vain kirjaimia"});

        return false;
    }
    
    else if (!req.body.lomake.sukunimi || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.lomake.sukunimi) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita sukunimesi. Sukunimi voi sisältää vain kirjaimia"});

        return false;
    }

    else if (!req.body.lomake.pnumero || (/^[0-9]+$/.test(req.body.lomake.pnumero) === false) || req.body.lomake.pnumero.length < 10) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita puhelinnumerosi tai tarkista oikeinkirjoitus"});

        return false;
    }
    
    else if (!req.body.lomake.email) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita sähköpostiosoitteesi tai tarkista oikeinkirjoitus"});

        return false;
    }

    else if (!req.body.lomake.osoite || (/^[a-zA-ZåäöÅÄÖ0-9\s]+$/.test(req.body.lomake.osoite) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita osoitteesi"});

        return false;
    }

    else if (
        !req.body.lomake.postiNumero || 
        req.body.lomake.postiNumero.length < 5
        || req.body.lomake.postiNumero.length > 5
        || (/^[0-9]+$/.test(req.body.lomake.postiNumero) === false)
    ) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita postinumerosi"});

        return false;
    }

    else if (!req.body.lomake.postiToimipaikka || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.lomake.postiToimipaikka) === false)) {
        res.statusCode = 500;
        res.send({virhe: "Kirjoita postitoimipaikkasi"});

        return false;
    }

    else if (!req.body.lomake.lasku && !req.body.lomake.verkkomaksu ) {
        res.statusCode = 500;
        res.send({virhe: "Valitse maksutapa"});

        return false;
    }

    else{

        var lomakeData = req.body.lomake;
        lomakeData.id = req.body.kalenteri[0].id;
        lomakeData.tilaId = req.body.kalenteri[0].tilaId;
        lomakeData.start = req.body.kalenteri[0].start;
        lomakeData.end = req.body.kalenteri[0].end;

        varaukset.tallennaTietokantaan(lomakeData);
        varaukset.tallennaAjat(req.body.kalenteri);
        varaukset.poistaValiaikaiset(req.body.kalenteri[0].id);

       
    }

    
});

app.listen(8000, () => {
    
    console.log("Varauspalvelin käynnistyi porttiin 8000");
    
});
