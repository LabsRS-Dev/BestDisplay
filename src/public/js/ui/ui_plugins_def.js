/**
 * Created by Ian on 8/18/14.
 */

(function(){
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();


(function(){
    var c$ = {};
    c$ = $.extend(window.UI.c$,{});

    // 插件(核心插件) 映射表
    c$.corePluginsMap = {
        DisplayHelperPlugin:{
            callMethod:"call",
            tool:{
                key:"displayHelper",
                path:"displayhelper.dylib",
                method:"CLI",
                type:"dylib",
                mainThread:false
            }
        },
        NodePlugin:{
            callMethod:"task",
            type:"calltask",
            tool:{
                appPath:BS.b$.getAppPluginDir() + "/node",
                command:[],
                mainThread:false
            }
        }
    };

    window.UI.c$ = $.extend(window.UI.c$,c$);
})();