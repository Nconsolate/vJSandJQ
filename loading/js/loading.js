jQuery.Loading = function (options) {
	if(options.bool===true)
	{	let loading=$(`<div id="box">
		<div id="shade"></div>
		<div id="loadingStyle"></div></div>`);
if($("#box").length<=0){
	$("body").append(loading);
	if(options.loadings)
	$("#loadingStyle").append(options.loadings);}
	$("#box").css({
		width:"100%",
		height:"100%",
		position:"fixed",
		top:0,
		left:0
	})
	$("#shade").css({
		width:"100%",
		height:"100%",
		position:"absolute",
		"z-index":"9999",
		background:"#000",
		opacity:.5
	})
	$("#loadingStyle").css({
		
		position:"absolute",
		"z-index":"9998",
		left:"50%",
		top:"50%",
		 transform: "translate(-50%, -50%)", 
	});
	
		$("#box").show();
		let s=$("html").scrollTop()
		$(window).on("scroll",function(){
			$("html").scrollTop(s);
		})


}
else {
	$("#box").remove();
$(window).off("scroll")
	}
	
	
	
    }
