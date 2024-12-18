import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import LoginText from "../Typography/LoginText";
import EmailAddressInput from "../Components/Inputs/EmailAddressInput";
import PasswordInput from "../Components/Inputs/PasswordInput";
import LoginButton from "../Components/Buttons/LoginButton";
import NoAccountPrompt from "../Typography/NoAccountPrompt";
import ForgotPassword from "../Typography/ForgotPassword";
import { auth, db } from "../../firebase"; // Import Firebase Auth and Firestore
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // For fetching data from Firestore

import { useRouter } from 'expo-router';



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter(); // Initialize router


  // Handle user login
  const handleLogin = async () => {
    try {
      // Try signing in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user data from Firestore (if needed)
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        Alert.alert("Error", "User does not exist in the database.");
        return;
      }
  
      const userData = userDoc.data();
      console.log("User data fetched: ", userData);
  
      // Check if email and password match the Firebase credentials
      if (user.email === userData.email) {
        Alert.alert("Success", "Login successful!");
        router.push("/dashboard"); // Navigate to dashboard after successful login
      } else {
        Alert.alert("Error", "User email does not match.");
      }
  
    } catch (error) {
      // Handle the error if the login fails
      const errorCode = error.code;  // Firebase error code
      const errorMessage = error.message;  // Firebase error message
  
      if (errorCode === 'auth/wrong-password') {
        Alert.alert("Error", "Incorrect password.");
      } else if (errorCode === 'auth/user-not-found') {
        Alert.alert("Error", "User not found.");
      } else if (errorCode === 'auth/invalid-email') {
        Alert.alert("Error", "Invalid email format.");
      } else {
        // For any other errors, display the generic message
        Alert.alert("Error", errorMessage || "An unexpected error occurred.");
      }
  
      console.log(errorCode, errorMessage); // Log for debugging purposes
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <LoginText />
        <EmailAddressInput value={email} onChangeText={setEmail} />
        <PasswordInput value={password} onChangeText={setPassword} />
        <LoginButton onPress={handleLogin} />
        <NoAccountPrompt />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  panel: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default Login;
