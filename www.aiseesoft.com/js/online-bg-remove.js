const IMAGE_MAX_SIZE = 1024 * 1024 * 50
const IMAGE_MAX_LENGHT = 4096
const IMAGE_FREE_MAX_LENGHT = 500
const IMAGE_ALLOW_TYPE = ['jpg', 'jpeg', 'png', 'bmp']
const OVER_SIZE_MESSAGE = aiss.i18n.tr('over_size_message')
const FILE_TYPE_ERROR = aiss.i18n.tr('file_type_error')
const IMAGE_TYPE_ERROR = aiss.i18n.tr('image_type_error')
const UPLOAD_ERROR = aiss.i18n.tr('upload_error')
const NETWORK_ERROR = aiss.i18n.tr('network_error')
const RECOGNITION_ERROR = aiss.i18n.tr('recognition_error')
const IMAGE_COMPRESS_FAIL = aiss.i18n.tr('image_compress_fail')
const IMAGE_TRANSFER_FAIL = aiss.i18n.tr('image_transfer_fail')
const IMAGE_SIZE = aiss.i18n.tr('image_size')
const NO_CREDITS = aiss.i18n.tr('no_credits')
const IMAGE_LOADING_FAILED = aiss.i18n.tr('image_Loading_Failed')
const IMAGE_PROCESSING_FAILED = aiss.i18n.tr('image_Processing_Failed')
const IMAGE_DOWNLOAD_FAILED = aiss.i18n.tr('image_Download_Failed')
const IMAGE_TYPE_ERROR_1 = aiss.i18n.tr('bgremove_pop_restrictedPopup')
const TIME_ERROR = aiss.i18n.tr('time_error')
const MAX_TIME_OUT = 40
var timer,filename,originImg,uploadFile,newWindow;
var s3url = "https://photo.istorage-cloud.com/";
var isdown = false;

$('.banner_v1 .right .upload_after .down_box>p a').attr('href',accountHref+'login?source='+location.href);
$('.banner_v1 .right.right_box').css("marginTop",$('.banner_v1 .right.float_content').height())

if(user){
	$('.banner_v1 .right .upload_after .down_box>p').hide()
}

