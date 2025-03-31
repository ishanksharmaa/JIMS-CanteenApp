import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useCallback } from "react";

const RefreshCompo = ({ name, onRefresh }) => {
    const navigation = useNavigation();

    // Tab press pe refresh
    useEffect(() => {
        const unsubscribe = navigation.addListener("tabPress", (e) => {
            if (e.target.includes(name)) {
                onRefresh();
            }
        });
        return unsubscribe;
    }, [navigation, name]);

    // Screen focus pe refresh
    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    return null;
};

export default RefreshCompo;
