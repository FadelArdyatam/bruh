import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';
import { User, Camera, Trash2, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '.././redux/store';
import { updateProfilePhoto } from '.././redux/slices/profileSlice';

interface ProfilePhotoPickerProps {
  photoUrl?: string | null;
  size?: number;
  onPhotoUpdated?: () => void;
}

const ProfilePhotoPicker: React.FC<ProfilePhotoPickerProps> = ({ 
  photoUrl, 
  size = 100,
  onPhotoUpdated 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isUploadingPhoto, photoUploadError } = useSelector((state: RootState) => state.profile);
  
  const [showOptions, setShowOptions] = useState(false);
  
  // Meminta izin untuk akses galeri dan kamera
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Izin Dibutuhkan',
        'Aplikasi membutuhkan izin untuk mengakses kamera dan galeri foto Anda.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  };
  
  // Ambil foto dari kamera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleImageSelected(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Gagal mengambil foto. Silakan coba lagi.');
    }
    
    setShowOptions(false);
  };
  
  // Pilih foto dari galeri
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleImageSelected(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih foto. Silakan coba lagi.');
    }
    
    setShowOptions(false);
  };
  
  // Handle foto yang terpilih
  const handleImageSelected = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      const imageInfo = {
        uri: asset.uri,
        type: 'image/jpeg',
        fileName: `profile-${new Date().getTime()}.jpg`
      };
      
      await dispatch(updateProfilePhoto({ photo: imageInfo })).unwrap();
      
      if (onPhotoUpdated) {
        onPhotoUpdated();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Gagal mengupload foto. Silakan coba lagi.');
    }
  };
  
  // Hapus foto profil
  const handleRemovePhoto = async () => {
    Alert.alert(
      'Hapus Foto Profil',
      'Anda yakin ingin menghapus foto profil?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(updateProfilePhoto({ photo: null, removePhoto: true })).unwrap();
              
              if (onPhotoUpdated) {
                onPhotoUpdated();
              }
            } catch (error) {
              console.error('Error removing photo:', error);
              Alert.alert('Error', 'Gagal menghapus foto. Silakan coba lagi.');
            }
            
            setShowOptions(false);
          }
        }
      ]
    );
  };
  
  return (
    <View style={{ alignItems: 'center' }}>
      {/* Foto Profil */}
      <TouchableOpacity 
        style={[
          styles.photoContainer, 
          { 
            width: size, 
            height: size,
            borderRadius: size / 2
          }
        ]} 
        onPress={() => setShowOptions(true)}
      >
        {isUploadingPhoto ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFB800" />
          </View>
        ) : photoUrl ? (
          <Image 
            source={{ uri: photoUrl }} 
            style={styles.photo} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <User size={size / 2} color="#FFFFFF" />
          </View>
        )}
        
        <View style={styles.editBadge}>
          <Camera size={18} color="#FFB800" />
        </View>
      </TouchableOpacity>
      
      {/* Modal Opsi Foto */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Foto Profil</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowOptions(false)}
              >
                <X size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
              <Camera size={24} color="#FFB800" />
              <Text style={styles.optionText}>Ambil Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
              <User size={24} color="#3B82F6" />
              <Text style={styles.optionText}>Pilih dari Galeri</Text>
            </TouchableOpacity>
            
            {photoUrl && (
              <TouchableOpacity 
                style={[styles.optionButton, styles.removeButton]}
                onPress={handleRemovePhoto}
              >
                <Trash2 size={24} color="#EF4444" />
                <Text style={styles.removeText}>Hapus Foto Profil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 184, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 16,
  },
  removeButton: {
    borderBottomWidth: 0,
  },
  removeText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 16,
  }
});

export default ProfilePhotoPicker;