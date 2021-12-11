import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styles/theme';

import 'focus-visible/dist/focus-visible';
import "@tensorflow/tfjs";

import "@fontsource/poppins"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"
import "@fontsource/poppins/800.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
