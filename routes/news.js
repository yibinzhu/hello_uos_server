var express = require('express');
var router = express.Router();
var request = require('superagent');
var cheerio = require('cheerio');
var htmlDecode = require('js-htmlencode').htmlDecode;


/* GET home page. */
router.post('/', function(req, res, next) {
	request
	.get('http://www.uos.ac.kr/korNotice/list.do')
	.set({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate',
		'Cache-Control':'max-age=0',
		'Connection':'keep-alive',
		'Content-Type':'application/x-www-form-urlencoded',
		'Host':'www.uos.ac.kr',
		'Origin':'http://www.uos.ac.kr',
		'Upgrade-Insecure-Requests':1
	})
	.query({list_id:req.body.list_id,pageIndex:req.body.pageIndex })
	.end(function(err,data){
		$ = cheerio.load(data.text);
		var newList = [];
		$('.listType')
				.children('li').each(function(idx,data){
				var numHtml = htmlDecode($(this).html().replace(/[\n\t\r]/g,""));
				var myRegexpSort = /\d{1,4}/g;
				var myRegexpSeq = /[0-9]{3,6}/g;
				var sort = myRegexpSort.exec(numHtml);
				var seq = myRegexpSeq.exec(numHtml);
				var num = $(this).children('a').children('span[class=mhide]').text().replace(/[\n\t\r]/g,"");
				var Artical = $(this).children('a').html();
				var temp = Artical.replace(/<span.*span>/g,"");
				var artical = htmlDecode(temp);
				var dept = $(this).children('ul').children().eq(0).text().replace(/[\n\t\r]/g,"");
				var date = $(this).children('ul').children().eq(1).text().replace(/[\n\t\r]/g,"");
				newList.push({
					num:num,
					sort:sort[0],
					seq:seq[0],
					title:artical,
					dept:dept,
					date:date
				});
			});
		res.send(newList);
	});
});

module.exports = router;
