import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, Table } from "antd";
import axios from "axios";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const AssignPersonnel1 = () => {
  const [projects, setProjects] = useState([]);
  const [areas, setAreas] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [areaStatuses, setAreaStatuses] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // Track selected project

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, areasRes, personnelRes, areaStatusesRes, assignedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects/`),
          axios.get(`${API_BASE_URL}/api/areas/`),
          axios.get(`${API_BASE_URL}/api/personnel/`),
          axios.get(`${API_BASE_URL}/api/area-statuses/`),
          axios.get(`${API_BASE_URL}/api/project-assignments/`),
        ]);

        setProjects(
          projectsRes.data.map((project) => ({
            id: project.project_id,
            name: project.name,
          }))
        );

        setAreas(
          areasRes.data.map((area) => ({
            id: area.area_id,
            name: area.area_name,
          }))
        );

        setPersonnel(
          personnelRes.data.map((person) => ({
            id: person.personnel_id,
            name: `${person.firstname} ${person.lastname}`,
            area: person.area,
          }))
        );

        setAreaStatuses(
          areaStatusesRes.data.map((status) => ({
            id: status.area_status_id,
            description: status.description,
          }))
        );

        setAssignedProjects(assignedRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      setFilteredPersonnel(personnel.filter((person) => person.area === selectedArea));
    } else {
      setFilteredPersonnel([]);
    }
  }, [selectedArea, personnel]);

  // Filter assigned personnel based on selected project
  const filteredAssignments = assignedProjects.filter(
    (assignment) => assignment.project === selectedProject
  );

  const handleSubmit = async (values) => {
      setLoading(true);
      try {
        const payload = {
          project: values.project,
          area: parseInt(values.area, 10),
          personnel: parseInt(values.personnel, 10),
          area_status: parseInt(values.area_status, 10),
        };

        await axios.post(`${API_BASE_URL}/api/project-assignments/`, payload);
        message.success("Personnel assigned successfully!");
        form.resetFields();
        setSelectedArea(null);
        setSelectedProject(values.project); // Update selected project after assignment

        // Refresh assigned personnel for the selected project
        const assignedRes = await axios.get(`${API_BASE_URL}/api/project-assignments/`);
        setAssignedProjects(assignedRes.data);
      } catch (error) {
        console.error("Error during submission:", error.response?.data); // 🔹 IMPRIMIR ERROR
        message.error(`Failed to assign personnel: ${JSON.stringify(error.response?.data)}`);
      } finally {
        setLoading(false);
      }
  };

  const columns = [
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      render: (areaId) => areas.find((a) => a.id === areaId)?.name || "Unknown Area",
    },
    {
      title: "Personnel",
      dataIndex: "personnel",
      key: "personnel",
      render: (personnelId) => personnel.find((p) => p.id === personnelId)?.name || "Unknown Personnel",
    },
    {
      title: "Status",
      dataIndex: "area_status",
      key: "area_status",
      render: (statusId) => areaStatuses.find((s) => s.id === statusId)?.description || "Unknown Status",
    },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Assign Personnel to Project</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="project"
          label="Select Project"
          rules={[{ required: true, message: "Please select a project!" }]}
        >
          <Select
            placeholder="Select a project"
            notFoundContent="No projects available"
            onChange={(value) => setSelectedProject(value)}
          >
            {projects.map((project) => (
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="area"
          label="Select Area"
          rules={[{ required: true, message: "Please select an area!" }]}
        >
          <Select
            placeholder="Select an area"
            onChange={(value) => setSelectedArea(value)}
            notFoundContent="No areas available"
          >
            {areas.map((area) => (
              <Option key={area.id} value={area.id}>
                {area.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="personnel"
          label="Select Personnel"
          rules={[{ required: true, message: "Please select personnel!" }]}
        >
          <Select placeholder="Select personnel" disabled={!selectedArea}>
            {filteredPersonnel.map((person) => (
              <Option key={person.id} value={person.id}>
                {person.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="area_status"
          label="Select Area Status"
          rules={[{ required: true, message: "Please select an area status!" }]}
        >
          <Select placeholder="Select area status" notFoundContent="No statuses available">
            {areaStatuses.map((status) => (
              <Option key={status.id} value={status.id}>
                {status.description}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Assign Personnel
          </Button>
        </Form.Item>
      </Form>

      <h2>Assigned Personnel for Selected Project</h2>
      <Table
        dataSource={filteredAssignments}
        columns={columns}
        rowKey={(record) => `${record.project}-${record.area}-${record.personnel}`}
        pagination={false}
      />
    </div>
  );
};

export default AssignPersonnel1;
