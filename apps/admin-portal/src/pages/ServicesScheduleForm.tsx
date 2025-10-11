import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { setSnackbar } from '../store/slices/snackbarSlice';
import { setVehicles } from '../store/slices/vehiclesSlice';

const ServiceScheduleForm = () => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: '',
    startDate: '',
    endDate: '',
    estimatedCost: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function fetchVehicles() {
    try {
      const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003';
      let apiRoot = apiBaseRaw.replace(/\/+$/, '').replace(/\/api(\/v\d+)?$/i, '');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token') || '';

      const res = await fetch(`${apiRoot}/api/v1/vehicles`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await (async () => {
        try {
          return await res.json();
        } catch {
          return null;
        }
      })();

      if (!res.ok) {
        console.warn('[ServiceScheduleForm] vehicles endpoint returned', res.status, json);
        dispatch(setVehicles([]));
        return;
      }

      const list = json?.vehicles || json?.data || (Array.isArray(json) ? json : []);
      dispatch(setVehicles(Array.isArray(list) ? list : []));
      console.debug('[ServiceScheduleForm] loaded vehicles', Array.isArray(list) ? list.length : 0);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      dispatch(setVehicles([]));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let apiRoot = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003')
        .replace(/\/+$/, '')
        .replace(/\/api(\/v\d+)?$/i, '');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token') || '';

      const response = await fetch(`${apiRoot}/api/v1/vehicles/service/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          estimatedCost: parseFloat(formData.estimatedCost) || 0,
        }),
      });

      const data = await response.json();
      if (data.success) {
        dispatch(
          setSnackbar({
            open: true,
            message: 'Service scheduled successfully',
            severity: 'success',
          })
        );
        setTimeout(() => {
          navigate('/services');
        }, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Failed to schedule service',
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Service Schedule</h2>
      <div>
        <label>Vehicle ID:</label>
        <input
          type="text"
          value={formData.vehicleId}
          onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
        />
      </div>
      <div>
        <label>Service Type:</label>
        <input
          type="text"
          value={formData.serviceType}
          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
      </div>
      <div>
        <label>Estimated Cost:</label>
        <input
          type="number"
          value={formData.estimatedCost}
          onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Scheduling...' : 'Schedule Service'}
      </button>
    </form>
  );
};

export default ServiceScheduleForm;
