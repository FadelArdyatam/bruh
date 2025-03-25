"use client"

import React from "react"
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  StyleSheet
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Sun, Moon, Check } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { useTheme, THEMES, ThemeType } from "../../context/ThemeContext"

const ThemeSettingsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { theme, darkMode, setTheme, toggleDarkMode } = useTheme()

  const themesArray = Object.values(THEMES)

  const renderThemeOption = (themeOption: ThemeType) => {
    const isSelected = theme.name === themeOption.name
    
    return (
      <TouchableOpacity
        key={themeOption.name}
        style={[
          styles.themeOption,
          { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
        ]}
        onPress={() => setTheme(themeOption)}
      >
        <View style={[styles.colorPreview, { backgroundColor: themeOption.primary }]} />
        <Text style={{ 
          flex: 1,
          marginLeft: 12,
          fontSize: 16,
          fontWeight: '500',
          color: darkMode ? '#FFF' : '#000',
          textTransform: 'capitalize'
        }}>
          {themeOption.name}
        </Text>
        {isSelected && (
          <Check size={20} color={theme.primary} />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: darkMode ? theme.background.dark : theme.background.light 
    }}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      <View style={[
        styles.header,
        { backgroundColor: darkMode ? theme.background.dark : theme.background.light }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={darkMode ? theme.text.onDark : theme.text.primary} />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle,
          { color: darkMode ? theme.text.onDark : theme.text.primary }
        ]}>
          Pengaturan Tema
        </Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Mode Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: darkMode ? theme.text.onDark : theme.text.primary }
          ]}>
            Mode Tampilan
          </Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.modeOption,
                !darkMode && { 
                  backgroundColor: theme.primary,
                  borderColor: theme.primary 
                }
              ]}
              onPress={() => darkMode && toggleDarkMode()}
            >
              <Sun size={20} color={!darkMode ? '#FFF' : darkMode ? '#FFF' : '#000'} />
              <Text style={{ 
                marginLeft: 8, 
                fontWeight: '500',
                color: !darkMode ? '#FFF' : darkMode ? '#FFF' : '#000'
              }}>
                Terang
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modeOption,
                darkMode && { 
                  backgroundColor: theme.primary,
                  borderColor: theme.primary 
                }
              ]}
              onPress={() => !darkMode && toggleDarkMode()}
            >
              <Moon size={20} color={darkMode ? '#FFF' : '#000'} />
              <Text style={{ 
                marginLeft: 8, 
                fontWeight: '500',
                color: darkMode ? '#FFF' : '#000'
              }}>
                Gelap
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Color Themes Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: darkMode ? theme.text.onDark : theme.text.primary }
          ]}>
            Tema Warna
          </Text>
          
          <View style={styles.themesContainer}>
            {themesArray.map(renderThemeOption)}
          </View>
        </View>
        
        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: darkMode ? theme.text.onDark : theme.text.primary }
          ]}>
            Pratinjau
          </Text>
          
          <View style={[
            styles.previewCard,
            { 
              backgroundColor: darkMode ? theme.background.dark : theme.background.card,
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }
          ]}>
            <View style={[
              styles.previewHeader,
              { backgroundColor: theme.primary }
            ]}>
              <Text style={styles.previewHeaderText}>
                Header Aplikasi
              </Text>
            </View>
            
            <View style={styles.previewContent}>
              <View style={[
                styles.previewButton,
                { backgroundColor: theme.primary }
              ]}>
                <Text style={styles.previewButtonText}>
                  Tombol Utama
                </Text>
              </View>
              
              <View style={[
                styles.previewButton,
                { 
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: theme.primary,
                  marginTop: 12
                }
              ]}>
                <Text style={{ color: theme.primary }}>
                  Tombol Sekunder
                </Text>
              </View>
              
              <View style={[
                styles.previewCard,
                { 
                  marginTop: 16,
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  padding: 12
                }
              ]}>
                <Text style={{ 
                  color: darkMode ? theme.text.onDark : theme.text.primary,
                  marginBottom: 4
                }}>
                  Kartu Konten
                </Text>
                <Text style={{ 
                  color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  fontSize: 14
                }}>
                  Ini adalah contoh tampilan kartu konten dengan tema yang dipilih.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    width: '48%',
  },
  themesContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  previewHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  previewHeaderText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewContent: {
    padding: 16,
  },
  previewButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});

export default ThemeSettingsScreen