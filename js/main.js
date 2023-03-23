const FACE = {};

FACE.EXPRESSION = () => {
  const cameraArea = document.getElementById('cameraArea'),
    camera = document.getElementById('camera'),
    canvas = document.getElementById('canvas'),
    emoticon = document.getElementById('emoticon'),
    ctx = canvas.getContext('2d'),
    canvasW = 640,
    canvasH = 480,
    intervalTime = 500;

  const init = async () => {
    setCanvas();
    setCamera();
    await faceapi.nets.tinyFaceDetector.load("js/weights/");
    await faceapi.nets.faceExpressionNet.load("js/weights/");
  },

  setCanvas = () => {
    canvas.width = canvasW;
    canvas.height = canvasH;
  },

  setCamera = async () => {
    var constraints = {
      audio: false,
      video: {
        width: canvasW,
        height: canvasH,
        facingMode: 'user'
      }
    };
    await navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        camera.srcObject = stream;
        camera.onloadedmetadata = (e) => {
          playCamera();
        };
      })
      .catch((err) => {
        console.log(err.name + ': ' + err.message);
      });
  },

  playCamera = () => {
    camera.play();
    setInterval(async () => {
      canvas.getContext('2d').clearRect(0, 0, canvasW, canvasH);
      checkFace();
    }, intervalTime);
  },

  checkFace = async () => {
    let faceData = await faceapi.detectAllFaces(
      camera, new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions();
    if (faceData.length) {
      const setDetection = () => {
        let box = faceData[0].detection.box;
        x = box.x,
        y = box.y,
        w = box.width,
        h = box.height;

        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.strokeStyle = '#4169e1';
        ctx.lineWidth = 2;
        ctx.stroke();
      },

        setExpressions = () => {
          let expressions = faceData[0].expressions;
          let smileProb = expressions['happy'];//ここで笑顔のみに絞っています。
          let smileScore = Math.round(smileProb * 100);//小数なので100をかけて四捨五入して整数に変換しています。
          console.log(`笑顔度：${smileScore}`);//コンソールログに表示する内容です。
        };
      setDetection();
      setExpressions();
    }
  };


  init();
};
FACE.EXPRESSION();
