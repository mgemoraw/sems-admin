import { useCallback } from "react";
import type {UserRole} from "../types/dashboard";
import { ROLE_PERMISSIONS } from "../types/dashboard";

export const useAuthorization = (userRole?: UserRole) => {
  const hasPermission = useCallback((permission: string): boolean => {
    if (!userRole) return false;
    if (userRole === "admin") return true;
    
    return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
  }, [userRole]);

  return { hasPermission };
};