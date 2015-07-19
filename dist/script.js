"use strict";

function init() {
  "use strict";
  var scale = 0.5;

  var videoFile = document.getElementById("uploadInput").files[0];
  var leftMoves = files[videoFile.name.replace(".mp4", "")].left;
  var rightMoves = files[videoFile.name.replace(".mp4", "")].right;
  for (var i = 0; i < 240; i++) {
    $("#result tbody").append("\n      <tr id=\"event-" + i + "\">\n        <th>#" + (i + 1) + ", " + leftMoves[i] + "</th>\n        <td class=\"leftResult\"></td>\n        <th>#" + (i + 1) + ", " + rightMoves[i] + "</th>\n        <td class=\"rightResult\"></td>\n      </tr>\n    ");
  }
  var videoURL = URL.createObjectURL(videoFile);
  var player = document.getElementById("player");
  var watchers = {};
  var cropperElem = null;
  var leftResults = [];
  var leftResultsA = [];

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
  addWatcher("LH", { "left": 97, "top": 134, "width": 89, "height": 34 });
  $(".left-hand .position").text(JSON.stringify({ "left": 97, "top": 134, "width": 89, "height": 34 }));
  addWatcher("CH", { "left": 205, "top": 149, "width": 79, "height": 46 });
  $(".center-hand .position").text(JSON.stringify({ "left": 205, "top": 149, "width": 79, "height": 46 }));
  addWatcher("RH", { "left": 310, "top": 137, "width": 85, "height": 30 });
  $(".right-hand .position").text(JSON.stringify({ "left": 310, "top": 137, "width": 85, "height": 30 }));
  addWatcher("LF", { "left": 169, "top": 302, "width": 39, "height": 158 });
  $(".left-foot .position").text(JSON.stringify({ "left": 169, "top": 302, "width": 39, "height": 158 }));
  addWatcher("CF", { "left": 183, "top": 469, "width": 105, "height": 30 });
  $(".center-foot .position").text(JSON.stringify({ "left": 183, "top": 469, "width": 105, "height": 30 }));
  addWatcher("RF", { "left": 294, "top": 322, "width": 50, "height": 146 });
  $(".right-foot .position").text(JSON.stringify({ "left": 294, "top": 322, "width": 50, "height": 146 }));

  $(".left-hand button").click(function () {
    var data = cropperElem.cropper("getCropBoxData"); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper("clear");
    $(".left-hand .position").text(JSON.stringify(data));
    addWatcher("LH", data);
    return false;
  });
  $(".center-hand button").click(function () {
    var data = cropperElem.cropper("getCropBoxData"); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper("clear");
    $(".center-hand .position").text(JSON.stringify(data));
    addWatcher("CH", data);
    return false;
  });
  $(".right-hand button").click(function () {
    var data = cropperElem.cropper("getCropBoxData"); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper("clear");
    $(".right-hand .position").text(JSON.stringify(data));
    addWatcher("RH", data);
    return false;
  });
  $(".left-foot button").click(function () {
    var data = cropperElem.cropper("getCropBoxData"); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper("clear");
    $(".left-foot .position").text(JSON.stringify(data));
    addWatcher("LF", data);
    return false;
  });
  $(".center-foot button").click(function () {
    var data = cropperElem.cropper("getCropBoxData"); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper("clear");
    $(".center-foot .position").text(JSON.stringify(data));
    addWatcher("CF", data);
    return false;
  });
  $(".right-foot button").click(function () {
    var data = cropperElem.cropper("getCropBoxData"); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper("clear");
    $(".right-foot .position").text(JSON.stringify(data));
    addWatcher("RF", data);
    return false;
  });

  $("#startProcess").click(function () {
    cropperElem.cropper("destroy");
    $("#startProcess").hide();
    player.play();
    next();
  });

  function addWatcher(which, data) {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = data.width;
    newCanvas.height = data.height;
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
    var data = watchers[leftMoves[currentItem]];

    var frame = ctx2.getImageData(data.left, data.top, data.width, data.height);
    var diff = 0;
    for (var j = 0; j < frame.data.length; j++) {
      if (j % 4 !== 3) diff += Math.abs(frame.data[j] - data.reference[j]);
    }
    diff = diff / frame.data.length;
    console.log(diff);
    if (diff > 30 && !leftResults[currentItem]) {
      var result = player.currentTime - currentItem * 120 / 100;
      leftResults[currentItem] = result;
      leftResultsA[currentItem] = {
        reference: data.reference,
        result: frame.data
      };
      $("#event-" + currentItem + " .leftResult").text(result.toFixed(5));
    }
  }
  player.addEventListener("ended", function () {
    console.log("end");
  });
}

//# sourceMappingURL=script.js.map