import React,{useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  Box,
  Icon,
  Button,
} from 'native-base';

import { StyleSheet} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useWeb3React } from "@web3-react/core";
import { useWalletContract } from "../hooks/useWalletContract";

const Logo = require('../../assets/logo.svg');

import ModalDeposit from './ContractBalance/ModalDeposit';
import ModalWithdraw from './ContractBalance/ModalWithdraw';

const CustomSidebarMenu = (props: any) => {
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  const { account } = useWeb3React();
  const {balance, refreshBalanceContract} =  useWalletContract();

  useEffect(()  => {
        refreshBalanceContract();
  }, [account])

  return (
    <View style={{flex: 1}} bg="rgb(32,27,64)" >
      <ModalDeposit depositModalVisible={depositModalVisible} setDepositModalVisible={setDepositModalVisible} />
      <ModalWithdraw withdrawModalVisible={withdrawModalVisible} setWithdrawModalVisible={setWithdrawModalVisible} />

      {/*Top Large Image */}
      <Image
        source={Logo}
        style={styles.sideMenuProfileIcon}
      />
      <Text textAlign={"center"} fontSize="sm" color="#aba1ca" my={"2"}> Cloud Contract Balance</Text>
      <Box bg="black" borderRadius={"32"} mx="10" alignItems={"center"} justifyContent="space-between" flexDirection={"row"} px="3" py="1">
        <Text  fontSize="xl" color="white" bold>{balance.amount}</Text>
        <Text  fontSize="xs" color="#aba1ca" >GLQ</Text>
      </Box>
      <Box  alignItems={"center"} justifyContent="center" mx="10" my="2" flexDirection={"row"}>
        <Button onPress={()=> {setDepositModalVisible(true);}} borderRadius={"32"} endIcon={<Icon as={Ionicons} name="arrow-up-circle" size="sm" color="rgb(32,27,64)"/>} bg="darkBlue.900" mr="2" w="50%">
          Deposit
        </Button>
        <Button onPress={()=> {setWithdrawModalVisible(true);}} borderRadius={"32"} endIcon={<Icon as={Ionicons} name="arrow-down-circle" size="sm" color="rgb(32,27,64)" />} bg="darkBlue.900" w="50%" ml="2">
          Withdraw
        </Button>
      </Box>
      <DrawerContentScrollView {...props} >
        <DrawerItemList {...props} style={{margin:5, backgroundColor: 'white'}}/>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'contain',
    width: 200,
    height: 50,
    alignSelf: 'center',
  }
});

export default CustomSidebarMenu;
