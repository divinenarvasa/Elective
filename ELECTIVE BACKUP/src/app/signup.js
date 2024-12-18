import { View, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import SignUpText from "../Typography/SignUpText";
import EmailAddressInput from "../Components/Inputs/EmailAddressInput";
import PasswordInput from "../Components/Inputs/PasswordInput";
import ConfirmPasswordInput from "../Components/Inputs/ConfirmPasswordInput";
import SignUpButton from "../Components/Buttons/SignUpButton";
import AccountPrompt from "../Typography/AccountPrompt";
import { useRouter } from "expo-router"; // Importing router from expo-router
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // Firebase initialization

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const router = useRouter(); // Initialize router for navigation

  // Firebase Auth and Firestore initialization
  const auth = getAuth();
  const db = getFirestore();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Create user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Get the user details
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        // Add other user data you want to store here (e.g. displayName, etc.)
        createdAt: new Date(),
      });

      Alert.alert("Success", "User registered successfully!");

      // Navigate to the Dashboard page after successful sign-up
      router.push("/dashboard");

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert("Error", `Sign-up failed: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <SignUpText />
        <EmailAddressInput value={email} onChangeText={setEmail} />
        <PasswordInput value={password} onChangeText={setPassword} />
        <ConfirmPasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <SignUpButton onPress={handleSignUp} />
        <AccountPrompt />
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

export default SignUp;
