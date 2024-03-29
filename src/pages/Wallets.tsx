import React,{useEffect, useState} from "react";
import {
    Text,
    Link,
    HStack,
    VStack,
    Box,
    ScrollView,
    View,
    Button,
    Icon,
    Input,
    NativeBaseProvider,
    useClipboard,
    Stack,
    Spinner,
    Spacer, extendTheme
} from "native-base";

import { Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import WalletCreation from "../components/Wallets/WalletCreation";
import WalletService from "../services/walletService";
import { useDispatch, useSelector } from "react-redux";
import { WALLET_UPDATE } from "../redux/actions";
import { useWeb3React } from "@web3-react/core";
import { ManagedResponse } from "../providers/responses/managed";
import Clipboard from '@react-native-clipboard/clipboard';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const LinearGradient = require('expo-linear-gradient').LinearGradient ;


const Wallets = (props: any) => {
    const [reachable, setReacheable] = useState(true);
    const { account } = useWeb3React();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [ hasCopied, onCopy ] = useState("Copy");

    const walletList: ManagedResponse[] = useSelector((state: any) => state.modals.wallets.list);

    const loaded: boolean = useSelector((state: any) => state.modals.wallets.loaded);

    useEffect(() => {
        const refreshfnc = async () => {
            const wallets: ManagedResponse[] | undefined = await WalletService.listWallets();
            if (wallets === undefined) {
                return setReacheable(false);
            }
            dispatch({
                name: "wallets",
                type: WALLET_UPDATE,
                payload: { wallets, loaded: true },
            });

            setTimeout(refreshfnc, 10000);
        };

        refreshfnc();
    }, [account]);

    return (
        <View style={{ flex: 1}} justifyContent="space-between" bg="darkBlue.900" width={windowWidth} height={windowHeight}  >
            <ScrollView flexDirection={"column"} p={["7","10"]}>
                <HStack justifyContent={'space-between'} alignItems='center' mb='3' maxW={'400'}>
                    <Text fontSize={"xl"} color="white" textAlign={"center"} bold mb='3'>My Wallets</Text>
                    <WalletCreation setSuccess={setSuccess} setError={setError}/>
                </HStack>

                {reachable && !loaded &&
                <Stack w='100' justifyContent={'center'} alignItems='center' alignSelf='center' mt='50' maxW={'400'}>
                    <Spinner
                    color="#2334ff"
                    size="md"
                    />
                </Stack>
                }
                {walletList.length == 0 && loaded && (
                    <View flexDirection='row' justifyContent='center' alignItems='center' bg='rgb(32,27,64)' borderRadius={'32'} p='3' my='1' maxW={'400'}>
                        <Icon as={Ionicons} name="warning-outline" color='yellow.600' size='sm' mr='2'/>
                        <Text color='white' fontSize={'sm'}>You don't have any managed wallet yet.</Text>
                    </View>
                )}
                {error && (
                    <View maxW={'400'} textAlign='center' flexDirection='row' justifyContent='center' alignItems='center' bg='rgb(32,27,64)' borderRadius={'32'} p='3' my='1'>
                        <Icon as={FontAwesome} name="times-circle" color='#ff294c'  size='md' mr='2'/>
                        <Text color="white" fontSize={'sm'}>{error}</Text>
                    </View>
                )}
                {success && (
                <>
                    <View maxW={'400'} textAlign='center' flexDirection='row' justifyContent='center' alignItems='center'  bg='rgb(32,27,64)' borderRadius={'32'} p='3' my='1'>
                        <Icon as={FontAwesome} name="check-circle" color='#59b819' size='md' mr='2'/>
                        <Text color='white' fontSize={'sm'}>Wallet created !</Text>
                    </View>
                    <View maxW={'400'} textAlign="left" flexDir="column" flexWrap="nowrap" justifyContent='center' alignItems='center'  bg='rgb(32,27,64)' borderRadius={'32'} p='3' my='1'>
                        <Icon as={FontAwesome} name="info-circle" color='rgb(32,27,64)' size='md' mr='2'/>
                        <Text color='white' fontSize={'sm'}>Please save your private key as it won't be available again and therefore encrypted in our network.</Text>
                        <Box w="full" my='3' justifyContent={'center'} alignItems='center'>
                            <Input
                                variant="unstyled"
                                bgColor="#09081280"
                                h="10"
                                py="2"
                                px="3"
                                rounded="xl"
                                type="text"
                                w="90%"
                                value={success}
                                isReadOnly
                                color={'white'}
                                my='3'
                            />
                            <Button onPress={()=> {onCopy("Copied"); Clipboard.setString(success);}} bg='darkBlue.900' w='80%'>
                                {hasCopied}
                            </Button>
                        </Box>
                    </View>
                </>
                )}
                {walletList.length > 0 && (
                <VStack maxW={'400'}>
                    <Box display="flex" alignItems="center" w="full" px="2" py="3" rounded="lg" flexDirection={'row'}>
                        <Box display="flex" width="25%" px={2}>
                            <Text color="#aba1ca" fontSize={"md"}>Wallet name</Text>
                        </Box>
                        <Box display="flex" width={["30%", "55%"]} px={2}>
                            <Text color="#aba1ca" fontSize={"md"} >Address</Text>
                        </Box>
                        <Spacer />
                        <Box display="flex" width="20%">
                            <Text color="#aba1ca" fontSize={"md"} numberOfLines={2}>Ether Amount</Text>
                        </Box>
                    </Box>
                    {walletList.map((wallet: any, i: number) => {
                        return (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                bg="rgb(32,27,64)"
                                w="full"
                                px="2"
                                py="3"
                                rounded="lg"
                                mb={4}
                                key={`${wallet.walletId}-${i}`}
                                flexDir='row'
                            >
                                <Text width="25%" px={2} color='white' fontSize={"sm"}>
                                    {wallet.name}
                                </Text>
                                <Box display="flex" width={["30%", "55%"]} px={2} alignItems="center" flexDirection={'row'}>
                                    <Text fontSize='sm' color='white' flex='1' isTruncated>
                                        <Link href={`https://etherscan.io/address/${wallet.publicKey}`}  isUnderlined={false} isExternal>
                                            {wallet.publicKey}
                                        </Link>
                                    </Text>
                                    <Icon as={Ionicons} name={"open-outline"} size="sm" color="#aba1ca" mx="4px" />
                                </Box>
                                <Spacer />
                                <Text width="20%" px={2} color='white' fontSize={"sm"}>
                                    {wallet.balance} ETH
                                </Text>
                            </Box>
                            )
                        }
                    )}
                </VStack >
                )}
            </ScrollView>
        </View>
    )
}

export default Wallets;
