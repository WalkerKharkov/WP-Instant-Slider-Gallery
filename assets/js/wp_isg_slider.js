function WP_isg_slider(id, gallery, settings){
    this.controlsEventListener = this.controlsEventListener.bind(this);
    this.init(id, gallery, settings);
}

WP_isg_slider.prototype.init = function(id, gallery, settings){
    this.doc = document;
    this.gallery = gallery;
    this.id = id;
    this.popupWidth = settings[0];
    this.popupHeight = settings[1];
    this.createSliderContainer();
    this.createSliderControls();
    this.elem = this.popupImg;
    this.index = 0;
    this.maxIndex = Object.keys(this.gallery).length - 1;
    this.pause = 0;
    this.show = true;
    this.elem.style.opacity = 0;
    this.tOut = "";
    this.counter = 0;
    this.delay = 20;
    this.pauseValue = 60;
    this.clicked = false;
    this.iframe = false;
    this.controller = {
        prev : function(slider) {
            slider.index = (--slider.index < 0) ? slider.maxIndex : slider.index;
        },
        next : function(slider) {
            slider.index = (++slider.index > slider.maxIndex) ? 0 : slider.index;
        }
    };
    this.popupContainer.addEventListener("click", this.controlsEventListener);
};

WP_isg_slider.prototype.createSliderContainer = function(){
    this.popupContainer = this.doc.createElement("div");
    this.popupImg = this.doc.createElement("img");
    this.popupWidth = (this.popupWidth > window.innerWidth) ? window.innerWidth : this.popupWidth;
    this.popupHeight = (this.popupHeight > window.innerHeight) ? window.innerHeight : this.popupHeight;
    this.popupTop = (window.innerHeight - this.popupHeight) / 2;
    this.popupLeft = (window.innerWidth - this.popupWidth) / 2;
    this.popupContainer.style.cssText = this.popupImg.style.cssText = "width:" + this.popupWidth + "px;height:" + this.popupHeight + "px;";
    this.popupContainer.style.cssText += "position:fixed;left:" + this.popupLeft + "px;top:" + this.popupTop + "px;";
    this.popupImg.style.position = "relative";
    this.popupContainer.classList.add("wp_isg_popup");
    this.popupImg.classList.add("wp_isg_popup");
    this.popupContainer.appendChild(this.popupImg);
    this.doc.body.appendChild(this.popupContainer);
};

WP_isg_slider.prototype.createSliderControls = function(){
    this.closeButton = this.doc.createElement("a");
    this.closeButton.setAttribute("data-wp-isg-controls", "close");
    this.closeButton.classList.add("wp_isg_controls", "wp_isg_close");
    this.closeButton.innerHTML = "&times;";
    this.popupContainer.insertBefore(this.closeButton, this.popupContainer.firstElementChild);
    this.nextButton = this.doc.createElement("a");
    this.nextButton.setAttribute("data-wp-isg-controls", "next");
    this.nextButton.classList.add("wp_isg_controls", "wp_isg_next");
    this.nextButton.innerText = ">";
    this.previousButton = this.doc.createElement("a");
    this.previousButton.setAttribute("data-wp-isg-controls", "prev");
    this.previousButton.classList.add("wp_isg_controls", "wp_isg_prev");
    this.previousButton.innerText = "<";
    this.nextButton.style.top = this.previousButton.style.top = (this.popupHeight / 2) - 12 + "px";
    this.previousButton.style.left = "0px";
    this.nextButton.style.right = "0px";
    this.closeButton.style.position = this.nextButton.style.position = this.previousButton.style.position = 'absolute';
    this.popupContainer.insertBefore(this.nextButton, this.popupContainer.firstElementChild);
    this.popupContainer.insertBefore(this.previousButton, this.popupContainer.firstElementChild);
    this.controls = this.doc.querySelectorAll(".wp_isg_controls");
};

WP_isg_slider.prototype.close = function(){
    this.stopRender();
    this.popupContainer.style.display = this.popupImg.style.display = "none";
    this.doc.body.removeChild(this.screenBlock);
};

