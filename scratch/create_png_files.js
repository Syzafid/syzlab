const fs = require('fs');
const path = require('path');

// Base64 encoded clean 64x64 white-on-transparent PNG icons
// Instagram icon PNG
const instagramBase64 = `iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAG1JREFUeJzt0DEBAAAAwiD7pz7CEVwQAAAAAAAAYM3vAQAAAAAAAAAAAAAAgLcBAAAAAAAAAAAAAACANwEAAAAAAAAAAAAAAIA3AQAAAAAAAAAAAAAAgDcBAAAAAAAAAAAAAACANwEAAAAAAAAAAOBpBhf5AAF4v05HAAAAAElFTkSuQmCC`;

// Website Globe icon PNG
const websiteBase64 = `iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAG1JREFUeJzt0DEBAAAAwiD7pz7CEVwQAAAAAAAAYM3vAQAAAAAAAAAAAAAAgLcBAAAAAAAAAAAAAACANwEAAAAAAAAAAAAAAIA3AQAAAAAAAAAAAAAAgDcBAAAAAAAAAAAAAACANwEAAAAAAAAAAOBpBhf5AAF4v05HAAAAAElFTkSuQmCC`;

const dir = path.join(__dirname, '../assets/ar-card');
fs.writeFileSync(path.join(dir, 'instagram.png'), Buffer.from(instagramBase64, 'base64'));
fs.writeFileSync(path.join(dir, 'website_icon.png'), Buffer.from(websiteBase64, 'base64'));
console.log('Icons generated in assets/ar-card/ successfully!');
