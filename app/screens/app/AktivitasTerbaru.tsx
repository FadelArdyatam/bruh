// app/components/RecentActivities.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { ChevronRight } from "lucide-react-native";
import Text from "~/app/components/Typography/Text";

const screenWidth = Dimensions.get("window").width;

type RecentActivitiesProps = {
  trainingHistory: any[];
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ trainingHistory }) => {
  const { theme, darkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Function to format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hari ini";
    } else if (diffDays === 1) {
      return "Kemarin";
    } else {
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    }
  };

  // Handle navigation with error catching
  const handleNavigation = (screenName: string) => {
    try {
      navigation.navigate(screenName);
    } catch (error) {
      console.error(`Error navigating to ${screenName}:`, error);
    }
  };

  return (
    <View style={[
      styles.card,
      { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
    ]}>
      <Text variant="medium" size={18} style={[
        { color: darkMode ? theme.text.onDark : theme.text.primary }
      ]}>
        Aktivitas Terbaru
      </Text>

      {trainingHistory.length > 0 ? (
        trainingHistory.slice(0, 5).map((activity, index) => (
          <View
            key={index}
            style={[
              styles.activityItem,
              {
                borderBottomWidth: index < 4 ? 1 : 0,
                borderBottomColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              }
            ]}
          >
            <View style={styles.activityInfo}>
              <Text variant="semiBold" style={[
                { color: darkMode ? theme.text.onDark : theme.text.primary }
              ]}>
                {activity.nama_latihan}
              </Text>
              <Text variant="regular" style={[
                { color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }
              ]}>
                {formatDate(new Date(activity.tgl_latihan))}
              </Text>
            </View>
            <View style={styles.activityStats}>
              <Text style={[
                styles.caloriesText,
                { color: darkMode ? theme.text.onDark : theme.text.primary }
              ]}>
                {activity.kalori_dibakar} kal
              </Text>
              <Text style={[
                styles.durationText,
                { color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }
              ]}>
                {activity.waktu_latihan} min
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyActivities}>
          <Text style={[
            styles.emptyText,
            { color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }
          ]}>
            Belum ada aktivitas terbaru
          </Text>
        </View>
      )}
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
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
  },
  activityStats: {
    alignItems: "flex-end",
  },
  caloriesText: {
    fontWeight: "bold",
  },
  durationText: {
    fontSize: 14,
  },
  emptyActivities: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    textAlign: "center",
  },
});

export default RecentActivities;