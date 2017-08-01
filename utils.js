const path = require('path');
const fs = require('fs');

module.exports = {
    suffix2Type:  (url) => {
        let suffix = (url.includes('.') && url.replace(/.+\./, '')) || 'html';
        return {
            html: 'text/html',
            css: 'text/css',
            js: 'application/javascript',
        }[suffix] + ';charset=utf-8'
    },
    readStaticFile: (url) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, url), (err, data) => {
                if (err) return reject(err);
                resolve(data)
            });
        });
    },
    asyncData: (time = 1e3) => {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve();
            }, time);
        });
    }
}