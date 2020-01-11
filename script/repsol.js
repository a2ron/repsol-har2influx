'use strict';

const fs = require('fs');

const testFolder = './har/';

fs.readdir(testFolder, (err, files) => {

    let output = [];
    files.forEach(inputFileName => {
        if (inputFileName.indexOf(".har") == inputFileName.length - 4) {
            let rawdata = fs.readFileSync(`${testFolder}/${inputFileName}`);
            JSON.parse(rawdata).log.entries.forEach(element => {
                let date = element.request.queryString[0].value.replace(/%2F/g, "-");
                let consumos = JSON.parse(element.response.content.text).data.Consumos;

                consumos.forEach(consumo => {
                    consumo.date = date;
                    if (consumo.Total_kWh_Cons == null) { //managing null values
                        consumo.Total_kWh_Cons = 0;
                    }
                    if (consumo.Hora == 25) {
                        if (consumo.Total_kWh_Cons != 0)
                            console.error(`[WARNING]: Ignored ${consumo.date} hour ${consumo.Hora}: ${consumo.Total_kWh_Cons}`);
                    } else {
                        output.push(consumo);
                    }

                })
            });
        }
    })

    // REMOVE REPEATED
    let unique = {};
    let Total_kWh_Cons = [];
    output.forEach(item => {
        let key = `${item.date}T${item.Hora}`;
        if (unique[key] == undefined) {
            unique[key] = item;
            Total_kWh_Cons.push(item.Total_kWh_Cons);
        }
        else{
            if(item.Total_kWh_Cons != unique[key].Total_kWh_Cons){
                console.error(`[WARNING]: More than 1 value for ${item.date} hour ${item.Hora}`);
            }
        }
    })
    console.error(`[INFO]: Read hours: ${Total_kWh_Cons.length}`)
    Total_kWh_Cons = Total_kWh_Cons.sort((a, b) => b - a).slice(0, 10);
    console.error(`[INFO]: Max: ${Total_kWh_Cons} ...`);


    //WRITE TO FILE
    // let data = JSON.stringify(unique);
    // fs.writeFileSync('data.json', data);

    console.log(`# DDL
CREATE DATABASE repsol

# DML
# CONTEXT-DATABASE: repsol
`);

    Object.keys(unique).forEach(key => {
        let item = unique[key];
        let dateParts = item.date.split("-");

        let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], item.Hora - 1, 0, 0, 0);
        let ts = `${date.getTime()*1000000}`;
        console.log(`consumo,type=number Total_kWh_Cons=${item.Total_kWh_Cons} ${ts}`)
    })
});