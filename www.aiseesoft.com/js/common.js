// system
function system_confirm(){var userAgentInfo = navigator.userAgent;if(userAgentInfo.indexOf("Win")>-1){return "win"}else if(userAgentInfo.indexOf("Mac")>-1){return "mac"}};function device_confirm(){var userAgentInfo = navigator.userAgent;var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];var flag = true;for (var v = 0; v < Agents.length; v++) {if (userAgentInfo.indexOf(Agents[v]) > 0) {flag = false;break;}}return flag;};
//search
$(document).ready(function() {
	try{	var a;
	a="<form action=\"/search-results.html\" method=\"get\" name=\"s\" id=\"search-form\">";
	a+="<div id=\"search-container\">";
	a+="<div id=\"search-logo\">";
	a+="<\/div>";
	a+="<input type=\"hidden\" name=\"cx\" value=\"007565757824446242910:ylk3cgkfzak\" />";
	a+="<input type=\"hidden\" name=\"cof\" value=\"FORID:11\" />";
	a+="<input type=\"hidden\" value=\"UTF-8\" name=\"oe\">";
	a+="<input type=\"hidden\" name=\"domains\" value=\"www.aiseesoft.com\" \/>";
	a+="<input type=\"hidden\" name=\"sitesearch\" value=\"www.aiseesoft.com\" \/>";
	a+="<input type=\"text\" id=\"q\" name=\"q\" onmouseover=\"this.focus()\" onclick=\"if(this.value==\'iPhone Data Recovery\')this.value=\'\'\" onblur=\"if (value ==\'\'){value=\'iPhone Data Recovery\'}\" onfocus=\"this.select()\"class=\"searchbox\" value=\"iPhone Data Recovery\"\/>";
	a+="<input type=\"submit\" id=\"search_btn\" name=\"search_btn\" value=\"Search\" \/>";
	a+="<\/div>";
	a+="<\/form>";
	a+="<script type=\"text/javascript\" src=\"http://www.google.com/cse/brand?form=cse-search-box&lang=en\"></script>";
	document.getElementById("search").innerHTML=a}catch(e){console.error(e)}
});
//faq section
$(".faq_questions").click(function(){
	$(this).toggleClass("active");
	$(this).parent(".faq_items").siblings(".faq_items").children(".faq_questions").removeClass("active");
	$(this).siblings().removeClass("active");
	$(this).siblings(".faq_answers").slideToggle();
	$(this).parent(".faq_items").siblings(".faq_items").children(".faq_answers").slideUp();
});
(function(){
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if($(window).width()>1024){
        if(!isMac){
            $('a.download.win').show();
			$('a.download.mac').hide();
            $('a.tobuywin,p.tobuywin').show();
			$('a.tobuymac,p.tobuymac').hide();
            $('span.win').css({"diplay":"inline-block"});
            $('span.mac').hide();
            if(!$('a.download.win').length){
				$('a.download.mac').show();
				$('a.tobuywin').hide();
				$('span.mac').css({"diplay":"inline-block"});
            }
        }else{
            $('a.download.mac').show();
            $('a.download.win').hide();
            $('a.tobuymac,p.tobuymac').show();
			$('a.tobuywin,p.tobuywin').hide();
            $('span.mac').css({"diplay":"inline-block"});
            $('span.win').hide();
            if(!$('a.download.mac').length){
				$('a.download.win').show();
				$('a.tobuymac,p.tobuymac').hide();
				$('span.win').css({"diplay":"inline-block"});
            }
		};
		if(system_confirm()=='win'){
            $('a.download.win').show();
			$('a.download.mac').hide();
            $('a.tobuywin').show();
			$('a.tobuymac').hide();
            $('span.win').css({"diplay":"inline-block"});
            $('span.mac').hide();
            if(!$('a.download.win').length){
				$('a.download.mac').show();
				$('a.tobuywin').hide();
				$('span.mac').css({"diplay":"inline-block"});
            }
		}else if(system_confirm()=='mac'){
            $('a.download.mac').show();
            $('a.download.win').hide();
            $('a.tobuymac').show();
			$('a.tobuywin').hide();
            $('span.mac').css({"diplay":"inline-block"});
            $('span.win').hide();
            if(!$('a.download.mac').length){
				$('a.download.win').show();
				$('a.tobuymac').hide();
				$('span.win').css({"diplay":"inline-block"});
            }
		}else{};
    }else{
            $('a.download.win').hide();
            $('a.download.mac').hide();
            $('span.win').hide();
            $('span.mac').hide();
            $('a.tobuymac').hide();
		}
})();
$(document).ready(function(){
	try{$(".slidingDiv").hide();
$(".show_hide").show();
$('.show_hide').click(function(){
$(".slidingDiv").slideToggle();
});}catch(e){console.error(e)}
});

