import * as fingerpose from "fingerpose";
import { FingerJoints } from "./types";

const fingerJoints: any = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

export const detect = async (net: any, webRef: any, canvasRef: any) => {

    // check data
    if (typeof webRef.current !== 'undefined' && webRef.current !== null && webRef.current.video.readyState === 4) {
        const video = webRef.current.video;
        const canvas = canvasRef.current;

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const hand = await net.estimateHands(video);
        // console.log(hand);

        // if (hand.length > 0) {
        //     const GE = new fingerpose.GestureEstimation([
        //         fingerpose.Gestures.VictoryGesture,
        //         fingerpose.Gestures.ThumbUpGesture,
        //     ]);

        //     const gesture = await GE.estimate(hand[0].landmarks, 8);
        //     console.log(gesture);
        // }

        const ctx = canvas.getContext('2d');
        drawHand(hand, ctx);

    }
}

const drawHand = (predictions: any, ctx: any) => {
    if (predictions.length > 0) {
        predictions.forEach((prediction: any) => {
            const landmarks = prediction.landmarks;
            for (let i = 0; i < Object.keys(fingerJoints).length; i++) {
                let finger = Object.keys(fingerJoints)[i];
                for (let j = 0; j < fingerJoints[finger].length - 1; j++) {
                    const first = landmarks[fingerJoints[finger][j]];
                    const second = landmarks[fingerJoints[finger][j + 1]];
                    ctx.beginPath();
                    ctx.moveTo(first[0], first[1]);
                    ctx.lineTo(second[0], second[1]);
                    
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
                landmarks.forEach((landmark: any) => {
                    const x = landmark[0];
                    const y = landmark[1];

                    ctx.beginPath();
                    ctx.arc(x, y, 8, 0, 8 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                });
            });
    }
}