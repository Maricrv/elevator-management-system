import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, Table, Modal, Row, Col, Spin, Card } from "antd";
import axios from "axios";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const AssignPersonnel = () => {
  const [projects, setProjects] = useState([]);
  const [areas, setAreas] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [areaStatuses, setAreaStatuses] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editForm] = Form.useForm();
  const [form] = Form.useForm();

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes, areasRes, personnelRes, areaStatusesRes, assignedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects/`),
          axios.get(`${API_BASE_URL}/api/areas/`),
          axios.get(`${API_BASE_URL}/api/personnel/`),
          axios.get(`${API_BASE_URL}/api/area-statuses/`),
          axios.get(`${API_BASE_URL}/api/project-assignments/`),
        ]);

        setProjects(projectsRes.data.map((p) => ({ id: p.project_id, name: p.name })));
        setAreas(areasRes.data.map((a) => ({ id: a.area_id, name: a.area_name })));
        setPersonnel(personnelRes.data.map((p) => ({ id: p.personnel_id, name: `${p.firstname} ${p.lastname}`, area: p.area })));
        setAreaStatuses(areaStatusesRes.data.map((s) => ({ id: s.area_status_id, description: s.description })));
        setAssignedProjects(assignedRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Personnel by Selected Area
  useEffect(() => {
    if (selectedArea) {
      setFilteredPersonnel(personnel.filter((p) => p.area === selectedArea));
    } else {
      setFilteredPersonnel([]);
    }
  }, [selectedArea, personnel]);

  // Filter Assignments by Selected Project
  const filteredAssignments = selectedProject
    ? assignedProjects.filter((a) => String(a.project) === String(selectedProject))
    : assignedProjects;

  // Submit New Assignment
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log("Submitting assignment:", values);
  
      // Validate values before sending
      if (!values.personnel || !values.area_status) {
        message.error("Personnel and status are required!");
        setLoading(false);
        return;
      }
  
      const payload = {
        project: String(values.project),
        area: parseInt(values.area, 10),
        personnel: parseInt(values.personnel, 10),  // ✅ Ensure personnel is not null
        area_status: parseInt(values.area_status, 10),  // ✅ Ensure status is not null
      };
  
      console.log("Sending payload:", JSON.stringify(payload, null, 2));
  
      await axios.post(`${API_BASE_URL}/api/project-assignments/`, payload);
      message.success("Personnel assigned successfully!");
  
      form.resetFields();
      setSelectedArea(null);
      setSelectedProject(values.project);
  
      // Refresh assigned personnel list
      const assignedRes = await axios.get(`${API_BASE_URL}/api/project-assignments/`);
      setAssignedProjects(assignedRes.data);
    } catch (error) {
      console.error("Error during submission:", error.response?.data);
      message.error(`Failed to assign personnel: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };
  

  // Open Edit Modal
  const handleEdit = (record) => {
    setEditingAssignment(record);
  
    editForm.setFieldsValue({
      project: record.project,  // ✅ Pre-fill Project
      area: record.area,  // ✅ Pre-fill Area
      personnel: record.personnel,  // ✅ Pre-fill Personnel
      area_status: record.area_status,  // ✅ Pre-fill Status
    });
  
    console.log("🔹 Editing Assignment:", record);
    setIsModalVisible(true);
  };
  

  // Update Assignment
  const handleUpdate = async (values) => {
    if (!editingAssignment) return;
    setLoading(true);
    try {
      console.log("Updating assignment ID:", editingAssignment.id, "With values:", values);
  
      const payload = {
        personnel: parseInt(values.personnel, 10),
        area_status: parseInt(values.area_status, 10),
      };
  
      await axios.put(`${API_BASE_URL}/api/project-assignments/${editingAssignment.id}/`, payload);
      message.success("Assignment updated successfully!");
      setIsModalVisible(false);
      setEditingAssignment(null);
  
      // Refresh assigned personnel list
      const assignedRes = await axios.get(`${API_BASE_URL}/api/project-assignments/`);
      setAssignedProjects(assignedRes.data);
    } catch (error) {
      console.error("Error updating assignment:", error.response?.data);
      message.error(`Failed to update assignment: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };
  

  // Table Columns
  const columns = [
    {
      title: "Area",
      dataIndex: "area_name",
      key: "area_name",
    },
    {
      title: "Personnel",
      dataIndex: "personnel_name",
      key: "personnel_name",
    },
    {
      title: "Status",
      dataIndex: "area_status",
      key: "area_status",
      render: (statusId) => areaStatuses.find((s) => s.id === statusId)?.description || "Unknown",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <Card title="Assign Personnel to Project" bordered>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="project" label="Project" rules={[{ required: true, message: "Please select a project!" }]}>
                <Select placeholder="Select project" onChange={(value) => setSelectedProject(value)}>
                  {projects.map((p) => (
                    <Option key={p.id} value={p.id}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="personnel" label="Personnel" rules={[{ required: true, message: "Please select personnel!" }]}>
                <Select placeholder="Select personnel" disabled={!selectedArea}>
                  {filteredPersonnel.map((p) => (
                    <Option key={p.id} value={p.id}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="area" label="Area" rules={[{ required: true, message: "Please select an area!" }]}>
                <Select placeholder="Select area" onChange={(value) => setSelectedArea(value)}>
                  {areas.map((a) => (
                    <Option key={a.id} value={a.id}>
                      {a.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>


              <Form.Item name="area_status" label="Status" rules={[{ required: true, message: "Please select a status!" }]}>
                <Select placeholder="Select status">
                  {areaStatuses.map((s) => (
                    <Option key={s.id} value={s.id}>
                      {s.description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

            </Col>
          </Row>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Assign Personnel
          </Button>
        </Form>
      </Card>

      <Card title="Assigned Personnel" style={{ marginTop: 20 }} bordered>
        {loading ? (
          <Spin />
        ) : (
          <Table dataSource={filteredAssignments} columns={columns} rowKey="id" pagination={false} />
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Assignment"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          {/* Project (Disabled - Shown for Context) */}
          <Form.Item name="project" label="Project">
            <Select disabled>
              {projects.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Area (Disabled - Shown for Context) */}
          <Form.Item name="area" label="Area">
            <Select disabled>
              {areas.map((a) => (
                <Option key={a.id} value={a.id}>
                  {a.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Personnel (Editable) */}
          <Form.Item name="personnel" label="Select Personnel" rules={[{ required: true, message: "Please select personnel!" }]}>
            <Select placeholder="Select personnel">
              {filteredPersonnel.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Status (Editable) */}
          <Form.Item name="area_status" label="Select Status" rules={[{ required: true, message: "Please select a status!" }]}>
            <Select placeholder="Select status">
              {areaStatuses.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update Assignment
          </Button>
        </Form>
      </Modal>


    </div>
  );
};

export default AssignPersonnel;

