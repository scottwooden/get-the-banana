// Require all tasks from tasks dir
var requireDir = require('require-dir');

requireDir('./gulp/tasks', { recurse: true });
