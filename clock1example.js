var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    CENTROID_RADIUS = 10,
    CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)',
    CENTROID_FILL_STYLE = 'rgba(80, 190, 240, 0.6)',

    RING_INNER_RADIUS = 35,
    RING_OUTER_RADIUS = 55,

    ANNOTATIONS_FILL_STYLE = 'rgba(0, 0, 230, 0.9)',
    ANNOTATIONS_TEXT_SIZE = 12,

    TICK_WIDTH = 10,
    TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, 0.9)',
    TICK_SHORT_STROKE_STYLE = 'rgba(100, 140, 230, 0.7)',

    TRACKING_DIAL_STROKING_STYLE = 'rgba(100, 140, 230, 0.5)',

    GUIDEWIRE_STROKE_STYLE = 'goldenrod',
    GUIDEWIRE_FILL_STYLE = 'rgba(250, 250, 0, 0.6)',
    currentPostion = 0,
    circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 150
    };

// Functions..........................................................
/**
 * 绘制背景网格
 * @param {*} color 
 * @param {*} stepx 
 * @param {*} stepy 
 */
function drawGrid(color, stepx, stepy) {
    context.save();

    context.shadowColor = undefined;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.strokeStyle = color;
    context.fillStyle = '#ffffff';
    context.lineWidth = 0.5;
    context.fillRect(0, 0, context.canvas.width,
        context.canvas.height);

    for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }

    context.restore();
}

/**
 * 绘制时刻表
 */
function drawDial() {
    var loc = {
        x: circle.x,
        y: circle.y
    };

    drawCentroid();
    drawCentroidGuidewire(loc);

    drawRing();
    drawTickInnerCircle();
    drawTicks();
    drawAnnotations();
}

/**
 * 绘制中心点
 */
function drawCentroid() {
    context.beginPath();
    context.save();
    context.strokeStyle = CENTROID_STROKE_STYLE;
    context.fillStyle = CENTROID_FILL_STYLE;
    context.arc(circle.x, circle.y,
        CENTROID_RADIUS, 0, Math.PI * 2, false);
    context.stroke();
    context.fill();
    context.restore();
}

/**
 * 绘制指针线
 * @param {*} loc 
 */
function drawCentroidGuidewire(loc) {

    var angle = -Math.PI / 4,
        radius, endpt;
    angle = (360 / 2400) * (currentPostion % 2400) * Math.PI / 180;
    radius = circle.radius + RING_OUTER_RADIUS;

    if (loc.x >= circle.x) {
        endpt = {
            x: circle.x + radius * Math.cos(angle),
            y: circle.y + radius * Math.sin(angle)
        };
    } else {
        endpt = {
            x: circle.x - radius * Math.cos(angle),
            y: circle.y - radius * Math.sin(angle)
        };
    }

    context.save();

    context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
    context.fillStyle = GUIDEWIRE_FILL_STYLE;

    context.beginPath();
    context.moveTo(circle.x, circle.y);
    context.lineTo(endpt.x, endpt.y);
    context.stroke();
    currentPostion++;
    context.beginPath();
    context.strokeStyle = TICK_LONG_STROKE_STYLE;
    context.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();

    context.restore();
}

/**
 * 绘制时刻盘
 */
function drawRing() {
    drawRingOuterCircle();

    context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    context.arc(circle.x, circle.y,
        circle.radius + RING_INNER_RADIUS,
        0, Math.PI * 2, false);

    context.fillStyle = 'rgba(100, 140, 230, 0.1)';
    context.fill();
    context.stroke();
}

/**
 * 绘制时刻盘外圆
 */
function drawRingOuterCircle() {
    context.shadowColor = 'rgba(0, 0, 0, 0.7)';
    context.shadowOffsetX = 3,
        context.shadowOffsetY = 3,
        context.shadowBlur = 6,
        context.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius +
        RING_OUTER_RADIUS, 0, Math.PI * 2, true);
    context.stroke();
}

/**
 * 绘制时刻盘内圆
 */
function drawTickInnerCircle() {
    context.save();
    context.beginPath();
    context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    context.arc(circle.x, circle.y,
        circle.radius + RING_INNER_RADIUS - TICK_WIDTH,
        0, Math.PI * 2, false);
    context.stroke();
    context.restore();
}

/**
 * 绘制刻度
 * @param {*} angle 
 * @param {*} radius 
 * @param {*} cnt 
 */
