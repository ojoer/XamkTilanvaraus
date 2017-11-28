/*eslint-disable */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const varaukset = require("./models/varaukset");
const nodemailer = require("nodemailer");
const dateFormat = require('dateformat');
const crypto = require("crypto");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// dateFormat.i18n  = {
//     dayNames: [
//         'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su',
//         'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'
//     ],
//     monthNames: [
//         'Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'elo', 'Syys', 'Loka', 'Marras', 'Joulu',
//         'Tammikuu', 'Helmikuu', 'Maaliskuu', 'HuhtiKuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Huhtikuu'
//     ],
//     timeNames: [
//         'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
//     ]
// };

const Holidays = require('date-holidays')
var hd = new Holidays()

app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use(session({
    secret : "kissakala",
    resave : false,
    saveUninitialized : false,
    store: new MongoStore({ url: "mongodb://XamkTilanvaraus:XamkTilanvarausSalis1@ds261745.mlab.com:61745/varaukset" }),
    cookie: {maxAge: 60},
    ttl: 60
}));

app.use((req, res, next) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
    next();
    
});





hd = new Holidays('FI');


app.post("/haeVarausTiedot", (req, res) =>{

    varaukset.haeAjat(req.body.tilaId, (err,varaukset)=>{

        res.send(varaukset);
    });
});

app.post("/haeValiaikaistenVarausTiedot", (req, res) =>{
    varaukset.haeValiaikaisetAjat(req.body.tilaId,(err,varaukset)=>{
        
        res.send(varaukset);
    });
});



app.post("/valiaikainenVaraus", (req, res) => {

    var data =req.body;
    var tuntiHinta;

    console.log(data[0])


    if(data[0].tilaId == "Mikpolisali"){
        tuntiHinta = 160.00;
    }

    if(data[0].tilaId == "Kuitula"){
        tuntiHinta = 200.00;
    }

    if(data[0].tilaId == "MB123"){
        tuntiHinta = 60.00;
    }

    if(data[0].tilaId == "MA325"){
        tuntiHinta = 80.00;
    }

    if(data[0].tilaId == "Vintti"){
        tuntiHinta = 90.00;
    }

    for(var i = 0; i<req.body.length;i++){

        data[i].startit = [];

        var aloitus = parseInt(req.body[i].start.slice(11,13))-1;
        var lopetus = parseInt(req.body[i].end.slice(11,13))-1;
        var loopMaara = lopetus - aloitus;

        data[i].hinta = tuntiHinta * loopMaara;
        data[i].luotu = new Date();

        data[i].aloitus = dateFormat(req.body[i].start, "d.m.yyyy, HH:MM");
        data[i].lopetus = dateFormat(req.body[i].end, "d.m.yyyy, HH:MM");

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
        console.log(data[i]);
    }

     for(var i = 0; i < data.length;i++){


        varaukset.tarkistaOnkoValiaikaistaVarausta(data[i], (err, rows) => {
            if(rows.length === 0){
                return true;
            }
            else if(rows.length != 0){

                var virhe = "Tilaa ollaan jo varaamassa ajankohdalle: " + rows[0].start + " - " + rows[0].end + ". Lataa sivu uudestaan nähdäksesi tuoreimman varaustilanteen."

                lahetaVastaus(virhe);
                
            }

        });
 
    }



    var virheet = [];
    var asd = 0;
    var lahetaVastaus = function(virheTeksti){
        
        asd++;
        console.log(asd)

        if(virheTeksti.length > 0){
            virheet.push({
                virhe: virheTeksti
            });
            if(asd == data.length){
                
                res.statusCode =500;
                res.end(JSON.stringify( virheet) );
                asd = 0;
            }
        }

        
    };

    res.send("Väliaikaiset varaukset tehty");
    

});

app.post("/tallennaKalenteriin", (req, res) => {
    
        varaukset.tallennaAjat(req.body);
        res.send("Onnistui");
    
    });

app.post("/haeVarausTiedotLomakkeelle", (req, res) =>{

    varaukset.haeLomakkeelle(req.body, (err, rows) => {
        console.log(rows);
        var i;
        
        for (i = 0; i < rows.length; i++) {
            // rows[i].start = dateFormat(rows[i].start, "d.m.yyyy, HH:MM");
            // rows[i].end = dateFormat(rows[i].end, "d.m.yyyy, HH:MM");
        }
        res.send(rows);
    });

});



