'use strict';

var watchers = {};
var c1 = document.createElement('canvas');
var ctx1 = c1.getContext('2d');
var player = document.getElementById('player');
var c2 = document.getElementById('c2');
var ctx2 = c2.getContext('2d');

var $TL = $('#TL');
var $BL = $('#BL');
var $BR = $('#BR');
var $TR = $('#TR');

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

  player.src = URL.createObjectURL(videoFile);

  player.addEventListener('canplay', function () {
    $('#uploadInput').hide();
    player.currentTime = 0.5; // Triggers seek

    c1.width = player.videoWidth * scale | 0;
    c1.height = player.videoHeight * scale | 0;
    c2.width = player.videoWidth * scale | 0;
    c2.height = player.videoHeight * scale | 0;
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
}
function next() {
  if (player.paused || player.ended) {
    return;
  }
  computeFrame();
  setTimeout(next, 5);
}

var r = 0;
var g = 0;
var b = 0;
var intensity = 0;
var x = 0;
var y = 0;

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

function computeFrame() {
  ctx1.drawImage(player, 0, 0, c2.width, c2.height);
  var frame = ctx1.getImageData(0, 0, c2.width, c2.height);
  var l = frame.data.length / 4;

  TLM00 = 0;
  TLM10 = 0;
  TLM01 = 0;

  TRM00 = 0;
  TRM10 = 0;
  TRM01 = 0;

  BLM00 = 0;
  BLM10 = 0;
  BLM01 = 0;

  BRM00 = 0;
  BRM10 = 0;
  BRM01 = 0;

  for (var i = 0; i < l; i++) {
    r = frame.data[i * 4];
    g = frame.data[i * 4 + 1];
    b = frame.data[i * 4 + 2];
    intensity = 0.2989 * r + 0.5870 * g + 0.1140 * b | 0;
    x = i % c2.width;
    y = i / c2.width | 0;

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
  }
  $TL.attr('cx', TLM10 / TLM00).attr('cy', TLM01 / TLM00);
  $BL.attr('cx', BLM10 / BLM00).attr('cy', BLM01 / BLM00);
  $BR.attr('cx', BRM10 / BRM00).attr('cy', BRM01 / BRM00);
  $TR.attr('cx', TRM10 / TRM00).attr('cy', TRM01 / TRM00);
}
player.addEventListener('ended', function () {
  console.log('end');
});

//# sourceMappingURL=script.js.map