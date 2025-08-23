
import { AiFillHome } from "react-icons/ai";
import { FaPowerOff } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa";

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Group, Button, Loader, Avatar } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../api/user';
import { useAuthContext } from '../context/AuthContext';

export default function Navbar({ user, isLoading }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser, isLoading: isAuthLoading, isAuthenticated } = useAuthContext();
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      navigate('/login');
    },
  });
  console.log(authUser);
  const navLinks = [
    { to: '/login', label: 'Login', show: !user, icon : <AiFillHome className="mr-2"/> },
    { to: '/register', label: 'Register', show: !user, icon : <AiFillHome className="mr-2"/> },
  ];

  return (
    <nav className="w-full bg-[#181818] px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold text-white tracking-wide">ERINO Leads</Link>
      <Group>
        {isLoading ? <Loader size="xs" color="cyan" /> : null}
        {navLinks.filter(l => l.show).map(link => (
          <Button
            key={link.to}
            component={Link}
            to={link.to}
            variant={location.pathname === link.to ? 'filled' : 'subtle'}
            color="cyan"
            
          >
            {link.icon}
            {link.label}
          </Button>
        ))}
        {
          !isAuthLoading && isAuthenticated && authUser && (
            <div className="text-white flex flex-row items-center">
              <Avatar src="" alt={authUser.username} radius="xl" className="bg-cyan-400/50" color="cyan">{authUser.username.charAt(0).toUpperCase()}</Avatar>
              <div className="ml-2">
                <p className="text-sm font-semibold">@ {authUser.username}</p>
                <p className="text-xs text-gray-300">{authUser.email}</p>
              </div>
            </div>
          )
        }
        {user && (
          <Button color="red" variant="outline" onClick={() => { logoutMutation.mutate(); }} loading={logoutMutation.isPending}>
            <FaPowerOff className="mr-2" />
            Logout
          </Button>
        )}
      </Group>
    </nav>
  );
}
