/**
 * materialoader js library
 * @description: Manages the file uploads on client side
 * @author: Lorenzo Gamboa García
 */

! function() {
  /**
   * Function to build up the uploader
   * @param  {string} idname     idname of the <div> element that will
   *                             the materialoader
   * @param  {object} properties optional properties to shape up the materialoader
   */
  var materialoader = function(idname, properties) {
    //Constructor, private variables
    var _uploadername = idname;
    var _width = properties.x || 300;
    var _height = properties.y || 200;
    var _fontfamily = properties.fontfamily || '';
    var _nelements = properties.nelements || undefined;
    var _files = {};
    var _skin = properties.skin || 'grey lighten-6';
    var _counter = 0;

    var uploader = document.getElementById(_uploadername);

    /*
      Retreives the materialoader object id
    */
    this.getUploaderName = function() {
      return _uploadername;
    };

    /*
      Retreives the width
    */
    this.getWidth = function() {
      return _width;
    };
    /*
      Retreives the height
    */
    this.getHeight = function() {
      return _height;
    };
    /*
      Retreives the fontfamily
    */
    this.getFontfamily = function() {
      return _fontfamily;
    };
    /*
      Retreives the file container
    */
    this.getFiles = function() {
      return _files;
    };
    /*
      Adds a single file to _files
    */
    this.setFiles = function(boxid, f) {
      _files[boxid] = f;
    };
    /*
      Adds 1/+ to _files
    */
    this.addFiles = function(f) {
      for (var i = 0; i < f.length; i++) {
        var file = f[i];
        this.drawFileIcon(file);
      }
      this.clearInfoUploader();
    };
    /*
      Removes a specific file
     */
    this.removeFile = function(f) {
      var icon_file = document.getElementById(f);
      delete _files[f];

      icon_file.parentNode.removeChild(icon_file);
      $('#modal-' + this.getUploaderName()).modal('close');
      this.clearInfoUploader();
    };
    /*
       Returns the skin selected
     */
    this.getSkin = function() {
      return _skin;
    }
    /*
      increase the counter by 1
     */
    this.setCounter = function() {
      _counter++;
    };
    /*
      Counts the number of files loaded so far
     */
    this.getCounter = function() {
      return _counter;
    };

    /*
      Sets the uploader element the 'uploader' as new class
     */
    if (uploader !== null && checkAPI()) {
      if (!uploader.className) uploader.className = "uploader";
      else uploader.className += " uploader";
      this.uploaderDrawer(uploader);
      this.uploaderListeners(uploader); //Adding event listeners
    }
  }

  /**
   * paints the uploader on the client view
   * @param  {object} uploader uploader element html instance
   */
  materialoader.prototype.uploaderDrawer = function(uploader) {
    var modal = document.createElement('div');
    modal.id = 'modal-' + this.getUploaderName();
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content"><div class="row"><div class="col l4"><img class="modal-img responsive-img materialboxed" style="width:200px;height:200px"></div><div class="col l8"><p><blockquote><b>Name: </b><span class="modal-name"></blockquote></span></p><p><blockquote><b>Size: </b><span class="modal-size"></blockquote></span></p><p><blockquote><b>Type: </b><span class="modal-type"></blockquote></span></p></div></div></div><div class="modal-footer"><a href="#!" class="waves-effect waves-light btn close-modal">Exit</a><a href="#!" class="waves-effect waves-light btn delete-modal red"><i class="material-icons">delete</i> Delete</a></div>';
    modal.getElementsByClassName('delete-modal')[0].addEventListener('click', deleteButtonClick.bind(this));

    var input_file = document.createElement('input');
    input_file.id = `${this.getUploaderName()}-inputfile`;
    input_file.type = "file";
    input_file.multiple = true;
    input_file.style.display = 'none';
    input_file.name = this.getUploaderName() + 'files';



    //Info panel element
    var infoElement = document.createElement('h4');
    infoElement.className = "info-uploader center-align";
    infoElement.id = 'info-uploader';
    infoElement.appendChild(document.createTextNode("Drop files here or click to browse"));
    infoElement.setAttribute("style", 'font-family:' + this.getFontfamily());

    uploader.className += ` ${this.getSkin()}`;
    uploader.parentNode.insertBefore(input_file, uploader.nextSibling);
    uploader.parentNode.insertBefore(modal, uploader.nextSibling);
    uploader.appendChild(infoElement);
    uploader.setAttribute("style", 'width:' + this.getWidth() + 'px;max-height:' + this.getHeight() + 'px; padding: 20px; overflow-y: auto;height:' + this.getHeight() + 'px');
  }

  /**
   * Clears the panel info away in case there are loaded elements
   */
  materialoader.prototype.clearInfoUploader = function() {
    var inf_uploader = document.getElementById('info-uploader');
    inf_uploader.style.display = Object.keys(this.getFiles()).length > 0 ? 'none' : 'flex';
  }
  /**
   * Paints on the panel the icon that represents each file
   */
  materialoader.prototype.drawFileIcon = function(file) {
    var uploader = document.getElementById(this.getUploaderName());
    var iconFile = document.createElement('img');
    var reader = new FileReader();
    var boxid = this.getCounter();
    this.setCounter();

    iconFile.className = 'box hoverable';
    iconFile.id = 'box' + boxid;
    iconFile.style = "width: 78px;height: 80px;margin: 20px;"
    iconFile.setAttribute("href", "#modal1");
    iconFile.addEventListener('click', fileiconOnClick.bind(this));

    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      reader.readAsDataURL(file);
      reader.onprogress = function() {
        iconFile.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Color_icon_gray_v2.svg/1200px-Color_icon_gray_v2.svg.png";
      }
      reader.addEventListener("load", function(event) {
        iconFile.src = reader.result;
      }, false);

    } else iconFile.src = file_type[file.type];
    uploader.appendChild(iconFile);
    this.setFiles('box' + boxid, file);
  }

  /**
   * Groups up all listeners attached to the uploader
   */
  materialoader.prototype.uploaderListeners = function(uploader) {
    var that = this;
    var inputfile = document.getElementById(`${this.getUploaderName()}-inputfile`);
    uploader.addEventListener("mouseover", mouseover, true);
    uploader.addEventListener("mouseout", mouseout, false);
    uploader.addEventListener("dragover", dragover, false);
    uploader.addEventListener("drop", dropFiles.bind(that), false);
    uploader.addEventListener("click", uploaderOnClick.bind(that));
    inputfile.addEventListener('change', function onChange(evt) {
      var files = this.files;
      that.addFiles(files);
    }, false);
  }

  /**
   * [mouseover description]
   * @param  {[type]} ev [description]
   * @return {[type]}    [description]
   */
  function mouseover(ev) {
    //console.log("Mouse over");
  }

  /**
   * [mouseout description]
   * @param  {[type]} ev [description]
   * @return {[type]}    [description]
   */
  function mouseout(ev) {}
  //console.log("Mouse out");

  /**
   * [dragover description]
   * @param  {[type]} ev [description]
   * @return {[type]}    [description]
   */
  function dragover(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    //console.log("drag over");
  }

  /**
   * [uploaderOnclick description]
   * @param  {[type]} ev [description]
   * @return {[type]}    [description]
   */
  function uploaderOnClick(ev) {
    var ifile = document.getElementById(`${this.getUploaderName()}-inputfile`);
    ifile.click();
  }

  /**
   * [dropFiles description]
   * @param  {[type]} ev [description]
   * @return {[type]}    [description]
   */
  function dropFiles(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    var files = ev.dataTransfer.files; // FileList object.
    this.addFiles(files);
  }

  /**
   * [closeModal description]
   * @param  {[type]} ev [description]
   * @return {[type]}    [description]
   */
  function closeModal(ev) {
    if (ev.target === this || ev.target.className === 'close' || ev.target.className.indexOf('close-modal') > -1) $('#modal-' + this.getUploaderName()).modal('close');
    else return;
  }
  /**
   * [deleteButtonClick description]
   * @param  {[type]} fileid [description]
   * @param  {[type]} ev     [description]
   * @return {[type]}        [description]
   */
  function deleteButtonClick(ev) {
    var fileid = ev.target.getAttribute('data-id');
    this.removeFile(fileid);
  };
  /**
   * [fileiconOnClick description]
   * @param  {[type]} ev [description]
   * @return {[type]}    [description]
   */
  function fileiconOnClick(e) {
    e.stopPropagation();
    $('#modal-' + this.getUploaderName()).modal('open');

    var file_clicked = this.getFiles()[e.target.id];
    var modal = document.getElementById('modal-' + this.getUploaderName());
    modal.getElementsByClassName('modal-name')[0].innerHTML = file_clicked.name;
    modal.getElementsByClassName('modal-type')[0].innerHTML = file_clicked.type;
    modal.getElementsByClassName('modal-size')[0].innerHTML = file_clicked.size;
    modal.getElementsByClassName('modal-img responsive-img materialboxed')[0].src = e.target.src;
    modal.getElementsByClassName('delete-modal')[0].setAttribute('data-id', e.target.id);
    modal.addEventListener('click', closeModal.bind(this));
  }

  /**
   * checks if the client web-browser has the neccesary APIs
   * @return {Boolean} wether or not its compatible
   */
  function checkAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      return true;
    } else return false;
  }

  const file_type = {
    "audio/mp4": "https://cdn1.iconfinder.com/data/icons/video-actions-files-1/24/Film_video_file_document_mp4-512.png",
    "audio/ogg": "oga|ogg",
    "audio/&": "mid|midi|mp3|wav",
    "application/javascript": "https://image.flaticon.com/icons/svg/136/136530.svg",
    "application/json": "json",
    "application/msword": "doc|dot",
    "application/octet-stream": "bin",
    "application/postscript": "ai",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xla|xls|xlt",
    "application/vnd.ms-fontobject": "eot",
    "application/vnd.ms-powerpoint": "pot|ppa|pps|ppt",
    "application/x-shockwave-flash": "swf",
    "application/x-msdownload": "http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/file-exe-icon.png",
    "application/xml": "atom|rdf|rss|xml",
    "application/&": "pdf|rtf|zip",
    "font/opentype": "otf",
    "font/&": "ttf|ttc|woff",
    "image/jpeg": "jpe|jpeg|jpg",
    "image/svg+xml": "svg|svgz",
    "image/vnd.adobe.photoshop": "psd",
    "image/vnd.microsoft.icon": "ico",
    "image/&": "bmp|ief|gif|png|tif|tiff|webp",
    "text/cache-manifest": "appcache|manifest",
    "text/css": "https://png.icons8.com/color/1600/css-filetype",
    "text/plain": "http://icon-icons.com/icons2/265/PNG/128/TXT_29689.png",
    "text/x-component": "htc",
    "text/x-vcard": "vcf",
    "text/&": "css|html|php|vtt",
    "text/x-&": "markdown|md",
    "video/mp4": "mp4|m4v|f4v|f4p",
    "video/ogg": "ogv",
    "video/quicktime": "mov|qt",
    "video/&": "avi|mpg|vdo|viv|vivo|webm",
    "video/x-&": "flv"
  };
  window.materialoader = materialoader;
}();
