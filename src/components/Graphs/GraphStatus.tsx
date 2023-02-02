import { Tooltip, Box, Icon } from 'native-base';
import React from 'react'
import { GraphStateEnum } from '../../enums/graphState';

import { Ionicons, FontAwesome } from "@expo/vector-icons";

interface GraphStatusProps {
    state: number,
}

export const GraphStatus: React.FC<GraphStatusProps> = ({ state }) => {
    return (
        <StatusIcon status={state} />
    );
}

function StatusIcon({ status }: any) {
    if (status === GraphStateEnum.Stopped) { /* stopped */
        return (
            <Tooltip hasArrow arrowSize={10} label="Stopped" bg="gray.900" color="white" size="xs" placement="top">
                <Icon as={Ionicons} name='stop' color='blue.900' size={'md'}/>
            </Tooltip >
        );
    }
    if (status === GraphStateEnum.Starting || status === GraphStateEnum.Started) { /* running */
        return (
            <Tooltip hasArrow arrowSize={10} label="Running" bg="gray.900" color="white" size="xs" placement="top">
                <Icon as={Ionicons} name='play' color='green.900' size={'md'}/>
            </Tooltip >
        );
    }
    if (status === GraphStateEnum.InError) { /* error */
        return (
            <Tooltip hasArrow arrowSize={10} label="In Error State" bg="gray.900" color="white" size="xs" placement="top">
                <Icon as={FontAwesome} name='times-circle' color='#ff294c' size={'md'}/>
            </Tooltip >
        );
    }
    if (status === GraphStateEnum.Restarting) { /* restarting */
        return (
            <Tooltip hasArrow arrowSize={10} label="Restarting" bg="gray.900" color="white" size="xs" placement="top">
                <Icon as={Ionicons} name='repeat-outline' color='blue.900' size={'md'}/ >
            </Tooltip >
        );
    }
    if (status === GraphStateEnum.InPause) { /* paused */
        return (
            <Tooltip hasArrow arrowSize={10} label="Paused" bg="gray.900" color="white" size="xs" placement="top">
                <Icon as={Ionicons} name='pause' color='blue.900' size={'md'}/>
            </Tooltip >
        );
    }
    return null;
}
