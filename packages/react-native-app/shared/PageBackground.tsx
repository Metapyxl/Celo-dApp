import React from 'react';
import { ImageBackground } from 'react-native'
import Background from './Background.png';

const PageBackground = ({ children }) => {
    return (

        <ImageBackground
            source={Background}
            resizeMode="cover"
            style={{
                width: "100%",
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: "100%",
            }}
        >
            {children}
        </ImageBackground>
    )
};

export default PageBackground