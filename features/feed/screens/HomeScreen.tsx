import AppButton from "../../../components/AppButton";
import AppScreen from "../../../components/AppScreen";
import AppText from "../../../components/AppText";
import { useLogout } from "../../auth/hooks/useLogout";

const HomeScreen = () => {
    const { logout } = useLogout();

    return (
        <AppScreen>
            <AppText>Home Screen</AppText>
            <AppButton title="Logout" onPress={logout} />
        </AppScreen>
    );
};

export default HomeScreen;