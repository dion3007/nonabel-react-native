import AsyncStorage from '@react-native-async-storage/async-storage';

export const _storeUserData = async (value) => {
    try {
        await AsyncStorage.setItem('@user_data', JSON.stringify(value))
    } catch (e) {
        // saving error
    }
}

export const _retrieveUserData = async () => {
    try {
        const response = await AsyncStorage.getItem('@user_data')
        return JSON.parse(response)
    } catch (e) {
        // saving error
    }
}

export const _deleteUserData = async () => {
    try {
        await AsyncStorage.removeItem('@user_data')
    } catch (e) {
        // saving error
    }
}