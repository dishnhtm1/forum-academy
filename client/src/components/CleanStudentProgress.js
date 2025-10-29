// Render Student Progress with Unique Table Design
const renderStudentProgress = () => {
  const stats = calculateStudentStats();

  return (
    <div>
      {/* Enhanced Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="modern-stat-card"
            hoverable
            style={{
              backgroundColor: "#f0f5ff",
              borderLeft: "4px solid #1890ff",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#595959", fontWeight: "500" }}>
                  {t("adminDashboard.students.totalStudents")}
                </span>
              }
              value={stats.totalStudents}
              prefix={
                <TeamOutlined style={{ color: "#1890ff", fontSize: "20px" }} />
              }
              valueStyle={{
                color: "#262626",
                fontSize: "28px",
                fontWeight: "600",
              }}
            />
            <div
              style={{
                marginTop: 8,
                color: "#8c8c8c",
                fontSize: "12px",
              }}
            >
              {t("adminDashboard.students.registered")}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="modern-stat-card"
            hoverable
            style={{
              backgroundColor: "#f6ffed",
              borderLeft: "4px solid #52c41a",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#595959", fontWeight: "500" }}>
                  {t("adminDashboard.students.activeStudents")}
                </span>
              }
              value={stats.activeStudents}
              prefix={
                <CheckCircleOutlined
                  style={{ color: "#52c41a", fontSize: "20px" }}
                />
              }
              valueStyle={{
                color: "#262626",
                fontSize: "28px",
                fontWeight: "600",
              }}
            />
            <div
              style={{
                marginTop: 8,
                color: "#8c8c8c",
                fontSize: "12px",
              }}
            >
              {t("adminDashboard.students.approved")}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="modern-stat-card"
            hoverable
            style={{
              backgroundColor: "#fff7e6",
              borderLeft: "4px solid #faad14",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#595959", fontWeight: "500" }}>
                  {t("adminDashboard.students.avgProgress")}
                </span>
              }
              value={stats.avgProgress}
              suffix="%"
              prefix={
                <TrophyOutlined
                  style={{ color: "#faad14", fontSize: "20px" }}
                />
              }
              valueStyle={{
                color: "#262626",
                fontSize: "28px",
                fontWeight: "600",
              }}
            />
            <div
              style={{
                marginTop: 8,
                color: "#8c8c8c",
                fontSize: "12px",
              }}
            >
              {t("adminDashboard.students.overallProgress")}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="modern-stat-card"
            hoverable
            style={{
              backgroundColor: "#fff0f6",
              borderLeft: "4px solid #eb2f96",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#595959", fontWeight: "500" }}>
                  {t("adminDashboard.students.completionRate")}
                </span>
              }
              value={stats.completionRate}
              suffix="%"
              prefix={
                <CheckSquareOutlined
                  style={{ color: "#eb2f96", fontSize: "20px" }}
                />
              }
              valueStyle={{
                color: "#262626",
                fontSize: "28px",
                fontWeight: "600",
              }}
            />
            <div
              style={{
                marginTop: 8,
                color: "#8c8c8c",
                fontSize: "12px",
              }}
            >
              {t("adminDashboard.students.completed80Plus")}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Performance Insights */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small">
            <Statistic
              title={t("adminDashboard.students.excellentPerformers")}
              value={stats.excellentPerformers}
              prefix={<StarOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <Text type="secondary" style={{ fontSize: "11px" }}>
              {t("adminDashboard.students.above90Percent")}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small">
            <Statistic
              title={t("adminDashboard.students.atRiskStudents")}
              value={stats.atRiskStudents}
              prefix={<WarningOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f" }}
            />
            <Text type="secondary" style={{ fontSize: "11px" }}>
              {t("adminDashboard.students.below40Percent")}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small">
            <Statistic
              title={t("adminDashboard.students.averageTimeSpent")}
              value={stats.avgTimeSpent}
              suffix="hrs"
              prefix={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
            <Text type="secondary" style={{ fontSize: "11px" }}>
              {t("adminDashboard.students.weeklyAverage")}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Unique Modern Table Design */}
      <Card
        className="unique-table-card"
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
                📊 {t("adminDashboard.students.detailedProgress")}
              </Title>
              <Text type="secondary" style={{ fontSize: "13px" }}>
                {t("adminDashboard.students.comprehensiveView")}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Input
                placeholder={t("adminDashboard.students.searchStudents")}
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
                size="small"
                allowClear
              />
              <Select
                placeholder={t("adminDashboard.students.filterByStatus")}
                style={{ width: 150 }}
                size="small"
                allowClear
                onChange={(value) => setFilterStatus(value)}
              >
                <Option value="excellent">
                  {t("adminDashboard.students.excellent")}
                </Option>
                <Option value="good">
                  {t("adminDashboard.students.good")}
                </Option>
                <Option value="average">
                  {t("adminDashboard.students.average")}
                </Option>
                <Option value="atRisk">
                  {t("adminDashboard.students.atRisk")}
                </Option>
              </Select>
              <Button
                icon={<FileExcelOutlined />}
                type="dashed"
                onClick={exportStudentData}
              >
                {t("actions.export")}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchStudents();
                  message.success(t("adminDashboard.students.refreshed"));
                }}
              >
                {t("actions.refresh")}
              </Button>
            </div>
          </div>
        }
      >
        {/* Custom Table Component for Better Responsive Design */}
        <div className="unique-table-container">
          {/* Table Header */}
          <div className="unique-table-header">
            <div className="unique-header-cell avatar-col">
              <UserOutlined /> {t("adminDashboard.students.student")}
            </div>
            <div className="unique-header-cell status-col">
              <CheckCircleOutlined /> {t("adminDashboard.students.status")}
            </div>
            <div className="unique-header-cell progress-col">
              <BarChartOutlined /> {t("adminDashboard.students.progress")}
            </div>
            <div className="unique-header-cell activity-col">
              <ClockCircleOutlined />{" "}
              {t("adminDashboard.students.lastActivity")}
            </div>
            <div className="unique-header-cell actions-col">
              <SettingOutlined /> {t("adminDashboard.applications.actions")}
            </div>
          </div>

          {/* Table Body */}
          <div className="unique-table-body">
            {students
              .filter((student) => {
                if (!searchTerm && !filterStatus) return true;

                const matchesSearch =
                  !searchTerm ||
                  student.firstName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  student.lastName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  student.email
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

                if (!filterStatus) return matchesSearch;

                const actualIndex = students.indexOf(student);
                const progress = stats.progressData
                  ? stats.progressData[actualIndex]
                  : 50;
                const status =
                  progress >= 90
                    ? "excellent"
                    : progress >= 70
                    ? "good"
                    : progress >= 40
                    ? "average"
                    : "atRisk";

                return matchesSearch && status === filterStatus;
              })
              .slice(0, 10) // Simple pagination for now
              .map((student, displayIndex) => {
                const actualIndex = students.indexOf(student);
                const progress = stats.progressData
                  ? stats.progressData[actualIndex]
                  : 50;
                const status =
                  progress >= 90
                    ? "excellent"
                    : progress >= 70
                    ? "good"
                    : progress >= 40
                    ? "average"
                    : "at-risk";
                const daysAgo = Math.floor(Math.random() * 14);
                const activityDate = moment().subtract(daysAgo, "days");
                const isRecent = daysAgo <= 3;

                const statusConfig = {
                  excellent: {
                    color: "#52c41a",
                    bg: "#f6ffed",
                    text: t("adminDashboard.students.excellent"),
                  },
                  good: {
                    color: "#1890ff",
                    bg: "#f0f5ff",
                    text: t("adminDashboard.students.good"),
                  },
                  average: {
                    color: "#faad14",
                    bg: "#fff7e6",
                    text: t("adminDashboard.students.average"),
                  },
                  "at-risk": {
                    color: "#ff4d4f",
                    bg: "#fff2f0",
                    text: t("adminDashboard.students.atRisk"),
                  },
                };

                return (
                  <div
                    key={student._id}
                    className={`unique-table-row ${
                      progress < 40 ? "warning-row" : ""
                    }`}
                  >
                    {/* Student Info */}
                    <div className="unique-cell avatar-col">
                      <div className="student-info">
                        <Avatar
                          size={40}
                          style={{
                            backgroundColor: student.firstName
                              ? `hsl(${
                                  student.firstName.charCodeAt(0) * 137.508
                                }, 70%, 50%)`
                              : "#1890ff",
                            fontWeight: "600",
                            marginRight: "12px",
                          }}
                        >
                          {student.firstName?.[0]?.toUpperCase() || "?"}
                        </Avatar>
                        <div className="student-details">
                          <div className="student-name">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="student-email">{student.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="unique-cell status-col">
                      <div
                        className="status-badge"
                        style={{
                          backgroundColor: statusConfig[status].bg,
                          color: statusConfig[status].color,
                          border: `1px solid ${statusConfig[status].color}`,
                        }}
                      >
                        {statusConfig[status].text}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="unique-cell progress-col">
                      <div className="progress-container">
                        <div className="progress-info">
                          <span className="progress-label">
                            {t("adminDashboard.students.overallProgress")}
                          </span>
                          <span
                            className="progress-value"
                            style={{
                              color:
                                progress >= 70
                                  ? "#52c41a"
                                  : progress >= 40
                                  ? "#faad14"
                                  : "#ff4d4f",
                            }}
                          >
                            {progress}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${progress}%`,
                              backgroundColor:
                                progress >= 70
                                  ? "#52c41a"
                                  : progress >= 40
                                  ? "#faad14"
                                  : "#ff4d4f",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Last Activity */}
                    <div className="unique-cell activity-col">
                      <div className="activity-info">
                        <div
                          className="activity-date"
                          style={{
                            color: isRecent
                              ? "#52c41a"
                              : daysAgo <= 7
                              ? "#faad14"
                              : "#ff4d4f",
                          }}
                        >
                          {activityDate.format("MMM DD, YYYY")}
                        </div>
                        <div className="activity-relative">
                          {activityDate.fromNow()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="unique-cell actions-col">
                      <div className="action-buttons">
                        <Tooltip
                          title={t("adminDashboard.students.viewProfile")}
                        >
                          <button
                            className="action-btn view-btn"
                            onClick={() => {
                              setSelectedProgress(student);
                              setProgressModalVisible(true);
                            }}
                          >
                            <EyeOutlined />
                          </button>
                        </Tooltip>
                        <Tooltip
                          title={t("adminDashboard.students.sendMessage")}
                        >
                          <button className="action-btn message-btn">
                            <MessageOutlined />
                          </button>
                        </Tooltip>
                        <Tooltip
                          title={t("adminDashboard.students.viewProgress")}
                        >
                          <button className="action-btn progress-btn">
                            <BarChartOutlined />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Show empty state if no students */}
            {students.length === 0 && (
              <div className="unique-table-empty">
                <UserOutlined />
                <div>{t("adminDashboard.students.noStudentsFound")}</div>
              </div>
            )}
          </div>

          {/* Custom Pagination */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #f0f2f5",
              backgroundColor: "#fafbfc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "14px", color: "#666" }}>
              Showing 1-10 of {students.length} students
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button size="small" disabled>
                Previous
              </Button>
              <Button size="small" type="primary">
                1
              </Button>
              <Button size="small" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
