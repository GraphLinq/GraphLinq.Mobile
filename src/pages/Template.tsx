import React,{useEffect, useState, useRef} from "react";
import {
  Text,
  Link,
  Center,
  VStack,
  Box,
  Image,
  ScrollView,
  Pressable,
  View,
  Button,
  Icon,
  Input,
  FlatList,
  Spinner,
  FormControl,
  NativeBaseProvider,
  extendTheme,
  Stack
} from "native-base";

import { Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import GraphService from "../services/graphService";

import { GraphStateEnum } from '../enums/graphState';
import { GraphTemplate } from '../providers/responses/templateGraph';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;
interface TemplatesProps {

}

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
const Templates: React.FC<TemplatesProps> = ({ }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [templateID, setTemplateID] = useState(null);

  const [fileUpload, setFileUpload] = useState({ loaded: false, file: {} })
  const [graphName, setGraphName] = useState("")
  const [template, selectedTemplate] = useState({ loaded: false, template: { bytes: "", idgraphsTemplates: 0, title: "", description: "", customImg: "" } })
  const [templateLoaded, setTemplateLoaded] = useState(false)
  const [templates, setTemplates] = useState<GraphTemplate[]>([])

  useEffect(() => {
    const fetchTemplates = async () => {
      const templates: GraphTemplate[] = await GraphService.listGraphsTemplates()
      setTemplates(templates)
      setTemplateLoaded(true)
    }
    fetchTemplates()
  }, [])



  const [step, setStep] = useState(true);

  const [graphData, setGraphData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fetchGraphData = async (template: any) => {
    return await GraphService.decompressGraph(template)
  }

  async function updateStep() {
    setIsLoading(true)
    fetchGraphData(template.template.bytes)
    .then(data => {
      console.log(data);
      setGraphData(JSON.parse(data))
      setStep(!step)
      setIsLoading(false)
    });
  }

  function selectTemplate(e: any){
    const template = templates.find(x => x.key === e)
        if (template !== undefined) {
            selectedTemplate({ loaded: true, template: template })
            console.log(template)
    }
  }

  return  (
  <NativeBaseProvider theme={theme}>
    <View style={{ flex: 1, alignItems: 'center',
                   justifyContent: 'center' }}  bg="darkBlue.900" width={windowWidth} height={windowHeight}>
      <ScrollView p={["7","10"]} flexDirection={"column"}>
        <Text fontSize={"xl"} color="white" textAlign={"center"} bold mb='3'>Template Wizard</Text>

        <Box justifyContent={"stretch"} alignItems="center" bg="rgb(32,27,64)" flexDirection={"row"} borderRadius="50" px={["3","5","7"]} mb={["3","5","7"]} shadow={"0"}>
          <Icon as={Ionicons} name="information-circle-outline" size="4" color="blue.800"/>
          <Text color="#aba1ca" fontSize={"ms"} p="2" lineHeight={'16'}>
            GraphLinq's Instant Deploy Wizard lets you choose a template, fill in variables and deploy it instantly without having to code or making any changes on the IDE
          </Text>
        </Box>

        <VStack shadow={"1"}>

          {step &&
            <TemplatesList selectTemplate={selectTemplate} isLoading={isLoading} templateLoaded={templateLoaded} template={template} templates={templates} fileUpload={fileUpload} graphName={graphName} setGraphName={setGraphName} updateStep={updateStep} />
          }
          {!step &&

            <TemplateVars templateData={graphData} graphName={graphName} templateName={template.template.title} templateDesc={template.template.description} step={step} setStep={setStep} />

          }

          <Box justifyContent={"stretch"}  bg="rgb(32,27,64)" flexDirection={"column"} borderRadius="12" p={["7","10","15"]}>
            <Icon alignSelf={"center"} as={Ionicons} name="information-circle-outline" size="9" color="blue.800"/>
            <Text color="white" fontSize={"xl"} px="5" textAlign={"center"} bold pb="3">
              How to use a template?
            </Text>
            <Text color="#aba1ca" fontSize={"md"} > You can: </Text>
            <Text color="#aba1ca" fontSize={"md"} > - Select a template from the list </Text>
            <Text color="#aba1ca" fontSize={"md"} > - Fill in required variables </Text>
            <Text color="#aba1ca" fontSize={"md"} > Or for more advanced user: </Text>
            <Text color="#aba1ca" fontSize={"md"} > - Select a template </Text>
            <Text color="#aba1ca" fontSize={"md"} > - Download it </Text>
            <Text color="#aba1ca" fontSize={"md"} > - Upload & Edit On the <Link href="https://ide.graphlinq.io" color="blue.900" fontSize={"md"}>IDE</Link><Text> to suit their needs</Text>
            </Text>
            <Text color="#aba1ca" fontSize={"md"} textAlign="center">
              You can also make your own custom Graph from scratch using our <Link href="https://ide.graphlinq.io" color="blue.900" fontSize={"md"}>IDE </Link>
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </View>
  </NativeBaseProvider>
  )
};

const TemplatesList = (props : any) => {
  const [graphName, setGraphName] = useState('');

  return (
    <NativeBaseProvider theme={theme}>
      <Box justifyContent={"center"} flexDirection={"column"} bg="rgb(32,27,64)" borderRadius="12" px={["7","10"]} py={["3","5","7"]} mb="5" shadow="1">
          <Box justifyContent={"left"} >
            <Text color="white" fontSize={"xl"} bold mb="3"> Name Your Graph:</Text>
            <Input variant="underlined" color="#aba1ca" fontSize={"md"} mb="7" placeholder="Graph Name" value={props.graphName} onChange={(e) => { props.setGraphName(e.target.value) }}/>
            <Text color="white" fontSize={"xl"} bold mb="2"> Templates:</Text>
          </Box>

          <ScrollView h="490" >
          {props.templateLoaded?
           <FlatList shadow="1" numColumns={2} m="1" data={props.templates}//props.templates
              renderItem={({
                item
              }) => {
              return <Pressable w="50%" p="1" onPress={() => { props.selectTemplate(item.key);}}>
                  {({isPressed,isFocused, }) => {
                    return <Box
                  borderColor={isPressed?"rgb(7,125,255)": isFocused ? "rgb(7,125,255)" : "#aba1ca"}
                  borderWidth="2"
                  alignItems={"center"} style={{
                      borderRadius: 32,
                      alignContent: "center",
                  }}
                  bg="transparent"  h="100%"
                  >
                  <Image src={item.customImg} w="80%" h='100' style={{resizeMode:"contain"}} my='3'/>
                  <Text color="#aba1ca" fontSize={"lg"} textAlign="center" w='85%' mb='3'>{item.title}</Text>
              </Box>
              }}
              </Pressable>
            }} />
              : <Stack w='100' justifyContent={'center'} alignItems='center' alignSelf='center' mt='30'>
                <Spinner
                  color="#2334ff"
                  size="md"
                />
              </Stack>
          }
          </ScrollView>
          {props.template.loaded &&
            <Center>
              <View w='80%' m='5' justifyContent={'center'}>
                <Button bgColor="#2334ff" borderRadius={'12'} color="white" onPress={() => { props.updateStep();} } isDisabled={!props.graphName} isLoading={props.isLoading} isLoadingText="Loading">Next</Button>
              </View>
            </Center>
          }
      </Box>
    </NativeBaseProvider>
  )
};

interface TemplateRoot {
  name: string
  nodes: TemplateNode[]
  comments: any[]
}

interface TemplateNode {
  id: string
  type: string
  out_node?: string
  can_be_executed: boolean
  can_execute: boolean
  friendly_name: string
  block_type: string
  _x: number
  _y: number
  in_parameters: TemplateInParameter[]
  out_parameters: TemplateOutParameter[]
}

interface TemplateInParameter {
  id: string
  name: string
  type: string
  value: any
  assignment: string
  assignment_node: string
  value_is_reference: boolean
}

interface TemplateOutParameter {
  id: string
  name: string
  type: string
  value?: string
  assignment: string
  assignment_node: string
  value_is_reference: boolean
}

const TemplateVars = (props:any) => {

  const [decompTemplate, setDecompTemplate] = useState<TemplateRoot>(props.templateData)
  const [compressedTemplate, setCompressedTemplate] = useState<any>()

  const [fields, setFields] = useState(new Map())

  const handleChange = (i: any, v: any, node: TemplateNode) => {
    setFields(new Map(fields.set(i, v)));
    setDecompTemplate((decompTemplate) => {
      node.out_parameters[0].value = v
      return ({
        ...decompTemplate
      })
    })
  }

  useEffect(() => {
    decompTemplate?.nodes
    .filter(node => node.block_type === "variable" && node.friendly_name !== "do_not_show")
    .map((node, i: number) => (
      handleChange(i, node.out_parameters[0].value, node)
    ))
  }, [])

  const compressGraph = async (template: any) => {
    const compData = await GraphService.compressGraph(template)
    setCompressedTemplate(compData)
    return compData
  }

  const previous = () => {
    props.setStep(true)
    setFields(new Map())
  }

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  async function deployGraphTemplate(data: any, name: any) {
    try {
      const result: String | undefined = await GraphService.deployGraph({
        state: GraphStateEnum.Starting,
        bytes: data,
        alias: name,
        hash: undefined
      })

      if (result instanceof String) {
        setSuccess(`${result}`)
      } else {
        setError('Your graph file was incomplete or invalid, please check it on the IDE')
      }
    }
    catch (e) {
      console.error(e)
      setError('An error occured while trying to parse your file, please try again')
    }
    executeScroll()
  }

  async function deployTemplate() {
    setIsLoading(true)
    compressGraph(JSON.stringify(decompTemplate))
        .then(data => {
            deployGraphTemplate(data, props.graphName)
            setIsLoading(false)
        })
  }

  const resultRef = useRef<HTMLInputElement>(null)

  const executeScroll = () => resultRef.current?.scrollIntoView()

  return (
    <Box justifyContent={"center"} flexDirection={"column"} bg="rgb(32,27,64)" borderRadius="12" px={["7","10","15"]} py={["3","5","7"]} mb="5" flex='1' w={windowWidth*0.9}>
       {success &&
          <Box justifyContent={"stretch"} alignItems="center" bg="rgb(35,35,60)" flexDirection={"row"} borderRadius="15" px={"2"} mb={'3'}>
            <Icon as={Ionicons} name="checkmark-circle-outline" color="#59b819" size='lg' mr='1'/>
            <Text fontSize="sm" color="#ece7fd"  mb='2' numberOfLines={10}>
              <b>Graph Successfully started, Congratulations !</b><br></br>
              {decompTemplate?.name || 'Template'} execution unique hash :<br></br>
              {success}
            </Text>
          </Box>
      }
      {error &&
          <Box style={{ marginBottom: "15", marginTop: "15" }} ref={resultRef}>
            <Icon as={Ionicons} name="close-circle-outline" size='lg' mr='1'/>
            <Text fontSize={"xs"} color={'#ece7fd'}>{error}</Text>
          </Box>
      }
      <Box justifyContent={'left'} alignItems='flex-start'>
        <Text fontSize="md" color="#ece7fd" bold mb='3'>{props.graphName} :</Text>
        <Text fontSize="md" color="#c4b9e5" mb='3'><b>Template:</b> {props.templateName}</Text>
        <Text fontSize='md' color="#c4b9e5" mb='3'><b>Description:</b> {props.templateDesc}</Text>
      </Box>
      <Box>
        {decompTemplate?.nodes
          .filter(node => node.block_type === "variable" && node.friendly_name !== "do_not_show")
          .map((node, i: number) => (
            <FormControl my="5" key={node.id} isRequired>
              <FormControl.Label>{node.friendly_name} :</FormControl.Label>
              <Input color="#c4b9e5" type="text" variant="underlined" placeholder={node.friendly_name} value={fields.get(i) || node.out_parameters[0].value || ''} onChange={(e) => handleChange(i, e.target.value, node)} />
            </FormControl>
        ))}
      </Box>
      <Box justifyContent={'right'} my="3" flexDirection="row">
        <Button bgColor="transparent" variant="outline" _text={{color:"#c4b9e5"}} borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#2334ff", borderColor: '#2334ff', color: "white" }} mr="5" onPress={previous}>Previous</Button>
        <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }} onPress={()=> {console.log(props.graphName); console.log(props.templateName);console.log(props.templateDesc); deployTemplate();}} isLoading={isLoading} isLoadingText="Loading">Deploy</Button>
      </Box>
    </Box>
  )
};

export default Templates;
