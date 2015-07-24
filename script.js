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

var width = 0;
var height = 0;

function init() {
  var scale = 0.5;

  var videoFile = document.getElementById("uploadInput").files[0];
  var leftMoves = files[videoFile.name.replace('.mp4', '')].left;
  var rightMoves = files[videoFile.name.replace('.mp4', '')].right;
  var leftPositions = files[videoFile.name.replace('.mp4', '')].leftPosition;
  var rightPositions = files[videoFile.name.replace('.mp4', '')].rightPosition;
  var averages = null;
  var firstFrame = true;

  for (var i = 0; i < 240; i++) {
    $('#result tbody').append(`
      <tr id="event-${i}">
        <th>#${i + 1}, ${leftMoves[i]}</th>
        <td class="leftResult"></td>
        <th>#${i + 1}, ${rightMoves[i]}</th>
        <td class="rightResult"></td>
      </tr>
    `);
  }

  player.src = URL.createObjectURL(videoFile);

  player.addEventListener('canplay', function () {
    $('#uploadInput').hide();
    player.currentTime = 0.5; // Triggers seek

    c1.width = (player.videoWidth * scale) | 0;
    c1.height = (player.videoHeight * scale) | 0;
    c2.width = (player.videoWidth * scale) | 0;
    c2.height = (player.videoHeight * scale) | 0;
    width = c2.width | 0;
    height = c2.height | 0;
  });

  player.addEventListener('seeked', function () {
    ctx2.drawImage(player, 0, 0, c2.width, c2.height);

    var frame = ctx2.getImageData(0, 0, c2.width, c2.height);
    var data = frame.data;
    var width = c2.width;
    var height = c2.height;
    var i = 0, p = 0, x = 0, y = 0;

    if (firstFrame) {
      firstFrame = false;
      averages = new Float32Array(width * height * 4);

      for (i = 0; i < data.length; i++) {
        averages[i] = data[i];
      }
    } else {
      for (i = 0; i < data.length; i++) {
        var curr = data[i];
        var cura = averages[i] = curr * 0.1 + averages[i] * 0.9;
        data[i] = 128 + (cura - curr);
      }
    }

    $('#panel, #mask').show();
  }, false);

  $('#startProcess').click(() => {
    $('#startProcess').hide();
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

  var TL_x = 0;
  var TL_y = 0;
  var TR_x = 0;
  var TR_y = 0;
  var BL_x = 0;
  var BL_y = 0;
  var BR_x = 0;
  var BR_y = 0;

  var W = 0.1;

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
      intensity = (0.2989 * r + 0.5870 * g + 0.1140 * b) | 0;

      x = i % width;
      y = (i / width) | 0;


      if (x < width * 0.5 && y < height * 0.4) {
        r = 1; g = 0; b = 0;
        TLM00 += intensity;
        TLM10 += x * intensity;
        TLM01 += y * intensity;
      }
      if (x > width * 0.5 && y < height * 0.4) {
        r = 1; g = 1; b = 0;
        TRM00 += intensity;
        TRM10 += x * intensity;
        TRM01 += y * intensity;
      }
      if (x > width * 0.5 && y > height * 0.7) {
        r = 1; g = 0; b = 1;
        BRM00 += intensity;
        BRM10 += x * intensity;
        BRM01 += y * intensity;
      }
      if (x < width * 0.5 && y > height * 0.7) {
        r = 1; g = 1; b = 1;
        BLM00 += intensity;
        BLM10 += x * intensity;
        BLM01 += y * intensity;
      }

      frame.data[i * 4] = intensity * r;
      frame.data[i * 4 + 1] = intensity * g;
      frame.data[i * 4 + 2] = intensity * b;
      frame.data[i * 4 + 3] = 255;
    }
    ctx2.putImageData(frame, 0, 0);

    TL_x += (TLM10 / TLM00 - TL_x) * W;
    TL_y += (TLM01 / TLM00 - TL_y) * W;

    BL_x += (BLM10 / BLM00 - BL_x) * W;
    BL_y += (BLM01 / BLM00 - BL_y) * W;

    BR_x += (BRM10 / BRM00 - BR_x) * W;
    BR_y += (BRM01 / BRM00 - BR_y) * W;

    TR_x += (TRM10 / TRM00 - TR_x) * W;
    TR_y += (TRM01 / TRM00 - TR_y) * W;

    $TL.attr('cx', TL_x + (TLM10 / TLM00 - TL_x) * 50).attr('cy', TL_y + (TLM01 / TLM00 - TL_y) * 50);
    $BL.attr('cx', BL_x + (BLM10 / BLM00 - BL_x) * 50).attr('cy', BL_y + (BLM01 / BLM00 - BL_y) * 50);
    $BR.attr('cx', BR_x + (BRM10 / BRM00 - BR_x) * 50).attr('cy', BR_y + (BRM01 / BRM00 - BR_y) * 50);
    $TR.attr('cx', TR_x + (TRM10 / TRM00 - TR_x) * 50).attr('cy', TR_y + (TRM01 / TRM00 - TR_y) * 50);
  }
  player.addEventListener('ended', function () {
    console.log('end');
  });
