const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const QuizSubmission = require("../models/QuizSubmission");
const Course = require("../models/Course");
const { protect, authorize } = require("../middleware/authMiddleware");

// @route   GET /api/quizzes
// @desc    Get all quizzes
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    console.log("📚 Fetching all quizzes...");
    const { course, published } = req.query;
    let query = {};

    // Filter by course if specified
    if (course) query.course = course;

    // Filter by published status if specified
    if (published !== undefined) query.isPublished = published === "true";

    // If user is a student, only show published quizzes
    if (req.user.role === "student") {
      query.isPublished = true;
    }

    console.log("🔍 Query:", query);

    const quizzes = await Quiz.find(query)
      .populate("course", "title code")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${quizzes.length} quizzes`);

    res.json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get single quiz by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    console.log(`📖 Fetching quiz with ID: ${req.params.id}`);

    const quiz = await Quiz.findById(req.params.id)
      .populate("course", "title code")
      .populate("createdBy", "firstName lastName email");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // If user is a student, only show published quizzes
    if (req.user.role === "student" && !quiz.isPublished) {
      return res.status(403).json({ message: "Quiz not available" });
    }

    console.log(`✅ Found quiz: ${quiz.title}`);
    res.json(quiz);
  } catch (error) {
    console.error("❌ Error fetching quiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/quizzes
// @desc    Create new quiz
// @access  Private (Teacher/Admin only)
router.post(
  "/",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log("📝 Creating new quiz...");
      console.log(
        "🔐 User making request:",
        req.user.email,
        "Role:",
        req.user.role
      );
      console.log("📋 Quiz data received:", JSON.stringify(req.body, null, 2));

      const {
        title,
        description,
        course,
        timeLimit,
        attempts,
        passingScore,
        showResults,
        dueDate,
        availableTo,
        shuffleQuestions,
        shuffleOptions,
        isPublished,
        questions = [],
      } = req.body;

      console.log("🔍 Validation check - Title:", title, "Course:", course);

      // Validate required fields
      if (!title || !course) {
        console.log("❌ Validation failed: missing title or course");
        return res
          .status(400)
          .json({ message: "Title and course are required" });
      }

      // Check if course exists
      console.log("🔍 Checking if course exists...");
      const courseExists = await Course.findById(course);
      if (!courseExists) {
        console.log("❌ Course not found:", course);
        return res.status(400).json({ message: "Course not found" });
      }
      console.log("✅ Course exists:", courseExists.title);

      // Process questions and add IDs if missing
      const processedQuestions = questions.map((question) => ({
        ...question,
        id:
          question.id ||
          new Date().getTime().toString() +
            Math.random().toString(36).substr(2, 9),
      }));

      console.log("📊 Processed questions count:", processedQuestions.length);

      const quizData = {
        title,
        description,
        course,
        createdBy: req.user._id,
        timeLimit,
        attempts,
        passingScore,
        showResults,
        dueDate,
        availableTo,
        shuffleQuestions,
        shuffleOptions,
        isPublished,
        questions: processedQuestions,
      };

      console.log(
        "💾 Creating quiz with data:",
        JSON.stringify(quizData, null, 2)
      );

      const quiz = new Quiz(quizData);

      console.log("💾 Saving quiz to database...");
      const savedQuiz = await quiz.save();
      console.log("✅ Quiz saved with ID:", savedQuiz._id);

      // Populate the saved quiz
      console.log("🔄 Populating saved quiz...");
      const populatedQuiz = await Quiz.findById(savedQuiz._id)
        .populate("course", "title code")
        .populate("createdBy", "firstName lastName email");

      console.log(`✅ Quiz created successfully: ${populatedQuiz.title}`);
      console.log(
        "📊 Final quiz data:",
        JSON.stringify(populatedQuiz, null, 2)
      );

      res.status(201).json(populatedQuiz);
    } catch (error) {
      console.error("❌ Error creating quiz:", error);
      console.error("❌ Error stack:", error.stack);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   PUT /api/quizzes/:id
// @desc    Update quiz
// @access  Private (Teacher/Admin only)
router.put(
  "/:id",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(`📝 Updating quiz with ID: ${req.params.id}`);

      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Check if user owns the quiz or is admin
      if (
        quiz.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this quiz" });
      }

      // Process questions and ensure they have IDs
      if (req.body.questions) {
        req.body.questions = req.body.questions.map((question) => ({
          ...question,
          id:
            question.id ||
            new Date().getTime().toString() +
              Math.random().toString(36).substr(2, 9),
        }));
      }

      const updatedQuiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("course", "title code")
        .populate("createdBy", "firstName lastName email");

      console.log(`✅ Quiz updated: ${updatedQuiz.title}`);
      res.json(updatedQuiz);
    } catch (error) {
      console.error("❌ Error updating quiz:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   DELETE /api/quizzes/:id
// @desc    Delete quiz
// @access  Private (Teacher/Admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(`🗑️ Deleting quiz with ID: ${req.params.id}`);

      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Check if user owns the quiz or is admin
      if (
        quiz.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this quiz" });
      }

      // Also delete all submissions for this quiz
      await QuizSubmission.deleteMany({ quiz: req.params.id });

      await Quiz.findByIdAndDelete(req.params.id);

      console.log(`✅ Quiz deleted: ${quiz.title}`);
      res.json({ message: "Quiz and all submissions deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting quiz:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   POST /api/quizzes/:id/questions
// @desc    Add question to quiz
// @access  Private (Teacher/Admin only)
router.post(
  "/:id/questions",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(`➕ Adding question to quiz: ${req.params.id}`);
      console.log("📋 Question data:", JSON.stringify(req.body, null, 2));

      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Check if user owns the quiz or is admin
      if (
        quiz.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to modify this quiz" });
      }

      // Create question with unique ID
      const newQuestion = {
        ...req.body,
        id:
          new Date().getTime().toString() +
          Math.random().toString(36).substr(2, 9),
      };

      // Add question to quiz
      quiz.questions.push(newQuestion);
      await quiz.save();

      const updatedQuiz = await Quiz.findById(req.params.id)
        .populate("course", "title code")
        .populate("createdBy", "firstName lastName email");

      console.log(
        `✅ Question added to quiz. Total questions: ${updatedQuiz.questions.length}`
      );
      res.status(201).json(updatedQuiz);
    } catch (error) {
      console.error("❌ Error adding question:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   PUT /api/quizzes/:id/questions/:questionId
// @desc    Update question in quiz
// @access  Private (Teacher/Admin only)
router.put(
  "/:id/questions/:questionId",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(
        `📝 Updating question ${req.params.questionId} in quiz: ${req.params.id}`
      );

      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Check if user owns the quiz or is admin
      if (
        quiz.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to modify this quiz" });
      }

      // Find and update the question
      const questionIndex = quiz.questions.findIndex(
        (q) => q.id === req.params.questionId
      );

      if (questionIndex === -1) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Update question while preserving the ID
      quiz.questions[questionIndex] = {
        ...req.body,
        id: req.params.questionId,
      };

      await quiz.save();

      const updatedQuiz = await Quiz.findById(req.params.id)
        .populate("course", "title code")
        .populate("createdBy", "firstName lastName email");

      console.log(`✅ Question updated successfully`);
      res.json(updatedQuiz);
    } catch (error) {
      console.error("❌ Error updating question:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   DELETE /api/quizzes/:id/questions/:questionId
// @desc    Delete question from quiz
// @access  Private (Teacher/Admin only)
router.delete(
  "/:id/questions/:questionId",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(
        `🗑️ Deleting question ${req.params.questionId} from quiz: ${req.params.id}`
      );

      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Check if user owns the quiz or is admin
      if (
        quiz.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to modify this quiz" });
      }

      // Find and remove the question
      const questionIndex = quiz.questions.findIndex(
        (q) => q.id === req.params.questionId
      );

      if (questionIndex === -1) {
        return res.status(404).json({ message: "Question not found" });
      }

      quiz.questions.splice(questionIndex, 1);
      await quiz.save();

      const updatedQuiz = await Quiz.findById(req.params.id)
        .populate("course", "title code")
        .populate("createdBy", "firstName lastName email");

      console.log(
        `✅ Question deleted. Remaining questions: ${updatedQuiz.questions.length}`
      );
      res.json(updatedQuiz);
    } catch (error) {
      console.error("❌ Error deleting question:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   GET /api/quizzes/:id/submissions
// @desc    Get all submissions for a quiz
// @access  Private (Teacher/Admin only)
router.get(
  "/:id/submissions",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(`📊 Fetching submissions for quiz: ${req.params.id}`);

      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const submissions = await QuizSubmission.find({ quiz: req.params.id })
        .populate("student", "firstName lastName email")
        .sort({ submittedAt: -1 });

      console.log(`✅ Found ${submissions.length} submissions`);
      res.json(submissions);
    } catch (error) {
      console.error("❌ Error fetching submissions:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers
// @access  Private (Students)
router.post("/:id/submit", protect, async (req, res) => {
  try {
    console.log(`📝 Student submitting quiz: ${req.params.id}`);

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (!quiz.isPublished) {
      return res.status(403).json({ message: "Quiz is not available" });
    }

    // Check if quiz is still available
    const now = new Date();
    if (quiz.availableTo && now > quiz.availableTo) {
      return res
        .status(403)
        .json({ message: "Quiz submission period has ended" });
    }

    const { answers, timeSpent, startedAt } = req.body;

    // Check existing attempts
    const existingAttempts = await QuizSubmission.find({
      quiz: req.params.id,
      student: req.user._id,
    }).countDocuments();

    if (existingAttempts >= quiz.attempts) {
      return res.status(403).json({ message: "Maximum attempts exceeded" });
    }

    // Calculate score
    let score = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      let isCorrect = false;
      let pointsEarned = 0;

      if (question.type === "multiple_choice") {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        isCorrect = correctOption && answer.answer === correctOption.text;
      } else if (question.type === "true_false") {
        isCorrect = answer.answer === question.correctAnswer;
      } else if (question.type === "short_answer") {
        // Simple string comparison - in real app, you might want fuzzy matching
        isCorrect =
          answer.answer?.toLowerCase().trim() ===
          question.correctAnswer?.toLowerCase().trim();
      }

      if (isCorrect) {
        pointsEarned = question.points || 1;
        score += pointsEarned;
      }

      processedAnswers.push({
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
        pointsEarned,
      });
    }

    const percentage =
      quiz.totalPoints > 0 ? Math.round((score / quiz.totalPoints) * 100) : 0;
    const isPassing = percentage >= quiz.passingScore;

    const submission = new QuizSubmission({
      quiz: req.params.id,
      student: req.user._id,
      answers: processedAnswers,
      score,
      totalPoints: quiz.totalPoints,
      percentage,
      timeSpent,
      attemptNumber: existingAttempts + 1,
      startedAt: new Date(startedAt),
      submittedAt: new Date(),
      isPassing,
    });

    const savedSubmission = await submission.save();

    // Populate the submission
    const populatedSubmission = await QuizSubmission.findById(
      savedSubmission._id
    )
      .populate("student", "firstName lastName email")
      .populate("quiz", "title totalPoints passingScore");

    console.log(
      `✅ Quiz submitted - Score: ${score}/${quiz.totalPoints} (${percentage}%)`
    );
    res.status(201).json(populatedSubmission);
  } catch (error) {
    console.error("❌ Error submitting quiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/quizzes/student/attempts
// @desc    Get student's quiz attempts
// @access  Private (Students)
router.get("/student/attempts", protect, async (req, res) => {
  try {
    console.log(`📊 Fetching student attempts for user: ${req.user._id}`);

    const submissions = await QuizSubmission.find({ student: req.user._id })
      .populate("quiz", "title course totalPoints")
      .populate({
        path: "quiz",
        populate: {
          path: "course",
          select: "title code",
        },
      })
      .sort({ submittedAt: -1 });

    console.log(`✅ Found ${submissions.length} attempts`);
    res.json(submissions);
  } catch (error) {
    console.error("❌ Error fetching student attempts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/quizzes/:id/questions
// @desc    Add question to quiz
// @access  Private (Teacher/Admin only)
router.post(
  "/:id/questions",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(`➕ Adding question to quiz ${req.params.id}`);
      console.log("📋 Question data:", JSON.stringify(req.body, null, 2));

      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Verify user is the creator or admin
      if (
        quiz.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to modify this quiz" });
      }

      const { question, type, options, correctAnswer, points } = req.body;

      const newQuestion = {
        question,
        type: type || "multiple_choice",
        options: options || [],
        correctAnswer,
        points: points || 1,
      };

      quiz.questions.push(newQuestion);

      // Recalculate total points
      quiz.totalPoints = quiz.questions.reduce(
        (sum, q) => sum + (q.points || 1),
        0
      );

      await quiz.save();

      const updatedQuiz = await Quiz.findById(quiz._id)
        .populate("course", "title code")
        .populate("createdBy", "firstName lastName email");

      console.log(`✅ Question added successfully. Total questions: ${quiz.questions.length}`);
      res.status(201).json(updatedQuiz);
    } catch (error) {
      console.error("❌ Error adding question:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   PUT /api/quizzes/:id/questions/:questionId
// @desc    Update question in quiz
// @access  Private (Teacher/Admin only)
router.put(
  "/:id/questions/:questionId",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(`✏️ Updating question ${req.params.questionId} in quiz ${req.params.id}`);

      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Verify user is the creator or admin
      if (
        quiz.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to modify this quiz" });
      }

      const questionIndex = quiz.questions.findIndex(
        (q) => q._id.toString() === req.params.questionId
      );

      if (questionIndex === -1) {
        return res.status(404).json({ message: "Question not found" });
      }

      const { question, type, options, correctAnswer, points } = req.body;

      // Update question
      quiz.questions[questionIndex] = {
        ...quiz.questions[questionIndex].toObject(),
        question: question || quiz.questions[questionIndex].question,
        type: type || quiz.questions[questionIndex].type,
        options: options || quiz.questions[questionIndex].options,
        correctAnswer: correctAnswer || quiz.questions[questionIndex].correctAnswer,
        points: points !== undefined ? points : quiz.questions[questionIndex].points,
      };

      // Recalculate total points
      quiz.totalPoints = quiz.questions.reduce(
        (sum, q) => sum + (q.points || 1),
        0
      );

      await quiz.save();

      const updatedQuiz = await Quiz.findById(quiz._id)
        .populate("course", "title code")
        .populate("createdBy", "firstName lastName email");

      console.log(`✅ Question updated successfully`);
      res.json(updatedQuiz);
    } catch (error) {
      console.error("❌ Error updating question:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   DELETE /api/quizzes/:id/questions/:questionId
// @desc    Delete question from quiz
// @access  Private (Teacher/Admin only)
router.delete(
  "/:id/questions/:questionId",
  protect,
  authorize("admin", "teacher", "faculty"),
  async (req, res) => {
    try {
      console.log(`🗑️ Deleting question ${req.params.questionId} from quiz ${req.params.id}`);

      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Verify user is the creator or admin
      if (
        quiz.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to modify this quiz" });
      }

      const questionIndex = quiz.questions.findIndex(
        (q) => q._id.toString() === req.params.questionId
      );

      if (questionIndex === -1) {
        return res.status(404).json({ message: "Question not found" });
      }

      quiz.questions.splice(questionIndex, 1);

      // Recalculate total points
      quiz.totalPoints = quiz.questions.reduce(
        (sum, q) => sum + (q.points || 1),
        0
      );

      await quiz.save();

      const updatedQuiz = await Quiz.findById(quiz._id)
        .populate("course", "title code")
        .populate("createdBy", "firstName lastName email");

      console.log(`✅ Question deleted successfully. Remaining questions: ${quiz.questions.length}`);
      res.json(updatedQuiz);
    } catch (error) {
      console.error("❌ Error deleting question:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
