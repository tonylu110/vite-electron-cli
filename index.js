#!/usr/bin/env node
const { program } = require('commander')
const shell = require('shelljs')
const download = require('git-clone')
const ls = require('log-symbols')
const ora = require('ora')
const chalk = require('chalk')
const packData = require('./package.json')
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const fs = require('fs')

program.version(packData.version)
program.command('create <name>')
  .description('create a vite + vue3 + electron template')
  .action(name => {
    const gitUrl = 'https://github.com/tonylu110/vite-vue-electron.git'
    const spinner = ora('waiting ')
    spinner.start()
    download(gitUrl, `./${name}`, (err) => {
      if (err) {
        console.log(`${ls.error}${chalk.red(`download template error`)}`)
        spinner.stop()
        return
      }
      inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'please input your project name'
        }
      ]).then(answers => {
        const packageJson = `${name}/package.json`
        const packageContent = fs.readFileSync(packageJson, 'utf-8')
        const packageResult = handlebars.compile(packageContent)(answers)
        console.log(packageResult);
      })
      shell.rm('-rf', `${name}/.git`)
      shell.rm('-rf', `${name}/pnpm-lock.yaml`)
      shell.rm('-rf', `${name}/LICENSE`)
      spinner.stop()
      console.log('')
      console.log(`${ls.success}${chalk.green(`create template success`)}`)
      console.log('you can run ')
      console.log('')
      console.log(`cd ${name}`)
      console.log('')
      console.log('npm install')
      console.log('npm run electron:server')
      console.log('')
    })
    console.log(chalk.blue(`create ${name} of vite + vue3 + electron template`))
  })
program.parse(process.argv)