//goTop
$(window).scroll(function() {

	var animeheight=450;
	try{if ($(window).scrollTop() >= animeheight && $(window).width() > 400) {
			$("#goTop").show();
		} else {
			$("#goTop").hide();
		}}catch(e){console.error(e)}
	});
	try{	 $("#goTop").bind("click",function(){
		 var totop=$(document).scrollTop();
		 $("body,html").animate({scrollTop:0}, 'fast');
	 });}catch(e){console.error(e)}

//responsive menu
jQuery(document).ready(function() {
    jQuery('.toggle-nav').click(function(e) {
        jQuery(this).toggleClass('active');
        jQuery('.menu ul').toggleClass('active');
        e.preventDefault();
    });
});

//dropdown menu
$(document).ready(function(){
$('.special').click(function(){
$(".arrow").toggleClass ("arrowtop");
$(".arrow").toggleClass ("arrowdown");
$(".menu_dropDown").slideToggle();
$(".menu_dropDown").show();
});
//new-nav
if($(window).width()<956){
	$(window).scroll(function(){
		try{
            if($(document).scrollTop()>=$('.screen_two').offset().top){
				$('.new_rollTopfone').show();
				$('.new_fixbar .new_rollTopfone_box .icon span').html($('.new_rollTopfone_box #vice-menu li span').eq(0).html());
				$('.new_fixbar .new_rollTopfone_box #vice-menu li span').eq(0).parent().hide();
				if($(".new_rollTopfone_box #vice-menu").css("display")=="block"){$(".nav_bg").show();}else{$(".nav_bg").hide();}
            }else{
				$('.new_rollTopfone').hide();
				$(".nav_bg").hide();
			};
		}
		catch(e){
			console.log(e);
		}
	});
	$(".new_rollTopfone_nav_toggle").click(function(){
		$(".new_rollTopfone_box #vice-menu").slideToggle();
		$(".nav_bg").toggle();
	});
	$(".nav_bg").click(function(){
		$(".new_rollTopfone_box #vice-menu").slideToggle();
		$(".nav_bg").toggle();
	});
}else{
$('.special').click(function(){
	$(".nav_bg").toggle();
});
$(".nav_bg").click(function(){
	$(".arrow").toggleClass ("arrowtop");
	$(".arrow").toggleClass ("arrowdown");
	$(".nav_bg").toggle();
	$(".menu_dropDown").slideToggle();
	$(".menu_dropDown").show();
});
};
});
if($(window).width()<956){
	$('.new_rollTopfone_box.long .new_rollTopfone_nav_toggle a').attr('href','javascript:;');
};
$(window).scroll(function(){
	try{
		if($(document).scrollTop()>=$('.screen_two').offset().top){
			$('.new_fixbar').addClass('active');
		}else{
			$('.new_fixbar').removeClass('active');
			$(".nav_bg").hide();
		};
	}catch(e){

	}
});
$(document).ready(function(){
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"
        ];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    };
	var device_id = IsPC();
	if (device_id == false) {
	  $('.new_rollTopfone_box div .fix-down').css({"display":"none"});
	  $('document').css('cursor','pointer');
	  $(".pc_btn").css('display','none');
    };
});

