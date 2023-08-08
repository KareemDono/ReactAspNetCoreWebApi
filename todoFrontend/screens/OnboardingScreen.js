import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { setItem } from '../utils/asyncStorage';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = ()=>{
        navigation.navigate('Home');
        setItem('onboarded', '1');
    }

    const doneButton = ({...props})=>{
        return (
            <TouchableOpacity style={styles.doneButton} {...props}>
                <Text>Done</Text>
            </TouchableOpacity>
        )
        
    }
  return (
    <View style={styles.container}>
      <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
            // bottomBarHighlight={false}
            DoneButtonComponent={doneButton}
            containerStyles={{paddingHorizontal: 15}}
            pages={[
                {
                    backgroundColor: '#818cf8',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/secondanimation.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Welcome to MyShop! 🛒',
                    subtitle: 'Step into a world of seamless shopping with ShopEase. We bring you an exquisite selection of products, unbeatable deals, and a user-friendly interface to make your shopping experience unforgettable.',
                },
                {
                    backgroundColor: '#fef3c7',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/firstanimation.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Stay Updated with MyShop ⌛',
                    subtitle: "Never miss out on the latest trends, exclusive offers, and exciting promotions. Allow ShopEase to keep you informed and engaged with regular updates, ensuring you're always in the know about the hottest deals and newest arrivals.",
                },
                {
                    backgroundColor: '#a78bfa',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/thirdanimation.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Secure and Fast Checkout 💳',
                    subtitle: 'Shop with confidence knowing your transactions are safe and protected. ShopEase offers a secure and hassle-free checkout process, allowing you to complete your purchases swiftly and conveniently.',
                },
            ]}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    lottie:{
        width: width*0.9,
        height: width
    },
    doneButton: {
        padding: 20,
        // backgroundColor: 'white',
        // borderTopLeftRadius: '100%',
        // borderBottomLeftRadius: '100%'
    }
})