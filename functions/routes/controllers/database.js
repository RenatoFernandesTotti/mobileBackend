const router = require('express').Router()
const db = admin.firestore()

async function getVendorID(email) {
    let result = await admin.auth().getUserByEmail(email)

    return result.uid
}

router.post('/newClient', async (req, res) => {
    let info =req.body
    let uid = await getVendorID(info.email)
    console.log(uid);

    db.collection('vendors').doc(uid).collection('clients').add({
        "name": info.name,
        "CPF": info.cpf,
        "address": {
            "streetName": info.streetName,
            "houseNumber": info.houseNumber,
            "borough": info.borough,
            "cityName": info.cityName,
            "CEP": info.CEP
        }
    })
    res.send('ok')
})

router.get('/allClients', async (req, res) => {
    let uid = await getVendorID(req.query.email)

    res.send(req.body)
})



module.exports = router