import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonCircle, SkeletonText, SkeletonBox } from '../SkeletonLoader';

const screenWidth = Dimensions.get('window').width;

const IMTScreenSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <SkeletonText width={280} height={24} style={{ marginBottom: 20 }} />
        
        {/* IMT Status Card */}
        <View style={styles.imtStatusCard}>
          <SkeletonText width={120} height={16} style={{ marginBottom: 8 }} />
          <View style={styles.imtStatusRow}>
            <View>
              <SkeletonText width={60} height={32} style={{ marginBottom: 4 }} />
              <SkeletonText width={100} height={16} />
            </View>
            <SkeletonBox width={100} height={40} borderRadius={8} />
          </View>
        </View>
      </View>
      
      <View style={styles.mainContent}>
        {/* IMT Gauge Card */}
        <View style={styles.card}>
          <SkeletonText width={140} height={20} style={{ marginBottom: 16 }} />
          
          {/* Gauge Container */}
          <View style={styles.gaugeContainer}>
            {/* IMT Value circle */}
            <SkeletonCircle width={150} height={150} style={{ marginBottom: 20 }} />
            
            {/* IMT Categories */}
            <View style={styles.imtCategories}>
              <View style={styles.categoryItem}>
                <SkeletonBox width={4} height={20} borderRadius={2} style={{ marginBottom: 4 }} />
                <SkeletonText width={30} height={12} style={{ marginBottom: 2 }} />
                <SkeletonText width={40} height={12} />
              </View>
              <View style={styles.categoryItem}>
                <SkeletonBox width={4} height={20} borderRadius={2} style={{ marginBottom: 4 }} />
                <SkeletonText width={30} height={12} style={{ marginBottom: 2 }} />
                <SkeletonText width={40} height={12} />
              </View>
              <View style={styles.categoryItem}>
                <SkeletonBox width={4} height={20} borderRadius={2} style={{ marginBottom: 4 }} />
                <SkeletonText width={30} height={12} style={{ marginBottom: 2 }} />
                <SkeletonText width={40} height={12} />
              </View>
              <View style={styles.categoryItem}>
                <SkeletonBox width={4} height={20} borderRadius={2} style={{ marginBottom: 4 }} />
                <SkeletonText width={30} height={12} style={{ marginBottom: 2 }} />
                <SkeletonText width={40} height={12} />
              </View>
            </View>
            
            {/* Info Button */}
            <SkeletonBox width={120} height={36} borderRadius={8} style={{ marginTop: 16, alignSelf: 'center' }} />
          </View>
          
          {/* Info Container (Hidden initially) */}
          <SkeletonBox width="100%" height={120} borderRadius={12} style={{ marginTop: 12, display: 'none' }} />
        </View>
        
        {/* Weight Chart Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <SkeletonText width={180} height={20} />
            <SkeletonText width={60} height={16} />
          </View>
          
          {/* Chart placeholder */}
          <SkeletonBox 
            width={screenWidth - 60} 
            height={220} 
            borderRadius={16} 
            style={{ marginVertical: 12 }} 
          />
          
          <SkeletonText width="80%" height={12} style={{ alignSelf: 'center', marginTop: 8 }} />
        </View>

        {/* Input Weight Card */}
        <View style={styles.card}>
          <SkeletonText width={180} height={20} style={{ marginBottom: 16 }} />

          <View style={styles.inputContainer}>
            {/* Berat Badan input */}
            <View style={styles.inputGroup}>
              <SkeletonText width={120} height={14} style={{ marginBottom: 8 }} />
              <SkeletonBox height={52} width="100%" borderRadius={12} />
            </View>

            {/* Tanggal input */}
            <View style={styles.inputGroup}>
              <SkeletonText width={80} height={14} style={{ marginBottom: 8 }} />
              <SkeletonBox height={52} width="100%" borderRadius={12} />
            </View>

            {/* Minggu Ke input */}
            <View style={styles.inputGroup}>
              <SkeletonText width={100} height={14} style={{ marginBottom: 8 }} />
              <SkeletonBox height={52} width="100%" borderRadius={12} />
            </View>
          </View>

          {/* Save Button */}
          <SkeletonBox height={52} width="100%" borderRadius={12} style={{ marginTop: 16 }} />
        </View>
        
        {/* Quick Menu Card */}
        <View style={styles.card}>
          <SkeletonText width={120} height={20} style={{ marginBottom: 16 }} />
          
          {/* Menu Items */}
          <SkeletonBox height={72} width="100%" borderRadius={12} style={{ marginBottom: 12 }} />
          <SkeletonBox height={72} width="100%" borderRadius={12} />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  imtStatusCard: {
    backgroundColor: '#FFB800',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  imtStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContent: {
    paddingHorizontal: 20
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  gaugeContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16
  },
  imtCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1
  },
  inputContainer: {
    marginTop: 16
  },
  inputGroup: {
    marginBottom: 16
  }
});

export default IMTScreenSkeleton;