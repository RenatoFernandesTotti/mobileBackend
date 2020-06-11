const router = require('express').Router()
const db = admin.firestore()
const { getVendorID } = require('../../../lib/vendor')

//Cria um novo produto
router.post('/newProduct', async (req, res) => {
    try {
        let info = req.body
        console.log(info);

        db.collection('vendors').doc(info.uid).collection('products').add({
            "price": info.price,
            "name": info.name,
            "qnty": info.qnty,
            "brand": info.brand
        })
        res.send("ok")
    } catch (error) {
        console.log(error);
        res.send(error)

    }
})

//retorna um produto para um vendedor, caso nenhum nome seja passado volta todos
//os produtos de um vendedor
router.get('/getProduct', async (req, res) => {
    try {
        let info = req.body
        let query
        let products = []
        if (info.prodctName === undefined) {
            query = await db.collection('vendors').doc(info.uid).collection('products').get()
        } else {
            query = await db.collection('vendors').doc(info.uid).collection('products').where('name', '==', info.prodctName).get()
        }
        
        if (query.empty) {
            console.log('No matching documents.');
            throw "query empty"
        }

        query.forEach(element => {
            products.push(element.data())
        });
        return res.send(products)

    } catch (error) {
        console.log(error);

        res.send(error)
    }
})

//altera um produto buscando-o pelo seu nome
router.put('/alterProduct', async (req, res) => {
    try {

        let info = req.body
        let data = info.data
        let id
        let ref = await db.collection('vendors').doc(info.uid).collection('products').where('name', '==', info.prodctName).limit(1).get()
        ref.forEach(ele => {
            id = ele.id
        })
        await db.collection('vendors').doc(info.uid).collection('products').doc(id).update(data)
        res.send('ok')
    } catch (error) {
        console.log(error);
        res.status(500).send(error)

    }
})

//deleta um produto
router.delete('/deleteProduct', async (req, res) => {
    try {

        let info = req.body
        let data = info.data
        let id
        let ref = await db.collection('vendors').doc(info.uid).collection('products').where('name', '==', info.prodctName).limit(1).get()
        ref.forEach(ele => {
            id = ele.id
        })
        await db.collection('vendors').doc(info.uid).collection('products').doc(id).delete()
        res.send('ok')
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

module.exports = router