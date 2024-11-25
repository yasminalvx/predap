import { API_KEY, SECRET_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";
import { formattedDate, formattedFullDateToSupabase } from "./utils";

class SupabaseStorage {
  async getItem(key: string) {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return null;
      }
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  }
  async removeItem(key: string) {
    if (Platform.OS === "web") {
      return localStorage.removeItem(key);
    }
    return AsyncStorage.removeItem(key);
  }
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      return localStorage.setItem(key, value);
    }
    return AsyncStorage.setItem(key, value);
  }
}

export class SupabaseService {
  public supabase = createClient(
    API_KEY,
    SECRET_KEY,
    {
      auth: {
        storage: new SupabaseStorage(),
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
    email = email.toLowerCase().trim();
    return this.supabase.auth.signUp({ email, password, options: { data } });
  }

  async updateUser(email: string, others: any) {
    const { data, error } = await this.supabase.auth.updateUser({
      email,
      data: others,
    });
    return { data, error };
  }

  async resetPassword(email: string) {
    const resetPasswordURL = Linking.createURL("/ResetarSenha");
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordURL,
    });
    return { data, error };
  };

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
      .from("treino")
      .select("*")
      .eq("patient_id", patientId)
      .lte("start_date", date)
      .or(`end_date.is.null,end_date.gte.${date}`)
      .order("created_at", { ascending: false })
      .limit(1);
    return { data, error };
  }

  async getExercicies(patientId: string, date: Date) {
    const treino = await this.getTreino(patientId, formattedDate(date));
    const treinoId = treino.data?.[0]?.id;
    if (!treinoId) {
      return { data: [], error: null };
    }
    const { data, error } = await this.supabase
      .from("treino_exercicios")
      .select(
        `
        id,
        treino(created_at),
        pelvic_exercises (*),
        treino_registro (*)
      `
      )
      .eq("treino_id", treinoId)
      .eq("treino_registro.date", formattedDate(date));
    return { data, error };
  }

  async registroExercicio(
    patientId: string,
    exercicioId: string
  ) {
    const date = formattedDate(new Date());
    const fullDate = formattedFullDateToSupabase(new Date());
    const { data, error } = await this.supabase
      .from("treino_registro")
      .insert([
        { patient_id: patientId, treino_exercicio_id: exercicioId, date, created_at: fullDate },
      ]);
    return { data, error };
  }

  async getTreinosByProfissional(profissionalId: string, date: string) {
    const { data, error } = await this.supabase.rpc(
      "get_treinos_profissional_data_uuid",
      { p_data: date, prof_id: profissionalId }
    );
    return { data, error };
  }

  async getAllPacientes() {
    const { data, error } = await this.supabase
    .from("users")
    .select("*")
    .eq('data->>perfil', 'paciente');
    return { data, error };
  }

  
  async adicionarNovoTreino(patientId: string, professionalId: string, date: string, createdDate: string) {
    const { data, error } = await this.supabase
      .from("treino")
      .insert({ patient_id: patientId, professional_id: professionalId, start_date: date, created_at: createdDate, ativo: true })
      .select('id');
    return { data, error };
  }

  async atualizarUltimoTreino(treinoId: string, date: string) {
    const { data, error } = await this.supabase
    .from('treino')
    .update({ end_date: date, ativo: false })
    .eq('id', treinoId)
    return { data, error };
  }

  async adicionarNovosExercicios(exercicios: any[]) {
    const { data, error } = await this.supabase
    .from('pelvic_exercises')
    .insert(exercicios.map(exercicio => (
      { 
        exercise_name: exercicio.exercise_name,
        sets: exercicio.sets,
        rest_time: exercicio.rest_time,
        time_contracting: exercicio.time_contracting,
        time_releasing: exercicio.time_releasing,
        description: exercicio.description
      }
    )))
    .select('id')
    return { data, error };
  }

  async relacionarTreinoExercicios(treinoId: string, exerciciosId: string[]) {
    const { data, error } = await this.supabase
    .from('treino_exercicios')
    .insert(exerciciosId.map(exercicio => ({ treino_id: treinoId, exercise_id: exercicio })))
    return { data, error };
  }

  async getTreinosByPaciente(profissionalId: string, date: string) {
    const {data: treino} = await this.getTreino(profissionalId, date);
    const treinoId = treino?.[0]?.id;
    const { data, error } = await this.supabase
      .from('treino_exercicios')
      .select('id, pelvic_exercises(*), treino_registro(*)')
      .eq('treino_id', treinoId)
    return { data, error };
  }
}

