/* eslint-disable */

var fs = require('fs')

// File "destination.txt" will be created or overwritten by default.
fs.copyFile('../prisma/schema.prisma', 'dist/schema.prisma', (err) => {
  if (err) throw err
  console.log('schema.prisma was copied to dist')
})