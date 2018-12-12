//声明 一个对象Method，若Method存在则其为Method，否则为 匿名函数并自执行的值
var Method=Method||function () {
    return {
        DRAG_MOVE_EVENT:"drag_move_event",
        RELOAD_FINISH_EVENT:"reload_finish_event",
    // 设置元素elem的样式styleObj
    setStyle:function (elem,styleObj) {
        for (var strs in styleObj) elem.style[strs]=styleObj[strs];
    },

        //参数1 type要创建的元素标签，必填
        //参数2 parent要存入的父元素，选填，若父元素存在则将其插入父元素中
        //参数3 styleObj要设置的样式对象，选填，若存在则调用方法设置样式
        createEle:function(type,parent,styleObj){
        var elem=document.createElement(type);
        if(parent) parent.appendChild(elem);
        if(styleObj) {Method.setStyle(elem,styleObj);}
        return elem;
    },
        randomClientLeft:function(elem){
            return Math.floor(Math.random()*(document.documentElement.clientWidth-100));
        },
        randomClientTop:function(elem){
            return Math.floor(Math.random()*(document.documentElement.clientHeight-100));
        },

   //     随机颜色，当输入的参数在[0,1]之间，设置透明度为输入的参数
   //          true 或非[0,1] 或字符型对象型随机透明度
   //     参数为空或者参数为false，null ，undefined，NaN 以RGB形式输出
   randomColor:function (bool) {
      var arr=[];
            for (var i=0;i<3;i++)
                arr.push(Math.floor(Math.random()*256));
            if (typeof bool!=="undefined")
            {
                if(typeof bool==="number"&&bool>=0&&bool<=1) arr.push(bool);
                else if(bool) arr.push(Math.random().toFixed(2));
            }
            return  "rgb("+arr.join(",")+")";
   },

   dragElem:function (elem) {
        elem.addEventListener("mousedown",this.mouseHandler)
    },
    cancelDrag:function (elem) {
        elem.removeEventListener("mousedown",this.mouseHandler)
    },
   mouseHandler: function (e) {
       if (e.type === "mousedown") {
           //阻止冒泡，阻止系统默认行为
           e.stopPropagation();
           e.preventDefault();
           //侦听鼠标移动事件，当鼠标移动时，执行Method下的mouseHandler属性对应的匿名事件函数。
           document.addEventListener("mousemove", Method.mouseHandler);
           //侦听Elem的鼠标释放
           this.addEventListener("mouseup", Method.mouseHandler);
           //鼠标点击的位置相对于 触发鼠标按下事件的元素 的内容区的左上角 的坐标以对象形式存放在页面的offsetPoint属性中
           document.offsetPoint = {x: e.offsetX, y: e.offsetY};
           //  将this即movedown对应的侦听元素 即Elem   存到 document的dragTarget属性中，
               document.dragTarget = this;
           // 获取被侦听的元素 Elem 的位置的集合
           var rect = this.getBoundingClientRect();
           // 将被侦听元素 Elem 的父级的左，上 到可视窗口的距离   存放在document的parentRect属性中。
           //                     父级的左=被拖动元素的左-被拖动元素左到父元素的左距离
           document.parentRect = {left: rect.left - this.offsetLeft, top: rect.top - this.offsetTop};
       } else if (e.type === "mousemove") {
           var evt=new Event(Method.DRAG_MOVE_EVENT);
           this.dragTarget.dispatchEvent(evt);
           // 这里this指被侦听对象 mousemove事件 document
           // this.dragTarget 指document.dragTarget被拖动元素 Elem 被拖动元素相对父级的定位  点击位置相对于视口左距离减被拖动元素的父级相对视口左距离减去点击位置相对被拖动元素左的距离
           this.dragTarget.style.top = e.clientY - this.parentRect.top - this.offsetPoint.y + "px";
           this.dragTarget.style.left = e.clientX - this.parentRect.left - this.offsetPoint.x + "px";
           //侦听document上的鼠标释放事件，防止因在Elem外释放鼠标造成的焦点丢失
           this.addEventListener("mouseup", Method.mouseHandler);
       } else if (e.type === "mouseup") {
           //清除document的mousemove侦听事件和mouseup的侦听事件
           //this指 Elem 清除Elem的mouseup事件   //防止事件一直侦听消耗内存。
           //注  不能在里面清除Elem的mousedown事件否则，Elem只能拖动一次，无法再次触发mousedown事件。
           //若要按需求清除，需要在外面调用 Method.cancelDrag();
           document.removeEventListener("mousemove", Method.mouseHandler);
           document.removeEventListener("mouseup", Method.mouseHandler);
           this.removeEventListener("mouseup", Method.mouseHandler);
       }
   },
   //     检测碰撞
   hitTest:function (ele1,ele2) {
            var ele1Rect1=ele1.getBoundingClientRect();
            var ele2Rect2=ele2.getBoundingClientRect();
           console.log(ele1Rect1.top-ele2Rect2.top,ele2Rect2.bottom-ele1Rect1.bottom);
           console.log( ele2Rect2.left-ele1Rect1.left,ele1Rect1.right-ele2Rect2.right);
            if (ele1Rect1.top-ele2Rect2.top<=ele1Rect1.height&&
                ele2Rect2.bottom-ele1Rect1.bottom<=ele1Rect1.height&&
                ele2Rect2.left-ele1Rect1.left<=ele1Rect1.width&&
                ele1Rect1.right-ele2Rect2.right<=ele1Rect1.width)
                return true;
   }
    }
}();