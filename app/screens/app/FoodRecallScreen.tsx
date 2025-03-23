"use client"

import { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getAllFood, submitFoodSuggestion, saveFoodRecall } from "../../redux/slices/foodSlice"
import { ArrowLeft, Save, Plus, Minus, Search, X } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

// Tipe data untuk makanan
interface Food {
  id: number;
  nama_makanan: string;
  kalori: string;
  volume: string;
}

const FoodRecallScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { foodList, isLoading } = useSelector((state: RootState) => state.food)

  const [activeDay, setActiveDay] = useState<"wednesday" | "sunday">("wednesday")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFoods, setSelectedFoods] = useState<any[]>([])
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [showAddFoodForm, setShowAddFoodForm] = useState(false)
  const [newFood, setNewFood] = useState({
    nama_makanan: "",
    kalori: "",
    volume: "porsi",
    satuan: "1",
  })

  useEffect(() => {
    dispatch(getAllFood())
  }, [])

  const filteredFoodList = foodList.filter((food) =>
    food.nama_makanan.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectFood = (food: any) => {
    if (!selectedFoods.find((item) => item.id === food.id)) {
      setSelectedFoods([...selectedFoods, food])
      setQuantities({ ...quantities, [food.id]: 1 })
    }
  }

  const handleRemoveFood = (foodId: number) => {
    setSelectedFoods(selectedFoods.filter((food) => food.id !== foodId))
    const newQuantities = { ...quantities }
    delete newQuantities[foodId]
    setQuantities(newQuantities)
  }

  const handleQuantityChange = (foodId: number, increment: boolean) => {
    const currentQuantity = quantities[foodId] || 1
    const newQuantity = increment ? currentQuantity + 1 : Math.max(1, currentQuantity - 1)
    setQuantities({ ...quantities, [foodId]: newQuantity })
  }

  const calculateTotalCalories = () => {
    return selectedFoods.reduce((total, food) => {
      const quantity = quantities[food.id] || 1
      return total + Number.parseFloat(food.kalori) * quantity
    }, 0)
  }

  const handleSaveFoodRecall = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert("Error", "Pilih makanan terlebih dahulu")
      return
    }

    try {
      const foodsWithQuantity = selectedFoods.map((food) => ({
        ...food,
        quantity: quantities[food.id] || 1,
      }))

      await dispatch(
        saveFoodRecall({
          day: activeDay,
          foods: foodsWithQuantity,
        }),
      ).unwrap()

      Alert.alert("Sukses", "Recall makan berhasil disimpan")
      setSelectedFoods([])
      setQuantities({})
    } catch (err) {
      console.error("Failed to save food recall:", err)
    }
  }

  const handleSubmitNewFood = async () => {
    if (!newFood.nama_makanan || !newFood.kalori) {
      Alert.alert("Error", "Nama makanan dan kalori harus diisi")
      return
    }

    try {
      await dispatch(submitFoodSuggestion(newFood)).unwrap()
      Alert.alert("Sukses", "Usulan makanan berhasil dikirim")
      setNewFood({
        nama_makanan: "",
        kalori: "",
        volume: "porsi",
        satuan: "1",
      })
      setShowAddFoodForm(false)
      dispatch(getAllFood())
    } catch (err) {
      console.error("Failed to submit food suggestion:", err)
    }
  }

  const ListHeaderComponent = () => (
    <>
      {/* Header Pilih Hari (Di luar FlatList) */}
      <Text style={styles.sectionTitle}>Pilih Hari</Text>
      <View style={styles.daySelector}>
        <TouchableOpacity
          style={[
            styles.dayButton,
            activeDay === "wednesday" ? styles.activeDayButton : styles.inactiveDayButton
          ]}
          onPress={() => setActiveDay("wednesday")}
        >
          <Text style={
            activeDay === "wednesday" ? styles.activeDayText : styles.inactiveDayText
          }>Rabu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dayButton,
            activeDay === "sunday" ? styles.activeDayButton : styles.inactiveDayButton
          ]}
          onPress={() => setActiveDay("sunday")}
        >
          <Text style={
            activeDay === "sunday" ? styles.activeDayText : styles.inactiveDayText
          }>Minggu</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Cari Makanan</Text>
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Cari makanan..."
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <X size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );

  // Render makanan terpilih
  const renderSelectedFoods = () => {
    if (selectedFoods.length === 0) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderText}>Makanan Terpilih</Text>
          <Text style={styles.emptyListText}>Belum ada makanan yang dipilih</Text>
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeaderText}>Makanan Terpilih</Text>
        {selectedFoods.map((food) => (
          <View key={food.id} style={styles.selectedFoodItem}>
            <View style={styles.selectedFoodInfo}>
              <Text style={styles.foodName}>{food.nama_makanan}</Text>
              <Text style={styles.foodInfo}>
                {food.kalori} kal/{food.volume} × {quantities[food.id] || 1} ={" "}
                {Number.parseFloat(food.kalori) * (quantities[food.id] || 1)} kal
              </Text>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(food.id, false)}
              >
                <Minus size={18} color="#9CA3AF" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantities[food.id] || 1}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(food.id, true)}
              >
                <Plus size={18} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveFood(food.id)}
              >
                <X size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <View style={styles.totalCalories}>
          <Text style={styles.totalCaloriesLabel}>Total Kalori:</Text>
          <Text style={styles.totalCaloriesValue}>
            {calculateTotalCalories().toFixed(0)} kal
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>RECALL MAKAN</Text>
        </View>

        <View style={styles.content}>
          {/* Bagian atas: ListHeaderComponent */}
          <ListHeaderComponent />

          {/* Bagian pertama: Daftar Makanan */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Daftar Makanan</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddFoodForm(!showAddFoodForm)}
              >
                <Plus size={16} color="#3B82F6" />
                <Text style={styles.addButtonText}>Tambah Makanan</Text>
              </TouchableOpacity>
            </View>

            {showAddFoodForm && (
              <View style={styles.addFoodForm}>
                <Text style={styles.formLabel}>Tambah Makanan Baru</Text>
                <View style={styles.formFields}>
                  <TextInput
                    style={styles.formInput}
                    value={newFood.nama_makanan}
                    onChangeText={(text) => setNewFood({ ...newFood, nama_makanan: text })}
                    placeholder="Nama makanan"
                  />
                  <TextInput
                    style={styles.formInput}
                    value={newFood.kalori}
                    onChangeText={(text) => setNewFood({ ...newFood, kalori: text })}
                    placeholder="Kalori"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.formInput}
                    value={newFood.volume}
                    onChangeText={(text) => setNewFood({ ...newFood, volume: text })}
                    placeholder="Volume (mis: porsi, gram)"
                  />
                  <TextInput
                    style={styles.formInput}
                    value={newFood.satuan}
                    onChangeText={(text) => setNewFood({ ...newFood, satuan: text })}
                    placeholder="Satuan"
                  />
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleSubmitNewFood}
                  >
                    <Text style={styles.submitButtonText}>Kirim Usulan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Daftar makanan dengan FlatList yang aman */}
            <View style={styles.foodListContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#FFB800" style={styles.loader} />
              ) : (
                <FlatList
                  data={filteredFoodList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.foodItem}
                      onPress={() => handleSelectFood(item)}
                    >
                      <View>
                        <Text style={styles.foodName}>{item.nama_makanan}</Text>
                        <Text style={styles.foodInfo}>
                          {item.kalori} kal/{item.volume}
                        </Text>
                      </View>
                      <Plus size={20} color="#FFB800" />
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyListText}>
                      {searchQuery ? "Tidak ada makanan yang sesuai" : "Tidak ada data makanan"}
                    </Text>
                  }
                  nestedScrollEnabled={true}
                />
              )}
            </View>
          </View>

          {/* Bagian kedua: Makanan Terpilih */}
          {renderSelectedFoods()}
        </View>

        {/* Footer dengan tombol simpan TETAP DI BAGIAN BAWAH */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (isLoading || selectedFoods.length === 0) ? styles.disabledButton : {}
            ]}
            onPress={handleSaveFoodRecall}
            disabled={isLoading || selectedFoods.length === 0}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Save size={20} color="white" style={styles.saveIcon} />
                <Text style={styles.saveButtonText}>SIMPAN RECALL MAKAN</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles menggunakan StyleSheet untuk performa yang lebih baik
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
    padding: 16,
  },
  header: {
    backgroundColor: '#FFB800',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 8,
  },
  daySelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeDayButton: {
    backgroundColor: '#FFB800',
  },
  inactiveDayButton: {
    backgroundColor: '#e5e7eb',
  },
  activeDayText: {
    color: 'white',
    fontWeight: '600',
  },
  inactiveDayText: {
    color: '#1f2937',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    padding: 4,
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
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#3B82F6',
    marginLeft: 4,
  },
  addFoodForm: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  formFields: {
    gap: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  foodListContainer: {
    height: 200,
    marginVertical: 8,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  foodName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937',
  },
  foodInfo: {
    color: '#6b7280',
    fontSize: 14,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: 16,
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
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    marginHorizontal: 8,
    fontWeight: '600',
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  totalCalories: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  totalCaloriesLabel: {
    fontWeight: '600',
    color: '#4b5563',
  },
  totalCaloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFB800',
  },
  footerContainer: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    // Pastikan footer selalu di bagian bawah
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  },
  saveButton: {
    backgroundColor: '#FFB800',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loader: {
    padding: 16,
  },
});

export default FoodRecallScreen