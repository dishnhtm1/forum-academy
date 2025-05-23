// const express = require('express');
// const { submitApplication } = require('../controllers/applicationController');
// const router = express.Router();

// router.post('/', submitApplication);

// module.exports = router;

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Make sure applicationController.createApplication exists and is a function
router.post('/', applicationController.createApplication);

router.get('/', applicationController.getApplications);
router.get('/:id', applicationController.getApplicationById);

module.exports = router;