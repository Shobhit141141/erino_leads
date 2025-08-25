import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/user';
import { Button, TextInput, Paper, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';
import { LuEye, LuEyeClosed } from "react-icons/lu";
import SEO from './SEO';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refetch } = useAuthContext();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      refetch();
      toast.success('Login successful');
      navigate('/');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Login failed');
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    mutation.mutate(form);
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SEO title="Login Page" description="Login to your account" />
      <Paper className="max-w-md w-full p-8" shadow="md" radius="md" withBorder>
        <Title order={2} className="mb-6 text-center">Login</Title>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <TextInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            rightSection={<div onClick={() => setShowPassword(prev => !prev)} style={{ cursor: 'pointer' }}>
              {showPassword ? <LuEyeClosed size={18} /> : <LuEye size={18} />}
            </div>}
          />
          <Button type="submit" fullWidth loading={mutation.isPending}>
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}