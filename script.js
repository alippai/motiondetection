const watchers = {};

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
  var cropperElem = null;
  const leftResults = [];
  const rightResults = [];

  player.src = videoURL;

  const c2 = document.getElementById('c2');
  const ctx2 = c2.getContext('2d');

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

  $('#startProcess').click(() => {
    cropperElem.cropper('destroy');
    $('#startProcess').hide();
    player.play();
    next();
  });

  function addWatcher(which, positions) {
    var data = JSON.parse(JSON.stringify(positions));
    const frame = ctx2.getImageData(data.left, data.top, data.width, data.height);
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
    const currentItem = Math.floor((player.currentTime - 100 / 120) * 100 / 120);
    if (currentItem >= 0) {

      $('#result tr').removeClass('current');
      for (let i = 0; i < currentItem; i++) {
        $('#event-' + i).addClass('completed');
      }
      $('#event-' + currentItem).addClass('current');

      const data = watchers['L' + leftMoves[currentItem]];
      const frame = ctx2.getImageData(data.left, data.top, data.width, data.height);
      var diff = 0;
      for (var j = 0; j < frame.data.length; j++) {
        if (j % 4 !== 3) diff += Math.abs(frame.data[j] - data.reference[j]);
      }
      diff = diff / frame.data.length;
      if (diff > 5 && !leftResults[currentItem]) {
        const result = (player.currentTime - 100 / 120) - currentItem * 120 / 100;
        leftResults[currentItem] = result;
        $('#event-' + currentItem + ' .leftResult').text(result.toFixed(5))
      }

      const data2 = watchers['R' + rightMoves[currentItem]];
      const frame2 = ctx2.getImageData(data2.left, data2.top, data2.width, data2.height);
      var diff2 = 0;
      for (var j = 0; j < frame2.data.length; j++) {
        if (j % 4 !== 3) diff2 += Math.abs(frame2.data[j] - data2.reference[j]);
      }
      diff2 = diff2 / frame2.data.length;
      if (diff2 > 5 && !rightResults[currentItem]) {
        const result2 = (player.currentTime - 100 / 120) - currentItem * 120 / 100;
        rightResults[currentItem] = result2;
        $('#event-' + currentItem + ' .rightResult').text(result2.toFixed(5))
      }
    }
  }
  player.addEventListener('ended', function () {
    console.log('end');
  });
}
