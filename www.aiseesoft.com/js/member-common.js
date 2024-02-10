// 判断测试站还是正式站
var post_url;
var accountHref;
if(location.hostname=='www.aiseesoft.com' || 
location.hostname=='www.aiseesoft.fr' || 
location.hostname=='www.aiseesoft.de' || 
location.hostname=='www.aiseesoft.jp' || 
location.hostname=='zh-cn.aiseesoft.com' || 
location.hostname=='zh-tw.aiseesoft.com' || 
location.hostname=='cs.aiseesoft.com' || 
location.hostname=='da.aiseesoft.com' || 
location.hostname=='nl.aiseesoft.com' || 
location.hostname=='fi.aiseesoft.com' || 
location.hostname=='el.aiseesoft.com' || 
location.hostname=='it.aiseesoft.com' || 
location.hostname=='no.aiseesoft.com' || 
location.hostname=='pl.aiseesoft.com' || 
location.hostname=='pt.aiseesoft.com' || 
location.hostname=='ru.aiseesoft.com' || 
location.hostname=='es.aiseesoft.com' || 
location.hostname=='sv.aiseesoft.com' || 
location.hostname=='hu.aiseesoft.com' || 
location.hostname=='ko.aiseesoft.com' || 
location.hostname=='tr.aiseesoft.com'
){
    post_url="https://account.api.aiseesoft.com/v9/";
    accountHref="https://account.aiseesoft.com/";
}else{
    post_url="https://sandbox.account.api.aiseesoft.com/v9/";
    accountHref="https://sandboxaccount.aiseesoft.com/";
}
//判断页面显示什么语言
var langArr=["zh-cn.aiseesoft","zh-tw.aiseesoft","cs.aiseesoft","da.aiseesoft","nl.aiseesoft","fi.aiseesoft",".fr",".de","el.aiseesoft","it.aiseesoft",".jp","no.aiseesoft","pl.aiseesoft","pt.aiseesoft","ru.aiseesoft","es.aiseesoft","sv.aiseesoft","hu.aiseesoft","tr.aiseesoft","ko.aiseesoft"];
var lang='en';
for(var i=0;i<langArr.length;i++){
    if(location.href.indexOf(langArr[i])>-1){
        if(langArr[i]=='.fr' || langArr[i]=='.de'){
            lang=langArr[i].split('.')[1];
        }else if(langArr[i]=='.jp'){
            lang='ja'
        }else{
            lang=langArr[i].split('.')[0];
        }
        break;
    }else{
        lang='en';
    }
};
setCookie('lang',lang)
//获取浏览器唯一码
var murmur=1;
// 引入多语言文件和获取浏览器唯一性标签文件
$.getScript("https://www.aiseesoft.com/js/unique.js",function(){
    const fpPromise = FingerprintJS.load()
    fpPromise
        .then(fp => fp.get())
        .then(result => {
            murmur = result.visitorId
            try{
                murmurAfter()
            }catch(error){
                console.log(error)
            }
        })
$.getScript(accountHref+"js/i18n.js",function(){
// 判断是否有为google登陆跳过来的
if(getCookie('google_key')){
    $.ajaxSettings.async = false;
    function MemberOauthInfo(){
        $.post(
            post_url+'account/google/oauth/info',
            {
                e_id:murmur,
                key:getCookie('google_key')
            },
            function(data){
                console.log(data);
                error_fn(data.error);
                setCookie('google_key',"",-1);
                switch(data.error){
                    case 0:
                        setCookie('user_google',JSON.stringify({'google_id_token':data.id_token}),90);
                        google_login()
                        break;
                    case 26701:
                        error(i18n[lang].error_26701);
                        break;
                    case 26702:
                        error(i18n[lang].error_26702);
                        break;
                    case 26703:
                        error(i18n[lang].error_26703);
                        break;
                    case 26704:
                        error(i18n[lang].error_26704);
                        break;
                    case 26705:
                        MemberOauthInfo();
                        break;
                }
            }
        ).error(function(xhr){
            overtime(26799);
        });
    }
    MemberOauthInfo();
    $.ajaxSettings.async = true;
}

// 判断是否已登录
if(user){
    user=JSON.parse(getCookie('user'))
    userProfile();
}else{
    $('.login_btn>a').show();
    $('.login_box').hide();
}

});
})
//google登录接口函数
function google_login(callback,registerCallback,mergeCallback){
    $.post(
        post_url+'account/google/login',
        {
            e_id:murmur,
            id_token:JSON.parse(getCookie('user_google')).google_id_token
        },
        function(data){
            console.log(data);
            error_fn(data.error);
            switch(data.error){
                case 0:
                    setCookie('user',JSON.stringify({'e_id':murmur,'t_id':data.t_id,'token':data.token}),90);
                    break;
                case 21601:
                    error(i18n[lang].error_21601);
                    break;
                case 21602:
                    error(i18n[lang].error_21602);
                    break;
                case 21603:
                    error(i18n[lang].error_21603);
                    break;
                case 21604:
                    error(i18n[lang].error_21604);
                    break;
                case 21605:
                    // 不提示，自动去创建账号并登录
                    if(registerCallback){
                        registerCallback()
                        return false;
                    }
                    third_party_registered_fn(0);
                    break;
                case 21606:
                    error(i18n[lang].error_21606);
                    break;
                case 21607:
                    // 不提示，不去注册，跳转是否合并邮箱页面
                    if(mergeCallback){
                        mergeCallback()
                        return false;
                    }
                    location.href=accountHref+"3rd-login-merge-account";
                    break;
                case 21608:
                    //自动帮忙注册一个账号
                    if(registerCallback){
                        registerCallback()
                        return false;
                    }
                    third_party_registered_fn(0);
                    break;
                case 21609:
                    // 不提示，不去注册，跳转是否合并邮箱页面
                    if(mergeCallback){
                        mergeCallback()
                        return false;
                    }
                    location.href=accountHref+"3rd-login-merge-account";
                    break;
                case 21610:
                    // 不提示，自动去注册一个3方账号并登录；创建成功后选择绑定，自动填充获得的Google 邮箱，同21608
                    if(registerCallback&&mergeCallback){
                        registerCallback()
                        mergeCallback()
                        return false;
                    }
                    third_party_registered_fn(0);
                    location.href=accountHref+"3rd-login-merge-account";
                    break;
                case 21611:
                    error(i18n[lang].error_21611);
                    break;
            }
        }
    ).error(function(xhr){
        overtime(21699);
    })
};
// google账号注册
function third_party_registered_fn(operation,callback,callbackGoogle){
    if(!isnetwork()){return false;};
    let data={
        e_id:murmur,
        id_token:JSON.parse(getCookie('user_google')).google_id_token
    };
    console.log(operation);
    switch(operation){
        case 0:
            data={
                e_id:murmur,
                id_token:JSON.parse(getCookie('user_google')).google_id_token
            }
            break;
        case 21607:
            data={
                e_id:murmur,
                id_token:JSON.parse(getCookie('user_google')).google_id_token,
                connect:1
            }
            break;
        case 21608:
            break;
        case 21609:
            break;
        case 21610:
            break;
    }
    $.post(
        post_url+'account/google/register',data,
        function(data){
            console.log(data);
            error_fn(data.error);
            switch(data.error){
                case 0:
                    setCookie('user',JSON.stringify({'e_id':murmur,'t_id':data.t_id,'token':data.token}),90);
                    if(operation==21607){
                        if(callback){
                            callback();
                            return false;
                        }
                    }else{
                        if(callback){
                            callback();
                            return false;
                        }
                    }
                    break;
                case 21801:
                    error(i18n[lang].error_21801);
                    break;
                case 21802:
                    error(i18n[lang].error_21802);
                    break;
                case 21803:
                    error(i18n[lang].error_21803);
                    break;
                case 21804:
                    error(i18n[lang].error_21804);
                    break;
                case 21805:
                    if(callbackGoogle){
                        callbackGoogle()
                        return false;
                    }
                    google_login()
                    break;
                    // 不提示，重新三方登录到新的账号上
                case 21806:
                    error(i18n[lang].error_21806);
                    break;
                case 21807:
                    error(i18n[lang].error_21807);
                    break;
                case 21808:
                    error(i18n[lang].error_21808);
                    break;
                case 21809:
                    error(i18n[lang].error_21809);
                    break;
                case 21810:
                    error(i18n[lang].error_21810);
                    break;
                case 21811:
                    error(i18n[lang].error_21811);
                    break;
                case 21812:
                    error(i18n[lang].error_21812);
                    break;
                case 21813:
                    error(i18n[lang].error_21813);
                    break;
                case 21814:
                    error(i18n[lang].error_21814);
                    break;
                case 21815:
                    error(i18n[lang].error_21815);
                    break;
                case 21816:
                    error(i18n[lang].error_21816);
                    break;
                case 21817:
                    error(i18n[lang].error_21817);
                    break;
                case 21818:
                    error(i18n[lang].error_21818);
                    break;
                case 21819:
                    error(i18n[lang].error_21819);
                    break;
                case 21820:
                    error(i18n[lang].error_21820);
                    break;
                case 21821:
                    error(i18n[lang].error_21821);
                    break;
                case 21822:
                    error(i18n[lang].error_21822);
                    break;
                case 21823:
                    error(i18n[lang].error_21823);
                    break;
                case 21824:
                    error(i18n[lang].error_21824);
                    break;
                case 21825:
                    error(i18n[lang].error_21825);
                    break;
                case 21826:
                    error(i18n[lang].error_21826);
                    break;
            }
        }
    ).error(function(xhr){
        overtime(21899);
    })
}
// 判断是否有网
function isnetwork(){
    if(!navigator.onLine){
        error(i18n[lang].isnetwork);
        return false;
    }else{
        return true;
    }
};

