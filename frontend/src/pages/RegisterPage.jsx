import React, { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/user';
import { Button, TextInput, Paper, Title, Progress, Box, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Registration successful');
      navigate('/');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Registration failed');
    },
  });

  const passwordStrength = useMemo(() => {
    if (!form.password) return 0;
    
    let strength = 0;
    if (form.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(form.password)) strength += 25;
    if (/[a-z]/.test(form.password)) strength += 25;
    if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) strength += 25;
    
    return strength;
  }, [form.password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'red';
    if (passwordStrength <= 50) return 'orange';
    if (passwordStrength <= 75) return 'yellow';
    return 'green';
  };

  const passwordRequirements = useMemo(() => {
    return {
      hasMinLength: form.password.length >= 8,
      hasUpperCase: /[A-Z]/.test(form.password),
      hasLowerCase: /[a-z]/.test(form.password),
      hasNumberOrSymbol: /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password),
    };
  }, [form.password]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength < 100) {
      newErrors.password = 'Password does not meet all requirements';
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
    <Paper className="max-w-md mx-auto mt-12 p-8" shadow="md" radius="md" withBorder>
      <Title order={2} className="mb-6 text-center">Register</Title>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
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
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        {form.password && (
          <Box mt="sm">
            <Text size="sm" weight={500} mb={5}>
              Password strength
            </Text>
            <Progress 
              value={passwordStrength} 
              color={getStrengthColor()} 
              size="sm" 
              mb={10}
            />
            
            <Box>
              <Text size="xs" color={passwordRequirements.hasMinLength ? 'green' : 'red'}>
                {passwordRequirements.hasMinLength ? '✓' : '✗'} At least 8 characters
              </Text>
              <Text size="xs" color={passwordRequirements.hasUpperCase ? 'green' : 'red'}>
                {passwordRequirements.hasUpperCase ? '✓' : '✗'} Contains uppercase letter
              </Text>
              <Text size="xs" color={passwordRequirements.hasLowerCase ? 'green' : 'red'}>
                {passwordRequirements.hasLowerCase ? '✓' : '✗'} Contains lowercase letter
              </Text>
              <Text size="xs" color={passwordRequirements.hasNumberOrSymbol ? 'green' : 'red'}>
                {passwordRequirements.hasNumberOrSymbol ? '✓' : '✗'} Contains number or symbol
              </Text>
            </Box>
          </Box>
        )}
        
        <Button type="submit" fullWidth loading={mutation.isPending} mt="md">
          Register
        </Button>
      </form>
    </Paper>
  );
}