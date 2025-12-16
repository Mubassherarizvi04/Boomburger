import { View, Text, StyleSheet, Pressable, TouchableWithoutFeedback, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserContext } from '@/context/userDataContext';

type PopupProps = {
    // setModalVisibleTwo: (visible: boolean) => void;
};

const PersonalInfo: React.FC<PopupProps> = ({ }) => {

    const router = useRouter();
    const { userData } = useContext(UserContext)
    console.log(userData)

    const formatDate = (inputDate: any): string => {
        let date: Date;

        // 🟢 Firestore Timestamp handle kare
        if (inputDate?.toDate) {
            date = inputDate.toDate();
        }
        // 🟢 String handle kare (remove unwanted spaces/symbols)
        else if (typeof inputDate === "string") {
            // Non-breaking spaces aur special characters clean kar de
            const cleaned = inputDate.replace(/[^\x00-\x7F]/g, " ");
            date = new Date(cleaned);
        }
        // 🟢 Already JS Date object
        else {
            date = new Date(inputDate);
        }

        if (isNaN(date.getTime())) {
            console.warn("⚠️ Invalid date format:", inputDate);
            return "Invalid Date";
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };

    return (
        <SafeAreaView >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Pressable style={styles.backBtn} onPress={() => router.back()}>
                            <ChevronLeft size={25} />
                        </Pressable>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: 'black' }}>Personal Information</Text>
                        <View style={{ width: 40 }}></View>
                    </View>

                    <View style={styles.item}>
                        <Text style={{ fontSize: 16, fontWeight: 500, color: 'grey' }}>Name</Text>
                        <Text style={{ fontSize: 20, fontWeight: 600 }}>{userData?.name}</Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={{ fontSize: 16, fontWeight: 500, color: 'grey' }}>Email</Text>
                        <Text style={{ fontSize: 20, fontWeight: 600 }}>{userData?.email}</Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={{ fontSize: 16, fontWeight: 500, color: 'grey' }}>Date Of Join</Text>
                        <Text style={{ fontSize: 20, fontWeight: 600 }}>{formatDate(userData?.createdAt)}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    backBtn: {
        width: 45,
        height: 45,
        backgroundColor: 'rgba(0,0,0,.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        width: '93%',
        height: 'auto',
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: Platform.OS ===
            'ios' ? 40 : 30,
        // paddingBottom: 30,
        // paddingHorizontal: 16,
        alignItems: 'center', gap: 10,
        marginBottom: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        height: 50
    },
    item: {
        width: '95%',
        height: 55,
        marginTop: 10,
    },
})

export default PersonalInfo
