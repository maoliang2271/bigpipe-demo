const http = require('http');
const opn = require('opn');
const utils = require('./utils');
const port = process.env.PORT || 2271;

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
            res.end(`server has meet a error:$(JSON.stringify(err))`);
        })
    } else {
        res.writeHead(200, {
            'Content-Type': utils.suffix2Type(url),
            'Transfer-Encoding': 'chunked'  // 告诉浏览器分块渲染
        });
        // 返回layout
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
                    <script>
                        var timeS = Date.now();window.addEventListener('DOMContentLoaded', function() { console.log(new Date()-timeS); });
                        document.addEventListener('click', function(e) { if(e.target.id === 'btn') alert('hi') });
                    </script>
        `);
        // 模拟异步数据，拼装模板
        let p1 = utils.asyncData(1500).then(() => {
            res.write(`<script>bigpipe.pageletArrive('pagelet-header', 'pipe-->头部组件<button type="button" id="btn">按钮</button>')</script>`);
        })
        let p2 = utils.asyncData().then(() => {
            res.write(`<script>bigpipe.pageletArrive('pagelet-main', 'pipe-->主体组件')</script>`);
            return utils.asyncData(4000);
        }).then(() => {
            res.write(`<script>bigpipe.pageletArrive('pagelet-footer', 'pipe-->尾部组件')</script>`);
        });
        Promise.all([p1, p2]).then(() => {
            // 结束响应
            res.end('</body></html>');
        });
    }
}

http.createServer(handler).listen(port, () => {
    const url = `http://localhost:${port}`;
    console.warn(`server started at localhost: ${url}`);
    opn(url);
});