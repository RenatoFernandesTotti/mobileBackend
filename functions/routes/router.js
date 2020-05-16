const router = require('express').Router()
const parser=require('body-parser')
router.use(parser.json())
router.use(parser.urlencoded({extended: true}));
router.use(require('./controllers/auth'))
router.use(require('./controllers/welcome'))
router.use(require('./controllers/database/router'))
module.exports = router