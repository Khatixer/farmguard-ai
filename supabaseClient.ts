import { supabase } from './config';
import { User } from '@supabase/supabase-js';

interface ProfileData {
  name?: string;
  phone?: string;
  location?: string;
  farmSize?: number;
  mainCrop?: string;
  experienceYears?: number;
  farmType?: string;
  preferredContact?: string;
  bio?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
  user?: User;
  profile?: any;
}

export const handleSignUp = async (email: string, password: string, profileData: ProfileData): Promise<AuthResult> => {
  try {
    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    // 2. If signup is successful and user is created
    if (authData.user) {
      // If the user is immediately confirmed (no email verification required)
      // or if we have a session, we can create the profile
      if (authData.session) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: email,
              farm_name: profileData.name || email.split('@')[0],
              farm_size: profileData.farmSize || 1,
              main_crop: profileData.mainCrop || null
            }
          ]);

        if (profileError) {
          console.error("Profile error:", profileError.message);
          // Don't fail the signup if profile creation fails
          console.log("User created but profile creation failed. Profile will be created on first login.");
        }
      }

      return {
        success: true,
        user: authData.user,
        message: authData.session
          ? "Account created successfully!"
          : "Account created successfully! Please check your email to verify your account."
      };
    }

    return { success: false, error: "Failed to create user account" };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An unexpected error occurred during signup" };
  }
};

export const handleLogin = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        console.log("Profile not found, creating one...");
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              farm_name: data.user.email?.split('@')[0] || 'Farmer',
              farm_size: 1,
              main_crop: null
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error("Failed to create profile:", createError);
          // Continue with login even if profile creation fails
        } else {
          console.log("Profile created successfully");
          return {
            success: true,
            user: data.user,
            profile: newProfile,
            message: "Login successful!"
          };
        }
      }

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Profile fetch error:", profileError);
      }

      return {
        success: true,
        user: data.user,
        profile: profile,
        message: "Login successful!"
      };
    }

    return { success: false, error: "Login failed" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred during login" };
  }
};

export const handleLogout = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "An unexpected error occurred during logout" };
  }
};

export const getCurrentUser = async (): Promise<AuthResult> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { success: false, error: error.message };
    }

    if (user) {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        success: true,
        user: user,
        profile: profile
      };
    }

    return { success: false, error: "No user found" };
  } catch (error) {
    console.error("Get user error:", error);
    return { success: false, error: "Failed to get current user" };
  }
};

export const checkUserExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows returned - user doesn't exist
      return { exists: false };
    }

    if (error) {
      return { exists: false, error: error.message };
    }

    return { exists: true };
  } catch (error) {
    console.error("Check user error:", error);
    return { exists: false, error: "Failed to check if user exists" };
  }
};