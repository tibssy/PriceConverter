function openCvReady() {
  cv["onRuntimeInitialized"] = () => {
    let img = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let thresh = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let label = new cv.Mat();
    let stats = new cv.Mat();
    let centroids = new cv.Mat();
    let resolution = [img.cols, img.rows];
    let cap = new cv.VideoCapture(video);

    const FPS = 30;
    function processVideo() {
      let begin = Date.now();
      cap.read(img);
      cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
      cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
      cv.medianBlur(thresh, dst, 5);
      cv.connectedComponentsWithStats(dst, label, stats, centroids, 8, cv.CV_32S);

      let res = prepare_stats(stats);
      if (res.length >= 2) {
        res = filter(res, resolution);

        res.forEach(segment => {
          let point1 = new cv.Point(segment[0], segment[1]);
          let point2 = new cv.Point(segment[0] + segment[2], segment[1] + segment[3]);
          cv.rectangle(img, point1, point2, [0, 255, 0, 255], 2, cv.LINE_AA, 0);
        });
      };



      cv.imshow("canvasvideo", img);
      cv.imshow("canvasgray", dst);
      let delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
    }

    setTimeout(processVideo, 0);
  };
}


function prepare_stats(stats) {
  let cols = stats.cols;
  let rows = stats.rows;
  let arr = Array.from(stats.data32S);
  let reshaped = math.reshape(arr, [rows, cols]);
  return math.subset(reshaped, math.index(math.range(1, rows), math.range(0, 4)));
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