$('.banner_v1 .right .upload_before .these img').click(function(){
    var img=new Image();
    img.src=$(this).attr('src').replace('-s','')
    img.onload=function(){
        $('.banner_v1 .left .after .img_box').append(img)
        uploadFile=blobToFile(base64toBlob(getBase64Image(img)))
        filename=$(this).attr('src').replace('-s','').split('/')[$(this).attr('src').replace('-s','').split('/').length-1]
		uploadFile.name = filename
		$('.banner_v1 .right .rated').removeClass('active')
		if(!uploader) {
			// 点击上传按钮后对应的状态发生变换
			starHand();
			// 网络异常处理逻辑
			uploaderInited = false;
			$('.banner_v1 .left .after').show().siblings().hide()
			$('.banner_v1 .left .after .img_box').append(img)
			$('.banner_v1 .left .after .img_box .load').addClass('active')
			$('.banner_v1 .left .after .img_box .load div span').hide()
			$.getScript(accountHref+"js/unique.js",function(){
				// 必须前置获取指纹
				const fpPromise = FingerprintJS.load();
				fpPromise.then(fp => fp.get()).then(() => {
					murmurAfter();
					var timeers = setInterval(() => {
							if(uploaderInited==true){
								uploader.upload(uploadFile)
								clearInterval(timeers)
							}
						}, 500);
				})
			})
		} else {
			uploader.upload(uploadFile)
			$(this).val('')
		}
    }
})
$('.banner_v1 .left .after .img_box').contextmenu(function(){
    return false;
})
// 点数下载文件
$('.banner_v1 .right .upload_after .credit_down').click(function(){
    // var a = document.createElement('a')
    // var canvas = document.createElement('canvas')
    // var ctx = canvas.getContext('2d')
    // canvas.width = originImg.width
    // canvas.height = originImg.height
    // ctx.drawImage(originImg,0,0,originImg.width,originImg.height)
    // a.href=canvas.toDataURL("image/png")

    // let arr = filename.split('.')
    // let realName = filename.replace('.'+arr[arr.length-1], '')
    // a.download=realName + '.png'
    // a.click()
	// if(isdown){
		if(localStorage.getItem('iscredits')=="true"){
		}else{
			newWindow = window.open('about:blank','');//, 'width=1000,height=850,scrollbars=yes,resizable=1'
		}
		downloadImage();
		// .then(function(e){
		// 	if(e==false){
		// 		console.log(1)
		// 	}else{
		// 		event.preventDefault(); 
		// 		console.log(2)
		// 		return false;
		// 	}
		// });
		// console.log(is)
		
	// }
})
var uploader 
var options
var render_stime,val,download_time,width,height;
var uploaderInited = false
let isSandbox;
var appId;
if (window.location.hostname.includes('sandbox')) {
    isSandbox = true
		appId = 99;
} else {
	  appId = 2;
    isSandbox = false
}
function murmurAfter(){
	options = {
		appId:appId,
		deviceId: murmur,
		s3url:s3url,
		sandbox:isSandbox,
		/**
		 * Initializes the function.
		 * @description 控制延迟才能访问的 dom 状态比如上次按钮先隐藏，后显示，如果网页加载过快可忽略
		 * @author yuanqing@aokoshare.com
		 * @date 2023-08-30 14:50
		 */
		oninit(e){
			if(e.status){
				uploaderInited = true;
			}
		},
		onUploadStart: () => {
			isdown = false;
			filename=uploadFile.name
			let url = window.URL || window.webkitURL;
			var img=new Image();
			img.src=url.createObjectURL(uploadFile);
			img.onload=function(){
				$('.banner_v1 .left .after .img_box').append(img)
			};
			starHand();
			if(!device_confirm()){
				$('html,body').animate({scrollTop:$('#after').offset().top}, "slow");
			}
			

		},
		onProcessing:(e) => {
			$('.banner_v1 .left .after .img_box .edit').attr('href',e)
		},
		onProgress: (e) => {
			ResultProcess(e,0)
			// console.log("上传进度",e)
		},
		onSuccess: (res) => {
			ResultProcess(100,1)
			function imgLoad(){
				var down_stime = new Date().getTime();
				// 后端处理图
				originImg = new Image();
				originImg.setAttribute('crossOrigin', 'anonymous');
				originImg.crossOrigin = 'anonymous';
				originImg.src = s3url + JSON.parse(res.data.result).processed_image;
				originImg.onload = function(){
					ResultProcess(100,95)
					width = originImg.width;
					height = originImg.height;
					var zoom=1; 
					if(width>500 || height>500){
						$('.exportFreeBox').show()
						if(width>=height){
							zoom=500/width
						}else{
							zoom=500/height
						}
						$('.banner_v1 .right .upload_after .down').removeClass('click').parent().removeClass('active')
						$('.banner_v1 .right .upload_after .down_box>div.credit_down').show()
					}else{
						$('.banner_v1 .right .upload_after .down_box>div.credit_down').hide()
						$('.banner_v1 .right .upload_after .down').addClass('click').parent().addClass('active')
					}
					$('.banner_v1 .right .upload_after .down_box>div.credit_down i').eq(0).html(width);
					$('.banner_v1 .right .upload_after .down_box>div.credit_down i').eq(1).html(height);

					$('.banner_v1 .right .upload_after .down_box>div.free_down i').eq(0).html(Math.round(width*zoom));
					$('.banner_v1 .right .upload_after .down_box>div.free_down i').eq(1).html(Math.round(height*zoom));

					var down_etime = new Date().getTime();
					$('.banner_v1 .left .after .img_box').append(originImg)
					$('.banner_v1 .left .after .img_box .load').removeClass('active')
					$('.banner_v1 .right .upload_after span').removeClass('unbind')
					$('#uploadportrait_photo_file').removeClass('unbind')
					$('#mobileStartr').removeClass('unbind')
					$('.banner_v1 .left .after .tab_nav span').eq(1).click()
					$('.banner_v1 .left .after .img_box img').eq(1).siblings('img').hide()
					$('.banner_v1 .right .rate').addClass('active')
					var render_etime = new Date().getTime();
					uploader.editRender(down_stime,down_etime,render_etime)
					isdown = true;
				}
				originImg.onerror = function() {
					error(IMAGE_LOADING_FAILED+'(10002)')
				}
			}
			imgLoad();
			var retry=true;
			originImg.onerror = function() {
				if(retry){
					imgLoad();
					retry=false
				}else{
					clearInterval(timer)
					// 加载蒙版图片失败
					error(IMAGE_LOADING_FAILED+'(10002)')
				}
			}
		},
		onError:(error)=>{
			switch(error.code){
				case 10001:
					// showMessageBox('warning', IMAGE_TYPE_ERROR);
					operateUploadImage(uploadFile)
				    break;
				case 10002:
					error(IMAGE_LOADING_FAILED+'(10003)')
					// showMessageBox('warning', IMAGE_LOADING_FAILED+'(10003)')
					break;
				case 10003:
					// showMessageBox('warning', IMAGE_LOADING_FAILED+'(10001)')
					error(IMAGE_LOADING_FAILED+'(10001)')
					
					// console.log(base64Img);
				    break;
				case 10004:
					showMessageBox('reupload', IMAGE_TYPE_ERROR_1) 
				    break;
				case 10005:
					// showMessageBox('warning', IMAGE_LOADING_FAILED+'(10001)'); 
					error(IMAGE_LOADING_FAILED+'(10001)')
					break;
				case 10006:
					// showMessageBox('error', IMAGE_LOADING_FAILED+'(10003)')
					error(IMAGE_LOADING_FAILED+'(10003)')
					break;
				case 20001:
					error(IMAGE_LOADING_FAILED+'(10006)')
					break;
				case 20002:
					error(IMAGE_LOADING_FAILED+'(10002)')
					break;
					// showMessageBox('error',IMAGE_DOWNLOAD_FAILED+'(10006)')
				// case 1007:
				// 	download(error.data,error.name);
				// 	break;	
				// case 50001:
				// 	showMessageBox('warning', '非法请求');
				//     break;
				case 50001:
					error(IMAGE_LOADING_FAILED+'(50001)')
					break;
				case 50006:
					//url: 需要跳转的链接
					//target: '_blank'或者'_self'
					// setTimeout(() => window.open("/purchase/ai-photo-editor.html", "_blank"));
					console.log("3",newWindow);
					newWindow.location.href = '/purchase/ai-photo-editor.html';
					// window.open('/purchase/ai-photo-editor.html')
					// upgradeWindow();
					break;
				// case 50007:
				// 	showMessageBox('warning', '任务未完成');
				// 	break;
				case 51001:
					error(IMAGE_LOADING_FAILED+'(51001)')
					break;
				case 50047:
					error(IMAGE_LOADING_FAILED+'(50047)')
					// showMessageBox('urlerr', IMAGE_LOADING_FAILED+'(50047)');
					break;
				default:
					try {
						if(error.replace(/\s*/g,"").toLocaleLowerCase()=="thedifferencebetweentherequesttimeandthecurrenttimeistoolarge."){
							error = TIME_ERROR;
							showMessageBox("error",error);
						};
					} catch (error) {
						
					}
					
					// showMessageBox("error",error);
			}
		}
	};
	
	uploader = initUploadWidget(options);
}
// 上传
$('.banner_v1 .right .upload_before .upload_btn').click(function(){
    $('#photo_file_people').click()
})
$('#uploadportrait_photo_file').click(function(){
	$('#photo_file_people').click()
})

