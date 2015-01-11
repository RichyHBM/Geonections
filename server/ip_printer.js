var exec = require('child_process').exec;

var stdoutput = function (error, stdout, stderr) {
    console.log(stdout);
};

//call netstat every 0.5 seconds
setInterval(function(){
    exec('netstat -an', stdoutput);
}, 500);

//You could monitor a log file instead
//exec('tail -f /some/log/file.log | grep SOMETHING', stdoutput);