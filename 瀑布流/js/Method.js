var Method=Method || (function () {
    return {
        DRAG_MOVE_EVENT:"drag_move_event",
        RELOAD_FINISH_EVENT:"reload_finish_event",
        setStyle:function (elem,styleObj) {
            for(var str in styleObj){
                elem.style[str]=styleObj[str];
            }
        },
        createElem:function (type,parent,styleObj) {
            var elem=document.createElement(type);
            if(parent){
                parent.appendChild(elem);
            }
            if(styleObj){
                Method.setStyle(elem,styleObj);
            }
            return elem;
        },
        randomColor:function (alpha) {
            var col="rgba(";
            for(var i=0;i<3;i++){
                col+=Math.floor(Math.random()*256)+",";
            }
            if(alpha){
                col+=Math.random();
            }else{
                col+=1
            }
            col+=")";
            return col;
        },
        dragElem:function (elem) {
            elem.addEventListener("mousedown",this.mouseHandler);

        },
        cancelDrag:function (elem) {
            elem.removeEventListener("mousedown",this.mouseHandler);
        },
        mouseHandler:function (e) {
            if(e.type==="mousedown"){
                e.stopPropagation();
                e.preventDefault();
                document.addEventListener("mousemove",Method.mouseHandler);
                document.offsetPoint={x:e.offsetX,y:e.offsetY};
                document.dragTarget=this;
                var rect=this.getBoundingClientRect();
                document.prentRect={left:rect.left-this.offsetLeft,top:rect.top-this.offsetTop};
                this.addEventListener("mouseup",Method.mouseHandler);
            }else if(e.type==="mousemove"){
                this.dragTarget.style.left=e.pageX-this.prentRect.left-this.offsetPoint.x+"px";
                this.dragTarget.style.top=e.pageY-this.prentRect.top-this.offsetPoint.y+"px";
                var evt=new Event(Method.DRAG_MOVE_EVENT);
                this.dragTarget.dispatchEvent(evt);
            }else if(e.type==="mouseup"){
                document.removeEventListener("mousemove",Method.mouseHandler);
                this.removeEventListener("mouseup",Method.mouseHandler);
            }
        },
        hitTest:function (elem1,elem2) {
            var elemRect1=elem1.getBoundingClientRect();
            var elemRect2=elem2.getBoundingClientRect();

            if(elemRect1.left>elemRect2.left && elemRect1.left<elemRect2.left+elemRect2.width && elemRect1.top>elemRect2.top && elemRect1.top<elemRect2.top+elemRect2.height){
                return true;
            }
            if(elemRect1.left+elemRect1.width>elemRect2.left && elemRect1.left+elemRect1.width<elemRect2.left+elemRect2.width && elemRect1.top>elemRect2.top && elemRect1.top<elemRect2.top+elemRect2.height){
                return true;
            }
            if(elemRect1.left>elemRect2.left && elemRect1.left<elemRect2.left+elemRect2.width && elemRect1.top+elemRect1.height>elemRect2.top && elemRect1.top+elemRect1.height<elemRect2.top+elemRect2.height){
                return true;
            }
            if(elemRect1.left+elemRect1.width>elemRect2.left && elemRect1.left+elemRect1.width<elemRect2.left+elemRect2.width && elemRect1.top+elemRect1.height>elemRect2.top && elemRect1.top+elemRect1.height<elemRect2.top+elemRect2.height){
                return true;
            }
            return false;
        },
        TweenLite:function (elem,targetObj,easing,time,updateCallBack,completeCB) {
         var color=getComputedStyle(elem).backgroundColor.split("(")[1].split(")")[0].split(",");
         var r=parseInt(color[0]);
         var g=parseInt(color[1]);
         var b=parseInt(color[2]);
            var startObj={
                left:elem.offsetLeft,
                top:elem.offsetTop,
                width:elem.offsetWidth,
                height:elem.offsetHeight,
                bgR:r,
                bgG:g,
                bgB:b,
                borderRadius:parseInt(getComputedStyle(elem).borderRadius)
            };
            var tween=new TWEEN.Tween(startObj);
            tween.to(targetObj,time);
            tween.easing(easing);
            tween.onUpdate(updateCallBack);
            if(completeCB){
                tween.onComplete(completeCB);
            }
            tween.start();
        },
        /*
        *  预加载方法
        *  参数
        *      list  Array 图片名称的数组
        *      path  String  图片名称前面的路径字符串
        *      callBack  Function   回调函数，用于当加载图片完毕后，通过执行这个回调函数
        *                   将加载完成图片字典传回原代码中
        *               callBack函数在源代码中定义时，必须有一个参数，这个参数是对象，就是
        *               这里加载完成的图片字典
        *
        * */
        reload:function (list,path,callBack) {
            //新建一个图片
            var img=new Image();
            //将list,path,callBack这三个参数存储在img的三个属性上
            //在loadHandler这个事件函数中，我们一直都是使用这一个img，
            // 因此loadHandler函数中this就是这个img，那么里面this.list就是这里存储的list
            img.list=list;
            img.path=path;
            img.callBack=callBack;
            //这里增加一个imgDic的属性是一个对象，用于存储以后加载进入的所有图片
            img.imgDic={};
            //用来计数当前的加载进入的图片是第几个
            img.num=0;
            //增加侦听事件
            img.addEventListener("load",Method.loadHandler);
            //指定图片的加载路径和图片名称
            img.src=path+list[0];
        },
        loadHandler:function (e) {
            //这是分解图片地址中的图片名称，这个图片名称不要后缀
            /*var startIndex=this.src.lastIndexOf("/")+1;
            var endIndex=this.src.lastIndexOf(".");
            var name=this.src.slice(startIndex,endIndex);*/
            //this.imgDic就是上面定义的img.imgDic是个对象，现在给它里面添加属性
            //属性名就是上面的name（我们把上面的所有代码合起来写的）,属性的值就是当前图片的克隆元素
            this.imgDic[this.src.slice(this.src.lastIndexOf("/")+1,this.src.lastIndexOf("."))]=this.cloneNode(false);
            //当前加载第几张图片
            this.num++;
            //如果当前加载的图片大于需要加载图片数组列表的长度时，就加载完成了
            if(this.num>this.list.length-1){
                //如果我们使用callBack参数
                if(this.callBack){
                    //调用callBack参数，并且将图片字典通过参数传递会那个回调函数
                    this.callBack(this.imgDic);
                    //img.callback的属性值为 callback函数
                    //可以理解为执行callback函数，参数1为img.imgDic。
                    //callback（img.imgDic）
                    //轮播图中 function init(dic) {imgDic=dic;}的含义为将参数传给imgDic
                    // （也可以理解为将img下imgDic属性的属性值，就是数组进行声明赋值 var imgDic=[];）
                    //返回不再执行后面
                    return;
                }
                //创建一个事件
                var evt=new Event(Method.RELOAD_FINISH_EVENT);
                //并且给这个事件对象增加一个属性imgDic就是这个图片字典
                evt.imgDic=this.imgDic;
                //给document抛发这个事件
                document.dispatchEvent(evt);
                return;
            }
            //更改地址，加载下一张图片
            this.src=this.path+this.list[this.num];
        }
    }
})();