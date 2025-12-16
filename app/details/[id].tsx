import { UserContext } from '@/context/userDataContext';
import { db, storage } from '@/firebase/firebase.config';
import { addToCart } from '@/hooks/addToCart';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-image-progress';


interface FoodItem {
    itemId: number;
    name: string;
    price: string;
    about: string;
    image: string;
}

interface CartItem {
    id: any;
    name: string;
    price: number;
    quantity: number;
    image: string;
}


export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter()
    const [count, setCount] = useState(1);

    const [food, setFood] = useState<FoodItem | null>(null);

    const cartToAddData: CartItem = {
        id: food?.itemId ?? 0,
        name: food?.name ?? '',
        price: food?.price ? Number(food.price) : 0,
        quantity: count,
        image: food?.image ?? ""
    }

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const docRef = doc(db, "foods", typeof id === "string" ? id : Array.isArray(id) ? id[0] : "");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFood(docSnap.data() as FoodItem);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching food:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFood();
    }, []);

    const deleteFood = async () => {
        try {
            Alert.alert(
                "Confirm Delete",
                `Are you sure you want to delete ${food?.name}?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            // Firestore delete
                            await deleteDoc(doc(db, "foods", typeof id === "string" ? id : Array.isArray(id) ? id[0] : ""));

                            // Firebase Storage delete
                            const imageRef = ref(storage, food?.image);
                            await deleteObject(imageRef);

                            // Local state update
                            Alert.alert("Deleted", `${food?.name} has been removed.`);
                            router.back();
                        },
                    },
                ]
            );
        } catch (error: any) {
            console.error("Error deleting food:", error.message);
            Alert.alert("Error", "Failed to delete item.");
        }
    };

    const [imgLoading, setImgLoading] = useState(false);

    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(false)

    return (
        <SafeAreaView style={styles.container}>
            {
                loading ?
                    <View style={{ width: '100%', height: '120%', position: 'absolute', top: '50%', left: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translate(-50%,-50%)', backgroundColor: 'rgba(0,0,0,.4)', zIndex: 100 }} >
                        <ActivityIndicator size={50} />
                    </View>
                    : ""
            }
            {
                !food ?
                    <SafeAreaView style={styles.loadContainer}>
                        <Image
                            source={require('../../assets/images/loader.gif')}
                            style={{ width: 200, height: 200 }}
                        />
                    </SafeAreaView>
                    : ""
            }

            <View style={Platform.OS === 'ios' ? [styles.boxIos] : [styles.box]}>
                <View style={styles.header} >
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <ChevronLeft size={26} />
                    </TouchableOpacity>
                </View>
                <View style={styles.imageContainer}>

                    {
                        food?.image ?
                            <Image
                                style={styles.productImg}
                                source={{ uri: food?.image }}
                            />
                            :
                            <ActivityIndicator size={35} />
                    }
                </View>
                <View style={styles.detailContainer}>
                    <Text style={{ fontSize: 28, fontWeight: 800 }}>{food ? food.name : ''}</Text>

                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }} >

                        <View style={styles.counter}>
                            <TouchableOpacity
                                onPress={() => setCount(prev => Math.max(prev - 1, 1))}
                                style={styles.button}
                            >
                                <Text style={styles.sign}>−</Text>
                            </TouchableOpacity>

                            <Text style={styles.count}>{count}</Text>

                            <TouchableOpacity
                                onPress={() => setCount(prev => prev + 1)}
                                style={styles.button}
                            >
                                <Text style={styles.sign}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: 700 }}>₹{food?.price}</Text>
                    </View>

                    <Text style={{ fontSize: 18, fontWeight: 600, marginTop: 20 }}>About the Product</Text>
                    <Text style={{ fontSize: 15, fontWeight: 500, marginTop: 10, maxHeight: 120, minHeight: 120 }}>{food?.about}</Text>
                </View>
                {
                    userData?.email === 'developersucks@gmail.com' ?
                        // <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteFood()}>
                        //     <Trash size={26} color={'white'} />
                        //     <Text style={{ color: 'white', fontSize: 18, fontWeight: 500 }}>Delete Item</Text>
                        // </TouchableOpacity>
                        ''
                        :
                        <TouchableOpacity style={styles.addCartBtn} onPress={() => addToCart(cartToAddData, fetchUserData, setLoading)}>
                            <Text style={{ textAlign: 'center', color: "white", fontSize: 16, fontWeight: 600 }}>Add To Cart</Text>
                        </TouchableOpacity>
                }
            </View>
            {/* <View style={styles.cartContainer} > */}
            {

                userData?.email === 'developersucks@gmail.com' ?
                    <View style={styles.cartContainer} >
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteFood()}>
                            <Trash size={26} color={'white'} />
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 500 }}>Delete Item</Text>
                        </TouchableOpacity>
                    </View >
                    :
                    <View style={styles.cartContainer} >
                        <Text style={{ color: 'grey', fontSize: 18, fontWeight: 700, }}>Total : <Text style={{ color: 'orange' }}>₹{userData?.cart?.reduce((sum: any, i: any) => sum + i.price * i.quantity, 0)}</Text></Text>
                        <View style={{ width: 'auto', borderWidth: 1, flexDirection: 'row', gap: 6, overflow: 'scroll' }}>
                            {
                                userData?.cart?.map((data: any, index: any) => {
                                    return (
                                        <View key={index} style={{ width: 35, height: 35, borderWidth: 1, borderColor: 'white', backgroundColor: 'white', borderRadius: 50 }} >
                                            <Image
                                                source={{ uri: data.image }}
                                                style={{ width: 30, height: 30 }}
                                            />
                                        </View>
                                    )
                                })
                            }
                        </View>
                        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/cart')} >
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: 600 }}> {userData?.cart?.length}</Text>
                            <ChevronRight size={20} />
                        </TouchableOpacity>
                    </View>
                        
            // </View>
                }

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        flexDirection: "row",
        alignItems: 'flex-end',
        paddingTop: 10,
    },
    box: {
        height: '94%',
        backgroundColor: 'white',
        borderBottomEndRadius: 40,
        borderBottomStartRadius: 40,
        position: 'absolute',
        top: 0,
        width: '100%',
        paddingTop: 20,
        overflow: 'hidden'
    },
    boxIos: {
        height: '98%',
        backgroundColor: 'white',
        borderBottomEndRadius: 40,
        borderBottomStartRadius: 40,
        position: 'absolute',
        top: 0,
        width: '100%',
        paddingTop: 20,
        overflow: 'hidden'
    },
    header: {
        width: '100%',
        paddingHorizontal: 15,
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        // position: 'relative'
    },
    backBtn: {
        width: 45,
        height: 45,
        backgroundColor: 'rgba(0,0,0,.1)',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        width: 'auto',
        borderWidth: 1,
        fontSize: 22,
        fontWeight: 600,
        position: 'absolute',
        left: '50%',
        transform: 'translate(-50%,0)'
    },
    imageContainer: {
        height: Platform.OS === 'android' ? 280 : 240,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    productImg: {
        width: Platform.OS === 'android' ? 220 : 220, // Android = 120, iOS = 180
        height: Platform.OS === 'android' ? 220 : 220,
        aspectRatio: 1,
    },
    productImgIos: {
        width: 120,
        height: 120,
        aspectRatio: 1,
    },
    detailContainer: {
        padding: 20,
    },
    addCartBtn: {
        width: '94%',
        marginHorizontal: 'auto',
        height: 55,
        backgroundColor: 'orange',
        borderRadius: 30,
        justifyContent: 'center',
        // marginTop: 15,
    },
    deleteBtn: {
        width: '94%',
        marginHorizontal: 'auto',
        height: 55,
        backgroundColor: 'red',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
        // marginTop: 15,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 50,        // pill shape
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        bottom: '0%'
    },
    sign: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    count: {
        fontSize: 18,
        marginHorizontal: 8,
        fontWeight: '500',
    },
    cartContainer: {
        width: '100%',
        height: "11%",
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    cartBtn: {
        width: 80,
        height: 40,
        backgroundColor: 'orange',
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    loadContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '130%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: "translate(-50%,-50%)",
        zIndex: 1000,
        backgroundColor: 'white'
    }
});
