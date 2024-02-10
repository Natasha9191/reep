// 插件实现
function loadAWSSDK() {
  return new Promise((resolve, reject) => {
    if (window.AWS) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.1413.0.min.js'
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script) 
    }
  })
  
}
//产品试用
function productTrial(){///api/productTrial
  var data = {};
  if(getCookie('user')){
    request('/v1/api/productTrial', {
      method: 'POST',
      body: data
    }).then(function (response) {
        // if (response.code == 200) {
        //   usertoken = response.data.token;
        //   setCookie('mind-Token',usertoken);
        // }
    });
  }
  
}
//获取主域名
function getDomain() {
  let domain = document.domain;
  let domainArray = domain.match(/\./g)
  let mainHost
  if(domainArray){
    if(domainArray && domainArray.length>1){
        let domainList = domain.split('.');
        let urlItems   = [];
        urlItems.unshift(domainList.pop() );
        while(domainList.length) {
            urlItems.unshift(domainList.pop() );
            mainHost = urlItems.join( '.' );
            break;
        }
        return "."+mainHost;
    }
  }
}
var file, BucketName, bucketRegion, IdentityPoolId, albumName, deviceid_eid,upload_stime,upload_etime,queue_etime;  //存放选中的文件
var hosts3url = "https://photo.istorage-cloud.com/"
var imgArr = [];
var url_obj = {};
var usertoken;
var sandbox_Model = false;
var s3url_host;
const wsServer = "wss://wss-api.aiseesoft.com";
var taskid = 0;
window.setCookie=function(name,value,iDay){
  var oDate = new Date();
  var hostname = getDomain();
  oDate.setDate(oDate.getDate() + iDay);
  document.cookie = name + '=' + value+ ';path=/;domain='+hostname + ';';
}
//获取cookie
window.getCookie=function(name){
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

//get Token
function temporaryToken() {
  var data = {};
  if(getCookie('user')){
    let user=JSON.parse(getCookie('user'));
    // deviceid_eid = user.e_id;
    data['t_id']=user.t_id;
    data['token']=user.token;
    localStorage.setItem("iL", true);
  }else{
    localStorage.setItem("iL", false);
  }
  request('/api/temporaryToken', {
    method: 'POST',
    body: data
  }).then(function (response) {
      if (response.code == 200) {
        usertoken = response.data.token;
        setCookie('mind-Token',usertoken);
        productTrial();
        //如果登录去领取
        if(getCookie('user')){
          // getCredits();
          getUserPlans()
        }
      }
  });
}

//领取点数
function getCredits() {
  var data = {};
  request('/v1/api/getCredits', {
    method: 'POST',
    body: data
  }).then(function (response) {
  });
}

// 查询权益
function getUserPlans() {
  var data = {};
  request('/v1/api/getUserPlans', {
    method: 'POST',
    body: data
  }).then(function (response) {
    let usertype,iscredits;
    let arr = response.data.filter(item =>item.module_type != 3 && item.module_type != 4 && item.module_type != 5)
    if(arr.length > 0) {
        usertype = true
    } else {
        usertype = false
    }
    localStorage.setItem('usertype', usertype);
    let iscreditsArr = response.data.filter(item =>item.module_type != 3 && item.module_type != 4)//是否有点数
    if(iscreditsArr.length > 0) {
        iscredits = true
    } else {
        iscredits = false
    }
    localStorage.setItem('iscredits', iscredits);
  })
}

//initget Credentials
async function initgetCredentials() {
  var dataObj = {};
//1代表超分 2去水印 3抠图;
  dataObj['module_type'] = 3;
  
  signRequest = new XMLHttpRequest;
  signRequest.addEventListener('load', function (e) {
    var resps = JSON.parse(e.target.responseText)
    const decoded = JSON.parse(atob(resps.data));
    BucketName = decoded[0];
    bucketRegion = decoded[1];
    IdentityPoolId = decoded[1] + ":" + decoded[2];
    albumName = decoded[3];
    localStorage.setItem("BUCKET_INIT", BucketName);
    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
    initClass();
  });
  signRequest.open('POST', getHostURL('/api/cognitoIdentity'), true);
  signRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  signRequest.send(JSON.stringify(dataObj));
}

// AWS.S3 sdk 上传图片
async function addPhoto(file, data,parent) {
  imgArr=[];
  // var fileName = data.taskid + "_" + file.name.replace(/[@#&%*]+/g, '');
  var index = file.name.lastIndexOf(".");
  var file_type = file.name.substring(index+1);
  var fileName = deviceid_eid + "_" + new Date().getTime()+"."+file_type;
  var albumPhotosKey = albumName;
  if(!BucketName){BucketName=localStorage.getItem("BUCKET_INIT");localStorage.removeItem("BUCKET_INIT");}//兼容浏览器Edeg
  var photoKey = albumPhotosKey + fileName;
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: BucketName,
      Key: photoKey,
      Body: file,
      ContentType: file.type,
      CacheControl: 'public, max-age=3600'
    },
    appropriateBucketName: BucketName,
    concurrentLimit:5,
  });

    try {
      upload.on('httpUploadProgress', (evt) => {
        const percent = Math.round(evt.loaded / evt.total * 100) 
        parent.onProgress(percent) 
      });
    } catch (error) {
      console.warn("onProgress not supported")
    }

  var promise = upload.promise();
  promise.then(res => {
    data.s3url = photoKey;
    data.upload_status = 2;
    upload_etime = parseInt(new Date().getTime())+parseInt(localStorage.getItem('errorTime'));
    imgArr.push(data);
    createTask(parent);
  },
    function (err) {
      console.log("ManagedUpload err",err)
      parent.onError(err.message);
      data.upload_status = 3;
    }
  )
}
//创建任务
 async function createTask(parent) {
  let data = {};
  imgArr.forEach((item, index) => {
    data["taskid"] = item.taskid;
    data["name"] = item.name;
    data['s3key'] = item.s3url;
    data['width'] = item.width;
    data['height'] = item.height;
    data['maxwidth'] = item.width > item.height ? item.width : item.height;
    data['file_size'] = item.size;
    data['upload_etime'] = upload_etime;
    data['file_type'] = item.type;
    data['create_stime'] = parseInt(new Date().getTime())+parseInt(localStorage.getItem('errorTime'));
    data['upload_stime'] = upload_stime;
  })
  var sysInfo = getBrowserInfo();
  var sys = sysInfo.system;
  var browser = sysInfo.browser;
  await request('/v1/api/plugin/createMattingTask', {
    method: 'POST',
    body: {
      'brandid': 1,
      'appid':parent.appId,
      'data': data,
      'sys':sys,
      'browser':browser
    }}).then(function (response) {
      if(response.code == 200){
        queue_etime = parseInt(new Date().getTime())+parseInt(localStorage.getItem('errorTime'));
        parent.onProcessing(response.data);
        getUserPlans()
      }else{
        parent.onError({message:"",code:response.code});
      }
  });
}
// 不重复唯一ID
function getDocId(len) {
  var timestamp = Date.parse(new Date());
  var s = []
  var hexDigits = "0123456789abcdef"
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  if (len) {
    var uuid = s.join("").slice(0, len)
    return uuid
  }
  s[14] = timestamp
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = "-"

  var uuid = s.join("")
  return uuid
}
// API URL 拼接
function getHostURL(url) {
  let PREFIX = "";
  if (sandbox_Model) {
    PREFIX = "sandbox.";
  }
  return 'https://' + PREFIX + 'open-api.aiseesoft.com' + url;
}
// request 请求封装
async function request(url, options) {
  // 使用默认设置合并传入的选项
  let defaultOptions;
  if (usertoken) {
    defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usertoken}`
      },
    };
  } else {
    defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
  const mergedOptions = { ...defaultOptions, ...options };
  
  // 如果有body并且Content-Type是'application/json'，将body转换为JSON
  if (mergedOptions.body && mergedOptions.headers['Content-Type'] === 'application/json') {
    mergedOptions.body.e_id = deviceid_eid;
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }
  return fetch(getHostURL(url), mergedOptions)
    .then(response => {
      var nowTime = new Date().getTime();
      // console.log(response.headers.get('X-Response-Time')-nowTime);
      localStorage.setItem("errorTime", response.headers.get('X-Response-Time')-nowTime);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('There was an error with the request!', error);
    });
}
// 文件格式检查
function checkImage(file) {
  var imgType = file.type.split('/')[1]
  if (!file) {
    return false;
  } else if ((file.type).indexOf('image') == -1) {
    return false;
  } else if (file.size > 1024 * 1024 * 10) {
    return false;
  } else if (!['jpg','jpeg','png','bmp'].includes(imgType.toLowerCase())) {
    return false;
  }
  return true;
}
//获取结果
async function getResult(taskid) {
  var data={};
  data['taskid']=taskid;
  data['result_stime']=parseInt(new Date().getTime())+parseInt(localStorage.getItem('errorTime'));
  data['queue_etime'] = queue_etime;
  await request('/v1/api/getMattingResult', {
    method: 'POST',
    body:data
  }).then(function (response) {
        if (response.code === 200) {
          options.onSuccess(response); 
          let s3url = options.s3url
          const db = new DB('dbName', 1.0);
          db.init().then(() => {
            db.get(taskid).then(async (data) => {
              const maskBlob = await urlToBlob(s3url + JSON.parse(response.data.result).masking)
              const processedBlob = await urlToBlob(s3url + JSON.parse(response.data.result).processed_image)
              let blobdata = {
                originalBlob: data.blob.originalBlob,
                maskBlob: maskBlob,
                processedBlob: processedBlob
              }
              try {
                db.deleteAll()
              } catch (error) {}
              db.saveBlob(taskid, blobdata)
            })
          
          });
        }
      
  });
}
// WebSocket

function createConnection() {
  ws = new WebSocket(wsServer);
  var autoReconnect = true;
  ws.onopen = () => {
    ws.send('{"uid":"'+deviceid_eid+'","auth":"'+usertoken+'"}');
    sendPing(); 
  };

  ws.onclose = () => {
    if(autoReconnect){
      setTimeout(createConnection, 1000);
    }
  };

  ws.onmessage = msg => {
    // code...
    let res
    
    if(typeof msg.data == "string"){
        res = JSON.parse(msg.data)
    }
    if(typeof msg.data == "object"){
        res = msg.data
    }
    taskid = res.taskid;
    getResult(res.taskid);
    autoReconnect = false;
    ws.close();
  };

  function sendPing() {
    if (ws) {
      ws.send("ping");
    }
    // setTimeout(sendPing, 5000); 
  }
}


//获取浏览器，系统信息
function getBrowserInfo(){
  var OsObject=navigator.userAgent.toLowerCase(); 
  var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  var data = [];
  data['system'] = 'Other';
  data['browser'] = 'Other';
  if (OsObject.indexOf("win32") >= 0 || OsObject.indexOf("wow32") >= 0) {
      data['system'] = 'WIN32';
  }
  if (OsObject.indexOf("win64") >= 0 || OsObject.indexOf("wow64") >= 0) {
      data['system'] = 'WIN64';
  }
  if (OsObject.indexOf("arm") >= 0) {
      data['system'] = 'ARM';
  }
  if (OsObject.indexOf("ios") >= 0) {
      data['system'] = 'iOS';
  }
  if (OsObject.indexOf("android") >= 0) {
      data['system'] = 'Android';
  }
  if (OsObject.indexOf("ipad") >= 0) {
      data['system'] = 'Pad';
  }
  if(isMac){
      data['system'] = 'MAC';
  }
  // 包含「Opera」文字列  
  if(OsObject.indexOf("opera") != -1)  
  {  
      data['browser'] = 'Opera';
  }  
  // 包含「MSIE」文字列  
  else if(OsObject.indexOf("msie") != -1)  
  {  
      data['browser'] = 'Internet Explorer';
  }  
  // 包含「chrome」文字列 ，不过360浏览器也照抄chrome的UA 
    
  else if(OsObject.indexOf("chrome") != -1)  
  {  
      data['browser'] = 'Chrome';
  } 
  // 包含「UCBrowser」文字列  
  else if(OsObject.indexOf("ucbrowser") != -1)  
  {  
      data['browser'] = 'UCBrowser';
  } 
  // 包含「BIDUBrowser」文字列  
  else if(OsObject.indexOf("bidubrowser") != -1)  
  {  
      data['browser'] = 'BiDuBrowser';
  } 
  // 包含「Firefox」文字列  
  else if(OsObject.indexOf("firefox") != -1)  
  {  
      data['browser'] = 'Firefox';
  } 
  // 包含「Netscape」文字列  
  else if(OsObject.indexOf("netscape") != -1) 
  {  
      data['browser'] = 'Netscape';
  }  
  // 包含「Safari」文字列  
  else if(OsObject.indexOf("safari") != -1)  
  {  
      data['browser'] = 'Safari';
  }  
  else{  
      data['browser'] = 'other'; 
  } 
  return data;
}

class DB {
  constructor(name, version) {
    this.dbName = name;
    this.dbVersion = version;
    this.ObjectStoreName ='MyStore';//为了兼容这里使用默认MyStore ，edeg 下无法修改
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore(this.ObjectStoreName, {keyPath: 'id'});
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => {
        reject('Error opening db');
      };
    });
  }

  add(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.ObjectStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.ObjectStoreName);
      const request = objectStore.add(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject('Error adding data');
      } 
      
    });

  }

  get(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.ObjectStoreName]);
      const objectStore = transaction.objectStore(this.ObjectStoreName);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Error getting data');
      }
    });
  }
  
  // 同上,删除数据的实现
  delete(id) {
    return new Promise((resolve, reject) => {
      try {

        const transaction = this.db.transaction([this.ObjectStoreName], 'readwrite');
        const objectStore = transaction.objectStore(this.ObjectStoreName);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
          resolve();
        };
    
        request.onerror = () => {
          reject('Error deleting data');
        }
      } catch (error) {
          
      }
    });
  }

  deleteAll() {
      return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([this.ObjectStoreName], 'readwrite');
          const objectStore = transaction.objectStore(this.ObjectStoreName);
          const request = objectStore.clear();
      
          request.onsuccess = () => {
              resolve();
          };
        
          request.onerror = () => {
              reject('Error deleting all data');
          }
      });
  }


  saveBlob(key, blob) {
    return this.add({
      id: key,
      blob: blob
    });
  }
  
  getBlob(key) {
    return this.get(key).then(result => result.blob);
  }
}
async function processImage(file) {

  const fileContent = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const image = new Image();
  image.src = fileContent;
  await new Promise((resolve) => {
    image.onload = resolve; 
  });
  
  const {width, height} = image;
  if (width > 4096 || height > 4096) {
    throw new Error(JSON.stringify({message:'判断尺寸不符',code: 10003 }));
  }else{
    return {width: width, height: height}
  }

}
//Base64转url
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      resolve(e.target.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'));
    };
  });
}


// 创建一个 UploadPlugin 类
class UploadPlugin {
  constructor(options) {
    // 初始化
    this.options = options;
    // 保存需要的属性
    this.s3url = options.s3url;
    this.uploadBtn = options.uploadBtn;
    this.files = options.files;
  }

  async upload(files) {
      s3url_host = this.s3url
      upload_stime = parseInt(new Date().getTime())+parseInt(localStorage.getItem('errorTime'));
      // 上传开始回调
      if (typeof this.options.onUploadStart === 'function') {
        this.options.onUploadStart();
      }
      // 获取上传文件对象
      let file = files;
      let Results;
      if (!file.type.startsWith('image/')) {
        this.options.onError({message:'非图片类型',code: 10004 });
        return false;
      }
      if (file.length >1) { this.options.onError({message:'当前选择的是多文件，目前支持单文件',code: 10006 });}
      if (file.length === 0) {
        this.options.onError(new Error('选择文件为空！', { code: 10000 }));
        return false;
      } else {
        var isError = 0;
        try {
          var data = {
            taskid: getDocId(20),//唯一任务id
            name: file.name.replace(/[@#&%*]+/g, ''),
            size: file.size,
            type: file.type,
            error: 0,
            upload_status: 1,//上传状态1上传中，2上传成功，3上传失败
            upload_stime:parseInt(new Date().getTime())+parseInt(localStorage.getItem('errorTime')),
          }

          var process = await processImage(file);
          data.width = process.width;
          data.height = process.height;
          
          // // 判断格式
          if (!['jpg', 'jpeg', 'png', 'bmp'].includes((file.type.split('/')[1]).toLowerCase())) {
            if(!['image/x-icon', 'image/gif', 'image/svg+xml', 'image/avif'].includes((file.type).toLowerCase())){
              data.error = 10004
            } else {
              data.error = 10001
              // data.state = 'hide'
            }
            isError++
          }
          // 判断大小 大小从权益获取
          if (file.size > 1024 * 1024 * 50) {
            data.error = 10002
            // data.state = 'hide'
            isError++
          }

        } catch (error) {
          let data = JSON.parse(error.message)
          this.options.onError({message:data.message,code:data.code });
          return false;
        }
        //无错误，开始上传图片
        if (isError != 0) {
          this.options.onError({message:error,code:data.error });
          return false;
        }
        // websocket
        createConnection();
        // 存储
        const db = new DB('dbName', 1.0);
        db.init().then(() => {
          try {
            db.deleteAll()
          } catch (error) {}
         
          // 读取文件内容
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = () => {
            // 封装Blob
            const blobs = new Blob([reader.result], {type: file.type});
            // db.saveBlob(deviceid_eid+data.taskid, blobs);  
            db.saveBlob(data.taskid, {
              originalBlob: blobs
            });  
          };
        
        });

        //无错误，开始上传图片
        if (isError == 0) {
          Results = await addPhoto(file, data,this.options);
        }
      }
  }
  async download(){
    // 下载图片权益；
    
    downloadImage(hosts3url);
    //如果没有权益 
  }
  //用户反馈
  async feedback(status,files,processed_url){
    // 用户反馈不满意上传s3并更改状态，满意只更改状态
    if(status == 1){//1代表满意
      feedbackStatusEdit(status);
    }else if(status == 2){//2代表不满意
      let file = null;
      file = await getFileFromUrl(processed_url);
      await addFeedbackPhoto(files,'original');
      await addFeedbackPhoto(file,'processed');

      feedbackStatusEdit(status);
    }

  }
  async editRender(down_stime,down_etime,render_etime){
    editRender(down_stime,down_etime,render_etime);
  }
  async compressImage(file,natureWidth,natureHeight,maxwidth){
    handleCompressImage(file,natureWidth,natureHeight,maxwidth);
  }
}
// AWS.S3 sdk 上传反馈图片
async function addFeedbackPhoto(file,name) {
  var fileName = imgArr[0]['taskid']+"_"+name+ file.name.replace(/[@#&%*]+/g, '');//imgArr[0]['taskid'] + 
  var albumPhotosKey = "feedback/";

  var photoKey = albumPhotosKey + fileName;
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: BucketName,
      Key: photoKey,
      Body: file,
      ContentType: file.type,
      CacheControl: 'public, max-age=3600'
    },
    appropriateBucketName: BucketName
  });

  var promise = upload.promise();
  await promise.then(res => {
    // if(fileName=='original'){
      url_obj[name] = photoKey;
    // }else{
    //   url_obj[original_url] = photoKey;
    // }
  },
    function (err) {
      options.onError({message:err,code:51001});
    }
  )
}
function feedbackStatusEdit(status) {
  var data={};
  data['taskid']=imgArr[0]['taskid'];//imgArr[0]['taskid']
  data['status']=status;
  data['url_obj']=JSON.stringify(url_obj);
  request('/v1/api/feedbackStatusEdit',{
    method: 'POST',
    body:data
  }).then((response) => {
  })
  .catch(function () {
    options.onError({message:err,code:51001});
  });
}
//url转file对象
function getFileFromUrl(url) {
  var nameArr = url.split("/");
  var fileName = nameArr.pop();
  var arr = fileName.split(".");
  var type = arr.pop();
  return new Promise((resolve, reject) => {
      var blob = null;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader('Accept', 'image/'+type);
      xhr.responseType = "blob";
      // 加载时处理
      xhr.onload = () => {
        // 获取返回结果
          blob = xhr.response;
          let file= new File([blob], fileName, { type: 'image/'+type });
          // 返回结果
          resolve(file);
      };
      xhr.onerror = (e) => {
          reject(e)
      };
      // 发送
      xhr.send();
  });
}

async function downloadImage() {
    var data={};
    data['taskids']=imgArr[0]['taskid'];//'96bf9bf18e9768bdbaff'
    var response = await request('/v1/api/mattingDownload',{
      method: 'POST',
      body:data
    });
    // console.log(response);
    // .then((response) => {
    switch (response.code) {
        case 200:
            // var file_name = response.data[0].bucketkey;
            // var index = file_name.indexOf("_");
            // var resolvess = file_name.substring(index+1);
            var index1 = (response.data[0].file_name).lastIndexOf(".");
            var resolvessName = (response.data[0].file_name).substring(0,index1)+".png";
            // var resolvessName = response.data[0].name+".png";
            downloadFile(hosts3url+(JSON.parse(response.data[0].result)).processed_image,resolvessName);//resolvessName
            // return true;
            break;
        case 50007:
            options.onError({message:'任务未完成',code: response.code });
            break;
        case 50006:
            options.onError({message:'权益不足',code: response.code });
            // return false;
            break;
        default:
            options.onError({message:'下载失败',code: 20001 });
            break;
    }
    // })
    // .catch(function () {
    // });
}
function downloadFile(url,fileName){
  //fileurl文件地址（一般是接口返回） filename文件下载后的名字
  const x = new XMLHttpRequest();
  x.open('GET', url, true);
  x.responseType = 'blob';
  x.onload = function () {
    const url = window.URL.createObjectURL(x.response);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    // document.body.removeChild(a);
    // 然后移除
  }
  x.send()
}


//修改渲染时间
function editRender(down_stime,down_etime,render_etime){
  var render_etime = parseInt(new Date().getTime())+parseInt(localStorage.getItem('errorTime'));
  var data = {};
  data['taskid'] = imgArr[0]['taskid'];
  data['down_stime'] = down_stime;
  data['down_etime'] = down_etime;
  data['render_etime'] = render_etime;
  request('/v1/api/editRender',{
    method: 'POST',
    body:data
  }).then((response) => {
  })
  .catch(function (error) {
      // self.isclick=true;
      // self.$Message.error(self.$t('message.timeout'));
  });
}

// 工厂函数 createUploadPlugin 来创建实例
function createUploadPlugin(options) {
  return new UploadPlugin(options);
}

// 获取去设备ID
// async function getDeviceId(){
  // const FintJS = import('https://openfpcdn.io/fingerprintjs/v4').then(FintJS => FintJS.load());
  // await FintJS.then(fp => fp.get()).then(async result => {
      // deviceid_eid = result.visitorId
      // temporaryToken();
  // })
//   const FintJS = import('https://sandboxaccount.aiseesoft.com/js/unique.js').then(FintJS => FintJS.load());
//   await FintJS.then(fp => fp.get()).then(async result => {
//       deviceid_eid = result.visitorId
//       temporaryToken();
//   })
//  }

function initClass() {
    options.oninit({status: true});
}
async function initconfig_S3_auto() {
  try {
    await loadAWSSDK();
    await temporaryToken();
    await initgetCredentials();
    // sdk 加载完成,后续代码
  } catch(e) {
   // sdk 加载失败,处理错误 
   try { options.oninit({status: false}); } catch(err) {}

  }
};
function initUploadWidget(options) {
  if(options.appId == undefined){
    options.onError({message:'产品 appId 错误',code: 10007 });
    return false;
  }
  if(options.deviceId == undefined){
    options.onError({message:'设备 id 错误',code: 10008 });
    return false;
  }
  deviceid_eid = options.deviceId;
  sandbox_Model = options.sandbox;
  // 初始化设备id，S3，token等配置
  initconfig_S3_auto();

  // 创建上传插件实例
  const uploader = createUploadPlugin(options);
  return uploader
}

//图片压缩宽高 imgurl远程图片地址 natureWidth原图宽 natureHeight原图高 maxwidth压缩后的最长边 isreturn true压缩完自动下载 false返回base64 
async function handleCompressImage(file,natureWidth,natureHeight,maxwidth,isreturn=false) {
  return new Promise((resolve, reject) => {
    var zoom = 0.5;
    if(natureWidth > maxwidth || natureHeight > maxwidth) {
      if(natureWidth >= natureHeight) {
        zoom = maxwidth/ natureWidth
      } else {
        zoom = maxwidth / natureHeight
      }
    } else {
      zoom = 1
    }
    // var blob = await urlToBlob(imgurl);
    let reader = new FileReader();
    // 读取文件
    reader.readAsDataURL(file); // 转base64
    reader.onload = (e) => {
      let image = new Image()     // 新建一个img标签（不嵌入DOM节点，仅做canvas操作)
      image.src = e.target.result    // 让该标签加载base64格式的原图
      image.onload = function () {    //图片加载完毕后再通过canvas压缩图片，否则图片还没加载完就压缩，结果图片是全黑的
        let canvas = document.createElement('canvas') //创建一个canvas元素
        let context = canvas.getContext('2d')    //context相当于画笔，里面有各种可以进行绘图的API
        // 定义 canvas 大小，也就是压缩后下载的图片大小
        let imageWidth = image.width*zoom; // 压缩后图片的宽度
        let imageHeight = image.height*zoom; // 压缩后图片的高度
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        // 使用drawImage重新设置img标签中的图片大小，实现压缩
        context.drawImage(image, 0, 0, imageWidth, imageHeight)
        var file_base64;
        // 如果图片尺寸过大，则压缩图片，最大质量压缩为原来的0.5
        if (file.size > 1024*1024*50) {
          let i = 0.9
          for (i; i >= 0.5; ) {
            file_base64 = canvas.toDataURL(file.type, i)
            var blob = base64toBlob(file_base64)
            if (blob.size < 1024*1024*50) {
              uploadFile=blobToFile(blob)
              break;
            }
            i -= 0.1
          }
          if (i < 0.5) {
            options.onError({code:10006,messsge:"压缩失败"});
          }
          if(isreturn){
            resolve(file_base64);
          }else{
            download(file_base64, file.name.replace(/[@#&%*]+/g, ''));
          }
        }else{
          // 图片截取指定位置载入
          file_base64 = canvas.toDataURL(file.type); // 输出压缩后的base64
          // options.onError({code:1007,data:,name:file.name}); 
        }
        if(isreturn){
          resolve(file_base64);
        }else{
          download(file_base64, file.name.replace(/[@#&%*]+/g, ''));
        }
      };
      image.onerror = function() {
        options.onError({code:10006,messsge:"压缩失败"});
      }
    };
    // 图片读取失败的回调
    reader.onerror = function(event) {
      options.onError({code:10006,messsge:"压缩失败"});
    }
  });
}
function urlToBlob(url) {
	return fetch(url)
	  .then(async response => {
      const blob = await response.blob();
      if(blob.type === 'image/jpeg') {
        return blob
      }
      const arrayBuffer = await blob.arrayBuffer();
      return new Blob([arrayBuffer], { type: 'image/jpeg' });
    })
	  .catch(error => {
    options.onError({code:20002,messsge:""});
		throw error; // 可根据实际情况处理错误
	  });
}
/**
 * 下载
 * @param  canvas canvas [description]
 * @param  string name   [description]
 */
function download(imgurl, name) {
  const link = document.createElement('a');
  link.href = imgurl;
  link.download = name;
  link.click();  
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
