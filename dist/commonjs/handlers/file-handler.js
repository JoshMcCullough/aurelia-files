"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _helpersFileReaderHelper = require("../helpers/file-reader-helper");

var FileHandler = function FileHandler(onLoaded, onProgress, onError, fileFilter, maxFileSize, readAs, hoverClass) {
    var _this = this;

    _classCallCheck(this, FileHandler);

    this.readFile = function (file) {
        var reader = _helpersFileReaderHelper.FileReaderHelper.createReader(file, _this.onLoaded, _this.onProgress, _this.onError);

        if (_this.readAs == "text") {
            reader.readAsText(file);
        } else if (_this.readAs == "array") {
            reader.readAsArrayBuffer(file);
        } else if (_this.readAs == "binary") {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsDataURL(file);
        }
    };

    this.handleFileDrag = function (fileDragEvent) {
        fileDragEvent.stopPropagation();
        fileDragEvent.preventDefault();

        if (fileDragEvent.type == "dragover") {
            fileDragEvent.target.classList.add(_this.hoverClass);
        } else {
            fileDragEvent.target.classList.remove(_this.hoverClass);
        }
    };

    this.handleDrop = function (fileDropEvent) {
        _this.handleFileDrag(fileDropEvent);
        _this.handleFileSelected(fileDropEvent);
    };

    this.handleFileSelected = function (fileSelectionEvent) {
        var files = fileSelectionEvent.target.files || fileSelectionEvent.dataTransfer.files;
        for (var i = 0, f = undefined; f = files[i]; i++) {
            if (_this.fileFilter && !f.type.match(_this.fileFilter)) {
                if (_this.onError) {
                    _this.onError(f, "File type does not match filter");
                }
                continue;
            }

            if (_this.maxFileSize && f.size >= _this.maxFileSize) {
                if (_this.onError) {
                    _this.onError(f, "File exceeds file size limit");
                }
                continue;
            }

            _this.readFile(f);
        }
    };

    this.onLoaded = onLoaded;
    this.onProgress = onProgress;
    this.onError = onError;
    this.fileFilter = fileFilter;
    this.maxFileSize = maxFileSize;
    this.readAs = readAs;
    this.hoverClass = hoverClass || "file-hover";
};

exports.FileHandler = FileHandler;