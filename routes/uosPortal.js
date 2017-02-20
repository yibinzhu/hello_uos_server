var express = require('express');
var router = express.Router();
 
var cheerio = require('cheerio');
var htmlDecode = require('js-htmlencode').htmlDecode;
var iconv = require('iconv-lite');
var REquest = require('request');
var Request = REquest.defaults({jar: true});

var URL = require('url');
 
var Cookies = null;
var userName = '';
var passWord = '';
 
var clubDetailCookie = null;
/* GET home page. */
 
router.post('/', function(req, res, next) {
	 var options = {
	  url: 'http://portal.uos.ac.kr/user/loginProcess.face',
	  headers: {
	    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)'
	  },
	  form:{
	  	_enpass_login_:'submit',langKnd:'ko',loginType:'normal',returnUrl:'',ssoId:'',password:''
	  }
	};
 
	function callback(error,portalResponse,body) {
		Cookies= portalResponse.request['headers']['cookie'];
	  if (!error && portalResponse.statusCode == 200) {
		var headers={
		'Accept':'text/html, application/xhtml+xml, image/jxr, */*',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-Hans-CN, zh-Hans; q=0.8, en-US; q=0.6, en; q=0.4, ko; q=0.2',
		'Connection':'Keep-Alive',
		'User-Agent':' Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
		
		};
	     	
	     	Request.get({url:'http://club.uos.ac.kr/service/sso/sso_login.jsp',
		  	headers:headers,encoding:null}, 
			function(err,loginResponse,loginBody){
					Request.get({url:'http://club.uos.ac.kr/service/ComIndex.jsp?prod_gubun=C&prod_id=international',
				  	headers:headers,encoding:null}, 
					function(err,clubMainResponse,clubMainBody){
							var clubUrl = 'http://club.uos.ac.kr/service/rgboard/RGBoard.jsp?brd_seq='+req.body.list_id+'&cmd=¬e_seq=&exec=&page='+req.body.pageIndex;
							Request.get({url:clubUrl,
						  	headers:headers,encoding:null}, 
							function(err,clubNewsListResponse,clubNewsListBody){
								clubDetailCookie=clubNewsListResponse.request['headers']['cookie'];
									if(!err&&clubNewsListResponse.statusCode==200){
									var strContents = new Buffer(clubNewsListBody);
									var euckr_xml = iconv.decode(strContents, 'EUC-KR').toString();
									$ = cheerio.load(euckr_xml);
									var newsList = [];
									var dateList = [];
									var note_seq_list = [];
									var datas = {};
									var page = 1;
									if(page === 1){
									$('.td_notice').each(function(i,elem){
											var titleList = $(this).eq(0).text().trim();
											var noticeUrlValue = $(this).children('a').attr('href');
											if(titleList!=null){
												newsList.push(titleList);
											}
											if(noticeUrlValue!=null){
												var myRegexpSeq = /note_seq=[0-9]{3,7}/g;
 												var note_seq = myRegexpSeq.exec(noticeUrlValue);
												note_seq_list.push(note_seq[0]);
											}
										});
									}
									$('.td_subject').each(function(j,ele){
										var dataValue = $(this).text().trim();
										var subjectUrlValue = $(this).children('a').attr('href');
										if(dataValue!=null){
										newsList.push(dataValue);
										}
										if(subjectUrlValue!=null){
												var myRegexpSeq = /note_seq=[0-9]{3,7}/g;
 												var note_seq = myRegexpSeq.exec(subjectUrlValue);
												note_seq_list.push(note_seq[0]);
											}
										datas['newsList'] = newsList;
										datas['note_seq_list'] = note_seq_list;
									});
								 
									$('.td_num').each(function(i,elem){
										var temp2 = $(this).text().trim();
										if(temp2.length > 6){
										dateList.push(temp2);
										}
										datas['dateList'] = dateList;
									})
									var jsonString = JSON.stringify(datas);
									
									res.send(jsonString);
									}else{
										console.log('http request error');
									}
 
						});
 
				});
		});//login request function 
	  }
	}
	Request(options, callback);
	
	//request detail page to get contents
 
});
 
var detailHeader = {
	'Accept-Language':' en-US',
	'User-Agent':' Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
	'Accept-Encoding':' gzip, deflate',
	'Host':' club.uos.ac.kr',
	'Connection':' Keep-Alive',
	'Cookie':clubDetailCookie
	};
 
router.post('/detail', function(req, res, next) {
	
	var detail_url = 'http://club.uos.ac.kr/service/rgboard/RGBoard.jsp?brd_seq='+req.body.list_id+'&ss=&keyword=&lpp=&viewtype=&exec=read_content&page='+req.body.pageIndex+'&'+req.body.note_seq;
	Request.get({url:detail_url,
  	headers:detailHeader,encoding:null}, 
	function(err,httpResponse,detailBody){

	var strDetailContents = new Buffer(detailBody);
	var euckr_xml = iconv.decode(strDetailContents, 'EUC-KR').toString();
	try{
	$ = cheerio.load(euckr_xml);
	var contentData = htmlDecode($('#content').html());
	res.send(contentData);
	}
	catch(err){
	res.send(euckr_xml);
	}
})
});
 
module.exports = router;