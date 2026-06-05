import { useState } from "react";
import { useSelector } from "react-redux";

export function useRequireAuth() {
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  function requireAuth(action?: () => void) {
    if (!userInfo) {
      setLoginModalOpen(true);
      return false;
    }
    action?.();
    return true;
  }

  return {
    requireAuth,
    isLoggedIn: !!userInfo,
    loginModalOpen,
    setLoginModalOpen,
  };
}
