var Method=Method || (function () {
    return {
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
                document.addEventListener("mousemove",Method.mouseHandler);
                document.offsetPoint={x:e.offsetX,y:e.offsetY};
                document.dragTarget=this;
                this.addEventListener("mouseup",Method.mouseHandler);
            }else if(e.type==="mousemove"){
                this.dragTarget.style.left=e.pageX-this.offsetPoint.x+"px";
                this.dragTarget.style.top=e.pageY-this.offsetPoint.y+"px";
            }else if(e.type==="mouseup"){
                document.removeEventListener("mousemove",Method.mouseHandler);
                this.removeEventListener("mouseup",Method.mouseHandler);
            }
        }
    }
})();