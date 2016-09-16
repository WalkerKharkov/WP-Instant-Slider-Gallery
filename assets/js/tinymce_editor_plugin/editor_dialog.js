var Dialog = function(form){
    this.inputValueChange = this.inputValueChange.bind(this);
    this.formClick = this.formClick.bind(this);
    this.isValid = this.isValid.bind(this);
    this.init = this.init.bind(this);
    this.init(form);
};

Dialog.prototype.init = function(form){
    this.settings = top.tinymce.activeEditor.windowManager.getParams().settings;
    this.setDefaultSettings();
    this.formContent = {};
    this.elems = [];
    this.validator = {
        text: function(value){
            return true;
        },
        number: function(value){
            return !isNaN(parseInt(value));
        },
        url: function(value){
            return (value.substr(0, 7) != 'http://' || value.substr(0, 8) != 'https://' || value.substr(0, 6) != 'ftp://');
        }
    };
    this.elems = Array.prototype.slice.call(form.getElementsByTagName('*')).filter(function(item){
        return item.hasAttribute('data-input');
    });
    for (var elem in this.elems){
        var elem_value = (this.elems[elem].tagName == "SELECT") ? this.elems[elem].options[this.elems[elem].selectedIndex].value :
            this.elems[elem].value;
        this.setVisualValidity(this.elems[elem]);
        this.formContent[this.elems[elem].getAttribute("id")] = {
            value: elem_value,
            type: this.elems[elem].getAttribute("data-type"),
            required: this.elems[elem].getAttribute("data-required")
        };
    }
    this.galleryURL = document.querySelector("#gallery_url");
    this.controller = {
        apply: function(self){
            self.formSubmit();
        },
        cancel: function(){
            top.tinymce.activeEditor.windowManager.close();
        },
        gallery_url_check: function(self){
            self.galleryURL.disabled = !self.galleryURL.disabled;
            var required = (self.galleryURL.getAttribute("data-required") == "") ? "true" : "";
            self.galleryURL.setAttribute("data-required", required);
        }
    };
    form.addEventListener("input", this.inputValueChange);
    form.addEventListener("click", this.formClick);
};

Dialog.prototype.setDefaultSettings = function(){
    for (var setting in this.settings){
        document.querySelector('#' + setting).setAttribute('value', this.settings[setting]);
    }
};

Dialog.prototype.inputValueChange = function(event){
    var targetId = event.target.getAttribute("id");
    if (!targetId) return;
    this.formContent[targetId].value = (event.target.tagName == "SELECT") ? event.target.options[event.target.selectedIndex].value :
        event.target.value;
    this.setVisualValidity(event.target);
};

Dialog.prototype.formClick = function(event){
    var target = event.target;
    if (!this.controller.hasOwnProperty(target.getAttribute("name"))) return;
    this.controller[target.getAttribute("name")](this);
};

Dialog.prototype.formSubmit = function(){
    for (elem in this.elems){
        if (this.elems[elem].classList.contains("invalid")) return;
    }
    var shortcode = "[isg ";
    for (var elem in this.formContent){
        shortcode += elem + '="' + this.formContent[elem].value + '" ';
    }
    shortcode += ' ]';
    top.tinymce.activeEditor.insertContent(shortcode);
    this.controller.cancel();
};

Dialog.prototype.isValid = function(value, type, required){
    if (value == '' && required) return false;
    return this.validator[type](value);
};

Dialog.prototype.setVisualValidity = function(elem){
    if(this.isValid(elem.value, elem.getAttribute("data-type"), elem.getAttribute("data-required"))){
        elem.classList.add("valid");
        elem.classList.remove("invalid");
    }else{
        elem.classList.add("invalid");
        elem.classList.remove("valid");
    }
};