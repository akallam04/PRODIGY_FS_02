import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EmployeeCard from '../components/EmployeeCard';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function EmployeeList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [sortValue, setSortValue] = useState('');

  // Debounce search input by 350ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Populate department filter from full list once on mount
  useEffect(() => {
    api
      .get('/api/employees')
      .then(({ data }) => {
        const unique = [...new Set(data.data.map((e) => e.department))].sort();
        setDepartments(unique);
      })
      .catch(() => {});
  }, []);

  const getSortParams = (val) => {
    if (val === 'name-asc') return { sort: 'name', order: 'asc' };
    if (val === 'salary-desc') return { sort: 'salary', order: 'desc' };
    if (val === 'salary-asc') return { sort: 'salary', order: 'asc' };
    if (val === 'hireDate-desc') return { sort: 'hireDate', order: 'desc' };
    return {};
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (department) params.department = department;
      Object.assign(params, getSortParams(sortValue));
      const { data } = await api.get('/api/employees', { params });
      setEmployees(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [search, department, sortValue]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/employees/${deleteTarget._id}`);
      toast.success('Employee deleted successfully');
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  const isFiltered = searchInput || department;

  return (
    <div className="page-wrapper">
      <div className="list-header">
        <h1 className="list-title">
          Employees
          {!loading && (
            <span className="list-count"> ({employees.length})</span>
          )}
        </h1>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">&#128269;</span>
          <input
            className="form-input"
            type="text"
            placeholder="Search by name, email, or position…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <select
          className="form-select filter-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className="form-select filter-select"
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
        >
          <option value="">Sort by…</option>
          <option value="name-asc">Name A–Z</option>
          <option value="salary-desc">Salary: High to Low</option>
          <option value="salary-asc">Salary: Low to High</option>
          <option value="hireDate-desc">Newest Hires</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" />
        </div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No employees found</h3>
          <p>
            {isFiltered
              ? 'Try adjusting your search or filters.'
              : 'No employees yet. Add your first one!'}
          </p>
        </div>
      ) : (
        <div className="employee-grid">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              isAdmin={user?.role === 'admin'}
              onClick={() => navigate(`/employees/${emp._id}`)}
              onEdit={() => navigate(`/employees/${emp._id}/edit`)}
              onDelete={() => setDeleteTarget(emp)}
            />
          ))}
        </div>
      )}

      {user?.role === 'admin' && (
        <Link to="/employees/new" className="fab" title="Add Employee">
          +
        </Link>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
