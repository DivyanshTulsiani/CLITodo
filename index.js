const { Command } = require('commander');
const chalk = require('chalk').default || require('chalk');
const fs = require('fs');
const { title } = require('process');
const program = new Command();

 program 
 .name(chalk.bold.green('CLI-Based-Todo'))
 .description(chalk.bold.yellow('CLI based todo tool to manage your todos on the terminal'))
 .version('1.0.0');
const FILENAME = 'todos.json'
let todoarray = []

readtodos().then(function(data){
  todoarray = data;
});

function readtodos(){
  return new Promise(function(resolve,reject){
      fs.readFile(FILENAME,'utf-8',function(err,data){
        if(!err){
          resolve(JSON.parse(data) || []);
        }
        else{
          reject(err);
        }
    });
  })
}

function writetodos(data){
  return new Promise(function(resolve,reject){
    fs.writeFile(FILENAME,JSON.stringify(data),function(err){
      if(!err){
        resolve();
      }
      else{
        reject();
      }
    })
  })
} 

let currarray = [];
 program.command('addtodo')
    .description('Adds a todo in the todos file')
    .argument('<task_description>','file to put todos in')
    .action(function(str){
      readtodos().then(function(data){
        currarray = data;
        let newtodo = {
          task : str,
          status : 'Incomplete',
          id : currarray.length + 1
        }
        currarray.push(newtodo)
        writetodos(currarray).then(function(){
          console.log(chalk.bold.green("Your Todo has Succesfully been UPDATED"));
        })
        .catch(function(err){
          console.log(chalk.red("Your todo was not Pushed due to ERRORS"));
        })  
      })
      .catch(function(err){
        console.log(chalk.red("Warning "));
      })
    }
  )


  program.parse();