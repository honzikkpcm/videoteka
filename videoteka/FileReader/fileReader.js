var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var fileReader;
        (function (fileReader) {
            var FileReaderModel = /** @class */ (function () {
                function FileReaderModel(params, componentInfo) {
                    this.isInternalChange = false;
                    this.isResettingForm = ko.observable(false);
                    this.element = componentInfo.element;
                    if (params.$isDesigntime) {
                        this.isEnabled = false;
                    }
                    else {
                        this.fileContent = params.FileContent;
                        this.fileName = params.FileName;
                        this.fileType = params.FileType;
                        this.accept = params.Filter;
                        this.multiple = false;
                        this.onChangeCallback = params.OnChange;
                        this.isEnabled = params.IsEnabled || true;
                        this.inputElement = componentInfo.element.childNodes[1];
                        this.fileNameSubscription = this.fileName && this.fileName.subscribe(this.onFileNameChange, this);
                    }
                }
                FileReaderModel.prototype.dispose = function () {
                    if (this.fileNameSubscription) {
                        this.fileNameSubscription.dispose();
                        this.fileNameSubscription = null;
                    }
                    this.element = null;
                };
                FileReaderModel.prototype.onInput = function (_data, _event) {
                    this.updateFileContent();
                };
                FileReaderModel.prototype.updateFileContent = function () {
                    var _this = this;
                    var dataUrlPrefix = 'base64,';
                    if (this.inputElement.files.length === 0) {
                        this.setFileAttributes(null, null, null);
                        return;
                    }
                    var file = this.inputElement.files[0];
                    var reader = new FileReader();
                    reader.onload = function (_readerEvt) {
                        var dataUrl = reader.result;
                        var contentAsBase64 = dataUrl.slice(dataUrl.indexOf(dataUrlPrefix) + dataUrlPrefix.length);
                        _this.setFileAttributes(contentAsBase64, file.name, file.type);
                    };
                    reader.readAsDataURL(file);
                };
                FileReaderModel.prototype.setFileAttributes = function (content, filename, filetype) {
                    this.isInternalChange = true;
                    this.fileContent(content);
                    if (this.fileName) {
                        this.fileName(filename);
                    }
                    if (this.fileType) {
                        this.fileType(filetype);
                    }
                    this.isInternalChange = false;
                    if (this.onChangeCallback) {
                        this.onChangeCallback();
                    }
                };
                FileReaderModel.prototype.onFileNameChange = function () {
                    // If fileName is changed to empty string from outside the component (by action probably), the component will briefly
                    // change the flag that controls the visibility of the input field. This will drop the input and create new empty one
                    // and thus visually empty the input field. Better way would be to call reset on encapsuling form element but we don't
                    // now if there is one and brielfy wrapping it by new one may break the HTML spec that does not allow forms to be chields
                    // of other forms.
                    if (!this.isInternalChange && this.fileName && !this.fileName()) {
                        this.isResettingForm(true);
                        this.isResettingForm(false);
                        this.inputElement = this.element.childNodes[1];
                    }
                };
                return FileReaderModel;
            }());
            fileReader.FileReaderModel = FileReaderModel;
        })(fileReader = components.fileReader || (components.fileReader = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var fileReader;
        (function (fileReader) {
            if (ko && !ko.components.isRegistered('sffw-file-reader')) {
                ko.components.register('sffw-file-reader', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.fileReader.FileReaderModel(params, componentInfo); }
                    },
                    template: "<!-- ko ifnot: isResettingForm --><input type=\"file\" data-bind=\"attr: { accept: accept, multiple: multiple }, enable: isEnabled, event: { change: onInput }\" autocomplete=\"off\"/><!-- /ko -->"
                });
            }
        })(fileReader = components.fileReader || (components.fileReader = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
