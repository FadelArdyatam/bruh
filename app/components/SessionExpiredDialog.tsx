// app/components/SessionExpiredDialog.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Props untuk SessionExpiredDialog
 */
interface SessionExpiredDialogProps {
  isVisible: boolean;
  onDismiss: () => void;
}

/**
 * Dialog yang ditampilkan ketika sesi pengguna berakhir
 * dan terjadi logout otomatis
 */
const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({ 
  isVisible, 
  onDismiss 
}) => {
  // State untuk animasi countdown
  const [countdown, setCountdown] = useState(5);
  
  // Effect untuk countdown sebelum dialog otomatis ditutup
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    if (isVisible && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      onDismiss();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, countdown, onDismiss]);
  
  // Reset countdown ketika dialog muncul
  useEffect(() => {
    if (isVisible) {
      setCountdown(5);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Sesi Berakhir</Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.message}>
              Sesi login Anda telah berakhir. Silakan login kembali untuk melanjutkan.
            </Text>
            
            <Text style={styles.submessage}>
              Dialog ini akan tertutup otomatis dalam {countdown} detik.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={onDismiss}
          >
            <Text style={styles.buttonText}>Mengerti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    backgroundColor: '#FFB800',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  submessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#FFB800',
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SessionExpiredDialog;