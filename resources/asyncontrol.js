/*!
 * AscynDataLoader.js v1.0.0
 * 
 * Copyright 2011, Foresee Ltd
 * 
 * Includes jQuery.js
 * 
 * @author  wangbozheng
 * 
 * 页面数据异步加载 
 *
 * Date: 2012-1-07
 */
  // 参考jquery 使用闭包方式
(function( window, undefined ) {
	var context ='';
	if (typeof(webContext) ==='undefined' || webContext === 'null' || webContext === null || webContext === ""){
		context =  '/etax';
	}else {
		context =webContext;
	};
  var document = window.document;
  var fsAsynDataLoader = (function(){
    // 定义本地变量
    var fsAsynDataLoader = function (param){
      return new fsAsynDataLoader.fn.init(param);
    };

  	fsAsynDataLoader.fn = fsAsynDataLoader.prototype = {
  	  constructor: fsAsynDataLoader,
  	 
  	  init: function (param){},

  	  isNull: function(param){
	  	 if (param === null || param === "null" || param === undefined || param === "undefined"){
	  	  	 return true;
	  	  } 
	  	  return false;
  	  },
  	  
  	  isValidString: function(str){
  		 if ((!fsAsynDataLoader.fn.isNull(str)) && (str != "")){
  			 return true;
  		 } 
  		 return false;
  	  }, 
  	  // 数据填充到表格中
  	  fillTable: function(tableElement,datas,html,showReduncyRow){
  		  // 清理旧数据
  		  fsAsynDataLoader.fn.clearTable(tableElement);
  		  
  		  var jqElement =  $(tableElement);
	      var rowTemplate =  jqElement.find("#rowTemplate");
	      rowTemplate.removeAttr("id");
	      var intervalClass = rowTemplate.attr("intervalClass");
	      var maxItem = jqElement.attr("maxItem");
	      var cloneRow  ;
	      var dataContainer = rowTemplate.parent();
    	 
	      // 回调函数如果直接渲染了数据,把渲染了html数据传过来
  		  if (fsAsynDataLoader.fn.isValidString(html)) {
  	    	 rowTemplate.remove();
  	    	 dataContainer.append($(html));
  	         return ;
  	      }
  	      
  	      var isFirstRowClass = true;
	      var count = 0;   
    	  $.each(datas,function(index,value){
    		 if (maxItem > 0){
    			//超过设定最大行 不进行处理
    			if (count >= maxItem){ 
    				return;
    			};
    			count++;
    		 } 
    		cloneRow = rowTemplate.clone();
    		cloneRow.attr("dynamicRow",index);
    		cloneRow.attr("reduncyRow",'false');
    		cloneRow.show();
    		 $.each(value,function(name,subValue){
    	    	var j = cloneRow.find("#" + name);
    	    	if (j.length >= 1){
    	    	  var targetAttr = j.attr("targetAttr"); 
    	    	  if (fsAsynDataLoader.fn.isNull(targetAttr)) {
    	    		 j.text(subValue);
    	    	  }  else {
    	    		  // 有设定目标属性，把值写进去目标属性中
    	    	     j.attr(targetAttr,subValue);
    	    	  };
    	    	};
    		 });
    		 // 是否有序号列
    		 if (cloneRow.find("#columnOrder").length > 0){
    			 cloneRow.find("#orderNumber").text(index + 1);	
    		 }
    		//  处理表格行样式交替出现的情况 
    		intervalClasses = cloneRow.find("[intervalClass]");
    		intervalClasses.each(function(){
    		  var j = $(this);
    		  if (isFirstRowClass){
    			j.removeAttr("intervalClass");
    		  }else{
    			j.removeClass("*");
    			j.addClass(j.attr("intervalClass")); 
    			j.removeAttr("intervalClass");
    		  } 
    		});
    		
    		isFirstRowClass = !isFirstRowClass;
    		cloneRow.appendTo(dataContainer);
    	  });
    	
    	 // 不够最大行数，空行补足；解决数据行不够，破坏页面布局的问题
    	for (var i = 0 ;i < (maxItem -count) ;i++){
    		cloneRow = rowTemplate.clone();
    		cloneRow.attr("dynamicRow",i);
    		cloneRow.attr("reduncyRow",'true');
    		cloneRow.show();
    		if (!showReduncyRow){
    		  cloneRow[0].style.visibility ="hidden";
    		}
    		dataContainer.append(cloneRow);
    	}
    	
    	rowTemplate.attr("id","rowTemplate");
    	rowTemplate.hide();  
    	//rowTemplate.remove();  		  
  	  },
  	  //  显示数据加载时，表格中定义的等待图片
  	  showTableWaitingImg: function(tableElement){
  		  tableElement.style.display = "none";
  		  var jq = $(tableElement);
	
	      var loadingImgSrc = jq.attr("loadingImgSrc");
	      var loadingHint = jq.attr("loadingHint");
	      var loadingImgDivHeight = jq.attr("loadingImgDivHeight");
	      
	      if (!fsAsynDataLoader.fn.isValidString(loadingImgSrc)) {
	          if (fsAsynDataLoader.fn.isNull(context)) {
	        	  context = "/etax";
	          };
	    	  loadingImgSrc = context + "/style/images-common/waiting/loading.gif";
	      }
	      if (!fsAsynDataLoader.fn.isValidString(loadingHint)) {
	    	  loadingHint = "正在加载数据,请您稍等...";
	      }
	      
	      if (!fsAsynDataLoader.fn.isValidString(loadingImgDivHeight)) {
	    	  loadingImgDivHeight = "100%";
	      }
	      var loaddingDiv = $('<div id = "loadingDiv" style = "text-align:center; height:'+loadingImgDivHeight+'; background-image: url('+loadingImgSrc+
	    		              ');background-position: center;background-repeat: no-repeat;" >'+
	                         '<div id = "hintDiv" style="position: relative; top:65%;"><span id = "hint" style="">'+loadingHint+'</span></div></div>'); 
	      loaddingDiv.prependTo(jq.parent());  
	      
	      return loaddingDiv;
  	  },
  	  // 数据加载后，显示一些信息
  	  showMsgAfterLoadData: function(loaddingDiv,Msg,errorMsgTop){
 		 loaddingDiv.css("background-image","none");
	     loaddingDiv.find("#hintDiv").css("top",errorMsgTop);
		 loaddingDiv.find("#hint").text(Msg);
  	  },
  	  // 清理表单
  	  clearTable: function(tableElement){
  		 var jElement = $(tableElement);
  		 var elements = jElement.find('*[dynamicRow]');  
  		 elements.each(function (index){
  			 var jq = $(this); 
  			 jq.remove();
  		 });
  	  },
  	  //  清除掉动态增加的等待的加载层
  	  clearLoadingDiv: function(tableElement,loaddingDiv){
   		 tableElement.style.display = "block";
  		  var loading = loaddingDiv || "loading";
  		  if (loading != "loading"){
	        loaddingDiv.css("display","none");
	        loaddingDiv.remove();
	      } else {
	    	 var lj =  $("#"+ loading);
	    	 if (lj.length > 0) {
	    		 lj.css("display","none");
	    		 lj.remove();
	    	 } 
	      } 
  	  },
  	  // xml转换成加载表格需要的json格式.
  	  xmlToJson: function(xml,selector){
  		  var jxml = $(xml);
	      var json = new Array();
	      var sel = sel || '*';
	      jxml.find(selector).each(function(index){
	    	  var jsonElemnt = {};
	    	  $(this).find('*').each(function(index){
	    		   jsonElemnt[$(this).context.nodeName] = $(this).text();  
	    	     });
	    	  json.push(jsonElemnt);
   	       });
   	       json.push(jsonElemnt);  
   	       return json;
  	  },
  	  // 异步方式，把数据加载到表格中
  	  asynLoadDataToTable: function(reqParam,tableId){
  		  var jq = $("#" + tableId);
  		  var loaddingDiv = fsAsynDataLoader.fn.showTableWaitingImg(jq[0]);
  	      var timeout = jq.attr("timeout");
  	      var timeoutFlag = false;
  	    
  	      // 超时触发的处理函数
  	      var timeoutHandler = function(){
  	  	       timeoutFlag = true;
  		       fsAsynDataLoader.fn.showMsgAfterLoadData(loaddingDiv,"数据加载超时！","50%");  	    	  
  	          } ;
  	     
  	      var timeoutHandle =  window.setTimeout(timeoutHandler, timeout);
  	      var pageCallback = reqParam.callBack;
  	      
  	      // 异步访问回调函数
  	 	  function callback(status, msg, dataType, datas) {
  	 	  	  window.clearTimeout(timeoutHandle); 
  	 	  	  // 页面有机会处理异步返回的数据
  	 	  	  datas = pageCallback(status, msg, dataType, datas);
  	   	      if (timeoutFlag) {
  		  	  // 已经超时，无论数据获取成功是否，不再加载数据到页面
  		  	   return;
  		      }
  		      if (status != "0000"){
  			    // 请求失败
  			    fsAsynDataLoader.fn.showMsgAfterLoadData(loaddingDiv,msg,"50%");
  			    return;
  		      }
  		      fsAsynDataLoader.fn.clearLoadingDiv(jq[0],loaddingDiv);
  		      fsAsynDataLoader.fn.fillTable(jq[0],datas,"");
  		}
  	 	reqParam.callBack = callback;
  	 	//异步请求数据
  	    fsAsynDataLoader.fn.asynRequestData(reqParam);	  		  
  	  },
  	  // 扫描页面页面需要异步数据加载的元素,并加载数据
  	  scanAsyncElement: function(cssSelector){
  		  var elements = $('*[ascynDataLoad="true"]'); 
     	  // 遍历
    	  elements.each(function (index){
			  var jq = $(this);
    		  if (this.tagName === "TABLE"){
	  				// 隐藏自身	  
				  this.style.display = "none";
				  var element = this;
			      //var elementName = this.tagName;  
			
			      var maxItem = jq.attr("maxItem");
			      var timeout = jq.attr("timeout");
			      var loadDataProcedure = jq.attr("loadDataProcedure");
			      var rowTemplate =  jq.find("#rowTemplate");
			      
			      //  显示滚动图片
			      var loaddingDiv = fsAsynDataLoader.fn.showTableWaitingImg(element);
			      
			      var timeoutFlag = false;
                  
			      // 超时触发的处理函数
			      var timeoutHandler = function(){
			    	    timeoutFlag = true;
				        fsAsynDataLoader.fn.showMsgAfterLoadData(loaddingDiv,"数据加载超时！","50%");  	    	  
			          }  ;
			       
			      var timeoutHandle =  window.setTimeout(timeoutHandler, timeout);
			        	      
			      //请求数据成功后的，回调函数；传回请求状态和请求数据
			      //requestStatus：请求状态,html：渲染后的html,datas：返回原始数据
			      var afterLoadData = function (requestStatus,html,datas){
			    	  window.clearTimeout(timeoutHandle); 
			    	  if (timeoutFlag) {
			    		  // 已经超时，无论数据获取成功是否，不再加载数据到页面
			    		  return;
			    	  }
			    	  if (requestStatus != "0000"){
			    		  // 请求失败
			    		 fsAsynDataLoader.fn.showMsgAfterLoadData(loaddingDiv,html,"50%");
			    		 return;
			    	  }
			    	    	    	  
			    	  fsAsynDataLoader.fn.clearLoadingDiv(element,loaddingDiv);
				      fsAsynDataLoader.fn.fillTable(element,datas,html);
			      };
	    		  
			      // 调用异步获取数据过程  	      
			      loadDataProcedure = eval("(" +  loadDataProcedure  + ")");
			      loadDataProcedure(rowTemplate, maxItem, afterLoadData); 
    		  } else{ 
			     var loadDataProcedure = jq.attr("loadDataProcedure");
			     loadDataProcedure = eval("(" +  loadDataProcedure  + ")");
			     loadDataProcedure(this);
    		  }
  		}); 
  	  },
  	  // 异步请求数据
  	  //dataType:（xml, json, script, or text） 
  	  //ajaxType:(GET,POST)
  	  //qAjaxType:(GET,POST)
  	  // reqParam(url,data,dataType,timeout,callBack,qurl,qdataType,queryData,ajaxType,qAjaxType)
  	  asynRequestData: function(reqParam){
  		 var id;
  		 var qIntervalTime;
  		 var timeoutFlag = false;
	      // 请求已经完成
	     var requestCompleted = false;
  		 var queryHandle = null;
   		 var qdata = reqParam.queryData || {};
   		 var url = reqParam.url || ""; 
   		 var timeout = reqParam.timeout || 10000*1000*20;
   		 var dataType = reqParam.dataType || "xml";
   		 var qurl = reqParam.qurl || reqParam.url;
   		 var data = reqParam.data || {};
   		 var qdataType = reqParam.qdataType || "xml";
   		 var ajaxType = reqParam.ajaxType || "POST" ;
   		 var qAjaxType = reqParam.qAjaxType || "POST" ;
   		 //var qdt = qdataType || "xml";
   		 var callBack = reqParam.callBack;
   		 var isShowErrorInfo = reqParam.isShowErrorInfo;
   		 if (fsAsynDataLoader.fn.isNull(isShowErrorInfo)) {
   			isShowErrorInfo = true;
   		 }
   		 
   		 var queryTimeout = 0;
   		 // 查询状态对象
   		 var queryStateObj = null;
   		 
   		 // 处理异常
   		 var handleTimeOut = function(status,eMsg,DetailMsg){
    		   var loadingDiv = $("#loading");
    		   var dMsg = DetailMsg || "";
    		   if (loadingDiv.length > 0){
    			  loadingDiv.css('background-image','none');
    			  loadingDiv.css('font-size','10pt');
    			  loadingDiv.css('font-weight','bold');
    			  loadingDiv.css('color','red');
    			  loadingDiv.find("#hintDiv").css('top','45%');
    			  loadingDiv.find('#hint').text(eMsg);
    			  var timeoutAction = $("#timeoutAction");
    			  if (timeoutAction.length <= 0){
    				 loadingDiv.append($('<div id = "timeoutAction"><a style="color: black" href = "#" onclick="$.unblockUI();">关闭</a></div>'));
    			  }
                  if (dMsg !== ""){
                	  loadingDiv.css('height','70px');
                	  loadingDiv.parent().css("top","10%");
                	  loadingDiv.parent().css("height","500px");
                	  loadingDiv.parent().css("width","68%");
                	  loadingDiv.parent().css("left","16%");
                	  //loadingDiv.parent().append($('<div><textarea rows="26" cols="98" value="' + dMsg + '"></textarea></div>'));
                	  loadingDiv.parent().append($('<div><iframe id="msgFrame" style="width: 100%;height: 450px; display: none" frameborder="0" name="msgFrame" scrolling="auto"></iframe></div>'));
                	  var msgFRame = document.getElementById('msgFrame');
                	  msgFRame.contentWindow.document.write(DetailMsg);
                	  msgFRame.style.display = "block";
                  }
    		    }
    		  };
    		  
    	  var handleException = reqParam.exceptionCallback || function(status,eMsg,DetailMsg){
    			  var errorMessge = eMsg;
    			  if (fsAsynDataLoader.fn.isValidString(DetailMsg)) {
    				  errorMessge = DetailMsg;
    			  }

    			  var wh = 500;
    			  var ht = 285;
    			  // 大概估算提示框的大小
    			  if (errorMessge.length > 60){
    				  var m = 220 * 65 / 60 * errorMessge.length;
    				  wh = 300 + Math.sqrt(m*5/3);
    				  ht = 150 + Math.sqrt(m*3/5);
    			  } 
    			  //fsAsynDataLoader.fn.unBlockPage();
    			  $("#loading").parent().hide();
    			  var msg = {allowSelect: true,message:errorMessge,width:wh,height:ht,handler:function(){fsAsynDataLoader.fn.unBlockPage();}};
    			  if(errorMessge.indexOf("代扣代缴车船税申报表出现错误") >=0){
    				  errorMessge = errorMessge.replace(/<\/br>/g,'\n ');
        			  var rowErr = errorMessge.split('\n').length;
        			  var htErr = rowErr * 16+20;
        			  var content = '<link href='
        					+ webContext
        					+'"/style/css-swzj-01/style.css" rel="stylesheet" type="text/css">'
        					+'<textarea  name="" type="text" style="width:755px; height:'+htErr+'px; overflow:hidden"> \n '
        					+errorMessge+'</textarea>' ;
        			  Message.win({message:content, width:780, height:430, title:'提示', btn: ['OK'],closeBtn:true,autoClose:true,handler:function(){fsAsynDataLoader.fn.unBlockPage();},maxBtn:false,minBtn:false});
    			  }else{
    				  Message.errorInfo(msg);
    			  }
    		  };
    		  
    	 var timeoutEvent = function(){
    		    // 已经超时 
             timeoutFlag = true;
    		  
 		    window.clearTimeout(queryHandle);
 		    if (!requestCompleted){
 		    	if (queryStateObj === null){
 	 		       handleTimeOut('timeout','处理超时了！');  
 	 		    } else {
 	 		       callBack("0002",'','xml',queryStateObj); 
 	 		    }
 		    };  
	        //callBack("timeout","数据加载超时了！",null,null);  
    	  };	  
    		  
  		 // 设置超时
         var timeoutHandle =  window.setTimeout(timeoutEvent, timeout);
         
	     // 查询结果请求方法
         var queryReq = function(){
			 $.ajax({
	  			  url: qurl,
	  			  data: qdata,
	  			  dataType: qdataType,
	  			  contentType: "application/x-www-form-urlencoded; charset=utf-8", 
	  		   	  headers:{"Accept":"text/plain;charset=UTF-8"},
	  		   	  type: ajaxType,
		  		  complete:function(){  
		  		    	//特殊处理，在进入表单时由于装载数据比较慢，所以改变提示层信息
		  		    	if(typeof(reqParam.data)!='undefined' && typeof(reqParam.data.action)!='undefined' && reqParam.data.action==='sbFormInit'){
		  		    		$('#hint')[0].innerText = '请求数据完毕，正在加载数据,请您稍等...';
		  		    	}
	                },
	  			  success:function(qdata1, textStatus, jqXHR){
		  		     if (timeoutFlag){
			  			  return;
			  			 };
	  				//成功返回业务数据
			  		requestCompleted = true;
			  		callBack("0000","",qdataType,qdata1,qdata.tid);
	  			  },
	  			  
	  			  timeout: timeout,
	  			  
	  			  error: function(jqXHR, textStatus, errorThrown){
	  				if (timeoutFlag){
		  			  // 超时了
	  				} else {
	  					if(jqXHR.status === 300) {
	  						// 继续查询
	  						try{
	  						   if (queryStateObj === null && jqXHR.responseText !== ''){
	  							 var respText  = $.trim(jqXHR.responseText);
	  							 if (respText.indexOf('<') === 0){
	  								queryStateObj = $.parseXML(respText);
	  								var str = $(queryStateObj).find("result > returnCode").text(); 
	  								if (str === ''){
	  								  queryStateObj = null;
	  								}
	  							 }
	  						   }
	  						}catch(e){
	  							queryStateObj = null;
	  						}
	  			            queryHandle = window.setTimeout(queryReq, qIntervalTime);
	  					}  else {
	  						//exceptionCallBack(jqXHR.status, jqXHR.responseText);
	  						requestCompleted = true;
	  						//显示异常信息标志为true直接显示异常信息；
	  						if (isShowErrorInfo) {
	  							//返回内容为错误报文，且返回码不为0，显示报文中message冒号reason，其他情况直接显示返回内容
	  							errorInfo = jqXHR.responseText;
	  							try{
	  								responseXml = $($.parseXML(jqXHR.responseText));
	  								rtnCode = "";
	  								message= "";
	  								reason = "";
	  								if(responseXml.find("bizResult > head > rtnCode").length>0){
	  									rtnCode=responseXml.find("bizResult > head > rtnCode")[0].text;
	  									message=responseXml.find("bizResult > head > rtnMsg > message")[0].text;
	  									reason=responseXml.find("bizResult > head > rtnMsg > reason")[0].text;
	  								}
	  								if (fsAsynDataLoader.fn.isValidString(rtnCode)) {
	  									errorInfo = message;
	  									if (fsAsynDataLoader.fn.isValidString(reason)) {
	  										errorInfo = message + "：" +  reason;
	  									}
  									} 
	  							} catch (e) {
	  								
	  							}
	  							handleException(jqXHR.status,'系统服务异常，请稍等片刻后重新办理业务！',errorInfo);
	  						} else {
	  							//设置了不统一显示错误，返回内容为错误报文，其他情况执行回调
	  							try{
	  								$.parseXML(jqXHR.responseText);
	  								callBack("0001","",qdataType,jqXHR.responseText);
	  							} catch (e) {
	  								//虽然设置了不统一显示错误，但返回内容为非错误返回报文文字内容直接显示异常信息
	  								handleException(jqXHR.status,'系统服务异常，请稍等片刻后重新办理业务！',jqXHR.responseText);
	  							}
	  						}
	  						
	  					}
	  				  
	  				}		 
	  			  }
	  		});
		 };   
         // 业务请求，服务端快速返回请求
  		 $.ajax({
  			  url: url,
  			  data: data,
  			  dataType: dataType, 
  			  headers:{"Accept":"text/plain;charset=UTF-8"},
  			  type: qAjaxType,
  			 beforeSend:function(){  
	  		    	//特殊处理，在进入表单时由于装载数据比较慢，所以改变提示层信息
	  		    	if(typeof(reqParam.data)!='undefined' && typeof(reqParam.data.action)!='undefined' && reqParam.data.action==='sbFormInit'){
	  		    		$('#hint')[0].innerText = '正在加载数据,请您稍等...';
	  		    	}
             },
  			  success: function(sdata, textStatus, jqXHR){
  				 var doc = $(sdata);
  				 id = doc.find("result>tid").text(); 
  				 sid = doc.find("result>sid").text(); 
 				 qIntervalTime = doc.find("result>waitingTime").text(); 
 				 queryTimeout = doc.find("result>timeoutTime").text();
 				 if (queryTimeout !== null && queryTimeout !=='' &&  queryTimeout > 0){
 					window.clearTimeout(timeoutHandle); 
 					window.setTimeout(timeoutEvent, queryTimeout);
 				 }
 				 if(qIntervalTime > 3000) {
 					qIntervalTime = 3000;
 				 }

 				 // TO DO 查询url和参数格式未定
 				 //qdata = {tid:id};
 				 qdata.tid = id;
 				 qdata.sid = sid;
 			    // 开始定时轮询查询  			   
  			    queryHandle = window.setTimeout(queryReq, qIntervalTime);
  			  },
  		      error: function(jqXHR, textStatus, errorThrown){
	  			// window.clearTimeout(queryHandle);		
	  			  //　TO DO  非业务性异常，用http头体现
  		    	if (timeoutFlag){
  		    	   // callBack("timeout","数据加载超时了！",null,null);  
  		    	 }else{
  		    		//exceptionCallBack(jqXHR.status, null);
  		    		handleException(jqXHR.status,'系统服务异常，请稍等片刻后重新办理业务！',jqXHR.responseText);
  		    	 }  
  		      },
  			  timeout: timeout,
  			  contentType: "application/x-www-form-urlencoded; charset=utf-8",
		  	  complete:function(XMLHttpRequest, textStatus){
		  	  	if(XMLHttpRequest.status==401){
		  	  		top.window.location.href="/etax/admin/userLoginOtherPlace.do";
		  	  	}
		  	  }  
  			});
  		 
  	  },
  	  /**
  	   *   锁定页面
  	   * @param hintMsg
  	   */
  	  blockPage: function(hintMsg){
  		 var html = '<div id = "loading" style = "text-align:center;height:150px; background-image: url('
			+ '/skin/www/style/images-common/waiting/loading.gif);background-position: center;background-repeat: no-repeat;" >'
			+ '<div id = "hintDiv" style="position: relative; top:65%;"><span id = "hint" style="">'+hintMsg+'</span></div></div>';
  		 $.blockUI({
    		  message : html,
    		  css : {
    			  "border-style" : "none",
    			  width : 370,
    			  height : 150,
    			  top :  ($(window).height() - 150) / 2,
    			  left : ($(window).width() - 370) / 2,
    			  cursor : 'wait'
    		  },
    		  overlayCSS : {
    			  backgroundColor : '#000',
    			  opacity : 0.3
    		  }
  		 });  		  
  	  },
  	  
  	  /**
  	   *  使用空白层锁定页面
  	   * @param hintMsg
  	   */
  	  blockPagePureDiv: function(){
  		 var html = '<div id = "loading" style = "display:none"></div>';
  		 $.blockUI({
    		  message : html,
    		  css : {
    			  "border-style" : "none",
    			  width : 0,
    			  height : 0,
    			  top :  0,
    			  left : 0,
    			  cursor : 'wait'
    		  },
    		  overlayCSS : {
    			  backgroundColor : '#000',
    			  opacity : 0.1
    		  }
  		 });  		  
  	  },
  	  /**
  	   *
  	   *   解锁页面
  	   */
      unBlockPage: function(){
    	 $.unblockUI(); 
   	     window.setTimeout(function(){$("html").css('cursor','pointer');}, 100);
      },
  	  /**
 	   *
 	   * 隐藏消息提示框
 	   */
     hideBlockUIMsg: function(){
    	 $("#loading").parent().hide();
     },      
  	 getVersion: function(){ return "v1.0.0" ;}
  	};
  	
  	fsAsynDataLoader.fn.init.prototype = fsAsynDataLoader.fn;
  	
  	// 暴露到全局
  	return fsAsynDataLoader;
  })();
  
  // 全局引用
  window.fsAsynDataLoader = fsAsynDataLoader();
})(window);
