export default {
  "expo": {
    "name": "Scholarship",
    "slug": "YOLO",
    "scheme": "com.scholarship",
    "platforms": ["ios", "android", "web"],
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./public/icon.jpg",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./public/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.scholarship",
      "adaptiveIcon": {
        "foregroundImage": "./public/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "googleServicesFile": "./google-services.json"
    },
    "web": {
      "favicon": "./public/favicon.png"
    },
    "plugins": [
      "expo-font"
    ],
    "extra": {
      "eas": {
        "projectId": "fd125460-d5b3-412c-a70a-ee6ebead916b"
      }
    }
  }
}