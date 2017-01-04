/**
 * Created by Ian on 2014/8/8.
 */

(function(){
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();


(function(){
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var c$ = {};
    c$ = $.extend(window.UI.c$,{});

    c$.log = function(message, isError){
        kendoConsole.log(message, isError, "#-log");
    };

    /**
     * 初始化标题及版本
     */
    c$.initTitleAndVersion = function(){
        document.title = BS.b$.App.getAppName();
    };

    /**
     * 初始化Toolbar
     */
    c$.initToolbar = function(){
        $('#toolbar').kendoToolBar({
            items:[
                { type: "button", text: "Change", icon:"restore", primary: true, overflow: "never", click:c$.actions.onChangeResolutionClick },
                { type: "separator" },
                {
                    type: "splitButton",
                    text: "Default",
                    menuButtons: [
                        { text: "Save as default", icon: "insert-n", click:c$.actions.onMakeDefaultClick }
                    ],
					overflow: "never",
					click:c$.actions.onUseDefaultClick
                },
                { type: "separator" },
                { type: "button", text: "Restore",icon:"clock", click: c$.actions.onRestoreClick},
				{ type: "separator" },
                { type: "button", id:'toolBtn-feedback', text: "FAQ",click: c$.actions.onFeedbackClick},
                { type: "button", id:'toolBtn-review', text: "Rate App",click: c$.actions.onReviewClick},
                {template: "<div><img src='images/logo_64.png' width='36'/><span>Ver " + BS.b$.App.getAppVersion()+ "</span></div>"}
            ]
        });
    };

    // 初始化PresetData
    c$.initPresetData = function(){
        //同步得到真实的插件数据
        var copyPlugin = $.objClone(c$.corePluginsMap.DisplayHelperPlugin);
        copyPlugin.tool.command = ["-g"];
        var assTaskId = 1000;
        BS.b$.createTask(copyPlugin.callMethod, assTaskId, [copyPlugin.tool]);


        // 封装UI的创建工作
        c$.createPresetTableUI = function(){
            c$.ds_plugins = kendo.data.DataSource.create({
                data: c$.pluginsData,
                filter:[
                    {field:"enable", operator:"eq", value:true}
                    ,{field:"uiShow", operator:"eq", value:true}
                ],
                change:function(e){
                    try{
                        var items = c$.data();

                        var enableItems = [];
                        $.each(items, function(index, item){
                            if(item.enable && item.quantity < 1){
                                enableItems.push(item);
                            }
                        });
                    }catch(e){

                    }
                }
            });


            $("#mainGrid").kendoGrid({
                dataSource: c$.ds_plugins,
                height: 300,
		        width:222,
                scrollable: true,
                selectable: "row",
                rowTemplate: kendo.template($("#plugin-viewTemplate").html()),
                columns: [
					{ field: "name", title: "Preset" }
                ]
            });
			
			// 默认选择第一个
			$('#mainGrid').data('kendoGrid').select('tr:eq(1)');
			
			// 初始化Drawer
			c$.initDrawer();
			
        };

        //TEST: 测试
        if(!BS.b$.pNative) c$.createPresetTableUI();

    };

    // 获取分辨率的比例
    c$.getResolutionRatio = function(resolution){
        var a_split = resolution.split(" x ");
        var width = parseInt(a_split[0]), height = parseInt(a_split[1]);

        //浮点除法运算
        function floatDiv(arg1, arg2){
            var t1 = 0, t2 = 0, r1, r2;
            try{
                t1 = arg1.toString().split(".")[1].length
            } catch(e){}
            try{
                t2 = arg2.toString().split(".")[1].length
            } catch(e){}

            with(Math){
                r1 = Number(arg1.toString().replace(".", ""));
                r2 = Number(arg2.toString().replace(".", ""));

                return (r1/r2) * pow(10, t2 - t1);
            }
        }

        var ratio = floatDiv(width, height);

        if(floatDiv(4,3) == ratio){
            return "(4:3)";
        }else if(floatDiv(16,10) == ratio){
            return "(16:10)";
        }else if(floatDiv(16,9) == ratio){
            return "(16:9)";
        }else if(floatDiv(5,4) == ratio) {
            return "(5:4)";
        }else if(floatDiv(15,9) == ratio) {
            return "(15:9)";
        }else if(floatDiv(25,16) == ratio) {
            return "(25:16)";
        }else if(floatDiv(3,2) == ratio) {
            return "(3,2)";
        }else{
            return "";
        }

    };


    // 初始化绘制区域
    c$.initDrawer = function(){
        var mainGrid = $('#mainGrid');
        var drawer = $('#drawer-canvas');
        drawer.css({
            width:$('body').width() - mainGrid.width() - 8,
            height:mainGrid.height()
        });

        // 绘制当前的尺寸
        c$.drawer_stage = new Kinetic.Stage({
            width: drawer.width(),
            height: drawer.height(),
            container: 'drawer-canvas'
        });

        var layerBk = new Kinetic.Layer();
        var background = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: c$.drawer_stage.getWidth(),
            height: c$.drawer_stage.getHeight(),
            fill: '#555666'
        });

        layerBk.add(background);
        c$.drawer_stage.add(layerBk);
        c$.drawer_stage.draw();

        //TEST: 测试
        if(!BS.b$.pNative) c$.updateDrawer(1280, 800);

    };


    c$.updateDrawer = function(r_width,r_height){
        var w = r_width * 0.14, h = r_height * 0.14;
		if(c$.drawer_stage){
	        if(typeof c$.dest_rect == 'undefined'){

	            // 矩形
	            c$.dest_layer = new Kinetic.Layer();
	            c$.dest_rect = new Kinetic.Rect({
	                width:w,
	                height:h,
	                x:(c$.drawer_stage.getWidth() - w)/2,
	                y:(c$.drawer_stage.getHeight() - h)/2,
	                fill: 'red',
	                stroke: 'black',
	                strokeWidth: 2,
	                cornerRadius:2,
	                shadowEnabled:true
	            });

	            // label
	            c$.dest_label = new Kinetic.Text({
                    fontFamily:'Menlo, Monaco, Consolas',
                    fontStyle:'bold',
	                fontSize:13,
	                lineHeight: 1.2,
	                fill: 'white'
	            });

	            c$.dest_layer.add(c$.dest_rect);
	            c$.dest_layer.add(c$.dest_label);
	            c$.drawer_stage.add(c$.dest_layer);
	        }

	        // 矩形处理
	        c$.dest_rect.x((c$.drawer_stage.getWidth() - w)/2);
	        c$.dest_rect.y((c$.drawer_stage.getHeight() - h)/2);
	        c$.dest_rect.height(h);
	        c$.dest_rect.width(w);

	        // label 处理
            var resolution = r_width + ' x ' + r_height;
            var resLabel = resolution + "  " + c$.getResolutionRatio(resolution);
	        c$.dest_label.text(resLabel);
	        c$.dest_label.x((w - c$.dest_label.width())*0.5 + c$.dest_rect.x());
	        c$.dest_label.y((h - c$.dest_label.height())*0.5 + c$.dest_rect.y());


	        c$.drawer_stage.draw();
		}
    };
	
	c$.updateDrawerWithResolution = function(resolution){
		try{
			// 解锁当前的plugin
			var plugin = c$.pluginMethod.getPluginObjByName(resolution);
			
			try{
				// Fixme: 添加到已经购买的队列中
				var pluginID = plugin.id;
				if(plugin.quantity < 1){
					plugin.quantity = BS.b$.IAP.add1Useable(plugin.id);
				}
				c$.actions.refresh_presetData();


				var a_split = resolution.split(" x ");
				var width = parseInt(a_split[0]), height = parseInt(a_split[1]);
				c$.updateDrawer(width,height);
			}catch(e){
				console.error(e)
			}
			

		}catch(e){
			console.error(e);
		}

	};

    c$.actions = {
        onChangeResolutionClick:function(e){
			try{
				var grid = $('#mainGrid').data('kendoGrid');
				var data = grid.dataItem(grid.select());
				
				// 数据为空
				if(data == null){
					var message = {
						title:"No preset selected.",
						message:"You must select one preset to change resolution.",
						buttons:["OK"],
						alertType:"Information"
					};
					BS.b$.Notice.alert(message);
					return;
				}
								
				var preset = data.name; //得到所对应的preset
				var pluginId = data.id; //获得对应的插件ID
				var quantity = data.quantity; //对应的数量
				
				// 与当前相同
				var cur_resolution = $('#currentResolution').text();
				if (cur_resolution == data.name){
					var message = {
						title:"Current resolution preset selected.",
						message:"Your current resolution is now selected. no need change.",
						buttons:["OK"],
						alertType:"Information"
					};
					BS.b$.Notice.alert(message);
					return;
				}
				
				
				
				
				//检查是否需要购买
				var mustBuy = false;
				if( quantity < 1
					&& c$.pluginMethod.getAllPluginPurchased() == false
					&& c$.pluginMethod.getPluginPurchased(pluginId) == false){
					mustBuy = true;
				}
				
				if(mustBuy){
					// 弹出购买窗体
					var allPluginPrice = BS.b$.IAP.getPrice(c$.plugins_all_id) || '$9.99';
					var curPluginPrice =  BS.b$.IAP.getPrice(pluginId) || '$0.99';
					var message = {
						title:"Unlock [" + preset + "] preset",
						message:"Only " + curPluginPrice + " ,Do you want to unlock it. \nAlso all presets only " + allPluginPrice + " you can buy all at times.",
						buttons:["Buy","Cancel","Buy All"],
						alertType:"Alert"
					};
					
					var result = BS.b$.Notice.alert(message);
					if(result == 1){      //购买单个
						c$.actions.onBuyClick(pluginId);
					}else if(result > 1){ //购买全部
						c$.actions.onBuyClick(c$.plugins_all_id);
					}
					
				}else{
					// 发出任务进行处理
			        var copyPlugin = $.objClone(c$.corePluginsMap.DisplayHelperPlugin);
			        copyPlugin.tool.command = ["-s","'" +preset+ "'"];
			        var assTaskId = (new Date()).getTime();;
			        BS.b$.createTask(copyPlugin.callMethod, assTaskId, [copyPlugin.tool]);
				}
				

				
			}catch(e){
				console.error(e);
			}

        },

        onUseDefaultClick:function(e){
			try{
				// 发出任务进行处理
		        var copyPlugin = $.objClone(c$.corePluginsMap.DisplayHelperPlugin);
		        copyPlugin.tool.command = ["-u"];
		        var assTaskId = (new Date()).getTime();
		        BS.b$.createTask(copyPlugin.callMethod, assTaskId, [copyPlugin.tool]);
			}catch(e){
				console.error(e);
			}
        },

        onMakeDefaultClick:function(e){
			try{
				// 发出任务进行处理
		        var copyPlugin = $.objClone(c$.corePluginsMap.DisplayHelperPlugin);
		        copyPlugin.tool.command = ["-m"];
		        var assTaskId = (new Date()).getTime();
		        BS.b$.createTask(copyPlugin.callMethod, assTaskId, [copyPlugin.tool]);
			}catch(e){
				console.error(e);
			}
        },

        onFeedbackClick:function(e){
            BS.b$.App.open("https://github.com/Romanysoft/Resolution2/issues");
        },

        onReviewClick:function(e){
            BS.b$.App.open('macappstores://itunes.apple.com/us/app/resolution2/id918100130?l=zh&ls=1&mt=12');
        },

        onRestoreClick:function(e){
			BS.b$.IAP.restore();
        },

        onBuyClick:function(e){
			BS.b$.IAP.buyProduct({productIdentifier:e, quantity:1});
        },

        refresh_presetData:function(){
            try{
				var grid = $('#mainGrid').data('kendoGrid');
				if(grid){
					grid.dataSource.read();
					grid.refresh();
				}
            }catch (e){
                console.warn(e);
            }
        }

    };

    // 购买插件的日志内容
    c$.log_buyPlugin = function(productIdentifier, typeInfo, mesage){
        var pluginObj = c$.pluginMethod.getPluginObj(productIdentifier);
		if(pluginObj && typeof pluginObj.name != 'undefined'){
	        var pluginName = pluginObj.name;
	        var log = "[" +$.getMyDateStr() + "] " + typeInfo + " " + pluginName + (mesage || "");
	        c$.log(log, false);
		}
    };

    // 安装与BS的相关联的任务
    c$.setupAssBS = function(){
        // 配置与主逻辑相关的回调
        BS.b$.cb_execTaskUpdateInfo = function(obj){ // 插件相关的回调处理
 		    console.log($.obj2string(obj));
            // 声明处理插件初始化的方法
            function process_init(obj){
                try{
                    if (obj.type == "type_initcoresuccess") {

                    }else if(obj.type == "type_initcorefailed") {
                        console.error('init core plugin failed!');
                    }
                }catch(e){
                    console.error(e);
                }

            }

            // 声明处理CLI的回调处理
            function process_dylibCLI(obj){
                try{
                    var infoType = obj.type;
                    if (infoType == 'type_clicall_start'){

                    }else if(infoType == 'type_clicall_reportprogress'){
						if(typeof obj.CLIStateData != 'undefined'){						
	                        var cli_StateData = obj.CLIStateData;
							
							if(typeof cli_StateData.infoText != 'undefined'){
								var cli_infoTextDic = JSON.parse(cli_StateData.infoText);
								
								// 处理获得本地的分辨率
								if(typeof cli_infoTextDic.getAllSupportResolution != 'undefined'){
									var local_resolutionList = cli_infoTextDic.getAllSupportResolution;
									// 同步到主界面
									UI.c$.pluginMethod.reInitPluginDataWithLocalData(local_resolutionList);
									UI.c$.createPresetTableUI();
								}else if(typeof cli_infoTextDic.getCurResolution != 'undefined'){
									var cur_resolution = cli_infoTextDic.getCurResolution;
									// 同步到主界面
									$('#currentResolution').text(cur_resolution);
									UI.c$.updateDrawerWithResolution(cur_resolution);
									
								}else if(typeof cli_infoTextDic.getDefault != 'undefined'){
									var default_resolution = cli_infoTextDic.getDefault;
									// 同步到主界面
									$('#defaultResolution').text(default_resolution);
								}else if(typeof cli_infoTextDic.useDefault != 'undefined'){
									var resolution = cli_infoTextDic.useDefault;
									UI.c$.updateDrawerWithResolution(resolution);
									$('#defaultResolution').text(resolution);
								}else if(typeof cli_infoTextDic.makeDefault != 'undefined'){
									var resolution = cli_infoTextDic.makeDefault;
									UI.c$.updateDrawerWithResolution(resolution);
									$('#defaultResolution').text(resolution);
								}
							}

						}

                    }else if(infoType == 'type_clicall_end'){

                    }

                }catch(e){
                    console.error(e);
                }

            }

            // 声明处理ExecCommand的方法
            function process_execCommand(obj){
                try{
                    var infoType = obj.type;
                    if(infoType == 'type_addexeccommandqueue_success'){
                        var queueID = obj.queueInfo.id;
                        BS.b$.sendQueueEvent(queueID, "execcommand", "start");
                    } else if(infoType == 'type_execcommandstart'){

                    } else if(infoType == 'type_reportexeccommandprogress'){

                    } else if(infoType == 'type_execcommandsuccess'){

                    } else if(infoType == 'type_canceledexeccommand'){

                    } else if(infoType == 'type_execcommanderror'){

                    }
                }catch(e){
                    console.error(e);
                }

            }

            // 声明处理Task的方法
            function process_task(obj){
                try{
                    var infoType = obj.type;
                    if(infoType == "type_addcalltaskqueue_success"){
                        var queueID = obj.queueInfo.id;
                        BS.b$.sendQueueEvent(queueID, "calltask", "start");
                    }else if(infoType == "type_calltask_start"){

                    }else if(infoType == "type_calltask_error"){
                        console.error($.obj2string(obj));

                    }else if(infoType == "type_calltask_success"){
                        console.log($.obj2string(obj));
                    }else if(infoType == "type_type_calltask_cancel"){
                        console.log($.obj2string(obj));
                    }
                }catch(e){
                    console.error(e);
                }

            }


            // 以下是调用顺序
            process_init(obj);
            process_dylibCLI(obj);
            process_execCommand(obj);
            process_task(obj);
        };

        // 处理IAP的回调
        BS.b$.cb_handleIAPCallback = function(obj){
            try{
                var info = obj.info;
                var notifyType = obj.notifyType;

                if(notifyType == "ProductBuyFailed"){
                    //@"{'productIdentifier':'%@', 'message':'No products found in apple store'}"
                    var productIdentifier = info.productIdentifier;
                    var message = info.message;
                    UI.c$.log_buyPlugin(productIdentifier,"order plugin failed", message );

                }else if(notifyType == "ProductPurchased"){
                    //@"{'productIdentifier':'%@', 'quantity':'%@'}"
                    // TODO: 购买成功后，处理同步插件的问题
                    var productIdentifier = info.productIdentifier;
                    UI.c$.pluginMethod.syncPluginsDataFromAppStore(productIdentifier);
                    UI.c$.log_buyPlugin(productIdentifier,"order plugin success");

                }else if(notifyType == "ProductPurchaseFailed"){
                    //@"{‘transactionId':'%@',‘transactionDate’:'%@', 'payment':{'productIdentifier':'%@','quantity':'%@'}}"
                    var productIdentifier = info.payment.productIdentifier;
                    UI.c$.log_buyPlugin(productIdentifier,"order plugin failed");
                }else if(notifyType == "ProductPurchaseFailedDetail"){
                    //@"{'failBy':'cancel', 'transactionId':'%@', 'message':'%@', ‘transactionDate’:'%@', 'payment':{'productIdentifier':'%@','quantity':'%@'}}"
                    var productIdentifier = info.payment.productIdentifier;
                    var message = "error:" + "failed by " + info.failBy + " (" + info.message + ") " + "order date:" + info.transactionDate;
                    UI.c$.log_buyPlugin(productIdentifier,"order plugin failed", message);
					
                }else if(notifyType == "ProductRequested"){
                    //TODO:从AppStore商店获得的产品信息
                    if(typeof info == "string"){
                        info = JSON.parse(info);
                    }
                    UI.c$.pluginMethod.updatePluginsDataWithList(info);

                }else if(notifyType == "ProductCompletePurchased"){
                    //@"{'productIdentifier':'%@', 'transactionId':'%@', 'receipt':'%@'}"
                    var productIdentifier = info.productIdentifier;
                    var message = "productIdentifier: " + info.productIdentifier + ", " + "transactionId: " + info.transactionId + ", " + "receipt: " + info.receipt;
                    UI.c$.log_buyPlugin(productIdentifier,"ProductCompletePurchased", message);
                }

            }catch(e){
                console.error(e);
            }

        };

        // 开启IAP
        BS.b$.IAP.enableIAP({cb_IAP_js:"BS.b$.cb_handleIAPCallback", productIds:UI.c$.pluginMethod.getEnableInAppStorePluginIDs()});

        // 注册插件
        BS.b$.enablePluginCore([c$.corePluginsMap.DisplayHelperPlugin]);

    };

    // 初始化回调处理
    c$.init_mainCB = function(){
        c$.pluginMethod.cb_sync = function(){
            c$.actions.refresh_presetData();
        };

        c$.pluginMethod.cb_update = function(){
            c$.actions.refresh_presetData();
        };
    };

    // 初始化同步信息
    c$.init_syncData = function(){
        // 默认要从本地得到正确的产品数量及价格
        c$.pluginMethod.syncPluginsDataFromAppStore();

    };

    // 测试node
    c$.test_node = function(){

        var copyPlugin = $.objClone(c$.corePluginsMap.NodePlugin); // 复制一个插件副本
        var regCommand = '["%input%","%http_port%"]';

        var jsPath = BS.b$.pNative.path.resource() + '/public/server/server.js';
        var port = BS.b$.pNative.app.getHttpServerPort();
        var formatProfile = regCommand.replace(/%input%/g, jsPath);
        formatProfile = formatProfile.replace(/%http_port%/g,port);

        var command = eval(formatProfile); // 转换成command
        copyPlugin.tool.command = command;
        BS.b$.createTask(copyPlugin.callMethod, (new Date()).getTime(), [copyPlugin.tool]);

    };


    // 默认初始化
    c$.launch = function(){
        c$.init_mainCB();
        c$.setupAssBS();
        c$.init_syncData();

        c$.initTitleAndVersion();
        c$.initToolbar();
        c$.initPresetData();
    };

    window.UI.c$ = $.extend(window.UI.c$,c$);

})();





