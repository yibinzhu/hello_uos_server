var express = require('express');
var router = express.Router();
var request = require('superagent');
var cheerio = require('cheerio');
var htmlDecode = require('js-htmlencode').htmlDecode;


/* GET home page. */
router.post('/', function(req, res, next) {
	request
	.post('http://www.uos.ac.kr/korNotice/view.do')
	.set({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate',
		'Cache-Control':'max-age=0',
		'Connection':'keep-alive',
		'Content-Type':'application/x-www-form-urlencoded',
		'Host':'www.uos.ac.kr',
		'Origin':'http://www.uos.ac.kr',
		'Upgrade-Insecure-Requests':1,
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36'
	})
	.send({
		list_id:req.body.list_id,
		seq:req.body.seq,
		sort:req.body.sortNum,
		pageIndex:req.body.pageIndex,
		searchCnd:'',
		searchWrd:'',
		viewAuth:'Y',
		writeAuth:'N',
		board_list_num:10,
		lpageCount:10
	})
	.end(function(err,data){
		$ = cheerio.load(data.text);
		var view_content = htmlDecode($('#view_content').html());
		res.send(view_content);
	});
});

module.exports = router;
