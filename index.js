const yargs = require('yargs')
const path = require('path')
const fs = require("fs")
 
 const args = yargs
       .usage('Usage: node $0 [option]')
       .version('0.0.1')
       .help('help')
       .alias('help','h')
       .alias('version','v')
       .option('beg', {
              describe: 'Путь к начальной директории',
              demandOption: true      
       })
       .option('end', {
              describe: 'Путь к итоговой директории',
              default: './end'      
       })
       .option('d', {
              describe: 'Удалить начальную директорию?',
              default: 'false',
              boolean: true
       })
       .argv

const confPath = {
    beg: path.normalize(path.resolve(__dirname, args.beg)),
    end: path.normalize(path.resolve(__dirname, args.end)),
    Del: args.d
} 

function createDir(folder, cb) {
    // if (!fs.existsSync(folder)) {
     fs.stat(folder, (err)=>{
         if (!err) {
             cb()
         }
         else
          fs.mkdir(folder, (err) => {
             cb()
         })
     })
 }


function sort(folder, cb){
    fs.readdir(folder, (err, files) => {
       if (err) throw err
       files.forEach((file) => {
          const currPath = path.resolve(folder, file)

          fs.stat(currPath, (err, stat) => {
             if (err) throw err

             if (stat.isDirectory()) {                 
                 sort(currPath)
             }
             else {
                createDir(confPath.end, () => {
                    const innerPath = path.resolve(confPath.end, path.basename(currPath)[0])
                    createDir(innerPath, () => {
                        fs.copyFile(currPath, path.resolve(innerPath, path.basename(currPath)), (err) => {
                            if (err) throw err 
                        })              
                    })           

                })
             }
          })
       })
       //return cb(confPath.beg)
    
    })

}

sort(confPath.beg)

/*sort(confPath.beg, (fold) => {
    if (confPath.Del==true) {
     let files = [];
      fs.stat(fold, (err)=>{
        if (err) throw err

        files = fs.readdir(fold, (err, files) => {
            if (err) throw err
            files.forEach((file) => {
            const currPath = path.resolve(fold, file)
            fs.stat(currPath, (err, stat) => {
                if (err) throw err
   
                if (stat.isDirectory()) {                 
                    deleteFolder(currPath);
                } else {
                    fs.unlink(path.resolve(currPath), (err) => {
                        if (err) throw err
                     })
                }
            })
           })
           fs.rm(fold, {recursive:true}, (err) => {})
        })
       })
    }
})*/


