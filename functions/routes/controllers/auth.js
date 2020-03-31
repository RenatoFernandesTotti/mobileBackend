const router = require('express').Router()
const bodyParser = require('body-parser')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));


router.post('/register', async (req, res) => {
    try {
        let result = await firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send(error)
    }

})

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

router.post('/logout', async (req, res) => {
    try {
        let user = await admin.auth().getUserByEmail(req.body.email)
        //await admin.auth().revokeRefreshTokens(req.body.uid)
        res.status(200).send(user)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }

})

module.exports = router