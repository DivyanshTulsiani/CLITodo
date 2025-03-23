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
    .option('--due <add potential deadline>','add date of operation')
    .option('--status <completed|incomplete>','Status of your Todo task')
    .action(function(str,options){
      readtodos().then(function(data){
        currarray = data;
        let newtodo = {
          Task : str,
          Status : 'Incomplete',
          Id : currarray.length + 1,
          Date : 'Not Fixed'
        }
        if(options.status){
          newtodo.Status = options.status;
        }
        if(options.due){
          newtodo.Date = options.due;
        }
        currarray.push(newtodo)
        writetodos(currarray).then(function(){
          console.log(chalk.bold.green("Your Todo has Succesfully been ADDED"));
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

  program.command('getalltodos')
  .description('Logs All Todo that the user has')
  .action(function(){
    readtodos().then(function(data){
      currarray = data;
      console.log(currarray);
    });
    console.log(chalk.bold.green('YOUR TODOS ARE AS FOLLOWS'))
    console.log(currarray);
  })

function todoindexfinder(id,array){
  for(let i =0;i<array.length;i++){
    if(array[i].Id === id){
      return i;
    }
  }
  return -1;
}


  program.command('delete')
.description('Deletes a specific Todo based on the ID given')
.argument('<task_id>','enter the unique ID of the task You want to delete')
.action(function(str){
  let array = []
  readtodos().then(function(data){

      array = data;
  })
  let index =todoindexfinder(parseInt(str),array);
  if(index === -1){
    console.log(chalk.red('TODO NOT FOUND'));
  }

  readtodos().then(function(data){
    currarray = data;
    currarray.splice(index,1);
    writetodos(currarray).then(function(){
      console.log(chalk.bold.green("YOUR TODO HAS BEEN DELETED SUCCESSFULLY"));
    })
    .catch(function(){
      console.log(chalk.bold.red('AN ERROR OCCURED WHILE WRITING TO FILE'))
    })
  })
  .catch(function(){
    console.log(chalk.bold.red('AN ERROR OCCURED WHILE READING FILE'))
  })
})



program.command('deleteall')
.description('Deletes all todos at once')
.action(function(){
  readtodos().then(function(data){
    currarray = [];
    writetodos(currarray).then(function(){
      console.log(chalk.red("Deleting All your Todo's....."))
      console.log(chalk.yellow("Your Todo's have Succesfully been Deleted"))
    })
  })
  .catch(function(){
    console.log(chalk.red("An ERROR Ocurred while reading your file"))
  })
})
  program.parse();