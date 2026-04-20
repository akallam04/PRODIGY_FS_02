import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const EMPTY = {
  name: '',
  email: '',
  position: '',
  department: '',
  salary: '',
  phone: '',
  hireDate: '',
};

function toDateInput(d) {
  if (!d) return '';
  return new Date(d).toISOString().split('T')[0];
}

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/api/employees/${id}`)
      .then(({ data }) => {
        const e = data.data;
        setForm({
          name: e.name || '',
          email: e.email || '',
          position: e.position || '',
          department: e.department || '',
          salary: e.salary !== undefined ? String(e.salary) : '',
          phone: e.phone || '',
          hireDate: toDateInput(e.hireDate),
        });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load employee');
        navigate('/employees');
      })
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.position.trim()) e.position = 'Position is required';
    if (!form.department.trim()) e.department = 'Department is required';
    if (form.salary === '' || form.salary === null) e.salary = 'Salary is required';
    else if (isNaN(Number(form.salary)) || Number(form.salary) < 0)
      e.salary = 'Salary must be a non-negative number';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      position: form.position.trim(),
      department: form.department.trim(),
      salary: Number(form.salary),
      phone: form.phone.trim() || undefined,
      hireDate: form.hireDate || undefined,
    };
    try {
      if (isEdit) {
        await api.put(`/api/employees/${id}`, payload);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/api/employees', payload);
        toast.success('Employee added successfully');
      }
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="form-page">
        <div className="form-page-header">
          <button className="back-btn" onClick={() => navigate('/employees')}>
            ← Back to Employees
          </button>
          <h1 className="form-page-title">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
          <p className="form-page-subtitle">
            {isEdit ? 'Update the employee record below.' : 'Fill in the details to add a new employee.'}
          </p>
        </div>

        <div className="form-card">
          <form className="employee-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name *</label>
                <input
                  id="name" name="name" type="text"
                  className={`form-input${errors.name ? ' error' : ''}`}
                  placeholder="e.g. Jane Smith"
                  value={form.name} onChange={handleChange}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="emp-email">Email address *</label>
                <input
                  id="emp-email" name="email" type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="e.g. name@example.com"
                  value={form.email} onChange={handleChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="position">Position *</label>
                <input
                  id="position" name="position" type="text"
                  className={`form-input${errors.position ? ' error' : ''}`}
                  placeholder="e.g. Software Engineer"
                  value={form.position} onChange={handleChange}
                />
                {errors.position && <span className="form-error">{errors.position}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="department">Department *</label>
                <input
                  id="department" name="department" type="text"
                  className={`form-input${errors.department ? ' error' : ''}`}
                  placeholder="e.g. Engineering"
                  value={form.department} onChange={handleChange}
                />
                {errors.department && <span className="form-error">{errors.department}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="salary">Annual salary (USD) *</label>
                <input
                  id="salary" name="salary" type="number" min="0"
                  className={`form-input${errors.salary ? ' error' : ''}`}
                  placeholder="e.g. 75000"
                  value={form.salary} onChange={handleChange}
                />
                {errors.salary && <span className="form-error">{errors.salary}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone number</label>
                <input
                  id="phone" name="phone" type="tel"
                  className="form-input"
                  placeholder="e.g. +1 555 000 1234"
                  value={form.phone} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: 280 }}>
              <label className="form-label" htmlFor="hireDate">Hire date</label>
              <input
                id="hireDate" name="hireDate" type="date"
                className="form-input"
                value={form.hireDate} onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/employees')}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save Changes' : 'Add Employee')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
