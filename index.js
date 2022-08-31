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
    console.log(chalk.blue(`create ${name} of vite + vue3 + electron template`))
    const spinner = ora('waiting ')
    inquirer.prompt([
      {
        type: 'list',
        name: 'sm',
        message: 'use whitch Source Mirror',
        choices: [
          'GitHub',
          'Gitee'
        ]
      },
      {
        type: 'input',
        name: 'name',
        message: 'your project name',
        default: name
      }
    ]).then(answers => {
      let gitUrl = 'https://github.com/tonylu110/vite-vue-electron.git'
      spinner.start()
      if (answers.sm === 'Gitee') {
        gitUrl = 'https://gitee.com/tonylu110/vite-vue-electron.git'
      }
      download(gitUrl, `./${name}`, (err) => {
        if (err) {
          console.log(`${ls.error}${chalk.red(`download template error`)}`)
          spinner.stop()
          return
        }
        const packageJson = `${name}/package.json`
        const packageContent = fs.readFileSync(packageJson, 'utf-8')
        const packageResult = handlebars.compile(packageContent)({
          name: answers.name
        })
        fs.writeFileSync(packageJson, packageResult)
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
    })
  })
program.parse(process.argv)