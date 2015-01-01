function ctopo(opt){
	var defaultOpt = {
		id:"",    		//说明: canvas标签的id,     写法: canvas , #canvas
      	width:"auto",   //说明: canvas的宽度,       写法: 500,500px,50%,auto,默认auto
      	height:"auto",  //说明: canvas的高度,       写法: 500,500px,50%,auto,默认auto
      	isShowConsolePanel:true,   //说明: 是否显示控制台,      写法: true,false,  默认true
      	isShowNodeLabel:true,     //说明: 是否显示节点文字,    写法: true,false,  默认true
      	isShowNodeTooltip:true,   //说明: 是否显示节点提示框,  写法: true,false,  默认true
      	isHoverNodeLight:true,     //说明: 是否悬停节点高亮,    写法: true,false,  默认true
      	style:{                    //说明: 全局样式
        	global:{
          		backgroundColor:"#ffffff",  //说明: 支持fillstyle所有原生写法, 例: rgba(255,255,255,1),默认#ffffff
          		backgroundImage:null, 		//说明: 背景网格线, 默认为null
          		backgourndImageOpacity:0.3, //说明: 背景网格线透明度, 配置了backgroundImage此字段才有效, 默认0.3
                                      		//备注: backgroundColor灰,白,0.5美观;backgroundColor黑色,蓝色,0.2美观
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
	};
	var tp = {
		version:"v1.0.0",
		init:function(){
			//(1)判断兼容性
			if( !this.utils.canvasSupport() ){
				throw new Error("Your browser does not support canvas");
			}
			//(2)初始化canvas环境
			var option = this.option,
				id = option.id,
				width = option.width,
				height = option.height;
			if( typeof id !== "undefined"){
				//获取canvas
				this.canvas = document.getElementById(id[0]=="#"?id.slice(1,id.length):id); //兼容#
			}else{
				this.canvas = document.getElementsByTagName("canvas");
			}
			this.context = this.canvas.getContext("2d");
			//(3)初始化canvas宽度和高度
			this.setCanvasWH(width,height);
			//(4)配置数据
			this.setData(option.data,option.style);
			//(5)应用布局

			//(6)配置监听
			tp.event.init();

			tp.consolePanel = new tp.consolePanel(); //初始化控制台
			var date1=new Date().getTime();  //开始时间
			tp.layout.run();
			var date2=new Date().getTime();  //布局时间
			tp.render.draw();
			var date3=new Date().getTime();  //绘制时间
			console.log("nodes count="+tp.nodes.length+",edges count="+tp.edges.length+",layout time="+(date2-date1)+",draw time="+(date3-date2) );
		},
		destory:function(){

		},
		setData:function(data,style){
			if( typeof data !== "undefined" ){
				this.nodes = (typeof data.nodes !== "undefined")?data.nodes:[];
				this.edges = (typeof data.edges !== "undefined")?data.edges:[];
			}
			//配置转换数据格式,补充字段
			var nodeStyle=style.node,
				edgeStyle=style.edge,
				nodes = this.nodes,
				edges = this.edges;
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				node.size  = node.size ? node.size : nodeStyle.size;
				node.color = node.color? node.color: nodeStyle.color;
				node.textSize  = node.textSize ? node.textSize : nodeStyle.textSize;
				node.textColor = node.textColor? node.textColor: nodeStyle.textColor; //node对象样式 > 全局样式
				node.originalColor = node.color;
			}
			for (var i = 0; i < edges.length; i++) {
				var edge = edges[i];
				edge.size  = edge.size ? edge.size : edgeStyle.size;
				edge.color = edge.color? edge.color: edgeStyle.color; 	//edge对象样式 > 全局样式
				edge.originalColor = edge.color;
			}
		},
		setCanvasWH:function(width,height){
			this.bodyW = document.documentElement.clientWidth;
			this.bodyH = document.documentElement.clientHeight;
			//console.log("1366bodyW="+this.bodyW+",608bodyH="+this.bodyH);
			this.canvas.width=compute(width,this.bodyW);
			this.canvas.height=compute(height,this.bodyH);
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
	};
	//工具对象-----------------------------------------------
	tp.utils={
		relationEdges:[],
		notRelationNodes:[]
	};
	//取并集
	tp.utils.extend=function(){
		var res={};
		for(var i=0; i<arguments.length;i++){
			for(var k in arguments[i]){
				res[k] = arguments[i][k];
			}
		}
		return res;
	}
	//函数节流
	tp.utils.throttle = function(method,context,time){
		clearTimeout(method.tId);
		method.tId=setTimeout(function(){
			method.call(context);
		},time);
	}
	tp.utils.firstNeighborsDraw=function(){
		//关联节点高亮
		if( tp.option.isHoverNodeLight ){
			if(tp.event.collideNode){
				tp.utils.firstNeighbors(tp.event.collideNode);
			}else{
				tp.utils.cancelFirstNeighbors();
			}
			tp.utils.throttle(tp.render.draw,tp.render,Math.floor(1000/60) );
		}
	}
	tp.utils.firstNeighbors=function(n){
		var edges = tp.edges,
			nodes = tp.nodes,
			ndoeColor = tp.option.style.node.color,
			edgeColor = tp.option.style.edge.color,
			relationEdges = tp.utils.relationEdges,
			notRelationNodes = tp.utils.notRelationNodes;
		//查到关联的线
		for (var i = 0; i < edges.length; i++) {
			var edge = edges[i]
			if( edge.source == n.id || edge.target == n.id ){
				edge.color = ndoeColor;
				relationEdges.push(edge);
			}
		}
		//根据线查找关联的点
		for (var i = 0; i < nodes.length; i++) {
			var bool=false,node = nodes[i];
			//查询是否关联了线
			for (var j = 0; j < relationEdges.length; j++) {
				var edge = relationEdges[j];
				if( edge.source == node.id || edge.target == node.id ){
					bool = true; //关联到了
				}
			}
			if( !bool ){
				node.color = edgeColor;
				notRelationNodes.push(node);
			}
		}
	}
	tp.utils.cancelFirstNeighbors=function(){
		var relationEdges = tp.utils.relationEdges,
			notRelationNodes = tp.utils.notRelationNodes;
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
		tp.utils.relationEdges = [];
		tp.utils.notRelationNodes = [];
	}
	//判断浏览器是否支持
	tp.utils.canvasSupport=function(){
		return !!document.createElement("canvas").getContext;
	}
	//节点的碰撞检测 ff:1万节点15ms,chrome:1万节点第一次运行20ms,以后1ms
	tp.utils.collideNode=function(nodes,ex,ey){
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
		tp.event.collideNode = obj;
	}
	//拖拽
	//api方法
	tp.utils.indexNode=function(num){
		return tp.nodes[num];
	}
	tp.utils.createIndexNode=function(nodes,edges){
		for(var j=0; j<edges.length; j++){
			var edge = edges[j];
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
	}
	//上下左右移动(回调)
	tp.utils.moveSteerWheel=function(nodes,keyCode){
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
	tp.utils.setZoom = function(scale){
		tp.consolePanel.setScale(scale);
	}
	//保存比例1:1的node节点坐标
	tp.utils.saveNodeScale100 = function(nodes){
		var node,
			nodeScale100Array=[];
		for (var i = 0; i < nodes.length; i++) {
			node = nodes[i];
			nodeScale100Array[i]={x:node.x,y:node.y};
		}
		tp.nodeScale100Array = nodeScale100Array;
	}
	//根据比例求值域
	tp.utils.getScaleRange = function(prevScale,scale){
		var s;
		if( prevScale < scale ){ //放大
			s = prevScale <= 0 ? 2 : scale/prevScale;
		}else{					 //缩小
			s = scale <= 0 ? 0.5 : scale/prevScale;
		}
		return s; 
	}
	//放大缩小比例(回调)
	tp.utils.inOutScale = function(nodes,canvasW,canvasH,prevScale,scale){
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
	tp.utils.testIsScale = function(nodes,canvasW,canvasH,scale){
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

	//布局对象------------------------------------------------
	tp.layout={};
	tp.layout.run=function(){
		try{
			var layout = tp.option.layout;
			if( layout.name === "force" ){
				this.force(layout.param);
			}else if( layout.name === "preset" ){
			}else if( layout.name === "nestcircle" ){
			}
		}catch(e){
			throw {name:"layout error",message:"layout error"};
		}
	}
	tp.layout.force=function(param){

		var nodes = tp.nodes,
			edges = tp.edges,
			canvasW = tp.canvas.width,
			canvasH = tp.canvas.height,
			canvasArea = canvasW*canvasH,			    //画布的面积
			k = Math.sqrt( canvasArea / nodes.length )*.5, //求出每个节点的边长
			isRandom = param.isRandom,//||true,       	//默认初始位置是随机Random还是定位location
			initAreaW = param.initAreaW||100,			//随机分布是的初始宽
			initAreaH = param.initAreaH||56,			//随机分布是的初始高
			iterations = param.iterations||150,			//力导向的迭代次数
			ejectFactor = param.ejectFactor||2,			//默认斥力常量
			ejectRange = param.ejectRange||250,			//最大斥力范围,超过的不计算节点间斥力
			ejectFadeRange = param.ejectFadeRange||30,	//节点簇的减弱范围,此范围内斥力-1
			condenseFactor = param.condenseFactor||1,	//默认引力常量
			maxtx = param.maxtx||3,						//每次迭代的x方向最大移动距离
			maxty = param.maxty||1.68;					//每次迭代的y方向最大移动距离

		//随机初始位置 or 定位摆放
		isRandom ? randomCoord(nodes) : locationCoord(nodes);
		tp.utils.createIndexNode(nodes,edges);	//(优化)建立索引机制,方便用线查点
		repeatLayout(nodes,edges);
		//tp.utils.saveNodeScale100(nodes); //保存比例
		//检测屏幕是否需要缩放
		while( tp.utils.testIsScale(nodes,canvasW,canvasH,tp.consolePanel.scale) ){
			//(优化)自动缩放比例适应屏幕
			tp.utils.setZoom(tp.consolePanel.scale-0.1);
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
	            var nodeS = tp.utils.indexNode( edges[a].sourceIndex ),
	            	nodeE = tp.utils.indexNode( edges[a].targetIndex ),
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
	//控制台对象------------------------------------------------
	tp.consolePanel=function(){
		//????如何没有配置????????
		var option = tp.option,
			isShow = option.isShowConsolePanel,
			event = option.event;
		if( isShow ){
			//插入html
			document.body.insertBefore(this.getDom(),document.body.firstChild);
			this.setOption({steerwheel:steerwheelCallBack,scale:scaleCallBack});
			//显示
			this.show();
		}else{
			this.hide();
		}
		//上下左右平移的回调
		function steerwheelCallBack(keyCode){
			//逻辑处理
			tp.utils.moveSteerWheel(tp.nodes,keyCode);
			tp.render.draw();
			//设置回调
			if( event.steerwheel ){
				event.steerwheel(keyCode);
			}
		}
		//放大缩小的回调
		function scaleCallBack(prevScale,scale){
			//逻辑处理
			tp.utils.inOutScale(tp.nodes,tp.canvas.width,tp.canvas.height,prevScale,scale);
			tp.render.draw();
			//设置回调
			if( event.scale ){
				event.scale(prevScale,scale);
			}
		}
	};
	tp.consolePanel.prototype=new ConsolePanel();
	//监听对象------------------------------------------------
	tp.event={
		fps : Math.floor(1000/200), //约等于5毫秒
		fpsCount : 0,				//计算触发帧率
		dragPrevX : 0,
		dragPrevY : 0,
		dragCurrentX : 0,
		dragCurrentY : 0
	};
	tp.event.init=function(){
		var canvas  = tp.canvas;
		//监听拖拽
		canvas.addEventListener("mousedown",tp.event.canvasMouseDown,false); 	//摁下
		canvas.addEventListener("mousemove",tp.event.canvasMouseMove,false); 	//移动
		canvas.addEventListener("mouseup",tp.event.canvasMouseUp,false);   		//抬起
		canvas.addEventListener("click",tp.event.canvasClick,false);   			//点击 mouseup之后触发
		//btn.removeEventListener("mouseenter",mouseenterBtn,false); 				//悬停
		//btn.removeEventListener("mouseleave",mouseleaveBtn,false); 				//离开
	}
	tp.event.canvasMouseDown = function (e){
		//切换手型
		tp.canvas.style.cursor="pointer";
		//启动拖拽
		tp.event.isDragDrap = true;
		//判断是node还是canvas
		tp.utils.collideNode(tp.nodes,e.pageX,e.pageY);
		//保存坐标
		tp.event.dragPrevX = e.pageX;
		tp.event.dragPrevY = e.pageY;
		tp.event.dragCurrentX = e.pageX;
		tp.event.dragCurrentY = e.pageY;
	}
	tp.event.canvasMouseMove = function (e){
		//ff:200节点 50ms, chrome:200节点 25ms
		if( tp.event.fpsCount++ >= tp.event.fps ){
			//判断是否拖拽
			if( tp.event.isDragDrap ){
				//保存坐标
				tp.event.dragCurrentX = e.pageX;
				tp.event.dragCurrentY = e.pageY;
				//计算位移
				var dx = tp.event.dragCurrentX - tp.event.dragPrevX;
				var dy = tp.event.dragCurrentY - tp.event.dragPrevY;
				//当前坐标变成上一次的坐标
				tp.event.dragPrevX = tp.event.dragCurrentX;
				tp.event.dragPrevY = tp.event.dragCurrentY;

				//判断mouseDown是节点还是屏幕
				if( tp.event.collideNode ){
					tp.event.collideNode.x = tp.event.collideNode.x + dx;
					tp.event.collideNode.y = tp.event.collideNode.y + dy;
					//console.log("mouseDown node.label="+tp.event.collideNode.label);
					//修改节点坐标
				}else{
					//nodes整体平移
					var nodes = tp.nodes;
					for(var i=0; i<nodes.length; i++){
						var node = nodes[i];
						node.x = node.x + dx;
						node.y = node.y + dy;
					}
				}
				tp.utils.throttle(tp.render.draw,tp.render,Math.floor(1000/60) );
			}
			//不是拖拽,那就是没有mousedown,那就是悬停
			else{
				//判断是node还是canvas
				tp.utils.collideNode(tp.nodes,e.pageX,e.pageY);
				//判断hover是不是节点
				if( tp.event.collideNode ){
					//悬停节点高亮绘制
					tp.utils.firstNeighborsDraw();
					//回调
					if( tp.option.event.hoverNode ){ 
						tp.option.event.hoverNode(e,tp.event.collideNode);
					}
				}else{
					//悬停节点高亮绘制
					tp.utils.firstNeighborsDraw();
					//回调
					if( tp.option.event.leaveNode ){ 
						tp.option.event.leaveNode(e);
					}
				}
			}
			tp.event.fpsCount=0;
		}
	}
	tp.event.canvasMouseUp = function (e){
		//取消手型
		tp.canvas.style.cursor="";
		//关闭拖拽
		tp.event.isDragDrap = false;
	}
	tp.event.canvasClick = function (e){
		//判断是node还是canvas
		tp.utils.collideNode(tp.nodes,e.pageX,e.pageY);
		//判断mouseDown是节点还是屏幕
		if( tp.event.collideNode ){
			if( tp.option.event.clickNode ){ //回调
				tp.option.event.clickNode(e,tp.event.collideNode);
			}
		}else{
			//alert("canvas");
		}
	}
	tp.event.destory=function(){
		var canvas  = tp.canvas;
		//移除监听拖拽
		canvas.removeEventListener("mousedown",tp.event.canvasMouseDown,false); 	//摁下
		canvas.removeEventListener("mousemove",tp.event.canvasMouseMove,false); 	//移动
		canvas.removeEventListener("mouseup",tp.event.canvasMouseUp,false);   		//抬起
		canvas.removeEventListener("click",tp.event.canvasClick,false);   			//点击 mouseup之后触发
	}
	//渲染对象------------------------------------------------
	tp.render={};
	//tp.render.prototype=tp;
	tp.render.draw=function(){
		//????如何没有配置????????
		var style = tp.option.style;
		this.clearCanvas(tp.context);				//清除图像
		this.drawGlobal(style.global,tp.context);	//绘制背景
		this.drawData(style);						//绘制数据
	}
	tp.render.drawData=function(style){
		for(var i=0;i<tp.edges.length;i++){
		   	this.drawEdge(style.edge,tp.edges[i],tp.context);	//绘制连线
		}
		//var date1=new Date().getTime(); 
		for(var i=0;i<tp.nodes.length;i++){
		   	this.drawNode(style.node,tp.nodes[i],tp.context);	//绘制节点
		}
		//var date2=new Date().getTime(); 
		//console.log("drawNode time="+(date2-date1));
	}
	tp.render.clearCanvas = function(context){
		context.clearRect(0,0,tp.canvas.width,tp.canvas.height);
	}
	tp.render.drawGlobal=function(global,context){
		context.fillStyle=global.backgroundColor;
	  	context.fillRect(0,0,tp.canvas.width,tp.canvas.height);
	  	//绘制背景网格
	  	if( global.backgroundImage ){
	  		try{
	  			var bgImg = new Image();
  				bgImg.addEventListener('load',function(){
			  		var pattern = context.createPattern(bgImg,'repeat');
			  		context.fillStyle=pattern;
	  				context.globalAlpha=global.backgourndImageOpacity;
	  				context.fillRect(0,0,tp.canvas.width,tp.canvas.height);
	  				context.globalAlpha=1;
			  	},false);
			  	bgImg.src=global.backgroundImage;
	  		}catch(e){
	  			throw new URIError("style.global.backgroundImage url error");
	  		}
	  	}
	}
	tp.render.drawNode=function(style,node,context){
  		context.beginPath();
		context.fillStyle=node.color;	//node对象样式 > 全局样式
	  	context.arc(node.x,node.y,parseInt(node.size/2),0,(Math.PI/180)*360,false);
	  	context.fill();
	  	context.closePath();
	  	//绘制label
	  	this.drawNodeLabel(style,node,context);
	  	//console.log("x="+node.x+",y="+node.y);
	}
	tp.render.drawNodeLabel=function(style,node,context){
		try{
			if( node.label ){
				var textWidth = context.measureText(node.label).width; //文字宽
				context.fillStyle=node.textColor;
				context.font=node.textSize+"px serif";
				context.fillText(node.label,node.x-(textWidth/2),node.y+node.size/2+node.textSize);
			}
		}catch(e){
			throw { name:" draw node label error ", message : " draw node label error " };
		}
	}
	tp.render.drawEdge=function(style,edge,context){
		var nodeS = tp.utils.indexNode(edge.sourceIndex);
	    var nodeE = tp.utils.indexNode(edge.targetIndex);
		context.beginPath();
		context.strokeStyle=edge.color;
		context.lineWidth=edge.size;
	  	context.moveTo(nodeS.x,nodeS.y);
	 	context.lineTo(nodeE.x,nodeE.y);
	  	context.stroke();
	  	context.closePath();
	}
	//构建初始配置
	tp.option = tp.utils.extend(defaultOpt,opt?opt:{});
	//执行初始化
	tp.init();
	return tp;
}