import { useState } from 'react';
import api from '@/services/api';
import logoImg from "@/assets/LogoDaliyuan.png";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== LOGIN START ===');
    console.log('Email:', email);
    console.log('Password:', password);
    
    setError('');
    setLoading(true);
    
    try {
      console.log('Calling API...');
      const response = await api.post('/users/login', { email, password });
      console.log('API Response:', response.data);
      
      if (response.data && response.data.isAdmin && response.data.token) {
        console.log('Login successful!');
        console.log('Token:', response.data.token);
        
        localStorage.setItem('token', response.data.token);
        console.log('Token saved to localStorage');
        
        // Chuyển hướng ngay lập tức
        window.location.href = '/admin/products';
        return;
      } else {
        console.log('Login failed - not admin or no token');
        setError('Bạn không có quyền truy cập admin!');
      }
    } catch (error: any) {
      console.log('Login error:', error);
      setError(error.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img 
            src={logoImg} 
            alt="Daliyuan Logo" 
            style={{ 
              height: '64px', 
              marginBottom: '16px',
              objectFit: 'contain',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }} 
          />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '8px' }}>
            Đăng nhập Admin
          </h1>
          <p style={{ color: '#6b7280' }}>Chỉ dành cho quản trị viên Daliyuan</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email admin"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 