import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonCircle, SkeletonText, SkeletonBox } from '../SkeletonLoader';

const screenWidth = Dimensions.get('window').width;

const HomeScreenSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#FFB800", "#FF8A00"]} style={styles.header}>
        <View style={styles.headerContent}>
          {/* Header Row (Greeting & Avatar) */}
          <View style={styles.headerRow}>
            <View>
              <SkeletonText width={120} height={16} style={{ marginBottom: 8 }} />
              <SkeletonText width={180} height={24} />
            </View>
            <SkeletonCircle width={48} height={48} />
          </View>

          {/* IMT Status Card */}
          <View style={styles.imtStatusCard}>
            <SkeletonText width={120} height={16} style={{ marginBottom: 12 }} />
            <View style={styles.imtStatusRow}>
              <View>
                <SkeletonText width={60} height={32} style={{ marginBottom: 4 }} />
                <SkeletonText width={120} height={16} />
              </View>
              <SkeletonBox width={80} height={36} borderRadius={8} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.mainContent}>
        {/* Stats Card */}
        <View style={styles.card}>
          <SkeletonText width={100} height={18} style={{ marginBottom: 15 }} />
          
          <View style={styles.statsGrid}>
            {/* IMT Stat */}
            <View style={styles.statHalfColumn}>
              <View style={styles.statCard}>
                <SkeletonCircle width={40} height={40} style={{ marginBottom: 8 }} />
                <SkeletonText width={30} style={{ marginBottom: 4 }} />
                <SkeletonText width={40} height={20} />
              </View>
            </View>
            
            {/* Weight Stat */}
            <View style={styles.statHalfColumn}>
              <View style={styles.statCard}>
                <SkeletonCircle width={40} height={40} style={{ marginBottom: 8 }} />
                <SkeletonText width={40} style={{ marginBottom: 4 }} />
                <SkeletonText width={50} height={20} />
              </View>
            </View>
            
            {/* Training Stat */}
            <View style={styles.statHalfColumn}>
              <View style={styles.statCard}>
                <SkeletonCircle width={40} height={40} style={{ marginBottom: 8 }} />
                <SkeletonText width={60} style={{ marginBottom: 4 }} />
                <SkeletonText width={30} height={20} />
              </View>
            </View>
            
            {/* Height Stat */}
            <View style={styles.statHalfColumn}>
              <View style={styles.statCard}>
                <SkeletonCircle width={40} height={40} style={{ marginBottom: 8 }} />
                <SkeletonText width={40} style={{ marginBottom: 4 }} />
                <SkeletonText width={60} height={20} />
              </View>
            </View>
          </View>
        </View>
        
        {/* Chart Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <SkeletonText width={140} height={18} />
            <SkeletonText width={80} height={16} />
          </View>
          
          {/* Chart Placeholder */}
          <SkeletonBox 
            width={screenWidth - 40} 
            height={220} 
            borderRadius={16} 
            style={styles.chart}
          />
        </View>
        
        {/* Recent Activities */}
        <View style={styles.card}>
          <SkeletonText width={160} height={18} style={{ marginBottom: 15 }} />
          
          {/* Activity items */}
          {[...Array(3)].map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.activityItem,
                { 
                  borderBottomWidth: index < 2 ? 1 : 0,
                }
              ]}
            >
              <SkeletonCircle width={50} height={50} />
              
              <View style={styles.activityInfo}>
                <SkeletonText width={150} height={18} style={{ marginBottom: 4 }} />
                <SkeletonText width={100} height={14} />
              </View>
              
              <View style={styles.activityStats}>
                <SkeletonText width={60} height={18} style={{ marginBottom: 4 }} />
                <SkeletonText width={40} height={14} />
              </View>
            </View>
          ))}
        </View>
        
        {/* Quick Access Menu */}
        <View style={styles.card}>
          <SkeletonText width={120} height={18} style={{ marginBottom: 15 }} />
          
          {/* Menu items */}
          {[...Array(3)].map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.menuItem,
                { 
                  borderBottomWidth: index < 2 ? 1 : 0,
                }
              ]}
            >
              <SkeletonCircle width={50} height={50} />
              <View style={styles.menuTextContainer}>
                <SkeletonText width={160} height={18} style={{ marginBottom: 4 }} />
                <SkeletonText width={200} height={14} />
              </View>
              <SkeletonCircle width={20} height={20} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 70,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  imtStatusCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  imtStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContent: {
    marginTop: -50,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statHalfColumn: {
    width: '50%',
    paddingRight: 8,
    paddingLeft: 8,
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  chart: {
    marginVertical: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityStats: {
    alignItems: 'flex-end',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
});

export default HomeScreenSkeleton;