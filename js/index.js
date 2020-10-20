

function openCvReady() {
  cv["onRuntimeInitialized"] = () => {
    let img = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let thres = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    //   let blure = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let M = cv.Mat.eye(3, 3, cv.CV_32FC1);
    //   let ME = cv.Mat.ones(5, 5, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    let cap = new cv.VideoCapture(video);

    const FPS = 1;
    function processVideo() {
      let begin = Date.now();
      cap.read(img);
      cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
      cv.threshold(gray, thres, 120, 255, cv.THRESH_BINARY);
      cv.filter2D(thres, dst, cv.CV_8U, M, anchor, 0, cv.BORDER_DEFAULT);
      //    cv.erode(blure, dst, ME, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
      cv.imshow("canvasgray", dst);
      let delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
      ocr();
    }
    setTimeout(processVideo, 0);
  };
}

// the code starts here
console.log(navigator.mediaDevices.enumerateDevices());
let video = document.getElementById("videoInput");
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" }, audio: false })
  .then(function (stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function (err) {
    console.log("An error occurred! " + err);
  });

openCvReady();

function ocr() {
  let image = document.getElementById("canvasgray");
  Tesseract.recognize(image, 'eng').then(({ data: { text } }) => {
    console.log("text", text);
    document.getElementById("result").innerHTML = text;
  });
}