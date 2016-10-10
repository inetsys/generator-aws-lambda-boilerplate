'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({


    prompting: function () {
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Lambda function name'
            },
            {
                type: 'input',
                name: 'profile',
                message: 'AWS developer profile',
                default: 'developer'
            },
            {
                type: 'input',
                name: 'role',
                message: 'AWS IAM Role for Lambda',
                default: 'RoleLambda'
            },
            {
                type: 'input',
                name: 'account',
                message: 'AWS Account'
            },
            {
                type: 'input',
                name: 'region',
                message: 'AWS region',
                default: 'eu-central-1'
            }
        ]).then(function (answers) {
            this.props = answers;
        }.bind(this));

    },
    writing: {
        files: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                this.props
            );
            this.fs.copy(
                this.templatePath('_index.js'),
                this.destinationPath('index.js')
            );
            this.fs.copy(
                this.templatePath('_.npmignore'),
                this.destinationPath('.npmignore')
            );
            this.fs.copyTpl(
                this.templatePath('_event.json'),
                this.destinationPath('event.json'),
                this.props
            );
            this.fs.copyTpl(
                this.templatePath('_README.md'),
                this.destinationPath('README.md'),
                this.props
            );
        },
        grunt: function () {
            this.gruntfile.loadNpmTasks('grunt-aws-lambda');
            this.gruntfile.insertConfig('lambda_invoke', '{ default : {} }');
            this.gruntfile.insertConfig('lambda_package', '{ default : {} }');
            var arn = ['arn','aws','lambda',this.props.region,this.props.account,'function',this.props.name].join(':');
            this.gruntfile.insertConfig('lambda_deploy', '{ default : { arn: \'' + arn + '\' }, options: { timeout:5, memory:128, profile: \''+this.props.profile+'\', region:\''+this.props.region+'\'} }');
            var role_arn = ['arn','aws','iam','eu-central-1',this.props.account,'role/'+this.props.role].join(':');
            this.gruntfile.insertConfig('lambda_dev', '{ aws_profile: \''+this.props.profile+'\', aws_role_arn: \''+role_arn+'\' }');
            this.gruntfile.registerTask('run', ['lambda_dev', 'lambda_invoke']);
            this.gruntfile.registerTask('deploy', ['lambda_package', 'lambda_deploy']);
            this.gruntfile.appendJavaScript('grunt.registerTask(\'lambda_dev\', \'Set dev environment flag\', function() { process.env.LAMBDA_DEV_PROFILE = grunt.config.get([\'lambda_dev\', \'aws_profile\']); process.env.LAMBDA_DEV_ROLE_ARN = grunt.config.get([\'lambda_dev\', \'aws_role_arn\']); });');
        }
    },
    install: function () {
        this.npmInstall();
    }

});
