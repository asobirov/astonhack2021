import { extendTheme } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools'

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    cssVarPrefix: "",
}

const styles = {
    global: (props: any) => ({
        '*': {
            outlineWidth: '0!important'
        },
        body: {
            bg: mode("white", "#111")(props),
        },
        "#__next": {
            minH: '100vh'
        }
    })
}

const colors = {
}

const fonts = {
    heading: "Poppins, Avenir Next, sans-serif",
    body: "Poppins, Avenir Next, sans-serif",
}

const components = {
    Container: {
        baseStyle: {
            maxW: ['26rem', 'xl', '45rem', '4xl'],
            px: ['4', '8', '4', '5'],
            transition: 'padding .8s ease-in-out, max-width .8s ease'
        }
    },
}

const overrides = {}

const theme = extendTheme({ styles, config, fonts, colors, components, overrides })

export default theme;