/**
 * Created by Ian on 2014/8/10.
 */

(function(){
    window['BS'] = window['BS'] || {};
    window.BS.b$ = window.BS.b$ || {};
})();

(function(){
    var b$ = {};

    b$ = $.extend(window.BS.b$,{});

    b$.pNative = (typeof maccocojs !== 'undefined') && (maccocojs); // 本地引擎
    b$.cb_execTaskUpdateInfo = null; //执行任务的回调
    b$.pCorePlugin = { //核心处理引导插件部分,尽量不要修改
        useThread: true,
        passBack:"BS.b$.cb_execTaskUpdateInfo",
        packageMode: 'bundle',
        taskToolPath: "/Plugins/extendLoader.bundle",
        bundleClassName: "LibCommonInterface"
    };

    b$.pIAPPlugin = {
        path:"/plugin.iap.bundle"
    };

    // IAP 功能封装
    b$.cb_handleIAPCallback = null; // IAP的回调函数
    b$.IAP = {
        enableIAP : function(parms){
            if(b$.pNative){
                try{
                    //注册IAP回调
                    b$.pNative.iap.regeditIAPCallbackJs(parms.cb_IAP_js || "BS.b$.cb_handleIAPCallback");

                    //注册IAPBundle
                    b$.pNative.iap.regeditIAPCore($.toJSON({
                        path:b$.getAppPluginDir() + b$.pIAPPlugin.path
                    }));

                    //看看是否可以起诉购买
                    if(b$.pNative.iap.canMakePayments()){
                        //启动服务
                        b$.pNative.iap.startIAPService();

                        //发送商品请求
                        b$.pNative.iap.requestProducts($.toJSON({
                            productIdentifiers:parms.productIds ||[]
                        }));
                    }
                }catch(e){
                    console.error(e);
                }

            }
        },

        restore:function(){
            if(b$.pNative){
                //发送购买请求
                b$.pNative.iap.restoreIAP();
            }
        },

        buyProduct:function(parms){
            if(b$.pNative){
                //发送购买请求
                b$.pNative.iap.buyProduct($.toJSON({
                    identifier:parms.productIdentifier,
                    quantity:parms.quantity || 1
                }));
            }
        },

        getPrice:function(productIdentifier){
            if(b$.pNative){
                return b$.pNative.iap.getPrice(productIdentifier);
            }

            return "";
        },

        getUseableProductCount: function(productIdentifier){
            if(b$.pNative){
                return b$.pNative.iap.getUseableProductCount(productIdentifier);
            }

            return 0;
        },
		
		setUseableProductCount:function(jsonObj){
            if(b$.pNative){
				var params = {
					identifier: jsonObj.productIdentifier || '',
					quantity: jsonObj.quantity || 1
				};
                return b$.pNative.iap.setUseableProductCount($.toJSON(params));
            }

            return 0;
		},

        add1Useable : function(productIdentifier){
            if(b$.pNative){
                return b$.pNative.iap.add1Useable(productIdentifier);
            }

            return 0;
        },

        sub1Useable : function(productIdentifier){
            if(b$.pNative){
                return b$.pNative.iap.sub1Useable(productIdentifier);
            }

            return 0;
        }
    };
	
    /**
     * Notice 内容封装
     */
	b$.Notice = {
		alert:function(jsonObj){
            if(b$.pNative){
				var params = {
					message: jsonObj.message || 'Tip',
					title: jsonObj.title || 'title',
					buttons: jsonObj.buttons || ['Ok'],
					alertType: jsonObj.alertType || 'Alert'
				};
			
                return b$.pNative.notice.alert($.toJSON(params));
            }
		}
	};

    /**
     * App 内容封装
     */
    b$.App = {
        appName:null,
        getAppName:function(){
            if(b$.pNative){
                var t = this;
                if(t.appName) return t.appName;
                t.appName = b$.pNative.app.getAppName();
                return t.appName;
            }
            return "AppName";
        },

        appVersion:null,
        getAppVersion:function(){
            if(b$.pNative){
                var t = this;
                if(t.appVersion) return t.appVersion;
                t.appVersion = b$.pNative.app.getAppVersion();
                return t.appVersion;
            }
            return "4.5.6";
        },

        appId:null,
        getAppId:function(){
            if(b$.pNative){
                var t = this;
                if(t.appId) return t.appId;
                t.appId = b$.pNative.app.getAppIdentifier();
                return t.appId;
            }
            return "AppID";
        },

        getSandboxEnable:function(){
            if(b$.pNative){
                var sandboxEnable = b$.pNative.app.getSandboxEnable();
                return sandboxEnable;
            }
            return false;
        },

        getRegInfoJSONString:function(){
            if(b$.pNative){
                var str = b$.pNative.app.getRegInfoJSONString();
                return str;
            }
            return "";
        },

        getSerialNumber:function(){
            if(b$.pNative){
                var str = b$.pNative.app.getStringSerialNumber();
                return str;
            }
            return "";
        },

        open:function(data){
            if(b$.pNative){
                return b$.pNative.app.open(data);
            }
        }
    };


    // 启动核心插件功能
    b$.enablePluginCore = function(pluginList){
        if(b$.pNative){
            try{
                var pluginArray = pluginList || []; // 插件信息数组
                var extendObj = $.objClone(b$.pCorePlugin);
                extendObj["callMethod"] = "initCore";
                extendObj["arguments"] = [
                    true,
                    pluginArray
                ];

                b$.pNative.window.execTask($.toJSON(extendObj));

            }catch (e){
                console.error(e);
            }
        }
    };

    // 启用拖拽功能
    b$.cb_dragdrop = null; // 启动
    b$.enableDragDropFeature = function(obj){
        if(b$.pNative){
            try{
                b$.pNative.window.setDragDropCallback($.toJSON({callback: "BS.b$.cb_dragdrop"}));
                b$.pNative.window.setDragDropAllowDirectory($.toJSON({enableDir: obj.enableDir ||false}));
                b$.pNative.window.setDragDropAllowFileTypes($.toJSON({fileTypes: obj.fileTypes || ["*"]}));
            }catch(e){
                console.error(e);
            }
        }
    };

    // 创建任务
    /**
     *
     * @param callMethod  调用方式：task，sendEvent，
     * @param taskId
     * @param args
     */
    b$.createTask = function(callMethod, taskId, args){
        if(b$.pNative){
            try{
                var extendObj = $.objClone(b$.pCorePlugin);
                extendObj["callMethod"] = callMethod;
                extendObj["arguments"] = [taskId, args];

                b$.pNative.window.execTask($.toJSON(extendObj));
            }catch(e){
                console.error(e);
            }
        }
    };

    // 发送任务事件
    b$.sendQueueEvent = function(queueID, queueType, event){
        if(b$.pNative){
            try{
                var extendObj = $.objClone(b$.pCorePlugin);
                extendObj["callMethod"] = "sendEvent";
                extendObj["arguments"] = [event, queueType, queueID];

                b$.pNative.window.execTask($.toJSON(extendObj));
            }catch(e){
                console.error(e);
            }
        }
    };

    // 导入文件
    b$.cb_importFiles = null; // 导入文件的回调
    b$.importFiles = function(parms){
        if(b$.pNative){
            try{
                b$.pNative.window.openFile($.toJSON(parms));
            }catch(e){
                console.error(e);
            }
        }
    };

    // 选择输出目录
    b$.cb_selectOutDir = null; // 选择输出目录的回调
    b$.selectOutDir = function(parms){
        if(b$.pNative){
            try{
                b$.pNative.window.openFile($.toJSON(parms));
            }catch(e){
                console.error(e);
            }
        }
    };

    // 选择输出文件
    b$.cb_selectOutFile = null; // 选择输出文件的回调
    b$.selectOutFile = function(parms){
        if(b$.pNative){
            try{
                b$.pNative.window.saveFile($.toJSON(parms));
            }catch(e){
                console.error(e);
            }
        }
    };

    // 定位文件
    b$.cb_revealInFinder = null; // 选择定位文件的回调
    b$.revealInFinder = function(path){
        if(b$.pNative){
            try{
                b$.pNative.window.revealInFinder($.toJSON({
                    filePath:path
                }));
            }catch(e){
                console.error(e)
            }
        }
    };

    // 获得App的插件目录
    b$.getAppPluginDir = function(){
        if(b$.pNative){
            return b$.pNative.path.appPluginDirPath();
        }
        return "";
    };

    // 获得Public目录
    b$.getAppResourcePublicDir = function(){
        if(b$.pNative){
            return b$.pNative.path.resource() + "/public";
        }
        return "";
    };



    // 检测路径是否存在
    b$.pathIsExist = function(path){
        if(b$.pNative){
            return b$.pNative.path.pathIsExist(path);
        }
        return true;
    };

    // 检测路径是否可写
    b$.checkPathIsWritable = function(path){
        if(b$.pNative){
            return b$.pNative.path.checkPathIsWritable(path);
        }
        return true;
    };

    // 检测文件是否为0Byte字节
    b$.checkFileIsZeroSize = function(path){
        if(b$.pNative){
            return b$.pNative.path.fileIsZeroSize(path);
        }
        return false;
    };

    // 删除文件
    b$.removeFile = function(path){
        if(b$.pNative){
            return b$.pNative.window.removeFile($.toJSON({path:path}));
        }
    };

    // 查找文件
    b$.findFile = function(dir, fileName){
        if(b$.pNative){
            return b$.pNative.window.findFile($.toJSON({dir:dir, fileName:fileName}));
        }
        return null;
    };

    // 检测是否支持本地存储
    b$.check_supportHtml5Storage = function(){
        try{
            return 'localStorage' in window && window['localStorage'] != null;
        }catch(e){
            return false;
        }
    };

    // 初始化默认的Manifest文件, callback 必须定义才有效
    b$.defaultManifest_key = 'js_defaultManifest_key';
    b$.defaultManifest = {};

    // 保存默认Manifest对象
    b$.saveDefaultManifest = function(newManifest){
        if(!b$.check_supportHtml5Storage()) return false;
        var obj = {manifest: newManifest || b$.defaultManifest};
        var encoded = $.toJSON(obj);
        window.localStorage.setItem(b$.defaultManifest_key, encoded);
        return true;
    };

    // 还原默认Manifest对象
    b$.revertDefaultManifest = function(){
        if(!b$.check_supportHtml5Storage()) return false;
        var encoded = window.localStorage.getItem(b$.defaultManifest_key);
        if(encoded != null){
            var obj = $.secureEvalJSON(encoded);
            b$.defaultManifest = obj.manifest;
        }

        return true;
    };


    // 评价功能监测,内部标识

    b$.ServiceCheckRateApp = {
        key : 'local_defaultRateApp_key', // 默认评价Key
        data : null,                      // 对应的数据

        // 清空数据
        removeData:function(){
            if(b$.check_supportHtml5Storage()){
                window.localStorage.removeItem(this.key);
                this.data = null;
            }
        },

        /**
         * local_defaultRateApp_key : string
         * stirng ---> obj
         *
         * obj[AppName+version] : {toRate:false, remindLater: false, hadRate: false}
         * 可以用0111来标识
         *
         * @returns {null}
         */

        // 获取数据内容
        getData:function(){
            var t = this;
            if(t.data) return t.data;

            if(b$.check_supportHtml5Storage()){
                var objStr = window.localStorage.getItem(t.key);
                if(objStr != null){
                    var obj = $.secureEvalJSON(objStr);
                    t.data = obj;
                    return t.data;
                }else{
                    t.data = {};
                    return t.data;
                }
            }

            return null;
        },

        // 存储数据内容
        saveData:function(){
            var t = this;
            if(t.data != null){
                if(b$.check_supportHtml5Storage()){
                    var objStr = $.toJSON(t.data);
                    window.localStorage.setItem(t.key, objStr);
                }
            }
        },

        // 获取Data关键
        getDataKey:function(type){
            var key = 'defaultAppKey';
            if(type === 'AppKey'){
                var appName = b$.App.getAppName();
                var appVersion = b$.App.getAppVersion();
                key = appName + appVersion;
            }

            return key;
        },

        // 获取obj[AppName+version] 中的对象
        getDataItem:function(key){
            var t = this;
            t.getData();
            if(t.data){
                if(!((typeof t.data[key] != 'undefined') && t.data[key])){
                    t.data[key] = 0;
                }
                return  t.data[key];
            }

            return null;
        },

        // 监测是否有对应的值
        checkRateItemData:function(bord){
            var t = this;
            var key = t.getDataKey("AppKey");
            var obj = t.getDataItem(key);
            var num = parseInt(obj);
            return (num & bord) == bord;
        },

        // 保存评价是否点击的结果
        setRateItemData:function(is, bord){
            var t = this;
            var key = t.getDataKey("AppKey");
            var nowNum = t.data[key];
            t.data[key] = (is == true ? (nowNum | bord) : (nowNum & bord));
            t.saveData();
        },

        // 获取当前版本是否激活了Rate
        getRateActive:function(){
            var t = this;
            return t.checkRateItemData(4);
        },
        // 激活当前版本的Rate
        setRateActive:function(active){
            var t = this;
            return t.setRateItemData(active,4);
        },

        // 获取版本是否RemindLater可用
        getEnableRemindLater:function(){
            var t = this;
            return t.checkRateItemData(2);
        },
        // 设置RemindLater是否可用
        setRemindLaterEnable:function(enable){
            var t = this;
            return t.setRateItemData(enable,2);
        },

        // 获取版本是否已经激活了已经评价过功能
        getHadRateActive:function(){
            var t = this;
            return t.checkRateItemData(1);
        },
        // 设置是否已经评价过
        setHadRateActive:function(active){
            var t = this;
            return t.setRateItemData(active,1);
        }

    };




    window.BS.b$ = $.extend(window.BS.b$,b$);

})();


