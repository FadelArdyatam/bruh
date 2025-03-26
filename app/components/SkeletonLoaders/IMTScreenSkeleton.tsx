import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonCircle, SkeletonText, SkeletonBox } from '../SkeletonLoader';

const screenWidth = Dimensions.get('window').width;

const IMTScreenSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#FFB800", "#FF8A00"]} style={styles.headerGradient}>
          <SkeletonText width={240} height={24} />
          
          {/* Status IMT Ringkasan */}
          <View style={styles.imtStatusCard}>
            <View style={styles.imtStatusRow}>
              <View>
                <SkeletonText width={120} height={16} style={{ marginBottom: 8 }} />
                <SkeletonText width={60} height={28} />
              </View>
              <SkeletonBox width={100} height={40} borderRadius={20} />
            </View>
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.content}>
        {/* Kartu IMT Gauge */}
        <View style={styles.card}>
          <SkeletonText width={140} height={20} style={{ marginBottom: 16 }} />
          
          {/* IMT Gauge Display */}
          <View style={styles.gaugeContainer}>
            {/* IMT Value circle */}
            <SkeletonCircle width={150} height={150} />
            
            {/* Kategori IMT */}
            <View style={styles.categoriesContainer}>
              <SkeletonBox height={60} width="100%" borderRadius={12} style={{ marginTop: 20 }} />
            </View>
            
            <SkeletonBox height={40} width={200} borderRadius={20} style={{ marginTop: 16 }} />
          </View>
        </View>
        
        {/* Grafik Berat Badan Card */}
        <View style={styles.card}>
          <SkeletonText width={180} height={20} style={{ marginBottom: 12 }} />
          
          {/* Chart placeholder */}
          <SkeletonBox 
            width={screenWidth - 60} 
            height={220} 
            borderRadius={16} 
            style={{ marginVertical: 12 }} 
          />
          
          <SkeletonBox height={40} width="100%" borderRadius={20} style={{ marginTop: 12 }} />
          
          {/* Detail IMT collapsible section */}
          <SkeletonBox height={120} width="100%" borderRadius={12} style={{ marginTop: 16 }} />
        </View>

        {/* Input Berat Badan Card */}
        <View style={styles.card}>
          <SkeletonText width={180} height={20} style={{ marginBottom: 16 }} />

          <View style={styles.inputFields}>
            {/* Berat Badan input */}
            <View style={styles.inputGroup}>
              <SkeletonText width={120} height={16} style={{ marginBottom: 8 }} />
              <SkeletonBox height={55} width="100%" borderRadius={30} />
            </View>

            {/* Tanggal input */}
            <View style={styles.inputGroup}>
              <SkeletonText width={80} height={16} style={{ marginBottom: 8 }} />
              <SkeletonBox height={55} width="100%" borderRadius={30} />
            </View>

            {/* Minggu Ke input */}
            <View style={styles.inputGroup}>
              <SkeletonText width={100} height={16} style={{ marginBottom: 8 }} />
              <SkeletonBox height={55} width="100%" borderRadius={30} />
            </View>
          </View>

          <SkeletonBox height={55} width="100%" borderRadius={30} style={{ marginTop: 24 }} />
        </View>
        
        {/* Menu Cepat Card */}
        <View style={styles.card}>
          <SkeletonText width={120} height={20} style={{ marginBottom: 16 }} />
          
          {/* Quick links */}
          <SkeletonBox height={80} width="100%" borderRadius={16} style={{ marginBottom: 16 }} />
          <SkeletonBox height={80} width="100%" borderRadius={16} />
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
  headerContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 70,
    paddingHorizontal: 20,
  },
  imtStatusCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  imtStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: -50,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gaugeContainer: {
    alignItems: 'center',
    padding: 20,
  },
  categoriesContainer: {
    width: '100%',
  },
  inputFields: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
});

export default IMTScreenSkeleton;