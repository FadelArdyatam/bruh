import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonCircle, SkeletonText, SkeletonBox } from '../SkeletonLoader';

const screenWidth = Dimensions.get('window').width;

const TrainingProgramScreenSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan gradient */}
      <View style={styles.headerContainer}>
        <LinearGradient 
          colors={["#FFB800", "#FF8A00"]} 
          style={styles.headerGradient}
        >
          <SkeletonText width={180} height={22} style={{ marginBottom: 16 }} />
          
          {/* Search Bar */}
          <SkeletonBox height={48} width="100%" borderRadius={12} style={{ marginBottom: 16 }} />
          
          {/* Tab Selector */}
          <SkeletonBox height={48} width="100%" borderRadius={12} />
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Workout Cards Section */}
        <View style={styles.section}>
          <SkeletonText width={120} height={20} style={{ marginBottom: 12 }} />
          
          {/* Horizontal scrolling workout cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {[...Array(4)].map((_, index) => (
                <SkeletonBox 
                  key={index}
                  width={150} 
                  height={160} 
                  borderRadius={16} 
                  style={styles.workoutCard} 
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Selected Workout Details */}
        <View style={styles.workoutDetailCard}>
          <View style={styles.workoutHeader}>
            <SkeletonText width={180} height={22} style={{ marginBottom: 12 }} />
            
            <View style={styles.workoutDetailStats}>
              <SkeletonBox width={80} height={24} borderRadius={12} />
              <SkeletonBox width={100} height={24} borderRadius={12} style={{ marginLeft: 12 }} />
            </View>
          </View>
          
          <SkeletonText 
            width="100%" 
            height={80} 
            style={{ marginBottom: 16 }} 
          />
          
          {/* YouTube Video Player */}
          <View style={styles.videoContainer}>
            <SkeletonText width={140} height={18} style={{ marginBottom: 12 }} />
            <SkeletonBox 
              width="100%" 
              height={200} 
              borderRadius={12} 
            />
          </View>
          
          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.inputGroup}>
                <SkeletonText width={180} height={16} style={{ marginBottom: 8 }} />
                <SkeletonBox height={52} width="100%" borderRadius={12} />
              </View>
            ))}
          </View>
          
          {/* Calories Estimation */}
          <SkeletonBox 
            height={80} 
            width="100%" 
            borderRadius={16} 
            style={{ marginBottom: 20 }} 
          />
          
          {/* Save Button */}
          <SkeletonBox 
            height={56} 
            width="100%" 
            borderRadius={24} 
          />
        </View>
        
        {/* Recent Activities Section */}
        <View style={styles.recentActivitiesCard}>
          <View style={styles.sectionTitleContainer}>
            <SkeletonText width={160} height={20} />
            <SkeletonText width={80} height={16} />
          </View>
          
          {/* Activity items */}
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.activityItem}>
              <SkeletonCircle width={48} height={48} />
              
              <View style={styles.activityDetails}>
                <SkeletonText width={150} height={18} style={{ marginBottom: 4 }} />
                <SkeletonText width={120} height={14} />
              </View>
              
              <View style={styles.activityStats}>
                <SkeletonText width={60} height={18} style={{ marginBottom: 4 }} />
                <SkeletonText width={40} height={14} />
              </View>
            </View>
          ))}
        </View>
        
        {/* Quick Links Section */}
        <View style={styles.quickLinksCard}>
          <SkeletonText width={120} height={20} style={{ marginBottom: 16 }} />
          
          {/* Quick links */}
          {[...Array(2)].map((_, index) => (
            <View key={index} style={styles.quickLinkItem}>
              <SkeletonCircle width={48} height={48} />
              
              <View style={styles.quickLinkContent}>
                <SkeletonText width={160} height={18} style={{ marginBottom: 4 }} />
                <SkeletonText width={200} height={14} />
              </View>
              
              <SkeletonCircle width={20} height={20} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  scrollContent: {
    marginTop: -60,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingLeft: 4,
    paddingRight: 4,
  },
  workoutCard: {
    marginRight: 12,
  },
  workoutDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  workoutHeader: {
    marginBottom: 16,
  },
  workoutDetailStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  videoContainer: {
    marginBottom: 20,
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  recentActivitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityDetails: {
    flex: 1,
    marginLeft: 12,
  },
  activityStats: {
    alignItems: 'flex-end',
  },
  quickLinksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  quickLinkContent: {
    flex: 1,
    marginLeft: 12,
  }
});

export default TrainingProgramScreenSkeleton;