var a=0;
$('.slideshow-creator-banner-c li').eq(0).addClass('active').fadeIn().siblings().fadeOut().removeClass('active');
$('.slideshow-creator-banner-c li').eq(a).addClass('active').animate({
	top:'-100px'
},3000,function(){
	$(this).next().addClass('active').fadeIn().siblings().fadeOut().removeClass('active');
})
setInterval(function(){
	a++;
	if(a>=$('.slideshow-creator-banner-c li').length){
		a=0;
	}
	if(a<3){
		$('.slideshow-creator-banner-c li').eq(a).addClass('active').animate({
			top:'-100px'
		},3000,function(){
			$(this).next().addClass('active').fadeIn().siblings().fadeOut().removeClass('active').delay(1000).css('top','0');
		})
	}else{
		$('.slideshow-creator-banner-c li').eq(a).addClass('active').animate({
			top:'-100px'
		},3000,function(){
			$('.slideshow-creator-banner-c li').eq(0).addClass('active').fadeIn().siblings().fadeOut().removeClass('active').delay(1000).css('top','0');
		})
	}
},3500)

//propage android
$(document).ready(function(){
$("table.devices").hide();
$('p.check-p').click(function(){
$("table.devices").slideToggle();
});
});

//video-play
$(document).ready(function() {
	try{
		$(".vdemo").fancybox({
			'width'				: 800,
			'height'			: 450,
			'autoScale'			: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'afterClose'        : function(){
				$('#innervideo').attr("src", "");
			}
		});
	}catch(e){console.log(e)}
	try{	$(".vdemo").click(function(){
		var vdLink = $(this).attr("src");
		$('#innervideo').attr("src", vdLink + "?autoplay=1");
	})}catch(e){console.error(e)}
});

//tab
$(document).ready(function(){
	try{	$(".item").tabMultiple({
	tab:"tab",
	tabContent: "tab_cont",
	currentClass:"curr"
	});	 }catch(e){console.log(e)}
});

