var express = require('express');
var router = express.Router();
var request = require('superagent');
var cheerio = require('cheerio');
var htmlDecode = require('js-htmlencode').htmlDecode;


/* GET home page. */
router.post('/', function(req, res, next) {
	request
	.get('http://mlibrary.uos.ac.kr/search/tot/result?si=TOTAL&st=KWRD&q=%EC%BB%B4%ED%93%A8%ED%84%B0%EA%B0%9C%EB%A1%A0')
	.set({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate, sdch',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Cache-Control':'max-age=0',
		'Connection':'keep-alive',
		'Cookie':'WT_FPC=id=237b622cc96668ed5cc1479428892451:lv=1483447733817:ss=1483447690645; JSESSIONID=eik0K8yPJoOso41j3CpeRzYSj9DpsO1nWSWOOCT9FXfzlF39geD9bbI7axHgDYSI.libwas_servlet_engine2',
		'Host':'mlibrary.uos.ac.kr',
		'Referer':'http://mlibrary.uos.ac.kr/common/error/error',
		'Upgrade-Insecure-Requests':1,
		'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
	})
	.send({
	})
	.end(function(err,data){
		$ = cheerio.load(data.text);
		var view_content = htmlDecode($('.briefDetail').html());
		// var view_content = $('.briefDetail').html();
		console.log(view_content);
		res.send(view_content);
	});
});

module.exports = router;
