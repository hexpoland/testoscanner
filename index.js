const canvasOnPage = document.querySelector("#canvas");
const canvatest = document.querySelector("#canvastest");
const canva2 = canvatest.getContext("2d");
const canva = canvasOnPage.getContext("2d");
const debugInfo = document.querySelector("#debugInfo");
const video = document.querySelector("#video");
const scanButton = document.querySelector("#scan-button");
var jsonresult;
async function dataFromCamera() {
  var resultData1;
  var tracks;
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
      video: {
        facingMode: "enviroment",
        frameRate: 20,
      },
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      tracks = stream.getTracks();
      console.log(tracks);
      // debugInfo.innerHTML = "OK done";
    })
    .catch((err) => {
      debugInfo.innerHTML = err;
    });
  video.addEventListener("play", function () {
    let intervalId = setInterval(() => {
      canva.drawImage(video, 0, 0, video.width, video.height);
      const e = canva.getImageData(0, 0, video.width, video.height);
      canva2.putImageData(e, 0, 0, 0, 0, 400, 300);
      const e2 = canva2.getImageData(0, 0, 400, 300);
      const code = jsQR(e2.data, e2.width, e2.height);
      if (code) {
        console.log(e);
        console.log("detected");
        debugInfo.innerHTML = "Znaleziono qr code";
        const testoData = pako.inflate(code.binaryData);
        testoData.map((el) => {
          resultData1 = resultData1 + String.fromCharCode(el);
        });

        debugInfo.innerHTML = JSON.stringify(resultData1);
        clearInterval(intervalId);
      }
    }, 100);
    //clearInterval(intervalId);
  });
}
dataFromCamera();
async function imageDataFromSource(source) {
  const image = Object.assign(new Image(), { src: source });
  await new Promise((resolve) =>
    image.addEventListener("load", () => resolve()),
  );
  const context = Object.assign(document.createElement("canvas"), {
    width: image.width,
    height: image.height,
  }).getContext("2d");
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

imageDataFromSource("assets/example2.png").then((e) => {
  var resultData;
  console.log(e);
  const code = jsQR(e.data, e.width, e.height);
  if (code) {
    console.log(code);
    const testoData = pako.inflate(code.binaryData);
    testoData.map((el) => {
      resultData = resultData + String.fromCharCode(el);
    });
    console.log(resultData.slice(9));
    jsonresult = JSON.parse(JSON.stringify(resultData.slice(9)));
    debugInfo.innerHTML = jsonresult;
  }
});
scanButton.addEventListener("click", function () {
  dataFromCamera();
});
