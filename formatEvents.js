const schedule = require('./schedule.json');
const result = {};

schedule.forEach(group => {
  result[group.id] = group.name;
});

console.log(result);
