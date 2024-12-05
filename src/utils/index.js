import { Platform } from "react-native";

export const BaseUrl =
  Platform.OS === "android" ? "http://10.0.2.2:8000:8081/" : "http://localhost:8081";