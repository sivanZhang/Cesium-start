---
sidebarDepth: 4
---

# 点击交互

拾取技术（picking）能够根据一个屏幕上的像素位置返回三维场景中的对象信息。

有好几种拾取：

-  [`Scene.pick`](https://cesiumjs.org/Cesium/Build/Documentation/Scene.html#pick) : 返回窗口坐标对应的图元的第一个对象。
-  [`Scene.drillPick`](https://cesiumjs.org/Cesium/Build/Documentation/Scene.html#drillPick) :返回窗口坐标对应的所有对象列表。
-  [`Globe.pick`](https://cesiumjs.org/Cesium/Build/Documentation/Globe.html?classFilter=globe#pick) : 返回一条射线和地形的相交位置点。

官方示例:

- [拾取示例](https://cesiumjs.org/Cesium/Build/Apps/Sandcastle/index.html?src=Picking.html&label=Showcases)
-  [3D Tiles 对象拾取](https://sandcastle.cesium.com/index.html?src=3D%20Tiles%20Feature%20Picking.html)

因为我们想实现鼠标滑过的高亮效果，首先需要创建一个鼠标事件处理器。  [`ScreenSpaceEventHandler`](https://cesiumjs.org/Cesium/Build/Documentation/ScreenSpaceEventHandler.html)是可以处理一系列的用户输入事件的处理器. [`ScreenSpaceEventHandler.setInputAction()`](https://cesiumjs.org/Cesium/Build/Documentation/ScreenSpaceEventHandler.html#setInputAction) 监听某类型的用户输入事件 -- [`ScreenSpaceEventType`](https://cesiumjs.org/Cesium/Build/Documentation/ScreenSpaceEventType.html)用户输入事件类型，做为一个参数传递过去。这里我们设置一个回调函数来接受鼠标移动事件:

``` js
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function(movement) {
    //...
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);//鼠标移动事件
```

举例,拾取构件查看属性：

``` js
var scene = viewer.scene;
//添加一个左键点击事件
viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    //拾取
    var feature = scene.pick(movement.position);
    if (feature instanceof Cesium.Cesium3DTileFeature) {
        //查看拾取到构件属性
        var propertyNames = feature.getPropertyNames();
        var length = propertyNames.length;
        for (var i = 0; i < length; ++i) {
            var propertyName = propertyNames[i];
            console.log(propertyName + ': ' + feature.getProperty(propertyName));
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

查看[示例](https://sogrey.github.io/Cesium-start-Example/examples/InputAction-Pick/pick-position.html)


## Cesium获取鼠标点击位置

### 屏幕坐标（鼠标点击位置距离canvas左上角的像素值）

通过：`movement.position`获取

``` js
var viewer = new Cesium.Viewer('cesiumContainer');

var handler= new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (movement) {
     console.log(movement.position);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

### 世界坐标（Cartesian3）

通过：[`Camera.pickEllipsoid(windowPosition, ellipsoid, result) → Cartesian3`](https://cesium.com/docs/cesiumjs-ref-doc/Camera.html#pickEllipsoid)拾取,可以获取当前点击视线与椭球面相交处的坐标，其中ellipsoid是当前地球使用的椭球对象：`viewer.scene.globe.ellipsoid`。

``` js
var viewer = new Cesium.Viewer('cesiumContainer');

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (movement) {
     var position = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
     console.log(position);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

### 场景坐标

通过:[`viewer.scene.pickPosition(movement.position)`](https://cesium.com/docs/cesiumjs-ref-doc/Scene.html?classFilter=scene#pickPosition)获取，根据窗口坐标，从场景的深度缓冲区中拾取相应的位置，返回笛卡尔坐标。

``` js
var viewer = new Cesium.Viewer('cesiumContainer');

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (movement) {
     var position = viewer.scene.pickPosition(movement.position);
     console.log(position);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

### 地标坐标

通过:[`viewer.scene.globe.pick(ray, scene, result)`](https://cesium.com/docs/cesiumjs-ref-doc/Globe.html#pick)获取，可以获取点击处地球表面的世界坐标，不包括模型、倾斜摄影表面。其中ray=viewer.camera.getPickRay(movement.position)。

``` js
var viewer = new Cesium.Viewer('cesiumContainer');

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (movement) {
     var ray=viewer.camera.getPickRay(movement.position);
     var position = viewer.scene.globe.pick(ray, viewer.scene);
     console.log(position);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```


## 限制鼠标的视图控制

``` js
// 禁用放大缩小和自由旋转视图
viewer.scene.screenSpaceCameraController.enableZoom = false;
viewer.scene.screenSpaceCameraController.enableTilt = false;
```

## 修改视图默认鼠标操作方式

``` js
// 修改默认的鼠标视图控制方式。
viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG]
```

## 添加自定义鼠标事件（1），实现点击、双击、右键点击等事件

``` js
// 添加鼠标点击事件。
// 可以通过Cesium.ScreenSpaceEventType类实现不同的触发条件
viewer.screenSpaceEventHandler.setInputAction(function(click) {
    // 处理鼠标按下事件，获取鼠标当前位置
    var feature = viewer.scene.pick(click.position);
    //选中某模型
    if (feature && feature instanceof Cesium.Cesium3DTileFeature) {
        console.log(feature);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
 
// 移除事件
viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

## 添加自定义鼠标事件（2），实现点击、双击、右键点击等事件。本质来讲和上面是一样的，只是写法不同。

``` js
// 添加事件
// 可以通过Cesium.ScreenSpaceEventType类实现不同的触发条件
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function(click){
    console.log('左键单击事件：',click.position);     
},Cesium.ScreenSpaceEventType.LEFT_CLICK);
 
// 移除事件
handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

## 参考

- [Cesium获取鼠标点击位置（PickPosition）](https://www.jianshu.com/p/e7e65b448eeb)
- [Cesium鼠标事件汇总](https://blog.csdn.net/mengdong_zy/article/details/90446679)