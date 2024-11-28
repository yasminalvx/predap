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
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/circle-check-solid.png")}
                />
            ),
            'clock-o': (
                <Image
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/clock-solid.png")}
                />
            ),
            'play-circle': (
                <Image
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/circle-play-solid.png")}
                />
            ),
            'home': (
                <Image
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/house-solid.png")}
                />
            ),
            'home-menu': (
                <Image
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/house-solid-menu.png")}
                />
            ),
            'home-active': (
                <Image
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/house-solid-menu-active.png")}
                />
            ),
            'pause': (
                <Image
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/pause-solid.png")}
                />
            ),
            'play': (
                <Image
                    style={{ width: size - 5, height: size }}
                    source={require("@/assets/images/icons/play-solid.png")}
                />
            ),
            'settings': (
                <Image
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/cog-solid.png")}
                />
            ),
            'settings-active': (
                <Image
                    style={{ width: size, height: size }}
                    source={require("@/assets/images/icons/cog-solid-active.png")}
                />
            )
        }[name] || <View>{name}</View>
    );
};

export default Icons;