// 重新上传
$('.banner_v1 .right .upload_after .re').click(function(){
    if($(this).attr('class').indexOf('unbind')>-1){
        return false
    }
    $('#photo_file_people').click()
})
// 重新上传
$('.image-loading-box .re-upload-box .reupload').click(function(){
	$('.mask').hide();
    $('.image-loading-box').hide()
    $('#photo_file_people').click()
})
// 拖拽上传
bindDragEvent('.banner_v1 .right .upload_before',function(file){
    uploadFile=file
	const img = new Image();
	img.src = URL.createObjectURL(uploadFile);
	img.onload = async function() {
		if(img.width>IMAGE_MAX_LENGHT||img.height>IMAGE_MAX_LENGHT){
			var base64Img = await handleCompressImage(uploadFile,img.width,img.height,IMAGE_MAX_LENGHT,true);
			uploadFile = base64ToFile(base64Img,uploadFile.name);
		}
		$('.banner_v1 .right .rated').removeClass('active')
		uploader.upload(uploadFile)
	};
	img.onerror = function() {
		error(IMAGE_LOADING_FAILED+'(10002)')
	}
})



var files = []
$('#photo_file_people').change(function(){
	//这个article-part元素将以平滑的滚动方式滚动到与视口顶部齐平地方（有兼容性问题）
	// var windowWidth = window.innerWidth;
	// console.log(windowWidth);
	// if(windowWidth<=1252){
	// 	document.querySelector(".upload_box").scrollIntoView({
	// 		block: 'start',
	// 		behavior: 'smooth'
	// 	})
	// }
    uploadFile = document.getElementById('photo_file_people').files[0]
    if (uploadFile) {
		if (!uploadFile.type.startsWith('image/')) {
			showMessageBox('reupload', IMAGE_TYPE_ERROR_1);
			return false;
		}
		const img = new Image();
		img.src = URL.createObjectURL(uploadFile);
		img.onload = async function() {
			if(img.width>IMAGE_MAX_LENGHT||img.height>IMAGE_MAX_LENGHT){
				var base64Img = await handleCompressImage(uploadFile,img.width,img.height,IMAGE_MAX_LENGHT,true);
			    uploadFile = base64ToFile(base64Img,uploadFile.name);
			}
			$('.banner_v1 .right .rated').removeClass('active')

			if(!uploader) {
				// 点击上传按钮后对应的状态发生变换
				starHand();
				// 网络异常处理逻辑
				uploaderInited = false;
				$('.banner_v1 .left .after').show().siblings().hide()
				$('.banner_v1 .left .after .img_box').append(img)
				$('.banner_v1 .left .after .img_box .load').addClass('active')
				$('.banner_v1 .left .after .img_box .load div span').hide()
				$.getScript(accountHref+"js/unique.js",function(){
					// 必须前置获取指纹
					const fpPromise = FingerprintJS.load();
					fpPromise.then(fp => fp.get()).then(() => {
						murmurAfter();
						var timeers = setInterval(() => {
								if(uploaderInited==true){
									uploader.upload(uploadFile)
									clearInterval(timeers)
								}
							}, 500);
					})
				})
			} else {
				uploader.upload(uploadFile)
				$(this).val('')
			}
		};
		img.onerror = async function() {
			showMessageBox('reupload',IMAGE_TYPE_ERROR_1) 
		}
		// 重置输入值以确保下一次选择同一个文件时触发 change 事件
		$(this).val('');
    }
})
//反馈
$(".rate i").click(function () {
    var index = $(".rate i").index(this);
	if((uploadFile || uploadFile!='undefined') && originImg,originImg.src) {
		uploader.feedback(index+1,uploadFile,originImg.src);
		$('.banner_v1 .right .rate').removeClass('active')
		$('.banner_v1 .right .rated').addClass('active')
	}	
});
// 点击编辑按钮
$('.banner_v1 .left .after .img_box .edit').click(function(){
	location.href=$('.banner_v1 .left .after .img_box .edit').attr('href')
})
// 开始处理
function starHand(){
    $('.banner_v1 .left .after').show().siblings().hide()
    $('.banner_v1 .right .upload_box .upload_after').show().siblings().hide()
    $('.banner_v1 .right .rate').addClass('active')

    $('.banner_v1 .right .upload_after span').addClass('unbind')
		$('#uploadportrait_photo_file').addClass('unbind')
		$('#mobileStartl').addClass('mobiletype')
		$('#mobileStartr').addClass('mobiletype')
		$('#mobileStartr').addClass('unbind')
				
    $('.banner_v1 .left .after .img_box>img').remove()
    $('.banner_v1 .left .after .tab_nav span').eq(0).click()
    $('.banner_v1 .left .after .img_box .load').addClass('active')
	$('.banner_v1 .left .after .img_box .load div span').show()

  //   var num=0
  //   clearInterval(timer)
	// timer = setInterval(function() {
  //       num+=Math.ceil(Math.random()*10)
  //       if(num>=90){
  //           if(num>99){num=99}
  //           $('.banner_v1 .left .after .img_box .load div span').html(num+'%')
  //           clearInterval(timer)
  //       }else{
  //           $('.banner_v1 .left .after .img_box .load div span').html(num+'%')
  //       }
	// }, 300)
}
var totalProgress_image = 0;
var timerprocess;
function ResultProcess(upload,process) {
	clearInterval(timerprocess)
	var i = 0;
	uploadProgress = upload; 
	processProgress = process

	if(uploadProgress < 100) {
		// 上传阶段
		totalProgress_image = parseInt(uploadProgress / 2); 
		showTotalProgress(totalProgress_image)
	} else {
		// 处理阶段

			timerprocess = setInterval(function() {
				if(totalProgress_image>=95){
					i++;
					if(i % 2 ===0){totalProgress_image+=1;}
				}else{
					totalProgress_image+= (Math.ceil(Math.random() * 10) / 2);
				}
				if(totalProgress_image>=95){
						if(totalProgress_image>=99){totalProgress_image=99;}
						showTotalProgress(parseInt(totalProgress_image));
				}else{
					showTotalProgress(parseInt(totalProgress_image))
				}
			}, 300)

			if(processProgress >= 95){
				clearInterval(timerprocess);
				totalProgress_image = 0;
				i =0;
				showTotalProgress(parseInt(totalProgress_image))
			}
	}
}
// 显示 showTotalProgress 给用户
function showTotalProgress(params) {
	$('.banner_v1 .left .after .img_box .load div span').html(params+'%')
}
function errorHand(){
    $('.banner_v1 .left .before').show().siblings().hide()
    $('.banner_v1 .right .upload_box .upload_before').show().siblings().hide()
    $('.banner_v1 .right .rate').removeClass('active')
}
// 切换图片
$('.banner_v1 .left .after .tab_nav span').click(function(){
    if($('.banner_v1 .left .after .img_box .load').attr('class').indexOf('active')>-1){
        return false
    }
    $(this).addClass('active').siblings().removeClass()
    $('.banner_v1 .left .after .img_box img').eq($(this).index()).show().siblings('img').hide()
    if($(this).index()){
        $('.banner_v1 .left .after .img_box .edit').show()
    }else{
        $('.banner_v1 .left .after .img_box .edit').hide()
    }
})


