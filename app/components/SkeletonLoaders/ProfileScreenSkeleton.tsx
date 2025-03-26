import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonCircle, SkeletonText, SkeletonBox } from '../SkeletonLoader';

const ProfileScreenSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan gradient */}
      <LinearGradient colors={["#FFB800", "#FF8A00"]} style={styles.header}>
        <View style={styles.headerContent}>
          {/* User Info Section (Avatar & Name) */}
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <SkeletonCircle width={80} height={80} />
              <View style={styles.editAvatarButton}>
                <SkeletonCircle width={28} height={28} />
              </View>
            </View>

            <View style={styles.userInfo}>
              <SkeletonText width={180} height={24} style={{ marginBottom: 8 }} />
              <View style={styles.badgeContainer}>
                <SkeletonText width={100} height={20} />
              </View>
            </View>
          </View>

          {/* Stats Quick View */}
          <View style={styles.statsContainer}>
            {/* Pangkat */}
            <View style={styles.statItem}>
              <SkeletonCircle width={40} height={40} style={{ marginBottom: 8 }} />
              <SkeletonText width={40} style={{ marginBottom: 4 }} />
              <SkeletonText width={60} />
            </View>
            
            <View style={styles.divider} />
            
            {/* Tinggi */}
            <View style={styles.statItem}>
              <SkeletonCircle width={40} height={40} style={{ marginBottom: 8 }} />
              <SkeletonText width={40} style={{ marginBottom: 4 }} />
              <SkeletonText width={60} />
            </View>
            
            <View style={styles.divider} />
            
            {/* Umur */}
            <View style={styles.statItem}>
              <SkeletonCircle width={40} height={40} style={{ marginBottom: 8 }} />
              <SkeletonText width={40} style={{ marginBottom: 4 }} />
              <SkeletonText width={60} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Informasi Pribadi Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <SkeletonText width={150} height={20} />
            <View style={styles.editButton}>
              <SkeletonText width={60} height={20} />
            </View>
          </View>

          <View style={styles.infoSection}>
            {/* Info items (NRP, Tanggal Lahir, dll) */}
            {[...Array(5)].map((_, index) => (
              <View key={index} style={styles.infoItem}>
                <SkeletonCircle width={44} height={44} />
                <View style={styles.infoContent}>
                  <SkeletonText width={100} style={{ marginBottom: 4 }} />
                  <SkeletonText width={`${Math.random() * 30 + 60}%`} height={18} />
                </View>
              </View>
            ))}
            
            <View style={styles.showMoreButton}>
              <SkeletonText width={120} height={20} />
            </View>
          </View>
        </View>

        {/* Menu Card */}
        <View style={styles.card}>
          <SkeletonText width={180} height={20} style={{ marginBottom: 16 }} />

          <View style={styles.menuContainer}>
            {/* Menu buttons */}
            {[...Array(4)].map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.menuButton,
                  index < 3 && styles.menuButtonBorder
                ]}
              >
                <SkeletonCircle width={44} height={44} />
                <SkeletonText width={140} height={18} style={{ flex: 1, marginLeft: 16 }} />
                <SkeletonCircle width={20} height={20} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.versionContainer}>
          <SkeletonText width={100} style={{ marginBottom: 4 }} />
          <SkeletonText width={240} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
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
    backgroundColor: '#FFFFFF',
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
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
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
});

export default ProfileScreenSkeleton;