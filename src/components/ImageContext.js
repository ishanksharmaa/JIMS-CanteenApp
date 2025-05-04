// ImageContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
    const [profileImage, setProfileImage] = useState(null);

    // Load saved image on app start
    useEffect(() => {
        const loadImage = async () => {
            try {
                const savedImage = await AsyncStorage.getItem('profileImage');
                if (savedImage) setProfileImage(savedImage);
            } catch (error) {
                console.log('Error loading image:', error);
            }
        };
        loadImage();
    }, []);

    // Update function that saves to both state and storage
    const updateProfileImage = async (newImage) => {
        setProfileImage(newImage);
        try {
            if (newImage) {
                await AsyncStorage.setItem('profileImage', newImage);
            } else {
                await AsyncStorage.removeItem('profileImage');
            }
        } catch (error) {
            console.log('Error saving image:', error);
        }
    };

    return (
        <ImageContext.Provider value={{ profileImage, setProfileImage: updateProfileImage }}>
            {children}
        </ImageContext.Provider>
    );
};

// Must export the hook like this
export const useImage = () => {
    const context = useContext(ImageContext);
    if (!context) {
        throw new Error('useImage must be used within an ImageProvider');
    }
    return context;
};