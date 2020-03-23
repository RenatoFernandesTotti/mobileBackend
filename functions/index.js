//Pacotes locais
const functions = require('firebase-functions');
const exp = require('express')
const app = exp()
//chaves de acesso
const serviceAccount = require("./keys/revendoo-mobile-firebase-adminsdk-wdsqf-e77d237d15.json");
const firebaseConfig = require('./keys/firebaseConfig.json')

//app globais
global.admin = require('firebase-admin');
global.firebase = require('firebase')

//funcoes globais
global.checkAuth = async (req, res, next) => {
    try {
        console.log(req.headers.authorization.split(" ")[1]);
        
        let tok = await admin.auth().verifyIdToken(req.headers.authorization.split(" ")[1], true)
        next()
    } catch (error) {
        res.status(401).send(error)
    }
}



global.checkParam = (params, property, fallbackValue) => {
    return params.hasOwnProperty(property) ? params[property] : fallbackValue
}




admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://revendoo-mobile.firebaseio.com"
});
firebase.initializeApp(firebaseConfig);

app.use(require('./routes/router'))




exports.app = functions.https.onRequest(app);