app.post("/tallennaVaraus", (req, res) => {

    if (req.body.kalenteri.length == 0) {
        res.statusCode = 500;
        res.send({virhe: "Tiloja ei ole valittu. Ole hyvä ja siiry etusivulle aloittaaksesi varauksen teon."});

        return false;
    }

    else if ( (!req.body.lomake.etunimi) || (/^[a-zA-ZåäöÅÄÖ]+$/.test(req.body.lomake.etunimi) === false)) {
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

    else {

        var i;

        var lomakeData = req.body.lomake;
        lomakeData.id = req.body.kalenteri[0].id;
        lomakeData.tilaId = req.body.kalenteri[0].tilaId;
        lomakeData.varaukset = [];
        console.log(req.body.kalenteri);
        for (i = 0; i < req.body.kalenteri.length; i++) {

            lomakeData.varaukset.push({
                start : req.body.kalenteri[i].start,
                end : req.body.kalenteri[i].end,
                hinta : req.body.kalenteri[i].hinta
            })

        }

        

        
        
        varaukset.tallennaTietokantaan(lomakeData);
        varaukset.tallennaAjat(req.body.kalenteri);
        varaukset.poistaValiaikaiset(req.body.kalenteri[0].id);

        var emailTeksti = "";
        var i;

        var now = new Date();
        
        
        
        for (i = 0; i < req.body.kalenteri.length; i++) {
            console.log(dateFormat(req.body.kalenteri[i].start, "isoDate") + dateFormat(req.body.kalenteri[i].start, "isoTime"));
            emailTeksti += '<p>' +  dateFormat(req.body.kalenteri[i].start, "d.m.yyyy, HH:MM") + ' - ' + dateFormat(req.body.kalenteri[i].end, "HH:MM") + '</p>'  
        }

        if(lomakeData.lasku == true){
            lomakeData.maksutapa = "Lasku"
        }
        else if(lomakeData.verkkomaksu == true){
            lomakeData.maksutapa = "Verkkomaksu"
        }


        var emailPohja = '<div>' + 
        '<h3>Varauttu tila:</h3>' +
        '<p>' + lomakeData.tilaId + '</p>' +

        '<h3>Tilauksen tunnus:</h3>' +
        '<p>' + lomakeData.id + '</p>' +

        '<h3>Päivämäärä(t):</h3>' +
        emailTeksti +

        '<h3>Varaajan yhteystiedot:</h3>' +
        '<h4>Etunimi:</h4>'
        + '<p>' + lomakeData.etunimi + '</p>' + 

        '<h4>Sukunimi:</h4>'
        + '<p>' + lomakeData.sukunimi + '</p>' + 
        
        '<h4>Puhelinnumero:</h4>'
        + '<p>' + lomakeData.pnumero + '</p>' + 

        '<h4>Osoite:</h4>'
        + '<p>' + lomakeData.osoite + '</p>' + 

        '<h4>Postitoimipaikka:</h4>'
        + '<p>' + lomakeData.postiToimipaikka + '</p>' + 

        '<h4>Postinumero:</h4>'
        + '<p>' + lomakeData.postiNumero + '</p>' + 

        '<h4>Maksutapa:</h4>'
        + '<p>' + lomakeData.maksutapa + '</p>' + 

        '</div>';

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: 'XamkTilanvaraus@gmail.com',
              pass: 'XamkTilanvarausSalis'
            }
          });
        var mailOptions = {
            from: 'XamkTilanvaraus@gmail.com',
            to: lomakeData.email,
            subject: 'Tilausvahvistus',
            text: "Tilausvahvistuksen tiedot",
            html: emailPohja
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error.message);
              res.send({virhe: error.message})
            } else {
              console.log('Tilausvahvistus lähetetty: ' + info.response);
              res.end("Sähköpostin lähetys onnistui");
            }
          });
 
    }

});



