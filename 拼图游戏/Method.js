var Method=Method || (function () {
    return {
        DRAG_MOVE_EVENT:"drag_move_event",
        setStyle:function (elem,styleObj) {
            for(var str in styleObj){
                elem.style[str]=styleObj[str];
            }
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
        }
    }
})();