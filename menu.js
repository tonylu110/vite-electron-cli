module.exports = function (name) {
  return [
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
    },
    {
      type: 'list',
      name: 'pm',
      message: 'choose your package manager',
      choices: [
        'npm',
        'yarn',
        'pnpm'
      ]
    }
  ]
}