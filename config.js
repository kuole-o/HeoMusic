var userId = "312821716"; //8668419170
var userServer = "netease"; //tencent
var userType = "playlist";
// var localMusic = [{
//     name: '重生之我在异乡为异客',
//     artist: '王睿卓',
//     url: '/music/重生之我在异乡为异客.mp3',
//     cover: '/music/重生之我在异乡为异客.png',
//     lrc: '/music/重生之我在异乡为异客.lrc'
// },
// {
//     name: '落',
//     artist: '唐伯虎',
//     url: '/music/落.mp3',
//     cover: '/music/落.png',
//     lrc: '/music/落.lrc'
// }
// ];
var remoteMusic = "./music_list.json"

//注册pwa
function showNotification() {
  if (GLOBAL_CONFIG.Snackbar) {
    var t = "light" === document.documentElement.getAttribute("data-theme") ? GLOBAL_CONFIG.Snackbar.bgLight : GLOBAL_CONFIG.Snackbar.bgDark,
      e = GLOBAL_CONFIG.Snackbar.position;
    Snackbar.show({
      text: "✨网站已更新最新版本&nbsp;👉",
      backgroundColor: t,
      duration: 5e5,
      pos: e,
      actionText: "点击刷新",
      actionTextColor: "#fff",
      onActionClick: function (t) {
        location.reload()
      }
    })
  } else {
    var o = `top: 0;
          background: $ {
            "light" === document.documentElement.getAttribute("data-theme") ? "#49b1f5": "#1f1f1f"
          };`;
    document.getElementById("app-refresh").style.cssText = o
  }
}
"serviceWorker" in navigator && (navigator.serviceWorker.controller && navigator.serviceWorker.addEventListener("controllerchange",
  function () {
    showNotification()
  }), window.addEventListener("load",
    function () {
      navigator.serviceWorker.register("/sw.js")
    }));