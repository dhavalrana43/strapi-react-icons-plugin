import { useRBAC } from '@strapi/strapi/admin';

const perms = {
  read: [{ action: 'plugin::strapi-react-icons-plugin.read', subject: null }],
};

interface IUserPermissions {
  loading: boolean;
  canRead: boolean;
}

function usePermissions() {
  const { allowedActions, isLoading: loading } = useRBAC(perms);
  return {
    canRead: allowedActions.canRead,
    loading,
  } as IUserPermissions;
}

export default usePermissions;
