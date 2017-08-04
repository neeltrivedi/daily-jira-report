const JiraApi = require('jira').JiraApi
const bluebird = require('bluebird');
const moment = require('moment')
const jsonfile = require('jsonfile')
const path = require('path')
const os = require('os')
const JSON5 = require('json5')
const fse = require('fs-extra')
const convertToCsv = require('./convertToCsv')
const sendEmail = require('./sendEmail')

const configPath = path.join(__dirname, 'config')
const privateConfigPath = path.join(os.homedir(), '.sercojira')
const privateConf = JSON5.parse(fse.readFileSync(privateConfigPath, 'UTF8'))
const localConf = jsonfile.readFileSync(path.join(configPath, 'config.json'))
const config = Object.assign({}, localConf, privateConf)
const yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');

if (localConf.user || localConf.password) {
    console.error('Do not put username or password in local config/jira.json. Put them in ' + privateConfigPath);
    process.exit(1);
}

const jira = new JiraApi(config.protocol, config.host, config.port, config.user, config.password, config.apiVersion)

/* Search JIRA using jql query */
const searchData = jsonfile.readFileSync(path.join(configPath, 'searchJira.json'))
// searchData.searchString = `${searchData.searchString} ( ${yesterdayDate} )`;

const searchAsync = bluebird.promisify(jira.searchJira.bind(jira));
searchAsync(searchData.searchString1, searchData.optional)
    .then(search => {
        if (search.total) {
            return convertToCsv(search.issues, yesterdayDate, searchData.filename1)
        } else {
            return {
                total: 0,
                date: yesterdayDate
            }
        }
    })
    .then(convertResult => sendEmail(config, convertResult, 'Test Execution'))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

searchAsync(searchData.searchString2, searchData.optional)
    .then(search => {
        if (search.total) {
            return convertToCsv(search.issues, yesterdayDate, searchData.filename2)
        } else {
            return {
                total: 0,
                date: yesterdayDate
            }
        }
    })
    .then(convertResult => sendEmail(config, convertResult, 'Test Scenario'))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
