const watchers = {};
const c1 = document.createElement('canvas');
const ctx1 = c1.getContext('2d');

function init() {
  const scale = 0.5;

  const videoFile = document.getElementById("uploadInput").files[0];
  const leftMoves = files[videoFile.name.replace('.mp4', '')].left;
  const rightMoves = files[videoFile.name.replace('.mp4', '')].right;
  const leftPositions = files[videoFile.name.replace('.mp4', '')].leftPosition;
  const rightPositions = files[videoFile.name.replace('.mp4', '')].rightPosition;
  for (var i = 0; i < 240; i++) {
    $('#result tbody').append(`
      <tr id="event-${i}">
        <th>#${i+1}, ${leftMoves[i]}</th>
        <td class="leftResult"></td>
        <th>#${i+1}, ${rightMoves[i]}</th>
        <td class="rightResult"></td>
      </tr>
    `);
  }
  const videoURL = URL.createObjectURL(videoFile);
  const player = document.getElementById('player');

  player.src = videoURL;

  const c2 = document.getElementById('c2');
  const ctx2 = c2.getContext('2d');

  const $TL = $('#TL');
  const $BL = $('#BL');
  const $BR = $('#BR');
  const $TR = $('#TR');

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

  $('#startProcess').click(() => {
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
    const currentItem = Math.floor((player.currentTime - 100 / 120) * 100 / 120);
    if (currentItem >= 0) {
      const frame = ctx1.getImageData(0, 0, c2.width, c2.height);
      let TLM00 = 0;
      let TLM10 = 0;
      let TLM01 = 0;

      let TRM00 = 0;
      let TRM10 = 0;
      let TRM01 = 0;

      let BLM00 = 0;
      let BLM10 = 0;
      let BLM01 = 0;

      let BRM00 = 0;
      let BRM10 = 0;
      let BRM01 = 0;
      for (var i = 0; i < frame.data.length / 4; i++) {
        const r = frame.data[i * 4];
        const g = frame.data[i * 4 + 1];
        const b = frame.data[i * 4 + 2];
        const intensity = 0.2989*r + 0.5870*g + 0.1140*b;
        const x = i % c2.width;
        const y = Math.floor(i / c2.width);

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
