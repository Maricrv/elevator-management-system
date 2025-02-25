import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, Row, Col } from "antd";
import axios from "axios";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const AssignPersonnel = () => {
  const [projects, setProjects] = useState([]);
  const [areas, setAreas] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [areaStatuses, setAreaStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);

  const [form] = Form.useForm();

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes, areasRes, personnelRes, areaStatusesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects/`),
          axios.get(`${API_BASE_URL}/api/areas/`),
          axios.get(`${API_BASE_URL}/api/personnel/`),
          axios.get(`${API_BASE_URL}/api/area-statuses/`),
        ]);

        setProjects(projectsRes.data.map((p) => ({ id: p.project_id, name: p.name })));
        setAreas(areasRes.data.map((a) => ({ id: a.area_id, name: a.area_name })));
        setPersonnel(personnelRes.data.map((p) => ({ id: p.personnel_id, name: `${p.firstname} ${p.lastname}`, area: p.area })));
        setAreaStatuses(areaStatusesRes.data.map((s) => ({ id: s.area_status_id, description: s.description })));
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

  // Submit New Assignment
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        project: String(values.project),
        area: parseInt(values.area, 10),
        personnel: parseInt(values.personnel, 10),
        area_status: parseInt(values.area_status, 10),
      };

      await axios.post(`${API_BASE_URL}/api/project-assignments/`, payload);
      message.success("Personnel assigned successfully!");

      form.resetFields();
      setSelectedArea(null);
    } catch (error) {
      console.error("Error during submission:", error.response?.data);
      message.error(`Failed to assign personnel: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="project" label="Project" rules={[{ required: true, message: "Please select a project!" }]}>
              <Select placeholder="Select project">
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
    </div>
  );
};

export default AssignPersonnel;
