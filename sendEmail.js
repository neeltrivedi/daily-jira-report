const email = require('emailjs');
const bluebird = require('bluebird');

function sendEmail(config, convertResult, title) {
    const totalIssues = convertResult.total;
    const yesterdayDate = convertResult.date;

    const server = email.server.connect({
        user: config.user,
        password: config.password,
        host: config.emailHost,
        tls: config.tls
    });

    const attachments = [{
        data: `<html><h3><u>Daily ${title} JIRA Report - ${yesterdayDate}</u></h3><big>Total ${title} records : <big><font size='5'>${totalIssues}</font></html>`,
        alternative: true
    }];
    if (totalIssues) {
        const filePath = convertResult.filepath;
        const fileName = convertResult.fileName;
        attachments.push({
            path: filePath,
            type: "application/csv",
            name: fileName
        });
    }
    const message = {
        text: "Daily JIRA Report",
        from: config.fromList,
        to: config.toList,
        cc: config.ccList,
        subject: `Daily ${title} JIRA Report`,
        attachment: attachments
    };

    const sendAsync = bluebird.promisify(server.send.bind(server));
    return sendAsync(message);
}

module.exports = sendEmail;
