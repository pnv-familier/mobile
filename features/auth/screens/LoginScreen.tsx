import { useNavigation } from '@react-navigation/native'
import AppScreen from "../../../components/AppScreen"
import AppText from "../../../components/AppText"

const LoginScreen = () => {
    const navigation = useNavigation<any>()

    return (
        <AppScreen>
            <AppText>Login Screen</AppText>
            <AppText onPress={() => navigation.navigate('Register')}>
                Go to Register
            </AppText>
        </AppScreen>
    )
}

export default LoginScreen
