const express = require("express")
const yargs = require("yargs")
const app = express()

const args = yargs
.usage('Usage: node $0 [option]')
.version('0.0.1')
.help('help')
.alias('help','h')
.alias('version','v')
.option('Delay', {
       describe: 'Интервал времени вывода даты, в секундах',
       default: '1'      
})
.alias('Delay','d')
.option('Limit', {
       describe: 'Общий промежуток времени вывода даты, в секундах',
       default: '10'      
})
.alias('Limit','l')
.argv

let connections = []
const delay = args.Delay*1000
const limit = args.Limit

app.get("/", (req,res,next) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")
    connections.push(res)
})

let tick = 0

setTimeout(function clock() {
    let curdate = new Date()
        
        date = curdate.getDate()
        year = curdate.getFullYear() 
       month = curdate.getMonth() 
        hours = curdate.getHours() 
        minutes = curdate.getMinutes()  
        seconds = curdate.getSeconds()

        console.log('Time:' + hours + ':' + minutes + ':' + seconds);

    if(++tick > limit) { 
       connections.map(res => {
        res.write(` END - Текущая дата: ${year} . ${month} . ${date}  Текущее время: ${hours} : ${minutes} : ${seconds}.\n`)
        res.end();
       })
       connections = []
       tick = 0
       console.log('Дата:' + year + ':' + month + ':' + date + '-- Время:' + hours + ':' + minutes + ':' + seconds);
       process.exit()
    }
       connections.map((res) => {
        res.write(`Time: ${hours} : ${minutes}: ${seconds}.\n`)
       })
       setTimeout(clock, delay)
}, delay)

app.listen(3000, () => {
    console.log("server running")
})

