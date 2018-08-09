var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017";

function _connect(callback){
	MongoClient.connect(url,function(err,db){
		if(err) throw err;
		callback(err,db);
		// db.close();---不能在此关闭数据库，否则容易造成在调用回调之前关闭了数据库
	})
}

exports.insert=function(dbase,collectionName,myobj,callback){
	_connect(function(a,db){
		//如果为单条数据，则先添加进数组
		if(!myobj.length){
			var objTemp=new Array()
			objTemp.push(myobj)
		}else 
			objTemp=myobj
		db.db(dbase).collection(collectionName).insertMany(objTemp,function(err,result){
			if(err) throw err;
			callback(err,result)
			db.close();
		})
	})
}

exports.update=function(dbase,collectionName,whereStr,updateStr,callback){
	_connect(function(a,db){
		db.db(dbase).collection(collectionName).updateMany(whereStr,updateStr,function(err,result){
			if(err) throw err;
			callback(err,result)
			db.close()
		})
	})
}

exports.delete=function(dbase,collectionName,whereStr,callback){
	_connect(function(a,db){
		db.db(dbase).collection(collectionName).deleteMany(whereStr,function(err,result){
			if(err) throw err;
			callback(err,result);
			db.close();
		})
	})
}

exports.find=function(dbase,collectionName,param1,param2,param3,callback){
	var len=arguments.length;
	_connect(function(a,db){
		if(len==4){//查询数据
			callback=param2;
				db.db(dbase).collection(collectionName).find(param1).toArray(function(err,result){
					if(err) throw err;
					callback(err,result)
					db.close()
				})
		}else if(len==5){
			callback=param3;
			if(isNaN(param2)){//排序
					db.db(dbase).collection(collectionName).find(param1).sort(param2).toArray(function(err,result){
						if(err) throw err;
						callback(err,result);
						db.close()
					})		
			}else{//限制返回的条数
					db.db(dbase).collection(collectionName).find(param1).limit(param2).toArray(function(err,result){
						if(err) throw err;
						callback(err,result)
						db.close()
					})

			}
		}else if(len==6){//跳过规定的条数  分页
				db.db(dbase).collection(collectionName).find(param1).skip(param2).limit(param3).toArray(function(err,result){
					if(err) throw err;
					callback(err,result)
					db.close()
				})
		}
	})
}
