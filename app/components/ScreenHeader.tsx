import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { ArrowLeft, MoreVertical } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

type ScreenHeaderProps = {
  title: string
  showMoreButton?: boolean
  onMorePress?: () => void
}

const ScreenHeader = ({ title, showMoreButton = false, onMorePress }: ScreenHeaderProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>()

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#1d1617" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {showMoreButton ? (
        <TouchableOpacity style={styles.moreButton} onPress={onMorePress}>
          <MoreVertical size={24} color="#1d1617" />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerRight} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f7f8f8",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1d1617",
  },
  moreButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
})

export default ScreenHeader
