/**
 * canvas版topo图
 * 作者:田明 
 * github: https://github.com/tm-roamer/ctopo
 */
function ctopo(opt){
	//状态机常量
	const STATE_IMAGE_LOAD=10,	//加载图片
		  STATE_INIT_LOAD=20,	//正在初始化
		  STATE_INIT_OVER=30;	//初始化完成
	//默认配置对象
	var defaultOpt = {
		id:"",    		//说明: canvas标签的id,     写法: canvas , #canvas
      	width:"auto",   //说明: canvas的宽度,       写法: 500,500px,50%,auto,默认auto
      	height:"auto",  //说明: canvas的高度,       写法: 500,500px,50%,auto,默认auto
      	isShowConsolePanel:true,   //说明: 是否显示控制台,      写法: true,false,  默认true
      	isShowNodeLabel:true,      //说明: 是否显示节点文字,    写法: true,false,  默认true
      	isShowNodeTooltip:false,   //说明: 是否显示节点提示框,  写法: true,false,  默认false
      	isHoverNodeLight:true,     //说明: 是否悬停节点高亮,    写法: true,false,  默认true
      	style:{                    //说明: 全局样式
        	global:{
          		backgroundColor:"#ffffff",  //说明: 支持fillstyle所有原生写法, 例: rgba(255,255,255,1),默认#ffffff
          		backgroundImage:null, 		//说明: 背景网格线, 默认为null
          		backgourndImageOpacity:0.3, //说明: 背景网格线透明度, 配置了backgroundImage此字段才有效, 默认0.3
                                      		//备注: backgroundColor灰,白,0.5美观;backgroundColor黑色,蓝色,0.2美观
                tooltipBackgroundColor:"rgba(0, 0, 0, 0.7)", //说明: 悬停提示的背景色样式,默认rgba(0, 0, 0, 0.7)
              	tooltipColor:"rgb(255, 255, 255)"  //说明: 悬停提示的文字样式,默认rgb(255, 255, 255)
        	},
	        node:{
	          color:"#00adee",     //说明: 节点颜色, 支持fillstyle所有原生写法, 优先级低于节点自带属性, 默认#00adee
	          size:20,             //说明: 节点直径, 优先级低于节点自带属性, 默认20px, 
	          textColor:"#878787", //说明: 节点Label颜色, 优先级低于节点自带属性, 默认#878787
	          textSize:10          //说明: 节点Label字体大小, 优先级低于节点自带属性, 默认10px
	        },
	        edge:{
	          color:"#c2c2c2",     //说明: 连线颜色, 支持fillstyle所有原生写法, 优先级低于节点自带属性, 默认#c2c2c2
	              size:1               //说明: 连线宽度, 优先级低于节点自带属性, 默认1px
	        }
          },
        layout:{
        	name:"force",          //说明: 布局方式,支持force力导向和preset预设, 默认force
        	param:{
	          isRandom : false,    //说明: 默认初始位置是随机Random还是定位location,默认false
	          initAreaW : 100,     //说明: 初始分布是的初始宽,默认100px
	          initAreaH : 56,      //说明: 初始分布是的初始高,默认56px
	          energy:0.5,          //说明: 能量值范围0.3-1,  默认0.5
	          iterations :150,     //说明: 力导向的迭代次数,默认150
	          ejectFactor : 2,     //说明: 默认斥力常量,默认2
	          ejectRange : 250,    //说明: 最大斥力范围,超过的不计算节点间斥力,默认2
	          ejectFadeRange : 30, //说明: 节点簇的减弱范围,此范围内ejectFactor-1,默认30
	          condenseFactor : 1,  //说明: 默认引力常量,默认1
	          maxtx : 3,           //说明: 每次迭代的x方向最大移动距离,默认3
	          maxty : 1.68         //说明: 每次迭代的y方向最大移动距离,默认1.68
	        }
        },
        data:{                     //说明: 数据格式
            /*
            nodes:[
              {
                id:"节点id",         //说明: 必填项, 节点id, 必须唯一
                x:0,                 //说明: 节点x坐标,
                y:0,                 //说明: 节点y坐标,
                label:"显示标签",    //说明: 显示标签, 默认null
                tooltip:"悬停文字",  //说明: 悬停文字, 默认null
                color:"#00adee",     //说明: 节点颜色, 支持fillstyle所有原生写法, 优先级高于全局样式, 不配置默认等于全局样式
                size:20,             //说明: 节点直径, 优先级高于全局样式, 不配置默认等于全局样式 
                textColor:"#878787", //说明: 节点Label颜色, 优先级高于全局样式, 不配置默认等于全局样式
                textSize:10          //说明: 节点Label字体大小, 优先级高于全局样式, 不配置默认等于全局样式
                //保留字段           //说明:  保留字段不可使用
                                     //       originalColor=color,保存初始颜色,方便颜色变换
                                     //       dispx,dispy,布局运算时的偏移量
                //支持自定义字段     //说明: 
                                     //       (1)不支持函数形式的自定义字段,基本类型,对象,数组都行
                                     //       (2)不可以和保留字段重名
                customField1:"fieldl",
                customField2:["field2_1","field2_2"],
                customField3:{field3_1:"field3_1",field3_2:"field3_2"}
              }
            ],
            edges:[
              {
                source:"开始节点id", //说明: 必填项, 开始节点id
                target:"结束节点id"  //说明: 必填项, 结束节点id
                color:"#c2c2c2",     //说明: 连线颜色, 支持fillstyle所有原生写法, 优先级高于全局样式, 不配置默认等于全局样式
                size:1               //说明: 连线宽度, 优先级高于全局样式, 不配置默认等于全局样式
                //保留字段           //说明: 保留字段不可使用
                                     //       originalColor=color,保存初始颜色,方便颜色变换
                                     //       sourceIndex,targetIndex=开始和结束节点在nodes数组的索引值
                //支持自定义字段     //说明: 
                                     //       (1)不支持函数形式的自定义字段,,基本类型,对象,数组都行
                                     //       (2)不可以和保留字段重名
                customField1:"fieldl",
                customField2:["field2_1","field2_2"],
                customField3:{field3_1:"field3_1",field3_2:"field3_2"}
              }
            ]
            */
        },
        event:{                    //说明: 监听回调
            steerwheel:null,       //说明: 上下左右的平移回调
            scale:null,       	   //说明: 放大缩小的回调
            clickNode:null,        //说明: 点击节点的回调
            hoverNode:null,        //说明: 悬停节点的回调
            leaveNode:null         //说明: 离开节点的回调
        }
	},
	//topo对象
	tp = {
		version:"v1.0.0",
		/**
		 *	属性合并
		 */
		extendMerge:function(){
			var res={};
			for(var i=0; i<arguments.length;i++){
				for(var k in arguments[i]){
					res[k] = arguments[i][k];
				}
			}
			return res;
		},
		/**
		 *	属性copy
		 */
		extendCopy:function(c,p){
		  	for(var i in p){
		  		c[i]=p[i];
		  	}
		  	return c;
	  	}
	},
	appState,	//状态机常量, STATE_IMAGE_LOAD, STATE_INIT_LOAD, STATE_INIT_OVER
	render,		//绘制对象(私有)
	conPanel,	//控制台对象(私有)
	tooltip,	//悬停提示框对象(私有)
	utils,		//工具对象(私有)
	event,		//监听对象(私有)
	layout,		//布局对象(私有)
	api;		//api(开放)

	/**
	 * topo图初始化方法(私有方法)
	 */
	function init(){

		//正在初始化
		appState = STATE_INIT_LOAD;

		//判断浏览器是否支持canvas
		if( !canvasSupport() ){
			throw new Error("Your browser does not support canvas");
		}
		//构建canvas上下文环境
		contextHandler(tp.option.id);

		//设置canvas的宽度和高度
		setCanvasWidthHeight(tp.option.width,tp.option.height);

		//设置节点数组和连线数组,并完成字段的初始工作
		setData(tp.option.data,tp.option.style);

		//初始化对象
		initObject();

		//tp.ready();

		//应用布局
		var date1=new Date().getTime();
		layout.run(tp.option.layout);
		var date2=new Date().getTime();

		//初始化配置监听
		event.init();

		//初始结束
		appState = STATE_INIT_OVER;

		//开始绘制
		var date3=new Date().getTime();
		render.itemLoaded( tp.option.style.global,render.draw );
		var date4=new Date().getTime();
		console.log("nodes count="+tp.nodes.length+",edges count="+tp.edges.length+",layout time="+(date2-date1)+",draw time="+(date4-date3) );
	}

	/**
	 * topo图销毁方法(私有方法)
	 */
	function destory(){
		//事件
	 	event.destory();		//注销canvas事件
	 	conPanel.removeEvent();	//注销控制台事件
	 	//html
	 	conPanel.remove();		//清理控制台html
	 	tooltip.remove();		//清理悬停提示html
	 	//清理画布html, 取得canvas标签,先克隆一份添加到它的之前,然后干掉它
	 	var id = tp.option.id,
	 		canvas = document.querySelector( (id[0]=="#"?id.slice(1,id.length):id) ),
	 		canvasClone = canvas.cloneNode(true);
	 	document.body.insertBefore(canvasClone,canvas);
	 	document.body.removeChild(canvas);
	 	//对象
	 	conPanel = null;	//注销控制台对象
	 	tooltip = null;		//注销悬停提示框对象
		utils = null;		//注销工具对象
	 	layout = null;		//注销布局对象
	 	event = null;		//注销监听对象
	 	render = null;		//注销绘制对象
	 	api = null;			//注销API接口
	 	tp.option = null;	//注销配置
	 	tp.canvas = null;
	 	tp.context = null;
	 	tp.nodes=null;
	 	tp.edges=null;
	}

	/**
	 * 判断浏览器是否支持canvas(私有方法)
	 */
	function canvasSupport(){
		return !!document.createElement("canvas").getContext;
	}

	/**
	 * 构建canvas上下文环境(私有方法)
	 */
	function contextHandler(id){
		if( id ){
			//获取canvas
			tp.canvas = document.getElementById(id[0]=="#"?id.slice(1,id.length):id); //兼容#
		}else{
			tp.canvas = document.querySelector("canvas"); //不配置id, 默认取的一个canvas
		}
		tp.context = tp.canvas.getContext("2d");
	}

	/**
	 *	设置canvas的宽带和高度(私有方法)
	 */
	function setCanvasWidthHeight(width,height){
		var bodyW = document.documentElement.clientWidth,
			bodyH = document.documentElement.clientHeight;
		//console.log("1366bodyW="+this.bodyW+",608bodyH="+this.bodyH);
		tp.canvas.width=compute(width,bodyW);
		tp.canvas.height=compute(height,bodyH);
		//私有方法
		function compute(n,body){
			if(typeof n === "string"){
				if( n.indexOf("auto") != -1){			//自适应
					n = body;
				}else if( n.indexOf("%") != -1 ){ 		//计算比例
					var num = n.slice(0,n.length-1)*1;
					n = num*0.01*body;
				}else if( n.toLowerCase().indexOf("px") != -1 ){
					n = n.slice(0,n.length-2)*1;
				}
			}
			return n;
		}
	}

	/**
	 *	设置节点数组和连线数组,并完成字段的初始工作(私有方法)
	 */
	function setData(data,style){
		if( typeof data !== "undefined" ){
			tp.nodes = ( data.nodes instanceof Array )?data.nodes.slice(0,data.nodes.length):[];
			tp.edges = ( data.edges instanceof Array )?data.edges.slice(0,data.edges.length):[];
		}
		//配置转换数据格式,补充字段
		var nodeStyle=style.node,
			edgeStyle=style.edge,
			nodes = tp.nodes,
			edges = tp.edges;
		for (var i = 0; i < nodes.length; i++) {
			setNode(nodes[i],nodeStyle)
		}
		for (var i = 0; i < edges.length; i++) {
			setEdge(edges[i],edgeStyle)
		}
		delete data;
	}

	/**
	 *	设置单个节点的字段的初始工作(私有方法)
	 */
	function setNode(node,nodeStyle){
		node.size  = node.size ? node.size : nodeStyle.size;
		node.color = node.color? node.color: nodeStyle.color;
		node.textSize  = node.textSize ? node.textSize : nodeStyle.textSize;
		node.textColor = node.textColor? node.textColor: nodeStyle.textColor; //node对象样式 > 全局样式
		node.originalColor = node.color;
		node.x=node.x ? node.x : 0;
		node.y=node.y ? node.y : 0;
		node.tooltip=node.tooltip ? node.tooltip : null;
		return node;
	}

	/**
	 *	设置单个连线的字段的初始工作(私有方法)
	 */
	function setEdge(edge,edgeStyle){
		edge.size  = edge.size ? edge.size : edgeStyle.size;
		edge.color = edge.color? edge.color: edgeStyle.color; 	//edge对象样式 > 全局样式
		edge.originalColor = edge.color;
		edge.sourceIndex = 0;
		edge.targetIndex = 0;
		return edge;
	}

	/**
	 *	初始化对象(私有方法)
	 */
	function initObject(){
	 	ConPanel.prototype= new ConsolePanel();//初始化控制台对象
	 	conPanel = new ConPanel();
	 	tooltip = new Tooltip();	//悬停提示框对象
		utils = new Utils();		//初始化工具对象
	 	layout = new Layout();		//初始化布局对象
	 	event = new Event();		//初始化监听对象
	 	render = new Render();		//初始化绘制对象
	 	api = new API();			//初始化API接口
	 	tp.extendCopy(tp,api); //属性copy
	}

	//控制台对象(私有对象)------------------------------------------------
	function ConPanel(){
		//不存在的时候才添加
		var console_panel = document.querySelector("."+this.console_panel);
		if( !console_panel ){
			document.body.insertBefore(this.getDom(),document.body.firstChild); //插入html
		}
		this.setOption({steerwheel:steerwheelCallBack,scale:scaleCallBack});
		this.initEvent();		//加入监听
		if( tp.option.isShowConsolePanel ){
			this.show(); 		//显示
		}else{
			this.hide(); 		//隐藏
			//this.removeEvent(); //移除监听
		}
		//上下左右平移的回调
		function steerwheelCallBack(keyCode){
			//逻辑处理
			utils.moveSteerWheel(tp.nodes,keyCode);
			//初始完成后才进行绘制
			if( appState == STATE_INIT_OVER ){
				render.draw();
			}
			//设置回调
			if( tp.option.event.steerwheel ){
				tp.option.event.steerwheel(keyCode);
			}
		}
		//放大缩小的回调
		function scaleCallBack(prevScale,scale){
			//逻辑处理
			utils.inOutScale(tp.nodes,tp.canvas.width,tp.canvas.height,prevScale,scale);
			//初始完成后才进行绘制
			if( appState == STATE_INIT_OVER ){
				render.draw();
			}
			//设置回调
			if( tp.option.event.scale ){
				tp.option.event.scale(prevScale,scale);
			}
		}
	}
	//悬停提示框对象(私有对象)------------------------------------------------
	function Tooltip(){
		var name="ctopo_tooltip";
		//不存在的时候才添加
		var tip = document.querySelector("."+name);
		if( !tip ){
			document.body.insertBefore(getDom(),document.body.firstChild); //插入html
		}
		this.chooseDisplay = function(node,ex,ey){
			if( tp.option.isShowNodeTooltip ){
				if( node ){
					if( node.tooltip ){
						//node.tooltip="192.1596.fsdfs";
						show(node,ex,ey);
					}
				}else{
					hide();
				}
			}
		}
		this.remove=function(){
			var tip = document.querySelector("."+name);
			document.body.removeChild(tip);
		};
		function getDom(){
			var tip = document.createElement("div");
			tip.setAttribute("class",name);
			tip.style.cssText='position: absolute;'+ 
					'left: 0px;'+ 
					'top: 0px;'+
					'background-color: '+tp.option.style.global.tooltipBackgroundColor+'; '+ 
					'color: '+tp.option.style.global.tooltipColor+'; '+ 
					'visibility: hidden; '+ 
					'border-radius: 4px; '+ 
					'white-space: nowrap; transition: left 0.4s ease 0s, top 0.4s ease 0s; '+ 
					'text-decoration: none; '+ 
					'font-family: Arial,Verdana,sans-serif; '+ 
					'font-size: 12px; '+ 
					'line-height: 18px; '+ 
					'font-style: normal; '+ 
					'font-weight: normal;'+ 
					'padding: 5px;'; 
			return tip;
		}
		function show(node,ex,ey){
			var tip = document.querySelector("."+name);
			var coord = computePosition(node,ex,ey);
			tip.style.top=coord.top+"px";
			tip.style.left=coord.left+"px";
			tip.innerHTML=node.tooltip;
			tip.style.visibility="visible";
		}
		function hide(){
			var tip = document.querySelector("."+name);
			tip.style.visibility="hidden";
		}
		function computePosition(node,ex,ey){
			var coord={},
				textH=28,
				textW=computeTextWidth(node.tooltip)+10, //+pading
				canvasW=tp.canvas.width,
				canvasH=tp.canvas.height;
			//边界判断
			coord.top = ey <= textH/2 ? 0 : ( ey>=canvasH-textH/2 ? canvasH-textH/2 : ey-textH/2);
			coord.left = ex >= canvasW-node.size-textW ? (ex-node.size/2-textW) : ex+node.size/2;
			return coord;
		}
		function computeTextWidth(text){
			return tp.context.measureText(text).width; //文字宽
		}
	}
	//工具对象(私有对象)-----------------------------------------------
	function Utils(){
		this.relationEdges = [];
		this.relationNodes = [];
		this.notRelationNodes = [];

		//函数节流
		this.throttle = function(method,context,time){
			clearTimeout(method.tId);
			method.tId=setTimeout(function(){
				method.call(context);
			},time);
		}

		//节点的碰撞检测 ff:1万节点15ms,chrome:1万节点第一次运行20ms,以后1ms
		this.collideNode=function(nodes,ex,ey){
			var obj = null;
			for(var i=0; i<nodes.length; i++){
				var node = nodes[i],
					diffx = node.x - ex,	//水平间距
	        		diffy = node.y - ey,	//垂直间距
	        		diff = Math.sqrt(diffx * diffx + diffy * diffy); //勾股定理斜线距离(直线距离)
	        	//console.log("diff="+diff+",diffx="+diffx+",diffy="+diffy);
	        	if( diff <= node.size/2 ){    //碰撞了
	        		obj = node;
	        	}
			}
			event.collideNode = obj;
		}

		//私有函数,创建索引(数组)
		this.createNodeIndex = function(nodes,edges){
			for(var j=0; j<edges.length; j++){
				this.createIndex(nodes,edges[j])
			}
		}
		//私有函数,创建索引(单个)
		this.createIndex = function(nodes,edge){
			for(var i=0; i<nodes.length; i++){
				var node = nodes[i];
				if( edge.source == node.id ){
					edge.sourceIndex = i;
					continue;
				}
				if( edge.target == node.id ){
					edge.targetIndex = i;
					continue;
				}
			}
		}

		this.firstNeighborsDraw=function(collideNode){
			//关联节点高亮
			if( tp.option.isHoverNodeLight ){
				if( collideNode ){
					//绘制高亮
					var ndoeColor = tp.option.style.node.color,
						edgeColor = tp.option.style.edge.color,
						neighbors = this.firstNeighbors(collideNode.id); //取得关联
					this.relationEdges = neighbors.edgeNeighbors;
					this.relationNodes = neighbors.nodeNeighbors;
					this.notRelationNodes = neighbors.nodeNotNeighbors;	
					for (var i = 0; i < this.relationEdges.length; i++) {
						this.relationEdges[i].color = ndoeColor;
					}
					for (var i = 0; i < this.notRelationNodes.length; i++) {
						this.notRelationNodes[i].color = edgeColor;
					}
				}else{
					//取消高亮
					this.cancelFirstNeighbors();
				}
				this.throttle(render.draw,render,Math.floor(1000/60) );
			}
		}

		this.firstNeighbors=function(nid){
			var edges = tp.edges,
				nodes = tp.nodes,
				relationEdges = [],//this.relationEdges,
				relationNodes = [],//this.relationNodes;
				notRelationNodes = [];//this.notRelationNodes;
			//查到关联的线
			for (var i = 0; i < edges.length; i++) {
				var edge = edges[i]
				if( edge.source == nid || edge.target == nid ){
					relationEdges.push(edge);
				}
			}
			//根据线查找关联的点
			for (var i = 0; i < nodes.length; i++) {
				var bool=false,node = nodes[i];
				//是不是当前点
				if( node.id == nid ){
					bool = true;
					continue;
				}
				//查询是否关联了线
				for (var j = 0; j < relationEdges.length; j++) {
					var edge = relationEdges[j];
					if( edge.source == node.id || edge.target == node.id ){
						bool = true; //关联到了
					}
				}
				if( !bool ){
					notRelationNodes.push(node); //未关联
				}else{
					relationNodes.push(node);	 //关联
				}
			}
			return {
				edgeNeighbors:relationEdges,
				nodeNeighbors:relationNodes,
				nodeNotNeighbors:notRelationNodes
			};
		}

		this.cancelFirstNeighbors=function(){
			var relationEdges = this.relationEdges,
				notRelationNodes = this.notRelationNodes;
			//恢复原貌
			for (var i = 0; i < relationEdges.length; i++) {
				var edge = relationEdges[i];
				edge.color = edge.originalColor;
				//delete node.originalColor;
			}
			for (var i = 0; i < notRelationNodes.length; i++) {
				var node = notRelationNodes[i];
				node.color = node.originalColor;
				//delete node.originalColor;
			}
			this.relationEdges = [];
			this.notRelationNodes = [];
		}

		//上下左右移动(回调)
		this.moveSteerWheel=function(nodes,keyCode){
			//37 左 x-50px;	38 上 y-50px; 39 右 x+50px; 40 下 y+50px
			var node,
				offset = keyCode==37 || keyCode==38 ? -50 : 50,
				coord  = keyCode==37 || keyCode==39 ? "x" : "y";
			for( var i = 0; i < nodes.length; i++ ) {
	            node = nodes[i];
	            if ( coord == "x" ){
	            	node.x = node.x+offset;
	            	continue;
	            }
	            if ( coord == "y" ){
	            	node.y = node.y+offset;
	            	continue;
	            }
	        }
		}
		//api接口: 调整缩放比例, scale范围0-1
		this.setZoom = function(scale){
			conPanel.setScale(scale);
		}
		//根据比例求值域
		this.getScaleRange = function(prevScale,scale){
			var s;
			if( prevScale < scale ){ //放大
				s = prevScale <= 0 ? 2 : scale/prevScale;
			}else{					 //缩小
				s = scale <= 0 ? 0.5 : scale/prevScale;
			}
			return s; 
		}
		//放大缩小比例(回调)
		this.inOutScale = function(nodes,canvasW,canvasH,prevScale,scale){
		    scale = this.getScaleRange(prevScale,scale);
		    var n,
		    	actualWidth = canvasW / scale,
		    	actualHeight = canvasH / scale,
		    	minX = canvasW/2 - actualWidth/2,
		    	minY = canvasH/2 - actualHeight/2;
			for( var i = 0; i < nodes.length; i++ ) {
	            n = nodes[i];
	            n.x = (n.x - minX ) * scale;
	            n.y = (n.y - minY ) * scale;
	            //优化 节点尺寸跟着修改??????????????????
	        }
		}
		//检测是否需要缩放
		this.testIsScale = function(nodes,canvasW,canvasH,scale){
			var bool=false;
			if( scale <= 0 || scale >= 1 ){
				return bool; 
			}
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				if( node.x <=0 || node.x >= canvasW || node.y <=0 || node.y >= canvasH 	){
					bool = true;
					break;
				}
			}
			return bool;
		}
	}
	//布局对象(私有对象)------------------------------------------------
	function Layout(){
		this.run=function(layout){
			try{
				utils.createNodeIndex(tp.nodes,tp.edges);	//(优化)建立索引机制,方便用线查点
				if( layout.name === "force" ){
					this.force(layout.param);
				}
			}catch(e){
				throw new Error("ctopo layout error");
			}
		}
		this.force=function(param){
			var nodes = tp.nodes,
				edges = tp.edges,
				canvasW = tp.canvas.width,
				canvasH = tp.canvas.height,
				canvasArea = canvasW*canvasH,			//画布的面积
				k = Math.sqrt( canvasArea / nodes.length )*param.energy, //求出每个节点的能量
				isRandom = param.isRandom,			    //默认初始位置是随机Random还是定位location
				initAreaW = param.initAreaW,			//随机分布是的初始宽
				initAreaH = param.initAreaH,			//随机分布是的初始高
				iterations = param.iterations,			//力导向的迭代次数
				ejectFactor = param.ejectFactor,		//默认斥力常量
				ejectRange = param.ejectRange,			//最大斥力范围,超过的不计算节点间斥力
				ejectFadeRange = param.ejectFadeRange,	//节点簇的减弱范围,此范围内斥力-1
				condenseFactor = param.condenseFactor,	//默认引力常量
				maxtx = param.maxtx,					//每次迭代的x方向最大移动距离
				maxty = param.maxty;					//每次迭代的y方向最大移动距离

			//随机初始位置 or 定位摆放
			isRandom ? randomCoord(nodes) : locationCoord(nodes);
			//反复迭代
			repeatLayout(nodes,edges);
			
			//检测屏幕是否需要缩放
			while( utils.testIsScale(nodes,canvasW,canvasH,conPanel.scale) ){
				//(优化)自动缩放比例适应屏幕
				utils.setZoom(conPanel.scale-0.1);
			}
			//1. 随机分布初始节点位置
			function randomCoord(nodes){
				var startX, startY;
		        for (var i=0;i<nodes.length;i++) {
		            startX = 0 + canvasW/2;
		            startY = 0 + canvasH/2;
					nodes[i].x = startX + initAreaW * (Math.random()-0.5) ;
		            nodes[i].y = startY + initAreaH * (Math.random()-0.5) ;
		        }
			}
			//1. (优化)网格定位初始节点位置(每次绘图坐标一致)
			function locationCoord(nodes){
				var startX,
					startY,
					b = Math.sqrt( initAreaW*initAreaH / nodes.length );
				//先排序
				nodes.sort(function(a,b){ return a > b ? 1 : ( a < b ? -1 : 0 ) });
		        for (var i=0;i<nodes.length;i++) {
		        	startX = 0 + canvasW/2;
		            startY = 0 + canvasH/2;
					nodes[i].x = startX + Math.floor( (i*b) %  initAreaW );
		            nodes[i].y = startY + Math.floor( (i*b) /  initAreaH );
		        }
			}
			//2. 反复迭代(核心算法)
			function repeatLayout(nodes,edges){
				for(var i=0; i<iterations; i++){
		            nodes = layout(nodes,edges);
		        }
		        return nodes;
			}
			//核心算法
			function layout(nodes,edges){
				//3. 计算每次迭代局部区域内两两节点间的斥力所产生的单位位移（一般为正值）
		        for (var i = 0; i < nodes.length; i++) {
		        	var node = nodes[i];
		        	node.dispx=0; //移动的x距离
		        	node.dispy=0; //移动的y距离
		            for (var j = 0; j < nodes.length;  j++) {
		                if ( j == i ) { continue; }
	                    var nodej = nodes[j],
	                    	diffx = node.x - nodej.x,	//水平间距
	                    	diffy = node.y - nodej.y,	//垂直间距
	                    	diff = Math.sqrt(diffx * diffx + diffy * diffy); //勾股定理斜线距离(直线距离)
	                    if (diff > 0 && diff < ejectRange ) {
	                    	//离得近的节点,斥力减弱,形成簇
	                    	eject =(diff < ejectFadeRange )?ejectFactor-1:ejectFactor;
							//f=g*m1*m2/r*r 库仑定律
	                        node.dispx = node.dispx + diffx / diff * k * k / diff * eject;
	                        node.dispy = node.dispy + diffy / diff * k * k / diff * eject;
	                    }
		            }
		        }
		        //4. 计算每次迭代每条边的引力对两端节点所产生的单位位移（一般为负值）     
		        for (var a = 0; a < edges.length; a++) {
		            var nodeS = nodes[ edges[a].sourceIndex ],
		            	nodeE = nodes[ edges[a].targetIndex ],
		            	diffx = nodeS.x - nodeE.x,
	                	diffy = nodeS.y - nodeE.y;
	                	diff = Math.sqrt(diffx * diffx + diffy * diffy); //勾股定理斜线距离
	                //f=-g*d 胡克定律
		            nodeS.dispx = nodeS.dispx - diffx * diff / k * condenseFactor;
		            nodeS.dispy = nodeS.dispy - diffy * diff / k * condenseFactor;
		            nodeE.dispx = nodeE.dispx + diffx * diff / k * condenseFactor;
		            nodeE.dispy = nodeE.dispy + diffy * diff / k * condenseFactor;
		        }
		        //5. 重置每个节点的坐标set x,y
		        for (var v = 0; v < nodes.length; v++) {
		            var node = nodes[v],
		            	disppx = parseInt( Math.floor( node.dispx ) ),
		            	disppy = parseInt( Math.floor( node.dispy ) );
		            disppx = (disppx < -maxtx ? -maxtx : ( disppx > maxtx ? maxtx : disppx ) );
		            disppy = (disppy < -maxty ? -maxty : ( disppy > maxty ? maxty : disppy ) );
		            node.x = node.x + disppx;
		            node.y = node.y + disppy;
		        }
		        return nodes;
			}
		}
	}
	//监听对象(私有对象)------------------------------------------------
	function Event(){
		var self = this;
		self.fps = Math.floor(1000/200), //约等于5毫秒
		self.fpsCount = 0;				//计算触发帧率
		self.dragPrevX = 0;
		self.dragPrevY = 0;
		self.dragCurrentX = 0;
		self.dragCurrentY = 0;
		this.init=function(){
			var canvas  = tp.canvas;
			//监听拖拽
			canvas.addEventListener("mousedown",this.canvasMouseDown,false); 	//摁下
			canvas.addEventListener("mousemove",this.canvasMouseMove,false); 	//移动
			canvas.addEventListener("mouseup",this.canvasMouseUp,false);   		//抬起
			canvas.addEventListener("click",this.canvasClick,false);   			//点击 mouseup之后触发
		}
		this.canvasMouseDown = function (e){
			//切换手型
			tp.canvas.style.cursor="pointer";
			//启动拖拽
			self.isDragDrap = true;
			//判断是node还是canvas
			utils.collideNode(tp.nodes,e.pageX,e.pageY);
			//保存坐标
			self.dragPrevX = e.pageX;
			self.dragPrevY = e.pageY;
			self.dragCurrentX = e.pageX;
			self.dragCurrentY = e.pageY;
		}
		this.canvasMouseMove = function (e){
			//ff:200节点 50ms, chrome:200节点 25ms
			if( self.fpsCount++ >= self.fps ){
				//判断是否拖拽
				if( self.isDragDrap ){
					//保存坐标
					self.dragCurrentX = e.pageX;
					self.dragCurrentY = e.pageY;
					//计算位移
					var dx = self.dragCurrentX - self.dragPrevX;
					var dy = self.dragCurrentY - self.dragPrevY;
					//当前坐标变成上一次的坐标
					self.dragPrevX = self.dragCurrentX;
					self.dragPrevY = self.dragCurrentY;

					//判断mouseDown是节点还是屏幕
					if( self.collideNode ){
						//修改节点坐标
						self.collideNode.x = self.collideNode.x + dx;
						self.collideNode.y = self.collideNode.y + dy;
					}else{
						//nodes整体平移
						var nodes = tp.nodes;
						for(var i=0; i<nodes.length; i++){
							var node = nodes[i];
							node.x = node.x + dx;
							node.y = node.y + dy;
						}
					}
					utils.throttle(render.draw,render,Math.floor(1000/60) );
				}
				//不是拖拽,那就是没有mousedown,那就是悬停
				else{
					//判断是node还是canvas
					utils.collideNode(tp.nodes,e.pageX,e.pageY);
					//悬停节点高亮绘制
					utils.firstNeighborsDraw(self.collideNode);
					//悬停节点出现悬停提示框
					tooltip.chooseDisplay(self.collideNode,e.pageX,e.pageY);
					//判断hover是不是节点
					if( self.collideNode ){
						//回调
						if( tp.option.event.hoverNode ){ 
							tp.option.event.hoverNode(e,self.collideNode);
						}
					}else{
						//回调
						if( tp.option.event.leaveNode ){ 
							tp.option.event.leaveNode(e);
						}
					}
				}
				self.fpsCount=0;
			}
		}
		this.canvasMouseUp = function (e){
			//取消手型
			tp.canvas.style.cursor="";
			//关闭拖拽
			self.isDragDrap = false;
		}
		this.canvasClick = function (e){
			//判断是node还是canvas
			utils.collideNode(tp.nodes,e.pageX,e.pageY);
			//判断mouseDown是节点还是屏幕
			if( self.collideNode ){
				if( tp.option.event.clickNode ){ //回调
					tp.option.event.clickNode(e,self.collideNode);
				}
			}else{
				//alert("canvas");
			}
		}
		this.destory=function(){
			var canvas  = tp.canvas;
			//移除监听拖拽
			canvas.removeEventListener("mousedown",this.canvasMouseDown,false); 	//摁下
			canvas.removeEventListener("mousemove",this.canvasMouseMove,false); 	//移动
			canvas.removeEventListener("mouseup",this.canvasMouseUp,false);   		//抬起
			canvas.removeEventListener("click",this.canvasClick,false);   			//点击 mouseup之后触发
		}
	}
	//渲染对象(私有对象)------------------------------------------------
	function Render(){

		var self = this,
			context = tp.context,
			canvasW = tp.canvas.width,
			canvasH = tp.canvas.height;

		this.draw=function(){
			clearCanvas();						//清除图像
			drawGlobal(tp.option.style.global);	//绘制背景
			drawData(tp.nodes,tp.edges);		//绘制数据
		}

		/**
		 *	初始加载图片(私有方法)
		 */
		this.itemLoaded = function(global,callback){
			if( global.backgroundImage ){
		  		try{
		  			//appState = STATE_IMAGE_LOAD;
		  			self.bgImg = new Image();
	  				self.bgImg.addEventListener('load',function(){
				  		//初始背景图片渐变
						self.bgPattern = context.createPattern(self.bgImg,'repeat');
						callback();
				  	},false);
				  	self.bgImg.src=global.backgroundImage;
		  		}catch(e){
		  			callback();
		  			throw new Error("ctopo backgroundImage load error");
		  		}finally{}
			}else{
				callback();
			}
		}

		function clearCanvas(){
			context.clearRect(0,0,canvasW,canvasH);
		}

		function drawGlobal(global){
			context.fillStyle=global.backgroundColor;
		  	context.fillRect(0,0,canvasW,canvasH);
		  	//绘制背景网格
		  	if( self.bgPattern ){
		  		context.fillStyle=self.bgPattern ;
				context.globalAlpha=global.backgourndImageOpacity;
				context.fillRect(0,0,canvasW,canvasH);
				context.globalAlpha=1;
		  	}
		}

		function drawData(nodes,edges){
			//绘制连线
			for(var i=0;i<edges.length;i++){
			   	drawEdge(edges[i]);	
			}
			//绘制节点
			for(var i=0;i<nodes.length;i++){
			   	drawNode(nodes[i]);	
			}
		}

		function drawNode(node){
	  		context.beginPath();
			context.fillStyle=node.color;	//node对象样式 > 全局样式
		  	context.arc(node.x,node.y,parseInt(node.size/2),0,(Math.PI/180)*360,false);
		  	context.fill();
		  	context.closePath();
		  	//绘制节点label
		  	if( node.label && tp.option.isShowNodeLabel ){
		  		drawNodeLabel(node);
		  	}
		}

		function drawNodeLabel(node){
			var textWidth = context.measureText(node.label).width; //文字宽
			context.fillStyle=node.textColor;
			context.font=node.textSize+"px serif";
			context.fillText(node.label,node.x-(textWidth/2),node.y+node.size/2+node.textSize);
		}

		function drawEdge(edge){
			var nodeS = tp.nodes[edge.sourceIndex];
		    var nodeE = tp.nodes[edge.targetIndex];
			context.beginPath();
			context.strokeStyle=edge.color;
			context.lineWidth=edge.size;
		  	context.moveTo(nodeS.x,nodeS.y);
		 	context.lineTo(nodeE.x,nodeE.y);
		  	context.stroke();
		  	context.closePath();
		}
	}
	//API开放接口,会合并到tp上(公开对象)
	function API(){
		this.addEdge = function(edge,isDrawNow){
			if(typeof edge == "object"){
				if( typeof edge.source != "undefined" && typeof edge.target != "undefined" ){
					edge = setEdge(edge,this.option.style.edge);	//补充字段
					utils.createIndex(this.nodes,edge);			//建立索引
					this.edges.push(edge);
					if( !!isDrawNow ){
						render.draw();
					}
				}
			}
		}
		this.addNode = function(node,isDrawNow){
			if(typeof node == "object"){
				if( typeof node.id != "undefined" ){
					node = setNode(node,this.option.style.node);	//补充字段
					this.nodes.push(node);
					if( !!isDrawNow ){
						render.draw();
					}
				}
			}
		}
		this.draw = function(option){
			destory(); //注销
			tp.option = tp.extendMerge(defaultOpt,option?option:{}); //构建初始配置
			init(); //初始化函数
		}
		this.drawData = function(data,isApplyLayout){
			var bool = false;
			if( typeof data == "object" ){
				if( data.nodes instanceof Array && data.edges instanceof Array ){
					this.nodes = null;						//清空数据
					this.edges = null;
					setData(data,this.option.style);				//存入数据
					utils.createNodeIndex(this.nodes,this.edges);	//建立索引
					if( !!isApplyLayout ){
						layout.run(this.option.layout);		//应用布局
					}
					render.draw();							//绘制
					bool = true;
				}
			}
			return bool;
		}
		this.edge = function(sid,tid){
			var edge = null,
				edges = this.edges;
			if( typeof sid != "undefined" && typeof tid != "undefined" ){
				for (var i = 0; i < edges.length; i++) {
					var e = edges[i];
					if( e.source == sid && e.target == tid ){
						edge = e;
						break;
					}
				}
			}
			return edge;
		}
		this.edgeArray = function(){
			return this.edges;
		}
		this.firstNeighbors = function(nid){
			neighbors = utils.firstNeighbors(nid);
			delete neighbors.nodeNotNeighbors;
			return neighbors;
		}
		this.layout = function(conf){
			var bool = false;
			if( typeof conf != "undefined" ){
				if( typeof conf == "object" ){
					this.option.layout = tp.extendMerge(defaultOpt.layout,conf);
					layout.run(this.option.layout);		//应用布局
					render.draw();						//绘制
				}
				return bool;
			}else{
				return this.option.layout;
			}
		}
		this.node = function(id){
			var node = null,
				nodes = this.nodes;
			if( typeof id != "undefined"){
				for (var i = 0; i < nodes.length; i++) {
					var n = nodes[i];
					if( n.id == id ){
						node = n;
						break;
					}
				}
			}
			return node;
		}
		this.nodeLabelsVisible = function(visible){
			this.option.isShowNodeLabel = !!visible;
			render.draw();
		}
		this.nodeArray = function(){
			return this.nodes;
		}
		this.nodeTooltipsVisible = function(visible){
			this.option.isShowNodeTooltip = !!visible;
			render.draw();
		}
		this.consolePanelVisible = function(visible){
			visible = !!visible;
			visible ? conPanel.show() : conPanel.hide();
			this.option.isShowConsolePanel = visible;
		}
		/*
		this.ready = function(callback){
			if( callback instanceof Function ){
				this.ready = callback;
			}
		}
		*/
		this.removeEdge = function(sid,tid,isDrawNow){
			var	edges = this.edges;
			if( typeof sid != "undefined" && typeof tid != "undefined" ){
				for (var i = 0; i < edges.length; i++) {
					var e = edges[i];
					if( e.source == sid && e.target == tid ){
						edges.splice(i,1); 	//干掉
						break;
					}
				}
				if( !!isDrawNow ){
					render.draw();
				}
			}
		}
		this.removeNode = function(nid,isDrawNow){
			var nodes = this.nodes;
				edges = this.edges;
			if( typeof nid != "undefined"){
				//干掉节点
				for (var i = 0; i < nodes.length; i++) {
					var n = nodes[i];
					if( n.id == nid ){
						nodes.splice(i,1); 	//干掉
						break;
					}
				}
				//干掉连线
				for (var i = 0; i < edges.length; i++) {
					var e = edges[i];
					if( e.source == nid || e.target == nid ){
						edges.splice(i,1); 	//干掉
						break;
					}
				}
				if( !!isDrawNow ){
					render.draw();
				}
			}
		}
		this.updateEdge = function(edge,isDrawNow){
			var edges = this.edges;
			if( typeof edge == "object"){
				if( typeof edge.source != "undefined" && typeof edge.target != "undefined" ){
					for (var i = 0; i < edges.length; i++) {
						var e = edges[i];
						if( e.source == edge.source && e.target == edge.target ){
							this.extendCopy(e,edge);		//属性copy
							e.originalColor = e.color;
							break;
						}
					}
					if( !!isDrawNow ){
						render.draw();
					}
				}
			}
		}
		this.updateNode = function(node,isDrawNow){
			var nodes = this.nodes;
			if( typeof node == "object"){
				if( typeof node.id != "undefined" ){
					for (var i = 0; i < nodes.length; i++) {
						var n = nodes[i];
						if( n.id == node.id ){
							this.extendCopy(n,node);		//属性copy
							n.originalColor = n.color;
							break;
						}
					}
					if( !!isDrawNow ){
						render.draw();
					}
				}
			}
		}
		this.style = function(conf){
			var bool = false;
			if( typeof conf != "undefined" ){
				if( typeof conf == "object" ){
					this.option.style = tp.extendMerge(defaultOpt.style,conf);
					render.draw();				//绘制
				}
				return bool;
			}else{
				return this.option.style;
			}
		}
		this.zoom = function(scale){
			var bool = false;
			if( typeof scale != "undefined" ){
				if( typeof scale == "number" ){
					scale = scale > 1 ? 1 : ( scale < 0 ? 0 : scale );
					scale = new Number(scale).toFixed(1)*1;
					utils.setZoom(scale);
					render.draw();				//绘制
				}
				return bool;
			}else{
				return conPanel.scale;
			}
		}
	}
	//构建初始配置
	tp.option = tp.extendMerge(defaultOpt,opt?opt:{});
	//初始化函数
	init();
	return tp;
}