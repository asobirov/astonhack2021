import type { NextPage } from 'next';
import { Stack, Heading, Flex, Box } from '@chakra-ui/react';


import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";

import { ChakraCanvas, ChakraWebcam } from '../components/Webcam';
import { useCallback, useEffect, useRef, useState } from 'react';
import { detect } from '../lib/useDetect';

const Home: NextPage = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHandposeReady, setIsHandposeReady] = useState(false);

  const initHandpose = useCallback(async () => {
    const net = await handpose.load();
    setIsHandposeReady(true);
    setInterval(async () => {
      detect(net, webcamRef, canvasRef);
    }, 100);
  }, []);

  initHandpose();

  return (
    <Flex>
      <Flex
        position={'relative'}
        align='center'
        justify='center'
        w={'100%'}
        h={'75vh'}
        transform={"scaleX(-1)"}
      >
        <ChakraWebcam
          ref={webcamRef}
          audio={false}
          imageSmoothing={false}
          forceScreenshotSourceSize={false}
          mirrored={false}
          onUserMedia={() => null}
          onUserMediaError={() => null} 
          screenshotFormat={'image/webp'}
          screenshotQuality={1}
          position={'absolute'}
          top={0}
          h={'100%'}
        />
        {isHandposeReady && <Box>
          <Heading>Loading...</Heading>
        </Box>}
        <ChakraCanvas
          ref={canvasRef}
          position={'absolute'}
          top={0}
          h={'100%'}
        />
      </Flex>
    </Flex>
  )
}

export default Home;
