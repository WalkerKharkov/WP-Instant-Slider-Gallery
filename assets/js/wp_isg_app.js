function WP_isg(){
    this.getGalleries = this.getGalleries.bind(this);
    this.init();
}

WP_isg.prototype.init = function(){
    this.extensions = ['.jpg', '.jpeg', '.jpe', '.jp2', '.img', '.png', '.gif', '.bmp', '.pdf', '.psd'];
    this.galleryCovers = document.querySelectorAll(".wp_isg");
    this.imgData = wp_isg_data;
    this.galleries = {};
    this.settings = {};
    this.sliders = {};
    this.imgData.forEach(this.getGalleries);
    this.galleriesInit();
};

WP_isg.prototype.getGalleries = function(item){
    var isImg = false;
    item.slides = item.images.split(',');
    for (var i = 0; i < item.slides.length; i++){
        item.slides[i] = item.slides[i].replace(/^\s+/, "").replace(/\s+$/, "");
    }
    item.image = {};
    for (i = 0; i < this.galleryCovers.length; i++){
        if (this.galleryCovers[i].getAttribute("data-instant-gallery-id") == item.id){
            this.settings[item.id] = this.galleryCovers[i].getAttribute("data-instant-gallery-settings").split(":");
        }
    }
    for (i = 0; i < item.slides.length; i++){
        item.image[i] = {};
        if (!isNaN(item.slides[i])){
            item.image[i].src = item.url + item.slides[i] + ".jpg";
            item.image[i].type = "img";
        }else{
            for (var j = 0; j < this.extensions.length; j++){
                if (item.slides[i].indexOf(this.extensions[j]) >= 0) isImg = true;
            }
            if (isImg){
                item.image[i].src = item.url + item.slides[i];
                item.image[i].type = "img";
            }else{
                item.image[i].src = "http://mini.s-shot.ru/" + this.settings[item.id][0] + "x" + this.settings[item.id][1] +
                    "/" + this.settings[item.id][0] + "/jpeg/?http://www.youtube.com/embed/" + item.slides[i];
                item.image[i].type = "vid";
            }
            isImg = false;
        }
    }
    this.galleries[item.id] = item.image;
};

WP_isg.prototype.galleriesInit = function(){
    for (var i in this.galleries){
        this.sliders[i] = new WP_isg_slider(i, this.galleries[i], this.settings[i]);
    }
};

WP_isg.prototype.showGallery = function(id){
    this.sliders[id].startShow();
};

var wp_isg = new WP_isg();