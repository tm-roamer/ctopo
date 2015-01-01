/**
 * 控制台小工具
 * 作者:田明
 * 使用方式:
 *	var consolePanel = new ConsolePanel({
 *		//上下左右回调
 *		steerwheel:function(direct){
 *			//direct==event.keyCode
 *		},
 *		//放大,缩小回调
 *		scale:function(scale){
 *			//scale=比例
 *		}
 *	});
 */
function ConsolePanel(){
	var self = this;
	this.console_panel="console_panel"; //div的名称
	this.zoom="zoom";
	this.steerwheel_panel="steerwheel_panel";
	this.steer_btn="steer_btn";
	this.scale_bar="scale_bar";
	this.scale_slider="scale_slider";
	this.scale_ruler_current="scale_ruler_current";
	//当前缩放比例和上一次的缩放比例,用于监听change
	this.scale=.5;
	this.prevScale=.5;

	//预置的高度
	var steerwheelHeight = 86,	//方向盘的高度
		zoomBtnHeight=26,		//放大,缩小按钮的高度
		scaleBarHeight = 140,	//比例尺总高度
		scaleSliderHeight = 20,	//滑块高度
		scaleBarBackgroundPositionX = -44,  //比例尺图片精灵定位的起点x
		scaleBarBackgroundPositionY = -430; //比例尺图片精灵定位的起点y

	//切换上下左右的图片
	this.setSteerWheelClass = function(className){
		var steerwheel_panel = document.querySelector("."+this.steerwheel_panel);
		steerwheel_panel.setAttribute("class",this.steerwheel_panel+" "+className);
	};
	//设置初始化参数
	this.setOption = function(opt){
		self.opt=opt||{};
	};
	//调整滑块和当前比例的位置
	this.setScale = function(num){
		var	ratioHeight,
			ratioTop,
			sliderTop,
			slider = self.scale_slider, 				//滑块
			ruler_current = self.scale_ruler_current;	//当前比例
  		//设置滑块和当前比例
		self.scale = num>1?1:(num<0.1?0:num);
		ratioHeight = parseInt(scaleBarHeight*self.scale);		//取得当前比例高度
		ratioTop = parseInt(scaleBarHeight-ratioHeight);		//取得当前比例top位置
		sliderTop = (ratioTop-scaleSliderHeight/2);				//滑块的top位置
		sliderTop = sliderTop<0?0:(sliderTop>=130?120:sliderTop);	//ps: 比例尺图片有阴影,所以补充运算
		var position = scaleBarBackgroundPositionX+"px "+(scaleBarBackgroundPositionY-ratioTop)+"px";
		var slider = document.querySelector("."+slider);
		slider.style.top=sliderTop+"px";
		var ruler_current = document.querySelector("."+ruler_current);
		ruler_current.style.height=ratioHeight+"px";
		ruler_current.style.top=ratioTop+"px";
		ruler_current.style.backgroundPosition=position;
		//配置的回调
  		if( self.opt.scale ){
  			var n = new Number(self.scale).toFixed(1)*1;
  			//只有值发生改变才会触发回调
  			if( n != self.prevScale ){
  				//这里设定放大,缩小的值域
  				self.opt.scale(self.prevScale,n);
  			}
  			self.prevScale = n;
  		}
	};
	//上下左右的hover监听(兼职监听keydown)
	function selectedBtn(e){
		if( e.keyCode ){ 		//为键盘
			var direct = e.keyCode;
			if( direct == 37 || direct == 38 || direct==39 || direct == 40){
				//配置的回调
		  		if( self.opt.steerwheel ){
		  			self.opt.steerwheel(direct);
		  		}
			}
		}else{ 					//为mouseenter
  			var direct = parseInt(e.target.getAttribute("data-direct"));
		}
  		self.setSteerWheelClass("steer_"+direct);
	}
	function selectedClickBtn(e){
		//配置的回调
		var direct = parseInt(e.target.getAttribute("data-direct"));
  		if( self.opt.steerwheel ){
  			self.opt.steerwheel(direct);
  		}
	}
	function cancelSelectedBtn(e){
		self.setSteerWheelClass("steer_default");
	}
	//滑块的滑轮监听(向上是放大,向下是缩小)
	function scrollSlider(e){
		var num = self.scale;
		if(e.wheelDelta){
			num = e.wheelDelta>0?num+0.1:num-0.1; //ie,chrome向上滚 > 0
		}else if(e.detail){
			num = e.detail>0?num-0.1:num+0.1; //firefox向下滚 > 0
		}
		self.setScale(num);
	}
	//放大缩小的点击事件
	function zoomBtn(e){
		var type = e.target.getAttribute("data-type");
		if( type=="out" ){
			self.scale=self.scale+0.1;
		}else if( type=="in" ){
			self.scale=self.scale-0.1;
		}
		self.setScale(self.scale);
	}
	//比例尺滑块的拖拽监听
	function enableDragDrapSlider(e){
		var slider = e.target.getAttribute("class");
		if( slider == self.scale_slider ){
			e.target.setAttribute("data-drag","true");
		}
	}
	function runDragDrapSlider(e){
		var console_panel = document.querySelector("."+self.console_panel),
			slider = document.querySelector("."+self.scale_slider);
		if( eval( slider.getAttribute("data-drag") ) ){
			var offsetTop = console_panel.offsetTop+steerwheelHeight+zoomBtnHeight; //预设变量
			if( offsetTop<=e.pageY && e.pageY <=offsetTop+scaleBarHeight ){
				var num = ( scaleBarHeight-(e.pageY-offsetTop) )/scaleBarHeight;
				//console.log(b);
				self.setScale(num);
			}
		}
	}
	function disableDragDrapSlider(e){
		var slider = document.querySelector("."+self.scale_slider);
		slider.setAttribute("data-drag","false");
	}

	//初始化监听
	this.initEvent = function(){
		//上下左右的hover监听(click)
		var steerBtnArray = document.querySelectorAll("."+self.steer_btn);
		if( steerBtnArray ){
			for(var i=0; i<steerBtnArray.length; i++){
				var btn = steerBtnArray[i];
				btn.addEventListener("mouseenter",selectedBtn,false); //悬停
				btn.addEventListener("mouseleave",cancelSelectedBtn,false); //离开
				btn.addEventListener("click",selectedClickBtn,false); 	  //点击
			}
		}
		//上下左右的键盘监听
		var body = document.querySelector("body");
		body.addEventListener("keydown",selectedBtn,false); 	//摁下
		body.addEventListener("keyup",cancelSelectedBtn,false); //松开
		//放大,缩小按钮的单击监听
		var zoomArray = document.querySelectorAll("."+self.zoom);
		if( zoomArray ){
			for(var i=0; i<zoomArray.length; i++){
				var btn = zoomArray[i];
				btn.addEventListener("click",zoomBtn,false); 	//点击
			}
		}
		//比例尺滑块的鼠标滑轮监听
    	body.addEventListener("mousewheel",scrollSlider,false); 	//IE,chorme
		body.addEventListener("DOMMouseScroll",scrollSlider,false); //firefox
		//比例尺滑块的拖拽监听
		body.addEventListener("mousedown",enableDragDrapSlider,false); 	//摁下
		body.addEventListener("mousemove",runDragDrapSlider,false); 	//移动
		body.addEventListener("mouseup",disableDragDrapSlider,false);   //抬起
		return self;
	};

	//移除监听
	this.removeEvent=function(){
		//移除上下左右的悬停事件(click)
		var steerBtnArray = document.querySelectorAll("."+self.steer_btn);
		if( steerBtnArray ){
			for(var i=0; i<steerBtnArray.length; i++){
				var btn = steerBtnArray[i];
				btn.removeEventListener("mouseenter",mouseenterBtn,false); //悬停
				btn.removeEventListener("mouseleave",mouseleaveBtn,false); //离开
				btn.removeEventListener("click",selectedClickBtn,false); 	   //点击
			}
		}
		//移除上下左右的键盘监听
		var body = document.querySelector("body");
		body.removeEventListener("keydown",selectedBtn,false); //摁下
		body.removeEventListener("keyup",cancelSelectedBtn,false); //松开
		//移除放大,缩小按钮的单击监听
		var zoomArray = document.querySelectorAll("."+self.zoom);
		if( zoomArray ){
			for(var i=0; i<zoomArray.length; i++){
				var btn = zoomArray[i];
				btn.addEventListener("click",zoomBtn,false); 	//点击
			}
		}
		//移除比例尺滑块的鼠标滑轮监听
		body.removeEventListener("mousewheel",scrollSlider,false); 	//IE,chorme
		body.removeEventListener("DOMMouseScroll",scrollSlider,false); //firefox
		//移除比例尺滑块的拖拽监听
		body.removeEventListener("mousedown",enableDragDrapSlider,false); 	//摁下
		body.removeEventListener("mousemove",runDragDrapSlider,false); 	//移动
		body.removeEventListener("mouseup",disableDragDrapSlider,false);   //抬起
		return self;
	};
	this.show=function(){
		var console_panel = document.querySelector("."+self.console_panel);
		self.initEvent();
		console_panel.style.visibility="visible";
	};
	this.hide=function(){
		var console_panel = document.querySelector("."+self.console_panel);
		if( console_panel){
			self.removeEvent();
			console_panel.style.visibility="hidden";
		}	
	};
	this.getDom = function(){
		var console_panel = document.createElement("div");
		console_panel.setAttribute("class","console_panel")
		console_panel.style.visibility="hidden";
		console_panel.innerHTML='<!-- class名称不建议修改,部分已绑定事件-->'+
			'<!-- 东西南北 -->'+
			'<div class="steerwheel_panel steer_default">'+
				'<div class="steer_btn steer_btn_up"    title="向上平移" data-direct="38"></div>'+
				'<div class="steer_btn steer_btn_left"  title="向左平移" data-direct="37"></div>'+
				'<div class="steer_btn steer_btn_right" title="向右平移" data-direct="39"></div>'+
				'<div class="steer_btn steer_btn_down"  title="向下平移" data-direct="40"></div>'+
			'</div>'+
			'<!-- 放大缩小 -->'+
			'<div class="zoom_panel">'+
				'<div class="zoom zoom_out" title="放大一级" data-type="out"></div>'+
				'<div class="scale_bar">'+
					'<div class="scale_ruler"></div><!-- 进度槽 -->'+
					'<div class="scale_slider" data-drag="false"></div><!-- 滑块 -->'+
					'<div class="scale_ruler_current"></div><!-- 当前比例 -->'+
				'</div>'+
				'<div class="zoom zoom_in"  title="缩小一级" data-type="in"></div>'+
			'</div>';
		return console_panel;
	};
}