(function($){
$.fn.tabMultiple=function(settings){
			var st=$.extend({
				tab: "tab",
				tabContent: "tpi-toggle",
				currentClass: "curr"
			},settings);
			var tabBox=$(this);
			tabBox.find("."+st.tabContent+":gt(0)").hide();
			tabBox.find("."+st.tab+" li:eq(0)").addClass(st.currentClass);
			tabBox.find("."+st.tab).children().each(function(n){ $(this).attr("index",n); });
			tabBox.find("."+st.tab).children().click(function(){
				var currIndex=parseInt($(this).attr("index"));
				$(this).addClass(st.currentClass).siblings().removeClass(st.currentClass);
				tabBox.find("."+st.tabContent).eq(currIndex).show().siblings("."+st.tabContent).hide();
				if($('p.left-des-p').html()){$("ul.left-des").find("p.left-des-p").removeClass("active-color");$("ul.left-des").find('p.left-des-p').eq(currIndex).addClass("active-color");}
			});

			return this;
		}
})(jQuery);
//tab choice   the arguments must be the classnames of the tagets
$.fn.extend({
	tabChoice:function(opt){
		var tabcn=opt.tabclassname;
		var taban=opt.tabactivename;
		var tagcn=opt.tagclassname;
		var tagan=opt.tagactivename;
		var upper=opt.upperclass;
		var downer=opt.downerclass;
		var num=-1,timer,flag=true;
		if(!opt.tabotheractivename||!opt.lefterclass||!opt.righterclass||!opt.tabotherclassname){flag=false;}
		else{flag=true}
		if(flag){var lefter=opt.lefterclass,righter=opt.righterclass,tabother=opt.tabotheractivename,tabchosen=opt.tabotherclassname;}
		clearInterval(timer);
		$(this).mouseenter(function(){clearInterval(timer)});
		$(this).mouseleave(function(){autoChange()});
		function autoChange(){
			timer=setInterval(function(){
			num++;
			if (num >=5) {
				num = 0
			  }
			  $('.'+tabcn).eq(num).addClass(taban).siblings('.'+tabcn).removeClass(
				taban);
			  $('.'+tagcn).eq(num).addClass(tagan).siblings('.'+tagcn).removeClass(
				tagan);
				if(flag){
					$('.'+tabchosen).eq(num).addClass(tabother).siblings('.'+tabchosen).removeClass(tabother);
				}
		},3000)
		}
		$('.'+tabcn).click(function(){
			clearInterval(timer);
			$(this).addClass(taban).siblings('.'+tabcn).removeClass(taban);
			$('.'+tagcn).eq($(this).index('.'+tabcn)).addClass(tagan).siblings('.'+tagcn).removeClass(tagan);
		});
		$('.'+upper).click(function () {
			clearInterval(timer);
			num -= 1;
			if (num <= -1) {
			  num = 4
			}
			$('.'+tabcn).eq(num).addClass(taban).siblings('.'+tabcn).removeClass(
			  taban);
			$('.'+tagcn).eq(num).addClass(tagan).siblings('.'+tagcn).removeClass(
			  tagan);
		});
		$('.'+downer).click(function () {
			clearInterval(timer);
			num += 1;
			if (num >= 5) {
			num = 0
			}
			$('.'+tabcn).eq(num).addClass(taban).siblings('.'+tabcn).removeClass(
			taban);
			$('.'+tagcn).eq(num).addClass(tagan).siblings('.'+tagcn).removeClass(
			tagan);
		});
		if(flag){}
		$('.'+righter).click(function () {
			clearInterval(timer);
			num += 1;
			if (num >= 5) {
			num = 0
			}
			$('.'+tabchosen).eq(num).addClass(tabother).siblings('.'+tabchosen).removeClass(
				tabother);
			$('.'+tabcn).eq(num).addClass(taban).siblings('.'+tabcn).removeClass(
				taban);
			$('.'+tagcn).eq(num).addClass(tagan).siblings('.'+tagcn).removeClass(
			tagan);
		});
		$('.'+lefter).click(function () {
			clearInterval(timer);
			num -= 1;
			if (num <= -1) {
			  num = 4
			}
			$('.'+tabcn).eq(num).addClass(taban).siblings('.'+tabcn).removeClass(
			  taban);
			$('.'+tagcn).eq(num).addClass(tagan).siblings('.'+tagcn).removeClass(
			  tagan);
			$('.'+tabchosen).eq(num).addClass(tabother).siblings('.'+tabchosen).removeClass(tabother);
		});
		return this
	}
})
//top bar fix
$(window).scroll(function () {
	var navbg=$(".fixbar");//获取导航栏对象
	if ($(window).scrollTop()>=$('.screen_two,.help-page').offset().top) {

		$(".rollTopfone").show();
			navbg.addClass("fixtop")
		}else{
		navbg.removeClass("fixtop")//去掉导航栏添加的样式
		$(".rollTopfone").hide();
	}
});

// ads
$(document).ready(
$(".top-ad").html("<a class=\"ad\" href=\"\/special/offer/\"><\/a><img src=\"\/style/images/close-button.png\" onclick=\"$('.top-ad').hide();\" \/>")
)

