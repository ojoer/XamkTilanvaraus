/*eslint-disable*/ 

const winston = require('winston');
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: true
    })
  ]
});

exports.setLogger = function(newLogger) {
  // newLogger.extend(logger);
};

exports.getLogger = function(){
  return logger;
};
