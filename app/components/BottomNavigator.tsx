import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Home, BarChart3, Activity, User, Dumbbell } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CustomBottomNavigationProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomBottomNavigation: React.FC<CustomBottomNavigationProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Mendapatkan teks label dan ikon untuk setiap tab
          const getTabConfig = () => {
            switch (route.name) {
              case 'HomeTab':
                return {
                  label: 'Home',
                  icon: (color: string) => <Home size={22} color={color} />
                };
              case 'IMTTab':
                return {
                  label: 'IMT',
                  icon: (color: string) => <BarChart3 size={22} color={color} />
                };
              case 'WorkoutTab':
                return {
                  label: 'Workout',
                  icon: (color: string) => <Dumbbell size={22} color={color} />
                };
              case 'ProfileTab':
                return {
                  label: 'Profile',
                  icon: (color: string) => <User size={22} color={color} />
                };
              default:
                return {
                  label: route.name,
                  icon: (color: string) => <Home size={22} color={color} />
                };
            }
          };

          const tabConfig = getTabConfig();
          // Warna ikon: putih jika tab aktif, abu-abu jika tidak aktif
          const iconColor = isFocused ? "#000" : "#95979D";

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.activeTabItem
              ]}
            >
              {tabConfig.icon(iconColor)}
              {isFocused && (
                <Text style={styles.tabLabel}>
                  {tabConfig.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5,
    left: 15,
    right: 15,
    alignItems: 'center',
  },
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1F1',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 58,
    width: width - 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 20,
    minWidth: 40,
  },
  activeTabItem: {
    backgroundColor: '#FEB200',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    color: '#964b00',
  },
});

export default CustomBottomNavigation;