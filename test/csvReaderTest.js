const csv = require('csv')
const fs = require('fs')

// Read input file
const readableStream = fs.createReadStream('./dmc')
readableStream.setEncoding('utf8')
    .pipe(process.stdout)

// Fake results object from the database
let results = [ 
    { sensor: "TZ000002", caldue: "23/06/19" }, 
    { sensor: "TZ000003", caldue: "10/08/18" }
]

// Write results to output file
const writeStream = fs.createWriteStream('./dmc.csv')
writeStream.once('open', (fd) => {
    for (const element of results) {
        // Write each object as a line in the csv file
        writeStream.write(`${element.sensor}, ${element.caldue}\n`)
     }  
     writeStream.end()
})


// csv.parse()
// csv.generate({seed: 1, columns: 2, length: 20}, function(err, data) {
//     csv.parse(data, function(err, data) {
//         csv.transform(data, function(data) {
//             return data.map(function(value) {return value.toUpperCase()})
//         }, function(err, data) {
//             csv.stringify(data, function(err, data) {
//                 process.stdout.write(data);

//             })
//         })
//     })
// })

// csv.generate({seed: 1, columns: 2, length: 20})
//     .pipe(csv.parse())
//     .pipe(csv.transform((record) => {
//         return record.map((value) => { 
//           return value.toUpperCase() 
//         })   
//     }))
//     .pipe(csv.stringify())
//     .pipe(process.stdout);


