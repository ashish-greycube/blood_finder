import { AuthContext } from "@/services/auth";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setIsReady(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!isReady || isLoading) return;

    if (isAuthenticated) {
      router.replace("/(Screens)/MainScreen");
    } else {
      router.replace("/Login");
    }
  }, [isAuthenticated, isLoading, isReady]);

  return <View style={{ flex: 1, backgroundColor: "#121212" }} />;
}
