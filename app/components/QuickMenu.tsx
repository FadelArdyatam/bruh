// components/QuickMenu.tsx
import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { BarChart2, Activity, ChevronRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import Text from "~/app/components/Typography/Text";
import { useTheme } from "../../app/context/ThemeContext";

// Define your root stack param list types
type RootStackParamList = {
  IMTTab: undefined;
  TrainingProgramTab: undefined;
  WorkoutList: undefined;
  FoodRecall: undefined;
  DietPlan: undefined;
  LogWorkout: undefined;
  WorkoutHistory: undefined;
  WorkoutAnalysis: undefined;
  WorkoutSchedule: undefined;
  // Add other screens as needed
};

type MenuItem = {
  title: string;
  description: string;
  icon: "chart" | "activity" | "food" | "diet" | "custom";
  customIconUri?: string;
  screenName: keyof RootStackParamList;
  showBorder?: boolean;
  params?: any; // Optional navigation params
};

interface QuickMenuProps {
  items: MenuItem[];
}

const QuickMenu: React.FC<QuickMenuProps> = ({ items }) => {
  const { theme, darkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleNavigation = (screenName: keyof RootStackParamList, params?: any) => {
    try {
      navigation.navigate(screenName, params);
    } catch (error) {
      console.error(`Error navigating to ${screenName}:`, error);
      // You could show an alert here if needed
    }
  };

  const renderIcon = (item: MenuItem) => {
    switch (item.icon) {
      case "chart":
        return <BarChart2 size={24} color={theme.primary} />;
      case "activity":
        return <Activity size={24} color={theme.secondary} />;
      case "food":
        return (
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2771/2771406.png" }}
            style={styles.menuIcon}
          />
        );
      case "diet":
        return (
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/706/706164.png" }}
            style={styles.menuIcon}
          />
        );
      case "custom":
        return item.customIconUri ? (
          <Image
            source={{ uri: item.customIconUri }}
            style={styles.menuIcon}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.card,
      { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
    ]}>
      <Text variant='medium' size={18} style={[
        { color: darkMode ? theme.text.onDark : theme.text.primary }
      ]}>
        Menu Cepat
      </Text>

      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            {
              borderBottomWidth: item.showBorder !== false ? 1 : 0,
              borderBottomColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            }
          ]}
          onPress={() => handleNavigation(item.screenName, item.params)}
        >
          <View style={[
            styles.menuIconContainer,
            { 
              backgroundColor: item.icon === "activity" 
                ? `${theme.secondary}20` 
                : `${theme.primary}20` 
            }
          ]}>
            {renderIcon(item)}
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[
              styles.menuTitle,
              { color: darkMode ? theme.text.onDark : theme.text.primary }
            ]}>
              {item.title}
            </Text>
            <Text style={[
              styles.menuDescription,
              { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
            ]}>
              {item.description}
            </Text>
          </View>
          <ChevronRight size={20} color={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  menuIconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16
  },
  menuIcon: {
    width: 24,
    height: 24
  },
  menuTextContainer: {
    flex: 1
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2
  },
  menuDescription: {
    fontSize: 14
  }
});

export default QuickMenu;