//通过canvas绘制图片转base64
function getBase64Image(img){
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
	var dataURL = canvas.toDataURL("image/" + ext);
	return dataURL;
}
function base64toBlob(base64) {
    //base64转Blob
	let arr = base64.split(","),
	mime = arr[0].match(/:(.*?);/)[1],
	bstr = atob(arr[1]),
	n = bstr.length,
	u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}
function blobToFile(blob, filename) {
    //Blob转file对象
	// edge浏览器不支持new File对象，所以用以下方法兼容
	blob.lastModifiedDate = new Date();
	blob.name = filename;
	return blob;
}
function bindDragEvent(element, dropCallback=false, enterCallback=false) {
    $(element).on("drop", function(e){
        e.preventDefault();
        //获取文件列表
        const fileList = e.originalEvent.dataTransfer.files;
        //检测是否是拖拽文件到页面的操作
        if(fileList.length === 0) {
            return false;
        }

        let file = fileList[0]

        if (dropCallback) {
            dropCallback(file)
        }
        return false;
    })

    $(element).on('dragenter', function(e) {
        e.preventDefault()
        if(enterCallback) enterCallback()
    })

    $(element).on('dragover', function(e) {
       e.preventDefault();
    })
}


function showMessageBox(type, text='') {
    errorHand()


	$('.mask').css({
		'display': 'block',
		'z-index': 2
	})
	$('.image-loading-box').show()
	$('.show-message-box').hide()
	switch(type) {
		case 'warning': 
			$('.load-warning-box').show()
			$('.warning-text').html(text)
			break
		case 'error':
			$('.load-error-box').show()
			$('.error-text').html(text)
			break
		case 'size':
			$('.load-size-box').show()
			$('.error-text').html(text)
			break
		case 'loading':
			$('.loading-box').show()
			$('.loading-icon').html('10%')
			break
		case 'reupload':
			$('.re-upload-box').show()
			$('.warning-text').html(text)
			break
		case 'urlerr':
			$('.load-error-box').show()
			$('.error-text').html(text)
			break

	}
}
// 点击取消按钮
$('.cancel').click(function() {
   $('.image-loading-box').hide()
   $('.mask').hide();
})
// 重试按钮
$('.retry').click(function() {
    $('.image-loading-box').hide()
    $('.mask').hide();
})
$('#people-upload').click(function(){
    $('.image-loading-box').hide()
    $('.mask').hide();
})
// 划过显示下载
$('.banner_v1 .right .upload_after span.down').hover(function(){
	if ($(this).hasClass('unbind')) {
    return;
  }
	$(this).next().show()
},function(){
	$(this).next().hide()
})
$('.banner_v1 .right .upload_after .down_box').hover(function(){
	$(this).show().prev().addClass('active');
},function(){
	$(this).hide().prev().removeClass('active');
})
/**
 * 返回格式化的年月日日期
 */
