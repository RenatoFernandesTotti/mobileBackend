const router = require('express').Router()
const db = admin.firestore()
const { getVendorID } = require('../../../lib/vendor')

//Criação de um novo cliente
router.post('/newClient', async (req, res) => {
    try {
        let info = req.body

        console.log(info);

        db.collection('vendors').doc(info.uid).collection('clients').add({
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

    } catch (error) {
        res.status(500).send(error)
    }
})


//retorna todos os clientes para um vendedor
router.get('/allClients', async (req, res) => {
    let query = await db.collection('vendors').doc(req.query.uid).collection("clients").get()
    let clients = []
    query.forEach(element => {
        clients.push(element.data())
    });

    res.send(clients)
})




module.exports = router