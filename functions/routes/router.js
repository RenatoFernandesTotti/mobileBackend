const router = require('express').Router()

router.use(require('./controllers/auth'))
router.use(require('./controllers/welcome'))

module.exports = router