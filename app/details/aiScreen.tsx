import { Dimensions, Pressable, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Mic, X } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';

type AiScreenProps = {
    setShowAiScreen: (show: boolean) => void;
};

const AiScreen: React.FC<AiScreenProps> = ({ setShowAiScreen }) => {
    const videoRef = useRef(null);
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const openAISpeechToTextKey =
        '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';

    const requestMicrophonePermission = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access microphone is required for speech recognition!');
            return false;
        }
        return true;
    }

    const recordingFunc = async () => {
        try {
            // 1️⃣ Request microphone permission
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Microphone permission not granted');
                return;
            }

            // 2️⃣ Set audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // 3️⃣ Start recording
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            console.log('🎙️ Recording started...');

            // Record for 5 seconds (adjust as needed)
            await new Promise((r) => setTimeout(r, 5000));

            // 4️⃣ Stop recording
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log('📁 File saved at:', uri);

            if (!uri) throw new Error('Recording URI is null');

            // ✅ Use FormData and send URI directly (no base64)
            const formData = new FormData();
            formData.append('file', {
                uri,
                name: 'audio.m4a',
                type: 'audio/m4a',
            } as any);
            formData.append('model', 'gpt-4o-mini-transcribe'); // or 'whisper-1'

            // 5️⃣ Fetch Whisper API
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${openAISpeechToTextKey}`,
                    // ❌ Do NOT set Content-Type manually for FormData
                },
                body: formData,
            });

            const data = await response.json();
            console.log('📝 Transcription:', data); // should now show real text

        } catch (err) {
            console.error('Error in recording/transcription:', err);
        }
    }

    return (
        <View style={styles.centeredView}>
            <LinearGradient
                colors={['#1100FF', '#009ADB', '#B300EE', '#FF0090', '#CFD61C', '#FF6F00', '#FF3D02', '#FF0404']}
                style={styles.gradientBorder}
            >
                <View style={styles.innerBox}>
                    <Text style={styles.welcomeTxt}>Hey,</Text>
                    <Text style={styles.welcomeTxt}>
                        Just say we prepare your <Text style={{ color: '#0291ffff' }}>Order!</Text>
                    </Text>

                    <View style={styles.container}>
                        <Video
                            ref={videoRef}
                            source={require('../../assets/images/ai-modal.mp4')}
                            style={styles.video}
                            resizeMode={ResizeMode.COVER}
                            shouldPlay
                            isLooping
                            isMuted
                            useNativeControls={false}
                        />
                    </View>

                    <View style={styles.optionContainer}>
                        <Pressable style={styles.menuBtn}>
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Show Menu</Text>
                        </Pressable>

                        <TextInput
                            placeholder="Text Anything..."
                            placeholderTextColor="#b5b5b5ff"
                            style={styles.textInput}
                            value={text}
                            onChangeText={setText}
                        />

                        <View style={styles.actionBtn}>
                            <Pressable style={styles.btnOne}></Pressable>

                            <Pressable
                                style={[styles.btnTwo, { backgroundColor: isRecording ? '#FF0000' : '#1100FF' }]}
                                onPress={() => recordingFunc()}
                            >
                                <Mic size={35} color="white" />
                            </Pressable>

                            <Pressable style={styles.btnThree} onPress={() => setShowAiScreen(false)}>
                                <X size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default AiScreen;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,.8)',
    },
    gradientBorder: {
        width: '100%',
        padding: 12,
        borderRadius: 40,
    },
    innerBox: {
        backgroundColor: 'black',
        borderRadius: Platform.OS === 'ios' ? 45 : 15,
        paddingHorizontal: 30,
        paddingVertical: 20,
        width: '100%',
        height: '100%',
    },
    welcomeTxt: {
        fontSize: 22,
        fontWeight: '600',
        color: 'white',
        lineHeight: 30,
    },
    container: {
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginVertical: 10,
    },
    video: {
        width: 300,
        height: 300,
        borderRadius: 12,
    },
    optionContainer: {
        borderWidth: 1,
        marginTop: 'auto',
    },
    menuBtn: {
        backgroundColor: '#3B3B3B',
        padding: 10,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    textInput: {
        width: '100%',
        height: 50,
        marginTop: 15,
        backgroundColor: '#3B3B3B',
        borderRadius: 10,
        color: 'white',
        fontWeight: '600',
        paddingHorizontal: 15,
    },
    actionBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    btnOne: {
        width: 55,
        height: 55,
        backgroundColor: '#73678F',
        borderRadius: 50,
    },
    btnTwo: {
        width: 80,
        height: 80,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnThree: {
        width: 55,
        height: 55,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
