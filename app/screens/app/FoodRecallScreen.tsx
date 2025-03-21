"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getAllFood, submitFoodSuggestion, saveFoodRecall } from "../../redux/slices/foodSlice"
import { ArrowLeft, Save, Plus, Minus, Search, X } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-yellow-500 p-4 flex-row items-center">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white ml-2">RECALL MAKAN</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Pilih Hari</Text>

          <View className="flex-row mb-6">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg mr-2 ${activeDay === "wednesday" ? "bg-yellow-500" : "bg-gray-200"}`}
              onPress={() => setActiveDay("wednesday")}
            >
              <Text className={`text-center font-medium ${activeDay === "wednesday" ? "text-white" : "text-gray-800"}`}>
                Rabu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ml-2 ${activeDay === "sunday" ? "bg-yellow-500" : "bg-gray-200"}`}
              onPress={() => setActiveDay("sunday")}
            >
              <Text className={`text-center font-medium ${activeDay === "sunday" ? "text-white" : "text-gray-800"}`}>
                Minggu
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-bold text-gray-800 mb-4">Cari Makanan</Text>

          <View className="flex-row items-center border border-gray-300 rounded-lg p-2 bg-gray-50 mb-4">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2"
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

          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-medium text-gray-700">Daftar Makanan</Text>
              <TouchableOpacity className="flex-row items-center" onPress={() => setShowAddFoodForm(!showAddFoodForm)}>
                <Plus size={16} color="#3B82F6" />
                <Text className="text-blue-500 ml-1">Tambah Makanan</Text>
              </TouchableOpacity>
            </View>

            {showAddFoodForm && (
              <View className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="font-medium text-gray-700 mb-2">Tambah Makanan Baru</Text>

                <View className="space-y-3">
                  <TextInput
                    className="border border-gray-300 rounded-lg p-2 bg-white"
                    value={newFood.nama_makanan}
                    onChangeText={(text) => setNewFood({ ...newFood, nama_makanan: text })}
                    placeholder="Nama makanan"
                  />

                  <TextInput
                    className="border border-gray-300 rounded-lg p-2 bg-white"
                    value={newFood.kalori}
                    onChangeText={(text) => setNewFood({ ...newFood, kalori: text })}
                    placeholder="Kalori"
                    keyboardType="numeric"
                  />

                  <TextInput
                    className="border border-gray-300 rounded-lg p-2 bg-white"
                    value={newFood.volume}
                    onChangeText={(text) => setNewFood({ ...newFood, volume: text })}
                    placeholder="Volume (mis: porsi, gram)"
                  />

                  <TextInput
                    className="border border-gray-300 rounded-lg p-2 bg-white"
                    value={newFood.satuan}
                    onChangeText={(text) => setNewFood({ ...newFood, satuan: text })}
                    placeholder="Satuan"
                  />

                  <TouchableOpacity className="bg-blue-500 py-2 rounded-lg" onPress={handleSubmitNewFood}>
                    <Text className="text-white text-center font-medium">Kirim Usulan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isLoading ? (
              <ActivityIndicator size="large" color="#FFB800" className="py-4" />
            ) : (
              <FlatList
                data={filteredFoodList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row justify-between items-center p-3 border-b border-gray-100"
                    onPress={() => handleSelectFood(item)}
                  >
                    <View>
                      <Text className="font-medium">{item.nama_makanan}</Text>
                      <Text className="text-gray-500">
                        {item.kalori} kal/{item.volume}
                      </Text>
                    </View>
                    <Plus size={20} color="#FFB800" />
                  </TouchableOpacity>
                )}
                style={{ height: 200 }}
                ListEmptyComponent={
                  <Text className="text-center text-gray-500 py-4">
                    {searchQuery ? "Tidak ada makanan yang sesuai" : "Tidak ada data makanan"}
                  </Text>
                }
              />
            )}
          </View>

          <View className="mb-4">
            <Text className="font-medium text-gray-700 mb-2">Makanan Terpilih</Text>

            {selectedFoods.length === 0 ? (
              <Text className="text-center text-gray-500 py-4">Belum ada makanan yang dipilih</Text>
            ) : (
              <View>
                {selectedFoods.map((food) => (
                  <View key={food.id} className="flex-row justify-between items-center p-3 border-b border-gray-100">
                    <View className="flex-1">
                      <Text className="font-medium">{food.nama_makanan}</Text>
                      <Text className="text-gray-500">
                        {food.kalori} kal/{food.volume} × {quantities[food.id] || 1} ={" "}
                        {Number.parseFloat(food.kalori) * (quantities[food.id] || 1)} kal
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <TouchableOpacity className="p-1" onPress={() => handleQuantityChange(food.id, false)}>
                        <Minus size={18} color="#9CA3AF" />
                      </TouchableOpacity>

                      <Text className="mx-2 font-medium">{quantities[food.id] || 1}</Text>

                      <TouchableOpacity className="p-1" onPress={() => handleQuantityChange(food.id, true)}>
                        <Plus size={18} color="#9CA3AF" />
                      </TouchableOpacity>

                      <TouchableOpacity className="ml-2 p-1" onPress={() => handleRemoveFood(food.id)}>
                        <X size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <View className="bg-yellow-50 p-4 rounded-lg mt-4">
                  <Text className="font-medium text-gray-700">Total Kalori:</Text>
                  <Text className="text-2xl font-bold text-yellow-500">{calculateTotalCalories().toFixed(0)} kal</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          className="bg-yellow-500 py-4 px-6 rounded-lg flex-row items-center justify-center shadow-md mb-6"
          onPress={handleSaveFoodRecall}
          disabled={isLoading || selectedFoods.length === 0}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Save size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">SIMPAN RECALL MAKAN</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FoodRecallScreen