app.post("/haeAsiakkaanAjat", (req, res) =>{
    
    varaukset.haeAsiakkaanTiedot(req.body.id, (err,tiedot)=>{
        if(tiedot.length > 0){
            lisaaVaraukset(tiedot);
            varaukset.haeAsiakkaanAjat(req.body.id, (err,ajat)=>{
                lisaaVaraukset(ajat);
            });
        }
        else if(tiedot.length == 0){
            res.statusCode = 500;
            res.send({virhe: "Varaustietoja ei löydy. Tarkista varaustunnuksesi"});
        }

    });

    var varaustiedot = {};
    var dsa = 0;
    var lisaaVaraukset = function(dataaaaa){
     
        dsa++;
        if(dsa == 1){
            
            varaustiedot.tilaId = dataaaaa[0].tilaId,
            varaustiedot.id = dataaaaa[0].id,
            varaustiedot.etunimi = dataaaaa[0].etunimi,
            varaustiedot.sukunimi = dataaaaa[0].sukunimi,
            varaustiedot.pnumero = dataaaaa[0].pnumero,
            varaustiedot.email = dataaaaa[0].email,
            varaustiedot.osoite = dataaaaa[0].osoite,
            varaustiedot.postiNumero = dataaaaa[0].postiNumero,
            varaustiedot.postiToimipaikka = dataaaaa[0].postiToimipaikka,
            varaustiedot.maksutapa = dataaaaa[0].maksutapa
        }
        
        if(dsa == 2){
            var i;
            varaustiedot.ajat = [];
            
            for (i = 0; i < dataaaaa.length; i++) {
                varaustiedot.ajat.push(
                    {
                        alkaa: dateFormat(dataaaaa[i].start, "dddd, d.m.yyyy, HH:MM"),
                        loppuu: dateFormat(dataaaaa[i].end, "dddd, d.m.yyyy, HH:MM"),
                        hinta: dataaaaa[i].hinta
                    }
                );
            }

            res.send(varaustiedot);
            
        }
        
        
    };

    
});

app.post("/poistaAsiakkaanVaraukset", (req, res) =>{

    var poistettu = 0;

    for (i = 0; i < req.body.varaukset.ajat.length; i++) {
        if(req.body.varaukset.ajat[i].selected){
            poistettu++;
            var data = {
                id : req.body.varaukset.id,
                start: dateFormat(req.body.varaukset.ajat[i].alkaa, "yyyy-dd-mm'T'HH:MM:ss"),
                end: dateFormat(req.body.varaukset.ajat[i].loppuu, "yyyy-dd-mm'T'HH:MM:ss")
            }

            // var now = new Date();
            // now.setDate(now.getDate()+7);
            // dateFormat(now, "yyyy-dd-mm'T'HH:MM:ss");
            // var testi = Date.parse(data.start);
            // console.log(testi);
            // testi.getDate();
            // // if(now.getDate()+7 )


            varaukset.poistaAsiakkaanVarauksetKalenterista(data);
        }

        else{
            console.log("Tätä ei poisteta");
        }
        
    }

    console.log(poistettu);
    if(poistettu == 0){
            res.statusCode = 500;
            res.send({virhe: "Valitse peruutettavat ajat"});
    }

    else if(req.body.varaukset.ajat.length == poistettu){
        varaukset.poistaAsiakkaanVaraukset(req.body.varaukset.id);
        res.send("Kaikki varaukset poistettu");
    }

    else{
        res.send("Valitut varaukset on poistettu");
    }
    

});

app.post("/adminKirjaudu", (req, res) =>{

    let kirjautumisTiedot = req.body;
    
    kirjautumisTiedot.salasana = crypto.createHash("SHA256").update(req.body.salasana).digest("hex");



    varaukset.kirjauduSisaan(kirjautumisTiedot, (err,tiedot)=>{
        if(err){
            console.log(err)
        }

        else if(tiedot.length == 0){
            
            res.statusCode = 500;
            res.send({virhe: "Käyttäjätunnus tai salasana virheellinen. Tarkista oikeinkirjoitus."});

        }

        else if(tiedot.length == 1){
            req.session.tunnus = tiedot[0].tunnus;
            res.send('asd');
            
        }
    });

});

app.get("/haeAdminVaraukset", (req, res) =>{


    varaukset.haeAdminVaraukset((err,varaukset)=>{
        
        for (i = 0; i < varaukset.length; i++) {
            
            for (j = 0; j < varaukset[i].varaukset.length; j++) {
                varaukset[i].varaukset[j].start = dateFormat(varaukset[i].varaukset[j].start, "d.m.yyyy, HH:MM");
                varaukset[i].varaukset[j].end = dateFormat(varaukset[i].varaukset[j].end, "d.m.yyyy, HH:MM");
            }
            
        }

        res.send(varaukset);

    });

});

app.post("/poistaKokoVaraus", (req, res) =>{

console.log(req.body);

    varaukset.poistaKokoVaraus(req.body, (err,varaukset)=>{
                // res.send(varaukset);
            });

});

app.post("/poistaYksittainenVaraus", (req, res) =>{
    
    console.log(req.body);
    
        varaukset.poistaYksittainenVaraus(req.body, (err,varaukset)=>{
            res.send("varaukset");
            console.log(varaukset)
        });
    
    });

app.listen(8000, () => {
    
    console.log("Varauspalvelin käynnistyi porttiin 8000");
    
});
