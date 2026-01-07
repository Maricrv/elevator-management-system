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
import { getProformasReport } from "../../services/reportsService";

const { Title, Text } = Typography;

const STATUS_ORDER = ["Pending", "Accepted", "Rejected"];

function downloadCSV(filename, rows) {
  if (!rows?.length) return;

  const header = [
    "proforma_id",
    "client_id",
    "client_name",
    "project_name",
    "proforma_date",
    "valid_until",
    "total_amount",
    "status",
    "is_converted_to_sale",
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
  if (s === "Accepted") return "green";
  if (s === "Pending") return "gold";
  if (s === "Rejected") return "red";
  return "default";
};

export default function ProformasReports() {
  // Filters
  const [dateFrom, setDateFrom] = useState(dayjs("2025-01-01"));
  const [dateTo, setDateTo] = useState(dayjs("2025-12-31"));
  const [status, setStatus] = useState("All");
  const [converted, setConverted] = useState("All"); // All | Yes | No
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

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((r) => {
      const byStatus = status === "All" ? true : r.status === status;

      const byConverted =
        converted === "All"
          ? true
          : converted === "Yes"
          ? r.is_converted_to_sale === true
          : r.is_converted_to_sale === false;

      const bySearch =
        !q ||
        String(r.proforma_id ?? "").toLowerCase().includes(q) ||
        String(r.project_name ?? "").toLowerCase().includes(q) ||
        String(r.client_name ?? "").toLowerCase().includes(q);

      return byStatus && byConverted && bySearch;
    });
  }, [rows, status, converted, search]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort(
      (a, b) => Number(b.proforma_id || 0) - Number(a.proforma_id || 0)
    );
  }, [filteredRows]);

  const kpis = useMemo(() => {
    const total = filteredRows.length;
    const pending = filteredRows.filter((r) => r.status === "Pending").length;
    const accepted = filteredRows.filter((r) => r.status === "Accepted").length;
    const convertedCount = filteredRows.filter(
      (r) => r.is_converted_to_sale === true
    ).length;

    const pipelineTotal = filteredRows.reduce(
      (sum, r) => sum + Number(r.total_amount || 0),
      0
    );

    return { total, pending, accepted, convertedCount, pipelineTotal };
  }, [filteredRows]);

  async function generateReport() {
    setLoading(true);
    setErrorMsg("");

    try {
      const params = {
        date_from: dateFrom?.format("YYYY-MM-DD"),
        date_to: dateTo?.format("YYYY-MM-DD"),
        status: status === "All" ? "" : status,
        converted:
          converted === "All" ? "" : converted === "Yes" ? "true" : "false",
        q: search,
      };

      const data = await getProformasReport(params);
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
    setConverted("All");
    setSearch("");
    setRows([]);
    setErrorMsg("");
  }

  const columns = [
    {
      title: "Proforma ID",
      dataIndex: "proforma_id",
      key: "proforma_id",
      width: 120,
      render: (v) => <Text strong>{v}</Text>,
      sorter: (a, b) => Number(a.proforma_id || 0) - Number(b.proforma_id || 0),
      defaultSortOrder: "descend",
    },
    {
      title: "Client",
      dataIndex: "client_name",
      key: "client_name",
      render: (v, r) => v || `Client ${r.client_id}`,
    },
    {
      title: "Project",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (s) => <Tag color={statusColor(s)}>{s || "-"}</Tag>,
      filters: statusOptions
        .filter((s) => s !== "All")
        .map((s) => ({ text: s, value: s })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Converted",
      dataIndex: "is_converted_to_sale",
      key: "is_converted_to_sale",
      width: 130,
      render: (v) => (v ? <Tag color="blue">Yes</Tag> : <Tag>No</Tag>),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.is_converted_to_sale === value,
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "right",
      width: 140,
      render: (v) => Number(v || 0).toLocaleString(),
      sorter: (a, b) => Number(a.total_amount || 0) - Number(b.total_amount || 0),
    },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Proformas Report
          </Title>
          <Text type="secondary">
            Commercial pipeline (Pending / Accepted / Rejected)
          </Text>
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
                  `proformas_report_${dateFrom?.format("YYYY-MM-DD")}_to_${dateTo?.format("YYYY-MM-DD")}.csv`,
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
              <Form.Item label="Converted">
                <Select
                  value={converted}
                  onChange={setConverted}
                  options={[
                    { label: "All", value: "All" },
                    { label: "Converted", value: "Yes" },
                    { label: "Not converted", value: "No" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Search">
                <Input
                  placeholder="Proforma / project / client..."
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
            <Statistic title="Proformas in report" value={kpis.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic title="Pending" value={kpis.pending} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic title="Accepted" value={kpis.accepted} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <Statistic title="Converted" value={kpis.convertedCount} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card className="summary-card">
            <Statistic
              title="Pipeline total (sum)"
              value={kpis.pipelineTotal}
              formatter={(v) => Number(v || 0).toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card className="table-card" style={{ marginTop: 12 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Text strong>Proformas</Text>
          <Text type="secondary">
            Showing <Text strong>{sortedRows.length}</Text> results
          </Text>
        </Row>

        <Table
          rowKey="proforma_id"
          loading={loading}
          dataSource={sortedRows}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
}
