import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

function formatSalary(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get(`/api/employees/${id}`)
      .then(({ data }) => setEmployee(data.data))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Employee not found');
        navigate('/employees');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/employees/${id}`);
      toast.success('Employee deleted successfully');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="page-wrapper">
      <button className="back-btn" onClick={() => navigate('/employees')}>
        ← Back to Employees
      </button>

      <div className="details-card">
        <div className="details-header">
          <h1 className="details-name">{employee.name}</h1>
          <p className="details-position">{employee.position}</p>
          <span className="dept-badge">{employee.department}</span>
        </div>

        <div className="details-body">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{employee.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{employee.phone || '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Salary</span>
              <span className="detail-value">{formatSalary(employee.salary)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hire Date</span>
              <span className="detail-value">Hired on {formatDate(employee.hireDate)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Department</span>
              <span className="detail-value">{employee.department}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Position</span>
              <span className="detail-value">{employee.position}</span>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="details-actions">
            <button
              className="btn btn-outline"
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              Edit Employee
            </button>
            <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
              Delete Employee
            </button>
          </div>
        )}
      </div>

      {showDelete && (
        <ConfirmDeleteModal
          name={employee.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
