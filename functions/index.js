//Pacotes locais
const functions = require('firebase-functions');
const exp = require('express')
const app = exp()
var cors = require('cors')
//chaves de acesso

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
const serviceAccount = require("./keys/revendoo-mobile-firebase-adminsdk-wdsqf-93698eb8c7.json");
const firebaseConfig = require('./keys/firebaseConfig.json')

app.use(cors(corsOptions))

//app globais
global.admin = require('firebase-admin');
global.firebase = require('firebase')
global.upTime=new Date

//funcoes globais
global.checkAuth = async (req, res, next) => {
    try {
        console.log(req.headers.authorization.split(" ")[1]);
        let tok = await admin.auth().verifyIdToken(req.headers.authorization.split(" ")[1], true)
        return next()
    } catch (error) {
        res.status(401).send(error)
    }
}



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://revendoo-mobile.firebaseio.com"
});
firebase.initializeApp(firebaseConfig);

app.use(require('./routes/router'))




exports.app = functions.https.onRequest(app);



