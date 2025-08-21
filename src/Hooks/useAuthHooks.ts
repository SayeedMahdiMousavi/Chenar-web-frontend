import { useQuery, useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';
import { authService } from '../services/api';
import { useGenericQuery, useGenericMutation } from './useApiHooks';

// Modern authentication hooks
export const useGetUserInfo = () => {
  const id = localStorage.getItem('user_id');
  
  return useQuery({
    queryKey: ['user', 'profile', id],
    queryFn: () => authService.getUserProfile(id!),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useGetUserList = () => {
  return useGenericQuery(
    ['users', 'list'],
    () => authService.get('/users/?page=1&page_size=10&fields=id,photo,username'),
    {
      staleTime: 15 * 60 * 1000,
    }
  );
};

export const useGetPermissions = () => {
  return useGenericQuery(
    ['auth', 'permissions'],
    () => authService.getPermissions(),
    {
      staleTime: 60 * 60 * 1000, // 1 hour
    }
  );
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (credentials: { username: string; password: string }) => 
      authService.login(credentials),
    {
      onSuccess: (data: any) => {
        // Store tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_id', data.username);
        
        // Update axios headers
        const axiosInstance = require('../pages/ApiBaseUrl').default;
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${data.access}`;
        
        // Clear and refetch user data
        queryClient.clear();
        queryClient.prefetchQuery({
          queryKey: ['user', 'profile', data.username],
          queryFn: () => authService.getUserProfile(data.username),
        });
        
        message.success('Login successful');
      },
      onError: () => {
        message.error('Invalid username or password');
      },
    }
  );
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    () => {
      const refreshToken = localStorage.getItem('refresh_token');
      return refreshToken ? authService.logout(refreshToken) : Promise.resolve();
    },
    {
      onSuccess: () => {
        // Clear all stored data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        
        // Clear React Query cache
        queryClient.clear();
        
        // Redirect to login
        window.location.href = '/';
        
        message.success('Logged out successfully');
      },
      onError: () => {
        // Even if logout fails on server, clear local data
        localStorage.clear();
        queryClient.clear();
        window.location.href = '/';
      },
    }
  );
};

export const useRefreshToken = () => {
  return useGenericMutation(
    () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');
      return authService.refreshToken(refreshToken);
    },
    {
      onSuccess: (data: any) => {
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        
        // Update axios headers
        const axiosInstance = require('../pages/ApiBaseUrl').default;
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${data.access}`;
      },
      onError: () => {
        // Token refresh failed, redirect to login
        localStorage.clear();
        window.location.href = '/';
      },
    }
  );
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    ({ username, data }: { username: string; data: any }) => 
      authService.updateUserProfile(username, data),
    {
      onSuccess: (updatedUser, variables) => {
        queryClient.setQueryData(['user', 'profile', variables.username], updatedUser);
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['users'] }] });
        message.success('Profile updated successfully');
      },
      onError: () => {
        message.error('Failed to update profile');
      },
    }
  );
};

export const useCheckPassword = () => {
  return useGenericMutation(
    (password: string) => authService.checkPassword(password),
    {
      onSuccess: () => {
        message.success('Password verified');
      },
      onError: () => {
        message.error('Invalid password');
      },
    }
  );
};

export const useResetPassword = () => {
  return useGenericMutation(
    (email: string) => authService.resetPassword(email),
    {
      onSuccess: () => {
        message.success('Password reset email sent');
      },
      onError: () => {
        message.error('Failed to send password reset email');
      },
    }
  );
};

export const useConfirmResetPassword = () => {
  return useGenericMutation(
    ({ token, password }: { token: string; password: string }) => 
      authService.confirmResetPassword(token, password),
    {
      onSuccess: () => {
        message.success('Password reset successfully');
      },
      onError: () => {
        message.error('Failed to reset password');
      },
    }
  );
};

export const useGetUserPermissions = (username: string) => {
  return useGenericQuery(
    ['user', username, 'permissions'],
    () => authService.getUserPermissions(username),
    {
      enabled: !!username,
      staleTime: 30 * 60 * 1000,
    }
  );
};

export const useGetRoles = () => {
  return useGenericQuery(
    ['auth', 'roles'],
    () => authService.getRoles(),
    {
      staleTime: 60 * 60 * 1000,
    }
  );
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => authService.createRole(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['auth', 'roles'] }] });
        message.success('Role created successfully');
      },
      onError: () => {
        message.error('Failed to create role');
      },
    }
  );
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => authService.inviteUser(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['users'] }] });
        message.success('User invitation sent successfully');
      },
      onError: () => {
        message.error('Failed to send user invitation');
      },
    }
  );
};

export const useAcceptInvitation = () => {
  return useGenericMutation(
    (data: any) => authService.acceptInvitation(data),
    {
      onSuccess: () => {
        message.success('Invitation accepted successfully');
      },
      onError: () => {
        message.error('Failed to accept invitation');
      },
    }
  );
};




