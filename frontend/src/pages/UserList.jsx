import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";

const { Option } = Select;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/auth/users/");
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/auth/users/${userId}/delete/`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Open modal for editing
  const startEditing = (user) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  // Submit edit form
  const handleEditSubmit = async (values) => {
    try {
      const response = await axios.patch(`http://localhost:8000/auth/users/${editingUser.id}/`, values);
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...response.data } : user)));
      setIsEditing(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Management</h1>
      <Table
        dataSource={users}
        loading={isLoading}
        rowKey="id"
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Username", dataIndex: "username", key: "username" },
          { title: "Email", dataIndex: "email", key: "email" },
          { title: "Role", dataIndex: "role", key: "role" },
          {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button onClick={() => startEditing(record)}>Edit</Button>
                <Popconfirm
                  title="Are you sure you want to delete this user?"
                  onConfirm={() => deleteUser(record.id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form
          initialValues={editingUser}
          onFinish={handleEditSubmit}
          layout="vertical"
        >
          <Form.Item name="username" label="Username">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Technician">Technician</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
