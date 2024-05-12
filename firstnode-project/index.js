// IMPORTING NECCESSARY MODULES TO CREATE A SERVER, READ FILES FROM DEVICE, AND WORK WITH BROSWER URL
const fs = require('fs')
const http = require('http');
const url = require('url');

//LOADING DOCUMENT SYNCHRONOUSLY AS IT'S NECCSSARY TO LOAD THE JUST ONCE. [ASYNC WON'T WORK FOR THIS METHOD]
const jsonData = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8')
const data = JSON.parse(jsonData)
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const cardTemplate = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')

// FUNCTION TO REPLACE PLACEHOLDER IN HTML FILE, WITH DYNAMIC CONTENT
function replaceTemp(temp, obj) {
    let output = temp.replace(/{%PRODUCTNAME%}/g, obj.productName)
    output = output.replace(/{%IMAGE%}/g, obj.image)
    output = output.replace(/{%QUANTITY%}/g, obj.quantity)
    output = output.replace(/{%PRODUCT_PRICE%}/g, obj.price)
    output = output.replace(/{%NUTRIENT%}/g, obj.nutrients)
    output = output.replace(/{%LOCATION%}/g, obj.from)
    output = output.replace(/{%DESCRIPTION%}/g, obj.description)
    output = output.replace(/{%ID%}/g, obj.id)
    if (!(obj.organic)) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }

    return output
}

// REUSABLE FUNCTION TO RENDER HOMEPAGE
const homepageFile = (res, temp) => {
    // SETTING RESPONSE HEADER
    res.writeHead(200, {
        // SETTING THE CONTENT TYPE OF PAGE REQUEST.
        'Content-type': 'text/html'
    })
    const cardCollection = data.map((ele) => {
       const response = replaceTemp(cardTemplate, ele)
       return response
    }).join()

    let mainOutput = temp.replace(/{%PRODUCT_CARDS%}/g, cardCollection)
    // SENDING RESPONSE TO BROWSER
    res.end(mainOutput) 
}

// SERVER CREATION AND ROUTING
const server = http.createServer((req, res) => {
    const {pathname, query} = url.parse(req.url, true)
    // ROUTING at it's simplest
    switch (pathname) {
        // HOMEPAGE
        case ('/'):
            homepageFile(res, overviewTemplate)         
            break;
        // SUBROUTE -- STILL HOMEPAGE
        case ('/overview'):
            homepageFile(res, overviewTemplate)          
            break;
        // PRODUCT PAGE
        case ('/product'):
            res.writeHead(200, {
                'Content-type': 'text/html'
            })
            // FETCHING SPECIFIC DATA FROM COLLECTION OF DATA
            const product = data[query.id]
            const response = replaceTemp(productTemplate, product)
            res.end(response)          
            break;
        // API at it's simplest form
        case ('/api'):
            res.writeHead(200, {
                // SETTING THE CONTENT TYPE OF AN API RESPONSE
                'Content-type': 'application/json'
            })
            res.end(jsonData)
            break;
        // HOW 404 PAGE IS BEEN IMPLEMENTED, PREPARING FOR UNAVAILABLE ROUTE.
        default:
            res.writeHead(404, {
                'Content-type': 'text/html'
            })
            res.end('<h1>Page not found 404!!</h1>')
            break;
    }
})

// PORT SETTING AND LISTENING FOR REQUEST FROM THE BROWSER
server.listen(8001, '127.0.0.1', () => {
    console.log('Listening to request on port 8001..');
})