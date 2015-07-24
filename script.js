(function() {
  var watchers = {};
  var c1 = document.createElement('canvas');
  var ctx1 = c1.getContext('2d');
  var player = document.getElementById('player');
  var c2 = document.getElementById('c2');
  var ctx2 = c2.getContext('2d');

  var firstFrame = false;
  var averages = null;

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
      firstFrame = true;
      computeFrame();
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


  function computeFrame() {
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

    ctx2.putImageData(frame, 0, 0);
  }

  player.addEventListener('ended', function () {
    console.log('end');
  });
})();
