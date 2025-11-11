import React from "react";
import { Typography, Calendar } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { Title } = Typography;

const StudentCalendarView = ({ t }) => (
  <div style={{ padding: "24px" }}>
    <Title level={2}>
      <CalendarOutlined style={{ marginRight: "8px" }} />
      {t("studentDashboard.calendar.title")}
    </Title>
    <Calendar />
  </div>
);

export default StudentCalendarView;

