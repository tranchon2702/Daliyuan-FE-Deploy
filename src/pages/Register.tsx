import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { toast } from '@/hooks/use-toast';
import LogoDaliyuan from '../assets/LogoDaliyuan.png';

const PRIMARY_COLOR = '#e94d1a'; // Daliyuan chủ đạo

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Đăng ký thất bại', description: data.message || 'Vui lòng thử lại', variant: 'destructive' });
      } else {
        // Tự động đăng nhập luôn
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify({
          _id: data._id,
          fullName: data.fullName,
          email: data.email,
          isAdmin: data.isAdmin
        }));
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginMethod", "email");
        localStorage.setItem("loginTimestamp", Date.now().toString());
        toast({ title: 'Đăng ký thành công', description: 'Bạn đã được đăng nhập!', variant: 'default' });
        navigate('/my-account');
      }
    } catch (err) {
      toast({ title: 'Lỗi hệ thống', description: 'Vui lòng thử lại sau', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img src={LogoDaliyuan} alt="Daliyuan Logo" className="h-16 mb-6" />
        <h2 className="text-2xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>Đăng ký tài khoản</h2>
        <p className="mb-6 text-gray-500 text-sm">Chào mừng bạn đến với Daliyuan!<br/>Vui lòng điền thông tin để tạo tài khoản.</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              placeholder="Nhập họ và tên"
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Nhập email"
              className="mt-1"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Tối thiểu 6 ký tự"
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 text-lg font-semibold"
            style={{ background: PRIMARY_COLOR, color: '#fff' }}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
        <div className="mt-6 text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <button
            className="text-orange-600 underline hover:text-orange-800"
            type="button"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
} 