/*
 * @Descripttion: 
 * @version: 
 * @Author: zm
 * @Date: 2023-08-22 17:17:26
 * @LastEditors: zm
 * @LastEditTime: 2023-09-27 16:29:53
 */
!(function (global, jQuery) {
  var $ = jQuery;
  global.aiss || (global.aiss = {});
  var tr = window.translation =  global.aiss.i18n = {
    langs: {
        "en": {
          'over_size_message': 'The image you uploaded is over 50M. We will compress your file for uploading. Please click “Confirm” to continue uploading.',
          'file_type_error': 'The file you uploaded is not an image! Please try to upload again.',
          'image_type_error': 'The image format is not supported. We only supports JPG, JPEG, PNG and BMP. We will covert your image format for recognition. Please click “Confirm” to continue uploading.',
          'upload_error': 'Upload Error! (Error Code: 1005) Please try again.',
          'network_error': 'Network Error! (Error Code: 2001) Please try again.',
          'recognition_error': 'Recognition Error! (Error Code: 2002) Please try again.',
          'image_compress_fail': 'The image is too large to compress!',
          'image_transfer_fail': 'Failed to convert the image. Please upload another one.'  ,
          'image_size': 'We currently do not support images whose width or height is more than 4096px. Please choose another image and try again.',
          'no_credits':'Insufficient Credits',

          "noCredit_title_before": "Download 1 original image",
          "noCredit_title_after": "will cost 1 credit.",
          "noCredit_tip_before": "Your remaining credits:",
          "noCredit_tip_credits": " credits",
          "noCredit_content": "You can't download original images now. Please upgrade your account.",
          "noCredit_upgrade": "Upgrade Now",
          "noCredit_footer_before": "Only ",
          "noCredit_footer_after": " for downloading each original image.",
          "noCredit_login_before": "Already upgraded? Please ",
          "noCredit_login": "log in",
          "noCredit_register_before": "(New users who",
          "noCredit_register": "register",
          "noCredit_register_after": " will enjoy the benefit of downloading 6 original images.)",
          "image_Loading_Failed": "Failed to load the image, please reload. If it fails repeatedly, please contact us.",
          "image_Processing_Failed": "Failed to process, please retry. If it fails repeatedly, please contact us.",
          "image_Download_Failed": "Status abnormal, please retry. If you have logged in, please click on the profile photo to go to the history for viewing. If it fails repeatedly, please contact us.",
          "bgremove_pop_restrictedPopup": "File Format not supported. The formats we support are JPG, JPEG, PNG, GIF, SVG, WEBP, BMP, ICO, and AVIF.",
          "photo_rights_info":" <span><i class=\"num\">2</i> credit</span> with original quality can be downloaded at present. <a href=\"https://account.aiseesoft.com\" target=\"_blank\">View Details>></a>",
          "time_error":"The difference between the request time and the current time is too large.",
        },
    },
    getCurrentLanguage: function() {
      var str = window.location.href.match(/\/\/(\S*)\//)[1].split("/")[0].replace("aiseesoft","").replace("apeaksoft","").replace("anymp4","").replace("videoconverter.net","");
      if(str.indexOf("\.fr")>-1&&str.indexOf("free-videoconverter")<0){return "fr"}
      else if(str.indexOf("\.jp")>-1&&str.indexOf("free-videoconverter")<0){return "jp"}
      else if(str.indexOf("\.de")>-1&&str.indexOf("free-videoconverter")<0){return "de"}
      else if(str.indexOf("zh-cn")>-1&&str.indexOf("free-videoconverter")<0){return "zh_CN"}
      else if(str.indexOf("zh-tw")>-1&&str.indexOf("free-videoconverter")<0){return "zh_TW"}
      else if(str.indexOf("tr")>-1&&str.indexOf("free-videoconverter")<0){return "tr"}
      else{return "en"}
    },
    tr: function(msgKey) {
        var curLang = this.getCurrentLanguage();
        if (curLang in this.langs && msgKey in this.langs[curLang]) {
            return this.langs[curLang][msgKey];
        }
        if (msgKey in this.langs['en']) {
            return this.langs['en'][msgKey];
        }
        return msgKey;
    }
  };
})(window || {}, jQuery);