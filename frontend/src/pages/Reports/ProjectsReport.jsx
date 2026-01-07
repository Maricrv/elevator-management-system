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
import { getProjectsReport } from "../../services/reportsService";

const { Title, Text } = Typography;

const STATUS_ORDER = [
  "Planning",
  "In Progress",
  "Quality check",
  "Safety Inspection",
  "Completed",
];

function downloadCSV(filename, rows) {
  if (!rows?.length) return;

  const header = [
    "project_id",
    "project_name",
    "client_id",
    "client_name",
    "status",
    "type",
    "paid",
    "payment_date",
    "price",
    "sale_id",
    "proforma_id",
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

const statusColor = (s) => {
  if (s === "Completed") return "green";
  if (s === "In Progress") return "blue";
  if (s === "Planning") return "gold";
  if (s === "Quality check") return "purple";
  if (s === "Safety Inspection") return "cyan";
  return "default";
};

export default function ProjectsReport() {
  // Filters (use dayjs so AntD DatePicker works nicely)
  const [dateFrom, setDateFrom] = useState(dayjs("2025-01-01"));
  const [dateTo, setDateTo] = useState(dayjs("2025-12-31"));
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [paid, setPaid] = useState("All"); // All | Paid | Unpaid
  const [search, setSearch] = useState("");

  // Data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const statusOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.status).filter(Boolean));
    return [
      "All",
      ...STATUS_ORDER.filter((x) => set.has(x)),
      ...Array.from(set).filter((s) => !STATUS_ORDER.includes(s)),
    ];
  }, [rows]);

  const typeOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.type).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((r) => {
      const byStatus = status === "All" ? true : r.status === status;
      const byType = type === "All" ? true : r.type === type;

      const byPaid =
        paid === "All"
          ? true
          : paid === "Paid"
          ? r.paid === true
          : r.paid === false;

      const bySearch =
        !q ||
        String(r.project_id ?? "").toLowerCase().includes(q) ||
        String(r.project_name ?? "").toLowerCase().includes(q) ||
        String(r.client_name ?? "").toLowerCase().includes(q);

      return byStatus && byType && byPaid && bySearch;
    });
  }, [rows, status, type, paid, search]);

  const sortedRows = useMemo(() => {
    const rank = (s) =>
      STATUS_ORDER.indexOf(s) === -1 ? 999 : STATUS_ORDER.indexOf(s);

    return [...filteredRows].sort((a, b) => {
      const sr = rank(a.status) - rank(b.status);
      if (sr !== 0) return sr;
      return String(a.project_id).localeCompare(String(b.project_id));
    });
  }, [filteredRows]);

  const kpis = useMemo(() => {
    const totalProjects = filteredRows.length;
    const completed = filteredRows.filter((r) => r.status === "Completed").length;
    const inProgress = filteredRows.filter((r) => r.status === "In Progress").length;

    const paidRevenue = filteredRows
      .filter((r) => r.paid === true)
      .reduce((sum, r) => sum + Number(r.price || 0), 0);

    return { totalProjects, completed, inProgress, paidRevenue };
  }, [filteredRows]);

  async function generateReport() {
    setLoading(true);
    setErrorMsg("");

    try {
      const params = {
        date_from: dateFrom?.format("YYYY-MM-DD"),
        date_to: dateTo?.format("YYYY-MM-DD"),
        status: status === "All" ? "" : status,
        type: type === "All" ? "" : type,
        paid: paid === "All" ? "" : paid === "Paid" ? "true" : "false",
        q: search,
      };

      const data = await getProjectsReport(params);
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
    setStatus("All");
    setType("All");
    setPaid("All");
    setSearch("");
    setRows([]);
    setErrorMsg("");
  }

  const columns = [
    {
      title: "Project",
      key: "project",
      render: (_, r) => (
        <div>
          <Text strong>{r.project_name || "-"}</Text>
          <div style={{ marginTop: 2 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {r.project_id ?? "-"}
            </Text>
          </div>
        </div>
      ),
      sorter: (a, b) =>
        String(a.project_name || "").localeCompare(String(b.project_name || "")),
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 170,
      render: (s) => <Tag color={statusColor(s)}>{s || "-"}</Tag>,
      filters: statusOptions
        .filter((s) => s !== "All")
        .map((s) => ({ text: s, value: s })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 180,
      render: (t) => t || "-",
      filters: typeOptions
        .filter((t) => t !== "All")
        .map((t) => ({ text: t, value: t })),
      onFilter: (value, record) => record.type === value,
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
            Projects Report
          </Title>
          <Text type="secondary">Project execution overview (projects + sales)</Text>
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
                  `projects_report_${dateFrom?.format("YYYY-MM-DD")}_to_${dateTo?.format("YYYY-MM-DD")}.csv`,
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
              <Form.Item label="Status">
                <Select
                  value={status}
                  onChange={setStatus}
                  options={statusOptions.map((s) => ({ label: s, value: s }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Type">
                <Select
                  value={type}
                  onChange={setType}
                  options={typeOptions.map((t) => ({ label: t, value: t }))}
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
                  placeholder="Project ID / name / client..."
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
            <Statistic title="Projects in report" value={kpis.totalProjects} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic title="Completed" value={kpis.completed} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic title="In Progress" value={kpis.inProgress} />
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
          <Text strong>Projects</Text>
          <Text type="secondary">
            Showing <Text strong>{sortedRows.length}</Text> results
          </Text>
        </Row>

        <Table
          rowKey="project_id"
          loading={loading}
          dataSource={sortedRows}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
}
