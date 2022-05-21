// to be run in node separately in order to print out the needed SQL script. 
// ONLY do for small datasets! There is probably a better way! TBD!

const villains = require('./villains.js')

for (let villain of villains) {
  console.log(`INSERT into villains (name, movie, slug) VALUES ('${villain.name}', '${villain.movie}', '${villain.slug}');`) // eslint-disable-line
}
