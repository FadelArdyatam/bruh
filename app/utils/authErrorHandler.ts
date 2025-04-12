// app/utils/authErrorHandler.ts
import { EventEmitter } from 'events';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { store } from "../redux/store"
import { logoutUser } from "../redux/slices/authSlice"

// Event emitter untuk notifikasi session expired ke seluruh aplikasi
export const authEvents = new EventEmitter();

// Enum untuk events
export enum AuthEvent {
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}

// Variabel untuk melacak apakah penanganan logout sedang berlangsung
let isHandlingAuthError = false

/**
 * Fungsi untuk menangani error autentikasi (401 Unauthorized)
 * Melakukan logout otomatis dan membersihkan token
 */
export const handleAuthError = async () => {
  // Cegah pemanggilan ganda ketika sedang menangani error
  if (isHandlingAuthError) return
  
  try {
    isHandlingAuthError = true
    
    // Bersihkan token dan data user dari AsyncStorage
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("user")
    
    // Dispatch action logout untuk mengupdate state Redux
    store.dispatch(logoutUser())
    
    // Emit event untuk menampilkan dialog
    authEvents.emit(AuthEvent.SESSION_EXPIRED);
    
    console.log("Sesi berakhir, pengguna diarahkan ke halaman login")
  } catch (error) {
    console.error("Error saat menangani auth error:", error)
  } finally {
    isHandlingAuthError = false
  }
}

// Fungsi untuk memeriksa apakah respons error adalah unauthenticated
export const isAuthError = (error: any): boolean => {
  return (
    error?.response?.status === 401 || 
    error?.response?.data?.message?.toLowerCase().includes("unauthenticated") ||
    error?.response?.data?.error?.toLowerCase().includes("unauthenticated") ||
    error?.message?.toLowerCase().includes("unauthenticated")
  )
}