$(document).ready(function(){
	$(".btn-box").click(
			function(){
			$("#btn").toggleClass("clicked");
			$("#winversion,#macversion,#winversion-top,#macversion-top").toggle();
			$('.win_box').toggle();
			$('.mac_box').toggle();
			$('.price_win').toggleClass("active");
			$('.price_mac').toggleClass("active");
		});
});
// new system distinguish
if(system_confirm()=='mac'){
	$("#winversion-top,#winversion").hide();
	$('.mac_box').css('display','flex');
	$('.win_box').css('display','none');
	$("#macversion-top, #macversion").css("display","block");
	$("#macversion").show();
	$("#btn").addClass("clicked");
	$(".price_win").addClass("active");
	$(".price_mac").removeClass("active");
	$("#banner .free_sup_ver_win").css("display","none");
	$("#banner .free_sup_ver_mac").css("display","block");
	$('.tobuymac').css("display","block");
	$('.tobuywin').css("display","none");
	try{
		$('.distinguish span').html('Go to Windows');
	}catch(e){
		console.log(e);
	}
	try{
		$('.banner_sr .tab .mac_i').addClass('active').siblings().removeClass('active');
		$('.banner .tab .mac_i').addClass('active').siblings().removeClass('active');
	}catch(e){
		console.log(e);
	}
	try{
		$('.systemTab span.mac').addClass('active').siblings().removeClass('active');
	}catch(e){
		console.log(e);
	}
}else if(system_confirm()=='win'){
	$("#macversion-top,#macversion").hide();
	$("#winversion-top, #winversion").css("display","block");
	$("#winversion").show();
	$('.win_box').css('display','flex');
	$('.mac_box').css('display','none');
	$(".price_mac").addClass("active");
	$(".price_win").removeClass("active");
	$("#banner .free_sup_ver_win").css("display","block");
	$("#banner .free_sup_ver_mac").css("display","none");
	$('.tobuywin').css("display","block");
	$('.tobuymac').css("display","none");
	try{
		$('.distinguish span').html('Go to Mac');
	}catch(e){
		console.log(e);
	}
	try{
		$('.banner_sr .tab .win_i').addClass('active').siblings().removeClass('active');
		$('.banner .tab .win_i').addClass('active').siblings().removeClass('active');
	}catch(e){
		console.log(e);
	}
	try{
		$('.systemTab span.win').addClass('active').siblings().removeClass('active');
	}catch(e){
		console.log(e);
	}
}else{
	$("#macversion-top,#macversion").hide();
	$("#winversion-top, #winversion").css("display","block");
	$("#winversion").show();
	$('.win_box').css('display','flex');
	$('.mac_box').css('display','none');
	$(".price_mac").addClass("active");
	$(".price_win").removeClass("active");
	$('.distinguish').hide();
};
$('.distinguish').click(function(){
	if($(this).find('span').html()=='Go to Mac'){
		$("#winversion-top,#winversion").hide();
		$('.mac_box').css('display','flex');
		$('.win_box').css('display','none');
		$("#macversion-top, #macversion").css("display","block");
		$("#macversion").show();
		$("#btn").addClass("clicked");
		$(".price_win").addClass("active");
		$(".price_mac").removeClass("active");
		$('a.download.mac').show();
		$('a.download.win').hide();
		$('a.tobuymac').show();
		$('a.tobuywin').hide();
		$('span.mac').show();
		$('span.win').hide();
		if(!$('a.download.mac').length){
			$('a.download.win').show();
			$('a.tobuymac').hide();
			$('span.win').show();
		}
		$(this).find('span').html("Go to Windows")
	}else{
		$("#macversion-top,#macversion").hide();
		$("#winversion-top, #winversion").css("display","block");
		$("#winversion").show();
		$('.win_box').css('display','flex');
		$('.mac_box').css('display','none');
		$(".price_mac").addClass("active");
		$(".price_win").removeClass("active");
		$('a.download.win').show();
		$('a.download.mac').hide();
		$('a.tobuywin').show();
		$('a.tobuymac').hide();
		$('span.win').show();
		$('span.mac').hide();
		if(!$('a.download.win').length){
			$('a.download.mac').show();
			$('a.tobuywin').hide();
			$('span.mac').css({"diplay":"inline-block"});
		}
		$(this).find('span').html("Go to Mac")
	}
})
$('.systemTab span').click(function(){
	$(this).addClass('active').siblings().removeClass('active');
	if($(this).attr('class').indexOf('mac')>-1){
		$("#winversion-top,#winversion").hide();
		$('.mac_box').css('display','flex');
		$('.win_box').css('display','none');
		$("#macversion-top, #macversion").css("display","block");
		$("#macversion").show();
		$("#btn").addClass("clicked");
		$(".price_win").addClass("active");
		$(".price_mac").removeClass("active");
		$('a.download.mac').show();
		$('a.download.win').hide();
		$('a.tobuymac').show();
		$('a.tobuywin').hide();
		$('span.mac').show();
		$('span.win').hide();
		if(!$('a.download.mac').length){
			$('a.download.win').show();
			$('a.tobuymac').hide();
			$('span.win').show();
		}
	}else{
		$("#macversion-top,#macversion").hide();
		$("#winversion-top, #winversion").css("display","block");
		$("#winversion").show();
		$('.win_box').css('display','flex');
		$('.mac_box').css('display','none');
		$(".price_mac").addClass("active");
		$(".price_win").removeClass("active");
		$('a.download.win').show();
		$('a.download.mac').hide();
		$('a.tobuywin').show();
		$('a.tobuymac').hide();
		$('span.win').show();
		$('span.mac').hide();
		if(!$('a.download.win').length){
			$('a.download.mac').show();
			$('a.tobuywin').hide();
			$('span.mac').css({"diplay":"inline-block"});
		}
	}
})
$('.banner div.tab span').click(function(){
	$(this).addClass('active').siblings().removeClass('active');
	if($(this).attr('class').indexOf('mac')>-1){
	  $("#winversion-top,#winversion").hide();
	  $('.mac_box').css('display','flex');
	  $('.win_box').css('display','none');
	  $("#macversion-top, #macversion").css("display","block");
	  $("#macversion-inline").css("display","inline-block");
	  $("#winversion-inline").hide();
	  $("#macversion").show();
	  $("#btn").addClass("clicked");
	  $(".price_win").addClass("active");
	  $(".price_mac").removeClass("active");
	  $('a.download.mac').show();
	  $('a.download.win').hide();
	  $('a.tobuymac').show();
	  $('a.tobuywin').hide();
	  $('span.mac').show();
	  $('span.win').hide();
	  if(!$('a.download.mac').length){
		$('a.download.win').show();
		$('a.tobuymac').hide();
		$('span.win').show();
	  }
	  $(this).find('span').html("Go to Windows")
	}else{
	  $("#winversion-inline").css("display","inline-block");
	  $("#macversion-inline").hide();
	  $("#macversion-top,#macversion").hide();
	  $("#winversion-top, #winversion").css("display","block");
	  $("#winversion").show();
	  $('.win_box').css('display','flex');
	  $('.mac_box').css('display','none');
	  $(".price_mac").addClass("active");
	  $(".price_win").removeClass("active");
	  $('a.download.win').show();
	  $('a.download.mac').hide();
	  $('a.tobuywin').show();
	  $('a.tobuymac').hide();
	  $('span.win').show();
	  $('span.mac').hide();
	  if(!$('a.download.win').length){
		$('a.download.mac').show();
		$('a.tobuywin').hide();
		$('span.mac').css({"diplay":"inline-block"});
	  }
	  $(this).find('span').html("Go to Mac")
	}
  });
