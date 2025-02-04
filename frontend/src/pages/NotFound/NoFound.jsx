import React, { useState, useEffect } from "react";
import { ElevatorSidebar } from "../components/Sidebar";

import axios from "axios";
import { Modal, Button, Table, Spinner, Alert, Form } from "react-bootstrap";

const ClientDashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClient, setNewClient] = useState({
    client_name: "",
    client_abbreviation: "",
    email: "",
    phone: "",
    client_contact: "",
    address: "",
    postal_code: "",
    city: "",
    country: "",
    project_count: "",
  });
  const [formError, setFormError] = useState(null);
  const [searchModal, setSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clients/`);
      setClients(response.data);
    } catch {
      setError("Failed to fetch clients. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateClient = async () => {
    const url = selectedClient
      ? `${API_BASE_URL}/api/clients/${selectedClient.client_id}/`
      : `${API_BASE_URL}/api/clients/`;
    const method = selectedClient ? "put" : "post";
    try {
      const data = selectedClient || newClient;
      const response = await axios({ method, url, data });
      setClients((prevClients) => {
        if (selectedClient) {
          return prevClients.map((client) =>
            client.client_id === response.data.client_id ? response.data : client
          );
        }
        return [...prevClients, response.data];
      });
      resetModals();
    } catch {
      setFormError("Failed to save client. Please try again.");
    }
  };

  const handleDeleteClient = async (clientId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/clients/${clientId}/`);
      setClients((prev) => prev.filter((client) => client.client_id !== clientId));
      if (searchResult && searchResult.client_id === clientId) setSearchResult(null);
    } catch {
      alert("Failed to delete client. Please try again.");
    }
  };

  const handleSearchClient = async () => {
    setSearchError(null);
    setSearchResult(null);
    if (!searchQuery.trim()) {
      setSearchError("Please enter a name or abbreviation to search.");
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clients/`, {
        params: { search: searchQuery },
      });
      if (response.data.length > 0) {
        setSearchResult(response.data[0]);
      } else {
        setSearchError("No clients found.");
      }
    } catch {
      setSearchError("Failed to search. Please try again.");
    }
  };

  const resetModals = () => {
    setShowModal(false);
    setSearchModal(false);
    setFormError(null);
    setSelectedClient(null);
    setNewClient({
      client_name: "",
      client_abbreviation: "",
      email: "",
      phone: "",
      client_contact: "",
      address: "",
      postal_code: "",
      city: "",
      country: "",
      project_count: "",
    });
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (selectedClient) {
      setSelectedClient({ ...selectedClient, [field]: value });
    } else {
      setNewClient({ ...newClient, [field]: value });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ElevatorSidebar */}
      <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
        <ElevatorSidebar />
      </div>
  
      {/* Main Content */}
      <div className="container mt-4" style={{ flexGrow: 1 }}>
        <h1 className="mb-4">Client Dashboard</h1>
        {loading ? <Spinner animation="border" /> : error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <>
            <div className="d-flex mb-3">
              <Button onClick={() => setShowModal(true)}>Add Client</Button>
              <Button className="ms-2" onClick={() => setSearchModal(true)}>Search Client</Button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Abbreviation</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.client_id}>
                    <td>{client.client_name}</td>
                    <td>{client.client_abbreviation}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => { setSelectedClient(client); setShowModal(true); }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClient(client.client_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
  
        <Modal show={showModal} onHide={resetModals}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedClient ? "Edit Client" : "Add Client"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            <Form>
              {Object.keys(newClient).map((field) => (
                <Form.Group className="mb-3" key={field}>
                  <Form.Label>{field.replace("_", " ").toUpperCase()}</Form.Label>
                  <Form.Control
                    type={field === "project_count" ? "number" : "text"}
                    placeholder={`Enter ${field.replace("_", " ")}`}
                    value={selectedClient ? selectedClient[field] : newClient[field]}
                    onChange={(e) => handleInputChange(e, field)}
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetModals}>Cancel</Button>
            <Button variant="primary" onClick={handleAddOrUpdateClient} disabled={actionLoading}>
              {actionLoading ? <Spinner size="sm" /> : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
  
};

export default ClientDashboard;
