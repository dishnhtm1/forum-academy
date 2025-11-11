import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Tag,
  Typography,
  Space,
  Button,
  Alert,
  Divider,
  Input,
  Select,
  Tooltip,
} from "antd";
import {
  CodeOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  MobileOutlined,
  TabletOutlined,
  LaptopOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ensureCodePracticeTranslations } from "../../utils/codePracticeTranslations";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const CodePractice = () => {
  const { t, i18n } = useTranslation();

  // Ensure translations are loaded
  useEffect(() => {
    ensureCodePracticeTranslations(i18n);
  }, [i18n]);

  // Code Practice States
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My First Webpage</title>
</head>
<body>
  <div id="container">
    <h1>Welcome to Code Practice</h1>
    <p>Edit this code and see the results!</p>
    <button id="myButton">Click Me</button>
  </div>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(`* {
  margin: 0;
  padding: 0;
}

#container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

button {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}`);

  const [jsCode, setJsCode] =
    useState(`var dom = document.getElementById('container');

var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});

var app = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';

var option;

// JavaScript event handling
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('myButton');
  
  if (button) {
    button.addEventListener('click', function() {
      alert('Hello from JavaScript! 🎉');
      console.log('Button clicked!');
    });
  }
});`);

  const [showCodePractice, setShowCodePractice] = useState(false);
  const [screenSize, setScreenSize] = useState("full"); // Default to full width
  const iframeRef = useRef(null);

  // Learning section collapse states
  const [htmlLearningOpen, setHtmlLearningOpen] = useState(false);
  const [cssLearningOpen, setCssLearningOpen] = useState(false);
  const [jsLearningOpen, setJsLearningOpen] = useState(false);

  // Get iframe dimensions based on screen size
  const getScreenDimensions = () => {
    switch (screenSize) {
      case "xs-mobile":
        return {
          width: "320px",
          label: `📱 ${t("codePractice.preview.sizes.xs")} (320px)`,
          icon: "mobile",
        };
      case "mobile":
        return {
          width: "480px",
          label: `📱 ${t("codePractice.preview.sizes.s")} (480px)`,
          icon: "mobile",
        };
      case "tablet-sm":
        return {
          width: "640px",
          label: `📱 ${t("codePractice.preview.sizes.m")} (640px)`,
          icon: "tablet",
        };
      case "tablet":
        return {
          width: "768px",
          label: `📱 ${t("codePractice.preview.sizes.m")} (768px)`,
          icon: "tablet",
        };
      case "laptop":
        return {
          width: "1024px",
          label: `💻 ${t("codePractice.preview.sizes.l")} (1024px)`,
          icon: "laptop",
        };
      case "desktop":
        return {
          width: "1280px",
          label: `🖥️ ${t("codePractice.preview.sizes.xl")} (1280px)`,
          icon: "desktop",
        };
      case "ultra-wide":
        return {
          width: "1536px",
          label: `🖥️ ${t("codePractice.preview.sizes.xl")} (1536px)`,
          icon: "desktop",
        };
      case "full":
      default:
        return {
          width: "100%",
          label: `🖥️ ${t("codePractice.preview.sizes.full")}`,
          icon: "desktop",
        };
    }
  };

  const dimensions = getScreenDimensions();

  // Update iframe with code
  const runCode = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const document = iframe.contentDocument;
    const documentContents = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          try {
            ${jsCode}
          } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="color: red; padding: 10px; margin-top: 20px; background: #ffebee; border-radius: 4px;">❌ Error: ' + error.message + '</div>';
          }
        </script>
      </body>
      </html>
    `;

    document.open();
    document.write(documentContents);
    document.close();
  };

  // Auto-run code on mount and when codes change
  useEffect(() => {
    if (showCodePractice) {
      const timer = setTimeout(() => {
        runCode();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlCode, cssCode, jsCode, showCodePractice]);

  const resetCode = () => {
    setHtmlCode(`<!-- Welcome to Code Practice! -->
<div class="container">
  <h1>Hello, World!</h1>
  <p>Start coding here...</p>
  <button id="myButton">Click Me!</button>
</div>`);

    setCssCode(`/* Add your styles here */
.container {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #667eea;
  font-size: 2.5em;
  margin-bottom: 10px;
}

