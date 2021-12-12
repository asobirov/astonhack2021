import type { NextPage } from 'next';
import { Stack, Heading, Flex, Box, Switch } from '@chakra-ui/react';

import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

import { ChakraCanvas, ChakraWebcam } from '../components/Webcam';
import { useCallback, useEffect, useRef, useState } from 'react';
import { drawHand, drawRect } from '../lib/useDetect';

const Home: NextPage = () => {
  const webcamRef = useRef<HTMLVideoElement | any>(null);
  const canvasRef = useRef<HTMLCanvasElement | any>(null);
  const [isHandposeReady, setIsHandposeReady] = useState(false);
  const [gesture, setGesture] = useState(null);
  const [drawHandPrediction, setDrawHandPrediction] = useState(false);

  const initHandpose = useCallback(async () => {
    const net = await tf.loadLayersModel('https://astonhack2021.vercel.app/model/model.json');
    const handposeModel = await handpose.load();
    setIsHandposeReady(true);
    setInterval(async () => {
      await detectGesture(net, handposeModel);
    }, 16.7);
  }, []);

  const detectGesture = async (net: tf.LayersModel | any, handposeModel: handpose.HandPose | any) => {
    if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast('int32');
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);
      console.log(obj);

      const boxes = await obj[1].array();
      const classes = await obj[2].array();
      const scores = await obj[4].array();
      const ctx = canvas.getContext('2d');
      // drawHandPrediction && drawHand(await handposeModel.estimateHands(video), ctx);
        
      requestAnimationFrame(() => {
        drawRect(boxes[0], classes[0], scores[0], 0.7, videoWidth, videoHeight, ctx);
      });

      tf.dispose([img, resized, casted, expanded, obj]);
    }
  }

  useEffect(() => {
    initHandpose();
  }, [initHandpose])

  return (
    <Flex direction={"column"}>
      <Flex
        position={'relative'}
        align='center'
        justify='center'
        w={'100%'}
        h={'75vh'}
      // transform={"scaleX(-1)"}
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
          filter={gesture === 'middleFinger' ? 'blur(10px)' : 'none'}
          h={'100%'}
        />
        {!isHandposeReady && <Box>
          <Heading
          // transform={"scaleX(-1)"}
          >Loading...</Heading>
        </Box>}
        <ChakraCanvas
          ref={canvasRef}
          position={'absolute'}
          top={0}
          h={'100%'}
        />
      </Flex>
      {gesture}
      <Switch colorScheme='teal' size='lg' onChange={(e) => setDrawHandPrediction(e.target.checked)} />
    </Flex>
  )
}

export default Home;
