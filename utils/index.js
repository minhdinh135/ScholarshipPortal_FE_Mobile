import { Platform } from "react-native";
// import { io } from "socket.io-client";
export const BaseUrl =
  Platform.OS === "android" ? "http://10.0.2.2:8000:8081/" : "http://localhost:8081";

// export const socket = io.connect("http://10.0.2.2:8000:4000/");