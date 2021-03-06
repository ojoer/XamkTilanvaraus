/* eslint-disable */

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
let db;


mongoClient.connect("mongodb://XamkTilanvaraus:XamkTilanvarausSalis1@ds261745.mlab.com:61745/varaukset",(err,yhteys)=>{
    db = yhteys;
    console.log("Yhteys MongoBD-tietokantaan avattu!");
    
        db.createCollection('varaukset', function(err, collection) {});
        db.createCollection('valiaikaisetVaraukset', function(err, collection){});
        db.createCollection('kalenteri', function(err, collection) {});
        db.createIndex("valiaikaisetVaraukset" ,{ "luotu": 1 }, { expireAfterSeconds: 1800 } )

    
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

        haeAsiakkaanTiedot : (data, callback) => {
                db.collection("varaukset").find({
                        'id' : data
                }).toArray((err,result)=>{
                        callback(err,result);
                });
        },

        haeAsiakkaanAjat : (data, callback) => {
                db.collection("kalenteri").find({
                        'id' : data
                }).toArray((err,result)=>{
                        callback(err,result);
                });
        },

        poistaAsiakkaanVarauksetKalenterista : (data, err) => {
                console.log(data);
                db.collection("kalenteri").remove({
                        'id':data.id,
                        'start':data.start,
                        'end':data.end        
                });
        },

        poistaAsiakkaanVaraukset : (data, err) => {
                console.log("data");
                db.collection("varaukset").remove({
                        'id':data,        
                });
        },

        kirjauduSisaan : (data, callback) => {
                db.collection("henkilokunta").find({
                        'tunnus' : data.tunnus,
                        'salasana' : data.salasana
                }).toArray((err,result)=>{
                        callback(err,result);
                });
        },

        haeAdminVaraukset : (callback) => {
                db.collection("varaukset").find().toArray((err,result)=>{
                        callback(err,result);
                });
         },

         poistaKokoVaraus : (data, callback) => {
                db.collection("varaukset").remove({
                        'id' : data.id
                });
                
                db.collection("kalenteri").remove({
                        'id' : data.id
                });
         },

         poistaYksittainenVaraus : (data, callback) => {

                console.log(data);
                db.collection("varaukset").update(
                        {},
                        { $pull: 
                                { varaukset: 
                                        { $in: [data.aikatiedot] }
                                } 
                        }
                )


                db.collection("varaukset").find({
                        'id' : data.varaustiedot.id
                }).toArray((err,result)=>{
                        callback(err, result)
                });
         },

         haeAdminVarauksetMuokkaukseen : (data, callback) => {
                db.collection("varaukset").find({'id' : data.id}).toArray((err,result)=>{
                        callback(err,result);
                });
         },

         adminMuokkaaVarausta : (data, callback) => {

                delete data.varaustiedot[0]._id;
                console.log(data);
                db.collection("varaukset").updateMany(
                {'id' :   data.varaustiedot[0].id},
                { $set: data.varaustiedot[0] })

                
           
         },

        adminMuokkaaKalenteria : (data, callback) => {
                
        console.log(data);

        db.collection("varaukset").updateMany(
                {'id' :   data.id},
                { $set: { varaukset: 
                        { $in: [data] }
                }  })

        // db.collection("kalenteri").updateMany(
        // {'id' :   data.id},
        // { $set: data })

        
        },

};