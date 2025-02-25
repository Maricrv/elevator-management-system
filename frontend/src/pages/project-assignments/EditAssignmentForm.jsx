import React, { useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import axios from "axios";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const EditAssignmentForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();
  const [personnel, setPersonnel] = useState([]);
  const [areaStatuses, setAreaStatuses] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]); // ✅ Filtered list
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }

    const fetchData = async () => {
      try {
        const [personnelRes, areaStatusesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/personnel/`),
          axios.get(`${API_BASE_URL}/api/area-statuses/`),
        ]);

        const allPersonnel = personnelRes.data.map((p) => ({
          id: p.personnel_id,
          name: `${p.firstname} ${p.lastname}`,
          area: p.area, // ✅ Include area for filtering
        }));

        setPersonnel(allPersonnel);
        setAreaStatuses(areaStatusesRes.data.map((s) => ({ id: s.area_status_id, description: s.description })));

        // ✅ Automatically filter personnel by selected area
        if (initialValues?.area) {
          setFilteredPersonnel(allPersonnel.filter((p) => p.area === initialValues.area));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        personnel: parseInt(values.personnel, 10),
        area_status: parseInt(values.area_status, 10),
      };
  
      console.log("🚀 Sending Update Payload:", JSON.stringify(payload, null, 2)); // ✅ DEBUG
      await onSubmit(payload);
    } catch (error) {
      console.error("❌ Update Error:", error.response?.data);
      message.error(`Failed to update assignment: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {/* Project (Disabled - Just for Display) */}
      <Form.Item name="project" label="Project">
        <Select disabled>
          <Option value={initialValues?.project}>{initialValues?.project}</Option>
        </Select>
      </Form.Item>

      {/* Area (Disabled - Just for Display) */}
      <Form.Item name="area" label="Area">
        <Select disabled>
          <Option value={initialValues?.area}>{initialValues?.area_name}</Option>
        </Select>
      </Form.Item>

      {/* Personnel (Filtered by Area) */}
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
  );
};

export default EditAssignmentForm;
