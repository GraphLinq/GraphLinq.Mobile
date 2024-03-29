import React,{useState, useEffect, useContext} from 'react';
import {Icon, Pressable, View, Text,Box,Modal, VStack, NativeBaseProvider, extendTheme, Menu, Link} from 'native-base';
import {StyleSheet, Dimensions} from 'react-native';
import { Entypo,Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {LinearGradient} from "expo-linear-gradient";
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "../../utils/index";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get('screen').width;


export default function Header(props){

  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const menuItems =[{
    id: 1,
    name : "book-outline",
    desc : "Documentation",
      link : "https://docs.graphlinq.io"
  }, {
    id: 2,
    name : "chatbubble-outline",
    desc : "Discord",
      link : "https://discord.gg/w3qG33vNp9"
  }, {
    id: 3,
    name : "chatbox-outline",
    desc : "Telegram",
      link : "https://t.me/graphlinq"
  }
  ];

  function formatCur(num, min, max) {
        const formatConfig = {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: min,
            maximumFractionDigits: max,
            currencyDisplay: "symbol",
        };
        const curFormatter = new Intl.NumberFormat("en-US", formatConfig);

        return curFormatter.format(num);
    }

  const [glqPrice, setGlqPrice] = useState("");
    const refreshGlqPrice = async () => {
        try {
            let response = await fetch("https://api.graphlinq.io/front/token");
            let responseJson = await response.json();
            setGlqPrice(formatCur(responseJson.uni.glqPrice, 0, 5));
        } catch (error) {
            console.error(error);
        }
  };

const navigation = useNavigation();

  useEffect(() => {
    refreshGlqPrice()
  }, []);

  const { account, connector } = useWeb3React();
  let amountBalance = useSelector((state) => state.modals.balance.amount);

  return(
    <View style={headerStyles.container} py="2" px="3" shadow="0">
      <Modal isOpen={detailModalVisible} onClose={setDetailModalVisible} size={"lg"} borderRadius="32" >
        <Modal.Content maxH="250" borderRadius="15">
          <Modal.CloseButton />
            <Modal.Header bg="rgb(32,27,64)" borderColor={"transparent"}><Text color="#aba1ca" fontSize={"lg"}>More</Text></Modal.Header>
            <Modal.Body bg="darkBlue.900">
              {menuItems.map((item) => {
                return <Pressable key={item.name}>
                {({isPressed}) => {
                  return <Box m="2" flexDirection={"row"} justifyContent="left" px="2" alignItems={"center"}  >
                    <Icon as={Ionicons} name={item.name} size="sm" color={"blue.900"}/>
                    <Text color="#aba1ca" fontSize={"xs"} > {item.desc} </Text>
                  </Box>
                }}
              </Pressable>
            })}
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Pressable onPress={()=>navigation.toggleDrawer()}>
        {({isPressed}) => {
          return <LinearGradient
            colors={['rgb(56,8,255)', 'rgb(7,125,255)']}
            start={[0,1]}
            end={[0,0]}
            style={{
              borderRadius: 32,
              alignContent: "center",
              justifyContent: "center",
              padding: 3
              }}>
              <View style={{
                flexDirection:"row",
                borderRadius:32,
                }}>
                <Entypo name="menu" size={30} color="white" />
              </View>
          </LinearGradient>
        }}
      </Pressable>
      <View justifyContent={"center"} flexDirection="row" alignItems={"center"}>
        <Box flexDirection={"column"} bg="black" alignItems={"center"} borderRadius="32" m={"2"} px={'3'} py={"2"}>
            <Text fontSize={"md"} color="#aba1ca">GLQ:</Text>
            <Text fontSize={"sm"} color="#aba1ca" bold>{glqPrice}</Text>
        </Box>
        {account !== undefined && windowWidth>=400 && (
          <VStack>
            <Box bg="black" alignItems={"center"} borderRadius="32" mr={"3"} px={"2"} py={"1"} mb="1" w="100" alignSelf={"center"}>
                <Text fontSize={"md"} color="#aba1ca">{amountBalance} GLQ</Text>
            </Box>
            <Box flexDirection={"column"} bg="black" alignItems={"center"} borderRadius="32" mr={"3"} px={"2"} py={"1"} justifyContent={"center"}>
                <Text fontSize={"xs"} color="#aba1ca">{ shortenAddress(account)}</Text>
            </Box>
          </VStack>
        )
        }
          <Menu my='5' w="170" mx={'3'} bg={'darkBlue.900'} shadow={'1'} trigger={triggerProps => {
              return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                  <Icon size="4xl" as={Ionicons} name={"ellipsis-vertical-circle-outline"} color="#aba1ca" />
              </Pressable>;
          }}>
              {menuItems.map((item) => {
                  return <Menu.Item key={item.id} _focus={{bg:"darkBlue.900"}} _pressed={{bg:"rgb(32,27,64)"}} flexDirection={'row'} alignItems={'center'}>
                              <Icon as={Ionicons} name={item.name} size="md" color={"blue.900"} mr={'3'} my={'1'}/>
                              <Link href={item.link}  isUnderlined={false} isExternal _text={{fontSize:'md', color:'white', flex:'1'}}>{item.desc}</Link>
                      </Menu.Item>
              })}
          </Menu>
      </View>
    </View>
  )
}

const headerStyles=StyleSheet.create({
   container:{
       left:0,
       backgroundColor:'rgb(32,27,64)',
       display:'flex',
       flexDirection:'row',
       alignItems:'center',
       justifyContent:'space-between'
   }
});
