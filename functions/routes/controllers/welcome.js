const router = require('express').Router()

router.get('/hello',(req,res)=>{
    try {  
        let message={
            message:"Server up and running! Welcome to the PA server",
            dateNow:new Date,
            dateUp:upTime
        }
        return res.send(message)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

router.get('/helloAuth',global.checkAuth,(req,res)=>{
    console.log("hallo")
    res.send("OK")
})

module.exports = router