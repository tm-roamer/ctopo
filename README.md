ctopo
=====

canvas版的拓扑图(topo)展示工具.

起因
-----
  总在使用别人的开源插件来绘制拓扑,总是不能满足公司各个项目的各种需求,痛定思痛自己搞一套吧.<br/>

ps: 感谢[UI设计师yoki](http://www.zcool.com.cn/u/968707)对topo图做的UI设计,很赞!!!

ps: 因为ff,chrome不支持本地请求json文件, 将整体工程放到本服务器下运行最为适宜.

适用场景和环境
-----
  (1)适用于监控网络ip节点互联关系的场景<br/>
  (2)适用于社交网络的群组互联访问关系
  
兼容性
-----
  ie9+,firefox,chrome,safari.
   
性能说明
-----
  目前还在调优,200+节点毫无压力,顺畅的没有朋友,正常使用尽量控制在200左右.

  节点的碰撞检测5千节点1ms左右,连线的碰撞检测5千连线1ms左右,(ff,chrome一样)

  ps: 绘制节点标签还是挺吃性能的

	绘制节点不带label
		//ff     直接挂了
		//chrome nodes count=1000,edges count=1000,layout time=4838,draw time=9

		//ff     nodes count=500,edges count=500,layout time=9543,draw time=19
		//chrome nodes count=500,edges count=500,layout time=1272,draw time=6

		//ff     nodes count=300,edges count=300,layout time=3445,draw time=11
		//chrome nodes count=300,edges count=300,layout time=475,draw time=4

		//ff     nodes count=200,edges count=200,layout time=1551,draw time=7
		//chrome nodes count=200,edges count=200,layout time=233,draw time=4
	
	绘制节点带label
		//ff     直接挂了
		//chrome nodes count=1000,edges count=1000,layout time=4838,draw time=39

		//ff     nodes count=500,edges count=500,layout time=9543,draw time=125
		//chrome nodes count=500,edges count=500,layout time=1272,draw time=23

		//ff     nodes count=300,edges count=300,layout time=3445,draw time=77
		//chrome nodes count=300,edges count=300,layout time=475,draw time=16

		//ff     nodes count=200,edges count=200,layout time=1551,draw time=49
		//chrome nodes count=200,edges count=200,layout time=233,draw time=10
缺点
-----
  (1)性能差一点<br/>
  (2)不支持节点图片和图标<br/>
  (3)不支持框选操作

特性
-----
  (1)提供控制面板;<br/>
  (2)支持鼠标滑轮和拖拽的放大,缩小;<br/>
  (3)上下左右键盘平移;<br/>
  (4)拖拽单个节点和屏幕;<br/>
  (5)支持点击和悬停节点;<br/>
  (6)支持点击和悬停连线;<br/>
  (7)支持悬停节点的关联节点高亮;<br/>
  (8)提供事件回调接口;<br/>
  (9)支持连线箭头;<br/>
  (10)支持连线的流动动画;<br/>
  (11)支持力导向布局定位,即每次刷新页面,坐标不变;
  
实现原理
-----
  (1)使用html5的canvas标签来实现的;<br/>
  (2)布局算法使用力导向布局(库仑斥力公式和胡克定律公式)[来自网络](http://zhenghaoju700.blog.163.com/blog/static/13585951820114153548541/?suggestedreading&wumii);<br/>
  (3)节点的碰撞检测使用勾股定理测距;<br/>
  (4)连线的碰撞检测使用反正切计算夹角;<br/>
  
界面展示
-----
  ![github](http://zcimg.zcool.com.cn/zcimg/m_ea6154a40239000001495fbfb757.jpg "示例图片")
  ![github](http://zcimg.zcool.com.cn/zcimg/m_2bbd54a4010e0000014b09b75730.jpg "UI皮肤")
  
版权
-----
  MIT(随意使用,免费开源)

基础实例
-----
		<!DOCTYPE html>
		<html lang="zh">
		    <head>
		      <meta charset="UTF-8">
		      <title></title>
		    </head>
		    <body>
		      <canvas id="canvas"></canvas>
		      <script type="text/javascript" src="ctopo.js"></script>
		      <script type="text/javascript">
		        //调用ctopo
		        ctopo({
				      id:"canvas",    //说明: canvas标签的id,     写法: canvas , #canvas
				      width:"auto",   //说明: canvas的宽度,       写法: 500,500px,50%,auto 
				      height:"auto",  //说明: canvas的高度,       写法: 500,500px,50%,auto
				      style:{	      //说明: 样式省略了.....
					      global:{},
					      node:{},
					      edge:{}
				      },
				      layout:{},      //说明: 布局省略了.....
				      data:{},	      //说明: 数据省略了.....
				      event:{}	      //说明: 事件回调省略了.....
				    });
		      </script>
		    </body>
		</html>  
  

api接口
-----
### 使用方法
		//取得ctopo对象, 点出api方法即可
		var ctopo = ctopo({..各种基础配置..});
		var nodeA = ctopo.node("1108"); //获取节点A
		var nodeB = ctopo.node("0724"); //获取节点B
		var edge = ctopo.edge("1108","0724"); //获取连线
		
### 属性和方法
<table>
	<thead>
		<tr><td>属性名</td><td>描述</td></tr>
	</thead>
	<tbody>
		<tr><td>version</td><td>版本</td></tr>
		<tr><td>option</td><td>配置对象</td></tr>
		<tr><td>canvas</td><td>画布对象</td></tr>
		<tr><td>context</td><td>画布上下文对象</td></tr>
		<tr><td>nodes</td><td>节点数组</td></tr>
		<tr><td>edges</td><td>连线对象</td></tr>
	</tbody>
</table>

<table>
	<thead>
		<tr><td>方法名</td><td>描述</td><td>参数</td><td>返回值</td></tr>
	</thead>
	<tbody>
		<tr>
			<td>addEdge(edge,isDrawNow)</td>
			<td>添加连线</td>
			<td>
				参数1: <br/>edge添加的连线对象<br/>
				参数2: <br/>isDrawNow是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>addNode(node,isDrawNow)</td>
			<td>添加节点</td>
			<td>
				参数1: <br/>edge添加的节点对象<br/>
				参数2: <br/>isDrawNow是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>draw(option)</td>
			<td>重新绘制画布,<br/>用法等于ctopo(option)</td>
			<td>
				参数1: <br/>option初始的配置对象
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>drawData(data,isApplyLayout)</td>
			<td>局部刷新,只刷新数据</td>
			<td>
				参数1: <br/>data格式=optioin.data<br/>
				参数2: <br/>isApplyLayout是否重新应用布局
			</td>
			<td>成功true,失败false</td>
		</tr>
		<tr>
			<td>edge(sid,tid)</td>
			<td>
				取得连线对象<br/>
				ps:区分方向
			</td>
			<td>
				参数1: <br/>开始节点id<br/>
				参数2: <br/>结束节点id
			</td>
			<td>
				查到: 连线对象 <br/>
				没查到: null
			</td>
		</tr>
		<tr>
			<td>edgeArray()</td>
			<td>取得所有的连线对象数组</td>
			<td>
				无
			</td>
			<td>连线对象数组</td>
		</tr>
		<tr>
			<td>firstNeighbors(nid)</td>
			<td>返回与之关联的连线和节点数组对象</td>
			<td>
				参数1: <br/>nid待匹配的节点id
			</td>
			<td>查到:关联数据对象;<br/>
				没查到:空数组对象<br/>
				{<br/>
				edgeNeighbors:[],<br/>
				nodeNeighbors:[]<br/>
				}<br/>
			</td>
		</tr>
		<tr>
			<td>layout(layout)</td>
			<td>重置切换布局</td>
			<td>
				(可选)参数1:<br/> layout==option.layout
			</td>
			<td>
				无参数:<br/> 返回option.layout<br/>
				有参数:<br/> 重置布局,<br/>成功true,失败false
			</td>
		</tr>
		<tr>
			<td>node(id)</td>
			<td>取得节点对象</td>
			<td>
				参数1: <br/>节点id
			</td>
			<td>
				查到:节点对象<br/>
				没查到:null
			</td>
		</tr>
		<tr>
			<td>nodeLabelsVisible(visible)</td>
			<td>设置节点标签是否显示</td>
			<td>
				参数1: <br/>visible是否显示标签,<br/>布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>edgeLabelsVisible(visible)</td>
			<td>设置连线标签是否显示</td>
			<td>
				参数1: <br/>visible是否显示标签,<br/>布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>edgeArrowsVisible(visible)</td>
			<td>设置连线箭头是否显示</td>
			<td>
				参数1: <br/>visible是否显示箭头,<br/>布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>nodeArray()</td>
			<td>取得所有节点对象数组</td>
			<td>
				无
			</td>
			<td>节点对象数组</td>
		</tr>
		<tr>
			<td>nodeTooltipsVisible(visible)</td>
			<td>设置节点提示框是否显示</td>
			<td>
				参数1: <br/>visible是否显示提示框,<br/>布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>edgeTooltipsVisible(visible)</td>
			<td>设置连线提示框是否显示</td>
			<td>
				参数1: <br/>visible是否显示提示框,<br/>布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>edgeAnimateBallsVisible(visible)</td>
			<td>设置连线动画球是否显示</td>
			<td>
				参数1: <br/>visible是否显示动画球,<br/>布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>consolePanelVisible(visible)</td>
			<td>设置控制台是否显示</td>
			<td>
				参数1: <br/>visible是否显示控制台,<br/>布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>removeEdge(sid,tid,isDrawNow)</td>
			<td>删除连线</td>
			<td>
				参数1: <br/>开始节点id <br/>
				参数2: <br/>结束节点id <br/>
				参数3: <br/>是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>removeNode(id,isDrawNow)</td>
			<td>删除节点,与之关联的线也删除</td>
			<td>
				参数1: <br/>节点id <br/>
				参数2: <br/>是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>updateEdge(edge,isDrawNow)</td>
			<td>更新连线</td>
			<td>
				参数1: <br/>连线对象 <br/>
				参数3: <br/>是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>updateNode(node,isDrawNow)</td>
			<td>更新节点</td>
			<td>
				参数1: <br/>节点对象 <br/>
				参数2: <br/>是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>style(style)</td>
			<td>重置切换样式</td>
			<td>
				(可选)参数1: <br/>style==option.style
			</td>
			<td>
				无参数: <br/>返回option.style
				有参数: <br/>重置样式,<br/>成功true,失败false
			</td>
		</tr>
		<tr>
			<td>zoom(scale)</td>
			<td>设置缩放比例(0-1)</td>
			<td>
				(可选)参数1: <br/>scale比例0-1,100%=0.5<br/>
			</td>
			<td>
				无参数:<br/> 返回比例值<br/>
				有参数:<br/> 设置比例值,<br/>成功ture,失败false
			</td>
		</tr>
	</tbody>
</table>

