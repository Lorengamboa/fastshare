/**
 * ajax processes to handle the file loaded in memory
 */
!(function() {
  var btn_submit = document.getElementById('btn-submit');
  var upload_progress = document.getElementById('upload-progress');
  var upload_determinate = document.getElementById('upload-determinate');

  btn_submit.addEventListener('click', function(ev) {
    var message = document.getElementById('message');
    var xhr = new XMLHttpRequest();

    var onProgress = function(e) {
      upload_progress.style.display = "block";
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        upload_determinate.style.width = percentage + "%";
      }
    };

    var onReady = function(e) {
      console.log(e);
    };

    var onError = function(err) {
      console.log(err);
    };

    function onLoad(e) {
      console.log(e);
    }

    function transferComplete(evt) {
      upload_progress.style.display = "none";
      upload_determinate.style.width = "0%";
    }
    xhr.upload.addEventListener('progress', onProgress, false);
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('onload', onLoad, false);
    xhr.addEventListener("load", transferComplete, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
        document.getElementById('download-link').innerHTML = "Done! Your file is available at: <a href='" + xhr.responseText + "'>" + xhr.responseText + "</a>";
      }
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 413) {
        Materialize.toast(xhr.responseText, 3000)
      }
    };
    xhr.open('POST', '/upload', true);
    var data = new FormData();
    var files = uploader.getFiles();
    for (var property in files) {
      if (files.hasOwnProperty(property)) {
        data.append('files', files[property]);
      }
    }
    data.append('message', message.value);

    xhr.send(data);
  });

}());
