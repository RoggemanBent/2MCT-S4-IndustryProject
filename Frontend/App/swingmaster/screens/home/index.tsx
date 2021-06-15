import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from '@expo/vector-icons/Ionicons';

import Profile from './profile';
import Home from './home';
import Gallery from './gallery/index';

import CameraIcon from '../../assets/icons/camera';
import GalleryIcon from '../../assets/icons/gallery';
import ProfileIcon from '../../assets/icons/profile';

const Tab = createBottomTabNavigator();

const Index = ({ navigation }: any) => {
  const customTabOptions = ({ route }: any) => ({
    tabBarIcon: ({ focused, color, size }: any) => {
      let iconName: any;

      if (route.name === 'Home') {
        return <CameraIcon color={color} />;
      } else if (route.name === 'Gallery') {
        return <GalleryIcon color={color} />;
      } else if (route.name === 'Profile') {
        return <ProfileIcon color={color} />;
      } else {
        iconName = 'warning';
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  });
  return (
    <Tab.Navigator
      screenOptions={customTabOptions}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#8CA62E',
        inactiveTintColor: '#EBEEF2',
        tabStyle: {
          backgroundColor: '#2F2F2F',
        },
        safeAreaInsets: {
          bottom: 0,
        },
        style: {
          backgroundColor: '#2F2F2F',
          borderTopWidth: 0,
        },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Gallery" component={Gallery} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Index;
