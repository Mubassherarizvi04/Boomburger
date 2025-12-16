import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { useRouter } from "expo-router";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin,setIsAdmin ] = useState(false);

    const router = useRouter();

    console.log("userData",userData, userData?.email)

    const fetchUserData = async () => {
        try {
            const userId = await AsyncStorage.getItem("userUUID");
            console.log(userId) 
            if (!userId) {
                console.warn("No user UID found in AsyncStorage.");
                router.push('/_welcome/second')
                setLoading(false);
                return;
            }

            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUserData(userSnap.data());
                console.log('user data fetched')
            } else {
                console.warn("User document not found.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        // ✅ Fetch user data only once when app starts
        fetchUserData();
        
    }, []);

    return (
        <UserContext.Provider
            value={{
                userData,
                loading,
                fetchUserData, // manually refresh when needed
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