function format_time() {
    let time = new Date()
    let year = time.getFullYear()
    let month = time.getMonth()
    let date = time.getDate()
    return year + '-' + month + '-' + date
}


/**
 * 整个上传过程最多不超过30S，否则终止
 */
function time_out_check() {
	timeOut = setTimeout(function() {
		if (fileReader) {
			fileReader.abort()
		}
		if (ajax) {
			ajax.abort()
		}
		abort = true
		error(IMAGE_LOADING_FAILED+'(10004)')
	}, MAX_TIME_OUT*1000)
}

/**
 * 点击确定按钮
 */
$('.button-group .confirm').click(function() {
	operateUploadImage(uploadFile)
})
/**
 * 压缩和修改图片类型图片
 */
function operateUploadImage(file) {
	time_out_check()
	let canvas = document.createElement('canvas')
	let ctx = canvas.getContext('2d')
	let formData = new FormData();

    starHand()
    $('.image-loading-box').hide()
    $('.mask').hide();

	fileReader = new FileReader();
	fileReader.readAsDataURL(file);
	fileReader.onload = function(event) {
		var file_base64 = this.result;
		var img = new Image();
		img.src = file_base64;
		img.onload = function(){
			// 获取图片的宽高
			var img_width = this.width;
			var img_height = this.height;
			var zoom = 1;
			if(img_width > IMAGE_MAX_LENGHT || img_height > IMAGE_MAX_LENGHT) {
				if(img_width >= img_height) {
					zoom = IMAGE_MAX_LENGHT/img_width
				} else {
					zoom = IMAGE_MAX_LENGHT/img_height
				}
			} else {
				zoom = 1
			}
			canvas.width = this.width*zoom
			canvas.height = this.height*zoom
			ctx.drawImage(this, 0, 0);

			// 如果图片尺寸过大，则压缩图片，最大质量压缩为原来的0.5
			if (file.size > IMAGE_MAX_SIZE) {
				let i = 0.9
				for (i; i >= 0.5; ) {
					file_base64 = canvas.toDataURL('image/jpeg', i)
					var blob = base64toBlob(file_base64)
					if (blob.size < IMAGE_MAX_SIZE) {
						uploadFile=blobToFile(blob)
						break;
					}
					i -= 0.1
				}
				if (i < 0.5) {
					error(IMAGE_LOADING_FAILED+'(10003)')
					return false
				}
			} else {
				file_base64 = canvas.toDataURL('image/jpeg')
				var blob = base64toBlob(file_base64)
				uploadFile=blobToFile(blob)
			}
      $('.banner_v1 .left .after .img_box').append(img)
			$('.banner_v1 .right .rated').removeClass('active')
			var filename = file.name;
			var namearr = filename.split('.');
			var name = namearr[0]+".jpg";
			uploadFile.name = name;
			uploader.upload(uploadFile)
		}
		img.onerror = function() {
			clearInterval(timer)
			error(IMAGE_LOADING_FAILED+'(10002)')
		}
	}
	// 图片读取失败的回调
	fileReader.onerror = function(event) {
		clearInterval(timer)
		error(IMAGE_LOADING_FAILED+'(10001)')

	}
}
$('.over-limit-upload .confirm-back').click(function() {
    $('.over-limit-upload, .mask').hide()
})

