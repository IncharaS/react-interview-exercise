import React from "react";
import { Box, Heading } from '@chakra-ui/react';
import Logo from '../header_logo.png';
import Glob from "./design/Glob";
import { theme } from '@theme/index';


const Header: React.FC = ({ children }) => {

    return (
        <>
            {/* // pointerEvents="none" as it was interfering with selection and interaction on the page*/}
            <Box overflow="hidden" className="globParent" position="absolute" width="100%" height="100%" minHeight="100vh" pointerEvents="none">
                <Glob size={["60%", "60%"]} speed={30} globSizes={[[60, 65], [70, 80], [30, 75]]} left="70%" top="10%" opacity={0.5} color={theme.colors.brand.green} />
                <Glob size={["600px", "600px"]} right="-300px" top="-20px" color={theme.colors.brand.green} />
            </Box>
            <Box
                className="cs-header"
                position="sticky"
                top="0"
                right="0"
                left="0"
                width="100%"
                height="80px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                px={6}

                zIndex={999}
                boxShadow="sm"
            >
                {/* {Logo */}
                <Box position="absolute" left={6} top="50%" transform="translateY(-50%)">
                    <a href="https://characterstrong.com">
                        <img
                            className="header-img"
                            src={Logo}
                            alt="CharacterStrong Logo"
                            style={{ height: "80px" }}
                        />
                    </a>
                </Box>
                {/* Title */}
                <Heading size="md" color={"green.500" as const} >
                    U.S School District Insights
                </Heading>

                {children}
            </Box>

        </>
    )
}

export default Header;