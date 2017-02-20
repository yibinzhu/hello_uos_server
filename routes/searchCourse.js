var express = require('express');
var router = express.Router();
var request = require('request');
var iconv = require('iconv-lite');

//search major course
router.get('/major', function(req, res, next) {
request.get({url:'http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi',
 form: {
	year:req.query.year,
	term:req.query.term,
	deptDiv:req.query.deptDiv,
	dept:req.query.dept,
	subDept:req.query.subDept
 },encoding:null}, 
function(err,httpResponse,body){
	var strContents = new Buffer(body);
	var euckr_xml = iconv.decode(strContents, 'EUC-KR').toString()
	res.send(euckr_xml);
})
});
//search minor course
router.get('/minor', function(req, res, next) {
request.get({url:'http://wise.uos.ac.kr/uosdoc/api.ApiUcrCultTimeInq.oapi',
 form: {
	year:req.query.year,
	term:req.query.term,
	subjectDiv:req.query.subjectDiv,
 },encoding:null}, 
function(err,httpResponse,body){
	var strContents = new Buffer(body);
	var euckr_xml = iconv.decode(strContents, 'EUC-KR').toString()
	res.send(euckr_xml);
})
});
// request main board api
router.get('/board', function(req, res, next) {
request.get({url:'http://wise.uos.ac.kr/uosdoc/api.ApiApiMainBd.oapi',
 form: {
 },encoding:null}, 
function(err,httpResponse,body){
	var strContents = new Buffer(body);
	var euckr_xml = iconv.decode(strContents, 'EUC-KR').toString()
	res.send(euckr_xml);
})
});
//request tuition
router.get('/tuition', function(req, res, next) {
request.get({url:'http://wise.uos.ac.kr/uosdoc/api.ApiUrsRegPaidDayInq.oapi',
 form: {
 	year:req.query.year,
	term:req.query.term,
	deptDiv:'20000',
 },encoding:null}, 
function(err,httpResponse,body){
	var strContents = new Buffer(body);
	var euckr_xml = iconv.decode(strContents, 'EUC-KR').toString()
	res.send(euckr_xml);
})
});
module.exports = router;
