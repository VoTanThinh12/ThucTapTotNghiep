import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({
        username: data.username,
        password: data.password,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email
      });
      toast.success('Đăng ký thành công!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-3xl">⚽</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Đăng ký</h2>
          <p className="text-gray-600 mt-2">Tạo tài khoản mới</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                {...register('username', {
                  required: 'Username là bắt buộc',
                  minLength: { value: 3, message: 'Username tối thiểu 3 ký tự' }
                })}
                className="input"
                placeholder="Nhập username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên *
              </label>
              <input
                type="text"
                {...register('full_name', { required: 'Họ tên là bắt buộc' })}
                className="input"
                placeholder="Nhập họ tên"
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                {...register('phone', {
                  pattern: { value: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                })}
                className="input"
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
                })}
                className="input"
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password là bắt buộc',
                  minLength: { value: 6, message: 'Password tối thiểu 6 ký tự' }
                })}
                className="input"
                placeholder="Nhập password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận password *
              </label>
              <input
                type="password"
                {...register('confirm_password', {
                  required: 'Vui lòng xác nhận password',
                  validate: value => value === password || 'Password không khớp'
                })}
                className="input"
                placeholder="Nhập lại password"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
