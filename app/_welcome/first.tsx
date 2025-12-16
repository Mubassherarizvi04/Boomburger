import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const first = () => {

  const route = useRouter();

  return (
    <View>
      <ImageBackground
        source={require("../../assets/images/welcome-bg.png")}
      >
        <View style={style.container}>
          <Text style={style.bombText}>Feel Bomb</Text>
          <TouchableOpacity style={style.startBtn} onPress={()=>route.push('/_welcome/second')}>
            <Text style={{color:'white',fontSize:18,fontWeight:600}}>Get Started</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30
    // backgroundColor: "red"
  },
  bombText: {
    fontSize: 25,
    fontWeight: 700,
    color: '#E62973'
  },
  startBtn:{
    width:'90%',
    height:55,
    backgroundColor:'black',
    marginTop:15,
    borderRadius:40,
    alignItems:'center',
    justifyContent:'center'
  }
})

export default first
