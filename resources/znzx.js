/**
 * 在线导办js，获取跳转链接URL，显示在线咨询的浮窗
 */
var flag;
var x;
var y;
var l;
var t;
var guide;
var $guide;
var $guideDiv;
var guideShade;
var maxTop;
var maxLeft;

$(function() {
	createDiv();
	function createLink(path) {
		var head = document.getElementsByTagName("head")[0];
		var link = document.createElement("link");
		link.rel = 'stylesheet';
		link.href = "/sbzs-cjpt-web" + path;
		link.type = 'text/css';

		head.appendChild(link);
	}
	
	function createScript(path) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "/sbzs-cjpt-web" + path;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	function createDiv() {
		if (!document.getElementById("pay-tax-app")){
			createLink("/view/guide/znhd/znhd-sdk.css");
			createScript("/view/guide/znhd/znhd-sdk.web.min.js"); // 引入征纳互动组件库
			var addDivDom = document.createElement("div");
			var bodyDom = document.body;
			addDivDom.id = "pay-tax-app";
			addDivDom.style.position = "fixed";
			addDivDom.style.height = "800px";
			addDivDom.style.top = "50%";
			addDivDom.style.left = "50%";
			addDivDom.style.transform = "translate(-50%,-50%)";
			bodyDom.appendChild(addDivDom);
		}
		
	}
	
	var url = window.location.pathname;
    $.ajax({
        url: "/sbzs-cjpt-web/znzx/getZnzxUrl.do",
        type: "post",
        data: {
            url: url
        },
        success: function (data) {
            var resultObj = {};
            try {
                resultObj = JSON.parse(data);
            }catch (e) {
                console.log(e);
            }
            if(resultObj.qybz == 'Y') {
				var znzxurl = resultObj.znzxUrl;
				var znhdbz = resultObj.znhdbz;
                var business = resultObj.business;
                var businessId = resultObj.businessId;
				if (znhdbz === 'BBBW'){
					showGuideOnline();
                    openGuideOnlineUrl(znzxurl);
                } else {
                	openZnhd(znzxurl, business, businessId);
                }
            }
        }
    });
    
});



/**
 * 展示征纳互动
 */
function openZnhd(znhdUrl, business, businessId){
    try{
    	var interval = setInterval(function(){
    		if(window.ZnhdSdk!=undefined){
	    		var wrapper = document.getElementById('pay-tax-app');
	            var service = new window.ZnhdSdk({
	                entrance: {
	                    token:'',
	                    buttonZIndex: 9999,
	                    channel: '3', // GDSDZSWJ-24056 渠道代码：新电局 14 旧电局 3 电票 10
	                    business: business,
	                    businessId: businessId,
	                    iframeUrl: znhdUrl // 征纳互动网页地址 必传
	                },
	                target: wrapper,
	            });
	            $("#pay-tax-app").css("display","block");
	            clearInterval(interval);
    		}
    	},1000)
    }catch(e){}
}

/**
 * 关闭或隐藏或移除征纳互动
 */
function closeZnhd(){
    try{
        if($("#pay-tax-app")){
            //$("#parent").remove();
            $("#pay-tax-app").css("display","none");
        }
    }catch(e){}
}


/**
 * 展示在线导办图标
 */
function showGuideOnline() {
    var picPath =  "/sbzs-cjpt-web/abacus/_res_/img/guideOnline/bszdy.png";
    var elem = '<div id="guideShade" style="display:none;width: 100%;height: 100%;z-index: 99999998;background-color: rgb(0, 0, 0);opacity: 0;position: absolute;top: 0;left: 0;pointer-events: auto;"></div>' +
        '<div id="guideDiv" style="position:fixed;z-index: 99999999;width: 70px;height: 140px;">';
    //添加关闭按钮
    elem += '   <div id="guideClose" style="text-align:right;">'+
        '       <button type="button" style="text-align:center;" class="layui-btn layui-btn-primary layui-btn-xs">✖</button>' +
        '</div>';
    elem += '  <img id="guide" src="' + picPath + '" alt=""/>' +
        '</div>';
    $(document.body).append(elem);

    guide = document.getElementById("guideDiv");
    $guideDiv = $("#guideDiv");
    $guide = $("#guide");
    guideShade = $("#guideShade");

    calcMoveRange();
    initPosition();

    $(document).on("mousedown", "#guideDiv", function (event) {
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        event.preventDefault();
        guideShade.css("display", "block");
        flag = true;
        x = event.clientX;
        y = event.clientY;
        l = guide.offsetLeft;
        t = guide.offsetTop;
    });

    $(document).on("mousemove", function (event) {
        if (!flag) {
            return;
        }
        var clientX = event.clientX;
        var clientY = event.clientY;
        var left = clientX - (x - l);
        var top = clientY - (y - t);

        left = Math.min(maxLeft, left);
        left = Math.max(0, left);
        top = Math.min(maxTop, top);
        top = Math.max(0, top);

        $guideDiv.css("left", left);
        $guideDiv.css("top", top);
    });

    $(document).on("mouseup", function (event) {
        flag = false;
        guideShade.css("display", "none");
    });

    /**
     * 窗口变化时，再次计算并初始化定位
     */
    $(window).resize(function () {
        calcMoveRange();
        initPosition();
    });
}

/**
 * 注册点击事件，跳转
 * @param url
 */
function openGuideOnlineUrl(url) {
    $(document).off('click', '#guide').on("click", "#guide", function (event) {
        var clientX = event.clientX;
        var clientY = event.clientY;
        if (x === clientX && y === clientY) {
            window.open(url);
        }
    });

    $(document).off('click', '#guideClose').on("click", "#guideClose", function (event) {
        var guideShade = document.getElementById("guideShade");
        if (guideShade != null){
            guideShade.parentNode.removeChild(guideShade);
        }
        var guideDiv = document.getElementById("guideDiv");
        if (guideDiv != null){
            guideDiv.remove();
        }
    });

}

/**
 * 计算移动范围
 */
function calcMoveRange() {
    maxTop = $(window).height() - guide.offsetHeight;
    maxLeft = $(window).width() - guide.offsetWidth;
    if (guide.offsetWidth === 0) {
        setTimeout(function () {
            calcMoveRange();
        },100);
    }
}

/**
 * 初始化定位
 */
function initPosition() {
    $guideDiv.css("left", "")
    $guideDiv.css("right", "22px");
    $guideDiv.css("top", parseInt($(window).height() / 3));
}

