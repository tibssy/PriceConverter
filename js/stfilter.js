function filter(stats, resolution) {
    function edge_filter(stats, resolution) {
        let arr = [];
        stats.forEach(element => {
            element.includes(0) || resolution[0] - element[0] - element[2] == 0 || resolution[1] - element[1] - element[3] == 0 ? true : arr.push(element);
        });
        return arr;
    }

    function size_filter(stats) {
        let arr = [];
        stats.forEach(segment => {
            max_height - segment[3] <= frame_limit ? arr.push(segment) : false;
        });
        return arr;
    }

    function filter_c(stats) {
        let arr = [];
        let big = size_filter(stats);
        let y = math.column(big, 1);
        let left = math.min(math.column(big, 0));
        let top = math.min(y) - frame_limit;
        let bottom = math.max(y) + math.max(math.column(big, 3)) + frame_limit;
        stats.forEach(segment => {
            segment[0] >= left && segment[1] > top && segment[1] + segment[3] < bottom ? arr.push(segment) : false;
        });
        return arr;
    }

    function filter_tiny(stats) {
        let arr = [];
        stats.forEach(segment => {
            segment[2] > frame_limit || segment[3] > frame_limit ? arr.push(segment) : false;
        });
        return arr;
    }

    function filter_right(stats) {
        stats.sort(function (a, b) {
            return a[0] - b[0];
        });
        const next_char = math.column(stats, 0).slice(1);
        const char_l = math.column(stats, 0).slice(0, -1);
        const char_w = math.column(stats, 2).slice(0, -1);
        const char_r = math.dotMultiply(math.add(char_l, char_w), -1);
        const distance = math.add(next_char, char_r);
        const isLargeNumber = (element) => element > space_limit;
        let index = distance.findIndex(isLargeNumber);
        index != -1 ? stats = stats.slice(0, index + 1) : false;
        return stats;
    }


    let size = math.size(stats);

    stats = edge_filter(stats, resolution);
    let max_height = 0;
    let frame_limit = 0;
    let space_limit = 0;

    if (stats.length >= 2) {
        max_height = math.max(math.column(stats, 3));
        frame_limit = max_height / 10;
        space_limit = frame_limit * 3.5;
        stats = filter_c(stats);
        if (stats.length >= 2) {
            stats = filter_tiny(stats);
            if (stats.length >= 2) {
                stats = filter_right(stats);
            }
        }
    }

    return stats;
}