import React,{useState} from "react";
import {
  Text,
  Pressable,
  View,
  Button,
  Icon,
  Input,
  Modal,
  FormControl,
  useDisclose
} from "native-base";

import WalletService from "../../services/walletService";
import { Dimensions } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
const LinearGradient = require('expo-linear-gradient').LinearGradient ;

interface WalletCreationProps {
    setError: any
    setSuccess: any
}

 const WalletCreation: React.FC<WalletCreationProps> = (props) =>{
    const { isOpen, onOpen, onClose } = useDisclose();
    const [walletName, setWalletName] = useState("");
    const handleChange = (event: any) => setWalletName(event.target.value)

    const createWallet = async () => {
        props.setSuccess("")
        props.setError("")
        try {
            const result: String | Error = await WalletService.createWallet({
                name: walletName,
            })

            if (result instanceof String) {
                props.setSuccess(result)
                onClose();
            } else {
                props.setError(result)
                onClose();
            }
        }
        catch (e) {
            console.error(e)
            props.setError(`An error occured while creating your wallet: ${e}`)
            onClose();
        }
    }

    return <>
        <Pressable onPress={onOpen}>
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
                    <Text textAlign={"center"} flex="5" color="white" fontSize={["sm","md","lg"]} mx="2" bold>Create Wallet</Text>
                    <Icon flex="1" as={FontAwesome} name={'plus'} size={"3"} color="white" mr="3"/>
                </View>
            </LinearGradient>
            }}
        </Pressable>
        <Modal isOpen={isOpen} onClose={onClose} size={"lg"} borderRadius="32" >
            <Modal.Content maxH="250" borderRadius="15">
                <Modal.CloseButton />
                <Modal.Header bg="rgb(32,27,64)" borderColor={"transparent"}><Text color="#aba1ca" fontSize={"lg"}>More</Text></Modal.Header>
                <Modal.Body bg="rgb(32,27,64)">
                    <FormControl>
                        <FormControl.Label color="#aba1ca" fontSize={"2xl"}>Wallet Name:</FormControl.Label>
                        <Input value={walletName} onChange={handleChange} bg="black" fontSize={"md"} color="white" borderColor={"transparent"} borderRadius="12" m="3"/>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer bg="rgb(32,27,64)" justifyContent={"right"} alignItems="center" borderColor={"transparent"}>
                    <View alignItems={"center"} justifyContent="right" flexDirection={"row"}>
                        <Pressable onPress={createWallet}>
                        {({isPressed}) => {
                            return <LinearGradient
                                colors={['rgb(56,8,255)', 'rgb(7,125,255)']}
                                start={[0,0]}
                                end={[1,0]}
                                style={{
                                    borderRadius: 32,
                                    alignContent: "center",
                                    transform: [{scale: isPressed ? 0.95 : 1}]
                                }}>
                                <View borderRadius="32" alignItems={"center"} justifyContent="center" mx="3" my="1">
                                    <Text color="white" fontSize={"md"} bold>Create</Text>
                                </View>
                            </LinearGradient>
                        }}
                        </Pressable>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {onClose}}>
                            <Text color="#aba1ca" fontSize={"md"} bold>Cancel</Text>
                        </Button>
                    </View>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    </>
}

export default WalletCreation;
