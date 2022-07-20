
// generic customizable script for writing CSVs
const pool = require('../pool');

const fs = require('fs');
const path = require('path');
const { writeToPath } = require('@fast-csv/format');


const date = new Date();
const year = date.getFullYear();
const month = date.getMonth()+1;
const day = date.getDate();
const csvName = `test.csv`;
const exportPath = `../${year}/${month}/${day}/`;

const runQueriesWriteCsv = async () => {
   

        let queryTofindDataForCsv = `SELECT
        
         
   `;
        let results4 = await pool.promise().query(queryTofindDataForCsv).catch(err => { throw err });
        let { ...returns4 } = JSON.parse(JSON.stringify(results4));


        const makedir = () => {
            try {
                fs.mkdir(`${exportPath}`, (error) => {
                    if (error) {
                        console.log(`Folder ${exportPath} exists already.`)
                    } else {
                        console.log(`New folder ${exportPath} has been created.`)
                    }
                })
            } catch (err) {
                console.error(err)
            }
        }

        makedir();

        writeToPath(path.resolve(__dirname, `${exportPath}${csvName}`), returns4[0])
            .on('error', err => console.error(err))
            .on('finish', () => console.log(`Done writing ${returns4[0].length} lines to ${exportPath}${csvName}`));

        console.log(returns4);       
        console.log('length of query 4 returns: ', returns4[0].length);
         //this next line will open the folder in file explorer
         require('child_process').exec(`start C:\\Users\\User\\Documents\\Ultracanadian\\${year}\\${month}\\${day}\\`);

        
 //process.exit();
}

runQueriesWriteCsv();
