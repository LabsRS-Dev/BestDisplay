/**
 * Created by Ian on 2014/8/18.
 */

(function(){
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function() {
    var c$ = {};
    c$ = $.extend(window.UI.c$,{});

    // 插件数据
    c$.plugins_all_id = 'Resolution.plugin.preset.all';  // 开启所有功能的插件ID
    /**
     *
     * @type {{
     * name: string,
     * enable: boolean,
     * inAppStore: boolean,
     * id: string,
     * type: string,
     * quantity: number,
     * price: string,
     * description: string,
     * url: string,
     * uiShow: boolean // 是否在UI页面上显示
     * }[]}
     */
    c$.pluginsData = [
        { name: "800 x 600", enable:true, inAppStore: true, id:"Resolution.plugin.preset.800x600", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1024 x 768", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1024x768", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1152 x 900", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1152x900", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1280 x 720", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1280x720", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1280 x 768", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1280x768", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1280 x 800", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1280x800", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1280 x 960", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1280x960", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1280 x 1024", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1280x1024", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1366 x 768", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1366x768", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1400 x 1050", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1400x1050", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1440 x 900", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1440x900", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1600 x 900", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1600x900", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1600 x 1200", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1600x1200", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1680 x 1050", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1680x1050", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1920 x 1080", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1920x1080", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1920 x 1200", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1920x1200", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "1920 x 1440", enable:true, inAppStore: true, id:"Resolution.plugin.preset.1920x1440", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "2560 x 1440", enable:true, inAppStore: true, id:"Resolution.plugin.preset.2560x1440", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: "2560 x 1600", enable:true, inAppStore: true, id:"Resolution.plugin.preset.2560x1600", type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:true}
        ,{ name: c$.plugins_all_id, enable:true, inAppStore: true, id:c$.plugins_all_id, type:"", quantity:0, price:"", description: "", url: "images/lock_64.png", uiShow:false}
    ];

    c$.pluginMethod = {
        // 获取插件对象
        getPluginObj:function(pluginId){
            var obj = null;
            $.each(c$.pluginsData, function(index, plugin){
                if(plugin.id == pluginId){
                    obj = plugin;
                    return false;
                }
            });

            return obj;
        },
		
		// 获取插件对象，通过唯一名称
		getPluginObjByName:function(pluginName){
            var obj = null;
            $.each(c$.pluginsData, function(index, plugin){
                if(plugin.name == pluginName){
                    obj = plugin;
                    return false;
                }
            });

            return obj;
		},

        // 获取可用的，在苹果应用商店注册的插件ID数组
        getEnableInAppStorePluginIDs:function(){
            var pluginIDs = [];
            $.each(c$.pluginsData, function(index, plugin){
                if(plugin.enable && plugin.inAppStore){
                    pluginIDs.push(plugin.id);
                }
            });

            return pluginIDs;
        },
		
		// 获取所有内置插件的名称
		getAllPluginNames:function(){
            var pluginNames = [];
            $.each(c$.pluginsData, function(index, plugin){
                if(plugin.enable && plugin.inAppStore){
                    pluginNames.push(plugin.name);
                }
            });

            return pluginNames;
		},

        // 获取可用的，在苹果应用商店注册的插件
        getEnableInAppStorePlugins:function(){
            var plugins = [];
            $.each(c$.pluginsData, function(index, plugin){
                if(plugin.enable && plugin.inAppStore){
                    plugins.push(plugin);
                }
            });

            return plugins;
        },

        // 获取所有插件是否都已经购买
        getAllPluginPurchased:function(){
            return (BS.b$.IAP.getUseableProductCount(c$.plugins_all_id) > 0);
        },

        // 获取根据给定的是否已经购买
        getPluginPurchased:function(plugin){
            if (c$.pluginMethod.getAllPluginPurchased()) return true;
            return (BS.b$.IAP.getUseableProductCount(plugin) > 0);
        },


        //同步插件信息，从商店.一种是获取数量（从已经存储的）一种是新购买的
        cb_sync:null,
        syncPluginsDataFromAppStore:function(pluginId){
            if(pluginId){
                $.each(c$.pluginsData, function(index, plugin){
					if(pluginId == c$.plugins_all_id){ // 等于总的插件
						if(plugin.enable){
							//IAP 内部全部给数量值
	                        var quantity = BS.b$.IAP.getUseableProductCount(plugin.id);
							if(quantity < 1){
								quantity = BS.b$.IAP.add1Useable(plugin.id);
							}
		
							//本地插件的数量同步
							plugin.quantity = quantity;
							
						}
					}else{
	                    if(plugin.enable && (plugin.id == pluginId)){
	                        var quantity = BS.b$.IAP.getUseableProductCount(pluginId);
	                        var price = BS.b$.IAP.getPrice(pluginId);
	                        plugin.quantity = quantity;
	                        plugin.price = price;
	                        return false;
	                    }
					}
                });

            }else{
				if(c$.pluginMethod.getAllPluginPurchased()){
	                $.each(c$.pluginsData, function(index, plugin){
	                    if(plugin.enable && plugin.inAppStore){
	                        var quantity = BS.b$.IAP.getUseableProductCount(plugin.id);
							if(quantity < 1){
								quantity = BS.b$.IAP.add1Useable(plugin.id);
							}
	                        var price = BS.b$.IAP.getPrice(pluginId);
	                        plugin.quantity = quantity;
	                        plugin.price = price;
	                    }
	                });
				}else {
	                $.each(c$.pluginsData, function(index, plugin){
	                    if(plugin.enable && plugin.inAppStore){
	                        var quantity = BS.b$.IAP.getUseableProductCount(plugin.id);
	                        var price = BS.b$.IAP.getPrice(pluginId);
	                        plugin.quantity = quantity;
	                        plugin.price = price;
	                    }
	                });
				}
            }

            c$.pluginMethod.cb_sync && c$.pluginMethod.cb_sync();
        },
		
        // 重新初始化本地插件数据，查看哪些插件将被隐藏
        reInitPluginDataWithLocalData:function(presetList){
			
			// 第一，pluginsData 不在presetList中的
            $.each(c$.pluginsData, function(index, plugin){
                if(plugin.enable && plugin.inAppStore){
                    if($.inArray(plugin.name, presetList) == -1){
                    	plugin.uiShow = false;
                    }
                }
            });
			
			// 第二，prestList中存在，但是pluginsData中不存在的
			var pluginNameList = c$.pluginMethod.getAllPluginNames();
			$.each(presetList, function(index, preset){
				if($.inArray(preset, pluginNameList) == -1){
					var newPluginData = {
						name: preset,
						enable:true, 
						inAppStore: false, 
						id:preset, 
						type:"", 
						quantity:1, 
						price:"", 
						description: "", 
						url: "images/lock_64.png", 
						uiShow:true
					};
					
					c$.pluginsData.push(newPluginData);
				}
			});	
			
			var presetOrder = c$.pluginsData.sort(
				function(a,b){
					try{
						var a_split = a.name.split(" x ");
						var b_split = b.name.split(" x ");
						if (parseInt(a_split[0]) > parseInt(b_split[0])) return 1;
						if (parseInt(a_split[0]) < parseInt(b_split[0])) return -1;
						if (parseInt(a_split[0]) == parseInt(b_split[0])){
							return parseInt(a_split[1]) - parseInt(b_split[1]);
						}
					}catch(e){
						return -1;
					}

				}	
			);
			
			var newPlugins = [];
			$.each(presetOrder, function(index, value){
				newPlugins.push(value);
			});
			
			c$.pluginsData = newPlugins;
        },

        // 更新本地的插件的价格及描述信息，通过产品列表
        cb_update:null,
        updatePluginsDataWithList:function(productInfoList){
            $.each(productInfoList, function(index, productInfo){
                var productIdentifier = productInfo.productIdentifier;
                var description = productInfo.description;
                var price = productInfo.price;

                var plugin = c$.pluginMethod.getPluginObj(productIdentifier);
                plugin.price = price;
                plugin.description = description;

            });

            c$.pluginMethod.cb_update && c$.pluginMethod.cb_update();
        }


    };

    window.UI.c$ = $.extend(window.UI.c$,c$);
})();