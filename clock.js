window.onload = function () {
    //获取上下文对象
    var canvas = document.getElementById('myClock');
    var con = canvas.getContext('2d');
    var currentPostion = 0;
    //自定义函数---画表盘，针
    function toDraw() {
        //定义原点和半径
        var x = 400;
        var y = 400;
        var r = 150;
        //绘制秒刻度开始
        con.beginPath();
        for (var i = 0; i < 60; i++) {
            con.moveTo(x, y);//以圆心为起点
            con.arc(x, y, r, 6 * i * Math.PI / 180, 6 * (i + 1) * Math.PI / 180);//绘制一段6°的圆弧
        }
        con.closePath(); //为了不影响其他绘图，加上起始路径
        con.stroke();
        //较小的白色圆盘
        con.fillStyle = '#fff';
        con.beginPath();
        con.moveTo(x, y);
        con.arc(x, y, 0.95 * r, 0, 2 * Math.PI);
        con.closePath();
        con.fill(); //实心圆
        //绘制秒刻度结束
        //同理绘制小时刻度
        con.beginPath();
        con.lineWidth = 4; //加粗小时刻度
        for (var i = 0; i < 12; i++) {
            con.moveTo(x, y);
            con.arc(x, y, r, 30 * i * Math.PI / 180, 30 * (i + 1) * Math.PI / 180);
        }
        con.closePath(); //为了不影响其他绘图，加上起始路径
        con.stroke();
        //较小的白色圆盘
        con.fillStyle = '#fff';
        con.beginPath();
        con.moveTo(x, y);
        con.arc(x, y, 0.85 * r, 0, 2 * Math.PI);
        con.closePath();
        con.fill();
        //绘制小时刻度结束

        //获取当前系统时间
        var today = new Date();
        var hh = today.getHours();
        var mm = today.getMinutes();
        var ss = today.getSeconds();
        document.getElementById('showDate').innerHTML = hh+':'+mm+':'+ss;
        //时针对应的弧度
        var hhVal = (-90 + hh * 30 + mm / 2) * Math.PI / 180;
        var mmVal = (-90 + mm * 6) * Math.PI / 180;
        var ssVal = (-90 + ss * 6) * Math.PI / 180;
        //开始绘制时、分、秒针(注意：考虑到针要以原点为中心旋转)
        con.lineWidth = 5; //时针
        con.beginPath();
        con.moveTo(x, y);
        con.arc(x, y, 0.5 * r, hhVal, hhVal);
        con.closePath();
        con.stroke();
        con.lineWidth = 3; //分针
        con.beginPath();
        con.moveTo(x, y);
        con.arc(x, y, 0.65 * r, mmVal, mmVal);
        con.closePath();
        con.stroke();
        con.lineWidth = 1; //秒针
        con.beginPath();
        con.moveTo(x, y);
        con.arc(x, y, 0.8 * r, ssVal, ssVal);
        con.closePath();
        con.stroke();
        // var ssVal = (360/2056) * (currentPostion % 2056) * Math.PI / 180;
        // con.lineWidth = 1; //秒针
        // con.beginPath();
        // con.moveTo(x, y);
        // con.arc(x, y, 0.8 * r, ssVal, ssVal);
        // con.closePath();
        // con.stroke();
        // currentPostion--;
    }
    
    //每隔1秒调用一次函数
    setInterval(toDraw, 10);
}