var HtmlUtil = {
    /*1.用浏览器内部转换器实现html转码*/
    htmlEncode:function (html){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement ("div");
        //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
        (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
        //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
        var output = temp.innerHTML;
           temp = null;
           return output;
    },
    /*2.用浏览器内部转换器实现html解码*/
    htmlDecode:function (text){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement("div");
        //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
        temp.innerHTML = text;
        //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    }
};
//失败
function error(txet){
    $('body').append('<div class="error"><img src="https://account.aiseesoft.com/images/error-2.svg" alt="Error">'+txet+'</div>');
    setTimeout(function(){
        $('body>.error').fadeOut();
    },5000);
}
$(document).click(function(){
    $('body>.success').fadeOut();
    $('body>.error').fadeOut();
});
// 超时错误
function overtime(num){
    error(i18n[lang].overtime_1+num+i18n[lang].overtime_2);
};
function error_fn(id){
    switch(id){
        case 20001:
            error(i18n[lang].error_20001);
            $('.login_btn>a').show();
            $('.login_box').hide();
            setCookie("user","",-1)
            user=null
            return false;
            break;
        case 20002:
            error(i18n[lang].error_20002);
            $('.login_btn>a').show();
            $('.login_box').hide();
            setCookie("user","",-1)
            user=null
            return false;
            break;
        case 20003:
            error(i18n[lang].error_20003);
            $('.login_btn>a').show();
            $('.login_box').hide();
            setCookie("user","",-1)
            user=null
            return false;
            break;
        case 20004:
            error(i18n[lang].error_20004);
            return false;
            break;
        case 20005:
            $('.login_btn>a').show();
            $('.login_box').hide();
            setCookie("user","",-1)
            user=null
            return false;
            break;
        case 20006:
            error(i18n[lang].error_20006);
            return false;
            break;
        case 20007:
            error(i18n[lang].error_20007);
            $('.login_btn>a').show();
            $('.login_box').hide();
            setCookie("user","",-1)
            user=null
            return false;
            break;
        case 20008:
            error(i18n[lang].error_20008);
            $('.login_btn>a').show();
            $('.login_box').hide();
            setCookie("user","",-1)
            user=null
            return false;
            break;
        case 20009:
            error(i18n[lang].error_20009);
            $('.login_btn>a').show();
            $('.login_box').hide();
            setCookie("user","",-1)
            user=null
            return false;
            break;
    }
    return true;
}
function setCookie(name,value,iDay){      //name相当于键，value相当于值，iDay为要设置的过期时间（天）
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + value + ';path=/;domain=.aiseesoft.com;expires=' + oDate;
    // document.cookie = name + '=' + value + ';path=/;expires=' + oDate;
}


//获取cookie
function getCookie(name) {
    var prefix = name + "="
    var start = document.cookie.indexOf(prefix)
 
    if (start == -1) {
        return null;
    }
 
    var end = document.cookie.indexOf(";", start + prefix.length)
    if (end == -1) {
        end = document.cookie.length;
    }
 
    var value = document.cookie.substring(start + prefix.length, end)
    return unescape(value);
}
//宽度小于1200
$(window).resize(function(){
    $('#header .login_btn .login_box').unbind('hover');
    $('#header .login_box').unbind('click');
    if($(window).width()>1200){
        $('#header .login_btn .login_box').hover(function(){
            $('#header .login_btn .login_box ul').show();
        },function(){
            $('#header .login_btn .login_box ul').hide();
        });
    }else{
        $('#header .login_box ul').width($(window).width());
        $('#header .login_box').click(function(e){
            e.stopPropagation();
            if($('#header .login_box ul').css("display")=='none'){
                    $('#header .login_box ul').show();
            }else{
                $('#header .login_box ul').hide();
            }
            $('.menu #menu').addClass('active')
        });
    }
});
try{
    $('a.toggle-nav').click(function(e){
        e.stopPropagation()
        $('#header .login_box ul').hide();
    })
}catch(e){
    console.log(e)
};
$(window).resize();
$('.login_btn>a').attr('href',accountHref+'login?source='+location.href);

var user=getCookie('user')
var personal;
function userProfile(callback,fail){
    $.post(
        post_url+'account/profile',
        {
            e_id:user.e_id,
            t_id:user.t_id,
            token:user.token
        },
        function(data){
            personal=data;
            error_fn(data.error)
            switch(data.error){
                case 0:
                    $('.login_btn>a').hide();
                    $('.login_box').show();
                    if(data.picture){
                        $('.login_box ul li div img').attr('src',data.picture);
                        $('.login_box>div img').attr('src',data.picture);
                    }
                    
                    if(data.nickname){
                        $('.login_box ul li').eq(0).find('.name').html(HtmlUtil.htmlEncode(data.nickname));
                    }else{
                        if(data.email){
                            try{
                                var nickname=data.email.split('@')[0];
                            }catch(e){
                                console.log(e);
                            }
                            $('.login_box ul li').eq(0).find('.name').html(HtmlUtil.htmlEncode(nickname));
                        }else{
                            $('.login_box ul li').eq(0).find('.name').html(data['3rdparty'][0]['name']);
                        }
                    }
                    if(!data.email_verified){
                        $('.login_box ul li .verification').show();
                    }else{
                        $('.login_box ul li .verification').hide();
                    }
                    if(callback){
                        callback();
                    }
                    break;
                case 20901:
                    error(i18n[lang].error_20901);
                    if(fail){
                        fail();
                    }
                    break;
                case 20902:
                    error(i18n[lang].error_20902);
                    if(fail){
                        fail();
                    }
                    break;
            };
        }
    )
}
//退出登录
$('#header .login_box .logout').click(function(e){
    e.stopPropagation();
    logOutFn();
});
function logOutFn(callback){
    $('.login_btn>a').show();
    $('.login_box').hide();
    setCookie("user","",-1)
    user="";
    if(callback){
        callback()
    }
    $.post(
        post_url+'account/logout',
        {
            e_id:user.e_id,
            t_id:user.t_id,
            token:user.token
        },
        function(data){
            console.log(data);
        }
    )
}
// 点击登录
$('#header .login_btn>a').click(function(){
    user=getCookie('user')
    if(user){
        user=JSON.parse(getCookie('user'))
        userProfile();
        return false;
    }
});
// 邮箱验证点击
$('body').on('click','.verification',function(){
    var that=$(this);
    that.addClass('unbind');
    $.post(
        post_url+"account/authcode/email/verify",
        {
            e_id:user.e_id,
            t_id:user.t_id,
            token:user.token,
            language:lang.toLowerCase()
        },function(data){
            that.removeClass('unbind');
            error_fn(data.error);
            console.log(data);
            switch(data.error){
                case 0:
                    location.href=accountHref+"email-verification?email="+personal.email;
                    break;
                case 26401:
                    error(i18n[lang].error_26401);
                    break;
                case 26402:
                    $('#header .login_box ul li').eq(0).find('p').find('.verification').hide();
                    break;
                case 26403:
                    error(i18n[lang].error_26403);
                    break;
                case 26404:
                    error(i18n[lang].error_26404);
                    break;
            }
        }
    ).error(function(xhr){
        overtime(26499);
    });
});