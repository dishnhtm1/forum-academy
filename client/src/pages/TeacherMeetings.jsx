import React, { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import axios from "axios";

const TeacherMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch teacher meetings
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/zoom/meetings/teacher/${teacherId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMeetings(res.data.meetings || []);
    } catch (err) {
      console.error("❌ Error fetching meetings:", err);
      message.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create new meeting
  const handleCreateMeeting = async () => {
    try {
      message.loading("Creating Zoom meeting...");
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/zoom/meetings`,
        {
          title: "New Class Meeting",
          startTime: new Date().toISOString(),
          duration: 60,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Meeting created successfully!");
      setMeetings([res.data.meeting, ...meetings]);
    } catch (error) {
      console.error("❌ Error creating meeting:", error);
      message.error("Failed to create meeting");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (t) => new Date(t).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => window.open(record.startUrl, "_blank")}>
            Start
          </Button>
          <Button onClick={() => window.open(record.joinUrl, "_blank")}>
            Join
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>📅 My Zoom Meetings</h2>
      <Button type="primary" onClick={handleCreateMeeting} style={{ marginBottom: 16 }}>
        Create New Meeting
      </Button>

      <Table
        columns={columns}
        dataSource={meetings}
        loading={loading}
        rowKey="_id"
        bordered
      />
    </div>
  );
};

export default TeacherMeetings;
