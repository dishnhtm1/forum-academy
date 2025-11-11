/**
 * Student Courses Translations (English/Japanese)
 * Isolated translation file for comprehensive course learning system
 */

export const ensureStudentCoursesTranslations = (i18nInstance) => {
  if (!i18nInstance || typeof i18nInstance.addResourceBundle !== "function") {
    console.error(
      "Invalid i18n instance provided to ensureStudentCoursesTranslations"
    );
    return;
  }

  const enResources = {
    studentCourses: {
      title: "My Learning Journey",
      subtitle: "Explore courses, track progress, and master new skills",

      filters: {
        all: "All Courses",
        inProgress: "In Progress",
        completed: "Completed",
        upcoming: "Upcoming",
      },

      stats: {
        totalCourses: "Total Courses",
        completed: "Completed",
        inProgress: "In Progress",
        totalHours: "Total Hours Studied",
        certificates: "Certificates Earned",
      },

      actions: {
        continue: "Continue Learning",
        start: "Start Course",
        review: "Review",
        viewMaterials: "View Materials",
        takeQuiz: "Take Quiz",
        viewCertificate: "View Certificate",
        downloadNotes: "Download Notes",
        joinDiscussion: "Join Discussion",
      },

      courses: {
        webDevelopment: {
          title: "Full Stack Web Development",
          description:
            "Master modern web technologies from frontend to backend",
          instructor: "Dr. Sarah Johnson",
          duration: "12 weeks",
          level: "Intermediate",
          progress: "65",
          nextLesson: "React Hooks & State Management",

          overview:
            "Learn to build professional web applications using modern technologies. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, databases, and deployment.",

          skills: [
            "HTML5 & CSS3 Mastery",
            "JavaScript ES6+",
            "React & Redux",
            "Node.js & Express",
            "MongoDB & SQL",
            "RESTful APIs",
            "Git & Version Control",
            "Responsive Design",
          ],

          books: [
            {
              title: "Eloquent JavaScript (3rd Edition)",
              author: "Marijn Haverbeke",
              description:
                "A modern introduction to programming and JavaScript",
              link: "https://eloquentjavascript.net/",
            },
            {
              title: "You Don't Know JS (Book Series)",
              author: "Kyle Simpson",
              description: "Deep dive into JavaScript core mechanisms",
              link: "https://github.com/getify/You-Dont-Know-JS",
            },
            {
              title: "Learning React (2nd Edition)",
              author: "Alex Banks & Eve Porcello",
              description: "Modern patterns for developing React applications",
              link: "https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/",
            },
            {
              title: "Node.js Design Patterns (3rd Edition)",
              author: "Mario Casciaro & Luciano Mammino",
              description:
                "Best practices and patterns for Node.js development",
              link: "https://www.nodejsdesignpatterns.com/",
            },
          ],

          modules: [
            {
              id: 1,
              title: "Frontend Fundamentals",
              lessons: [
                "HTML5 Semantic Structure",
                "CSS Grid & Flexbox",
                "JavaScript Fundamentals",
                "DOM Manipulation",
                "Responsive Design Principles",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 2,
              title: "Modern JavaScript",
              lessons: [
                "ES6+ Features",
                "Async Programming",
                "Promises & Async/Await",
                "Modules & Bundlers",
                "Testing with Jest",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 3,
              title: "React Development",
              lessons: [
                "Components & Props",
                "State & Lifecycle",
                "Hooks Deep Dive",
                "Context API & Redux",
                "Performance Optimization",
              ],
              duration: "3 weeks",
              completed: false,
              current: true,
            },
            {
              id: 4,
              title: "Backend with Node.js",
              lessons: [
                "Express.js Fundamentals",
                "RESTful API Design",
                "Authentication & Authorization",
                "Database Integration",
                "Error Handling & Logging",
              ],
              duration: "3 weeks",
              completed: false,
            },
            {
              id: 5,
              title: "Full Stack Project",
              lessons: [
                "Project Planning",
                "Database Design",
                "API Development",
                "Frontend Integration",
                "Deployment & DevOps",
              ],
              duration: "2 weeks",
              completed: false,
            },
          ],
        },

        pythonProgramming: {
          title: "Python Programming Mastery",
          description: "From basics to advanced data science and automation",
          instructor: "Prof. Michael Chen",
          duration: "10 weeks",
          level: "Beginner to Advanced",
          progress: "82",
          nextLesson: "Machine Learning with Scikit-learn",

          overview:
            "Comprehensive Python course covering programming fundamentals, data structures, OOP, web scraping, data analysis, and machine learning. Build real-world projects.",

          skills: [
            "Python Fundamentals",
            "Data Structures & Algorithms",
            "Object-Oriented Programming",
            "File Handling & APIs",
            "Data Analysis with Pandas",
            "Web Scraping",
            "Machine Learning Basics",
            "Automation Scripts",
          ],

          books: [
            {
              title: "Python Crash Course (3rd Edition)",
              author: "Eric Matthes",
              description: "Hands-on, project-based introduction to Python",
              link: "https://nostarch.com/python-crash-course-3rd-edition",
            },
            {
              title: "Automate the Boring Stuff with Python",
              author: "Al Sweigart",
              description: "Practical programming for total beginners",
              link: "https://automatetheboringstuff.com/",
            },
            {
              title: "Python for Data Analysis (3rd Edition)",
              author: "Wes McKinney",
              description: "Data wrangling with Pandas, NumPy, and IPython",
              link: "https://wesmckinney.com/book/",
            },
            {
              title: "Fluent Python (2nd Edition)",
              author: "Luciano Ramalho",
              description: "Clear, concise, and effective programming",
              link: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
            },
          ],

          modules: [
            {
              id: 1,
              title: "Python Basics",
              lessons: [
                "Variables & Data Types",
                "Control Flow",
                "Functions",
                "Lists & Dictionaries",
                "File Operations",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 2,
              title: "Advanced Python",
              lessons: [
                "Object-Oriented Programming",
                "Decorators & Generators",
                "Exception Handling",
                "Modules & Packages",
                "Testing & Debugging",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 3,
              title: "Data Analysis",
              lessons: [
                "NumPy Arrays",
                "Pandas DataFrames",
                "Data Cleaning",
                "Data Visualization",
                "Statistical Analysis",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 4,
              title: "Web & Automation",
              lessons: [
                "Web Scraping with BeautifulSoup",
                "API Integration",
                "Automation Scripts",
                "Email & File Automation",
                "Scheduled Tasks",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 5,
              title: "Machine Learning",
              lessons: [
                "ML Fundamentals",
                "Scikit-learn Basics",
                "Supervised Learning",
                "Model Evaluation",
                "Final Project",
              ],
              duration: "2 weeks",
              completed: false,
              current: true,
            },
          ],
        },

        japanese: {
          title: "Japanese Language & Culture",
          description: "Comprehensive Japanese from beginner to intermediate",
          instructor: "Tanaka Sensei",
          duration: "16 weeks",
          level: "Beginner",
          progress: "45",
          nextLesson: "Hiragana Practice & Common Phrases",

          overview:
            "Learn Japanese language and culture through interactive lessons. Master hiragana, katakana, basic kanji, grammar, and conversational skills. Immerse yourself in Japanese culture.",

          skills: [
            "Hiragana Reading & Writing",
            "Katakana Mastery",
            "Basic Kanji (JLPT N5)",
            "Grammar Fundamentals",
            "Conversational Japanese",
            "Listening Comprehension",
            "Cultural Understanding",
            "Polite Expressions",
          ],

          books: [
            {
              title: "Genki I & II Textbook",
              author: "Eri Banno, Yoko Ikeda",
              description: "Integrated elementary Japanese course",
              link: "https://genki3.japantimes.co.jp/en/",
            },
            {
              title: "Japanese from Zero! Series",
              author: "George Trombley",
              description: "Progressive introduction to Japanese",
              link: "https://www.yesjapan.com/products/japanese-from-zero-1",
            },
            {
              title: "Remembering the Kanji",
              author: "James Heisig",
              description: "Complete course on writing and meaning",
              link: "https://www.amazon.com/Remembering-Kanji-Complete-Japanese-Characters/dp/0824835921",
            },
            {
              title: "Minna no Nihongo",
              author: "3A Corporation",
              description: "Popular Japanese language textbook series",
              link: "https://www.3anet.co.jp/np/en/",
            },
          ],

          modules: [
            {
              id: 1,
              title: "Hiragana Basics",
              lessons: [
                "Introduction to Japanese Writing",
                "あ-row to な-row",
                "は-row to わ-row",
                "Dakuten & Combination",
                "Reading Practice",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 2,
              title: "Katakana & Basics",
              lessons: [
                "Katakana Characters",
                "Foreign Words",
                "Basic Greetings",
                "Self-Introduction",
                "Numbers & Time",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 3,
              title: "Grammar Foundation",
              lessons: [
                "Particles (は、を、に、で)",
                "Verb Conjugation Basics",
                "Adjectives (い & な)",
                "Sentence Structure",
                "Question Forms",
              ],
              duration: "3 weeks",
              completed: false,
              current: true,
            },
            {
              id: 4,
              title: "Kanji Introduction",
              lessons: [
                "Basic Kanji (Numbers)",
                "Daily Life Kanji",
                "JLPT N5 Kanji Set",
                "Kanji Compounds",
                "Reading Strategies",
              ],
              duration: "3 weeks",
              completed: false,
            },
            {
              id: 5,
              title: "Conversation Skills",
              lessons: [
                "Shopping & Dining",
                "Directions & Travel",
                "Daily Conversations",
                "Polite & Casual Forms",
                "Cultural Etiquette",
              ],
              duration: "3 weeks",
              completed: false,
            },
            {
              id: 6,
              title: "Intermediate Grammar",
              lessons: [
                "Te-form Usage",
                "Past Tense Mastery",
                "Conditional Forms",
                "Giving & Receiving",
                "Complex Sentences",
              ],
              duration: "3 weeks",
              completed: false,
            },
          ],
        },

        dataScience: {
          title: "Data Science & Analytics",
          description:
            "Master data analysis, visualization, and machine learning",
          instructor: "Dr. Emily Rodriguez",
          duration: "14 weeks",
          level: "Intermediate",
          progress: "30",
          nextLesson: "Exploratory Data Analysis with Pandas",

          overview:
            "Comprehensive data science course covering statistics, Python, data visualization, machine learning, and real-world projects. Learn to extract insights from data.",

          skills: [
            "Statistical Analysis",
            "Python for Data Science",
            "Data Visualization",
            "Machine Learning",
            "SQL & Databases",
            "Big Data Tools",
            "A/B Testing",
            "Predictive Modeling",
          ],

          books: [
            {
              title: "Hands-On Machine Learning (3rd Edition)",
              author: "Aurélien Géron",
              description: "Using Scikit-Learn, Keras, and TensorFlow",
              link: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/",
            },
            {
              title: "The Data Science Handbook",
              author: "Field Cady",
              description: "Complete guide to data science",
              link: "https://www.wiley.com/en-us/The+Data+Science+Handbook-p-9781119092919",
            },
            {
              title: "Storytelling with Data",
              author: "Cole Nussbaumer Knaflic",
              description: "Data visualization guide for professionals",
              link: "https://www.storytellingwithdata.com/books",
            },
            {
              title: "Introduction to Statistical Learning",
              author: "James, Witten, Hastie, Tibshirani",
              description: "With applications in Python",
              link: "https://www.statlearning.com/",
            },
          ],

          modules: [
            {
              id: 1,
              title: "Statistics Foundation",
              lessons: [
                "Descriptive Statistics",
                "Probability Basics",
                "Distributions",
                "Hypothesis Testing",
                "Correlation & Regression",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 2,
              title: "Python Tools",
              lessons: [
                "NumPy & Pandas",
                "Data Cleaning",
                "Data Transformation",
                "Working with APIs",
                "SQL Integration",
              ],
              duration: "2 weeks",
              completed: true,
            },
            {
              id: 3,
              title: "Data Visualization",
              lessons: [
                "Matplotlib Basics",
                "Seaborn Advanced Plots",
                "Interactive Dashboards",
                "Best Practices",
                "Storytelling with Data",
              ],
              duration: "2 weeks",
              completed: false,
              current: true,
            },
            {
              id: 4,
              title: "Machine Learning",
              lessons: [
                "Supervised Learning",
                "Unsupervised Learning",
                "Model Selection",
                "Feature Engineering",
                "Model Evaluation",
              ],
              duration: "3 weeks",
              completed: false,
            },
            {
              id: 5,
              title: "Advanced Topics",
              lessons: [
                "Deep Learning Intro",
                "Natural Language Processing",
                "Time Series Analysis",
                "A/B Testing",
                "Big Data Tools",
              ],
              duration: "3 weeks",
              completed: false,
            },
            {
              id: 6,
              title: "Capstone Project",
              lessons: [
                "Problem Definition",
                "Data Collection",
                "Analysis & Modeling",
                "Visualization & Report",
                "Presentation",
              ],
              duration: "2 weeks",
              completed: false,
            },
          ],
        },
      },

      quiz: {
        title: "Knowledge Check",
        description: "Test your understanding",
        startQuiz: "Start Quiz",
        submitAnswer: "Submit Answer",
        nextQuestion: "Next Question",
        previousQuestion: "Previous Question",
        finish: "Finish Quiz",
        results: "Quiz Results",
        score: "Your Score",
        correct: "Correct",
        incorrect: "Incorrect",
        explanation: "Explanation",
        retry: "Retry Quiz",
        backToCourse: "Back to Course",
        question: "Question",
        of: "of",
        yourAnswer: "Your Answer",
        correctAnswer: "Correct Answer",
        timeRemaining: "Time Remaining",

        questions: {
          webDevelopment: [
            {
              question: "What is the primary purpose of React Hooks?",
              options: [
                "To replace class components entirely",
                "To use state and lifecycle features in functional components",
                "To improve CSS styling",
                "To connect to databases",
              ],
              correctAnswer: 1,
              explanation:
                "React Hooks allow you to use state and other React features in functional components without writing a class.",
            },
            {
              question:
                "Which HTTP method is typically used to update an existing resource in a RESTful API?",
              options: ["GET", "POST", "PUT", "DELETE"],
              correctAnswer: 2,
              explanation:
                "PUT is used to update an existing resource, while POST creates new resources, GET retrieves data, and DELETE removes resources.",
            },
            {
              question: "What does CSS Flexbox primarily help with?",
              options: [
                "Database queries",
                "One-dimensional layout alignment",
                "Server-side rendering",
                "Image compression",
              ],
              correctAnswer: 1,
              explanation:
                "Flexbox is a CSS layout model designed for one-dimensional layouts, making it easy to align items horizontally or vertically.",
            },
            {
              question:
                "In Node.js, what is the purpose of middleware in Express?",
              options: [
                "To style components",
                "To process requests between receiving and responding",
                "To compile JavaScript",
                "To manage databases",
              ],
              correctAnswer: 1,
              explanation:
                "Middleware functions have access to the request and response objects and can execute code, modify them, or end the request-response cycle.",
            },
            {
              question: "What is the Virtual DOM in React?",
              options: [
                "A physical representation of HTML",
                "A lightweight copy of the real DOM kept in memory",
                "A database storage system",
                "A CSS framework",
              ],
              correctAnswer: 1,
              explanation:
                "The Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM for better performance.",
            },
          ],

          pythonProgramming: [
            {
              question: "What is the output of: print(type([]))?",
              options: [
                "<class 'dict'>",
                "<class 'list'>",
                "<class 'tuple'>",
                "<class 'set'>",
              ],
              correctAnswer: 1,
              explanation:
                "Empty square brackets [] create an empty list in Python, so type([]) returns <class 'list'>.",
            },
            {
              question:
                "Which library is most commonly used for data manipulation in Python?",
              options: ["NumPy", "Pandas", "Matplotlib", "Requests"],
              correctAnswer: 1,
              explanation:
                "Pandas is the most popular library for data manipulation and analysis, providing DataFrames for working with structured data.",
            },
            {
              question:
                "What does the 'self' parameter represent in Python class methods?",
              options: [
                "A global variable",
                "The instance of the class",
                "A static method",
                "The class itself",
              ],
              correctAnswer: 1,
              explanation:
                "'self' refers to the instance of the class, allowing access to instance variables and methods.",
            },
            {
              question:
                "Which of the following is NOT a valid way to create a dictionary in Python?",
              options: [
                "d = {'key': 'value'}",
                "d = dict(key='value')",
                "d = ['key': 'value']",
                "d = {}",
              ],
              correctAnswer: 2,
              explanation:
                "Dictionaries use curly braces {}, not square brackets []. Square brackets are for lists.",
            },
            {
              question: "What is list comprehension in Python?",
              options: [
                "A way to compress lists",
                "A concise way to create lists based on existing iterables",
                "A method to delete list items",
                "A sorting algorithm",
              ],
              correctAnswer: 1,
              explanation:
                "List comprehension provides a concise syntax for creating lists: [expression for item in iterable if condition].",
            },
          ],

          japanese: [
            {
              question:
                "What is the correct particle to mark the direct object of a verb?",
              options: ["は (wa)", "を (wo/o)", "に (ni)", "で (de)"],
              correctAnswer: 1,
              explanation:
                "The particle を (wo/o) marks the direct object of a verb. Example: 本を読む (hon wo yomu - read a book).",
            },
            {
              question: "How many basic hiragana characters are there?",
              options: ["26", "46", "50", "100"],
              correctAnswer: 1,
              explanation:
                "There are 46 basic hiragana characters in the Japanese writing system, representing different syllables.",
            },
            {
              question:
                "What does 'ありがとうございます' (arigatou gozaimasu) mean?",
              options: ["Goodbye", "Thank you (polite)", "Hello", "Excuse me"],
              correctAnswer: 1,
              explanation:
                "ありがとうございます is the polite form of 'thank you' in Japanese, used in formal situations.",
            },
            {
              question:
                "Which writing system is primarily used for foreign words in Japanese?",
              options: ["Hiragana", "Katakana", "Kanji", "Romaji"],
              correctAnswer: 1,
              explanation:
                "Katakana is mainly used for foreign loanwords, foreign names, onomatopoeia, and emphasis.",
            },
            {
              question:
                "What is the dictionary form of the verb 'to eat' in Japanese?",
              options: [
                "食べます (tabemasu)",
                "食べる (taberu)",
                "食べた (tabeta)",
                "食べて (tabete)",
              ],
              correctAnswer: 1,
              explanation:
                "食べる (taberu) is the dictionary/plain form. 食べます is polite present, 食べた is past, and 食べて is te-form.",
            },
          ],

          dataScience: [
            {
              question:
                "What is the purpose of train-test split in machine learning?",
              options: [
                "To speed up training",
                "To evaluate model performance on unseen data",
                "To reduce data size",
                "To clean the data",
              ],
              correctAnswer: 1,
              explanation:
                "Train-test split separates data into training and testing sets to evaluate how well the model generalizes to new, unseen data.",
            },
            {
              question:
                "Which Python library is primarily used for creating static visualizations?",
              options: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn"],
              correctAnswer: 2,
              explanation:
                "Matplotlib is the foundational library for creating static, animated, and interactive visualizations in Python.",
            },
            {
              question: "What does 'overfitting' mean in machine learning?",
              options: [
                "Model is too simple",
                "Model performs well on training data but poorly on new data",
                "Model trains too slowly",
                "Model has too little data",
              ],
              correctAnswer: 1,
              explanation:
                "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data.",
            },
            {
              question: "What is a DataFrame in Pandas?",
              options: [
                "A type of graph",
                "A 2-dimensional labeled data structure",
                "A machine learning algorithm",
                "A database system",
              ],
              correctAnswer: 1,
              explanation:
                "A DataFrame is a 2-dimensional labeled data structure with columns that can contain different types of data, similar to a spreadsheet or SQL table.",
            },
            {
              question:
                "Which statistical measure is most affected by outliers?",
              options: ["Median", "Mode", "Mean", "Interquartile range"],
              correctAnswer: 2,
              explanation:
                "The mean is highly sensitive to outliers because it uses all values in its calculation, while median and IQR are more robust.",
            },
          ],
        },
      },

      progress: {
        title: "Your Progress",
        completionRate: "Completion Rate",
        timeSpent: "Time Spent",
        lessonsCompleted: "Lessons Completed",
        quizzesPassed: "Quizzes Passed",
        skillLevel: "Skill Level",
        nextMilestone: "Next Milestone",
        achievements: "Achievements Unlocked",
      },

      studyTips: {
        title: "Study Tips",
        tip1: "Practice coding every day for at least 30 minutes",
        tip2: "Build projects to apply what you learn",
        tip3: "Join study groups and discuss concepts",
        tip4: "Take notes and review regularly",
        tip5: "Don't hesitate to ask questions in forums",
        tip6: "Complete all hands-on exercises",
        tip7: "Review previous lessons before moving forward",
        tip8: "Set specific learning goals each week",
      },
    },
  };

  const jaResources = {
    studentCourses: {
      title: "私の学習の旅",
      subtitle: "コースを探索し、進捗を追跡し、新しいスキルをマスターする",

      filters: {
        all: "すべてのコース",
        inProgress: "進行中",
        completed: "完了",
        upcoming: "今後",
      },

      stats: {
        totalCourses: "総コース数",
        completed: "完了",
        inProgress: "進行中",
        totalHours: "総学習時間",
        certificates: "取得した証明書",
      },

      actions: {
        continue: "学習を続ける",
        start: "コースを開始",
        review: "復習する",
        viewMaterials: "教材を見る",
        takeQuiz: "クイズに挑戦",
        viewCertificate: "証明書を見る",
        downloadNotes: "ノートをダウンロード",
        joinDiscussion: "ディスカッションに参加",
      },

      courses: {
        webDevelopment: {
          title: "フルスタックWeb開発",
          description:
            "フロントエンドからバックエンドまで最新のWeb技術をマスター",
          instructor: "サラ・ジョンソン博士",
          duration: "12週間",
          level: "中級",
          progress: "65",
          nextLesson: "React Hooks & 状態管理",

          overview:
            "最新技術を使用してプロフェッショナルなWebアプリケーションを構築する方法を学びます。この包括的なコースでは、HTML、CSS、JavaScript、React、Node.js、データベース、デプロイメントをカバーします。",

          skills: [
            "HTML5 & CSS3 マスタリー",
            "JavaScript ES6+",
            "React & Redux",
            "Node.js & Express",
            "MongoDB & SQL",
            "RESTful API",
            "Git & バージョン管理",
            "レスポンシブデザイン",
          ],

          books: [
            {
              title: "Eloquent JavaScript (第3版)",
              author: "Marijn Haverbeke",
              description: "プログラミングとJavaScriptへの現代的な入門",
              link: "https://eloquentjavascript.net/",
            },
            {
              title: "You Don't Know JS (シリーズ)",
              author: "Kyle Simpson",
              description: "JavaScriptのコアメカニズムへの深い探究",
              link: "https://github.com/getify/You-Dont-Know-JS",
            },
            {
              title: "Learning React (第2版)",
              author: "Alex Banks & Eve Porcello",
              description: "Reactアプリケーション開発の最新パターン",
              link: "https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/",
            },
            {
              title: "Node.js デザインパターン (第3版)",
              author: "Mario Casciaro & Luciano Mammino",
              description: "Node.js開発のベストプラクティスとパターン",
              link: "https://www.nodejsdesignpatterns.com/",
            },
          ],

          modules: [
            {
              id: 1,
              title: "フロントエンド基礎",
              lessons: [
                "HTML5 セマンティック構造",
                "CSS Grid & Flexbox",
                "JavaScript 基礎",
                "DOM 操作",
                "レスポンシブデザイン原則",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 2,
              title: "モダンJavaScript",
              lessons: [
                "ES6+ 機能",
                "非同期プログラミング",
                "Promises & Async/Await",
                "モジュール & バンドラー",
                "Jest でのテスト",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 3,
              title: "React 開発",
              lessons: [
                "コンポーネント & Props",
                "状態 & ライフサイクル",
                "Hooks 詳細",
                "Context API & Redux",
                "パフォーマンス最適化",
              ],
              duration: "3週間",
              completed: false,
              current: true,
            },
            {
              id: 4,
              title: "Node.js バックエンド",
              lessons: [
                "Express.js 基礎",
                "RESTful API 設計",
                "認証と認可",
                "データベース統合",
                "エラー処理とロギング",
              ],
              duration: "3週間",
              completed: false,
            },
            {
              id: 5,
              title: "フルスタックプロジェクト",
              lessons: [
                "プロジェクト計画",
                "データベース設計",
                "API 開発",
                "フロントエンド統合",
                "デプロイメント & DevOps",
              ],
              duration: "2週間",
              completed: false,
            },
          ],
        },

        pythonProgramming: {
          title: "Python プログラミングマスタリー",
          description: "基礎から高度なデータサイエンスと自動化まで",
          instructor: "マイケル・チェン教授",
          duration: "10週間",
          level: "初級から上級",
          progress: "82",
          nextLesson: "Scikit-learn で機械学習",

          overview:
            "プログラミングの基礎、データ構造、OOP、Webスクレイピング、データ分析、機械学習をカバーする包括的なPythonコース。実践的なプロジェクトを構築します。",

          skills: [
            "Python 基礎",
            "データ構造とアルゴリズム",
            "オブジェクト指向プログラミング",
            "ファイル処理 & API",
            "Pandas でのデータ分析",
            "Web スクレイピング",
            "機械学習の基礎",
            "自動化スクリプト",
          ],

          books: [
            {
              title: "Python クラッシュコース (第3版)",
              author: "Eric Matthes",
              description: "実践的、プロジェクトベースのPython入門",
              link: "https://nostarch.com/python-crash-course-3rd-edition",
            },
            {
              title: "退屈なことはPythonにやらせよう",
              author: "Al Sweigart",
              description: "完全初心者向けの実用的なプログラミング",
              link: "https://automatetheboringstuff.com/",
            },
            {
              title: "Pythonによるデータ分析 (第3版)",
              author: "Wes McKinney",
              description: "Pandas、NumPy、IPythonでのデータラングリング",
              link: "https://wesmckinney.com/book/",
            },
            {
              title: "Fluent Python (第2版)",
              author: "Luciano Ramalho",
              description: "明確、簡潔、効果的なプログラミング",
              link: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
            },
          ],

          modules: [
            {
              id: 1,
              title: "Python 基礎",
              lessons: [
                "変数とデータ型",
                "制御フロー",
                "関数",
                "リストと辞書",
                "ファイル操作",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 2,
              title: "高度な Python",
              lessons: [
                "オブジェクト指向プログラミング",
                "デコレータとジェネレータ",
                "例外処理",
                "モジュールとパッケージ",
                "テストとデバッグ",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 3,
              title: "データ分析",
              lessons: [
                "NumPy 配列",
                "Pandas DataFrame",
                "データクリーニング",
                "データビジュアライゼーション",
                "統計分析",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 4,
              title: "Web & 自動化",
              lessons: [
                "BeautifulSoup でのWebスクレイピング",
                "API 統合",
                "自動化スクリプト",
                "メールとファイル自動化",
                "スケジュールされたタスク",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 5,
              title: "機械学習",
              lessons: [
                "ML 基礎",
                "Scikit-learn 基礎",
                "教師あり学習",
                "モデル評価",
                "最終プロジェクト",
              ],
              duration: "2週間",
              completed: false,
              current: true,
            },
          ],
        },

        japanese: {
          title: "日本語と文化",
          description: "初級から中級までの包括的な日本語",
          instructor: "田中先生",
          duration: "16週間",
          level: "初級",
          progress: "45",
          nextLesson: "ひらがな練習と一般的なフレーズ",

          overview:
            "インタラクティブなレッスンを通じて日本語と文化を学びます。ひらがな、カタカナ、基本的な漢字、文法、会話スキルをマスターします。日本文化に浸ります。",

          skills: [
            "ひらがな読み書き",
            "カタカナマスタリー",
            "基本漢字 (JLPT N5)",
            "文法基礎",
            "会話日本語",
            "リスニング理解",
            "文化理解",
            "敬語表現",
          ],

          books: [
            {
              title: "げんき I & II 教科書",
              author: "坂野永理、池田庸子",
              description: "統合された初級日本語コース",
              link: "https://genki3.japantimes.co.jp/en/",
            },
            {
              title: "Japanese from Zero! シリーズ",
              author: "George Trombley",
              description: "日本語への段階的な入門",
              link: "https://www.yesjapan.com/products/japanese-from-zero-1",
            },
            {
              title: "漢字を覚える",
              author: "James Heisig",
              description: "書き方と意味の完全なコース",
              link: "https://www.amazon.com/Remembering-Kanji-Complete-Japanese-Characters/dp/0824835921",
            },
            {
              title: "みんなの日本語",
              author: "3A Corporation",
              description: "人気のある日本語教科書シリーズ",
              link: "https://www.3anet.co.jp/np/en/",
            },
          ],

          modules: [
            {
              id: 1,
              title: "ひらがな基礎",
              lessons: [
                "日本語の書き方入門",
                "あ行からな行",
                "は行からわ行",
                "濁点と組み合わせ",
                "読み練習",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 2,
              title: "カタカナと基礎",
              lessons: [
                "カタカナ文字",
                "外来語",
                "基本的な挨拶",
                "自己紹介",
                "数字と時間",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 3,
              title: "文法の基礎",
              lessons: [
                "助詞（は、を、に、で）",
                "動詞活用の基礎",
                "形容詞（い＆な）",
                "文構造",
                "疑問形",
              ],
              duration: "3週間",
              completed: false,
              current: true,
            },
            {
              id: 4,
              title: "漢字入門",
              lessons: [
                "基本漢字（数字）",
                "日常生活の漢字",
                "JLPT N5 漢字セット",
                "漢字の組み合わせ",
                "読解戦略",
              ],
              duration: "3週間",
              completed: false,
            },
            {
              id: 5,
              title: "会話スキル",
              lessons: [
                "買い物と食事",
                "道案内と旅行",
                "日常会話",
                "敬語とカジュアル形",
                "文化的エチケット",
              ],
              duration: "3週間",
              completed: false,
            },
            {
              id: 6,
              title: "中級文法",
              lessons: [
                "て形の使い方",
                "過去形マスタリー",
                "条件形",
                "授受表現",
                "複雑な文",
              ],
              duration: "3週間",
              completed: false,
            },
          ],
        },

        dataScience: {
          title: "データサイエンスと分析",
          description: "データ分析、可視化、機械学習をマスター",
          instructor: "エミリー・ロドリゲス博士",
          duration: "14週間",
          level: "中級",
          progress: "30",
          nextLesson: "Pandasによる探索的データ分析",

          overview:
            "統計、Python、データビジュアライゼーション、機械学習、実践的なプロジェクトをカバーする包括的なデータサイエンスコース。データから洞察を抽出する方法を学びます。",

          skills: [
            "統計分析",
            "データサイエンスのためのPython",
            "データビジュアライゼーション",
            "機械学習",
            "SQL & データベース",
            "ビッグデータツール",
            "A/B テスト",
            "予測モデリング",
          ],

          books: [
            {
              title: "ハンズオン機械学習 (第3版)",
              author: "Aurélien Géron",
              description: "Scikit-Learn、Keras、TensorFlowを使用",
              link: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/",
            },
            {
              title: "データサイエンスハンドブック",
              author: "Field Cady",
              description: "データサイエンスへの完全ガイド",
              link: "https://www.wiley.com/en-us/The+Data+Science+Handbook-p-9781119092919",
            },
            {
              title: "データで語るストーリーテリング",
              author: "Cole Nussbaumer Knaflic",
              description:
                "プロフェッショナルのためのデータビジュアライゼーションガイド",
              link: "https://www.storytellingwithdata.com/books",
            },
            {
              title: "統計的学習入門",
              author: "James, Witten, Hastie, Tibshirani",
              description: "Pythonでの応用付き",
              link: "https://www.statlearning.com/",
            },
          ],

          modules: [
            {
              id: 1,
              title: "統計の基礎",
              lessons: [
                "記述統計",
                "確率の基礎",
                "分布",
                "仮説検定",
                "相関と回帰",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 2,
              title: "Python ツール",
              lessons: [
                "NumPy & Pandas",
                "データクリーニング",
                "データ変換",
                "APIの操作",
                "SQL 統合",
              ],
              duration: "2週間",
              completed: true,
            },
            {
              id: 3,
              title: "データビジュアライゼーション",
              lessons: [
                "Matplotlib 基礎",
                "Seaborn 高度なプロット",
                "インタラクティブダッシュボード",
                "ベストプラクティス",
                "データで語るストーリー",
              ],
              duration: "2週間",
              completed: false,
              current: true,
            },
            {
              id: 4,
              title: "機械学習",
              lessons: [
                "教師あり学習",
                "教師なし学習",
                "モデル選択",
                "特徴量エンジニアリング",
                "モデル評価",
              ],
              duration: "3週間",
              completed: false,
            },
            {
              id: 5,
              title: "高度なトピック",
              lessons: [
                "ディープラーニング入門",
                "自然言語処理",
                "時系列分析",
                "A/B テスト",
                "ビッグデータツール",
              ],
              duration: "3週間",
              completed: false,
            },
            {
              id: 6,
              title: "キャップストーンプロジェクト",
              lessons: [
                "問題定義",
                "データ収集",
                "分析とモデリング",
                "ビジュアライゼーションとレポート",
                "プレゼンテーション",
              ],
              duration: "2週間",
              completed: false,
            },
          ],
        },
      },

      quiz: {
        title: "知識チェック",
        description: "理解度をテスト",
        startQuiz: "クイズを開始",
        submitAnswer: "回答を送信",
        nextQuestion: "次の質問",
        previousQuestion: "前の質問",
        finish: "クイズを終了",
        results: "クイズ結果",
        score: "あなたのスコア",
        correct: "正解",
        incorrect: "不正解",
        explanation: "解説",
        retry: "クイズをやり直す",
        backToCourse: "コースに戻る",
        question: "質問",
        of: "の",
        yourAnswer: "あなたの回答",
        correctAnswer: "正解",
        timeRemaining: "残り時間",

        questions: {
          webDevelopment: [
            {
              question: "React Hooksの主な目的は何ですか？",
              options: [
                "クラスコンポーネントを完全に置き換える",
                "関数コンポーネントで状態とライフサイクル機能を使用する",
                "CSSスタイリングを改善する",
                "データベースに接続する",
              ],
              correctAnswer: 1,
              explanation:
                "React Hooksを使用すると、クラスを書かずに関数コンポーネントで状態やその他のReact機能を使用できます。",
            },
            {
              question:
                "RESTful APIで既存のリソースを更新する際に通常使用されるHTTPメソッドは？",
              options: ["GET", "POST", "PUT", "DELETE"],
              correctAnswer: 2,
              explanation:
                "PUTは既存のリソースの更新に使用され、POSTは新しいリソースの作成、GETはデータの取得、DELETEはリソースの削除に使用されます。",
            },
            {
              question: "CSS Flexboxは主に何に役立ちますか？",
              options: [
                "データベースクエリ",
                "1次元レイアウトの配置",
                "サーバーサイドレンダリング",
                "画像圧縮",
              ],
              correctAnswer: 1,
              explanation:
                "Flexboxは1次元レイアウト用に設計されたCSSレイアウトモデルで、アイテムを水平または垂直に簡単に配置できます。",
            },
            {
              question: "Node.jsでExpressのミドルウェアの目的は何ですか？",
              options: [
                "コンポーネントをスタイリングする",
                "リクエストの受信から応答までの間に処理を行う",
                "JavaScriptをコンパイルする",
                "データベースを管理する",
              ],
              correctAnswer: 1,
              explanation:
                "ミドルウェア関数はリクエストとレスポンスオブジェクトにアクセスでき、コードの実行、変更、またはリクエスト-レスポンスサイクルの終了ができます。",
            },
            {
              question: "ReactのVirtual DOMとは何ですか？",
              options: [
                "HTMLの物理的な表現",
                "メモリ内に保持される実際のDOMの軽量コピー",
                "データベースストレージシステム",
                "CSSフレームワーク",
              ],
              correctAnswer: 1,
              explanation:
                "Virtual DOMは、UIの仮想表現をメモリ内に保持し、より良いパフォーマンスのために実際のDOMと同期するプログラミング概念です。",
            },
          ],

          pythonProgramming: [
            {
              question: "print(type([]))の出力は何ですか？",
              options: [
                "<class 'dict'>",
                "<class 'list'>",
                "<class 'tuple'>",
                "<class 'set'>",
              ],
              correctAnswer: 1,
              explanation:
                "空の角括弧[]はPythonで空のリストを作成するため、type([])は<class 'list'>を返します。",
            },
            {
              question: "Pythonでデータ操作に最もよく使用されるライブラリは？",
              options: ["NumPy", "Pandas", "Matplotlib", "Requests"],
              correctAnswer: 1,
              explanation:
                "Pandasはデータ操作と分析のための最も人気のあるライブラリで、構造化データを扱うためのDataFrameを提供します。",
            },
            {
              question:
                "Pythonクラスメソッドの'self'パラメータは何を表しますか？",
              options: [
                "グローバル変数",
                "クラスのインスタンス",
                "静的メソッド",
                "クラス自体",
              ],
              correctAnswer: 1,
              explanation:
                "'self'はクラスのインスタンスを参照し、インスタンス変数とメソッドへのアクセスを可能にします。",
            },
            {
              question: "Pythonで辞書を作成する有効な方法でないものは？",
              options: [
                "d = {'key': 'value'}",
                "d = dict(key='value')",
                "d = ['key': 'value']",
                "d = {}",
              ],
              correctAnswer: 2,
              explanation:
                "辞書は中括弧{}を使用し、角括弧[]は使用しません。角括弧はリスト用です。",
            },
            {
              question: "Pythonのリスト内包表記とは何ですか？",
              options: [
                "リストを圧縮する方法",
                "既存のイテラブルに基づいてリストを作成する簡潔な方法",
                "リストアイテムを削除するメソッド",
                "ソートアルゴリズム",
              ],
              correctAnswer: 1,
              explanation:
                "リスト内包表記は、リストを作成するための簡潔な構文を提供します：[expression for item in iterable if condition]。",
            },
          ],

          japanese: [
            {
              question: "動詞の直接目的語を示す正しい助詞は？",
              options: ["は (wa)", "を (wo/o)", "に (ni)", "で (de)"],
              correctAnswer: 1,
              explanation:
                "助詞「を」は動詞の直接目的語を示します。例：本を読む（hon wo yomu - 本を読む）。",
            },
            {
              question: "基本的なひらがな文字は何文字ありますか？",
              options: ["26", "46", "50", "100"],
              correctAnswer: 1,
              explanation:
                "日本語の書記体系には46の基本的なひらがな文字があり、異なる音節を表します。",
            },
            {
              question: "「ありがとうございます」の意味は？",
              options: [
                "さようなら",
                "ありがとうございます（丁寧）",
                "こんにちは",
                "すみません",
              ],
              correctAnswer: 1,
              explanation:
                "「ありがとうございます」は日本語の「ありがとう」の丁寧な形で、フォーマルな場面で使用されます。",
            },
            {
              question: "日本語で主に外来語に使用される書記体系は？",
              options: ["ひらがな", "カタカナ", "漢字", "ローマ字"],
              correctAnswer: 1,
              explanation:
                "カタカナは主に外来語、外国人名、擬音語、強調に使用されます。",
            },
            {
              question: "日本語の動詞「食べる」の辞書形は？",
              options: [
                "食べます (tabemasu)",
                "食べる (taberu)",
                "食べた (tabeta)",
                "食べて (tabete)",
              ],
              correctAnswer: 1,
              explanation:
                "食べる（taberu）は辞書形/普通形です。食べますは丁寧な現在形、食べたは過去形、食べてはて形です。",
            },
          ],

          dataScience: [
            {
              question: "機械学習における訓練テスト分割の目的は？",
              options: [
                "トレーニングを高速化する",
                "未知のデータでモデルのパフォーマンスを評価する",
                "データサイズを削減する",
                "データをクリーンにする",
              ],
              correctAnswer: 1,
              explanation:
                "訓練テスト分割は、データをトレーニングセットとテストセットに分割し、モデルが新しい未知のデータにどれだけ汎化できるかを評価します。",
            },
            {
              question:
                "静的な可視化を作成するために主に使用されるPythonライブラリは？",
              options: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn"],
              correctAnswer: 2,
              explanation:
                "Matplotlibは、Pythonで静的、アニメーション、インタラクティブな可視化を作成するための基本ライブラリです。",
            },
            {
              question: "機械学習における「過学習」とは？",
              options: [
                "モデルが単純すぎる",
                "トレーニングデータでは良好だが新しいデータでは不良なパフォーマンス",
                "モデルのトレーニングが遅すぎる",
                "モデルのデータが少なすぎる",
              ],
              correctAnswer: 1,
              explanation:
                "過学習は、モデルがノイズを含むトレーニングデータを学習しすぎて、新しいデータに汎化できない状態です。",
            },
            {
              question: "PandasのDataFrameとは何ですか？",
              options: [
                "グラフの一種",
                "2次元のラベル付きデータ構造",
                "機械学習アルゴリズム",
                "データベースシステム",
              ],
              correctAnswer: 1,
              explanation:
                "DataFrameは、異なるタイプのデータを含むことができる列を持つ2次元のラベル付きデータ構造で、スプレッドシートやSQLテーブルに似ています。",
            },
            {
              question: "外れ値に最も影響を受ける統計的尺度は？",
              options: ["中央値", "最頻値", "平均値", "四分位範囲"],
              correctAnswer: 2,
              explanation:
                "平均値は計算にすべての値を使用するため外れ値に非常に敏感ですが、中央値やIQRはより頑健です。",
            },
          ],
        },
      },

      progress: {
        title: "あなたの進捗",
        completionRate: "完了率",
        timeSpent: "学習時間",
        lessonsCompleted: "完了レッスン数",
        quizzesPassed: "合格クイズ数",
        skillLevel: "スキルレベル",
        nextMilestone: "次のマイルストーン",
        achievements: "アンロックされた実績",
      },

      studyTips: {
        title: "学習のヒント",
        tip1: "毎日最低30分はコーディングを練習する",
        tip2: "学んだことを応用するプロジェクトを作る",
        tip3: "スタディグループに参加して概念を議論する",
        tip4: "ノートを取り定期的に復習する",
        tip5: "フォーラムで質問することをためらわない",
        tip6: "すべての実践的な演習を完了する",
        tip7: "次に進む前に以前のレッスンを復習する",
        tip8: "毎週具体的な学習目標を設定する",
      },
    },
  };

  // Add resource bundles
  i18nInstance.addResourceBundle("en", "translation", enResources, true, true);
  i18nInstance.addResourceBundle("ja", "translation", jaResources, true, true);
};
