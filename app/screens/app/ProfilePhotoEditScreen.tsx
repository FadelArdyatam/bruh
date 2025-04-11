"use client";

import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Camera, Upload, Trash2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile, updateProfilePhoto } from "../../redux/slices/profileSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

const ProfilePhotoEditScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme, darkMode } = useTheme();
  
  const { personalData, isLoading: profileLoading, isUploadingPhoto } = useSelector((state: RootState) => state.profile);
  
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(getUserProfile());
  }, []);
  
  useEffect(() => {
    if (personalData) {
      setPhotoUri(getProfilePhotoUrl());
    }
  }, [personalData]);
  
  // Helper function untuk mendapatkan data personel
  const getPersonelData = () => {
    if (!personalData) return null;
    
    // Cek struktur data personel
    if (personalData.personel) {
      return personalData.personel;
    }
    
    return personalData;
  };
  
  // Mendapatkan URL foto profil
  const getProfilePhotoUrl = () => {
    const personelData = getPersonelData();
    
    if (!personelData) return null;
    
    // Jika ada profile_photo_url langsung, gunakan itu
    if (personelData.profile_photo_url) {
      return personelData.profile_photo_url;
    }
    
    // Jika hanya ada profile_photo (path), dan API_URL tersedia
    if (personelData.profile_photo) {
      return `https://demo.sosiogrow.my.id/storage/${personelData.profile_photo}`;
    }
    
    return null;
  };
  
  // Ambil foto dari kamera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert("Izin Dibutuhkan", "Aplikasi membutuhkan izin untuk mengakses kamera.");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        await handleUploadPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Gagal mengambil foto. Silakan coba lagi.");
    }
  };
  
  // Pilih foto dari galeri
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert("Izin Dibutuhkan", "Aplikasi membutuhkan izin untuk mengakses galeri foto.");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        await handleUploadPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Gagal memilih foto. Silakan coba lagi.");
    }
  };
  
  // Hapus foto profil
  const handleRemovePhoto = async () => {
    Alert.alert(
      "Hapus Foto Profil",
      "Anda yakin ingin menghapus foto profil?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(updateProfilePhoto({ photo: null, removePhoto: true })).unwrap();
              await dispatch(getUserProfile()).unwrap();
              
              Alert.alert("Sukses", "Foto profil berhasil dihapus.");
            } catch (error) {
              console.error("Error removing photo:", error);
              Alert.alert("Error", "Gagal menghapus foto. Silakan coba lagi.");
            }
          }
        }
      ]
    );
  };
  
  // Handle upload foto
  const handleUploadPhoto = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      const imageInfo = {
        uri: asset.uri,
        type: 'image/jpeg',
        fileName: `profile-${new Date().getTime()}.jpg`
      };
      
      await dispatch(updateProfilePhoto({ photo: imageInfo })).unwrap();
      await dispatch(getUserProfile()).unwrap();
      
      Alert.alert("Sukses", "Foto profil berhasil diperbarui.");
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "Gagal mengupload foto. Silakan coba lagi.");
    }
  };
  
  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: darkMode ? theme?.background.dark : theme?.background.light || "#F5F5F5" 
    }}>
      <LinearGradient 
        colors={[theme?.primary || "#FFB800", theme?.secondary || "#FF8A00"]} 
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Foto Profil</Text>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.photoContainer}>
          {isUploadingPhoto ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme?.primary || "#FFB800"} />
              <Text style={styles.loadingText}>Memproses Foto...</Text>
            </View>
          ) : (
            <>
              <View style={styles.photoWrapper}>
                {photoUri ? (
                  <Image 
                    source={{ uri: photoUri }}
                    style={styles.profilePhoto}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.emptyPhoto}>
                    <Camera size={64} color="#CCCCCC" />
                    <Text style={styles.emptyPhotoText}>Belum ada foto profil</Text>
                  </View>
                )}
              </View>
              
              <Text style={[
                styles.profileName,
                { color: darkMode ? theme?.text.onDark : theme?.text.primary || "#1F1F1F" }
              ]}>
                {getPersonelData()?.nama_lengkap || "Pengguna Sipolgar"}
              </Text>
            </>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : "#EFF6FF" }
            ]}
            onPress={takePhoto}
            disabled={isUploadingPhoto}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#3B82F6" }]}>
              <Camera size={24} color="#FFFFFF" />
            </View>
            <Text style={[
              styles.actionText,
              { color: darkMode ? theme?.text.onDark : theme?.text.primary || "#1F1F1F" }
            ]}>
              Ambil Foto
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : "#F3F4F6" }
            ]}
            onPress={pickImage}
            disabled={isUploadingPhoto}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#6B7280" }]}>
              <Upload size={24} color="#FFFFFF" />
            </View>
            <Text style={[
              styles.actionText,
              { color: darkMode ? theme?.text.onDark : theme?.text.primary || "#1F1F1F" }
            ]}>
              Pilih dari Galeri
            </Text>
          </TouchableOpacity>
          
          {photoUri && (
            <TouchableOpacity 
              style={[
                styles.actionButton,
                { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : "#FEF2F2" }
              ]}
              onPress={handleRemovePhoto}
              disabled={isUploadingPhoto}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#EF4444" }]}>
                <Trash2 size={24} color="#FFFFFF" />
              </View>
              <Text style={[
                styles.actionText,
                { color: "#EF4444" }
              ]}>
                Hapus Foto Profil
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[
            styles.infoTitle,
            { color: darkMode ? theme?.text.onDark : theme?.text.primary || "#1F1F1F" }
          ]}>
            Info
          </Text>
          <Text style={[
            styles.infoText,
            { color: darkMode ? 'rgba(255,255,255,0.7)' : "#6B7280" }
          ]}>
            • Foto profil membantu personel lain mengenali Anda
          </Text>
          <Text style={[
            styles.infoText,
            { color: darkMode ? 'rgba(255,255,255,0.7)' : "#6B7280" }
          ]}>
            • Gunakan foto wajah yang jelas dan tampak dari depan
          </Text>
          <Text style={[
            styles.infoText,
            { color: darkMode ? 'rgba(255,255,255,0.7)' : "#6B7280" }
          ]}>
            • Hindari menggunakan foto yang tidak sesuai dengan identitas Anda
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  photoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  photoWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
  },
  emptyPhoto: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPhotoText: {
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  actionsContainer: {
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoContainer: {
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default ProfilePhotoEditScreen;