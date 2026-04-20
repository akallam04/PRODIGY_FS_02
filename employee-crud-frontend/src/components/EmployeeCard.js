import React from 'react';

export default function EmployeeCard({ employee, isAdmin, onClick, onEdit, onDelete }) {
  const { name, position, department, email } = employee;

  return (
    <div className="employee-card">
      <div className="employee-card-body" onClick={onClick} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}>
        <p className="employee-card-name">{name}</p>
        <p className="employee-card-position">{position}</p>
        <span className="dept-badge">{department}</span>
        <p className="employee-card-email">{email}</p>
      </div>

      {isAdmin && (
        <div className="employee-card-footer">
          <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
