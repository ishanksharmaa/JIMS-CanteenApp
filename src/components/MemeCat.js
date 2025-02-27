import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

const MemeCat = ({ available, active, onTouch, isMemeCatsEnabled }) => {
    // if (!isMemeCatsEnabled || !available) return null;

    const animX = useRef(new Animated.Value(100)).current;
    const animY = useRef(new Animated.Value(100)).current;
    let speedX = useRef(3);
    let speedY = useRef(3);
    const [isMoving, setIsMoving] = useState(true);

    useEffect(() => {
        if (!active) return;

        const moveCat = () => {
            if (!isMoving) return;
            
            let newX = animX._value + speedX.current;
            let newY = animY._value + speedY.current;

            if (newX <= 0 || newX >= width - 80) speedX.current *= -1;
            if (newY <= 0 || newY >= height - 80) speedY.current *= -1;

            Animated.timing(animX, {
                toValue: newX,
                duration: 16,
                useNativeDriver: false,
            }).start();

            Animated.timing(animY, {
                toValue: newY,
                duration: 16,
                useNativeDriver: false,
            }).start();
        };

        let moveInterval = setInterval(moveCat, 16);
        let toggleInterval = setInterval(() => setIsMoving((prev) => !prev), 2000);

        return () => {
            clearInterval(moveInterval);
            clearInterval(toggleInterval);
        };
    }, [active, isMoving]);

    if (!available) return null;

    return (
        <Animated.View style={{ position: "absolute", left: animX, top: animY, zIndex: 9999 }}>
            <TouchableOpacity onPress={onTouch}>
                <FastImage 
                    source={isMoving ? require("../../assets/meme_cat.gif") : require("../../assets/meme_cat_static.png")}
                    style={{
                        width: isMoving ? 80 : 100,   // PNG (static) ka size bada
                        height: isMoving ? 80 : 100,
                    }} 
                    resizeMode={FastImage.resizeMode.contain}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default MemeCat;
