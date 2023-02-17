import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import {
    ACCOUNT_UPDATE,
} from "../redux/actions/index";

import {REACT_APP_SIGN_KEY} from '@env';
import WalletService from "../services/walletService";
import Web3 from "web3";
import {Image, Pressable, Text, View, Modal} from "native-base";
import {LinearGradient} from "expo-linear-gradient";

const MetamaskImg = require('../../assets/icons/metamask.svg');

const WalletManager = (props: any) => {

    const dispatch = useDispatch();

    const { account, activate } = useWeb3React();

    useEffect(() => {
        if (!account) { return }
        if (WalletService.verifySessionIntegrity(account)) {
            {props.onPageChanged('Home')}
            return
        }
        (async () => {
            console.log(activate)
            let web3: any = undefined
            let signature: string = ""
            if ((window as any).ethereum !== undefined) {
                web3 = new Web3((window as any).ethereum)
                try {
                    signature = await web3.eth.personal.sign(REACT_APP_SIGN_KEY, account, "")
                } catch (e) { console.error(e) }
            }

            const result = await WalletService.authWallet(account, signature)

            if (result) {
                dispatch({
                    name: "walletManager",
                    type: ACCOUNT_UPDATE,
                    payload: {
                        account,
                    },
                });
                {props.onPageChanged('Home')}
            }
        })()
    }, [account])

    const [showModal, setShowModal] = useState(false);



    // get wallets user can switch too, depending on device/browser
    function getContent() {
        const isMetamask =
            (window as any).ethereum && (window as any).ethereum.isMetaMask;

        console.log(isMetamask);
        return (<View>
            <Modal borderRadius={'15'} isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px" bg='#3e2f70'>
                    <Modal.Body>
                        <View flexDirection='row' justifyContent='space-between' alignItems='center' my='1' mx='3'>
                            <Image src={MetamaskImg} style={{resizeMode:"contain"}} w={'10'} h="full"></Image>
                            <Text color="white" fontSize={'lg'}>Please Install MetaMask</Text>
                        </View>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {isMetamask?
            <Pressable>
                {({isHovered, isPressed,isFocused}) => {
                    return <LinearGradient
                        colors={['rgb(56,8,255)', 'rgb(7,125,255)']}
                        start={[0,1]}
                        end={[0,0]}
                        style={{
                            borderRadius: 32,
                            alignContent: "center",
                            justifyContent: "center",
                            padding: 3,
                            transform: [{scale: isPressed ? 0.96 : 1}]
                        }}
                    >
                        <View style={{
                            flexDirection:"row",
                            borderRadius:32,
                        }}
                              justifyContent="space-between"
                              bg={isPressed? "darkBlue.900" :"#15122b"}
                              px={["5","10","30","50"]}
                              py={"2"}>
                            <Text fontSize={["xl","2xl","3xl","4xl"]} color="rgb(136,127,164)">MetaMask</Text>
                            <Image src={MetamaskImg} style={{resizeMode:"contain"}} w={["6","8","10","12"]} h="full" ></Image>
                        </View>
                    </LinearGradient>
                }}
            </Pressable>
            :<Pressable  onPress={() => {
                setShowModal(true)
            }}>
                {({isHovered, isPressed,isFocused}) => {
                    return <LinearGradient
                        colors={['rgb(56,8,255)', 'rgb(7,125,255)']}
                        start={[0,1]}
                        end={[0,0]}
                        style={{
                            borderRadius: 32,
                            alignContent: "center",
                            justifyContent: "center",
                            padding: 3,
                            transform: [{scale: isPressed ? 0.96 : 1}]
                        }}
                    >
                        <View style={{
                            flexDirection:"row",
                            borderRadius:32,
                        }}
                              justifyContent="space-between"
                              bg={isPressed? "darkBlue.900" :"#15122b"}
                              px={["5","10","30","50"]}
                              py={"2"}>
                            <Text fontSize={["xl","2xl","3xl","4xl"]} color="rgb(136,127,164)">Install MetaMask</Text>
                            <Image src={MetamaskImg} style={{resizeMode:"contain"}} w={["6","8","10","12"]} h="full" ></Image>
                        </View>
                    </LinearGradient>
                }}
            </Pressable>}
        </View>);
    }

    return <>{getContent()}</>;
}

export default WalletManager;
