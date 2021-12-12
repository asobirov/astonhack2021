type Gest = {
    [key: number]: { name: string, color: string };
}

const gestures: Gest = {
    1: { name: 'Hello', color: 'red' },
    2: { name: 'Thank You', color: 'yellow' },
    3: { name: 'I Love You', color: 'lime' },
    4: { name: 'Yes', color: 'blue' },
    5: { name: 'No', color: 'purple' },
};

const fingerJoints: any = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};
export const drawRect = (boxes: any, classes: any, scores: any, threshold: any, imgWidth: any, imgHeight: any, ctx: any) => {
    for (let i = 0; i <= boxes.length; i++) {
        if (boxes[i] && classes[i] && scores[i] > threshold) {
            // Extract variables
            const [y, x, height, width] = boxes[i]
            const text = classes[i]

            // Set styling
            ctx.strokeStyle = gestures[text]['color']
            ctx.lineWidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'

            // DRAW!!
            ctx.beginPath()
            ctx.fillText(gestures[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 10)
            ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 1.5);
            ctx.stroke()

        }
    }
}


export const drawHand = (predictions: any, ctx: any) => {
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
