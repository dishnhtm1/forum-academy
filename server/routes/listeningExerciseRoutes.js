const express = require('express');
const router = express.Router();
const {
  getListeningExercises,
  getListeningExercise,
  createListeningExercise,
  updateListeningExercise,
  deleteListeningExercise,
  getAudioFile,
  upload
} = require('../controllers/listeningExerciseController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public audio route (no authentication required for audio streaming)
// @route   GET /api/listening-exercises/audio/:id
// @desc    Serve audio file
// @access  Public (for better browser compatibility)
router.get('/audio/:id', (req, res, next) => {
  // Add specific CORS headers for audio requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
}, getAudioFile);

// Test endpoint to check audio file info
// @route   GET /api/listening-exercises/test-audio/:id  
// @desc    Test audio file info
// @access  Public
router.get('/test-audio/:id', async (req, res) => {
  try {
    const ListeningExercise = require('../models/ListeningExercise');
    const exercise = await ListeningExercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    res.json({
      exerciseId: exercise._id,
      title: exercise.title,
      audioFile: exercise.audioFile,
      audioUrl: exercise.audioFile ? `${req.protocol}://${req.get('host')}/api/listening-exercises/audio/${exercise._id}` : null,
      hasAudioFile: !!exercise.audioFile?.gridfsId,
      serverInfo: {
        protocol: req.protocol,
        host: req.get('host'),
        userAgent: req.get('user-agent'),
        origin: req.get('origin')
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint for audio file headers
// @route   HEAD /api/listening-exercises/audio/:id  
// @desc    Get audio file headers for debugging
// @access  Public
router.head('/audio/:id', (req, res, next) => {
  // Add specific CORS headers for audio requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges, Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
}, getAudioFile);

// All other routes require authentication
router.use(protect);

// @route   GET /api/listening-exercises
// @desc    Get all listening exercises
// @access  Private
router.get('/', getListeningExercises);

// @route   GET /api/listening-exercises/:id
// @desc    Get single listening exercise
// @access  Private
router.get('/:id', getListeningExercise);

// @route   POST /api/listening-exercises
// @desc    Create new listening exercise
// @access  Private (Faculty/Admin)
router.post('/', authorize('faculty', 'admin'), upload.single('audioFile'), createListeningExercise);

// @route   PUT /api/listening-exercises/:id
// @desc    Update listening exercise
// @access  Private (Faculty/Admin)
router.put('/:id', authorize('faculty', 'admin'), upload.single('audioFile'), updateListeningExercise);

// @route   DELETE /api/listening-exercises/:id
// @desc    Delete listening exercise
// @access  Private (Faculty/Admin)
router.delete('/:id', authorize('faculty', 'admin'), deleteListeningExercise);

module.exports = router;