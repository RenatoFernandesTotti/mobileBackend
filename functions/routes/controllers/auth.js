const router = require('express').Router()
const bodyParser = require('body-parser')
const db = admin.firestore()
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

//Registro de uma conta com senha e email, assim que uma conta nova é criada
//automaticamente o servido ja a marca como logada
router.post('/register', async (req, res) => {
    try {
        let info =req.body
        console.log(info);
        
        let result = await firebase.auth().createUserWithEmailAndPassword(info.email, info.password)
        result = JSON.stringify(result)
        result = JSON.parse(result)

        
        db.collection("vendors").doc(result.user.uid).set({
            "name": info.name,
            "email": info.email,
            "phoneNumber": info.phoneNumber,
            "dateBirth": info.dateBirth,
            "CNPJ": info.cnpj,
            "CPF": info.cpf,
            "address": {
                "streetName": info.streetName,
                "houseNumber": info.houseNumber,
                "borough": info.borough,
                "cityName": info.cityName,
                "CEP": info.CEP
            },
            "products":{},
            "clients":{}
        })
        
        res.status(200).send({
            "uid": result.user.uid,
            "email": result.user.email,
            "auth": {
                "token": result.user.stsTokenManager.accessToken,
                "expires": result.user.stsTokenManager.expirationTime
            }
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).send(error)
    }

})

//login de uma conta por meio de email e senha
router.post('/login', async (req, res) => {
    try {
        let result = await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
        result = JSON.stringify(result)
        result = JSON.parse(result)
        res.status(200).send({
            "uid": result.user.uid,
            "email": result.user.email,
            "auth": {
                "token": result.user.stsTokenManager.accessToken,
                "expires": result.user.stsTokenManager.expirationTime
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }

})

//Para o logou os token sao invalidados conforma requisitado
router.post('/logout', async (req, res) => {
    try {
        let user = await admin.auth().getUserByEmail(req.body.email)
        console.log(user);
        await admin.auth().revokeRefreshTokens(user.uid)
        res.status(200).send(user)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }

})

module.exports = router