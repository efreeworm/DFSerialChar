// 本部分代码采用websocket通信
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    x_axis = canvas.getContext('2d'),

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
    x_rectangle = {
        x: 20,
        width: 1800,
        y: 150,
        height: canvas.height / 3
    },
    circle = {
        x: canvas.width / 1.4,
        y: canvas.height / 2,
        radius: 100
    };

//X轴示意图
class X_axis {
    static drawDial() {
        X_axis.drawRectangle();
        X_axis.drawTicks();
    }

    static drawRectangle() {
        x_axis.beginPath();
        x_axis.save();
        x_axis.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        //x_axis.strokeStyle = CENTROID_STROKE_STYLE;
        // x_axis.fillStyle = CENTROID_FILL_STYLE;
        x_axis.fillRect(x_rectangle.x, x_rectangle.y, x_rectangle.width, x_rectangle.height);
        x_axis.strokeRect(x_rectangle.x, x_rectangle.y, x_rectangle.width, x_rectangle.height);
        x_axis.fill();
        x_axis.restore();
    }

    /**
     * 绘制刻度
     * @param {*} cnt 
     */
    static drawTick(width, cnt) {
        var tickWidth = cnt % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
        //console.log(tickWidth,width)
        x_axis.lineWidth = cnt % 5 === 0 ? 1.5 : 1;
        x_axis.strokeStyle = TICK_SHORT_STROKE_STYLE;
        x_axis.beginPath();
        x_axis.setLineDash([]);
        x_axis.moveTo(30 + width, x_rectangle.y);
        x_axis.lineTo(30 + width, x_rectangle.y + tickWidth);
        x_axis.stroke();
    }

    /**
     * 绘制刻度
     */
    static drawTicks() {
        var tickWidth = 5;

        x_axis.save();

        for (var width = 0, cnt = 0; width < x_rectangle.width - 20; width += tickWidth, cnt++) {
            X_axis.drawTick(width, cnt++);
        }

        x_axis.restore();
    }
}

// Y轴示意图
class Y_axis {
    // Functions..........................................................
    /**
     * 绘制背景网格
     * @param {*} color 
     * @param {*} stepx 
     * @param {*} stepy 
     */
    static drawGrid(color, stepx, stepy) {
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
    static drawDial() {
        var loc = {
            x: circle.x,
            y: circle.y
        };

        Y_axis.drawCentroid();
        Y_axis.drawCentroidGuidewire(loc);

        Y_axis.drawRing();
        Y_axis.drawTickInnerCircle();
        Y_axis.drawTicks();
        Y_axis.drawAnnotations();
    }

    /**
     * 绘制中心点
     */
    static drawCentroid() {
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
    static drawCentroidGuidewire(loc) {

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
    static drawRing() {
        Y_axis.drawRingOuterCircle();

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
    static drawRingOuterCircle() {
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
    static drawTickInnerCircle() {
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
    static drawTick(angle, radius, cnt) {
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
    static drawTicks() {
        var radius = circle.radius + RING_INNER_RADIUS,
            ANGLE_MAX = 2 * Math.PI,
            ANGLE_DELTA = Math.PI / 64,
            tickWidth;

        context.save();

        for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
            Y_axis.drawTick(angle, radius, cnt++);
        }

        context.restore();
    }

    /**
     * 绘制度数注释
     */
    static drawAnnotations() {
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
}

// Initialization Char....................................................

context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;

context.textAlign = 'center';
context.textBaseline = 'middle';
Y_axis.drawGrid('lightgray', 10, 10);
X_axis.drawRectangle();
//drawDial();
//startRead();
// setInterval(function () {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     drawGrid('lightgray', 10, 10);
//     drawDial();
// }, 10);

// 图表部分结束

// websocket 部分
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
    Y_axis.drawGrid('lightgray', 10, 10);
    Y_axis.drawDial();
    X_axis.drawDial();
}
document.getElementById("sendb").onclick = function () { // 监测 id=“sendb”的 按钮 触发 onclick 就会发送数据 send //
    var txt = document.getElementById("snedTxt").value;
    ws.send(txt);
}