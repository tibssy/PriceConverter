function openCvReady() {
  cv["onRuntimeInitialized"] = () => {
    let img = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let thres = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let M = cv.Mat.eye(3, 3, cv.CV_32FC1);
    let anchor = new cv.Point(-1, -1);
    let cap = new cv.VideoCapture(video);

    const FPS = 30;
    function processVideo() {
      let begin = Date.now();
      cap.read(img);
      cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
      cv.threshold(gray, thres, 130, 255, cv.THRESH_BINARY);
      cv.filter2D(thres, dst, cv.CV_8U, M, anchor, 0, cv.BORDER_DEFAULT);
      cv.imshow("canvasgray", dst);
      console.log(dst);
      let delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
    }

    setTimeout(processVideo, 0);
  };
}

// the code starts here
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

//Set.prototype.add(value)
