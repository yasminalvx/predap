import React from 'react';
import { View, Image } from 'react-native';

interface IconProps {
    name: string;
    size?: number;
    color?: string;
}


const Icons: React.FC<IconProps> = ({ name, size = 24, color = 'white' }) => {
    return (
        {
            'check-circle': (
                <Image
                    style={{ width: size, height: size, tintColor: color }}
                    source={require("@/assets/images/circle-check-solid.svg")}
                />
            ),
            'clock-o': (
                <Image
                    style={{ width: size, height: size, tintColor: color }}
                    source={require("@/assets/images/clock-solid.svg")}
                />
            ),
            'play-circle': (
                <Image
                    style={{ width: size, height: size, tintColor: color }}
                    source={require("@/assets/images/circle-play-solid.svg")}
                />
            ),
            'home': (
                <Image
                    style={{ width: size, height: size, tintColor: color }}
                    source={require("@/assets/images/house-solid.svg")}
                />
            ),
            'pause': (
                <Image
                    style={{ width: size, height: size, tintColor: color }}
                    source={require("@/assets/images/pause-solid.svg")}
                />
            ),
            'play': (
                <Image
                    style={{ width: size - 5, height: size, tintColor: color }}
                    source={require("@/assets/images/play-solid.svg")}
                />
            )
        }[name] || <View>{name}</View>
    );
};

export default Icons;