import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonCircle, SkeletonText, SkeletonBox } from '../SkeletonLoader';

const FoodRecallScreenSkeleton = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <SkeletonCircle width={40} height={40} />
          <SkeletonText width={160} height={24} style={{ marginLeft: 12 }} />
        </View>

        {/* Content Area */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Pilih Hari */}
          <SkeletonText width={100} height={18} style={{ marginBottom: 16 }} />
          <View style={styles.daySelector}>
            <SkeletonBox width="48%" height={48} borderRadius={8} />
            <SkeletonBox width="48%" height={48} borderRadius={8} />
          </View>

          {/* Search Bar */}
          <SkeletonText width={120} height={18} style={{ marginTop: 24, marginBottom: 16 }} />
          <SkeletonBox width="100%" height={48} borderRadius={12} style={{ marginBottom: 16 }} />

          {/* Daftar Makanan */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <SkeletonText width={140} height={18} />
              <SkeletonBox width={140} height={28} borderRadius={4} />
            </View>

            {/* Form tambah makanan */}
            <View style={styles.addFoodForm}>
              <SkeletonText width={160} height={18} style={{ marginBottom: 12 }} />
              <View style={styles.formFields}>
                {[...Array(4)].map((_, index) => (
                  <SkeletonBox 
                    key={index}
                    width="100%" 
                    height={48} 
                    borderRadius={8} 
                    style={{ marginBottom: 12 }} 
                  />
                ))}
                <SkeletonBox width="100%" height={48} borderRadius={8} />
              </View>
            </View>

            {/* Daftar makanan yang bisa dipilih */}
            <SkeletonBox width="100%" height={200} borderRadius={8} style={{ marginTop: 16 }} />
          </View>

          {/* Makanan Terpilih */}
          <View style={styles.sectionContainer}>
            <SkeletonText width={160} height={18} style={{ marginBottom: 16 }} />
            
            {/* Selected food items */}
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.selectedFoodItem}>
                <View style={styles.selectedFoodInfo}>
                  <SkeletonText width={180} height={18} style={{ marginBottom: 4 }} />
                  <SkeletonText width={220} height={16} />
                </View>
                <View style={styles.quantityControls}>
                  <SkeletonCircle width={24} height={24} />
                  <SkeletonText width={20} height={16} style={{ marginHorizontal: 8 }} />
                  <SkeletonCircle width={24} height={24} />
                  <SkeletonCircle width={24} height={24} style={{ marginLeft: 8 }} />
                </View>
              </View>
            ))}
            
            <View style={styles.totalCalories}>
              <SkeletonText width={120} height={16} />
              <SkeletonText width={80} height={24} style={{ marginTop: 4 }} />
            </View>
          </View>
          
          {/* Spacer untuk footer */}
          <View style={styles.footerSpacer} />
        </ScrollView>

        {/* Footer dengan tombol simpan */}
        <View style={styles.footerContainer}>
          <SkeletonBox height={56} width="100%" borderRadius={8} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Untuk memberikan ruang bagi footer
  },
  header: {
    backgroundColor: '#FFB800',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addFoodForm: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  formFields: {
    gap: 12,
  },
  selectedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedFoodInfo: {
    flex: 1,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCalories: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  footerSpacer: {
    height: 80, // Sama dengan tinggi footer
  },
  footerContainer: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default FoodRecallScreenSkeleton;