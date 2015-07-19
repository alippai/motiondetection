'use strict';

var watchers = {};

function init() {
  var scale = 0.5;

  var videoFile = document.getElementById('uploadInput').files[0];
  var leftMoves = files[videoFile.name.replace('.mp4', '')].left;
  var rightMoves = files[videoFile.name.replace('.mp4', '')].right;
  var leftPositions = files[videoFile.name.replace('.mp4', '')].leftPosition;
  var rightPositions = files[videoFile.name.replace('.mp4', '')].rightPosition;
  for (var i = 0; i < 240; i++) {
    $('#result tbody').append('\n      <tr id="event-' + i + '">\n        <th>#' + (i + 1) + ', ' + leftMoves[i] + '</th>\n        <td class="leftResult"></td>\n        <th>#' + (i + 1) + ', ' + rightMoves[i] + '</th>\n        <td class="rightResult"></td>\n      </tr>\n    ');
  }
  var videoURL = URL.createObjectURL(videoFile);
  var player = document.getElementById('player');
  var cropperElem = null;
  var leftResults = [];
  var rightResults = [];

  player.src = videoURL;

  var c2 = document.getElementById('c2');
  var ctx2 = c2.getContext('2d');

  player.addEventListener('canplay', function () {
    $('#uploadInput').hide();
    player.currentTime = 0.5; // Triggers seek

    $('#container').width(player.videoWidth * scale);

    c2.width = player.videoWidth * scale;
    c2.height = player.videoHeight * scale;
  });

  player.addEventListener('seeked', function () {
    ctx2.drawImage(player, 0, 0, c2.width, c2.height);

    $('.left-hand .position').text(JSON.stringify(leftPositions.LH));
    addWatcher('LLH', leftPositions.LH);
    $('.center-hand .position').text(JSON.stringify(leftPositions.CH));
    addWatcher('LCH', leftPositions.CH);
    $('.right-hand .position').text(JSON.stringify(leftPositions.RH));
    addWatcher('LRH', leftPositions.RH);
    $('.left-foot .position').text(JSON.stringify(leftPositions.LF));
    addWatcher('LLF', leftPositions.LF);
    $('.center-foot .position').text(JSON.stringify(leftPositions.CF));
    addWatcher('LCF', leftPositions.CF);
    $('.right-foot .position').text(JSON.stringify(leftPositions.RF));
    addWatcher('LRF', leftPositions.RF);

    addWatcher('RLH', rightPositions.LH);
    addWatcher('RCH', rightPositions.CH);
    addWatcher('RRH', rightPositions.RH);
    addWatcher('RLF', rightPositions.LF);
    addWatcher('RCF', rightPositions.CF);
    addWatcher('RRF', rightPositions.RF);

    cropperElem = $('#container > canvas').cropper({
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

    $('#panel').show();
  }, false);

  $('.left-hand.left button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.left-hand.left .position').text(JSON.stringify(data));
    addWatcher('LLH', data);
    return false;
  });
  $('.center-hand.left button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.center-hand.left .position').text(JSON.stringify(data));
    addWatcher('LCH', data);
    return false;
  });
  $('.right-hand.left button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.right-hand.left .position').text(JSON.stringify(data));
    addWatcher('LRH', data);
    return false;
  });
  $('.left-foot.left button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.left-foot.left .position').text(JSON.stringify(data));
    addWatcher('LLF', data);
    return false;
  });
  $('.center-foot.left button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.center-foot.left .position').text(JSON.stringify(data));
    addWatcher('LCF', data);
    return false;
  });
  $('.right-foot.left button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.right-foot.left .position').text(JSON.stringify(data));
    addWatcher('LRF', data);
    return false;
  });
  $('.left-hand.right button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.left-hand.right .position').text(JSON.stringify(data));
    addWatcher('RLH', data);
    return false;
  });
  $('.center-hand.right button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.center-hand.right .position').text(JSON.stringify(data));
    addWatcher('RCH', data);
    return false;
  });
  $('.right-hand.right button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.right-hand.right .position').text(JSON.stringify(data));
    addWatcher('RRH', data);
    return false;
  });
  $('.left-foot.right button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.left-foot.right .position').text(JSON.stringify(data));
    addWatcher('RLF', data);
    return false;
  });
  $('.center-foot.right button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.center-foot.right .position').text(JSON.stringify(data));
    addWatcher('RCF', data);
    return false;
  });
  $('.right-foot.right button').click(function () {
    var data = cropperElem.cropper('getCropBoxData'); // {left: 96, top: 54, width: 768, height: 432}
    cropperElem.cropper('clear');
    $('.right-foot.right .position').text(JSON.stringify(data));
    addWatcher('RRF', data);
    return false;
  });

  $('#startProcess').click(function () {
    cropperElem.cropper('destroy');
    $('#startProcess, #watchers').hide();
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
    var currentItem = Math.floor((player.currentTime - 100 / 120) * 100 / 120);
    if (currentItem >= 0) {

      $('#result tr').removeClass('current');
      for (var _i = 0; _i < currentItem; _i++) {
        $('#event-' + _i).addClass('completed');
      }
      $('#event-' + currentItem).addClass('current');

      var data = watchers['L' + leftMoves[currentItem]];
      var frame = ctx2.getImageData(data.left, data.top, data.width, data.height);
      var diff = 0;
      for (var j = 0; j < frame.data.length; j++) {
        if (j % 4 !== 3) diff += Math.abs(frame.data[j] - data.reference[j]);
      }
      diff = diff / frame.data.length;
      if (diff > 5 && !leftResults[currentItem]) {
        var result = player.currentTime - 100 / 120 - currentItem * 120 / 100;
        leftResults[currentItem] = result;
        $('#event-' + currentItem + ' .leftResult').text(result.toFixed(5));
      }

      var data2 = watchers['R' + rightMoves[currentItem]];
      var frame2 = ctx2.getImageData(data2.left, data2.top, data2.width, data2.height);
      var diff2 = 0;
      for (var j = 0; j < frame2.data.length; j++) {
        if (j % 4 !== 3) diff2 += Math.abs(frame2.data[j] - data2.reference[j]);
      }
      diff2 = diff2 / frame2.data.length;
      if (diff2 > 5 && !rightResults[currentItem]) {
        var result2 = player.currentTime - 100 / 120 - currentItem * 120 / 100;
        rightResults[currentItem] = result2;
        $('#event-' + currentItem + ' .rightResult').text(result2.toFixed(5));
      }
    }
  }
  player.addEventListener('ended', function () {
    console.log('end');
  });
}

//# sourceMappingURL=script.js.map