import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WavyHeader: React.FC = () => {
  return (
    <View style={{ backgroundColor: "#3366FF", height: 160 }}>
      <Svg
        height="70%"
        width="100%"  // Ensure the width matches the screen width
        viewBox="0 0 1440 320"
        style={{ position: "absolute", top: 130 }}
      >
        <Path
          fill="#3366FF"
          d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </Svg>
    </View>
  );
};

export default WavyHeader;
