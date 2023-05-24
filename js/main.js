console.log("\n %c HeoMusic 开源静态音乐播放器 v1.5 %c https://github.com/zhheo/HeoMusic \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;")
var volume = 0.8;

// 获取地址栏参数
// 创建URLSearchParams对象并传入URL中的查询字符串
const params = new URLSearchParams(window.location.search);

var heo = {
  // 音乐节目切换背景
  changeMusicBg: function (isChangeBg = true) {
    const heoMusicBg = document.getElementById("music_bg");

    if (isChangeBg) {
      // player loadeddata 会进入此处
      const musiccover = document.querySelector("#heoMusic-page .aplayer-pic");
      const img = new Image();
      img.src = extractValue(musiccover.style.backgroundImage);
      img.crossOrigin = "anonymous";
      img.onload = function() {
        heoMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
        
        // 转发获取图片资源，解决跨域问题
        const imgUrl = img.src;  // 图片 URL

        // const proxyUrl = "https://api.guole.fun/image-proxy?url=";  // 代理服务器的 URL
        // getDominantColor(proxyUrl + encodeURIComponent(imgUrl))
        
        getDominantColor(imgUrl)
          .then((color) => {
            console.log("当前提取到的歌曲封面主题色为:", color);
            heo.setBodyBackgroundColor(color);
          })
          .catch((error) => {
            console.error("错误:", error);
          });
      };
    } else {
      // 第一次进入，绑定事件，改背景
      let timer = setInterval(()=>{
        const musiccover = document.querySelector("#heoMusic-page .aplayer-pic");
        // 确保player加载完成
        if (musiccover) {
          clearInterval(timer);
          //初始化音量
          document.querySelector('meting-js').aplayer.volume(0.8,true);
          // 绑定事件
          heo.addEventListenerChangeMusicBg();
        }
      }, 100);
    }
  },
  addEventListenerChangeMusicBg: function () {
    const heoMusicPage = document.getElementById("heoMusic-page");
    heoMusicPage.querySelector("meting-js").aplayer.on('loadeddata', function () {
      heo.changeMusicBg();
    });
  },
  setBodyBackgroundColor: function (color) {
    let body = document.body;
    body.style.background = color;
    // 设置 iOS 状态栏颜色
    console.log('设置状态栏颜色：' + color)
    let statusBarMeta = document.querySelector('#status-bar-meta');
    statusBarMeta.setAttribute('content', color);
  },
  getCustomPlayList: function() {
    const heoMusicPage = document.getElementById("heoMusic-page");
    const playlistType = params.get("type") || "playlist";
    
    if (params.get("id") && params.get("server")) {
      console.log("获取到自定义内容");
      var id = params.get("id");
      var server = params.get("server");
      heoMusicPage.innerHTML = `<meting-js id="${id}" server="${server}" type="${playlistType}" mutex="true" preload="auto" order="random"></meting-js>`;
    } else {
      console.log("无自定义内容");
      heoMusicPage.innerHTML = `<meting-js id="${userId}" server="${userServer}" type="${userType}" mutex="true" preload="auto" order="random"></meting-js>`;
    }
    heo.changeMusicBg(false);
  }
};

// 调用
heo.getCustomPlayList();


// 改进vh
const vh = window.innerHeight * 1;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 1;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

//获取图片url
function extractValue(input) {
  var valueRegex = /\("([^\s]+)"\)/g;
  var match = valueRegex.exec(input);
  return match[1];
}

//歌曲封面获取主题色
function getDominantColor(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      // 绘制图像到画布
      context.drawImage(img, 0, 0);

      // 获取图像像素数据
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

      // 统计像素颜色值
      const colorMap = {};
      let maxCount = 0;
      let dominantColor = null;

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const rgb = `${r},${g},${b}`;

        if (!colorMap[rgb]) {
          colorMap[rgb] = 0;
        }

        colorMap[rgb] += 1;

        if (colorMap[rgb] > maxCount) {
          maxCount = colorMap[rgb];
          dominantColor = rgb;
        }
      }

      if (dominantColor) {
        var color = `rgb(${dominantColor})`;
        if (getBrightness(color) > 210) {
          color = 'rgb(165,165,165)'
        };
        resolve(color);
      } else {
        reject(new Error("无法计算主题色。"));
      }
    };

    img.onerror = function () {
      reject(new Error("加载图像失败。"));
    };
  });
}

// 判断颜色明暗
// 165 是中间值，大于165，是亮色，否则是暗色
function getBrightness(rgbColor) {
  // 将 RGB 颜色字符串转换成数组
  var rgb = rgbColor.replace(/[^\d,]/g, '').split(',');

  // 计算亮度
  var brightness = Math.round(((parseInt(rgb[0]) * 299) +
    (parseInt(rgb[1]) * 587) +
    (parseInt(rgb[2]) * 114)) / 1000);
  return brightness;
}

//空格控制音乐
document.addEventListener("keydown", function(event) {
  //暂停开启音乐
  if (event.code === "Space") {
    event.preventDefault();
    document.querySelector('meting-js').aplayer.toggle();
  };
  //切换下一曲
  if (event.keyCode === 39) {
    event.preventDefault();
    document.querySelector('meting-js').aplayer.skipForward();
  };
  //切换上一曲
  if (event.keyCode === 37) {
    event.preventDefault();
    document.querySelector('meting-js').aplayer.skipBack();
  }
  //增加音量
  if (event.keyCode === 38) {
    if (volume <= 1) {
      volume += 0.1;
      document.querySelector('meting-js').aplayer.volume(volume,true);
    }
  }
  //减小音量
  if (event.keyCode === 40) {
    if (volume >= 0) {
      volume += -0.1;
      document.querySelector('meting-js').aplayer.volume(volume,true);
    }
  }
});