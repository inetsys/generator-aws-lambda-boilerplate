'use strict';

var AWS = require('aws-sdk');
AWS.config.region = 'eu-central-1';

if ( typeof process.env.LAMBDA_DEV_PROFILE != 'undefined' ) {
    var creds = new AWS.SharedIniFileCredentials({profile: process.env.LAMBDA_DEV_PROFILE});
    AWS.config.credentials = creds;
    AWS.config.credentials = new AWS.TemporaryCredentials({
        RoleArn: process.env.LAMBDA_DEV_ROLE_ARN,
    });
}

/**
 * Event example in event.json
 * Context: http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 */
exports.handler = function(event, context) {
    if (event.source == 'aws.events' && context.getRemainingTimeInMillis() > 0) {
        console.log(event);
        context.done(null, 'Success!');
    }
};
