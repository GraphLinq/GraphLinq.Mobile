import React,{useState} from 'react';
import {
  View,
  Text,
  Box,
  Icon,
  Modal,
  IconButton,
  Pressable,
  Input,
  Link,
  HStack
} from 'native-base';
import { useBalanceContract, useTokenContract } from '../../hooks/useContract';
import { useActiveWeb3React } from '../../hooks';
import "@ethersproject/shims";
import { utils } from 'ethers';
import { useBalance } from '../../hooks/useBalance';
import { useWalletContract } from '../../hooks/useWalletContract';
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import {REACT_APP_GRAPHLINQ_TOKEN_CONTRACT, REACT_APP_GRAPHLINQ_BALANCE_CONTRACT} from '@env';

const LinearGradient = require('expo-linear-gradient').LinearGradient ;

const ModalDeposit = (props : any) => {
    const contract = useBalanceContract(REACT_APP_GRAPHLINQ_TOKEN_CONTRACT);
    const tokenContract = useTokenContract(REACT_APP_GRAPHLINQ_BALANCE_CONTRACT);

    const {balance, refreshBalance} =  useBalance();
    const {refreshBalanceContract} =  useWalletContract();
    
    const { account } = useActiveWeb3React()
    const [amountDeposit, setAmountDeposit] = useState('0.0');
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    const format = (val: string) => val + ` GLQ`;
    const parse = (val: string) => val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');

    async function doDeposit()
    {
        if (contract == null || tokenContract == null) { return }
        refreshBalance()

        const asNumber = parseFloat(amountDeposit)
        if (asNumber <= 0) {
            setError(`Invalid amount to deposit on the balance contract: ${asNumber} GLQ`)
            return 
        }
        
        const decimalAmount :any = utils.parseEther(amountDeposit)
        try {
            const allowance = await tokenContract.allowance(account, REACT_APP_GRAPHLINQ_BALANCE_CONTRACT);
            const wei = utils.parseEther('10000000')
            if (parseFloat(allowance) < parseFloat(decimalAmount)) {
                console.log(`${allowance} vs ${decimalAmount}`)
                setPending("Allowance pending, please allow the use of your token balance for the contract...")
                const approveTx = await tokenContract.approve(REACT_APP_GRAPHLINQ_BALANCE_CONTRACT, wei.toString());
                setPending("Waiting for confirmations...")
                await approveTx.wait()
                setPending("Allowance successfully increased, waiting for deposit transaction...")
            }
            const currentBalanceDecimal :any = utils.parseEther(balance.amount.toString())
            if (parseFloat(decimalAmount) > parseFloat(currentBalanceDecimal)) {
                setPending(""); setError(`You only have ${balance.amount} GLQ in your wallet.`);
                return;
            }

            setPending("Pending, check your wallet extension to execute the chain transaction...")
            const result = await contract.addBalance(decimalAmount.toString())
            setPending("Waiting for confirmations...")
            await result.wait()
            setSuccess(result.hash)

            refreshBalanceContract()
        }
        catch (e : any)
        {
            console.error(e)
            if (e.data?.message) { setPending(""); setError(`Error: ${e.data?.message}`);return; }
            
            if(e.message.includes('user rejected transaction')){
              setError('Error: MetaMask Tx Signature: User Denied transaction signature.')
            }else if (e.message) { 
              setPending(""); setError(`Error: ${e.message}`); 
            }
        }
    }

    const handleChange = (text : string) => setAmountDeposit(text);

    return (
        <Modal isOpen={props.depositModalVisible} onClose={props.setDepositModalVisible} size={'md'}>
          <Modal.Content maxH="350" borderRadius="15" justifyContent={'center'}>
            <Modal.Header bg="rgb(32,27,64)" borderColor={"rgb(32,27,64)"}>
              <Text color="white" textAlign={"center"} fontSize="xl">Cloud Balance Deposit</Text>
            </Modal.Header>
            <Modal.Body bg="rgb(32,27,64)" alignItems={"center"} justifyContent='center' >
                {error &&
                  <View  flexDirection='row' justifyContent='center' alignItems='center' bg='#3e2f70' borderRadius={'32'} p='3' my='3' display={'flex'} w='95%'>
                    <Icon as={FontAwesome} name="times-circle" color='#ff294c'  size='sm' mr='2'/>
                    <Text color="white" fontSize={'xs'} numberOfLines={2}>{error}</Text>
                  </View>
                }
                {!success && pending &&
                  <View  textAlign='center' flexDirection='row' justifyContent='center' alignItems='center'  bg='#3e2f70' borderRadius={'32'} p='3' my='3' w='95%'>
                    <Icon as={FontAwesome} name="info-circle" color='rgb(32,27,64)'  size='sm' mr='2'/>
                    <Text color="white" fontSize={'xs'}>{pending}</Text>
                  </View>
                }
                {success &&
                  <View textAlign='center' flexDirection='column' justifyContent='center' alignItems='center' bg='#3e2f70' borderRadius={'32'} p='3' my='3' w='95%'>
                    <Icon as={FontAwesome} name="check-circle" color='#59b819' size='2xl' mr='2'/>
                    <Text color='white' fontSize={'sm'}>Deposit successfully completed !
                      <br/>Transaction hash : <Link href={`https://etherscan.com/tx/${success}`} isUnderlined={false} _text={{fontSize:'xs'}} isExternal>{success}</Link></Text>
                  </View>
                }
              
                <Box bg="black" borderRadius={"32"} mx="3" flexDirection={"row"} alignItems="center" justifyContent={"space-between"} w="95%">
                  {/* <Text color="white" fontSize={"xl"} ml="5">{amountDeposit} GLQ</Text> */}
                  <Input color='white' value={amountDeposit} fontSize='xl' variant={'unstyled'} bg='transparent' size='sm' onChangeText={handleChange} flex='7'/>
                  <HStack flex='3' justifyContent={'right'} alignItems='center'>
                      <Text textAlign={'center'} color='white' fontSize="xl" bg='transparent' mr='2'>GLQ</Text>
                      <Box flexDirection={"column"} borderLeftColor={"rgb(32,27,64)"} borderLeftWidth="1">
                        <IconButton variant={"ghost"} borderTopRightRadius="32" h="5" w="5"
                        icon={<Icon as={Ionicons} name="caret-up" /> } 
                        _icon={{color:"rgb(32,27,64)", size:"sm"}}
                        _pressed={{backgroundColor:"white"}}
                        onPress={() => {
                          let currentAmount = parseFloat(amountDeposit);
                          currentAmount += 0.1;
                          setAmountDeposit(currentAmount.toString()); 
                        }}
                        />
                        <IconButton variant={"ghost"} borderBottomRightRadius="32" h="5" w="5"
                        icon={<Icon as={Ionicons} name="caret-down" />} 
                        _icon={{color:"rgb(32,27,64)", size:"sm"}}
                        _pressed={{backgroundColor:"white"}}
                        onPress={() => {
                          let currentAmount= parseFloat(amountDeposit);
                          if(currentAmount > 0.0){
                            currentAmount -= 0.1;
                            setAmountDeposit(currentAmount.toString()); 
                          }                  
                        }}
                        />
                      </Box>
                    </HStack>
                </Box>

                <Pressable mt="5" onPress={doDeposit} w='70%' justifyContent={'center'} alignItems='center' alignSelf={'center'}> 
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
                          <Text textAlign={"center"} color="white" fontSize={"sm"} bold>Deposit</Text>
                        </View>
                    </LinearGradient>
                    }}
                </Pressable>
            </Modal.Body>
          </Modal.Content>
        </Modal>
    );
};

export default ModalDeposit;