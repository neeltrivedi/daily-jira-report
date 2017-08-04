const jsoncsv = require('json-csv')
const fs = require("fs")
const es = require("event-stream")
const path = require('path');

function convertToCsv(issues, date, filename) {
    const dataPath = path.join(__dirname, "data");
    for (let issue of issues) {
        issue.fixVersions = (issue.fields.fixVersions || []) // [{value:"MELT1", value:"MELT2"}]
            .map(fv => fv.name) // ["MELT1", "MELT2"]
            .join("|");

        issue.customfield_10304 = (issue.fields.customfield_10304 || []) // [{value:"MELT1", value:"MELT2"}]
            .map(cf => cf.value) // ["MELT1", "MELT2"]
            .join("|");

        issue.blocksIssues = (issue.fields.issuelinks || []) // [{value:"MELT1", value:"MELT2"}]
            .filter(bi => bi.outwardIssue && bi.type.name === "Blocks")
            .map(bi => bi.outwardIssue.key) // ["MELT1", "MELT2"]
            .join("|");

        issue.executesIssues = (issue.fields.issuelinks || []) // [{value:"MELT1", value:"MELT2"}]
            .filter(ei => ei.outwardIssue && ei.type.name === "Executes")
            .map(ei => ei.outwardIssue.key) // ["MELT1", "MELT2"]
            .join("|");

        issue.relatesIssues = (issue.fields.issuelinks || []) // [{value:"MELT1", value:"MELT2"}]
            .filter(ri => ri.outwardIssue && ri.type.name === "Relates")
            .map(ri => ri.outwardIssue.key) // ["MELT1", "MELT2"]
            .join("|");

        issue.customfield_10412 = (issue.fields.customfield_10412 || []) // [{value:"MELT1", value:"MELT2"}]
            .map(cf1 => cf1.name) // ["MELT1", "MELT2"]
            .join("|");
    }

    const options = {
        fields: [{
                name: 'fields.issuetype.name',
                label: 'Issue Type'
            },
            {
                name: 'key',
                label: 'Issue Key'
            },
            {
                name: 'id',
                label: 'Issue Id'
            },
            {
                name: 'fields.summary',
                label: 'Summary'
            },
            {
                name: 'fields.assignee.name',
                label: 'Assignee'
            },
            {
                name: 'fields.priority.name',
                label: 'Priority'
            },
            {
                name: 'fields.status.name',
                label: 'Status'
            },
            {
                name: 'blocksIssues',
                label: 'Outward issue link (Blocks)'
            },
            {
                name: 'executesIssues',
                label: 'Outward issue link (Executes)'
            },
            {
                name: 'relatesIssues',
                label: 'Outward issue link (Relates)'
            },
            {
                name: 'fields.resolution.name',
                label: 'Resolution'
            },
            {
                name: 'fields.created',
                label: 'Created'
            },
            {
                name: 'fields.updated',
                label: 'Updated'
            },
            {
                name: 'fixVersions',
                label: 'Fix Version/s'
            },
            {
                name: 'customfield_10412',
                label: 'Custom field (Component Version(s) Under Test)'
            },
            {
                name: 'customfield_10304',
                label: 'Environment'
            }
        ]
    }

    const fileName = filename;
    const filepath = `${dataPath}/${fileName}`;
    return new Promise((resolve, reject) => {
        es.readArray(issues)
            .pipe(jsoncsv.csv(options))
            .pipe(fs.createWriteStream(filepath, {
                encoding: 'utf8'
            }))
            .on('error', reject)
            .on('finish', () => {
                resolve({
                    total: issues.length,
                    fileName,
                    filepath,
                    date
                });
            })
    });

}

module.exports = convertToCsv;
