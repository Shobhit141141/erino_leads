import React, { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser, userNameAlreadyTaken } from '../api/user';
import { Button, TextInput, Paper, Title, Progress, Box, Text, ThemeIcon, List, Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheck, FaCircleCheck } from 'react-icons/fa6';
import { FaTimes, FaTimesCircle } from 'react-icons/fa';
import { useRef } from 'react';

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

  const [usernameStatus, setUsernameStatus] = useState('');
  const debounceRef = useRef();
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
    if (name === 'username') {
      setUsernameStatus('');
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) return;

      setUsernameStatus('checking');
      debounceRef.current = setTimeout(async () => {
        try {
          await userNameAlreadyTaken(value.trim());
          setUsernameStatus('available');
        } catch (err) {
          if (err?.response?.status === 409) {
            setUsernameStatus('taken');
          } else {
            setUsernameStatus('error');
          }
        }
      }, 500);
    } else if (name === 'password'){
      if (/\s/.test(value)) {
        setErrors(prev => ({ ...prev, password: 'Password cannot contain spaces' }));
        setForm(prev => ({ ...prev, password: value.replace(/\s/g, '') }));
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    mutation.mutate(form);
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper className="max-w-md w-full mx-auto mt-12 p-8" shadow="md" radius="md" withBorder>
        <Title order={2} className="mb-6 text-center">Register</Title>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            required
            rightSection={usernameStatus === 'checking' ? <Loader size="xs" /> : usernameStatus === 'taken' ? <FaTimesCircle color='red' /> : usernameStatus === 'available' ? <FaCircleCheck color="green" /> : null}
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

              <Text size="sm" mb={5}>
                Password strength
              </Text>
              <Progress
                value={passwordStrength}
                color={getStrengthColor()}
                size="sm"
                mb={"10"}
              />
              <List spacing="xs" size="sm">
                <List.Item
                  icon={
                    <div
                      size="sm"
                      radius="xl"
                      className={`${passwordRequirements.hasMinLength ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {passwordRequirements.hasMinLength ? <FaCheck /> : <FaTimes />}
                    </div>
                  }
                >
                  At least 8 characters
                </List.Item>

                <List.Item
                  icon={
                    <div
                      size="sm"
                      radius="xl"
                      className={`${passwordRequirements.hasUpperCase ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {passwordRequirements.hasUpperCase ? <FaCheck /> : <FaTimes />}
                    </div>
                  }
                >
                  Contains uppercase letter
                </List.Item>

                <List.Item
                  icon={
                    <div
                      size="sm"
                      radius="xl"
                      className={`${passwordRequirements.hasLowerCase ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {passwordRequirements.hasLowerCase ? <FaCheck /> : <FaTimes />}
                    </div>
                  }
                >
                  Contains lowercase letter
                </List.Item>

                <List.Item
                  icon={
                    <div
                      size="sm"
                      radius="xl"
                      className={`${passwordRequirements.hasNumberOrSymbol ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {passwordRequirements.hasNumberOrSymbol ? <FaCheck /> : <FaTimes />}
                    </div>
                  }
                >
                  Contains number or symbol
                </List.Item>
              </List>
            </Box>
          )}

          <Button type="submit" fullWidth loading={mutation.isPending} mt="md">
            Register
          </Button>
        </form>
      </Paper>
    </div>
  );
}