function upgradeWindow() {
    $('.noCerditTip .noCredit .title').html(aiss.i18n.tr('noCredit_title_before')+` (${width}×${height}) `+aiss.i18n.tr('noCredit_title_after'))
    $('.noCerditTip .noCredit .tips').html(aiss.i18n.tr('noCredit_tip_before')+'<span class="money">0</span>')
    $('.noCerditTip .noCredit .content').html(aiss.i18n.tr('noCredit_content'))
    $('.noCerditTip .noCredit .upBtn').html('<img src="../images/online-bg-remover/upgrade.svg"/>'+aiss.i18n.tr('noCredit_upgrade'))
    $('.noCerditTip .noCredit .footer').html(aiss.i18n.tr('noCredit_footer_before')+'<span class="money">$0.020</span>'+aiss.i18n.tr('noCredit_footer_after'))
    
	if(getCookie('user')) {
        $('.noCerditTip .noCredit .line').remove()
        $('.noCerditTip .noCredit .login').remove()
        $('.noCerditTip .noCredit .register').remove()
    } else {
        $('.noCerditTip .noCredit .login').html(aiss.i18n.tr('noCredit_login_before')+`<a class="link" href="#">${aiss.i18n.tr('noCredit_login')}</a>.`)
        $('.noCerditTip .noCredit .register').html(aiss.i18n.tr('noCredit_register_before')+' '+`<a class="link" href="#">${aiss.i18n.tr('noCredit_register')}</a>`+aiss.i18n.tr('noCredit_register_after'))
    }
    $('.noCerditTip').show()
    $('.noCerditTip .noCredit .login .link').attr('href',accountHref+'login?operation=close').attr('target','_blank');
    $('.noCerditTip .noCredit .register .link').attr('href',accountHref+'register?operation=close').attr('target','_blank');
}
$(document).on('click','.noCerditTip a',function(){
    $('.noCerditTip').hide()
})
$('.noCredit .closeBtn').click(function() {
    $('.noCerditTip').css('display', 'none')
})
$('.banner_v1 .right .upload_after .down').click(async function(){
	if($(this).attr('class').indexOf('click')>-1){
		free_down()
	}
})
$('.banner_v1 .right .upload_after .free_down').click(async function(){
	free_down()
})
$('.free-btn').click(function() {
	free_down()
	// if(compressImg==1006){
	// 	showMessageBox('error', "免费下载失败")
	// }else{
	// 	download(compressImg,name);
	// }
})
async function free_down(){
	let imgurl = originImg.src;
	// var namearr = imgurl.split('/');
	// var name = namearr.pop();
	var index1 = filename.lastIndexOf(".");
    var resolvessName = filename.substring(0,index1)+".png";
	var file = await getImageFileFromUrl(imgurl,resolvessName);
    uploader.compressImage(file,width,height,IMAGE_FREE_MAX_LENGHT);
}


