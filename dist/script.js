'use strict';

var watchers = {};
var c1 = document.createElement('canvas');
var ctx1 = c1.getContext('2d');

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

  player.src = videoURL;

  var c2 = document.getElementById('c2');
  var ctx2 = c2.getContext('2d');

  var $TL = $('#TL');
  var $BL = $('#BL');
  var $BR = $('#BR');
  var $TR = $('#TR');

  player.addEventListener('canplay', function () {
    $('#uploadInput').hide();
    player.currentTime = 0.5; // Triggers seek

    c1.width = player.videoWidth * scale;
    c1.height = player.videoHeight * scale;
    c2.width = player.videoWidth * scale;
    c2.height = player.videoHeight * scale;
  });

  player.addEventListener('seeked', function () {
    ctx2.drawImage(player, 0, 0, c2.width, c2.height);

    $('#panel').show();
  }, false);

  $('#startProcess').click(function () {
    $('#startProcess').hide();
    $('#mask').show();
    player.play();
    next();
  });

  function next() {
    if (player.paused || player.ended) {
      return;
    }
    computeFrame();
    window.requestAnimationFrame(next);
  }

  function computeFrame() {
    ctx1.drawImage(player, 0, 0, c2.width, c2.height);
    var currentItem = Math.floor((player.currentTime - 100 / 120) * 100 / 120);
    if (currentItem >= 0) {
      var frame = ctx1.getImageData(0, 0, c2.width, c2.height);
      var TLM00 = 0;
      var TLM10 = 0;
      var TLM01 = 0;

      var TRM00 = 0;
      var TRM10 = 0;
      var TRM01 = 0;

      var BLM00 = 0;
      var BLM10 = 0;
      var BLM01 = 0;

      var BRM00 = 0;
      var BRM10 = 0;
      var BRM01 = 0;
      for (var i = 0; i < frame.data.length / 4; i++) {
        var r = frame.data[i * 4];
        var g = frame.data[i * 4 + 1];
        var b = frame.data[i * 4 + 2];
        var intensity = 0.2989 * r + 0.5870 * g + 0.1140 * b;
        var x = i % c2.width;
        var y = Math.floor(i / c2.width);

        if (x < c2.width / 2 && y < c2.height / 2) {
          TLM00 += intensity;
          TLM10 += x * intensity;
          TLM01 += y * intensity;
        }
        if (x > c2.width / 2 && y < c2.height / 2) {
          TRM00 += intensity;
          TRM10 += x * intensity;
          TRM01 += y * intensity;
        }
        if (x > c2.width / 2 && y > c2.height / 2) {
          BRM00 += intensity;
          BRM10 += x * intensity;
          BRM01 += y * intensity;
        }
        if (x < c2.width / 2 && y > c2.height / 2) {
          BLM00 += intensity;
          BLM10 += x * intensity;
          BLM01 += y * intensity;
        }
        frame[i * 4] = intensity;
        frame[i * 4 + 1] = intensity;
        frame[i * 4 + 2] = intensity;
        frame[i * 4 + 3] = 255;
      }
      ctx2.putImageData(frame, 0, 0, 0, 0, c2.width, c2.height);
      $TL.attr('cx', TLM10 / TLM00).attr('cy', TLM01 / TLM00);
      $BL.attr('cx', BLM10 / BLM00).attr('cy', BLM01 / BLM00);
      $BR.attr('cx', BRM10 / BRM00).attr('cy', BRM01 / BRM00);
      $TR.attr('cx', TRM10 / TRM00).attr('cy', TRM01 / TRM00);
    }
  }
  player.addEventListener('ended', function () {
    console.log('end');
  });
}

//# sourceMappingURL=script.js.map