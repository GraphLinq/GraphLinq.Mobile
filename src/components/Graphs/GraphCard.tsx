import React,{useEffect, useRef, useState} from "react";
import {
  Text,
  Link,
  HStack,
  VStack,
  Box,
  ScrollView,
  Pressable,
  View,
  Button,
  Icon,
  Modal,
  useDisclose,
} from "native-base";

import { Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { GraphStatus } from './GraphStatus';
import { GraphResponse } from '../../providers/responses/graph';
import { GraphStateEnum } from '../../enums/graphState';
import GraphService from '../../services/graphService';
import { Log } from '../../providers/responses/logs';

const LinearGradient = require('expo-linear-gradient').LinearGradient ;

interface GraphCardProps {
  GraphInfo: GraphResponse,
  GraphName?: string,
  GraphIDELink?: string,
  GraphExecCost?: number,
  GraphExecTime?: string,
  GraphCreation?: string,
  Status?: number
}

function timeSinceExecution(date: any): string {
  var now: Date = new Date();

  var timeStart = date.getTime();
  var timeEnd = now.getTime();
  var hourDiff = timeEnd - timeStart; //in ms
  var secDiff = hourDiff / 1000; //in s
  var minDiff = hourDiff / 60 / 1000; //in minutes
  var hDiff = hourDiff / 3600 / 1000; //in hours

  const hours = Math.floor(hDiff);
  const minutes = (minDiff - 60 * hours).toFixed(2)

  return `${hours} hours, ${minutes} minutes.`
}

const GraphCard : React.FC<GraphCardProps> = ({
    GraphInfo = undefined,
    GraphName = "Default",
    GraphIDELink = "https://ide.graphlinq.io/",
    GraphExecCost = null,
    GraphExecTime = "—",
    GraphCreation = "—",
    Status = 0,
    ...props
}) => {
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const [logs, setLogs] = React.useState([])
    const { isOpen, onOpen, onClose } = useDisclose()
    const [inLogs, setInLogs] = React.useState<boolean>(false);

    const bottomRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        scrollToBottom()
    }, [])

    const scrollToBottom = () => {
        if (bottomRef && bottomRef.current) {
            bottomRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    async function tickLogs() {
        setLogs((await GraphService.graphLogs(GraphInfo?.hashGraph ?? "")) as any)
        scrollToBottom()
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null;

        if (inLogs) {
            tickLogs()
            interval = setInterval(async () => {
                if (interval) {
                    tickLogs()
                }
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [inLogs]);

    function onLogsOpen() {
        onOpen()
        setInLogs(true)
    }

    function onLogsClose() {
        onClose()
        setInLogs(false)
    }

    function getColorLog(type: string): string {
        switch (type) {
            case "info":
                return "blue.400"
            case "success":
                return "emerald.500"
            case "warn":
                return "amber.500"
        }
        return ""
    }

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    async function changeGraphState(state: GraphStateEnum) {
        setIsLoading(true)
        const result: boolean = await GraphService.setGraphState(state, GraphInfo?.hashGraph ?? "")
        if (result && GraphInfo !== undefined) {
            GraphInfo.state = state
        }
        setIsLoading(false)
    }

    async function removeGraph() {
        setIsLoading(true)
        const result: boolean = await GraphService.removeGraph(GraphInfo?.hashGraph ?? "")
        setIsLoading(false)
    }

    async function deployGraph() {
        setIsLoading(true)
        const hash: String | undefined = await GraphService.deployGraph({
            state: GraphStateEnum.Starting,
            bytes: GraphInfo?.lastLoadedBytes ?? "",
            alias: GraphInfo?.alias ?? "Unnamed",
            hash: GraphInfo?.hashGraph
        })
        if (hash !== undefined && GraphInfo !== undefined) {
            GraphInfo.state = GraphStateEnum.Starting
        }
        setIsLoading(false)
    }

    async function exportGlqFile()
    {
        const element = document.createElement("a");
        const file = new Blob([(GraphInfo?.lastLoadedBytes as any)],
                    {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = `${GraphInfo?.alias}.glq`;
        document.body.appendChild(element);
        element.click();
    }

    return (
      <View bg="darkBlue.900">
        <ScrollView flexDirection={"column"} py='3'>
          <Modal onClose={onClose} isOpen={isOpen} size="lg" borderColor={'transparent'}>
            <Modal.Content borderRadius={'15'} maxH='300'>
              <Modal.Header bg="rgb(32,27,64)" borderColor={'transparent'} h='50' justifyContent={'center'} alignItems='flex-start' pl='5'><Text color='white' fontSize='xl' bold>Logs</Text></Modal.Header>
              <Modal.CloseButton />
              <Modal.Body bg="rgb(32,27,64)">
                <ScrollView p='3'>
                  {logs === undefined && <Text color="amber.500">No logs available...</Text>}
                  {logs !== undefined && logs.map((x: Log, i: number) => {
                    return <Text fontSize={'md'} color={'white'} key={`txt-${i}`}>[{x.type}] ({new Date(x.timestamp).toLocaleString()}):<br /> {x.message}</Text>
                  })}
                  <View ref={bottomRef}></View>
                </ScrollView>
              </Modal.Body>
              <Modal.Footer background={'darkBlue.900'} borderColor={'transparent'} justifyContent='right' pr='5'>
                <Button bg="rgb(32,27,64)" borderRadius={'12'} onPress={onLogsClose}><Text fontSize='md' color='white'>Close</Text></Button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          <Modal isOpen={detailModalVisible} onClose={setDetailModalVisible} size={"md"} borderRadius="32" >
            <Modal.Content maxH="350" borderRadius="15">
              <Modal.CloseButton />
                <Modal.Header bg="rgb(32,27,64)" borderColor={"transparent"}><Text color="#aba1ca" fontSize={"lg"}>More</Text></Modal.Header>
                <Modal.Body bg="darkBlue.900" px='3' alignItems={'left'} justifyContent='flex-start'>
                  <Pressable onPress={() => { deployGraph() }}>
                    {()=>{
                      return <View alignItems={'flex-start'} flexDirection='row' px='3'>
                        <Icon as={Ionicons} name='play-outline' color='green.900' size='md' mr='2'/>
                        <Text color='white' fontSize={'lg'}>Start</Text>
                        </View>
                    }}
                  </Pressable>
                  <Pressable onPress={() => { changeGraphState(GraphStateEnum.Restarting) }}>
                    {()=>{
                      return <View alignItems={'flex-start'} flexDirection='row' px='3'>
                        <Icon as={Ionicons} name='play-outline' color='green.900' size='md' mr='2'/>
                        <Text color='white' fontSize={'lg'}>Force restart</Text>
                        </View>
                    }}
                  </Pressable>
                  <Pressable onPress={() => { changeGraphState(GraphStateEnum.Stopped) }}>
                    {()=>{
                      return <View alignItems={'flex-start'} flexDirection='row' px='3'>
                        <Icon as={Ionicons} name='stop-outline' color='blue.900' size='md' mr='2'/>
                        <Text color='white' fontSize={'lg'}>Stop</Text>
                        </View>
                    }}
                  </Pressable>
                  <Pressable onPress={() => { removeGraph() }}>
                    {()=>{
                      return <View alignItems={'flex-start'} flexDirection='row' px='3'>
                        <Icon as={Ionicons} name='trash-outline' color='red.900' size='md' mr='2'/>
                        <Text color='white' fontSize={'lg'}>Delete</Text>
                        </View>
                    }}
                  </Pressable>
                </Modal.Body>
            </Modal.Content>
          </Modal>

          <Box bg="rgb(32,27,64)" borderRadius="12" p={["3","5","7"]} flexDirection='column'>
              <HStack justifyContent={"space-between"} mb="3">
                <HStack alignItems={'center'} justifyContent='center'>
                  <GraphStatus state={GraphInfo?.state ?? 0} />
                  <VStack ml='3'>
                    <Link isUnderlined={false} fontWeight="semibold" _text={{color:"#aba1ca", fontSize:'lg'}}  href={GraphIDELink} isExternal fontSize={'lg'}>
                      {GraphInfo?.alias}
                    </Link>
                    <Text color="#aba1ca" fontSize={"sm"} isTruncated maxW={'200'}>{GraphInfo?.hashGraph}</Text>
                  </VStack>
                </HStack>
              </HStack>
              <View alignItems={'center'}>
                <VStack alignItems='flex-start'>
                  <Text color="#aba1ca" fontSize={"md"} > Execution cost :  <b> {GraphInfo?.lastExecutionCost || "—"} GLQ</b></Text>
                  <Text color="#aba1ca" fontSize={"md"} > Running since :  <b>{(GraphInfo?.state === GraphStateEnum.Started) ? timeSinceExecution(GraphInfo?.loadedAt) : "—"}</b></Text>
                  <Text color="#aba1ca" fontSize={"md"} > Created :  <b>{GraphInfo?.createdAt.toLocaleString()}</b></Text>
                </VStack>
                </View>
              <HStack justifyContent={'center'} px='3' my='3' alignItems={'center'}>
                <Pressable background={'transparent'} onPress={onLogsOpen} mr='5'>
                  {({isPressed}) => {
                  return <LinearGradient
                    colors={['rgb(56,8,255)', 'rgb(7,125,255)']}
                    start={[0,1]}
                    end={[0,0]}
                    style={{
                        borderRadius: 15,
                        alignContent: "center",
                        justifyContent: "center",
                        transform: [{scale: isPressed ? 0.96 : 1}]
                    }}
                    >
                    <View flexDirection='row' justifyContent={'center'} alignItems='center' mx='3' my='1'>
                      <Text fontSize={'sm'} color='white'  mr='2'>View Logs</Text>
                      <Icon as={Ionicons} name='eye-outline' color='white' size='lg'/>
                    </View>
                  </LinearGradient>
                  }}
                </Pressable>
                <Pressable onPress={() => setDetailModalVisible(true)} alignItems='center' justifyContent={'center'}>
                  <Icon size={"2xl"} as={Ionicons} name={"ellipsis-vertical-circle-outline"} color="#aba1ca" />
                </Pressable>
              </HStack>
          </Box>
        </ScrollView>
      </View>
    )
  }

export default GraphCard;
