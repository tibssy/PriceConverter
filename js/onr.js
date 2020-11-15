function resize_image(roi) {
    let roi_w = roi.cols;
    let roi_h = roi.rows;
    let left_w = roi_w % grid_x;
    let left_h = roi_h % grid_y;
    left_w != 0 ? roi_w = roi_w + (grid_x - left_w) : false;
    left_h != 0 ? roi_h = roi_h + (grid_y - left_h) : false;
    let dsize = new cv.Size(roi_w, roi_h);
    cv.resize(roi, roi, dsize, 0, 0, cv.INTER_AREA);
    cv.threshold(roi, roi, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    return roi;
}

function image_to_data(img) {
    let res = [];
    let out = new cv.Mat();
    let img_w = img.cols
    let img_h = img.rows
    let step_w = img_w / grid_x;
    let step_h = img_h / grid_y;
    let slice_x = math.range(0, img_w, step_w)._data;
    let slice_y = math.range(0, img_h, step_h)._data;
    slice_y.forEach(i => {
        slice_x.forEach(j => {
            let rect = new cv.Rect(j, i, step_w, step_h);
            out = img.roi(rect);
            let white = cv.countNonZero(out);
            let pixel_num = step_w * step_h;
            let rate = math.round(white / pixel_num * 100);
            res.push(rate);
        });
    });
    return res;
}

function normalize(arr) {
    const minimum = math.min(arr);
    const maximum = math.max(arr);
    minimum != 0 ? arr = arr.map(x => x - minimum) : false;
    maximum != 100 ? arr = math.round(arr.map(x => x / maximum * 100)) : false;
    return arr;

}

function decoder(data) {
    res = [];
    model.forEach(val => {
        val = val.slice(1);
        let diff = math.sum(math.abs(math.subtract(val, data)));
        res.push(diff);
    });
    return model[res.indexOf(math.min(res))][0];
}

function detect(data) {
    let resized = resize_image(data);
    let Image_data = image_to_data(resized);
    let normalized = normalize(Image_data);
    return decoder(normalized);
}

const model = JSON.parse(data);
const grid_x = 3;
const grid_y = 5;