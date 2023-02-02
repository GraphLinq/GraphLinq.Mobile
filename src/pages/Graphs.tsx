import React,{ useEffect, useState} from "react";
import {
  Text,
  Link,
  NativeBaseProvider,
  VStack,
  Box,
  ScrollView,
  View,
  Icon,
  Stack,
  Spinner
} from "native-base";

import { Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import GraphCard from '../components/Graphs/GraphCard';
import { GraphResponse } from '../providers/responses/graph';
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import GraphService from '../services/graphService';
import { GRAPH_UPDATE } from '../redux/actions';

const LinearGradient = require('expo-linear-gradient').LinearGradient ;

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const config = {
  dependencies: {
    'linear-gradient': LinearGradient
  }
};

const graphs = (props: any) => {
  const [reachable, setReacheable] = useState(true)
    const { account } = useWeb3React();
    const dispatch = useDispatch();

    const graphsList: GraphResponse[] = useSelector(
        (state: any) => state.modals.graphs.list
    );

    const loaded: boolean = useSelector(
        (state: any) => state.modals.graphs.loaded
    );

    useEffect(() => {
        const refreshfnc = async () => {
            const graphs: GraphResponse[] | undefined = await GraphService.listGraphs();
            if (graphs === undefined) {
                return setReacheable(false)
             }

            dispatch({
                name: "graphs",
                type: GRAPH_UPDATE,
                payload: { graphs, loaded: true },
            })

            setTimeout(refreshfnc, 10000)
        };

        refreshfnc()
    }, [account])

  return (
  <NativeBaseProvider config={config}>
    <View style={{ flex: 1 }} justifyContent="space-between" bg="darkBlue.900" width={windowWidth} height={windowHeight} >
      <ScrollView flexDirection={"column"} p={["7","10"]} >
        <Text fontSize={"xl"} color="white" textAlign={"center"} bold mb='3'>Graphs</Text>
        <Box justifyContent={"stretch"} alignItems="center" bg="rgb(32,27,64)" flexDirection={"row"} borderRadius="50" px={["3","5","7"]} mb={["3","5","7"]}>
          <Icon as={Ionicons} name="information-circle-outline" size="4" color="blue.800"/>
          <Text color="#aba1ca" fontSize={"sm"} p="1" lineHeight={'16'}>
            Below is the list of your Graphs. You can view logs, stop or delete each one of them.
          </Text>
        </Box>
        {reachable && !loaded &&
        <Stack w='100' justifyContent={'center'} alignItems='center' alignSelf='center' mt='30'>
          <Spinner
            color="#2334ff"
            size="md"
          />
        </Stack>
        }
        {!reachable &&
          <View flexDirection='row' justifyContent='center' alignItems='center' bg='rgb(32,27,64)' borderRadius={'32'} p='3' my='1'>
            <Icon as={FontAwesome} name="times-circle" color='#ff294c'  size='sm' mr='2'/>
            <Text color='white' fontSize={'ms'}>The engine main-net network can't be reached, please try again later or contact the <i>GraphLinq Support</i>.</Text>
          </View>
        }
        {graphsList.length == 0 && loaded &&
          <View flexDirection='row' justifyContent='center' alignItems='center' bg='rgb(32,27,64)' borderRadius={'32'} p='3' my='1'>
            <Icon as={Ionicons} name="warning-outline" color='yellow.600' size='sm' mr='2'/>
            <Text color='white' fontSize={'sm'}>You don't have created or deployed any graph yet, refer to our
            <Link marginLeft="1"
              href="https://docs.graphlinq.io/graph"
              isExternal _text={{color:'amber.600'}}
              _hover={{ color: 'amber.700' }}
              display={{ base: 'block', sm: 'revert' }}
              >documentation</Link>
              to start your journey.
            </Text>
          </View>
        }
        {graphsList.length > 0 &&
          <VStack mb={1} >
            {graphsList.sort((a: GraphResponse, b: GraphResponse) => { return b.state - a.state }).map((x: GraphResponse, i: number) => {
              return <GraphCard key={`graph-${i}`} GraphInfo={x} />
            })}
          </VStack>
        }
      </ScrollView>
    </View>
  </NativeBaseProvider>
  )
}

export default graphs;
