import { router, useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '@/firebase/firebase.config';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { UserContext } from '@/context/userDataContext';

// ✅ Popup Component
type PopupProps = {
  clickState: string;
  setEmail: (email: string) => void;
  email: string;
  password: string;
  setPassword: (password: string) => void;
  setName: (password: string) => void;
  signup: () => void;
  login: (email: string, password: any) => void;
  onClose: () => void; // 🔥 new prop
};

const Popup: React.FC<PopupProps> = ({
  clickState,
  setEmail,
  email,
  setPassword,
  signup,
  onClose,
  setName,
  password,
  login
}) => {
  return (
    <View style={style.popContainer}>
      {/* Pressable for outside tap */}
      <Pressable style={{ flex: 1, width: '100%' }} onPress={onClose}>
        {/* Transparent background to catch outside taps */}
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ width: '100%', alignItems: 'center' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.card}>
            {clickState === 'signup' ? (
              <>
                <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'center' }}>
                  Create Account
                </Text>
                <TextInput style={style.input} placeholder="Name"
                  onChangeText={setName} />
                <TextInput
                  style={style.input}
                  placeholder="Email"
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput  
                  style={style.input}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={style.createBtn} onPress={signup}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'center' }}>
                  Log In
                </Text>
                <TextInput
                  style={style.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
                <TextInput
                  style={style.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={text => setPassword(text)}
                />
                <TouchableOpacity style={style.createBtn} onPress={() => login(email, password)}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    Log In
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const Second: React.FC = () => {
  const route = useRouter();
  const [showPop, setShowPop] = useState(false);
  const [clickState, setClickState] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { fetchUserData } = useContext(UserContext);

  // ✅ Signup function
  const signup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User Created:", userCredential.user.uid);
      await AsyncStorage.setItem("userUUID", userCredential.user.uid)
      const userIdd = await AsyncStorage.getItem("userUUID")
      console.log(userIdd)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        userId: userCredential.user.uid,
      });

      const userId = await AsyncStorage.getItem("userUUID")
      if (userId) {
        fetchUserData();
        router.push("/")
      }
      else {
        await AsyncStorage.setItem('userUUID', userCredential.user.uid)
      }

      Alert.alert("Success", "Account created successfully!");
      setShowPop(false);

    } catch (error: any) {
      console.error("Signup Error:", error.message);
      Alert.alert("Signup Failed", error.message);
    }
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      // 1️⃣ Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('user found')
      const uid = userCredential.user.uid;

      // 2️⃣ Fetch user document from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {

        const userData = userDocSnap.data();

        // 3️⃣ Save UUID in AsyncStorage 

        await AsyncStorage.setItem("userUUID", uid);
        // Alert.alert("Success", `Welcome back, ${userData.name}!`);
        fetchUserData();
        // 4️⃣ Navigate to Home or any page
        router.push("/");

      } else {
        Alert.alert("Error", "User document not found in Firestore");
      }

    } catch (error: any) {
      console.error("Login Error:", error.message);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {showPop && (
        <Popup
          clickState={clickState}
          setEmail={setEmail}
          setPassword={setPassword}
          email={email}
          password={password}
          signup={signup}
          login={login}
          onClose={() => setShowPop(false)}
          setName={setName}// 🔥 close popup when clicked outside
        />
      )}

      <ImageBackground
        source={require('../../assets/images/welcome-bg.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={style.container}>
          {/* <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => route.push("/")}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>1 step away from Order</Text>
          </TouchableOpacity> */}

          <View style={{ flexDirection: 'row', width: '90%', gap: 10 }}>
            <TouchableOpacity
              style={style.signBtn}
              onPress={() => {
                setShowPop(true);
                setClickState('signup');
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.logBtn}
              onPress={() => {
                setShowPop(true);
                setClickState('login');
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Second;

// ✅ Styles
const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  signBtn: {
    flex: 1,
    height: 55,
    backgroundColor: '#004DFF',
    marginTop: 15,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logBtn: {
    flex: 1,
    height: 55,
    backgroundColor: 'black',
    marginTop: 15,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  card: {
    width: '92%',
    backgroundColor: 'white',
    borderRadius: Platform.OS === 'ios' ? 40 : 30,
    padding: 20,
  },
  input: {
    borderWidth: 1.2,
    borderColor: '#ccc',
    width: '100%',
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: '500',
    height: 50,
    marginTop: 10,
    borderRadius: 8,
  },
  createBtn: {
    width: '100%',
    height: 55,
    backgroundColor: '#004DFF',
    marginTop: 15,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
