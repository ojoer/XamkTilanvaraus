/* eslint-disable */

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
let db;


mongoClient.connect("mongodb://XamkTilanvaraus:XamkTilanvarausSalis1@ds261745.mlab.com:61745/varaukset",(err,yhteys)=>{
    db = yhteys;
    console.log("Yhteys MongoBD-tietokantaan avattu!");
    
    db.createCollection('varaukset', function(err, collection) {});
    db.createCollection('valiaikaisetVaraukset', function(err, collection) {});
    db.createCollection('kalenteri', function(err, collection) {});
    
});


module.exports = {

        haeAjat : (data, callback) => {
                // db.collection("varaukset").drop();
                // db.collection("valiaikaisetVaraukset").drop();
                // db.collection("kalenteri").drop();
                db.collection("kalenteri").find({
                        'tilaId' : data
                }).toArray((err,result)=>{
                callback(err,result);
                
                });
        },

        haeValiaikaisetAjat : (data, callback) => {
                
                db.collection("valiaikaisetVaraukset").find({
                        'tilaId' : data
                }).toArray((err,result)=>{
                        callback(err,result);
                });
        },

        tarkistaOnkoValiaikaistaVarausta : (data, callback) => {
                var ensimmainenPaiva = data.startit[0].start;
                var pituus = data.startit.length -1;
                var viimeinenPaiva = data.startit[pituus].start;

                db.collection("valiaikaisetVaraukset").find({
                        "startit.start": {$gte : ensimmainenPaiva, $lte: viimeinenPaiva},
                        "tilaId": data.tilaId
                }).toArray((err,result)=>{


                        if(result.length === 0){
                                console.log("Ei varauksia");
                                db.collection("valiaikaisetVaraukset").insert(data);
                                callback(err,result);
                        }
                        else{
                                console.log("Tilaa " + result[0].tilaId + " ollaan jo varaamassa valitulle ajankohdalle");
                                callback(err,result);
                        }    
                });


                
                },

        tallennaValiaikainen : (data, err) => {
                if(err){
                        throw err
                }
                db.collection("valiaikaisetVaraukset").insert(data);
        },

        haeLomakkeelle : (data, callback) => {  
        
                db.collection("valiaikaisetVaraukset").find({'id':data.id}).toArray((err,result)=>{
                        
                callback(err,result);
                // db.collection("varaukset").drop();
                });
        },

        tallennaTietokantaan : (data, err) => {
                if(err){
                        throw err
                }
                db.collection("varaukset").insert(data);
       },

        tallennaAjat : (data, err) => {
               db.collection("kalenteri").insert(data);
        },

        poistaValiaikaiset : (data, err) => {
                db.collection("valiaikaisetVaraukset").remove({'id':data});
        },

        

        

        

};