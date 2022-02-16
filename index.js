#! /usr/bin/env node

const figlet = require('figlet');
const arg = require('arg');
const knex = require('knex')({client:'pg'})
const csvReader = require('@pharzan/csv-reader');
const fs = require('fs');


console.log(figlet.textSync('CSV to SQL'))
const cli = require("commander");
const insert = async (args)=>{
    const {input, table, columns} = args;
    console.log(columns)
    const csvs = await csvReader({
        file: input,
        hasHeaders: true,
        delimeter: ',',
        endingLineSeperator: '\n'
    })
    
    const csvContent = csvs.getAllColumns()
    const csvHeaders = csvs.getHeaders()
    csvContent.forEach(async (row)=>{
        const data = {}
        for(i=0;i<row.length;i++){
            data[csvHeaders[i]] = row[i]
        }
        const q = knex(table).insert(data).toString()+';'
        console.log(q)

    })
}

cli.description("Parse a CSV file and convert to SQL");
cli.name("csvtosql");
cli.usage("<command>");
cli.addHelpCommand(false);
cli.helpOption(false);

cli
  .command("insert")
  .option("-i, --input [filename]", "name of the input file")
  .option("-o, --output [filename]", "name of the output file")
  .option("-t, --table [tablename...]", "name of the table to be inserted to")
  .option("-cn, --columns [numbers...]", "name of the table to be inserted to")

  .description(
    "creates a SQL file with insert statements from a CSV file"
  )
  .action(insert);

cli.parse(process.argv);

