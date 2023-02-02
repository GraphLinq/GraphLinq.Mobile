import React,{ useState} from "react";
import {
  NativeBaseProvider,
  View,
  Icon,
} from "native-base";

import { Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import { createDrawerNavigator }
         from '@react-navigation/drawer';
import { NavigationContainer }
         from '@react-navigation/native';

// Component
import Template from './Template';
import Graphs from './Graphs';
import Wallets from './Wallets';

import CustomSidebarMenu from "../components/SideBarMenu";
import Header from '../components/Header/Header.js'

const Drawer = createDrawerNavigator();

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const DrawerItems=[
  {
    id:"1",
    name: 'Home',
    iconName: 'home-outline'
  },
  {
    id:"2",
    name: 'My Graphs',
    iconName: 'grid-outline'
  },
  {
    id:"3",
    name: 'My Wallets',
    iconName: 'albums-outline'
  }
]

const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <CustomSidebarMenu {...props} />}>
        {DrawerItems.map(drawer =>
          <Drawer.Screen
            key={drawer.id}
            name={drawer.name}
            options={{
              drawerInactiveTintColor: "white",
              drawerActiveTintColor: '#aba1ca',
              drawerIcon:({focused})=>
              <Icon as={Ionicons} name={drawer.iconName} size={5} color={focused ? "rgb(7,125,255)" : "#aba1ca"}/>,
              headerShown:true,
                header: () => {
                 return (
                    <Header/>
                  );
                }
            }}
            component={
              drawer.name==='Home' ? Template
              : drawer.name==='My Graphs' ? Graphs
              : Wallets
            }
          />)
        }
      </Drawer.Navigator>
    </NavigationContainer>
  )
};

export default function Home(props: any) {
  return (
    <NativeBaseProvider>
      <View bg="darkBlue.900" w={windowWidth} h={windowHeight} flex="1">
        <Navigation/>
      </View>
    </NativeBaseProvider>
  );
}

