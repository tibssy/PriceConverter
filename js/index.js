function openCvReady() {
  cv["onRuntimeInitialized"] = () => {
    let img = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let thresh = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let median = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let M = cv.Mat.ones(5, 5, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
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
      cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
      cv.medianBlur(thresh, median, 5);
      cv.erode(median, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());


      dst = auto_inv(dst);
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
  return reshaped.slice(1).map(i => i.slice(0, 4));
}

function auto_inv(dst) {
  Math.round(cv.countNonZero(dst) / (dst.cols * dst.rows) * 100) > 50 ? cv.bitwise_not(dst, dst) : false;
  return dst;
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
