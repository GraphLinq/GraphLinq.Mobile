import React from "react";
import {
  Text,
  HStack,
  Pressable,
  View,
  Icon,
} from "native-base";

const LinearGradient = require('expo-linear-gradient').LinearGradient ;

const PageHeader = (props : any) => {
    return <HStack mb="5" justifyContent={"space-between"} alignItems="center">
        <Text fontSize={"xl"} color="white" textAlign={"center"} bold>{props.title}</Text>
        <Pressable onPress={props.eventChanged}>
            {({isPressed}) => {
                return <LinearGradient
                    colors={['rgb(56,8,255)', 'rgb(7,125,255)']}
                    start={[0,0]}
                    end={[1,0]}
                    style={{
                    borderRadius: 32,
                    alignContent: "center",
                    transform: [{scale: isPressed ? 0.95 : 1}]
                    }}
                >
                <View style={{flexDirection:"row", borderRadius:32}} alignItems={"center"} justifyContent="center">
                    <Text textAlign={"center"} flex="5" color="white" fontSize={["sm","md","lg"]} mx="2" bold>{props.buttonName}</Text>
                    <Icon flex="1" as={props.iconAs} name={props.iconName} size={"3"} color="white" mr="3"/>
                </View>
            </LinearGradient>
            }}
        </Pressable>
    </HStack>
};

export default PageHeader;
