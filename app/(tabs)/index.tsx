import { SupabaseService } from "@/services/supabase.service";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import HomeScreen from "../(pages)/home";
import HomeFisioScreen from "../(pages)/home-fisio";

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const supabaseService = new SupabaseService();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Iniciou");
    checkUser();
  }, []);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Navegou");
      checkUser();
    });
    return unsubscribe;
  }, [navigation]);

  const checkUser = async () => {
    const response = await supabaseService.checkUserLoggedIn();
    if (!response.data.user) {
      router.navigate("Login" as any);
    } else {
      setProfile(response.data.user.user_metadata.perfil);
    }
    setLoading(false);
  };
  return loading ? <></> : profile === "paciente" ? <HomeScreen/> : <HomeFisioScreen></HomeFisioScreen>;
}
