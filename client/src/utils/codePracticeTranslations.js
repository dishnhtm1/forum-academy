export const ensureCodePracticeTranslations = (i18nInstance) => {
  if (!i18nInstance || typeof i18nInstance.addResourceBundle !== "function") {
    return;
  }

  const enResources = {
    codePractice: {
      title: "Code Practice",
      intro: {
        heading: "Practice Coding Like a Pro!",
        description:
          "Write HTML, CSS, and JavaScript code and see the results instantly - just like CodePen! Perfect for beginners learning web development.",
        tags: {
          html: "📄 HTML Structure",
          css: "🎨 CSS Styling",
          js: "⚡ JavaScript Logic",
        },
      },
      buttons: {
        start: "Start Practicing",
        hide: "Hide Practice",
        run: "Run Code",
        reset: "Reset Code",
      },
      alert: {
        tip: "💡 Tip: Your code runs automatically after you stop typing!",
      },
      editors: {
        html: {
          tag: "HTML",
          label: "Structure",
          placeholder: "<!-- Write your HTML code here -->",
        },
        css: {
          tag: "CSS",
          label: "Style",
          placeholder: "/* Write your CSS code here */",
        },
        js: {
          tag: "JS",
          label: "Behavior",
          placeholder: "// Write your JavaScript code here",
        },
      },
      preview: {
        title: "Live Preview",
        screenSize: "📐 Screen Size:",
        quickAccess: "Quick Access:",
        sizes: {
          xs: "XS Mobile",
          s: "S Mobile",
          m: "M Tablet",
          l: "L Laptop",
          xl: "XL Desktop",
          full: "Full Width",
        },
      },
      learning: {
        title: "📚 Learning Resources & Practice Guide",
        show: "Show Details",
        hide: "Hide Details",

        // HTML Learning Section
        html: {
          title: "HTML - Building Blocks",
          essentialTags: {
            title: "💡 Essential HTML Tags",
            items: {
              h1: "Main heading (most important)",
              p: "Paragraph text",
              div: "Container/division",
              span: "Inline container",
              a: "Link (anchor)",
              img: "Image",
              ul: "Unordered list",
              ol: "Ordered list",
              li: "List item",
              button: "Clickable button",
              input: "User input field",
              table: "Data table",
            },
          },
          semanticElements: {
            title: "🏗️ Semantic HTML Elements",
            items: {
              header: "Page/section header",
              nav: "Navigation links",
              main: "Main content area",
              section: "Thematic section",
              article: "Self-contained content",
              aside: "Sidebar content",
              footer: "Page/section footer",
              figure: "Self-contained media",
            },
          },
          formElements: {
            title: "📝 Form Elements & Attributes",
            items: {
              form: "Form container",
              input: "Input field (text, email, password, number, date, etc.)",
              textarea: "Multi-line text input",
              select: "Dropdown list",
              option: "Dropdown option",
              label: "Input label",
              button: "Submit/action button",
              fieldset: "Group related inputs",
              legend: "Fieldset caption",
              required: "Mark field as required",
              placeholder: "Hint text",
            },
          },
          commonAttributes: {
            title: "🔗 Common Attributes",
            items: {
              id: "Unique identifier",
              class: "CSS class name(s)",
              src: "Source URL (images, scripts)",
              href: "Link destination",
              alt: "Alternative text",
              title: "Tooltip text",
              style: "Inline CSS styles",
              target: "Link target (_blank, _self)",
            },
          },
          bestPractices: {
            title: "🎯 Best Practices",
            items: [
              "Use semantic HTML for better accessibility",
              "Always include alt text for images",
              "Keep HTML structure clean and properly nested",
              "Use headings (h1-h6) in hierarchical order",
              "Validate your HTML code regularly",
              "Use lowercase for tags and attributes",
              "Close all tags properly",
              "Indent your code for readability",
              "Use meaningful IDs and class names",
            ],
          },
          practiceTasks: {
            title: "Practice Tasks",
            task1: {
              title: "1. Create a Simple Profile Card",
              description:
                "Build a card with an image, name, title, and short bio",
              code: `<div class="profile-card">
  <img src="avatar.jpg" alt="Profile">
  <h2>John Doe</h2>
  <p class="title">Web Developer</p>
  <p>Passionate about creating amazing websites!</p>
</div>`,
            },
            task2: {
              title: "2. Build a Navigation Menu",
              description: "Create a horizontal navigation bar with links",
              code: `<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>`,
            },
            task3: {
              title: "3. Design a Contact Form",
              description: "Make a form with name, email, and message fields",
              code: `<form>
  <label>Name: <input type="text" required></label>
  <label>Email: <input type="email" required></label>
  <label>Message: <textarea required></textarea></label>
  <button type="submit">Send</button>
</form>`,
            },
          },
        },

        // CSS Learning Section
        css: {
          title: "CSS - Styling & Layout",
          commonProperties: {
            title: "💡 Common CSS Properties",
            items: {
              color: "Text color",
              backgroundColor: "Background color",
              fontSize: "Text size",
              fontFamily: "Font type",
              fontWeight: "Text thickness (bold, normal)",
              margin: "Outside spacing",
              padding: "Inside spacing",
              border: "Element border",
              width: "Element width",
              height: "Element height",
              display: "Display type (block, inline, flex, grid)",
              position:
                "Positioning method (static, relative, absolute, fixed)",
              textAlign: "Text alignment",
              boxShadow: "Shadow effect",
              borderRadius: "Rounded corners",
            },
          },
          selectors: {
            title: "🎨 CSS Selectors",
            items: {
              element: "element { } - Selects all elements of that type",
              class: ".classname { } - Selects elements with class",
              id: "#idname { } - Selects element with ID",
              descendant: "parent child { } - Selects nested elements",
              child: "parent > child { } - Selects direct children",
              hover: ":hover { } - Styles on mouse over",
              firstChild: ":first-child { } - First child element",
              nthChild: ":nth-child(n) { } - Nth child element",
              pseudo: "::before, ::after - Insert content",
            },
          },
          layoutPositioning: {
            title: "📐 Layout & Positioning",
            items: {
              flexbox: "display: flex - Flexible box layout",
              grid: "display: grid - Grid layout system",
              justifyContent: "Horizontal alignment (flex/grid)",
              alignItems: "Vertical alignment (flex/grid)",
              gap: "Space between items",
              position: "Positioning context",
              zIndex: "Stack order (layering)",
              float: "Float elements left/right",
            },
          },
          colorsEffects: {
            title: "🌈 Colors & Effects",
            items: {
              rgb: "rgb(255, 0, 0) - Red, Green, Blue",
              hex: "#ff0000 - Hexadecimal color",
              rgba: "rgba(255, 0, 0, 0.5) - RGB with transparency",
              gradient: "linear-gradient() - Color gradients",
              transition: "Smooth property changes",
              transform: "Rotate, scale, skew elements",
              opacity: "Element transparency (0-1)",
              filter: "Visual effects (blur, brightness)",
            },
          },
          practiceTasks: {
            title: "Practice Tasks",
            task1: {
              title: "1. Style the Profile Card",
              description: "Add colors, borders, and spacing",
              code: `.profile-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
}`,
            },
            task2: {
              title: "2. Create a Flexbox Layout",
              description: "Center content horizontally and vertically",
              code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}`,
            },
            task3: {
              title: "3. Add Hover Effects",
              description: "Make buttons interactive",
              code: `button {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #45a049;
  transform: scale(1.05);
}`,
            },
            task4: {
              title: "4. Responsive Design",
              description: "Make layout adapt to screen size",
              code: `@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`,
            },
          },
        },

        // JavaScript Learning Section
        js: {
          title: "JavaScript - Interactivity",
          fundamentals: {
            title: "💡 JavaScript Fundamentals",
            items: {
              variables: "let, const - Store data",
              functions: "function name() { } - Reusable code blocks",
              conditionals: "if/else - Make decisions",
              loops: "for, while - Repeat actions",
              arrays: "[1, 2, 3] - Ordered lists",
              objects: "{ key: value } - Data structures",
              events: "addEventListener() - User interactions",
              dom: "document.querySelector() - Select elements",
            },
          },
          commonEvents: {
            title: "⚡ Common Events",
            items: {
              click: "click - Mouse click",
              mouseover: "mouseover - Mouse enters element",
              mouseout: "mouseout - Mouse leaves element",
              keydown: "keydown - Key pressed",
              submit: "submit - Form submitted",
              change: "change - Input value changed",
              load: "load - Page/image loaded",
            },
          },
          dataTypes: {
            title: "🔧 Data Types & Variables",
            items: {
              string: "String - Text data ('hello')",
              number: "Number - Numeric data (42, 3.14)",
              boolean: "Boolean - true/false",
              array: "Array - [1, 2, 3]",
              object: "Object - { name: 'John' }",
              null: "null - Intentionally empty",
              undefined: "undefined - Not defined",
              let: "let - Reassignable variable",
              const: "const - Constant (cannot reassign)",
            },
          },
          functionsControl: {
            title: "📊 Functions & Control Flow",
            items: {
              function: "function name() { } - Function declaration",
              arrow: "() => { } - Arrow function",
              return: "return value - Return from function",
              parameters: "function(param1, param2) - Function inputs",
              if: "if (condition) { } - Conditional execution",
              else: "else { } - Alternative path",
              for: "for (let i = 0; i < 10; i++) - Loop",
              forEach: "array.forEach() - Loop through array",
            },
          },
          practiceTasks: {
            title: "Practice Tasks",
            task1: {
              title: "1. Change Text on Click",
              description: "Update heading when button is clicked",
              code: `const heading = document.querySelector('h1');
const button = document.querySelector('button');

button.addEventListener('click', () => {
  heading.textContent = 'Text Changed!';
});`,
            },
            task2: {
              title: "2. Create a Counter",
              description: "Increment number with each click",
              code: `let count = 0;
const display = document.querySelector('#count');
const btn = document.querySelector('#increment');

btn.addEventListener('click', () => {
  count++;
  display.textContent = count;
});`,
            },
            task3: {
              title: "3. Toggle Class",
              description: "Add/remove class on click",
              code: `const element = document.querySelector('.box');
const toggleBtn = document.querySelector('#toggle');

toggleBtn.addEventListener('click', () => {
  element.classList.toggle('active');
});`,
            },
            task4: {
              title: "4. Form Validation",
              description: "Check input before submission",
              code: `const form = document.querySelector('form');
const input = document.querySelector('#email');

form.addEventListener('submit', (e) => {
  if (!input.value.includes('@')) {
    e.preventDefault();
    alert('Please enter a valid email!');
  }
});`,
            },
          },
        },

        // Quick Tips Section
        tips: {
          title: "Quick Tips & Resources",
          proTips: {
            title: "💡 Pro Tips for Success",
            items: [
              "Start with HTML structure before styling",
              "Use browser DevTools (F12) to debug",
              "Practice coding every day for 30 minutes",
              "Build small projects to apply what you learn",
              "Don't copy code blindly - understand it first",
              "Learn by breaking things and fixing them",
              "Keep your code clean and well-commented",
              "Use proper indentation for readability",
            ],
          },
          challenges: {
            title: "🔥 Challenge Yourself",
            items: [
              "Build a personal portfolio website",
              "Create a to-do list app",
              "Design a landing page for a product",
              "Make a calculator with JavaScript",
              "Build a photo gallery with filters",
              "Create an interactive quiz game",
              "Design a responsive navigation menu",
              "Make a clock or countdown timer",
            ],
          },
          resources: {
            title: "📖 Learning Resources",
            items: [
              "MDN Web Docs - Complete reference",
              "W3Schools - Tutorials & examples",
              "freeCodeCamp - Free coding courses",
              "CodePen - Practice & inspiration",
              "CSS-Tricks - Tips & techniques",
              "JavaScript.info - In-depth JS guide",
              "Can I Use - Browser compatibility",
            ],
          },
        },

        // Additional Learning Tips
        additionalTips: {
          title: "Additional Learning Tips",
          mistakes: {
            title: "⚠️ Common Mistakes to Avoid",
            items: [
              "Forgetting to close HTML tags properly",
              "Using too many !important in CSS",
              "Not using semantic HTML elements",
              "Inline styles instead of CSS classes",
              "Not testing on different browsers",
              "Ignoring mobile responsiveness",
              "Poor naming conventions for classes/IDs",
              "Not commenting complex code sections",
            ],
          },
          learningPath: {
            title: "🎓 Learning Path (Beginner → Advanced)",
            items: [
              "Week 1-2: HTML basics & structure",
              "Week 3-4: CSS styling & colors",
              "Week 5-6: CSS layouts (Flexbox, Grid)",
              "Week 7-8: JavaScript fundamentals",
              "Week 9-10: DOM manipulation & events",
              "Week 11-12: Build your first project",
              "Beyond: Frameworks (React, Vue, Angular)",
            ],
          },
          keyConcepts: {
            title: "🔑 Key Concepts to Master",
            items: [
              "HTML Semantic Structure",
              "CSS Box Model & Layout",
              "Responsive Design Principles",
              "JavaScript Event Handling",
              "DOM Manipulation Techniques",
              "Cross-browser Compatibility",
              "Web Accessibility (a11y)",
            ],
          },
          shortcuts: {
            title: "💻 Useful Keyboard Shortcuts",
            items: [
              "Ctrl + / - Comment/uncomment code",
              "Ctrl + D - Duplicate line",
              "Ctrl + Z - Undo changes",
              "Ctrl + Shift + Z - Redo changes",
              "Ctrl + F - Find in code",
              "Ctrl + S - Save your work",
              "F12 - Open browser DevTools",
              "Ctrl + Shift + I - Inspect element",
            ],
          },
        },

        // Code Examples Section
        examples: {
          title: "Quick Code Examples",
          html: {
            title: "HTML Example: Complete Page Structure",
            code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>
  <header>
    <h1>Welcome!</h1>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>Main Content</h2>
      <p>This is the main content area.</p>
    </section>
  </main>
  <footer>
    <p>&copy; 2024 My Website</p>
  </footer>
</body>
</html>`,
          },
          css: {
            title: "CSS Example: Flexbox Centering",
            code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.card:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}`,
          },
          js: {
            title: "JavaScript Example: Interactive Button",
            code: `// Select elements
const button = document.querySelector('#myButton');
const display = document.querySelector('#display');
let count = 0;

// Add event listener
button.addEventListener('click', function() {
  count++;
  display.textContent = 'Clicked ' + count + ' times!';
  
  // Change color based on count
  if (count > 5) {
    display.style.color = 'red';
  }
});

// Reset on double click
button.addEventListener('dblclick', function() {
  count = 0;
  display.textContent = 'Counter reset!';
  display.style.color = 'black';
});`,
          },
        },
      },
    },
  };

  const jaResources = {
    codePractice: {
      title: "コード練習",
      intro: {
        heading: "プロのようにコーディングを練習！",
        description:
          "HTML、CSS、JavaScriptコードを書いて結果を即座に確認 - CodePenのように！ウェブ開発を学ぶ初心者に最適です。",
        tags: {
          html: "📄 HTML構造",
          css: "🎨 CSSスタイリング",
          js: "⚡ JavaScript論理",
        },
      },
      buttons: {
        start: "練習を開始",
        hide: "練習を非表示",
        run: "コードを実行",
        reset: "コードをリセット",
      },
      alert: {
        tip: "💡 ヒント: 入力を停止すると、コードが自動的に実行されます！",
      },
      editors: {
        html: {
          tag: "HTML",
          label: "構造",
          placeholder: "<!-- ここにHTMLコードを書いてください -->",
        },
        css: {
          tag: "CSS",
          label: "スタイル",
          placeholder: "/* ここにCSSコードを書いてください */",
        },
        js: {
          tag: "JS",
          label: "動作",
          placeholder: "// ここにJavaScriptコードを書いてください",
        },
      },
      preview: {
        title: "ライブプレビュー",
        screenSize: "📐 画面サイズ：",
        quickAccess: "クイックアクセス：",
        sizes: {
          xs: "XS モバイル",
          s: "S モバイル",
          m: "M タブレット",
          l: "L ノートPC",
          xl: "XL デスクトップ",
          full: "フル幅",
        },
      },
      learning: {
        title: "📚 学習リソースと練習ガイド",
        show: "詳細を表示",
        hide: "詳細を非表示",

        // HTML Learning Section
        html: {
          title: "HTML - 基本要素",
          essentialTags: {
            title: "💡 必須HTMLタグ",
            items: {
              h1: "メイン見出し（最も重要）",
              p: "段落テキスト",
              div: "コンテナ・区分",
              span: "インラインコンテナ",
              a: "リンク（アンカー）",
              img: "画像",
              ul: "順序なしリスト",
              ol: "順序付きリスト",
              li: "リストアイテム",
              button: "クリック可能なボタン",
              input: "ユーザー入力フィールド",
              table: "データテーブル",
            },
          },
          semanticElements: {
            title: "🏗️ セマンティックHTML要素",
            items: {
              header: "ページ/セクションのヘッダー",
              nav: "ナビゲーションリンク",
              main: "メインコンテンツエリア",
              section: "テーマ別セクション",
              article: "自己完結型コンテンツ",
              aside: "サイドバーコンテンツ",
              footer: "ページ/セクションのフッター",
              figure: "自己完結型メディア",
            },
          },
          formElements: {
            title: "📝 フォーム要素と属性",
            items: {
              form: "フォームコンテナ",
              input:
                "入力フィールド（text、email、password、number、dateなど）",
              textarea: "複数行テキスト入力",
              select: "ドロップダウンリスト",
              option: "ドロップダウンオプション",
              label: "入力ラベル",
              button: "送信/アクションボタン",
              fieldset: "関連する入力をグループ化",
              legend: "フィールドセットのキャプション",
              required: "必須フィールドとしてマーク",
              placeholder: "ヒントテキスト",
            },
          },
          commonAttributes: {
            title: "🔗 一般的な属性",
            items: {
              id: "一意の識別子",
              class: "CSSクラス名",
              src: "ソースURL（画像、スクリプト）",
              href: "リンク先",
              alt: "代替テキスト",
              title: "ツールチップテキスト",
              style: "インラインCSSスタイル",
              target: "リンクターゲット（_blank、_self）",
            },
          },
          bestPractices: {
            title: "🎯 ベストプラクティス",
            items: [
              "アクセシビリティ向上のためセマンティックHTMLを使用",
              "画像には常にaltテキストを含める",
              "HTML構造を清潔かつ適切にネスト化",
              "見出し（h1-h6）を階層的に使用",
              "HTMLコードを定期的に検証",
              "タグと属性には小文字を使用",
              "すべてのタグを適切に閉じる",
              "読みやすさのためコードをインデント",
              "意味のあるIDとクラス名を使用",
            ],
          },
          practiceTasks: {
            title: "練習タスク",
            task1: {
              title: "1. シンプルなプロフィールカードを作成",
              description: "画像、名前、役職、短い経歴を含むカードを構築",
              code: `<div class="profile-card">
  <img src="avatar.jpg" alt="プロフィール">
  <h2>山田太郎</h2>
  <p class="title">ウェブ開発者</p>
  <p>素晴らしいウェブサイト作りに情熱を注いでいます！</p>
</div>`,
            },
            task2: {
              title: "2. ナビゲーションメニューを構築",
              description: "リンク付きの横方向ナビゲーションバーを作成",
              code: `<nav>
  <ul>
    <li><a href="#home">ホーム</a></li>
    <li><a href="#about">概要</a></li>
    <li><a href="#contact">お問い合わせ</a></li>
  </ul>
</nav>`,
            },
            task3: {
              title: "3. お問い合わせフォームを設計",
              description:
                "名前、メール、メッセージフィールドを含むフォームを作成",
              code: `<form>
  <label>名前: <input type="text" required></label>
  <label>メール: <input type="email" required></label>
  <label>メッセージ: <textarea required></textarea></label>
  <button type="submit">送信</button>
</form>`,
            },
          },
        },

        // CSS Learning Section
        css: {
          title: "CSS - スタイリングとレイアウト",
          commonProperties: {
            title: "💡 一般的なCSSプロパティ",
            items: {
              color: "テキストの色",
              backgroundColor: "背景色",
              fontSize: "テキストのサイズ",
              fontFamily: "フォントの種類",
              fontWeight: "テキストの太さ（太字、標準）",
              margin: "外側の間隔",
              padding: "内側の間隔",
              border: "要素の境界線",
              width: "要素の幅",
              height: "要素の高さ",
              display: "表示タイプ（block、inline、flex、grid）",
              position: "配置方法（static、relative、absolute、fixed）",
              textAlign: "テキストの配置",
              boxShadow: "影の効果",
              borderRadius: "角の丸み",
            },
          },
          selectors: {
            title: "🎨 CSSセレクタ",
            items: {
              element: "element { } - その種類のすべての要素を選択",
              class: ".classname { } - クラスを持つ要素を選択",
              id: "#idname { } - IDを持つ要素を選択",
              descendant: "parent child { } - ネストされた要素を選択",
              child: "parent > child { } - 直接の子要素を選択",
              hover: ":hover { } - マウスオーバー時のスタイル",
              firstChild: ":first-child { } - 最初の子要素",
              nthChild: ":nth-child(n) { } - n番目の子要素",
              pseudo: "::before、::after - コンテンツを挿入",
            },
          },
          layoutPositioning: {
            title: "📐 レイアウトと配置",
            items: {
              flexbox: "display: flex - フレキシブルボックスレイアウト",
              grid: "display: grid - グリッドレイアウトシステム",
              justifyContent: "水平方向の配置（flex/grid）",
              alignItems: "垂直方向の配置（flex/grid）",
              gap: "アイテム間のスペース",
              position: "配置コンテキスト",
              zIndex: "重ね順（レイヤー）",
              float: "要素を左/右にフロート",
            },
          },
          colorsEffects: {
            title: "🌈 色とエフェクト",
            items: {
              rgb: "rgb(255, 0, 0) - 赤、緑、青",
              hex: "#ff0000 - 16進数カラー",
              rgba: "rgba(255, 0, 0, 0.5) - 透明度付きRGB",
              gradient: "linear-gradient() - カラーグラデーション",
              transition: "スムーズなプロパティ変更",
              transform: "要素の回転、拡大縮小、傾斜",
              opacity: "要素の透明度（0-1）",
              filter: "視覚効果（ぼかし、明るさ）",
            },
          },
          practiceTasks: {
            title: "練習タスク",
            task1: {
              title: "1. プロフィールカードのスタイリング",
              description: "色、境界線、間隔を追加",
              code: `.profile-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
}`,
            },
            task2: {
              title: "2. Flexboxレイアウトを作成",
              description: "コンテンツを水平・垂直に中央揃え",
              code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}`,
            },
            task3: {
              title: "3. ホバーエフェクトを追加",
              description: "ボタンをインタラクティブにする",
              code: `button {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #45a049;
  transform: scale(1.05);
}`,
            },
            task4: {
              title: "4. レスポンシブデザイン",
              description: "画面サイズに応じてレイアウトを調整",
              code: `@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`,
            },
          },
        },

        // JavaScript Learning Section
        js: {
          title: "JavaScript - インタラクティブ性",
          fundamentals: {
            title: "💡 JavaScript基礎",
            items: {
              variables: "let、const - データを保存",
              functions: "function name() { } - 再利用可能なコードブロック",
              conditionals: "if/else - 判断を行う",
              loops: "for、while - アクションを繰り返す",
              arrays: "[1, 2, 3] - 順序付きリスト",
              objects: "{ key: value } - データ構造",
              events: "addEventListener() - ユーザーインタラクション",
              dom: "document.querySelector() - 要素を選択",
            },
          },
          commonEvents: {
            title: "⚡ 一般的なイベント",
            items: {
              click: "click - マウスクリック",
              mouseover: "mouseover - マウスが要素に入る",
              mouseout: "mouseout - マウスが要素から出る",
              keydown: "keydown - キーが押される",
              submit: "submit - フォームが送信される",
              change: "change - 入力値が変更される",
              load: "load - ページ/画像が読み込まれる",
            },
          },
          dataTypes: {
            title: "🔧 データ型と変数",
            items: {
              string: "文字列 - テキストデータ（'こんにちは'）",
              number: "数値 - 数値データ（42、3.14）",
              boolean: "真偽値 - true/false",
              array: "配列 - [1, 2, 3]",
              object: "オブジェクト - { name: '太郎' }",
              null: "null - 意図的に空",
              undefined: "undefined - 未定義",
              let: "let - 再代入可能な変数",
              const: "const - 定数（再代入不可）",
            },
          },
          functionsControl: {
            title: "📊 関数と制御フロー",
            items: {
              function: "function name() { } - 関数宣言",
              arrow: "() => { } - アロー関数",
              return: "return value - 関数から値を返す",
              parameters: "function(param1, param2) - 関数の入力",
              if: "if (condition) { } - 条件付き実行",
              else: "else { } - 代替パス",
              for: "for (let i = 0; i < 10; i++) - ループ",
              forEach: "array.forEach() - 配列をループ",
            },
          },
          practiceTasks: {
            title: "練習タスク",
            task1: {
              title: "1. クリックでテキストを変更",
              description: "ボタンがクリックされたときに見出しを更新",
              code: `const heading = document.querySelector('h1');
const button = document.querySelector('button');

button.addEventListener('click', () => {
  heading.textContent = 'テキストが変更されました！';
});`,
            },
            task2: {
              title: "2. カウンターを作成",
              description: "クリックごとに数値を増やす",
              code: `let count = 0;
const display = document.querySelector('#count');
const btn = document.querySelector('#increment');

btn.addEventListener('click', () => {
  count++;
  display.textContent = count;
});`,
            },
            task3: {
              title: "3. クラスを切り替え",
              description: "クリックでクラスを追加/削除",
              code: `const element = document.querySelector('.box');
const toggleBtn = document.querySelector('#toggle');

toggleBtn.addEventListener('click', () => {
  element.classList.toggle('active');
});`,
            },
            task4: {
              title: "4. フォーム検証",
              description: "送信前に入力をチェック",
              code: `const form = document.querySelector('form');
const input = document.querySelector('#email');

form.addEventListener('submit', (e) => {
  if (!input.value.includes('@')) {
    e.preventDefault();
    alert('有効なメールアドレスを入力してください！');
  }
});`,
            },
          },
        },

        // Quick Tips Section
        tips: {
          title: "クイックヒントとリソース",
          proTips: {
            title: "💡 成功のためのプロのヒント",
            items: [
              "スタイリングの前にHTML構造から始める",
              "ブラウザDevTools（F12）を使ってデバッグ",
              "毎日30分コーディングを練習",
              "学んだことを適用する小さなプロジェクトを構築",
              "コードを盲目的にコピーせず、まず理解する",
              "物を壊して修正することで学ぶ",
              "コードを清潔かつ適切にコメント",
              "読みやすさのため適切なインデントを使用",
            ],
          },
          challenges: {
            title: "🔥 チャレンジしてみよう",
            items: [
              "個人のポートフォリオウェブサイトを構築",
              "ToDoリストアプリを作成",
              "製品のランディングページをデザイン",
              "JavaScriptで電卓を作成",
              "フィルター付きフォトギャラリーを構築",
              "インタラクティブなクイズゲームを作成",
              "レスポンシブなナビゲーションメニューをデザイン",
              "時計やカウントダウンタイマーを作成",
            ],
          },
          resources: {
            title: "📖 学習リソース",
            items: [
              "MDN Web Docs - 完全なリファレンス",
              "W3Schools - チュートリアルと例",
              "freeCodeCamp - 無料コーディングコース",
              "CodePen - 練習とインスピレーション",
              "CSS-Tricks - ヒントとテクニック",
              "JavaScript.info - 詳細なJSガイド",
              "Can I Use - ブラウザ互換性",
            ],
          },
        },

        // Additional Learning Tips
        additionalTips: {
          title: "追加の学習ヒント",
          mistakes: {
            title: "⚠️ 避けるべき一般的な間違い",
            items: [
              "HTMLタグを適切に閉じることを忘れる",
              "CSSで!importantを多用しすぎる",
              "セマンティックHTML要素を使用しない",
              "CSSクラスの代わりにインラインスタイルを使用",
              "異なるブラウザでテストしない",
              "モバイルレスポンシブを無視する",
              "クラス/IDの命名規則が不十分",
              "複雑なコードセクションにコメントを付けない",
            ],
          },
          learningPath: {
            title: "🎓 学習パス（初心者→上級者）",
            items: [
              "第1-2週：HTML基礎と構造",
              "第3-4週：CSSスタイリングと色",
              "第5-6週：CSSレイアウト（Flexbox、Grid）",
              "第7-8週：JavaScript基礎",
              "第9-10週：DOM操作とイベント",
              "第11-12週：最初のプロジェクトを構築",
              "それ以降：フレームワーク（React、Vue、Angular）",
            ],
          },
          keyConcepts: {
            title: "🔑 習得すべき重要な概念",
            items: [
              "HTMLセマンティック構造",
              "CSSボックスモデルとレイアウト",
              "レスポンシブデザインの原則",
              "JavaScriptイベント処理",
              "DOM操作テクニック",
              "クロスブラウザ互換性",
              "ウェブアクセシビリティ（a11y）",
            ],
          },
          shortcuts: {
            title: "💻 便利なキーボードショートカット",
            items: [
              "Ctrl + / - コードのコメント/コメント解除",
              "Ctrl + D - 行を複製",
              "Ctrl + Z - 変更を元に戻す",
              "Ctrl + Shift + Z - やり直し",
              "Ctrl + F - コード内を検索",
              "Ctrl + S - 作業を保存",
              "F12 - ブラウザDevToolsを開く",
              "Ctrl + Shift + I - 要素を検査",
            ],
          },
        },

        // Code Examples Section
        examples: {
          title: "クイックコード例",
          html: {
            title: "HTML例：完全なページ構造",
            code: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>私のページ</title>
</head>
<body>
  <header>
    <h1>ようこそ！</h1>
    <nav>
      <a href="#home">ホーム</a>
      <a href="#about">概要</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>メインコンテンツ</h2>
      <p>これはメインコンテンツエリアです。</p>
    </section>
  </main>
  <footer>
    <p>&copy; 2024 私のウェブサイト</p>
  </footer>
</body>
</html>`,
          },
          css: {
            title: "CSS例：Flexbox中央揃え",
            code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.card:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}`,
          },
          js: {
            title: "JavaScript例：インタラクティブなボタン",
            code: `// 要素を選択
const button = document.querySelector('#myButton');
const display = document.querySelector('#display');
let count = 0;

// イベントリスナーを追加
button.addEventListener('click', function() {
  count++;
  display.textContent = count + '回クリックされました！';
  
  // カウントに基づいて色を変更
  if (count > 5) {
    display.style.color = 'red';
  }
});

// ダブルクリックでリセット
button.addEventListener('dblclick', function() {
  count = 0;
  display.textContent = 'カウンターがリセットされました！';
  display.style.color = 'black';
});`,
          },
        },
      },
    },
  };

  // Add English resources
  i18nInstance.addResourceBundle("en", "translation", enResources, true, true);

  // Add Japanese resources
  i18nInstance.addResourceBundle("ja", "translation", jaResources, true, true);
};
