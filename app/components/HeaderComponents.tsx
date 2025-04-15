import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MoreVertical, X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showRightIcon?: boolean;
  rightIconType?: 'more' | 'close' | 'none';
  onRightIconPress?: () => void;
  customRightIcon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  onBackPress?: () => void;
}

/**
 * Komponen Header fleksibel yang dapat digunakan di seluruh aplikasi
 */
const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  showRightIcon = false,
  rightIconType = 'more',
  onRightIconPress,
  customRightIcon,
  backgroundColor,
  textColor = '#000000',
  onBackPress,
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme?.() || { theme: { primary: '#FFB800' } };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // Menentukan background color header
  const headerBgColor = theme.background.light;

  // Render right icon sesuai tipe
  const renderRightIcon = () => {
    if (customRightIcon) {
      return customRightIcon;
    }

    switch (rightIconType) {
      case 'more':
        return <MoreVertical size={24} color={textColor} />;
      case 'close':
        return <X size={24} color={textColor} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerBgColor }]}>
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

      <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>
        {title}
      </Text>

      {showRightIcon ? (
        <TouchableOpacity 
          style={styles.rightButton} 
          onPress={onRightIconPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {renderRightIcon()}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderView} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Header;