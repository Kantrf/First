const yargs = require('yargs')
const path = require('path')
const util = require("util");
const fs = require("fs");

const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const copyFile = util.promisify(fs.copyFile);
const stat = util.promisify(fs.stat);
const rm = util.promisify(fs.rm);
const mkdir = util.promisify(fs.mkdir);

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

async function createDir(folder) {
    try {
          await stat(folder)
        } catch (err) {
          await  mkdir(folder)
        }   
 }


async function sort(folder) {
  try {
   const files = await readdir(folder) 
      for (const file of files) {
         const currPath = path.resolve(folder, file)
         let stats = await stat(currPath)
         if (stats.isDirectory())                  
            await sort(currPath)
         else 
            await createDir(confPath.end)
            const innerPath = path.resolve(confPath.end, path.basename(currPath)[0].toUpperCase())
            await createDir(innerPath.toUpperCase())
            if (!stats.isDirectory()) {
            await copyFile(currPath, path.resolve(innerPath, path.basename(currPath)))
            }
      }  
    }  catch (err) {throw err}          
 
}


 let fold = confPath.beg
 let del  = async function (fold) {
    await sort(confPath.beg)
    if (confPath.Del==true) {

     let files = await readdir(fold)

    for (const file of files) {
        const currPath = path.resolve(fold, file)
        let sta = await stat(currPath)
   
        if (sta.isDirectory())                 
            await  del(currPath);
        else 
            await unlink(path.resolve(currPath))
     }               
     await rm(fold, {recursive:true})
    }
 }
 del(fold)


