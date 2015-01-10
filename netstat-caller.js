var exec = require('child_process').exec;
var os = require('os');

setInterval(function(){
    exec('netstat -an',
        function (error, stdout, stderr) {
            console.log(stdout);
        }
    );
}, 500);