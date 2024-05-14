const http = require('http')
const url = require('url')


const server = http.createServer((req, res) => {
    const path = url.parse(req.url)
    console.log(path)

    if (path.pathname === '/') {
        res.writeHead(200, {
            'Content-Type': "text/html"
        })
        res.end('Welcome Home')
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        })
        res.end('Page not found')
    }
})


server.listen(8080, '127.0.0.1', () => {
    console.log('Server Active at port 8080')
})