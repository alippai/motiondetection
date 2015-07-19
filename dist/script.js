"use strict";

var watchers = {};

function init() {
  "use strict";
  var scale = 0.5;

  var videoFile = document.getElementById("uploadInput").files[0];
  var leftMoves = files[videoFile.name.replace(".mp4", "")].left;
  var rightMoves = files[videoFile.name.replace(".mp4", "")].right;
  var leftPositions = files[videoFile.name.replace(".mp4", "")].leftPosition;
  var rightPositions = files[videoFile.name.replace(".mp4", "")].rightPosition;
  for (var i = 0; i < 240; i++) {
    $("#result tbody").append("\n      <tr id=\"event-" + i + "\">\n        <th>#" + (i + 1) + ", " + leftMoves[i] + "</th>\n        <td class=\"leftResult\"></td>\n        <th>#" + (i + 1) + ", " + rightMoves[i] + "</th>\n        <td class=\"rightResult\"></td>\n      </tr>\n    ");
  }
  var videoURL = URL.createObjectURL(videoFile);
  var player = document.getElementById("player");
  var cropperElem = null;
  var leftResults = [];
  var rightResults = [];

  player.src = videoURL;

  var c2 = document.getElementById("c2");
  var ctx2 = c2.getContext("2d");

  player.addEventListener("canplay", function () {
    $("#uploadInput").hide();
    player.currentTime = 0.05; // Triggers seek

    $("#container").width(player.videoWidth * scale);

    c2.width = player.videoWidth * scale;
    c2.height = player.videoHeight * scale;
  });

  player.addEventListener("seeked", function () {
    ctx2.drawImage(player, 0, 0, c2.width, c2.height);

    /*addWatcher('LH', {"left":97,"top":134,"width":89,"height":34});
    $('.left-hand .position').text(JSON.stringify({"left":97,"top":134,"width":89,"height":34}));
    addWatcher('CH', {"left":205,"top":149,"width":79,"height":46});
    $('.center-hand .position').text(JSON.stringify({"left":205,"top":149,"width":79,"height":46}));
    addWatcher('RH', {"left":310,"top":137,"width":85,"height":30});
    $('.right-hand .position').text(JSON.stringify({"left":310,"top":137,"width":85,"height":30}));
    addWatcher('LF', {"left":169,"top":302,"width":39,"height":158});
    $('.left-foot .position').text(JSON.stringify({"left":169,"top":302,"width":39,"height":158}));
    addWatcher('CF', {"left":183,"top":469,"width":105,"height":30});
    $('.center-foot .position').text(JSON.stringify({"left":183,"top":469,"width":105,"height":30}));
    addWatcher('RF', {"left":294,"top":322,"width":50,"height":146});
    $('.right-foot .position').text(JSON.stringify({"left":294,"top":322,"width":50,"height":146}));*/

    $(".left-hand .position").text(JSON.stringify(leftPositions.LH));
    addWatcher("LLH", leftPositions.LH);
    $(".center-hand .position").text(JSON.stringify(leftPositions.CH));
    addWatcher("LCH", leftPositions.CH);
    $(".right-hand .position").text(JSON.stringify(leftPositions.RH));
    addWatcher("LRH", leftPositions.RH);
    $(".left-foot .position").text(JSON.stringify(leftPositions.LF));
    addWatcher("LLF", leftPositions.LF);
    $(".center-foot .position").text(JSON.stringify(leftPositions.CF));
    addWatcher("LCF", leftPositions.CF);
    $(".right-foot .position").text(JSON.stringify(leftPositions.RF));
    addWatcher("LRF", leftPositions.RF);

    addWatcher("RLH", rightPositions.LH);
    addWatcher("RCH", rightPositions.CH);
    addWatcher("RRH", rightPositions.RH);
    addWatcher("RLF", rightPositions.LF);
    addWatcher("RCF", rightPositions.CF);
    addWatcher("RRF", rightPositions.RF);

    cropperElem = $("#container > canvas").cropper({
      guides: false,
      center: false,
      background: false,
      movable: false,
      rotatable: false,
      zoomable: false,
      mouseWheelZoom: false,
      touchDragZoom: false,
      doubleClickToggle: false
    });

    $("#panel").show();
  }, false);
  /*
    $('.left-hand button').click(() => {
      const data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
      cropperElem.cropper('clear');
      $('.left-hand .position').text(JSON.stringify(data));
      addWatcher('LH', data);
      return false;
    });
    $('.center-hand button').click(() => {
      const data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
      cropperElem.cropper('clear');
      $('.center-hand .position').text(JSON.stringify(data));
      addWatcher('CH', data);
      return false;
    });
    $('.right-hand button').click(() => {
      const data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
      cropperElem.cropper('clear');
      $('.right-hand .position').text(JSON.stringify(data));
      addWatcher('RH', data);
      return false;
    });
    $('.left-foot button').click(() => {
      const data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
      cropperElem.cropper('clear');
      $('.left-foot .position').text(JSON.stringify(data));
      addWatcher('LF', data);
      return false;
    });
    $('.center-foot button').click(() => {
      const data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
      cropperElem.cropper('clear');
      $('.center-foot .position').text(JSON.stringify(data));
      addWatcher('CF', data);
      return false;
    });
    $('.right-foot button').click(() => {
      const data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
      cropperElem.cropper('clear');
      $('.right-foot .position').text(JSON.stringify(data));
      addWatcher('RF', data);
      return false;
    });
  */
  $("#startProcess").click(function () {
    cropperElem.cropper("destroy");
    $("#startProcess").hide();
    player.play();
    next();
  });

  function addWatcher(which, positions) {
    var data = JSON.parse(JSON.stringify(positions));
    var frame = ctx2.getImageData(data.left, data.top, data.width, data.height);
    data.reference = frame.data;

    watchers[which] = data;
  }

  function next() {
    if (player.paused || player.ended) {
      return;
    }
    computeFrame();
    window.requestAnimationFrame(next);
  }

  function computeFrame() {
    ctx2.drawImage(player, 0, 0, c2.width, c2.height);
    var currentItem = Math.floor(player.currentTime * 100 / 120);

    $("#result tr").removeClass("current");
    for (var _i = 0; _i < currentItem; _i++) {
      $("#event-" + _i).addClass("completed");
    }
    $("#event-" + currentItem).addClass("current");

    var data = watchers["L" + leftMoves[currentItem]];
    var frame = ctx2.getImageData(data.left, data.top, data.width, data.height);
    var diff = 0;
    for (var j = 0; j < frame.data.length; j++) {
      if (j % 4 !== 3) diff += Math.abs(frame.data[j] - data.reference[j]);
    }
    diff = diff / frame.data.length;
    console.log(diff);
    if (diff > 3 && !leftResults[currentItem]) {
      var result = player.currentTime - currentItem * 120 / 100;
      leftResults[currentItem] = result;
      $("#event-" + currentItem + " .leftResult").text(result.toFixed(5));
    }

    var data2 = watchers["R" + rightMoves[currentItem]];
    var frame2 = ctx2.getImageData(data2.left, data2.top, data2.width, data2.height);
    var diff2 = 0;
    for (var j = 0; j < frame2.data.length; j++) {
      if (j % 4 !== 3) diff2 += Math.abs(frame2.data[j] - data2.reference[j]);
    }
    diff2 = diff2 / frame2.data.length;
    console.log(diff2);
    if (diff2 > 3 && !rightResults[currentItem]) {
      var result2 = player.currentTime - currentItem * 120 / 100;
      rightResults[currentItem] = result2;
      $("#event-" + currentItem + " .rightResult").text(result2.toFixed(5));
    }
  }
  player.addEventListener("ended", function () {
    console.log("end");
  });
}

//# sourceMappingURL=script.js.map