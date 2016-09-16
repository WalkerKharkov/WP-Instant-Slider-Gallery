(function() {
    tinymce.PluginManager.add('addisgshortcode', function(editor, url){
        editor.addButton('addisgshortcode',{
            image : url + '/button.jpg',
            title : 'add wp instant slider gallery shortcode',
            onclick: function() {
                editor.windowManager.open({
                    url: url + '/dialog.html',
                    width: 800,
                    height: 360
                });
                var popupWindow = document.querySelector('.mce-window'),
                    windowHead = document.querySelector('.mce-window-head'),
                    windowTitle = document.querySelector('.mce-title'),
                    closeButton = document.querySelector('.mce-close'),
                    closeIcon = document.querySelector('.mce-i-remove');
                popupWindow.style.borderRadius = '5px';
                windowHead.style.cssText = 'padding-left:5px;padding-top:5px;vertical-align:middle;border-radius:5px;margin:2px;' +
                    'background: linear-gradient(to top, #017449, #0AA070);color:white;font: bold 1rem "Arial Black";';
                windowTitle.style.cssText = 'line-height:normal;font-size:20px;color:white';
                windowTitle.innerText = ' Creating an ISG shortcode...';
                closeButton.style.cssText = 'color:#017449;vertical-align:center;font:bold 1.4rem "Arial Black";' +
                    'background-color:white;border-radius:5px;height:30px;top:5.5px;right:5.5px;padding-left:1px';
                closeIcon.style.display = 'none';
                closeButton.innerHTML = '&times;';
                closeButton.addEventListener('mouseover', function(){
                    closeButton.style.color = 'white';
                    closeButton.style.backgroundColor = '#017449';
                });
                closeButton.addEventListener('mouseout', function(){
                    closeButton.style.color = '#017449';
                    closeButton.style.backgroundColor = 'white';
                })
            }
        });
    });
})();