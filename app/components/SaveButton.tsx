import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native"

type SaveButtonProps = {
  onPress: () => void
  isLoading?: boolean
  text?: string
}

const SaveButton = ({ onPress, isLoading = false, text = "Save" }: SaveButtonProps) => {
  return (
    <TouchableOpacity style={styles.saveButton} onPress={onPress} disabled={isLoading}>
      {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveButtonText}>{text}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: "#FF8A00",
    borderRadius: 30,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SaveButton
