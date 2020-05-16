const router = require('express').Router()

router.use(require('./client'))
router.use(require('./product'))
router.use(require('./sales'))
module.exports = router