/*eslint-disable*/ 

const express = require('express');
const https = require('https');
const fs = require('fs');
const _ = require('underscore')._;
const moment = require("moment");
const app = express();
const winston = require('winston');

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const varaukset = require("./models/varaukset");
const nodemailer = require("nodemailer");
const dateFormat = require('dateformat');
const crypto = require("crypto");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


var logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)({level : "warn"})]
});

var options = {
  appHandler: app,
  hostUrl: "https://localhost:8000",
  logger : logger
};

var payments = require(__dirname + '/../payment').create(options);

payments.on('success', function (req, res, data) {
res.redirect('http://localhost:9000/#!/kiitos');
});

payments.on('mac-check-failed', function (req, res, data) {
  res.status(400).send("<html><h1 id='mac-check-failed'>MAC-CHECK-FAILED</h1></html>");
});

payments.on('cancel', function (req, res) {
  res.status(200).send("<html><h1 id='cancel'>CANCEL</h1></html>");
});

payments.on('reject', function (req, res) {
  res.status(200).send("<html><h1 id='reject'>REJECT</h1></html>");
});

var sslOptions = {
  key: fs.readFileSync(__dirname + '/certs/server.key'),
  cert: fs.readFileSync(__dirname + '/certs/server.crt'),
  ca: fs.readFileSync(__dirname + '/certs/ca.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

app.use(express.static(__dirname + '/css'));

const Holidays = require('date-holidays')
var hd = new Holidays()

app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('/public'));




app.use((req, res, next) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
    next();
    
});

app.use(cookieParser())
app.use(session({
    secret : "kissakala",
    resave : false,
    saveUninitialized : false,
    store: new MongoStore({ url: "mongodb://XamkTilanvaraus:XamkTilanvarausSalis1@ds261745.mlab.com:61745/varaukset" }),
    cookie: {maxAge: 3600000},
    cookie: { secure: false },
    ttl: 14 * 24 * 60 * 60
}));

// app.all('*', function (req, res, next) {
//     console.log(req);
//     next(); // pass control to the next handler
//   });



hd = new Holidays('FI');


app.post('/verkkomaksu', function (req, res) {

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

    else if (!req.body.lomake.vahvistettu) {
        res.statusCode = 500;
        res.send({virhe: "Vahvista antamasi tiedot!"});

        return false;
    }
    // 
    // 
    // KAIKKI TARKISTUKSET OVAT MENNEET LÄPI!
    // 
    // 
    else {

        if(req.body.lomake.verkkomaksu){
            console.log("Verkkomaksu valittu")


            var i;
            
                var lomakeData = req.body.lomake;
                lomakeData.id = req.body.kalenteri[0].id;
                lomakeData.tilaId = req.body.kalenteri[0].tilaId;
                lomakeData.hinta = req.body.hinta;
                lomakeData.varaukset = [];
                lomakeData.luotu = new Date();
                for (i = 0; i < req.body.kalenteri.length; i++) {
        
                    lomakeData.varaukset.push({
                        aloitus : dateFormat(req.body.kalenteri[i].start, "d.m.yyyy, HH:MM"),
                        lopetus : dateFormat(req.body.kalenteri[i].end, "d.m.yyyy, HH:MM"),
                        start : req.body.kalenteri[i].start,
                        end : req.body.kalenteri[i].end,
                        hinta : req.body.kalenteri[i].hinta
                    })
        
                }

        
                varaukset.maksussaOlevaLomake(lomakeData);
                varaukset.maksussaOlevaAika(req.body.kalenteri);
                varaukset.poistaValiaikaiset(req.body.kalenteri[0].id);



            var requestId = moment().format('YYYYMMDDhhmmss');
    
            var bankForms = _.map(payments.banks, function (bankId) {
                return payments.paymentButton(bankId, {
                requestId: requestId,
                amount: req.body.hinta,
                messageForBankStatement: "Tilanvaraus maksu (TESTI)",
                messageForWebForm: "Tilanvaraus maksu (TESTI)",
                reference : payments.referenceNumbers.toFinnishPaymentReference(requestId)
                });
            });
            
            var html = "<div class='payment-buttons'>" + bankForms.join("") + "</div>";

            res.send(html);
        }

        else{
        console.log("Laskutus valittu")

        var i;

        var lomakeData = req.body.lomake;
        lomakeData.id = req.body.kalenteri[0].id;
        lomakeData.tilaId = req.body.kalenteri[0].tilaId;
        lomakeData.hinta = req.body.hinta;
        lomakeData.luotu = new Date();
        lomakeData.varaukset = [];
        console.log(req.body.kalenteri);
        for (i = 0; i < req.body.kalenteri.length; i++) {

            lomakeData.varaukset.push({
                aloitus : dateFormat(req.body.kalenteri[i].start, "d.m.yyyy, HH:MM"),
                lopetus : dateFormat(req.body.kalenteri[i].end, "d.m.yyyy, HH:MM"),
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
 
    }



});

app.post("/vahvistaMaksettuVaraus", (req, res) =>{
    varaukset.haeMaksussaOlevaLomake(req.body.id,(err,varaukset)=>{
        varaukset.tallennaTietokantaan(varaukset);
        
        varaukset.HaeMaksussaOlevaAika(req.body.id,(err,asd)=>{
            varaukset.tallennaAjat(asd);

            res.send("asd");
        });
    });
});



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



var auth = function(req, res, next) {

    console.log(req.session)
    if (req.session.tunnus == "XamkTilanvaraus"){
        console.log("Kirjautuminen vahvistettu")
        return next();
    }
      
    else
      return res.sendStatus(401);
  };

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
            console.log(req.session);
            req.session.tunnus = req.body.tunnus;
            console.log(req.session);
              res.send('asd');
            
        }
    });

    req.session.tunnus = req.body.tunnus;
    console.log(req.session);
   

});



