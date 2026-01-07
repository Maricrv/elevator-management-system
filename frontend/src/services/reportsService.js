import api from "./api"; // baseURL = "/api"

// keep your existing ones
export async function getProjectsReport(params) {
  const res = await api.get("/reports/projects/", { params });
  return res.data;
}

export async function getProformasReport(params) {
  const res = await api.get("/reports/proformas/", { params });
  return res.data;
}

// ✅ FIXED
export async function getSalesReport(params) {
  const res = await api.get("/reports/sales/", { params }); // ✅ no /api here
  return res.data;
}


