import React,{useState, useEffect} from 'react';
import {
  View,
  Text,
  Link,
  Box,
  Icon,
  Modal,
  IconButton,
  Pressable,
  Stack,
  Input,
  HStack
} from 'native-base';

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useActiveWeb3React } from '../../hooks';
import WalletService from '../../services/walletService';
import { ResponseSuccess } from '../../providers/responses/success';
import { useWalletContract } from '../../hooks/useWalletContract';

const LinearGradient = require('expo-linear-gradient').LinearGradient ;

const ModalWithdraw = (props:any) => {
    const { account } = useActiveWeb3React()
    const [dueBalance, setDueBalance] = useState(0)
    const [amountWithdraw, setAmountWithdraw] = useState("0.0");
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    const {refreshBalanceContract} =  useWalletContract();

    const format = (val: string) => val + ` GLQ`;
    const parse = (val: string) => val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');

    useEffect(() => {
        const getCloudBalance = async () => {
            try {
                const result = await WalletService.getBalance(account ?? "")
                if (result?.due_balance) {
                    setDueBalance(result.due_balance)
                }
            } catch (e) {
                console.error(e)
            }
        }
        getCloudBalance()
    }, [account])

    async function doWithdraw()
    {
        const asNumber: number = parseFloat(amountWithdraw)
        if (asNumber <= 0) {
            setError(`Invalid amount to withdraw from the balance contract: ${asNumber} GLQ`)
            return
        }

        setPending("Pending, waiting for server response...")
        const result: ResponseSuccess | String = await WalletService.withdraw(asNumber)
        if (result instanceof String) {
            setPending(""); setError(result.toString());
            return;
        }
        if (result.success) {
            setPending("")
            setError("")
            setSuccess(result.hash)
        }

        setTimeout(() => {
            refreshBalanceContract()
        }, 1000)
    }

    const handleChange = (text : string) => setAmountWithdraw(parse(text));

    return (
        <Modal isOpen={props.withdrawModalVisible} onClose={props.setWithdrawModalVisible} size={"lg"}  >
          <Modal.Content maxH="450" borderRadius="15">
            <Modal.Header bg="rgb(32,27,64)" borderColor={"rgb(32,27,64)"}>
              <Text color="white" textAlign={"center"} fontSize="xl">Cloud Balance Withdraw</Text>
            </Modal.Header>
            <Modal.Body bg="rgb(32,27,64)" alignItems={"center"} justifyContent='center'>
              <Stack m='1'>
                {error &&
                  <View flexDirection='row' justifyContent='center' alignItems='center' bg='#3e2f70' borderRadius={'32'} p='3' my='1' mx='3' w='95%'>
                    <Icon as={FontAwesome} name="times-circle" color='#ff294c'  size='md' mr='2'/>
                    <Text color="white" fontSize={'sm'} numberOfLines={2}>{error}</Text>
                  </View>
                }
                {!success && pending &&
                  <View  textAlign='center' flexDirection='row' justifyContent='center' alignItems='center' bg='#3e2f70' borderRadius={'32'} p='3' my='1' mx='3' w='95%'>
                    <Icon as={FontAwesome} name="info-circle" color='rgb(32,27,64)' size='md' mr='2'/>
                    <Text color="white" fontSize={'sm'}>{pending}</Text>
                  </View>
                }
                {success &&
                  <View textAlign='center' flexDirection='row' justifyContent='center' alignItems='center'  bg='#3e2f70' borderRadius={'32'} p='3' my='1' mx='3' w='95%'>
                    <Icon as={FontAwesome} name="check-circle" color='#59b819' size='md' mr='2'/>
                    <Text color='white' fontSize={'sm'}>Deposit successfully completed ! </Text>
                    <Text color='white' fontSize='sm'>Transaction hash : <Link href={`https://etherscan.com/tx/${success}`} isExternal isUnderlined={false} _text={{fontSize:'xs'}}>{success}</Link></Text>
                  </View>
                }
                <View textAlign='center' flexDirection='column' justifyContent='center' alignItems='center' bg='#3e2f70' borderRadius={'32'} p='3' m='3'  w='95%'>
                  <Icon as={FontAwesome} name="info-circle" color='darkBlue.900' size='2xl'/>
                  <Text color='white'>You currently have <b>{dueBalance} GLQ</b> of execution cost from executed graphs to burn.</Text>
                </View>

                <Box bg="black" borderRadius={"32"} mx="3" flexDirection={"row"} alignItems="center" justifyContent={"space-between"} w="95%">
                  {/* <Text color="white" fontSize={"xl"} ml="5">{amountWithdraw} GLQ</Text> */}
                  <Input color='white' value={amountWithdraw} fontSize='xl' variant={'unstyled'} bg='transparent' size='sm' flex='7' onChangeText={handleChange}/>
                  <HStack flex='3' justifyContent={'right'} alignItems='center'>
                    <Text textAlign={'center'} color='white' fontSize="xl" bg='transparent' mr='2'>GLQ</Text>
                    <Box flexDirection={"column"} borderLeftColor={"rgb(32,27,64)"} borderLeftWidth="1">
                      <IconButton variant={"ghost"} borderTopRightRadius="32" h="5" w="5"
                      icon={<Icon as={Ionicons} name="caret-up" /> }
                      _icon={{color:"rgb(32,27,64)", size:"sm"}}
                      _pressed={{backgroundColor:"white"}}
                      onPress={() => {
                        let currentAmount = parseFloat(amountWithdraw);
                        currentAmount += 0.1;
                        setAmountWithdraw(currentAmount.toString());
                      }}
                      />
                      <IconButton variant={"ghost"} borderBottomRightRadius="32" h="5" w="5"
                      icon={<Icon as={Ionicons} name="caret-down" />}
                      _icon={{color:"rgb(32,27,64)", size:"sm"}}
                      _pressed={{backgroundColor:"white"}}
                      onPress={() => {
                        let currentAmount= parseFloat(amountWithdraw);
                        if(currentAmount > 0.0){
                          currentAmount -= 0.1;
                          setAmountWithdraw(currentAmount.toString());
                        }
                      }}
                      />
                    </Box>
                  </HStack>
                </Box>

                <Pressable mt="5" onPress={doWithdraw} w='70%' justifyContent={'center'} alignItems='center' alignSelf={'center'}>
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
                            justifyContent="center"
                            alignItems={"center"}
                        >
                        <View mx='10' style={{borderRadius:32}}  justifyContent="center" p="2" alignItems={'center'} textAlign='center'>
                          <Text textAlign={"center"} color="white" fontSize={"sm"} bold>Withdraw</Text>
                        </View>
                    </LinearGradient>
                    }}
                </Pressable>
              </Stack>

            </Modal.Body>
          </Modal.Content>
      </Modal>
    );
};

export default ModalWithdraw;
