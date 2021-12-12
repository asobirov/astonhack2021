import * as fp from "fingerpose";

const fingerJoints: any = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

export const detect = async (net: any, webRef: any, canvasRef: any, setGesture: any) => {

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

        if (hand.length > 0) {
            const middleFingerGesture = new fp.GestureDescription("middleFinger");
            middleFingerGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl);
            for (let finger of [fp.Finger.Index, fp.Finger.Ring, fp.Finger.Pinky]) {
                middleFingerGesture.addCurl(finger, fp.FingerCurl.FullCurl, 0);
                middleFingerGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.6);
            }

            const okGesture = new fp.GestureDescription("okGesture");
            for (let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                middleFingerGesture.addCurl(finger, fp.FingerCurl.NoCurl);
                middleFingerGesture.addCurl(finger, fp.FingerCurl.HalfCurl);
            }
            okGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1);
            okGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 0.9);
            okGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1);
            okGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 0.9);

            const GE = new fp.GestureEstimator([
                fp.Gestures.ThumbsUpGesture,
                okGesture,
                // middleFingerGesture,
            ]);
            const gesture = await GE.estimate(hand[0].landmarks, 8);
            // console.log(gesture);
            if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
                console.log(gesture.gestures);

                const confidence = gesture.gestures.map(
                    (prediction: any) => {
                        console.log(prediction.score);
                        return prediction.score;
                    }
                );
                const maxConfidence = confidence.indexOf(
                    Math.max.apply(null, confidence)
                );
                setGesture(gesture.gestures[maxConfidence].name);
            } else {
                setGesture(null);
            }
        }

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