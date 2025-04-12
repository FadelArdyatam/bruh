import React, { useEffect, useState } from 'react';
import { authEvents, AuthEvent } from '../utils/authErrorHandler';
import SessionExpiredDialog from '../components/SessionExpiredDialog';

/**
 * Provider yang menangani event-event terkait autentikasi
 * dan menampilkan dialog yang sesuai
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState(false);

  useEffect(() => {
    // Mendengarkan event sesi berakhir
    const handleSessionExpired = () => {
      console.log('Session expired event received');
      setShowSessionExpiredDialog(true);
    };

    // Register event listener
    authEvents.on(AuthEvent.SESSION_EXPIRED, handleSessionExpired);

    // Cleanup event listener pada unmount
    return () => {
      authEvents.off(AuthEvent.SESSION_EXPIRED, handleSessionExpired);
    };
  }, []);

  const handleDismissSessionExpired = () => {
    setShowSessionExpiredDialog(false);
  };

  return (
    <>
      {children}
      
      {/* Dialog untuk session expired */}
      <SessionExpiredDialog 
        isVisible={showSessionExpiredDialog}
        onDismiss={handleDismissSessionExpired}
      />
    </>
  );
};

export default AuthProvider;