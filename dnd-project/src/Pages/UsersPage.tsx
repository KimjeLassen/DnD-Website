import { useState, useEffect } from 'react';
import { usersAPI, rolesAPI } from '../services/api';
import type { User, Role } from '../types';
import '../styles/users.css';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    role_id: '',
  });

  useEffect(() => {
    loadUsersAndRoles();
  }, []);

  const loadUsersAndRoles = async () => {
    try {
      setIsLoading(true);
      const [usersData, rolesData] = await Promise.all([
        usersAPI.getAll(),
        rolesAPI.getAll(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      if (rolesData.length > 0) {
        setFormData(prev => ({ ...prev, role_id: rolesData[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name || !formData.password || !formData.role_id) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await usersAPI.create({
        name: formData.name,
        password: formData.password,
        role_id: formData.role_id,
      });

      setSuccess('User created successfully!');
      setFormData({
        name: '',
        password: '',
        confirmPassword: '',
        role_id: roles[0]?.id || '',
      });

      // Reload users
      await loadUsersAndRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || roleId;
  };

  return (
    <div className="users-page">
      <div className="users-container">
        <div className="users-header">
          <h1>User Management</h1>
          <p>Create and manage user accounts</p>
        </div>

        <div className="users-content">
          <div className="create-user-section">
            <h2>Create New User</h2>
            <form onSubmit={handleSubmit} className="create-user-form">
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="form-group">
                <label htmlFor="name">Username *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (min 6 characters)"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role_id">Role *</label>
                <select
                  id="role_id"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  disabled={isLoading || roles.length === 0}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>

          <div className="users-list-section">
            <h2>Existing Users ({users.length})</h2>
            {users.length === 0 ? (
              <p className="no-users">No users found</p>
            ) : (
              <div className="users-table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{getRoleName(user.role_id)}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
