import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Camera = ({ color }: any) => {
  return (
    <Svg width="39.252" height="39.252" viewBox="0 0 39.252 39.252">
      <Path
        d="M30.126,13.881a1.727,1.727,0,0,1,2.4.2,1.777,1.777,0,0,1,.4,1v9.8a1.634,1.634,0,0,1-1.8,1.6,1.777,1.777,0,0,1-1-.4l-4.5-3.8a1.656,1.656,0,0,1-.5-1.2v-2.3a1.433,1.433,0,0,1,.5-1.1Z"
        fill={color}
      />
      <Path
        d="M6.326,15.781a4.078,4.078,0,0,1,4.2-4.1h8.5a4.14,4.14,0,0,1,4.2,4.1v7.7a4.225,4.225,0,0,1-4.2,4.2h-8.5a4.14,4.14,0,0,1-4.2-4.1Z"
        fill={color}
      />
      <Path
        d="M19.626,0A19.626,19.626,0,1,0,39.252,19.626,19.626,19.626,0,0,0,19.626,0Zm0,35.416a15.79,15.79,0,1,1,15.79-15.79A15.79,15.79,0,0,1,19.626,35.416Z"
        fill={color}
        fill-rule="evenodd"
      />
    </Svg>
  );
};

export default Camera;
