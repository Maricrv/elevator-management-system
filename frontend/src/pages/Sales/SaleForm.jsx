import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Form, Input, Select, Button, Row, Col, message, DatePicker } from "antd";
import { fetchModels } from "../../services/modelsService";
import { fetchProformas } from "../../services/proformaService";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "SEPA_DIRECT_DEBIT", label: "SEPA Direct Debit" },
  { value: "INVOICE", label: "Invoice" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "CASH", label: "Cash" },
];

const SaleForm = ({ initialValues = {}, onSubmit }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [proformas, setProformas] = useState([]);
  const [selectedProforma, setSelectedProforma] = useState(null);
  const [isPaid, setIsPaid] = useState(initialValues?.paid || false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingProformas, setLoadingProformas] = useState(false);

  // Load initial values into the form
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        payment_date: initialValues.payment_date ? dayjs(initialValues.payment_date) : null,
        proforma_id: initialValues.proforma || null,
        client_id: initialValues.client || null,
      });
      setIsPaid(initialValues?.paid || false);
    }
  }, [initialValues, form]);

  useEffect(() => {
    const loadModels = async () => {
      setLoadingModels(true);
      try {
        const data = await fetchModels();
        setModels(Array.isArray(data) ? data : []);
      } catch (error) {
        message.error("Failed to fetch models.");
      } finally {
        setLoadingModels(false);
      }
    };

    const loadProformas = async () => {
      setLoadingProformas(true);
      try {
        const data = await fetchProformas();
        setProformas(Array.isArray(data) ? data : []);
      } catch (error) {
        message.error("Failed to fetch proformas.");
      } finally {
        setLoadingProformas(false);
      }
    };

    loadModels();
    loadProformas();
  }, []);

  const handleProformaChange = (value) => {
    const selected = proformas.find((p) => p.proforma_id === value);
    setSelectedProforma(selected);

    form.setFieldsValue({
      client_name: selected?.client_name || "",
      client_id: selected?.client || null,
    });
  };

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      proforma: values.proforma_id,
      client: values.client_id,
      payment_date: isPaid && values.payment_date ? values.payment_date.format("YYYY-MM-DD") : null,
      payment_method: isPaid ? values.payment_method : null, // Ensure payment method is null if unpaid
    };

    console.log("🔍 Sending Data:", JSON.stringify(formattedValues, null, 2));
    onSubmit(formattedValues);

  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ padding: "16px", background: "#fafafa", borderRadius: "4px" }}
    >
      <Row gutter={16}>
        {/* Proforma ID Selection (Greyed out when editing) */}
        <Col span={12}>
          <Form.Item
            label="Proforma ID"
            name="proforma_id"
            rules={[{ required: true, message: "Please select a proforma" }]}
          >
            <Select
              placeholder="Select a proforma"
              showSearch
              onChange={handleProformaChange}
              value={form.getFieldValue("proforma_id") || undefined}
              disabled={!!initialValues?.sale_id} // Read-only when editing
              style={{
                backgroundColor: initialValues?.sale_id ? "#f5f5f5" : "white", // Grey when editing
                color: initialValues?.sale_id ? "#888" : "black",
                cursor: initialValues?.sale_id ? "not-allowed" : "pointer",
              }}
            >
              {proformas.map((proforma) => (
                <Option key={proforma.proforma_id} value={proforma.proforma_id}>
                  {proforma.proforma_id}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="client_id" hidden>
            <Input />
          </Form.Item>
        </Col>

        {/* Client Name (Always Greyed Out) */}
        <Col span={12}>
          <Form.Item label="Client Name" name="client_name">
            <Input
              readOnly
              style={{
                backgroundColor: "#f5f5f5",
                color: "#888",
                cursor: "not-allowed",
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Other Fields */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Model" name="model" rules={[{ required: true, message: "Please select a model" }]}>
            <Select placeholder="Select a model" loading={loadingModels}>
              {models.map((model) => (
                <Option key={model.model_id} value={model.model_id}>
                  {model.model_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price" }]}>
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Payment Status" name="paid" rules={[{ required: true, message: "Please select payment status" }]}>
            <Select
              onChange={(value) => {
                setIsPaid(value);
                if (!value) {
                  form.setFieldsValue({ payment_date: null, payment_method: null });
                }
              }}
            >
              <Option value={true}>Paid</Option>
              <Option value={false}>Unpaid</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Payment Date"
            name="payment_date"
            rules={isPaid ? [{ required: true, message: "Please select a payment date" }] : []}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} disabled={!isPaid} />
          </Form.Item>
        </Col>
      </Row>

      {/* Payment Method */}
      <Row>
        <Col span={12}>
          <Form.Item
            label="Payment Method"
            name="payment_method"
            rules={isPaid ? [{ required: true, message: "Please select payment method" }] : []}
          >
            <Select placeholder="Select payment method" disabled={!isPaid}>
              {PAYMENT_METHODS.map((method) => (
                <Option key={method.value} value={method.value}>
                  {method.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row justify="end">
        <Col>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SaleForm;
