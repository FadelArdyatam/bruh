"use client"

import React, { useEffect, useState } from "react"
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert,
  RefreshControl,
  StyleSheet,
  Animated
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getUserProfile } from "../../redux/slices/profileSlice"
import { logoutUser } from "../../redux/slices/authSlice"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import {
  User,
  Edit,
  Lock,
  LogOut,
  ChevronRight,
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Award,
  Ruler,
  Heart,
  Settings
} from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../../context/ThemeContext"

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { personalData, isLoading: profileLoading, error } = useSelector((state: RootState) => state.profile)
  const { theme, darkMode } = useTheme()

  const [refreshing, setRefreshing] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const fadeAnim = useState(new Animated.Value(0))[0]

  useEffect(() => {
    fetchUserProfile()
    
    // Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  const fetchUserProfile = async () => {
    try {
      await dispatch(getUserProfile()).unwrap()
    } catch (err) {
      console.error("Error mengambil data profil:", err)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchUserProfile()
    setRefreshing(false)
  }

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Anda yakin ingin keluar dari aplikasi?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => dispatch(logoutUser()),
          style: "destructive"
        }
      ]
    )
  }

  // Helper function untuk mendapatkan data personel
  const getPersonelData = () => {
    if (!personalData) return null
    
    // Cek struktur data personel
    if (personalData.personel) {
      return personalData.personel
    }
    
    return personalData
  }

  // Format tanggal lahir ke format yang lebih sederhana (YYYY-MM-DD)
  const formatBirthDate = (birthDate: string) => {
    if (!birthDate) return "-"
    
    try {
      // Parse tanggal dari string ISO atau timestamp
      const date = new Date(birthDate)
      
      // Pastikan tanggal valid
      if (isNaN(date.getTime())) return birthDate
      
      // Format ke YYYY-MM-DD
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error("Error memformat tanggal:", error)
      return birthDate
    }
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null

    try {
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }

      return age
    } catch (error) {
      console.error("Error menghitung umur:", error)
      return null
    }
  }

  const personelData = getPersonelData()
  const satuanKerja = personelData?.satuan_kerja || {}
  const pangkat = personelData?.pangkat || {}

  // Format nomor HP dengan memastikan data valid
  const formatPhoneNumber = (phone: string | undefined | null) => {
    if (!phone) return "-"
    
    // Jika nomor telepon sudah diawali dengan +62 atau 62, biarkan sebagaimana adanya
    if (phone.startsWith("+62") || phone.startsWith("62")) {
      return phone
    }
    
    // Jika diawali dengan 0, ganti dengan +62
    if (phone.startsWith("0")) {
      return "+62" + phone.substring(1)
    }
    
    return phone
  }

  if (profileLoading && !personelData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme?.primary || "#FFB800"} />
        <Text style={styles.loadingText}>Memuat Profil...</Text>
      </View>
    )
  }

  if (error && !personelData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Gagal memuat profil</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchUserProfile}
        >
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: darkMode ? theme?.background.dark : theme?.background.light || "#F5F5F5" }
    ]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme?.primary || "#FFB800"]}
            tintColor={theme?.primary || "#FFB800"}
          />
        }
      >
        <LinearGradient 
          colors={[theme?.primary || "#FFB800", theme?.secondary || "#FF8A00"]} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            {/* User Info Section */}
            <View style={styles.userInfoContainer}>
              <View style={styles.avatarContainer}>
                {personelData?.foto_profil ? (
                  <Image
                    source={{ uri: personelData.foto_profil }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={40} color="#FFF" />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.editAvatarButton}
                  onPress={() => Alert.alert("Info", "Fitur upload foto profil akan segera hadir!")}
                >
                  <Edit size={14} color="#FFB800" />
                </TouchableOpacity>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {personelData?.nama_lengkap || personalData?.name || user?.name || "Pengguna SI POLGAR"}
                </Text>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{pangkat?.nama_pangkat || "Belum ada pangkat"}</Text>
                </View>
              </View>
            </View>

            {/* Stats Quick View */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Award size={20} color="#FFF" />
                </View>
                <Text style={styles.statLabel}>Pangkat</Text>
                <Text style={styles.statValue}>{pangkat?.nama_pangkat || "-"}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ruler size={20} color="#FFF" />
                </View>
                <Text style={styles.statLabel}>Tinggi</Text>
                <Text style={styles.statValue}>
                  {personelData?.tinggi_badan ? `${personelData.tinggi_badan} cm` : "-"}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Heart size={20} color="#FFF" />
                </View>
                <Text style={styles.statLabel}>Umur</Text>
                <Text style={styles.statValue}>
                  {personelData?.tanggal_lahir ? `${calculateAge(personelData.tanggal_lahir)} thn` : "-"}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <Animated.View 
          style={[
            styles.content,
            { opacity: fadeAnim }
          ]}
        >
          {/* Informasi Pribadi Card */}
          <View style={[
            styles.card,
            { backgroundColor: darkMode ? theme?.background.dark : "#FFFFFF" }
          ]}>
            <View style={styles.cardHeader}>
              <Text style={[
                styles.cardTitle,
                { color: darkMode ? theme?.text.onDark : theme?.text.primary || "#1F1F1F" }
              ]}>
                Informasi Pribadi
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate("PersonalData")}
              >
                <Edit size={16} color={theme?.primary || "#FFB800"} />
                <Text style={[
                  styles.editButtonText,
                  { color: theme?.primary || "#FFB800" }
                ]}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
              <InfoItem 
                icon={<Shield size={20} color={theme?.primary || "#FFB800"} />}
                label="NRP/NIP"
                value={personalData?.username || user?.username || "-"}
                darkMode={darkMode}
                textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
              />

              <InfoItem 
                icon={<Calendar size={20} color={theme?.primary || "#FFB800"} />}
                label="Tanggal Lahir"
                value={personelData?.tanggal_lahir 
                  ? `${formatBirthDate(personelData.tanggal_lahir)} (${calculateAge(personelData.tanggal_lahir)} tahun)`
                  : "-"}
                darkMode={darkMode}
                textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
              />

              <InfoItem 
                icon={<MapPin size={20} color={theme?.primary || "#FFB800"} />}
                label="Tempat Lahir"
                value={personelData?.tempat_lahir || "-"}
                darkMode={darkMode}
                textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
              />

              <InfoItem 
                icon={<Phone size={20} color={theme?.primary || "#FFB800"} />}
                label="Nomor Handphone"
                value={formatPhoneNumber(personelData?.no_hp)}
                darkMode={darkMode}
                textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
              />

              <InfoItem 
                icon={<Mail size={20} color={theme?.primary || "#FFB800"} />}
                label="Email"
                value={personalData?.email || user?.email || "-"}
                darkMode={darkMode}
                textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
              />

              {showMoreInfo && (
                <>
                  <InfoItem 
                    icon={<Briefcase size={20} color={theme?.primary || "#FFB800"} />}
                    label="Satuan Kerja"
                    value={satuanKerja?.nama_satuan_kerja || "-"}
                    darkMode={darkMode}
                    textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
                  />

                  <InfoItem 
                    icon={<Award size={20} color={theme?.primary || "#FFB800"} />}
                    label="Jenis Pekerjaan"
                    value={personelData?.jenis_pekerjaan || "-"}
                    darkMode={darkMode}
                    textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
                  />
                  
                  <InfoItem 
                    icon={<Ruler size={20} color={theme?.primary || "#FFB800"} />}
                    label="Tinggi Badan"
                    value={personelData?.tinggi_badan ? `${personelData.tinggi_badan} cm` : "-"}
                    darkMode={darkMode}
                    textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
                  />
                </>
              )}
              
              <TouchableOpacity 
                style={styles.showMoreButton}
                onPress={() => setShowMoreInfo(!showMoreInfo)}
              >
                <Text style={{ color: theme?.primary || "#FFB800" }}>
                  {showMoreInfo ? "Sembunyikan Detail" : "Lihat Lebih Banyak"}
                </Text>
                <ChevronRight size={16} color={theme?.primary || "#FFB800"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Card */}
          <View style={[
            styles.card,
            { backgroundColor: darkMode ? theme?.background.dark : "#FFFFFF" }
          ]}>
            <Text style={[
              styles.cardTitle,
              { color: darkMode ? theme?.text.onDark : theme?.text.primary || "#1F1F1F" }
            ]}>
              Menu Pengaturan
            </Text>

            <View style={styles.menuContainer}>
              <MenuButton
                icon={<User size={20} color="#3B82F6" />}
                label="Edit Profil"
                backgroundColor="#EFF6FF"
                onPress={() => navigation.navigate("PersonalData")}
                darkMode={darkMode}
                textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
              />
              
              <MenuButton
                icon={<Lock size={20} color="#8B5CF6" />}
                label="Ubah Password"
                backgroundColor="#F5F3FF"
                onPress={() => navigation.navigate("ChangePassword")}
                darkMode={darkMode}
                textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
              />
              
              <MenuButton
                icon={<Settings size={20} color="#10B981" />}
                label="Pengaturan Aplikasi"
                backgroundColor="#ECFDF5"
                onPress={() => navigation.navigate("SettingsTab")}
                darkMode={darkMode}
                textColor={darkMode ? theme?.text.onDark : theme?.text.primary}
              />

              <MenuButton
                icon={<LogOut size={20} color="#EF4444" />}
                label="Logout"
                backgroundColor="#FEF2F2"
                onPress={handleLogout}
                textColor="#EF4444"
                isLast={true}
                darkMode={darkMode}
              />
            </View>
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>SI POLGAR v1.0.0</Text>
            <Text style={styles.versionText}>© 2025 Kepolisian Republik Indonesia</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Component for Info Items
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  darkMode,
  textColor
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string,
  darkMode?: boolean,
  textColor?: string
}) => {
  return (
    <View style={styles.infoItem}>
      <View style={[
        styles.infoIconContainer,
        { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,184,0,0.1)' }
      ]}>
        {icon}
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: textColor || '#1F1F1F' }]}>
          {value}
        </Text>
      </View>
    </View>
  )
}

// Component for Menu Buttons
const MenuButton = ({ 
  icon, 
  label, 
  backgroundColor, 
  onPress, 
  textColor,
  isLast,
  darkMode
}: { 
  icon: React.ReactNode, 
  label: string, 
  backgroundColor: string, 
  onPress: () => void,
  textColor?: string,
  isLast?: boolean,
  darkMode?: boolean
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.menuButton,
        isLast ? {} : styles.menuButtonBorder,
        { borderBottomColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
      ]}
      onPress={onPress}
    >
      <View style={[
        styles.menuIconContainer,
        { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : backgroundColor }
      ]}>
        {icon}
      </View>
      <Text style={[
        styles.menuLabel,
        { color: textColor || (darkMode ? '#FFFFFF' : '#1F1F1F') }
      ]}>
        {label}
      </Text>
      <ChevronRight size={20} color={darkMode ? 'rgba(255,255,255,0.5)' : "rgba(0,0,0,0.3)"} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FFB800',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    padding: 20,
    paddingTop: 0,
    marginTop: -20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  menuContainer: {
    marginTop: 8,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuButtonBorder: {
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});

export default ProfileScreen