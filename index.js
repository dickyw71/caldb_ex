var oracledb = require('oracledb');

console.time('db-connect-select-release');
console.time('db-connect');
// Get a non-pooled connection
oracledb.getConnection(
    {
      user          : 'MDS_DEV4',
      password      : 'Pa55word',
      connectString : '192.168.56.101/CALDB'
    },
    function(err, connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.timeEnd('db-connect');
      console.time('db-select');
      connection.execute(
        // The statement to execute
        `SELECT bar_code as barcode
            , cert_no 
            , cal_due_date
        FROM sensor s 
        JOIN sensor_calibration sc 
            ON(s.sensor_id = sc.sensor_id)
        WHERE bar_code = :barcode`,
  
        // The "bind value" is null
        ['TZ000014'],
  
        // execute() options argument.  Since the query only returns one
        // row, we can optimize memory usage by reducing the default
        // maxRows value.  For the complete list of other options see
        // the documentation.
        { maxRows: 1
          , fetchInfo : {
            "CAL_DUE_DATE": { type : oracledb.STRING }
          }
          //, outFormat: oracledb.OBJECT  // query result format
          //, extendedMetaData: true      // get extra metadata
          //, fetchArraySize: 100         // internal buffer allocation size for tuning
        },
  
        // The callback function handles the SQL execution results
        function(err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }
          console.timeEnd('db-select');
          console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
          console.log(result.rows);     // [ [ 180, 'Construction' ] ]
          console.time('db-release');
          doRelease(connection);
        });
    });
  
  // Note: connections should always be released when not needed
  function doRelease(connection) {
    connection.close(
      function(err) {
        if (err) {
          console.error(err.message);
        }
        console.timeEnd('db-release');
        console.timeEnd('db-connect-select-release');
      });
  }