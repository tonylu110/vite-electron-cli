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
const menu = require('./menu')

program.version(packData.version)
program.command('create <name>')
  .description('create a vite + vue3 + electron template')
  .action(name => {
    console.log(chalk.blue(`create ${name} of vite + vue3 + electron template`))
    const spinner = ora('waiting ')
    inquirer.prompt(menu(name)).then(answers => {
      let gitUrl = `https://${answers.sm.toLowerCase()}.com/tonylu110/vite-vue-electron.git`
      spinner.start()
      if (answers.mica) {
        gitUrl = `https://${answers.sm.toLowerCase()}.com/tonylu110/vite-vue-electron-mica.git`
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
          name: answers.name,
          pm: answers.pm + `${answers.pm === 'npm' ? ' run' : ''}`
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
        console.log(`${answers.pm} install`)
        console.log(`${answers.pm} ${answers.pm === 'npm' ? 'run ' : ''}electron:serve`)
        console.log('')
      })
    })
  })
program.parse(process.argv)