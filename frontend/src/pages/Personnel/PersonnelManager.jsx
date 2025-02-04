import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, message, Popconfirm, Spin, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PersonnelForm from "./PersonnelForm"; // Import your custom form component



const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const PersonnelManager = () => {
  const [personnel, setPersonnel] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch personnel from the API
  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/personnel/`);
      setPersonnel(response.data);
    } catch (error) {
      message.error("Failed to fetch personnel data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch areas for dropdown
  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/areas/`);
      setAreas(response.data);
    } catch (error) {
      message.error("Failed to fetch areas.");
    }
  };

  useEffect(() => {
    fetchPersonnel();
    fetchAreas();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPersonnel(personnel);
    } else {
      setFilteredPersonnel(
        personnel.filter(
          (p) =>
            p.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.lastname.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [personnel, searchQuery]);

  const handleSavePersonnel = async (values) => {
    setFormLoading(true);
    try {
      if (editingPersonnel) {
        const response = await axios.put(`${API_BASE_URL}/api/personnel/${editingPersonnel.personnel_id}/`, values);
        setPersonnel((prev) =>
          prev.map((p) => (p.personnel_id === editingPersonnel.personnel_id ? response.data : p))
        );
        message.success("Personnel updated successfully!");
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/personnel/`, values);
        setPersonnel((prev) => [...prev, response.data]);
        message.success("Personnel added successfully!");
      }
      setIsModalVisible(false);
      setEditingPersonnel(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save personnel.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePersonnel = async (personnelId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/personnel/${personnelId}/`);
      setPersonnel((prev) => prev.filter((p) => p.personnel_id !== personnelId));
      message.success("Personnel deleted successfully!");
    } catch (error) {
      message.error("Failed to delete personnel.");
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Area",
      dataIndex: ["area_name"], // Ensure API returns area_name correctly
      key: "area_name",
      render: (text) => text || "No Area Assigned",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/personnel/${record.personnel_id}`)}>Details</Button>
          <Button
            type="link"
            onClick={() => {
              setEditingPersonnel(record);
              if (record) form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm title="Delete this personnel?" onConfirm={() => handleDeletePersonnel(record.personnel_id)} okText="Yes" cancelText="No">
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h1>Personnel Manager</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Input.Search
          placeholder="Search personnel..."
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          onClick={() => {
            setEditingPersonnel(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Personnel
        </Button>
      </div>

      {loading ? <Spin /> : <Table columns={columns} dataSource={filteredPersonnel} rowKey="personnel_id" pagination={{ pageSize: 8 }} bordered />}

      <Modal title={editingPersonnel ? "Edit Personnel" : "Add Personnel"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <PersonnelForm form={form} initialValues={editingPersonnel} onSubmit={handleSavePersonnel} />
      </Modal>
    </div>
  );
};

export default PersonnelManager;
