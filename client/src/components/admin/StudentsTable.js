import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    Button,
    Input,
    Space,
    Popconfirm,
    Tag,
    Tooltip,
    message,
} from "antd";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import * as api from "../../utils/api";
import LoadingSpinner from "../common/LoadingSpinner";

const StudentsTable = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const navigate = useNavigate();

    // Fetch students with search and pagination
    const fetchStudents = useCallback(
        async (page = 1, pageSize = 10, search = "") => {
        setLoading(true);
        try {
            const response = await api.fetchStudents(page, pageSize, search);
            setStudents(response.students);
            setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize,
            total: response.total,
            });
        } catch (error) {
            message.error("Failed to fetch students");
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
        },
        [pagination]
    );

    useEffect(() => {
        const controller = new AbortController();

        fetchStudents(pagination.current, pagination.pageSize, searchText);

        return () => controller.abort();
    }, [fetchStudents, pagination.current, pagination.pageSize, searchText]);

    const handleTableChange = (pagination) => {
        fetchStudents(pagination.current, pagination.pageSize, searchText);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        fetchStudents(1, pagination.pageSize, value);
    };

    const handleViewStudent = (id) => {
        navigate(`/admin/students/${id}`);
    };

    const handleEditStudent = (id) => {
        navigate(`/admin/students/${id}/edit`);
    };

    const handleDeleteStudent = async (id) => {
        try {
        await api.deleteStudent(id);
        message.success("Student deleted successfully");
        fetchStudents(pagination.current, pagination.pageSize, searchText);
        } catch (error) {
        message.error("Failed to delete student");
        }
    };

    const getStatusTag = (status) => {
        const statusColors = {
        active: "green",
        pending: "orange",
        graduated: "blue",
        withdrawn: "red",
        suspended: "volcano",
        };

        return (
        <Tag color={statusColors[status.toLowerCase()] || "default"}>
            {status.toUpperCase()}
        </Tag>
        );
    };

    // Table columns
    const columns = [
        {
        title: "ID",
        dataIndex: "studentId",
        key: "studentId",
        width: 100,
        },
        {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => `${record.firstName} ${record.lastName}`,
        },
        {
        title: "Email",
        dataIndex: "email",
        key: "email",
        },
        {
        title: "Program",
        dataIndex: "program",
        key: "program",
        },
        {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => getStatusTag(status),
        },
        {
        title: "Enrolled On",
        dataIndex: "enrollmentDate",
        key: "enrollmentDate",
        render: (date) => (date ? format(new Date(date), "MMM d, yyyy") : "N/A"),
        },
        {
        title: "Actions",
        key: "actions",
        width: 150,
        render: (_, record) => (
            <Space size="small">
            <Tooltip title="View Details">
                <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleViewStudent(record._id)}
                />
            </Tooltip>
            <Tooltip title="Edit">
                <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditStudent(record._id)}
                />
            </Tooltip>
            <Tooltip title="Delete">
                <Popconfirm
                title="Are you sure you want to delete this student?"
                onConfirm={() => handleDeleteStudent(record._id)}
                okText="Yes"
                cancelText="No"
                >
                <Button danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            </Tooltip>
            </Space>
        ),
        },
    ];

    return (
        <div className="students-table-container">
        <div className="table-header">
            <h2>
            <UserOutlined /> Students
            </h2>
            <div className="table-actions">
            <Space>
                <Input.Search
                placeholder="Search students..."
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                style={{ width: 300 }}
                />
                <Button
                type="primary"
                onClick={() => navigate("/admin/students/add")}
                >
                Add Student
                </Button>
            </Space>
            </div>
        </div>

        {loading ? (
            <LoadingSpinner />
        ) : (
            <Table
            columns={columns}
            dataSource={students}
            rowKey="_id"
            pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} students`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
            />
        )}
        </div>
    );
};

export default StudentsTable;
