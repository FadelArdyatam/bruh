import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const NavigationDebugger = () => {
  const navigation = useNavigation<any>(); // Gunakan any untuk menghindari error tipe
  
  // Mendapatkan state navigasi menggunakan hook useNavigationState
  const routeNames = useNavigationState(state => state?.routeNames || []);
  const index = useNavigationState(state => state?.index);
  const routes = useNavigationState(state => state?.routes || []);
  const navigationState = useNavigationState(state => state);

  const getCurrentRoute = () => {
    return routes[index]?.name || 'Unknown';
  };

  const getRouteParams = () => {
    return routes[index]?.params ? JSON.stringify(routes[index].params, null, 2) : 'No params';
  };

  const getNavigationState = () => {
    return JSON.stringify(navigationState, null, 2);
  };

  const closeDebugger = () => {
    // Kita bisa gunakan ini untuk menyembunyikan debugger jika diimplementasikan dalam modal
    console.log('Close debugger');
  };
  
  // Fungsi untuk menguji ketersediaan rute
  const testRouteAvailability = () => {
    const testRoutes = ['IMTTab', 'TrainingProgramTab', 'FoodRecall', 'ProfileTab'];
    return testRoutes.map(route => {
      let isAvailable = false;
      
      try {
        // Cukup cek apakah rute ada dalam state navigasi
        isAvailable = routeNames.includes(route);
      } catch (error) {
        console.log(`Error saat memeriksa rute ${route}:`, error);
      }
      
      return {
        route,
        isAvailable
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Navigation Debugger</Text>
        <TouchableOpacity onPress={closeDebugger} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Route</Text>
          <Text style={styles.codeText}>{getCurrentRoute()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Params</Text>
          <Text style={styles.codeText}>{getRouteParams()}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Routes</Text>
          {routeNames?.map((name: string, index: number) => (
            <Text key={index} style={styles.routeItem}>
              - {name}
            </Text>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Availability Test</Text>
          {testRouteAvailability().map(({ route, isAvailable }, index) => (
            <Text key={index} style={styles.routeItem}>
              {route}: {isAvailable ? '✓' : '✗'}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation State</Text>
          <Text style={styles.codeText}>{getNavigationState()}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: '60%',
    elevation: 5,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  codeText: {
    color: '#2ecc71',
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 5,
  },
  routeItem: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 3,
  }
});

export default NavigationDebugger;