function drawTick(angle, radius, cnt) {
    var tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;

    context.beginPath();

    context.moveTo(circle.x + Math.cos(angle) * (radius - tickWidth),
        circle.y + Math.sin(angle) * (radius - tickWidth));

    context.lineTo(circle.x + Math.cos(angle) * (radius),
        circle.y + Math.sin(angle) * (radius));

    context.strokeStyle = TICK_SHORT_STROKE_STYLE;
    context.stroke();
}

/**
 * 绘制刻度
 */
function drawTicks() {
    var radius = circle.radius + RING_INNER_RADIUS,
        ANGLE_MAX = 2 * Math.PI,
        ANGLE_DELTA = Math.PI / 64,
        tickWidth;

    context.save();

    for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
        drawTick(angle, radius, cnt++);
    }

    context.restore();
}

/**
 * 绘制度数注释
 */
function drawAnnotations() {
    var radius = circle.radius + RING_INNER_RADIUS;

    context.save();
    context.fillStyle = ANNOTATIONS_FILL_STYLE;
    context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';

    for (var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
        context.beginPath();
        context.fillText((angle * 180 / Math.PI).toFixed(0),
            circle.x + Math.cos(angle) * (radius - TICK_WIDTH * 2),
            circle.y - Math.sin(angle) * (radius - TICK_WIDTH * 2));
    }
    context.restore();
}

var ws = new WebSocket("ws://localhost:8080/"); // 设置服务器地址 //
ws.onopen = function () { // onopen 连接触发 //
    console.log("websocket open");
    document.getElementById("recv").innerHTML = "Connected";
    //  innerHTML 可以 获取 也可以 插入  //

}
ws.onclose = function () { // onclose 断开触发 //
    console.log("websocket close");
}
ws.onmessage = function (e) { // onmessage 接收到信息触发  //
    console.log(e.data);
    document.getElementById("recv").innerHTML = e.data;
    currentPostion = e.data;
    // 重绘指针位置
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid('lightgray', 10, 10);
    drawDial();
}
document.getElementById("sendb").onclick = function () { // 监测 id=“sendb”的 按钮 触发 onclick 就会发送数据 send //
    var txt = document.getElementById("snedTxt").value;
    ws.send(txt);
}

var serverURL = 'http://127.0.0.1:23456/';
// data sampling function interval object
var intervalObj;
// serial read frequency
var samplingSpeed = 100;
var updating = true;

function startRead() {
    stopRead();
    intervalObj = setInterval(function () {

        $.get(serverURL + "read", {
            "_ts": $.now()
        }, function (lines) {

            // if (needInit) {
            //   initCanvas(lines);
            // }

            // if (!initFinished) {
            //   return;
            // }

            populateData(lines);
            // console.log(dataPoints);
            //chart.render();
        });
    }, samplingSpeed);
}

function populateData(lines) {
    // console.log(lines);
    lines.forEach(function (data) {
        if (!data || data.length === 0 || data === '""' || !updating) {
            console.log("no data");
            return;
        }
        var array = data.split(',');
        console.log(array);
        if (array[0] !== "d2")
            return;
        currentPostion = array[1];
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid('lightgray', 10, 10);
        drawDial();
        return;

        var counter = 0;
        var columns = array.forEach(function (elem) {
            dataPoints[counter] = dataPoints[counter] || {
                type: "line",
                showInLegend: true,
                toolTipContent: "{name}: x={x}, y={y}",
                dataPoints: []
            };
            dataPoints[counter].dataPoints.push({
                x: xAxisCounter,
                y: parseFloat(elem)
            });

            // shift if length too long
            var length = dataPoints[counter].dataPoints.length;
            if (length > config.maxLength) {
                dataPoints[counter].dataPoints = dataPoints[counter].dataPoints.splice(length -
                    config.maxLength, config.maxLength);
            }

            counter++;
        });
        xAxisCounter++;
    });
}

function stopRead() {
    if (intervalObj) {
        clearInterval(intervalObj);
        intervalObj = null;
    }
}
// Initialization....................................................

context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;

context.textAlign = 'center';
context.textBaseline = 'middle';
drawGrid('lightgray', 10, 10);
//drawDial();
//startRead();
// setInterval(function () {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     drawGrid('lightgray', 10, 10);
//     drawDial();
// }, 10);