// import { onAuthStateChanged } from "@react-native-firebase/auth";
// import { auth } from "../config/firebase";
// import { useContext } from "react";

// const AuthenticatedUserContext = createContext({});

// export const AuthenticatedUserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth,
//       async authenticatedUser => {
//         authenticatedUser ? setUser(authenticatedUser) : setUser(null);
//         setLoading(false);
//       }
//     );
//     return () => unsubscribe();
//   }, [user]);


//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1, justifyContent: 'center', alignItems: 'center'
//         }}
//       >
//         <ActivityIndicator size='large' />
//       </View>
//     )
//   }

//   return (
//     <AuthenticatedUserContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthenticatedUserContext.Provider>
//   )
// }

// export const useAuth = () => {
//   return useContext(AuthenticatedUserContext)
// }