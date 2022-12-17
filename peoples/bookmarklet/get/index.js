const vandium = require('vandium');
const mysql  = require('mysql');

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });
    
    var tags = 0;
    if(event.tags){
      tags = event.tags;
    }     

    if(event.name && event.name != '' && event.key == '0p3nTECH'){
        
        var sql1 = "SELECT * FROM peoples WHERE url = " + connection.escape(event.url);
  
        connection.query(sql1, function (error, results1, fields) {     
          
          if(results1.length == 0){
          
            var sql = 'INSERT INTO peoples(name,description,url)  VALUES(' + connection.escape(event.name) + ',' + connection.escape(event.description) + ',' + connection.escape(event.url) + ')';
      
            connection.query(sql, function (error, results, fields) {
          
              var people_id = results.insertId;
              var sql3 = 'INSERT INTO peoples_tags(people_id,tag_id) SELECT ' + people_id + ',id FROM tags WHERE name IN(';
                      
              var tag_array = tags.split(',');    
              tags = '';
               for (let i = 0; i < tag_array.length; i++) {
                 tags += "'" + tag_array[i] + "',";
               }   
               tags = tags.substr(0, tags.length-1);
               
               sql3 = sql3 + tags + ")";
        
              connection.query(sql3, function (error, results, fields) {
            
                var response = {};
                response['id'] = people_id;
                response['name'] = event.name;
          
                callback( null, sql3 );
                
                });
              
              });
          }
          else{
            
            var response = {};
            response['id'] = results1;
            response['name'] = results1;
            
            callback( null, response );            
            
          }
    
        });
    }
    else{
        
      var response = {};
      response['id'] = 0;
      response['name'] = event.name;
      
      callback( null, event );
    }
});