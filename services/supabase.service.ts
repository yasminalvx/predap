import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import { environment } from "../environments/environment";
const APP_BASE_URL = "https://192.168.1.101:8081";

export class SupabaseService {
  public supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_ANON_KEY,
    {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  );

  checkUserLoggedIn(): Promise<any> {
    return this.supabase.auth.getUser();
  }

  login(email: string, password: string) {
    email = email.toLowerCase().trim();
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string, data: any) {
    console.log({ email, password, options: { data } });
    email = email.toLowerCase().trim();
    return this.supabase.auth.signUp({ email, password, options: { data } });
  }

  async updateUser(email: string, others: any) {
    const { data, error } = await this.supabase.auth.updateUser({ email, data: others });
    return { data, error };
  }

  resetPasswordForEmail(email: string) {
    const resetPasswordURL = `${APP_BASE_URL}/EsqueciSenha`;
    email = email.toLowerCase().trim();
    return this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordURL,
    });
  }

  async post(url: string, data: any) {
    const { data: response, error } = await this.supabase
      .from(url)
      .insert(data);
    return { response, error };
  }

  async put(url: string, data: any) {
    const { data: response, error } = await this.supabase
      .from(url)
      .update(data);
    return { response, error };
  }

  async get(url: string, id: string) {
    const { data, error } = await this.supabase
      .from(url)
      .select("*")
      .eq("id", id);
    return { data, error };
  }

  async delete(url: string, id: string) {
    const { data, error } = await this.supabase.from(url).delete().eq("id", id);
    return { data, error };
  }

  async getTreino(patientId: string, date: string) {
    const { data, error } = await this.supabase
      .from('treino')
      .select('*')
      .eq('patient_id', patientId)
      .lte('start_date', date)
      .or(`end_date.is.null,end_date.gte.${date}`) 
      .order('created_at', { ascending: false })
      .limit(1)
    return { data, error };
  }

  async getExercicies(patientId: string, date: string) {
    const treino = await this.getTreino(patientId, date);
    const treinoId = treino.data?.[0]?.id;
    const { data, error } = await this.supabase
      .from('treino_exercicios')
      .select(`
        id,
        pelvic_exercises (*),
        treino_registro (*)
      `)
      .eq('treino_id', treinoId)
      .eq('treino_registro.date', date)
    return { data, error };
  }

  async registroExercicio(patientId: string, date: string, exercicioId: string) {
    const { data, error } = await this.supabase
      .from('treino_registro')
      .insert([{ patient_id: patientId, treino_exercicio_id: exercicioId, date }]);
    return { data, error };
  }
}
