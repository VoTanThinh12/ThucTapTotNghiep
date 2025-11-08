import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import pitchService from '../../services/pitchService';
import { formatCurrency } from '../../utils/formatters';
import { PITCH_TYPES, PITCH_STATUS } from '../../utils/constants';
import Loading from '../../components/common/Loading';

const ManagePitches = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPitch, setEditingPitch] = useState(null);

  useEffect(() => {
    loadPitches();
  }, []);

  const loadPitches = async () => {
    try {
      setLoading(true);
      const data = await pitchService.getAllPitches({ status: '' });
      setPitches(data.pitches || []);
    } catch (error) {
      toast.error('Không thể tải danh sách sân');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sân này?')) {
      return;
    }

    try {
      await pitchService.deletePitch(id);
      toast.success('Xóa sân thành công');
      loadPitches();
    } catch (error) {
      toast.error(error.message || 'Xóa sân thất bại');
    }
  };

  const handleEdit = (pitch) => {
    setEditingPitch(pitch);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPitch(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    loadPitches();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý sân</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Thêm sân mới</span>
        </button>
      </div>

      {/* Pitches Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tên sân</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Loại</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Địa chỉ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giờ mở cửa</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pitches.map((pitch) => (
                <tr key={pitch.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">#{pitch.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{pitch.name}</td>
                  <td className="px-4 py-3 text-sm">{PITCH_TYPES[pitch.type]}</td>
                  <td className="px-4 py-3 text-sm">{pitch.location}</td>
                  <td className="px-4 py-3 text-sm">{pitch.open_time} - {pitch.close_time}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(pitch.min_price)} - {formatCurrency(pitch.max_price)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`badge badge-${PITCH_STATUS[pitch.status]?.color}`}>
                      {PITCH_STATUS[pitch.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(pitch)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(pitch.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal would go here */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingPitch ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
            </h2>
            <p className="text-gray-600 mb-4">
              Form chi tiết sẽ được implement ở đây
            </p>
            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseForm} className="btn btn-secondary">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePitches;
