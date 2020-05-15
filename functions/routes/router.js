const router = require('express').Router()

router.use(require('./controllers/auth'))
router.use(require('./controllers/welcome'))
router.use(require('./controllers/database'))
module.exports = router