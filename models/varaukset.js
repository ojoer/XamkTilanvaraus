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

        haeAjat : (callback) => {
                
                db.collection("kalenteri").find().toArray((err,result)=>{
                callback(err,result);
                // db.collection("varaukset").drop();
                // db.collection("valiaikaisetVaraukset").drop();
                // db.collection("kalenteri").drop();
                });
        },

        tallennaAjat : (data, err) => {
               db.collection("kalenteri").insert(data);
       },

        haeLomakkeelle : (data, callback) => {
                
                db.collection("valiaikaisetVaraukset").find({'id':data.id}).toArray((err,result)=>{
                        
                callback(err,result);
                  // db.collection("varaukset").drop();
                });
        },

        tallenna : (data, err) => {
                 if(err){
                         throw err
                 }
                db.collection("valiaikaisetVaraukset").insert(data);
        },

        tallennaTietokantaan : (data, err) => {
                if(err){
                        throw err
                }
               db.collection("varaukset").insert(data);
       },

};