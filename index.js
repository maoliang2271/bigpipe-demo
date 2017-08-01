const http = require('http');
const opn = require('opn');
const utils = require('./utils');
const port = process.env.port || 2271;

function handler (req, res) {
    let url = req.url;
    if (url.includes('static')) {
        utils.readStaticFile(url)
        .then((data) => {
            res.writeHead(200, {'Content-Type': utils.suffix2Type(url)});
            res.end(data);
        })
        .catch((err) => {
            res.writeHead(500);
            res.end('server internal error');
        })
    } else {
        res.writeHead(200, {
            'Content-Type': utils.suffix2Type(url),
            'Transfer-Encoding': 'chunked'  // 告诉浏览器分块渲染
        });
        res.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>bigpipe-demo</title>
                    <link rel="stylesheet" type="text/css" href="/static/index.css">
                    <script type="text/javascript" src="/static/bigpipe.js"></script>
                </head>
                <body>
                    <div id="pagelet-header">appshell-头部</div>
                    <div id="pagelet-main">appshell-主体</div>
                    <div id="pagelet-footer">appshell-尾部</div>
        `);
        // 异步数据
        utils.asyncData().then(() => {
            res.write(`<script>bigpipe.pageletArrive('pagelet-header', 'pipe-->头部组件')</script>`);
            return utils.asyncData(1500);
        }).then(() => {
            res.write(`<script>bigpipe.pageletArrive('pagelet-main', 'pipe-->主体组件')</script>`);
            return utils.asyncData(2000);
        }).then(() => {
            res.write(`<script>bigpipe.pageletArrive('pagelet-footer', 'pipe-->尾部组件')</script>`);
            res.end('</body></html>');
        });
    }
}

http.createServer(handler).listen(port, () => {
    const url = `http://localhost:${port}`;
    console.warn(`server started at localhost: ${url}`);
    opn(url);
});