//addthis
$(document).ready(function(){
	for(var i=0;i<$('script').length;i++){
	  var src=String($('script').eq(i).attr('src')).indexOf('addthis');
	  if(src>0){
		  return false;
	  }
	}
	$('body').append('<div id="share-list"><ul><li class="fb"><img src="/images/fb.svg" loading="lazy" alt="Facebook"></li><li class="tw"><img src="/images/tw.svg" loading="lazy" alt="twitter"></li><li class="reddit"><img src="/images/reddit.svg" loading="lazy" alt="Reddit"></li><li class="ln"><img src="/images/ln.svg" loading="lazy" alt="Linkedin"></li><li class="gmail"><img src="/images/gmail.svg" loading="lazy" alt="gmail"> </li><li class="whatsapp"><img src="/images/whatsapp.svg" loading="lazy" alt="whatsapp"></li></ul></div>');
    var nowh=window.location.href;
    var head=$($("h1")[0]).html().replace('%','%25');
    $("#share-list li.fb").click(function(){window.open("https://www.facebook.com/sharer.php?u="+nowh)});
    $("#share-list li.tw").click(function(){window.open("https://twitter.com/intent/tweet?text="+head+" "+nowh)});
    $("#share-list li.ln").click(function(){window.open("https://www.linkedin.com/shareArticle?mini=true&url="+nowh+"&title="+document.title)});
    $("#share-list li.gmail").click(function(){window.open("https://mail.google.com/mail/u/0/?view=cm&fs=1&to&su="+document.title.replace('%','%25')+"&body="+nowh+"&ui=2&tf=1")});
    $("#share-list li.reddit").click(function(){window.open("https://www.reddit.com/submit?url="+nowh+"&title="+document.title)});
    $("#share-list li.whatsapp").click(function(){window.open("https://api.whatsapp.com/send?text="+document.title+"%20"+nowh)});
});
// youtube
$('.youtube-video-play').click(function(){
	if($(this).parent().attr('data-video').indexOf('?')>-1){
		$('body').append('<div class="youtube-video-mask"><div><iframe src="'+$(this).parent().attr('data-video')+'&autoplay=1" frameborder="0" allowfullscreen></iframe><i></i></div></div>');
	}else{
		$('body').append('<div class="youtube-video-mask"><div><iframe src="'+$(this).parent().attr('data-video')+'?autoplay=1" frameborder="0" allowfullscreen></iframe><i></i></div></div>');
	}
	$('.youtube-video-mask div').animate({
		'height':450
	},500);
});
$('body').on('click','.youtube-video-mask i',function(){
	$(this).parents('.youtube-video-mask').remove();
});
// guide media screen
(function(){
	var uRl = window.location.href;
	if(uRl.indexOf("tutorial\.html")>-1){
		$("div.distance-top").addClass("distance-between");
		$("div.tutorail").addClass("distance-between");
	}
})();