p {
  color: #666;
  font-size: 1.2em;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}`);

    setJsCode(`// Add your JavaScript here
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('myButton');
  
  button.addEventListener('click', function() {
    alert('Hello from JavaScript! 🎉');
  });
});`);
  };

  return (
    <Card
      style={{
        borderRadius: "16px",
        border: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginTop: "24px",
        background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
      }}
      title={
        <Space>
          <CodeOutlined style={{ fontSize: "24px", color: "#667eea" }} />
          <Text strong style={{ fontSize: "18px" }}>
            {t("codePractice.title")} 🚀
          </Text>
        </Space>
      }
      extra={
        <Button
          type={showCodePractice ? "default" : "primary"}
          icon={<CodeOutlined />}
          onClick={() => setShowCodePractice(!showCodePractice)}
          style={{
            background: showCodePractice
              ? undefined
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: showCodePractice ? undefined : "white",
          }}
        >
          {showCodePractice
            ? t("codePractice.buttons.hide")
            : t("codePractice.buttons.start")}
        </Button>
      }
    >
      {!showCodePractice ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <CodeOutlined
            style={{ fontSize: "64px", color: "#667eea", marginBottom: "20px" }}
          />
          <Title level={3} style={{ color: "#667eea", marginBottom: "16px" }}>
            {t("codePractice.intro.heading")}
          </Title>
          <Paragraph
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto 24px",
            }}
          >
            {t("codePractice.intro.description")}
          </Paragraph>
          <Space size="large" style={{ marginBottom: "20px" }}>
            <Tag color="red" style={{ padding: "8px 16px", fontSize: "14px" }}>
              {t("codePractice.intro.tags.html")}
            </Tag>
            <Tag color="blue" style={{ padding: "8px 16px", fontSize: "14px" }}>
              {t("codePractice.intro.tags.css")}
            </Tag>
            <Tag color="gold" style={{ padding: "8px 16px", fontSize: "14px" }}>
              {t("codePractice.intro.tags.js")}
            </Tag>
          </Space>
        </div>
      ) : (
        <div>
          <Space
            style={{
              marginBottom: "16px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Space>
              <Alert
                message={t("codePractice.alert.tip")}
                type="info"
                showIcon={false}
                style={{ borderRadius: "8px" }}
              />
            </Space>
            <Space>
              <Button
                icon={<PlayCircleOutlined />}
                onClick={runCode}
                type="primary"
                style={{
                  background:
                    "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                  border: "none",
                }}
              >
                {t("codePractice.buttons.run")}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={resetCode}
                style={{
                  borderColor: "#ff4d4f",
                  color: "#ff4d4f",
                }}
              >
                {t("codePractice.buttons.reset")}
              </Button>
            </Space>
          </Space>

          {/* Three Editor Boxes - CodePen Style */}
          <Row gutter={0} style={{ marginBottom: "8px" }}>
            {/* HTML Editor */}
            <Col xs={24} md={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <Tag color="red" style={{ margin: 0 }}>
                      {t("codePractice.editors.html.tag")}
                    </Tag>
                    <Text strong style={{ fontSize: "14px", color: "#fff" }}>
                      {t("codePractice.editors.html.label")}
                    </Text>
                  </Space>
                }
                style={{
                  borderRadius: "0",
                  border: "none",
                  borderRight: "1px solid #2c2c2c",
                  background: "#1e1e1e",
                }}
                headStyle={{
                  background: "#1e1e1e",
                  borderBottom: "1px solid #2c2c2c",
                  padding: "8px 12px",
                  minHeight: "auto",
                }}
                bodyStyle={{ padding: "0", background: "#1e1e1e" }}
              >
                <TextArea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder={t("codePractice.editors.html.placeholder")}
                  className="code-editor html-editor"
                  style={{
                    fontFamily:
                      "'Consolas', 'Monaco', 'Courier New', monospace",
                    fontSize: "14px",
                    minHeight: "400px",
                    background: "#1e1e1e",
                    color: "#d7ba7d",
                    border: "none",
                    borderRadius: "0",
                    padding: "16px",
                    resize: "none",
                    lineHeight: "1.6",
                    fontWeight: "500",
                  }}
                />
              </Card>
            </Col>

            {/* CSS Editor */}
            <Col xs={24} md={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <Tag color="blue" style={{ margin: 0 }}>
                      {t("codePractice.editors.css.tag")}
                    </Tag>
                    <Text strong style={{ fontSize: "14px", color: "#fff" }}>
                      {t("codePractice.editors.css.label")}
                    </Text>
                  </Space>
                }
                style={{
                  borderRadius: "0",
                  border: "none",
                  borderRight: "1px solid #2c2c2c",
                  background: "#1e1e1e",
                }}
                headStyle={{
                  background: "#1e1e1e",
                  borderBottom: "1px solid #2c2c2c",
                  padding: "8px 12px",
                  minHeight: "auto",
                }}
                bodyStyle={{ padding: "0", background: "#1e1e1e" }}
              >
                <TextArea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder={t("codePractice.editors.css.placeholder")}
                  className="code-editor css-editor"
                  style={{
                    fontFamily:
                      "'Consolas', 'Monaco', 'Courier New', monospace",
                    fontSize: "14px",
                    minHeight: "400px",
                    background: "#1e1e1e",
                    color: "#9cdcfe",
                    border: "none",
                    borderRadius: "0",
                    padding: "16px",
                    resize: "none",
                    lineHeight: "1.6",
                    fontWeight: "500",
                  }}
                />
              </Card>
            </Col>

            {/* JavaScript Editor */}
            <Col xs={24} md={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <Tag color="gold" style={{ margin: 0 }}>
                      {t("codePractice.editors.js.tag")}
                    </Tag>
                    <Text strong style={{ fontSize: "14px", color: "#fff" }}>
                      {t("codePractice.editors.js.label")}
                    </Text>
                  </Space>
                }
                style={{
                  borderRadius: "0",
                  border: "none",
                  background: "#1e1e1e",
                }}
                headStyle={{
                  background: "#1e1e1e",
                  borderBottom: "1px solid #2c2c2c",
                  padding: "8px 12px",
                  minHeight: "auto",
                }}
                bodyStyle={{ padding: "0", background: "#1e1e1e" }}
              >
                <TextArea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  placeholder={t("codePractice.editors.js.placeholder")}
                  className="code-editor js-editor"
                  style={{
                    fontFamily:
                      "'Consolas', 'Monaco', 'Courier New', monospace",
                    fontSize: "14px",
                    minHeight: "400px",
                    background: "#1e1e1e",
                    color: "#dcdcaa",
                    border: "none",
                    borderRadius: "0",
                    padding: "16px",
                    resize: "none",
                    lineHeight: "1.6",
                    fontWeight: "500",
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Live Preview - Bottom */}
          <Row>
            <Col span={24}>
              <Card
                title={
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Space>
                      <FullscreenOutlined style={{ color: "#52c41a" }} />
                      <Text strong>{t("codePractice.preview.title")}</Text>
                      <Tag color="green">{dimensions.label}</Tag>
                    </Space>
                    <Space size="middle" wrap>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {t("codePractice.preview.screenSize")}
                      </Text>
                      <Select
                        value={screenSize}
                        onChange={setScreenSize}
                        size="small"
                        style={{ width: 180 }}
                        options={[
                          {
                            label: `📱 ${t(
                              "codePractice.preview.sizes.xs"
                            )} (320px)`,
                            value: "xs-mobile",
                          },
                          {
                            label: `📱 ${t(
                              "codePractice.preview.sizes.s"
                            )} (480px)`,
                            value: "mobile",
                          },
                          {
                            label: `📱 ${t(
                              "codePractice.preview.sizes.m"
                            )} (640px)`,
                            value: "tablet-sm",
                          },
                          {
                            label: `📱 ${t(
                              "codePractice.preview.sizes.m"
                            )} (768px)`,
                            value: "tablet",
                          },
                          {
                            label: `💻 ${t(
                              "codePractice.preview.sizes.l"
                            )} (1024px)`,
                            value: "laptop",
                          },
                          {
                            label: `🖥️ ${t(
                              "codePractice.preview.sizes.xl"
                            )} (1280px)`,
                            value: "desktop",
                          },
                          {
                            label: `🖥️ ${t(
                              "codePractice.preview.sizes.xl"
                            )} (1536px)`,
                            value: "ultra-wide",
                          },
                          {
                            label: `🖥️ ${t("codePractice.preview.sizes.full")}`,
                            value: "full",
                          },
                        ]}
                      />
                      <Tooltip title="Quickly test common screen sizes">
                        <Space size="small">
                          <Button
                            type={
                              screenSize === "xs-mobile" ? "primary" : "default"
                            }
                            size="small"
                            onClick={() => setScreenSize("xs-mobile")}
                            style={{
                              background:
                                screenSize === "xs-mobile"
                                  ? "#52c41a"
                                  : undefined,
                              borderColor:
                                screenSize === "xs-mobile"
                                  ? "#52c41a"
                                  : undefined,
                            }}
                          >
                            XS
                          </Button>
                          <Button
                            type={
                              screenSize === "mobile" ? "primary" : "default"
                            }
                            size="small"
                            onClick={() => setScreenSize("mobile")}
                            style={{
                              background:
                                screenSize === "mobile" ? "#52c41a" : undefined,
                              borderColor:
                                screenSize === "mobile" ? "#52c41a" : undefined,
                            }}
                          >
                            S
                          </Button>
                          <Button
                            type={
                              screenSize === "tablet" ? "primary" : "default"
                            }
                            size="small"
                            onClick={() => setScreenSize("tablet")}
                            style={{
                              background:
                                screenSize === "tablet" ? "#52c41a" : undefined,
                              borderColor:
                                screenSize === "tablet" ? "#52c41a" : undefined,
                            }}
                          >
                            M
                          </Button>
                          <Button
                            type={
                              screenSize === "laptop" ? "primary" : "default"
                            }
                            size="small"
                            onClick={() => setScreenSize("laptop")}
                            style={{
                              background:
                                screenSize === "laptop" ? "#52c41a" : undefined,
                              borderColor:
                                screenSize === "laptop" ? "#52c41a" : undefined,
                            }}
                          >
                            L
                          </Button>
                          <Button
                            type={
                              screenSize === "desktop" ? "primary" : "default"
                            }
                            size="small"
                            onClick={() => setScreenSize("desktop")}
                            style={{
                              background:
                                screenSize === "desktop"
                                  ? "#52c41a"
                                  : undefined,
                              borderColor:
                                screenSize === "desktop"
                                  ? "#52c41a"
                                  : undefined,
                            }}
                          >
                            XL
                          </Button>
                          <Button
                            type={screenSize === "full" ? "primary" : "default"}
                            size="small"
                            onClick={() => setScreenSize("full")}
                            style={{
                              background:
                                screenSize === "full" ? "#52c41a" : undefined,
                              borderColor:
                                screenSize === "full" ? "#52c41a" : undefined,
                            }}
                          >
                            FULL
                          </Button>
                        </Space>
                      </Tooltip>
                    </Space>
                  </Space>
                }
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "2px solid #52c41a33",
                }}
                bodyStyle={{
                  padding: "16px",
                  minHeight: "400px",
                  background: "#f5f5f5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: dimensions.width,
                    height: "400px",
                    transition: "all 0.3s ease",
                    boxShadow:
                      screenSize !== "desktop"
                        ? "0 4px 20px rgba(0,0,0,0.15)"
                        : "none",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    title="Code Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: "8px",
                      background: "white",
                    }}
                  />
                </div>
              </Card>
            </Col>
          </Row>

          {/* Learning Resources & Tutorials */}
          <Divider
            orientation="left"
            style={{ marginTop: "24px", marginBottom: "16px" }}
          >
            <Text strong style={{ fontSize: "16px", color: "#667eea" }}>
              {t("codePractice.learning.title")}
            </Text>
          </Divider>

          {/* HTML Learning Section */}
          <Card
            title={
              <Space>
                <Tag color="red">{t("codePractice.editors.html.tag")}</Tag>
                <Text strong>{t("codePractice.learning.html.title")}</Text>
              </Space>
            }
            extra={
              <Button
                type="link"
                onClick={(e) => {
                  e.stopPropagation();
                  setHtmlLearningOpen(!htmlLearningOpen);
                }}
              >
                {htmlLearningOpen
                  ? t("codePractice.learning.hide") + " ▲"
                  : t("codePractice.learning.show") + " ▼"}
              </Button>
            }
            style={{
              marginBottom: "16px",
              borderRadius: "8px",
              borderLeft: "4px solid #ff4d4f",
              cursor: "pointer",
            }}
            onClick={() => setHtmlLearningOpen(!htmlLearningOpen)}
          >
            {htmlLearningOpen && (
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#ff4d4f",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.html.essentialTags.title")}
                      </Text>
                      <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
                        <li>
                          <code>&lt;h1&gt; - &lt;h6&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.essentialTags.items.h1"
                          )}
                        </li>
                        <li>
                          <code>&lt;p&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.essentialTags.items.p"
                          )}
                        </li>
                        <li>
                          <code>&lt;div&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.essentialTags.items.div"
                          )}
                        </li>
                        <li>
                          <code>&lt;span&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.essentialTags.items.span"
                          )}
                        </li>
                        <li>
                          <code>&lt;a href=""&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.essentialTags.items.a"
                          )}
                        </li>
                        <li>
                          <code>&lt;img src=""&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.essentialTags.items.img"
                          )}
                        </li>
                        <li>
                          <code>&lt;button&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.essentialTags.items.button"
                          )}
                        </li>
                        <li>
                          <code>&lt;input&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.essentialTags.items.input"
                          )}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#ff4d4f",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        🎯 HTML Best Practices:
                      </Text>
                      <ul
                        style={{
                          marginLeft: "20px",
                          lineHeight: "1.8",
                          fontSize: "13px",
                        }}
                      >
                        <li>
                          Always start with <code>&lt;!DOCTYPE html&gt;</code>
                        </li>
                        <li>
                          Use semantic HTML for better SEO and accessibility
                        </li>
                        <li>
                          Always add <code>alt=""</code> text to images
                        </li>
                        <li>
                          Use <code>id</code> for unique elements only
                        </li>
                        <li>
                          Use <code>class</code> for reusable styles
                        </li>
                        <li>
                          {t(
                            "codePractice.learning.html.bestPractices.items.5"
                          )}
                        </li>
                        <li>
                          {t(
                            "codePractice.learning.html.bestPractices.items.6"
                          )}
                        </li>
                        <li>
                          {t(
                            "codePractice.learning.html.bestPractices.items.7"
                          )}
                        </li>
                        <li>
                          {t(
                            "codePractice.learning.html.bestPractices.items.8"
                          )}
                        </li>
                      </ul>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#ff4d4f",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        📝 Form Elements & More:
                      </Text>
                      <ul
                        style={{
                          marginLeft: "20px",
                          lineHeight: "1.8",
                          fontSize: "13px",
                        }}
                      >
                        <li>
                          <code>&lt;form&gt;</code> - Form container
                        </li>
                        <li>
                          <code>&lt;input type="email"&gt;</code> - Email input
                          with validation
                        </li>
                        <li>
                          <code>&lt;input type="password"&gt;</code> - Password
                          field
                        </li>
                        <li>
                          <code>&lt;textarea&gt;</code> -{" "}
                          {t(
                            "codePractice.learning.html.formElements.items.textarea"
                          )}{" "}
                          area
                        </li>
                        <li>
                          <code>&lt;select&gt;</code> +{" "}
                          <code>&lt;option&gt;</code> - Dropdown menu
                        </li>
                        <li>
                          <code>&lt;label for="id"&gt;</code> - Form labels
                        </li>
                        <li>
                          <code>&lt;input type="checkbox"&gt;</code> /{" "}
                          <code>radio</code> - Selections
                        </li>
                        <li>
                          <code>placeholder=""</code> -{" "}
                          {t(
                            "codePractice.learning.html.formElements.items.placeholder"
                          )}{" "}
                          in inputs
                        </li>
                        <li>
                          <code>required</code> - Mandatory field attribute
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#ff4d4f",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.html.commonAttributes.title")}
                      </Text>
                      <ul
                        style={{
                          marginLeft: "20px",
                          lineHeight: "1.8",
                          fontSize: "13px",
                        }}
                      >
                        <li>
                          <code>id="unique"</code> - Unique identifier for
                          element
                        </li>
                        <li>
                          <code>class="style"</code> - CSS styling class name
                        </li>
                        <li>
                          <code>style=""</code> -{" "}
                          {t(
                            "codePractice.learning.html.commonAttributes.items.style"
                          )}{" "}
                          styles
                        </li>
                        <li>
                          <code>href=""</code> -{" "}
                          {t(
                            "codePractice.learning.html.commonAttributes.items.href"
                          )}{" "}
                          (for &lt;a&gt;)
                        </li>
                        <li>
                          <code>src=""</code> - Image/script source path
                        </li>
                        <li>
                          <code>alt=""</code> -{" "}
                          {t(
                            "codePractice.learning.html.commonAttributes.items.alt"
                          )}{" "}
                          for images
                        </li>
                        <li>
                          <code>title=""</code> -{" "}
                          {t(
                            "codePractice.learning.html.commonAttributes.items.title"
                          )}{" "}
                          on hover
                        </li>
                        <li>
                          <code>target="_blank"</code> - Open link in new tab
                        </li>
                      </ul>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    size="small"
                    style={{
                      background: "#fff1f0",
                      border: "1px solid #ffccc7",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        color: "#cf1322",
                        display: "block",
                        marginBottom: "12px",
                      }}
                    >
                      ✏️ Practice Task - HTML:
                    </Text>
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      <Text>
                        📝 <strong>Task 1:</strong> Create a personal profile
                        card
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Add your name in an <code>&lt;h1&gt;</code> tag
                        <br />• Add a paragraph about yourself with{" "}
                        <code>&lt;p&gt;</code>
                        <br />
                        • Include a button that says "Contact Me"
                        <br />• Use a <code>&lt;div id="profile"&gt;</code> to
                        wrap everything
                        <br />• Add an image with <code>&lt;img&gt;</code> and
                        alt text
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text>
                        📝 <strong>Task 2:</strong> Build a simple navigation
                        menu
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Create a <code>&lt;nav&gt;</code> element
                        <br />
                        • Add 4 links: Home, About, Services, Contact
                        <br />
                        • Give each link a unique id attribute
                        <br />• Use <code>&lt;ul&gt;</code> and{" "}
                        <code>&lt;li&gt;</code> for structure
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text>
                        📝 <strong>Task 3:</strong> Create a contact form
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Use <code>&lt;form&gt;</code> as container
                        <br />
                        • Add name input (type="text")
                        <br />
                        • Add email input (type="email")
                        <br />
                        • Add message textarea
                        <br />
                        • Add submit button
                        <br />• Use <code>&lt;label&gt;</code> for each field
                      </Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
            )}
          </Card>

          {/* CSS Learning Section */}
          <Card
            title={
              <Space>
                <Tag color="blue">{t("codePractice.editors.css.tag")}</Tag>
                <Text strong>{t("codePractice.learning.css.title")}</Text>
              </Space>
            }
            extra={
              <Button
                type="link"
                onClick={(e) => {
                  e.stopPropagation();
                  setCssLearningOpen(!cssLearningOpen);
                }}
              >
                {cssLearningOpen
                  ? t("codePractice.learning.hide") + " ▲"
                  : t("codePractice.learning.show") + " ▼"}
              </Button>
            }
            style={{
              marginBottom: "16px",
              borderRadius: "8px",
              borderLeft: "4px solid #1890ff",
              cursor: "pointer",
            }}
            onClick={() => setCssLearningOpen(!cssLearningOpen)}
          >
            {cssLearningOpen && (
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#1890ff",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.css.commonProperties.title")}
                      </Text>
                      <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
                        <li>
                          <code>color</code> - Text color
                        </li>
                        <li>
                          <code>background</code> - Background color/image
                        </li>
                        <li>
                          <code>font-size</code> - Size of text (16px, 1.5em)
                        </li>
                        <li>
                          <code>padding</code> - Space inside element
                        </li>
                        <li>
                          <code>margin</code> - Space outside element
                        </li>
                        <li>
                          <code>border</code> - Border around element
                        </li>
                        <li>
                          <code>display</code> - How element is displayed
                          (block, flex)
                        </li>
                        <li>
                          <code>position</code> - Element positioning (relative,
                          absolute)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#1890ff",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.css.selectors.title")}
                      </Text>
                      <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
                        <li>
                          <code>.className</code> - Select by class
                        </li>
                        <li>
                          <code>#idName</code> - Select by ID
                        </li>
                        <li>
                          <code>element</code> - Select all elements (e.g., p,
                          div)
                        </li>
                        <li>
                          <code>element:hover</code> - When mouse hovers over
                        </li>
                      </ul>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#1890ff",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.css.layoutPositioning.title")}
                      </Text>
                      <ul
                        style={{
                          marginLeft: "20px",
                          lineHeight: "1.8",
                          fontSize: "13px",
                        }}
                      >
                        <li>
                          <code>display: flex</code> - Flexible box layout
                        </li>
                        <li>
                          <code>justify-content</code> - Horizontal align
                        </li>
                        <li>
                          <code>align-items</code> - Vertical align
                        </li>
                        <li>
                          <code>flex-direction</code> - row or column
                        </li>
                        <li>
                          <code>display: grid</code> - Grid layout
                        </li>
                        <li>
                          <code>gap</code> - Space between items
                        </li>
                        <li>
                          <code>position</code> - absolute/relative/fixed
                        </li>
                        <li>
                          <code>z-index</code> - Stacking order
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#1890ff",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.css.colorsEffects.title")}
                      </Text>
                      <ul
                        style={{
                          marginLeft: "20px",
                          lineHeight: "1.8",
                          fontSize: "13px",
                        }}
                      >
                        <li>
                          <code>#ff0000</code> - Hex color codes
                        </li>
                        <li>
                          <code>rgb(255, 0, 0)</code> - RGB values
                        </li>
                        <li>
                          <code>rgba()</code> - With transparency
                        </li>
                        <li>
                          <code>linear-gradient()</code> - Gradients
                        </li>
                        <li>
                          <code>transition</code> - Smooth animations
                        </li>
                        <li>
                          <code>transform</code> - Scale/rotate/translate
                        </li>
                        <li>
                          <code>box-shadow</code> - Drop shadows
                        </li>
                        <li>
                          <code>opacity</code> - Transparency (0-1)
                        </li>
                      </ul>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    size="small"
                    style={{
                      background: "#e6f7ff",
                      border: "1px solid #91d5ff",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        color: "#0050b3",
                        display: "block",
                        marginBottom: "12px",
                      }}
                    >
                      ✏️ Practice Task - CSS:
                    </Text>
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      <Text>
                        🎨 <strong>Task 1:</strong> Style your profile card
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Center text with <code>text-align: center</code>
                        <br />• Add <code>padding: 20px</code> to your div
                        <br />• Change h1 <code>color: #667eea</code>
                        <br />• Make button <code>background: blue</code> with
                        white text
                        <br />• Add <code>border-radius: 8px</code> for rounded
                        corners
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text>
                        🎨 <strong>Task 2:</strong> Create a gradient background
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Use{" "}
                        <code>linear-gradient(135deg, #667eea, #764ba2)</code>
                        <br />• Add <code>border-radius: 10px</code> to your
                        card
                        <br />• Create hover effect with{" "}
                        <code>transform: scale(1.05)</code>
                        <br />• Add <code>transition: all 0.3s ease</code> for
                        smooth animation
                        <br />• Add{" "}
                        <code>box-shadow: 0 4px 6px rgba(0,0,0,0.1)</code>
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text>
                        🎨 <strong>Task 3:</strong> Responsive flexbox layout
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Use <code>display: flex</code> to center content
                        <br />• Add <code>min-height: 100vh</code> to body
                        <br />• Use <code>
                          justify-content: center
                        </code> and <code>align-items: center</code>
                        <br />• Set <code>flex-direction: column</code> for
                        vertical stacking
                        <br />• Add <code>gap: 20px</code> between items
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text>
                        🎨 <strong>Task 4:</strong> Add animations
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Make button grow on hover:{" "}
                        <code>button:hover transform: scale(1.1)</code>
                        <br />• Change button color on hover:{" "}
                        <code>background: #764ba2</code>
                        <br />• Add fade-in effect with <code>
                          opacity
                        </code> and <code>transition</code>
                        <br />• Rotate image slightly:{" "}
                        <code>transform: rotate(5deg)</code>
                      </Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
            )}
          </Card>

          {/* JavaScript Learning Section */}
          <Card
            title={
              <Space>
                <Tag color="gold">{t("codePractice.editors.js.tag")}</Tag>
                <Text strong>{t("codePractice.learning.js.title")}</Text>
              </Space>
            }
            extra={
              <Button
                type="link"
                onClick={(e) => {
                  e.stopPropagation();
                  setJsLearningOpen(!jsLearningOpen);
                }}
              >
                {jsLearningOpen
                  ? t("codePractice.learning.hide") + " ▲"
                  : t("codePractice.learning.show") + " ▼"}
              </Button>
            }
            style={{
              marginBottom: "16px",
              borderRadius: "8px",
              borderLeft: "4px solid #faad14",
              cursor: "pointer",
            }}
            onClick={() => setJsLearningOpen(!jsLearningOpen)}
          >
            {jsLearningOpen && (
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#faad14",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.js.fundamentals.title")}
                      </Text>
                      <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
                        <li>
                          <code>var, let, const</code> - Declare variables
                        </li>
                        <li>
                          <code>document.getElementById('id')</code> - Get
                          element
                        </li>
                        <li>
                          <code>
                            element.addEventListener('click', function)
                          </code>{" "}
                          - Add event
                        </li>
                        <li>
                          <code>console.log()</code> - Print to console for
                          debugging
                        </li>
                        <li>
                          <code>alert()</code> - Show popup message
                        </li>
                        <li>
                          <code>element.innerHTML</code> - Change HTML content
                        </li>
                        <li>
                          <code>element.style.property</code> - Change CSS
                        </li>
                        <li>
                          <code>if/else</code> - Conditional statements
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#faad14",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.js.commonEvents.title")}
                      </Text>
                      <ul
                        style={{
                          marginLeft: "20px",
                          lineHeight: "1.8",
                          fontSize: "13px",
                        }}
                      >
                        <li>
                          <code>'click'</code> - When element is clicked
                        </li>
                        <li>
                          <code>'mouseover' / 'mouseout'</code> - Mouse
                          enters/leaves element
                        </li>
                        <li>
                          <code>'change'</code> - When input value changes
                        </li>
                        <li>
                          <code>'submit'</code> - When form is submitted
                        </li>
                        <li>
                          <code>'keydown' / 'keyup'</code> - Keyboard events
                        </li>
                        <li>
                          <code>'DOMContentLoaded'</code> - When page fully
                          loads
                        </li>
                        <li>
                          <code>'focus' / 'blur'</code> - Input focus events
                        </li>
                      </ul>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#faad14",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.js.dataTypes.title")}
                      </Text>
                      <ul
                        style={{
                          marginLeft: "20px",
                          lineHeight: "1.8",
                          fontSize: "13px",
                        }}
                      >
                        <li>
                          <code>let name = "value"</code> - Variable (can
                          change)
                        </li>
                        <li>
                          <code>const PI = 3.14</code> - Constant (cannot
                          change)
                        </li>
                        <li>
                          <code>String</code> - Text: "Hello", 'World'
                        </li>
                        <li>
                          <code>Number</code> - Numbers: 42, 3.14
                        </li>
                        <li>
                          <code>Boolean</code> - true or false
                        </li>
                        <li>
                          <code>Array</code> - List: [1, 2, 3]
                        </li>
                        <li>
                          <code>Object</code> -{" "}
                          {t("codePractice.learning.js.dataTypes.items.object")}
                        </li>
                        <li>
                          <code>null / undefined</code> - Empty values
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          color: "#faad14",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {t("codePractice.learning.js.functionsControl.title")}
                      </Text>
                      <ul
                        style={{
                          marginLeft: "20px",
                          lineHeight: "1.8",
                          fontSize: "13px",
                        }}
                      >
                        <li>
                          <code>function name() </code> - Function declaration
                        </li>
                        <li>
                          <code>if (condition) else </code> - Conditionals
                        </li>
                        <li>
                          <code>for (let i=0; i&lt;10; i++)</code> - For loop
                        </li>
                        <li>
                          <code>while (condition)</code> - While loop
                        </li>
                        <li>
                          <code>array.forEach()</code> - Loop through array
                        </li>
                        <li>
                          <code>array.map()</code> - Transform array
                        </li>
                        <li>
                          <code>array.filter()</code> - Filter array
                        </li>
                        <li>
                          <code>return value</code> - Return from function
                        </li>
                      </ul>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    size="small"
                    style={{
                      background: "#fffbe6",
                      border: "1px solid #ffe58f",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        color: "#d48806",
                        display: "block",
                        marginBottom: "12px",
                      }}
                    >
                      ✏️ Practice Task - JavaScript:
                    </Text>
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      <Text>
                        ⚡ <strong>Task 1:</strong> Make button interactive
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Get button with{" "}
                        <code>document.getElementById('myButton')</code>
                        <br />• Add event:{" "}
                        <code>
                          button.addEventListener('click', function())
                        </code>
                        <br />• Show alert: <code>alert('Hello ' + name)</code>
                        <br />• Log to console:{" "}
                        <code>console.log('Button clicked!')</code>
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text>
                        ⚡ <strong>Task 2:</strong> Change content dynamically
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Get element:{" "}
                        <code>
                          const title = document.getElementById('title')
                        </code>
                        <br />• Change text:{" "}
                        <code>title.innerHTML = 'New Title!'</code>
                        <br />• Update paragraph:{" "}
                        <code>paragraph.textContent = 'Updated!'</code>
                        <br />• Change button:{" "}
                        <code>button.innerHTML = 'Clicked!'</code>
                        <br />• Add class:{" "}
                        <code>element.classList.add('active')</code>
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text>
                        ⚡ <strong>Task 3:</strong> Toggle styles with
                        JavaScript
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Add click event to button
                        <br />• Toggle color:{" "}
                        <code>element.style.color = 'red'</code>
                        <br />• Change background:{" "}
                        <code>element.style.background = '#764ba2'</code>
                        <br />• Use classList:{" "}
                        <code>element.classList.toggle('dark-mode')</code>
                        <br />• Store state in variable to track changes
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text>
                        ⚡ <strong>Task 4:</strong> Create a counter
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", paddingLeft: "20px" }}
                      >
                        • Create variable: <code>let count = 0</code>
                        <br />• On button click, increase: <code>count++</code>
                        <br />• Update display:{" "}
                        <code>element.innerHTML = count</code>
                        <br />
                        • Add reset button to set count back to 0
                        <br />• Show message when count reaches 10
                      </Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
            )}
          </Card>

          {/* Quick Tips Section */}
          <Row gutter={16} style={{ marginTop: "16px" }}>
            <Col xs={24} md={8}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#f6ffed",
                  border: "2px solid #b7eb8f",
                }}
              >
                <Space direction="vertical" size={8}>
                  <Text strong style={{ color: "#52c41a", fontSize: "14px" }}>
                    {t("codePractice.learning.tips.proTips.title")}
                  </Text>
                  <ul
                    style={{
                      marginLeft: "16px",
                      fontSize: "12px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>Always test your code in the preview window</li>
                    <li>Use browser DevTools (F12) to debug errors</li>
                    <li>Start simple, then add complexity gradually</li>
                    <li>Comment your code for clarity (// or /* */)</li>
                    <li>Practice daily for 30 minutes minimum</li>
                    <li>Read error messages carefully - they help you!</li>
                    <li>Save your code frequently (Ctrl+S)</li>
                    <li>Learn keyboard shortcuts to code faster</li>
                  </ul>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#f0f5ff",
                  border: "2px solid #adc6ff",
                }}
              >
                <Space direction="vertical" size={8}>
                  <Text strong style={{ color: "#2f54eb", fontSize: "14px" }}>
                    {t("codePractice.learning.tips.challenges.title")}
                  </Text>
                  <ul
                    style={{
                      marginLeft: "16px",
                      fontSize: "12px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>Build a calculator with buttons and operations</li>
                    <li>Create an image gallery with prev/next buttons</li>
                    <li>Make a todo list app with add/delete features</li>
                    <li>Design a responsive landing page from scratch</li>
                    <li>Build a color picker tool with hex codes</li>
                    <li>Create a countdown timer or stopwatch</li>
                    <li>Make a modal popup window with overlay</li>
                    <li>Build a form with validation messages</li>
                  </ul>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#fff7e6",
                  border: "2px solid #ffd591",
                }}
              >
                <Space direction="vertical" size={8}>
                  <Text strong style={{ color: "#fa8c16", fontSize: "14px" }}>
                    {t("codePractice.learning.tips.resources.title")}
                  </Text>
                  <ul
                    style={{
                      marginLeft: "16px",
                      fontSize: "12px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>
                      MDN Web Docs (developer.mozilla.org) - Official docs
                    </li>
                    <li>W3Schools (w3schools.com) - Tutorials & examples</li>
                    <li>freeCodeCamp.org - Free coding bootcamp</li>
                    <li>CSS-Tricks.com - CSS guides & tricks</li>
                    <li>JavaScript.info - Modern JS tutorial</li>
                    <li>Codecademy - Interactive coding lessons</li>
                    <li>Frontend Mentor - Real project practice</li>
                  </ul>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Additional Learning Tips Row */}
          <Row gutter={16} style={{ marginTop: "16px" }}>
            <Col xs={24} md={6}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#fff0f6",
                  border: "2px solid #ffadd2",
                }}
              >
                <Space direction="vertical" size={8}>
                  <Text strong style={{ color: "#c41d7f", fontSize: "14px" }}>
                    {t("codePractice.learning.additionalTips.mistakes.title")}
                  </Text>
                  <ul
                    style={{
                      marginLeft: "16px",
                      fontSize: "12px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>Forgetting to close HTML tags</li>
                    <li>Missing semicolons ; in CSS</li>
                    <li>Wrong CSS selector names</li>
                    <li>Typos in getElementById()</li>
                    <li>Forgetting quotes in strings ""</li>
                    <li>Not using const/let for variables</li>
                    <li>Missing parentheses () in functions</li>
                    <li>Incorrect indentation/spacing</li>
                  </ul>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#fcffe6",
                  border: "2px solid #eaff8f",
                }}
              >
                <Space direction="vertical" size={8}>
                  <Text strong style={{ color: "#7cb305", fontSize: "14px" }}>
                    🎓 Learning Path (Beginner):
                  </Text>
                  <ul
                    style={{
                      marginLeft: "16px",
                      fontSize: "12px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>
                      <strong>Week 1-2:</strong> HTML basics & structure
                    </li>
                    <li>
                      <strong>Week 3-4:</strong> CSS styling & colors
                    </li>
                    <li>
                      <strong>Week 5-6:</strong> CSS layouts (flexbox)
                    </li>
                    <li>
                      <strong>Week 7-8:</strong> JavaScript variables &
                      functions
                    </li>
                    <li>
                      <strong>Week 9-10:</strong> DOM manipulation & events
                    </li>
                    <li>
                      <strong>Week 11-12:</strong> Build first complete project
                    </li>
                    <li>
                      <strong>Ongoing:</strong> Practice daily & build more!
                    </li>
                  </ul>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#e6fffb",
                  border: "2px solid #87e8de",
                }}
              >
                <Space direction="vertical" size={8}>
                  <Text strong style={{ color: "#08979c", fontSize: "14px" }}>
                    {t(
                      "codePractice.learning.additionalTips.keyConcepts.title"
                    )}
                  </Text>
                  <ul
                    style={{
                      marginLeft: "16px",
                      fontSize: "12px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>
                      <strong>HTML:</strong> Semantic structure, forms,
                      accessibility
                    </li>
                    <li>
                      <strong>CSS:</strong> Box model, flexbox, grid, responsive
                      design
                    </li>
                    <li>
                      <strong>JavaScript:</strong> Variables, functions, arrays,
                      objects
                    </li>
                    <li>
                      <strong>DOM:</strong> Selecting & manipulating elements
                    </li>
                    <li>
                      <strong>Events:</strong> Click, submit, keyboard
                      interactions
                    </li>
                    <li>
                      <strong>Debugging:</strong> Console.log, DevTools, error
                      reading
                    </li>
                    <li>
                      <strong>Best Practices:</strong> Clean code, comments,
                      organization
                    </li>
                  </ul>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card
                size="small"
                style={{
                  borderRadius: "8px",
                  background: "#f9f0ff",
                  border: "2px solid #d3adf7",
                }}
              >
                <Space direction="vertical" size={8}>
                  <Text strong style={{ color: "#531dab", fontSize: "14px" }}>
                    {t("codePractice.learning.additionalTips.shortcuts.title")}
                  </Text>
                  <ul
                    style={{
                      marginLeft: "16px",
                      fontSize: "12px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>
                      <code>Ctrl + S</code> - Save your code
                    </li>
                    <li>
                      <code>Ctrl + Z</code> - Undo changes
                    </li>
                    <li>
                      <code>Ctrl + Y</code> - Redo changes
                    </li>
                    <li>
                      <code>Ctrl + F</code> - Find text in code
                    </li>
                    <li>
                      <code>F12</code> - Open browser DevTools
                    </li>
                    <li>
                      <code>Ctrl + Shift + I</code> - Inspect element
                    </li>
                    <li>
                      <code>Ctrl + /</code> - Comment/uncomment code
                    </li>
                    <li>
                      <code>Tab</code> - Indent code properly
                    </li>
                  </ul>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Code Examples Row */}
          <Divider
            orientation="left"
            style={{ marginTop: "24px", marginBottom: "16px" }}
          >
            <Text strong style={{ fontSize: "16px", color: "#722ed1" }}>
              💡 Quick Code Examples
            </Text>
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <Tag color="red">HTML</Tag>
                    <Text strong style={{ fontSize: "13px" }}>
                      Example: Basic Page Structure
                    </Text>
                  </Space>
                }
                style={{ borderRadius: "8px", borderTop: "3px solid #ff4d4f" }}
              >
                <pre
                  style={{
                    background: "#1e1e1e",
                    color: "#d7ba7d",
                    padding: "12px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    overflow: "auto",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>About Me</h2>
      <p>Hello World!</p>
    </section>
  </main>
  <footer>
    <p>&copy; 2025</p>
  </footer>
</body>
</html>`}
                </pre>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <Tag color="blue">CSS</Tag>
                    <Text strong style={{ fontSize: "13px" }}>
                      Example: Flexbox Centering
                    </Text>
                  </Space>
                }
                style={{ borderRadius: "8px", borderTop: "3px solid #1890ff" }}
              >
                <pre
                  style={{
                    background: "#1e1e1e",
                    color: "#9cdcfe",
                    padding: "12px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    overflow: "auto",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {`/* Center content perfectly */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(
    135deg, 
    #667eea 0%, 
    #764ba2 100%
  );
}

