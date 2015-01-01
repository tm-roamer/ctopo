ctopo
=====

canvas版的拓扑图(topo)展示工具,因为ff,chrome不支持本地请求json文件, 将整体工程放到本服务器下运行最为适宜.

起因
-----
  总在使用别人的开源插件来绘制拓扑,琢磨咋也要自己搞一套出来,不然太low,太逊,太没面子.<br/>

ps: 感谢[UI设计师yoki](http://www.zcool.com.cn/u/968707)对topo图做的UI设计,很赞!!!

适用场景和环境
-----
  (1)适用于监控网络ip节点互联关系的场景<br/>
  (2)适用于社交网络的群组互联访问关系
  
兼容性
-----
  ie9+,firefox,chrome,safari.
   
性能
-----
  目前还在调优,200+节点毫无压力,顺畅的没有朋友,实测5000+节点可以显示,没有操作感.

缺点
-----
  (1)性能差一点<br/>
  (2)连线没有箭头<br/>
  (3)动画api还没有制作<br/>
  (4)还未支持点击连线和悬停连线<br/>
  (5)不支持节点图片和图标<br/>
  (6)不支持框选操作

特性
-----
  (1)提供控制面板;<br/>
  (2)支持鼠标滑轮和拖拽的放大,缩小;<br/>
  (3)上下左右键盘平移;<br/>
  (4)拖拽单个节点和屏幕;<br/>
  (5)支持点击和悬停节点;<br/>
  (6)支持悬停节点的关联节点高亮;<br/>
  (7)提供事件回调接口;<br/>
  (8)支持节点使用图片;<br/>
  (9)支持力导向布局定位,即每次刷新页面,坐标不变;
  
实现原理
-----
  (1)使用html5的canvas标签来实现的;<br/>
  (2)布局算法使用力导向布局(库仑斥力公式和胡克定律公式)[来自网络](http://zhenghaoju700.blog.163.com/blog/static/13585951820114153548541/?suggestedreading&wumii);<br/>
  (3)节点的碰撞检测使用勾股定理测距;<br/>
  
界面展示
-----
  ![github](http://zcimg.zcool.com.cn/zcimg/m_ea6154a40239000001495fbfb757.jpg "示例图片")
  ![github](http://zcimg.zcool.com.cn/zcimg/m_2bbd54a4010e0000014b09b75730.jpg "UI皮肤")
  
版权
-----
  随意使用,完全开源

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
		
### 接口表
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
			<td>draw(options)</td>
			<td>重新绘制画布,用法等于ctopo(options)</td>
			<td>
				参数1: <br/>options初始的配置对象
			</td>
			<td>空</td>
		</tr>
		<tr>i
			<td>edge(sid,tid)</td>
			<td>取得连线对象</td>
			<td>
				参数1: <br/>开始节点id<br/>
				参数1: <br/>结束节点id
			</td>
			<td>连线对象</td>
		</tr>
		<tr>
			<td>edges()</td>
			<td>取得所有的连线对象数组</td>
			<td>
				无
			</td>
			<td>连线对象数组</td>
		</tr>
		<tr>
			<td>firstNeighbors(node)</td>
			<td>返回所有关联节点的连线和邻居节点对象</td>
			<td>
				参数1: <br/>node待匹配的节点
			</td>
			<td>返回与之关联的连线和节点对象<br/>
				{<br/>
				edgeNeighbors:[],<br/>
				nodeNeighbors:[]<br/>
				}<br/>
			</td>
		</tr>
		<tr>
			<td>layout(layout)</td>
			<td>切换使用布局</td>
			<td>
				(可选)参数1: <br/>layout对象==初始的option.layout对象
			</td>
			<td>返回初始的option.layout对象</td>
		</tr>
		<tr>
			<td>node(id)</td>
			<td>取得节点对象</td>
			<td>
				参数1: <br/>节点id
			</td>
			<td>节点对象</td>
		</tr>
		<tr>
			<td>nodeLabelsVisible(visible)</td>
			<td>设置节点标签是否显示</td>
			<td>
				参数1: <br/>visible是否显示标签,布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>nodes()</td>
			<td>取得所有节点对象数组</td>
			<td>
				无
			</td>
			<td>所有节点对象数组</td>
		</tr>
		<tr>
			<td>nodeTooltipsVisible(visible)</td>
			<td>设置节点提示是否显示</td>
			<td>
				参数1: <br/>visible是否显示标签,布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>consolePanelVisible(visible)</td>
			<td>设置控制台是否显示</td>
			<td>
				参数1: <br/>visible是否显示标签,布尔型true,false
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>ready(fn)</td>
			<td>当topo图加载完成后执行的方法</td>
			<td>
				参数1: <br/>fn当topo加载完成执行的回调函数
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
			<td>删除节点</td>
			<td>
				参数1: <br/>节点id <br/>
				参数2: <br/>是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>updateEdge(sid,tid,isDrawNow)</td>
			<td>更新连线</td>
			<td>
				参数1: <br/>开始节点id <br/>
				参数2: <br/>结束节点id <br/>
				参数3: <br/>是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>updateNode(id,isDrawNow)</td>
			<td>更新节点</td>
			<td>
				参数1: <br/>节点id <br/>
				参数2: <br/>是否立刻渲染到屏幕
			</td>
			<td>空</td>
		</tr>
		<tr>
			<td>style(style)</td>
			<td>取得样式对象</td>
			<td>
				参数1: <br/>style等于初始化配置对象option.style
			</td>
			<td>样式对象</td>
		</tr>
	</tbody>
</table>



大标题
===================================
  大标题一般显示工程名,类似html的\<h1\><br />
  你只要在标题下面跟上=====即可

  
中标题
-----------------------------------
  中标题一般显示重点项,类似html的\<h2\><br />
  你只要在标题下面输入------即可
  
### 小标题
  小标题类似html的\<h3\><br />
  小标题的格式如下 ### 小标题<br />
  注意#和标题字符中间要有空格

### 注意!!!下面所有语法的提示我都先用小标题提醒了!!! 

### 单行文本框
    这是一个单行的文本框,只要两个Tab再输入文字即可
        
### 多行文本框  
    这是一个有多行的文本框
    你可以写入代码等,每行文字只要输入两个Tab再输入文字即可
    这里你可以输入一段代码

### 比如我们可以在多行文本框里输入一段代码,来一个Java版本的HelloWorld吧
    public class HelloWorld {

      /**
      * @param args
   */
   public static void main(String[] args) {
   System.out.println("HelloWorld!");

   }

    }
### 链接
1.[点击这里你可以链接到www.google.com](http://www.zcool.com.cn/u/968707)<br />
2.[点击这里我你可以链接到我的博客](http://guoyunsky.iteye.com)<br />

###只是显示图片
![github](http://github.com/unicorn.png "github")

###想点击某个图片进入一个网页,比如我想点击github的icorn然后再进入www.github.com
[![image]](http://www.github.com/)
[image]: http://github.com/github.png "github"

### 文字被些字符包围
> 文字被些字符包围
>
> 只要再文字前面加上>空格即可
>
> 如果你要换行的话,新起一行,输入>空格即可,后面不接文字
> 但> 只能放在行首才有效

### 文字被些字符包围,多重包围
> 文字被些字符包围开始
>
> > 只要再文字前面加上>空格即可
>
>  > > 如果你要换行的话,新起一行,输入>空格即可,后面不接文字
>
> > > > 但> 只能放在行首才有效

### 特殊字符处理
有一些特殊字符如<,#等,只要在特殊字符前面加上转义字符\即可<br />
你想换行的话其实可以直接用html标签\<br /\>