// header
$(document).ready(function() {
	try{	
		if($("body").device_confirm()==false){$('#header .toggle-right').hover(function(){
            $(this).css('backgroundColor','#fff');
        });	}
	}catch(e){console.log(e)}
});
$('.toggle-right').click(function(){
	$('#header .container-max>ul').toggle();
	$('#box_left_article').hide()
	if($(window).width()<1200){
		$('#header').toggleClass('active');
	}
	if($('#header .container-max>ul').attr('style')=="display: none;"){
		$('.header_bg').hide();
	}else{
		$('.header_bg').show();
	}
});
$('.toggle-left').click(function(){
	$('#box_left_article').toggle()
	$('#aside-right').toggle();
	$('#header .container-max>ul').hide();
	if($('#box_left_article').attr('style')=="display: none;"){
		$('.header_bg').hide();
	}else{
		$('.header_bg').show();
	}
	if($('#aside-right').html()){
		if($('#aside-right').attr('style')=="display: none;"){
			$('.header_bg').hide();
		}else{
			$('.header_bg').show();
		}
	}
});
$('.header_bg').click(function(){
	$(this).hide();
	$('#box_left_article').hide()
	$('#header .container-max>ul').hide();
	$('#aside-right').hide();
	$('#header').removeClass('active');
});
//判断屏幕宽度
try{
	$('#breadcrumb .container, #article-main').css({
		marginLeft:$('#header .container-max').offset().left
	})
}catch(e){
	console.log(e);
}
$(window).resize(function () { 
	try{
		$('#breadcrumb .container, #article-main').css({
			marginLeft:$('#header .container-max').offset().left
		})
	}catch(e){
		console.log(e);
	}
	if($(window).width()<1180){
		$('#header .slidingDiv #search-container input#search_btn').val('');
	}else{
		$('#header .slidingDiv #search-container input#search_btn').val('Search');
	}
});
if($(window).width()<1180){
	$('#header .slidingDiv #search-container input#search_btn').val('');
}
$('#header .slidedown-items p').click(function(e){
	e.stopPropagation();
	$(this).parent().toggleClass('active').siblings().removeClass('active')
})
$('#header .slidingDiv').click(function(e){
	e.stopPropagation();
});
if($('.toggle-nav').html()){
	$('.toggle-left').show();
}else if($('.aside-right-top').html()){
	$('.toggle-left').show();
}
else{
	$('.toggle-left').hide();
}
$('body').click(function(){
	if($(window).width()<1180){
		$('#header .container-max>ul').hide();
		$('#box_left_article').hide();
		$('#aside-right').hide();
	}
})
$(window).resize(function(){
	if($(window).width()>1180){
		$('#header .container-max >ul').show();
	}
});
$('#header').click(function(e){
	e.stopPropagation();
});