// Access the session as req.session
// app.get('/haeAdminVaraukset', function(req, res, next) {
//     console.log(req.session)
//   if (req.session.views) {
//     req.session.views++
//     res.setHeader('Content-Type', 'text/html')
//     res.write('<p>views: ' + req.session.views + '</p>')
//     res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
//     res.end()
//   } else {
//     req.session.views = 1
//     res.end('welcome to the session demo. refresh!')
//   }
// })



app.get("/haeAdminVaraukset", (req, res) =>{

    console.log(req.body)
    varaukset.haeAdminVaraukset((err,varaukset)=>{

        res.send(varaukset);

    });

});

app.post("/poistaKokoVaraus", (req, res) =>{

console.log(req.body);

    varaukset.poistaKokoVaraus(req.body);
            res.end("Koko varaus poistettu");
});

app.post("/adminLukitse", (req, res) =>{
    
    console.log(req.body);
    
    varaukset.tallennaAjat(req.body);

    res.end("Varaus tehty");
    
    });

app.post("/poistaYksittainenVaraus", (req, res) =>{
    
    
        varaukset.poistaYksittainenVaraus(req.body, (err,varaukset)=>{
            res.send(varaukset);
        });
    
    });


app.post("/haeAdminVarauksetMuokkaukseen", (req, res) =>{

    console.log(req.body);

    varaukset.haeAdminVarauksetMuokkaukseen(req.body, (err,varaukset)=>{
                res.send(varaukset);
            });

});

app.post("/adminMuokkaaVarausta", (req, res) =>{
    
        varaukset.adminMuokkaaVarausta(req.body, (err,asd)=>{
            if(!asd){

                for (i = 0; i < req.body.aikatiedot.length; i++) {
                    req.body.aikatiedot[i].id = req.body.varaustiedot[0].id
                    varaukset.adminMuokkaaKalenteria(req.body.aikatiedot[i], (err,varaukset)=>{
                        console.log("asd");
                    });
                };

                
            }
        });
    
    });


var server = https.createServer(sslOptions, app);

exports = module.exports = server;
exports.use = function() {
  app.use.apply(app, arguments);
};
