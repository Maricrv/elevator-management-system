import React, { useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Form,
  Statistic,
  Table,
  Alert,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { getSalesReport } from "../../services/reportsService";

/**
 * SalesReport.jsx
 * REAL tables:
 * - sales (sale_id, client_id, model_id, price, paid, payment_date, payment_method, proforma_id, notes)
 * - clients (for client_name)
 * - elevator_models (for model_name)
 */

const { Title, Text } = Typography;

function downloadCSV(filename, rows) {
  if (!rows?.length) return;

  const header = [
    "sale_id",
    "client_id",
    "client_name",
    "model_id",
    "model_name",
    "price",
    "paid",
    "payment_date",
    "payment_method",
    "proforma_id",
    "notes",
  ];

  const escape = (v) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replaceAll('"', '""')}"`;
    }
    return s;
  };

  const csv = [
    header.join(","),
    ...rows.map((r) => header.map((k) => escape(r[k])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function SalesReport() {
  // Filters
  const [dateFrom, setDateFrom] = useState(dayjs("2025-01-01"));
  const [dateTo, setDateTo] = useState(dayjs("2025-12-31"));
  const [paid, setPaid] = useState("All"); // All | Paid | Unpaid
  const [search, setSearch] = useState("");

  // Data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Client-side filtering (keeps your exact logic)
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    const from = dateFrom?.toDate().getTime();
    const to = dateTo?.toDate().getTime();

    return rows.filter((r) => {
      // date filter uses payment_date; null => keep it
      const d = r.payment_date ? new Date(r.payment_date).getTime() : null;
      const inRange = d === null ? true : d >= from && d <= to;

      const byPaid =
        paid === "All"
          ? true
          : paid === "Paid"
          ? r.paid === true
          : r.paid === false;

      const bySearch =
        !q ||
        String(r.sale_id ?? "").toLowerCase().includes(q) ||
        String(r.client_name ?? "").toLowerCase().includes(q) ||
        String(r.model_name ?? "").toLowerCase().includes(q) ||
        String(r.payment_method ?? "").toLowerCase().includes(q);

      return inRange && byPaid && bySearch;
    });
  }, [rows, dateFrom, dateTo, paid, search]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      // newest payment_date first; nulls last
      const da = a.payment_date ? new Date(a.payment_date).getTime() : -1;
      const db = b.payment_date ? new Date(b.payment_date).getTime() : -1;
      return db - da;
    });
  }, [filteredRows]);

  // KPIs
  const kpis = useMemo(() => {
    const totalSales = filteredRows.length;
    const paidSales = filteredRows.filter((r) => r.paid === true).length;
    const unpaidSales = filteredRows.filter((r) => r.paid === false).length;

    const paidRevenue = filteredRows
      .filter((r) => r.paid === true)
      .reduce((sum, r) => sum + Number(r.price || 0), 0);

    return { totalSales, paidSales, unpaidSales, paidRevenue };
  }, [filteredRows]);

  async function generateReport() {
    setLoading(true);
    setErrorMsg("");

    try {
      const params = {
        date_from: dateFrom?.format("YYYY-MM-DD"),
        date_to: dateTo?.format("YYYY-MM-DD"),
        paid: paid === "All" ? "" : paid === "Paid" ? "true" : "false",
        q: search,
      };

      const data = await getSalesReport(params);
      const list = Array.isArray(data) ? data : data?.rows || [];
      setRows(list);
    } catch (e) {
      setErrorMsg(e?.message || "Failed to generate report.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setDateFrom(dayjs("2025-01-01"));
    setDateTo(dayjs("2025-12-31"));
    setPaid("All");
    setSearch("");
    setRows([]);
    setErrorMsg("");
  }

  const columns = [
    {
      title: "Sale ID",
      dataIndex: "sale_id",
      key: "sale_id",
      width: 110,
      render: (v) => <Text strong>{v}</Text>,
      sorter: (a, b) => Number(a.sale_id || 0) - Number(b.sale_id || 0),
    },
    {
      title: "Client",
      dataIndex: "client_name",
      key: "client_name",
      render: (v, r) => v || `Client ${r.client_id}`,
      sorter: (a, b) =>
        String(a.client_name || "").localeCompare(String(b.client_name || "")),
    },
    {
      title: "Model",
      dataIndex: "model_name",
      key: "model_name",
      render: (v, r) => v || `Model ${r.model_id}`,
      sorter: (a, b) =>
        String(a.model_name || "").localeCompare(String(b.model_name || "")),
    },
    {
      title: "Method",
      dataIndex: "payment_method",
      key: "payment_method",
      width: 160,
      render: (v) => v || "-",
      sorter: (a, b) =>
        String(a.payment_method || "").localeCompare(String(b.payment_method || "")),
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
      width: 110,
      render: (v) => (v ? <Tag color="blue">Yes</Tag> : <Tag>No</Tag>),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.paid === value,
    },
    {
      title: "Payment date",
      dataIndex: "payment_date",
      key: "payment_date",
      width: 140,
      render: (v) => v || "-",
      sorter: (a, b) => {
        const da = a.payment_date ? new Date(a.payment_date).getTime() : -1;
        const db = b.payment_date ? new Date(b.payment_date).getTime() : -1;
        return da - db;
      },
    },
    {
      title: "Proforma ID",
      dataIndex: "proforma_id",
      key: "proforma_id",
      width: 130,
      render: (v) => (v ?? "-"),
      sorter: (a, b) => Number(a.proforma_id || 0) - Number(b.proforma_id || 0),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      width: 140,
      render: (v) => Number(v || 0).toLocaleString(),
      sorter: (a, b) => Number(a.price || 0) - Number(b.price || 0),
    },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Sales Report
          </Title>
          <Text type="secondary">Sales + Client name + Model name (real DB)</Text>
        </Col>

        <Col>
          <Space wrap>
            <Button
              type="primary"
              onClick={generateReport}
              loading={loading}
              className="fixed-button"
            >
              Generate report
            </Button>

            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                downloadCSV(
                  `sales_report_${dateFrom?.format("YYYY-MM-DD")}_to_${dateTo?.format("YYYY-MM-DD")}.csv`,
                  sortedRows
                )
              }
              disabled={!sortedRows.length}
            >
              Export CSV
            </Button>

            <Button icon={<ReloadOutlined />} onClick={resetAll}>
              Reset
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="table-card" style={{ marginTop: 12 }}>
        <Form layout="vertical">
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Date from">
                <DatePicker
                  style={{ width: "100%" }}
                  value={dateFrom}
                  onChange={setDateFrom}
                  format="YYYY-MM-DD"
                  allowClear={false}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Date to">
                <DatePicker
                  style={{ width: "100%" }}
                  value={dateTo}
                  onChange={setDateTo}
                  format="YYYY-MM-DD"
                  allowClear={false}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Paid">
                <Select
                  value={paid}
                  onChange={setPaid}
                  options={[
                    { label: "All", value: "All" },
                    { label: "Paid", value: "Paid" },
                    { label: "Unpaid", value: "Unpaid" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Search">
                <Input
                  placeholder="Sale ID / client / model / method..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {errorMsg && (
        <Alert
          style={{ marginTop: 12 }}
          type="error"
          showIcon
          message={errorMsg}
        />
      )}

      {/* KPIs */}
      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic title="Sales in report" value={kpis.totalSales} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic title="Paid sales" value={kpis.paidSales} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic title="Unpaid sales" value={kpis.unpaidSales} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic
              title="Paid revenue (sum)"
              value={kpis.paidRevenue}
              formatter={(v) => Number(v || 0).toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card className="table-card" style={{ marginTop: 12 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Text strong>Sales</Text>
          <Text type="secondary">
            Showing <Text strong>{sortedRows.length}</Text> results
          </Text>
        </Row>

        <Table
          rowKey="sale_id"
          loading={loading}
          dataSource={sortedRows}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
}
