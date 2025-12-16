import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/firebase/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';

interface FoodItem {
    name: string;
    price: string;
    about: string;
    image: string | null;
    itemId: number,
    type: string; // new field for dropdown
}

const AddFoodPage: React.FC = () => {

    
    const generateRandom10DigitNumber = (): number => {
        // 10-digit number = between 1000000000 and 9999999999
        return Math.floor(1000000000 + Math.random() * 9000000000);
    };

    const randomNumber = generateRandom10DigitNumber();
    const router = useRouter();


    const [foodItem, setFoodItem] = useState<FoodItem>({
        name: '',
        price: '',
        about: '',
        image: null,
        type: '', // initial value
        itemId: randomNumber,
    });

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFoodItem({ ...foodItem, image: result.assets[0].uri });
        }
    };


    const handleClear = () => {
        setFoodItem({
            name: '',
            price: '',
            about: '',
            image: null,
            type: '',
            itemId: randomNumber,
        });
    };

    const handleSubmit = async () => {
        if (!foodItem.name || !foodItem.price) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        try {
            let imageUrl = null;

            // Agar image select ki gayi hai to upload karo
            if (foodItem.image) {
                const response = await fetch(foodItem.image);
                const blob = await response.blob();
                const imageRef = ref(storage, `food_images/${Date.now()}.jpg`);
                await uploadBytes(imageRef, blob);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Firestore me add karo
            await addDoc(collection(db, "foods"), {
                name: foodItem.name,
                price: parseFloat(foodItem.price),
                about: foodItem.about,
                category: foodItem.type, // agar tu dropdown use kar raha hai
                image: imageUrl,
                createdAt: serverTimestamp(),
                itemId: randomNumber
            });

            Alert.alert("✅ Success", "Food item added successfully!");
            setFoodItem({
                name: "",
                price: "",
                about: "",
                image: null,
                type: "",
                itemId: randomNumber
            }); // dropdown reset
        } catch (error) {
            console.error("Error adding food item:", error);
            Alert.alert("❌ Error", "Failed to add food item. Try again!");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={()=>router.back()}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Item</Text>
                    <View style={{ width: 40 }}></View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter food name"
                                placeholderTextColor="#999"
                                value={foodItem.name}
                                onChangeText={(text) => setFoodItem({ ...foodItem, name: text })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Price</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter price"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={foodItem.price}
                                onChangeText={(text) => setFoodItem({ ...foodItem, price: text })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Food Type</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={foodItem.type}
                                    onValueChange={(itemValue) => setFoodItem({ ...foodItem, type: itemValue })}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select Type" value="" />
                                    <Picker.Item label="Burger" value="burger" />
                                    <Picker.Item label="Fries" value="fries" />
                                    <Picker.Item label="Drink" value="drink" />
                                    <Picker.Item label="Combo" value="combo" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>About</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Enter description"
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={foodItem.about}
                                onChangeText={(text) => setFoodItem({ ...foodItem, about: text })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Image</Text>
                            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                                <Text style={styles.imagePickerText}>
                                    {foodItem.image ? 'Change Image' : 'Pick an Image'}
                                </Text>
                            </TouchableOpacity>

                            {foodItem.image && (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: foodItem.image }} style={styles.imagePreview} />
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={() => setFoodItem({ ...foodItem, image: null })}
                                    >
                                        <Text style={styles.removeImageText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                        <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                        <Text style={styles.addButtonText}>Add Food</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        position: 'relative',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    picker: {
        height: Platform.OS === 'ios' ? 150 : 60,
        width: '100%',
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#666',
        fontWeight: '300',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    textArea: {
        height: 100,
        paddingTop: 14,
    },
    imagePickerButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePickerText: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
    imagePreviewContainer: {
        marginTop: 12,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: 350,
        borderRadius: 12,
        backgroundColor: '#E5E5E5',
        borderWidth: 1,
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeImageText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        gap: 12,
    },
    clearButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    addButton: {
        flex: 2,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default AddFoodPage;
