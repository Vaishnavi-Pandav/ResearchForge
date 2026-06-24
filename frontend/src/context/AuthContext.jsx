import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes — persists across refreshes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Email + Password Login
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  // Email + Password Signup
  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update display name
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    // Send verification email
    await sendEmailVerification(result.user);
    return result;
  };

  // Google Sign-In
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Forgot Password
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
