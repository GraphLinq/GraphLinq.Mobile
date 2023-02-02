import React from "react";
import {
  Text,
  Link,
  Heading,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Box,
  Image,
  Divider,
  Container,
  View,
} from "native-base";

import { Dimensions} from 'react-native';

import WalletManager from "../components/WalletManager";

const LinearGradient = require('expo-linear-gradient').LinearGradient ;

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const Logo = require('../../assets/logo.svg');

const theme = extendTheme({
  shadows:{
    "1": {
      "box-shadow": "0 0 35px rgba(56,8,255,0.1), 0 0 15px rgb(7,125,255,0.3), 0 0 0 1px rgb(7,125,255,0.3)"
    },
    "0": {
      "box-shadow": "0 0 35px rgba(0,0,0,.1), 0 0 15px rgba(0,0,0,.3), 0 0 0 1px rgba(0,0,0,.3)"
    }
  }
});

const config = {
  dependencies: {
    'linear-gradient': LinearGradient
  }
};

export default function Auth(props) {
  return (
    <NativeBaseProvider config={config} theme={theme}>
      <Container flex="1">
        <View bg="darkBlue.900"  width={windowWidth}
        height={windowHeight}
        alignItems={"center"} flexDirection="column">
          <Heading  py={"5"}>
            <Image
              src={Logo}
              width={windowWidth*0.6}
              maxWidth={"640"}
              height={"full"}
              maxHeight={"150"}
              style={{resizeMode:"contain"}}
            />
          </Heading>

          <Box
            borderRadius={["32","32","36"]}
            overflow="hidden"
            maxW={'400'}
            width={windowWidth*0.9}
            h={windowHeight*0.7}
            bg={{ linearGradient:{
              colors: ['#1d1938', '#15122b'],
              start:[0,0],
              end:[1,0]
            }}}
            shadow="0"
            >
            <Box bgColor="rgb(32,27,64)" textAlign={"center"} py={"5"}>
              <VStack >
                <Text
                bold
                fontSize={["lg","1xl","2xl","3xl","4xl"]}
                color="white">
                Dashboard Access
                </Text>
                <Text
                fontSize={["xs","sm","md","md","lg"]}
                color="gray.500">
                Connect your wallet to access your dashboard
                </Text>
              </VStack>
            </Box>
            <Divider bg={{ linearGradient:{
              colors: ['rgb(56,8,255)', 'rgb(7,125,255)'],
              start:[0,0],
              end:[1,0]
            }}}
            alignSelf="center"/>
            <WalletManager onPageChanged={props.onPageChanged}/>
          </Box>
          <View flexDirection={"row"} justifyContent={"center"}
            h={windowHeight*0.2}
          >
            <Text fontSize={["xs","sm","md","lg"]} color="#aba1ca"> New to GraphLinq Wallet? </Text>
            <Link href="https://docs.graphlinq.io/wallet">
              <Text color="blue.500" underline fontSize={["xs","sm","md","lg"]}>
                Learn more
              </Text>
            </Link>
          </View>
        </View>
      </Container>
    </NativeBaseProvider>
  );
}

