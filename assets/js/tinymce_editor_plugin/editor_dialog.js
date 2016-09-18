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
    this.galleryURLvalue = '';
    this.validator = {
        urlPattern: /^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/,
        text: function(value){
            return true;
        },
        number: function(value){
            return !isNaN(parseInt(value));
        },
        url: function(value){
            return this.urlPattern.test(value);
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
            //self.galleryURL.disabled = !self.galleryURL.disabled;
            //var required = (self.galleryURL.getAttribute("data-required") == "") ? "true" : "";
            //self.galleryURL.setAttribute("data-required", required);
            if (self.galleryURL.hasAttribute('data-required')){
                self.galleryURL.removeAttribute('data-required');
                self.galleryURL.style.visibility = 'hidden';
                self.galleryURLvalue = self.galleryURL.value;
                self.galleryURL.setAttribute('value', '');
            }else{
                self.galleryURL.setAttribute('data-required', 'true');
                self.galleryURL.style.visibility = 'visible';
                self.galleryURL.setAttribute('value', self.galleryURL.value);
            }
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