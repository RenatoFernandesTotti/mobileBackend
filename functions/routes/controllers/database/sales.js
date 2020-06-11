const router = require('express').Router()
const db = admin.firestore()
router.post('/newSale', async (req, res) => {
    try {

        let info = req.body
        let batch = db.batch()
        let sale = await db.collection('vendors').doc(info.uid).collection('sales').add({
            "dateIssued": new Date(),
            "payment": info.payment
        })
        let saleRef = sale._path.segments.pop()
        let products = info.products


        let prodNames = []
        let prodUp = {}

        for (const key in products) {
            prodNames.push(products[key].name)
        }

        let prods = await db.collection('vendors').doc(info.uid).collection('products').where('name', 'in', prodNames).get()

        if (prods.empty) {
            console.log('No matching documents.');
            throw new Error("query empty")
        }

        let docs = prods.docs;

        for (let doc of docs) {
            prodUp[doc.data().name] = { id: doc.id, data: doc.data() }
        }
        console.log(prodUp);
        for (const key in products) {
            let name = products[key].name
            prodUp[name].data.qnty -= products[key].qnty
        }
        console.log(prodUp);
        //     
        for (const key in prodUp) {
            if (prodUp.hasOwnProperty(key)) {
                const prod = prodUp[key];
                batch.update(db.collection('vendors').doc(info.uid).collection('products').doc(prod.id), prod.data)
            }
        }

        for (const prod of products) {
            batch.set(db.collection('vendors').doc(info.uid).collection('sales').doc(saleRef).collection('products').doc(), prod)
        }

        batch.commit()

        res.send("test")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})

router.get("/getSales", async (req, res) => {
    try {
        let info = req.query
        let sales = await db.collection('vendors').doc(info.uid).collection('sales').get()
        let docs = sales.docs
        let dataToSend = []
        for (let doc of docs) {
            let data = doc.data()
            console.log(data);

            data.prods = []
            /* eslint-disable no-await-in-loop */
            let prod = await doc.ref.collection('products').get()
            let salesdoc = prod.docs

            for (const docProd of salesdoc) {
                data.prods.push(docProd.data())
            }

            dataToSend.push(data)

        }
        console.log(dataToSend);


        res.send(dataToSend)

    } catch (error) {
        console.log(error);

    }
})


module.exports = router



