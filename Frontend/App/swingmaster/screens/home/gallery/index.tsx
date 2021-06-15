import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Gallery from './gallery';
import Detail from './detail';

const Stack = createStackNavigator();

const Index = ({ navigation }: any) => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Gallery" component={Gallery} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
};

export default Index;