WP_isg_slider.prototype.createIframe = function(){
    this.iframe = true;
    this.elem.style.display = "none";
    this.popupIframe = this.doc.createElement("iframe");
    this.popupIframe.classList.add("wp_isg_popup");
    this.popupIframe.setAttribute("width", this.popupWidth  + "");
    this.popupIframe.setAttribute("height", this.popupHeight + "");
    this.popupIframe.style.position = "relative";
    this.popupIframe.setAttribute("src", this.gallery[this.index].src.substr(this.gallery[this.index].src.indexOf("?http") + 1));
    this.iframeCloseButton = this.doc.createElement("a");
    this.iframeCloseButton.setAttribute("data-wp-isg-controls", "iframeclose");
    this.iframeCloseButton.classList.add("wp_isg_controls", "wp_isg_iframeclose");
    this.iframeCloseButton.innerHTML = "&times;";
    this.popupContainer.appendChild(this.iframeCloseButton);
    this.popupContainer.appendChild(this.popupIframe);
    this.popupIframe.style.display = "block";
};

WP_isg_slider.prototype.destroyIframe = function(){
    this.popupContainer.removeChild(this.popupIframe);
    this.popupContainer.removeChild(this.iframeCloseButton);
    this.elem.style.display = "block";
    this.popupContainer.style.width = this.popupImg.style.width = this.popupWidth + "px";
    this.popupContainer.style.height = this.popupImg.style.height = this.popupHeight + "px";
    this.popupContainer.style.top = this.popupTop + "px";
    this.popupContainer.style.left = this.popupLeft + "px";
    this.iframe = false;
    this.toggleControls();
    this.start();
};

WP_isg_slider.prototype.controlsEventListener = function(event){
    var target = event.target.getAttribute("data-wp-isg-controls");
    if (target == "iframeclose"){
            this.destroyIframe();
            return;
    }
    if (this.iframe) return;
    if (target) {
        if (target != "close") {
            this.controller[target](this);
            this.showNext();
        } else {
            this.close();
        }
    }else{
        if (!this.clicked){
            this.stopRender();
            if (this.gallery[this.index].type == "vid"){
                this.createIframe();
            }else {
                this.popupContainer.style.width = window.innerWidth + "px";
                this.popupContainer.style.height = window.innerHeight + "px";
                this.popupContainer.style.top = "0px";
                this.popupContainer.style.left = "0px";
                this.popupImg.style.width = window.innerWidth + "px";
                this.popupImg.style.height = window.innerHeight + "px";
            }
        }else{
            this.popupContainer.style.width = this.popupImg.style.width = this.popupWidth + "px";
            this.popupContainer.style.height = this.popupImg.style.height = this.popupHeight + "px";
            this.popupContainer.style.top = this.popupTop + "px";
            this.popupContainer.style.left = this.popupLeft + "px";
            this.start();
        }
        this.toggleControls();
    }
};

WP_isg_slider.prototype.start = function(){
    this.imgShow(this.index);
    this.render(this.counter);
};

WP_isg_slider.prototype.toggleControls = function(){
    for (var i = 0; i < this.controls.length; i++){
        this.controls[i].classList.toggle("wp_isg_hide_controls");
    }
    this.clicked = !this.clicked;
};

WP_isg_slider.prototype.imgShow = function(index){
    this.elem.style.display = "block";
    this.elem.setAttribute("src", this.gallery[index].src);
};

WP_isg_slider.prototype.stopRender = function(){
    clearTimeout(this.tOut);
};

WP_isg_slider.prototype.showNext = function(){
    this.stopRender();
    this.counter = 0;
    this.start();
};

WP_isg_slider.prototype.render = function(start){
    this.counter = start || 0;
    if ((this.counter > 0.98) && (this.counter < 1)){
        this.pause = 0;
    }
    if (this.counter >= 1 && (this.pause == this.pauseValue)) {
        this.show = false;
    }
    if (this.counter < 0){
        this.show = true;
        this.index = (++this.index > this.maxIndex) ? 0 : this.index;
        this.imgShow(this.index);
    }
    this.counter = (this.show) ? this.counter + 0.01 : this.counter -= 0.01;
    var self = this;
    this.tOut = setTimeout(function () {
        self.elem.style.opacity = self.counter + "";
        self.pause ++;
        self.render(self.counter);
    }, this.delay)
};

WP_isg_slider.prototype.startShow = function(){
    this.screenBlock = this.doc.createElement("div");
    this.screenBlock.classList.add("wp_isg_screen_block");
    this.doc.body.insertBefore(this.screenBlock, this.doc.body.firstElementChild);
    this.popupContainer.style.display = "block";
    this.start();
};