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

export const _deleteThePage = async () => {
    try {
        await AsyncStorage.removeItem('@the_page')
    } catch (e) {
        // saving error
    }
}

export const _storeThePage = async (location) => {
    try {
        _deleteThePage()
        await AsyncStorage.setItem('@the_page', String(location))
    } catch (e) {
        // saving error
    }
}

export const _getThePage = async () => {
    try {
        const response = await AsyncStorage.getItem('@the_page')
        console.log(response)
        return response;
    } catch (e) {
        // saving error
    }
}