/**
 * 根据图片url转为png文件对象
 * @param url
 * @param imageName
 * @returns {Promise<unknown>}
 */
function getImageFileFromUrl(url, imageName) {
    return new Promise((resolve, reject) => {
        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Accept', 'image/png');
        xhr.responseType = "blob";
        // 加载时处理
        xhr.onload = () => {
        	// 获取返回结果
            blob = xhr.response;
            let imgFile = new File([blob], imageName, { type: 'image/png' });
            // 返回结果
            resolve(imgFile);
        };
        xhr.onerror = (e) => {
            reject(e)
			error(IMAGE_LOADING_FAILED+'(10002)')
        };
        // 发送
        xhr.send();
    });
}
//base64转file
function base64ToFile(base64,file_name) {
	// const name = new Date().getTime() + Math.floor(Math.random() * 999);
	if (typeof base64 != 'string') {
	  return;
	}
	var arr = base64.split(',');
	var type = arr[0].match(/:(.*?);/)[1];
	var fileExt = type.split('/')[1];
	var bstr = atob(arr[1]);
	var n = bstr.length;
	var u8arr = new Uint8Array(n);
	while (n--) {
	  u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], `${file_name}.` + fileExt, {
	  type: type,
	});
}

//退出登录
$('#header .login_box .logout').unbind('click')
$('#header .login_box .logout').click(function(e){
    e.stopPropagation();
    logOutFn(function(){
		localStorage.clear();
		//记录退出登录标记
		localStorage.setItem("isload", true);
		temporaryToken();
	});
});