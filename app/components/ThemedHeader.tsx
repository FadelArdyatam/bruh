import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface ThemedHeaderProps {
  title: string;
  showBackButton?: boolean;
  showRightIcon?: boolean;
  rightIconType?: 'more' | 'close' | 'none';
  onRightIconPress?: () => void;
  customRightIcon?: React.ReactNode;
  onBackPress?: () => void;
  useGradient?: boolean;
  lightText?: boolean;
}

/**
 * Header dengan tema aplikasi yang konsisten menggunakan warna utama aplikasi
 */
const ThemedHeader: React.FC<ThemedHeaderProps> = ({
  title,
  showBackButton = true,
  showRightIcon = false,
  rightIconType = 'more',
  onRightIconPress,
  customRightIcon,
  onBackPress,
  useGradient = false,
  lightText = false,
}) => {
  const navigation = useNavigation();
  const { theme, darkMode } = useTheme?.() || { 
    theme: { 
      primary: '#FFB800', 
      secondary: '#FF8A00' 
    }, 
    darkMode: false 
  };

  const textColor = lightText ? '#FFFFFF' : darkMode ? '#FFFFFF' : '#1F1F1F';

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // Rendering header content
  const renderHeaderContent = () => (
    <View style={styles.headerContainer}>
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color={textColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderView} />
      )}

      <Text 
        style={[
          styles.headerTitle, 
          { color: textColor }
        ]} 
        numberOfLines={1}
      >
        {title}
      </Text>

      {showRightIcon ? (
        <TouchableOpacity 
          style={styles.rightButton} 
          onPress={onRightIconPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {customRightIcon || <MoreVertical size={24} color={textColor} />}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderView} />
      )}
    </View>
  );

  // Jika menggunakan gradient, render dengan LinearGradient
  if (useGradient) {
    return (
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        {renderHeaderContent()}
      </LinearGradient>
    );
  }

  // Jika tidak menggunakan gradient, render dengan background warna utama
  return (
    <View style={[
      styles.solidContainer, 
      { backgroundColor: darkMode ? '#1F1F1F' : theme.primary }
    ]}>
      {renderHeaderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  solidContainer: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  rightButton: {
    padding: 8,
    borderRadius: 20,
  },
  placeholderView: {
    width: 40,
    height: 40,
  },
});

export default ThemedHeader;