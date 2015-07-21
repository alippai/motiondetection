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

    $('#panel').show();
  }, false);

  $('#startProcess').click(function () {
    $('#LLHMask').attr('x', watchers.LLH.left).attr('y', watchers.LLH.top).attr('width', watchers.LLH.width).attr('height', watchers.LLH.height);
    $('#LCHMask').attr('x', watchers.LCH.left).attr('y', watchers.LCH.top).attr('width', watchers.LCH.width).attr('height', watchers.LCH.height);
    $('#LRHMask').attr('x', watchers.LRH.left).attr('y', watchers.LRH.top).attr('width', watchers.LRH.width).attr('height', watchers.LRH.height);
    $('#LLFMask').attr('x', watchers.LLF.left).attr('y', watchers.LLF.top).attr('width', watchers.LLF.width).attr('height', watchers.LLF.height);
    $('#LCFMask').attr('x', watchers.LCF.left).attr('y', watchers.LCF.top).attr('width', watchers.LCF.width).attr('height', watchers.LCF.height);
    $('#LRFMask').attr('x', watchers.LRF.left).attr('y', watchers.LRF.top).attr('width', watchers.LRF.width).attr('height', watchers.LRF.height);
    $('#RLHMask').attr('x', watchers.RLH.left).attr('y', watchers.RLH.top).attr('width', watchers.RLH.width).attr('height', watchers.RLH.height);
    $('#RCHMask').attr('x', watchers.RCH.left).attr('y', watchers.RCH.top).attr('width', watchers.RCH.width).attr('height', watchers.RCH.height);
    $('#RRHMask').attr('x', watchers.RRH.left).attr('y', watchers.RRH.top).attr('width', watchers.RRH.width).attr('height', watchers.RRH.height);
    $('#RLFMask').attr('x', watchers.RLF.left).attr('y', watchers.RLF.top).attr('width', watchers.RLF.width).attr('height', watchers.RLF.height);
    $('#RCFMask').attr('x', watchers.RCF.left).attr('y', watchers.RCF.top).attr('width', watchers.RCF.width).attr('height', watchers.RCF.height);
    $('#RRFMask').attr('x', watchers.RRF.left).attr('y', watchers.RRF.top).attr('width', watchers.RRF.width).attr('height', watchers.RRF.height);
    $('#mask').show();
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
      if (diff > 10 && !leftResults[currentItem]) {
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
      if (diff2 > 10 && !rightResults[currentItem]) {
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