.card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px 
              rgba(0,0,0,0.3);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}`}
                </pre>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <Tag color="gold">JavaScript</Tag>
                    <Text strong style={{ fontSize: "13px" }}>
                      Example: Interactive Button
                    </Text>
                  </Space>
                }
                style={{ borderRadius: "8px", borderTop: "3px solid #faad14" }}
              >
                <pre
                  style={{
                    background: "#1e1e1e",
                    color: "#dcdcaa",
                    padding: "12px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    overflow: "auto",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {`// Wait for page to load
document.addEventListener(
  'DOMContentLoaded', 
  function() {
    
  // Get button element
  const btn = document
    .getElementById('myButton');
  
  // Track click count
  let count = 0;
  
  // Add click event
  btn.addEventListener('click', 
    function() {
      count++;
      
      // Update button text
      btn.innerHTML = 
        'Clicked ' + count + ' times!';
      
      // Change color
      btn.style.background = 
        '#764ba2';
      
      console.log('Count:', count);
    }
  );
});`}
                </pre>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      <style jsx="true">{`
        /* Code Editor Styling */
        .code-editor textarea {
          scrollbar-width: thin;
          scrollbar-color: #424242 #1e1e1e;
          font-family: "Consolas", "Monaco", "Courier New", monospace !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          letter-spacing: 0.5px;
          font-weight: 400;
          color: #d4d4d4 !important;
        }

        .code-editor textarea::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .code-editor textarea::-webkit-scrollbar-track {
          background: #1e1e1e;
        }

        .code-editor textarea::-webkit-scrollbar-thumb {
          background: #424242;
          border-radius: 6px;
        }

        .code-editor textarea::-webkit-scrollbar-thumb:hover {
          background: #4f4f4f;
        }

        .code-editor textarea::selection {
          background: #264f78;
          color: #ffffff;
        }

        .code-editor textarea:focus {
          outline: none;
          box-shadow: none;
        }

        .code-editor textarea::placeholder {
          color: #6a6a6a;
          font-style: italic;
        }

        /* Enhanced dark theme colors */
        .ant-card-head {
          border-bottom: 1px solid #2c2c2c !important;
        }

        .ant-tag {
          font-weight: 600;
          font-size: 11px;
          padding: 2px 8px;
        }

        /* Syntax highlighting appearance through font rendering */
        .ant-input-textarea {
          background: #1e1e1e !important;
        }

        .ant-card-bordered {
          border-color: #2c2c2c !important;
        }

        /* Make text appear more like syntax highlighted code */
        textarea[placeholder*="HTML"] {
          color: #e06c75 !important; /* Reddish for HTML */
        }

        textarea[placeholder*="CSS"] {
          color: #61afef !important; /* Blueish for CSS */
        }

        textarea[placeholder*="JavaScript"] {
          color: #e5c07b !important; /* Yellowish for JS */
        }
      `}</style>
    </Card>
  );
};

export default CodePractice;
