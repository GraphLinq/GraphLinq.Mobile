import React from 'react'
import { Button, Text, Box, Icon, Spacer, Link } from 'native-base';
import * as WalletIcons from "../../../assets/icons";

export default function Option({
    link = "",
    clickable = true,
    size = 0,
    onClick = () => { },
    color = "",
    header = "",
    subheader = "",
    icon = "",
    active = false,
    id = ""
}) {
    const content = (
        <Button
            id={id}
            isActive={active}
            _active={{ backgroundColor: "indigo.50" }}
            onClick={onClick}
        >
            <Text fontSize="md" color="white">{header}</Text>
            <Icon as={(WalletIcons as any)[icon]} w={6} h={6} />
        </Button>
    )
    if (link) {
        return (
            <Link href={link} isExternal>
                {content}
            </Link>
        )
    }

    return content
}
