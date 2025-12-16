import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const layout = () => {
    return (
        <Stack>
            <Stack.Screen name="first" options={{
                headerShown:false
            }}/>
            <Stack.Screen name="second" options={{
                headerShown:false
            }}/>
        </Stack>
    )
}

export default layout;
