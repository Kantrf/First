const express = require("express")

const app = express()

let connections = []
const delay = process.argv[2] || 1000
const limit = process.argv[3] || 10

console.log(limit)
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

