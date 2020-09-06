const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/*
const textIn = fs.readFileSync('./txt/input.txt','utf-8');
//console.log(textIn);

const textOut = `This is what we know about the Avocado: ${textIn}\nCreated on ${Date.now()}`
fs.writeFileSync('./txt/output.txt',textOut);
//console.log('File written Successfully');

fs.readFile('./txt/start.txt','utf-8', (err,data1)=>{
    if(err) return console.log(err);
    
    fs.readFile(`./txt/${data1}.txt`,'utf-8', (err,data2)=>{
        //console.log(data2);
        fs.readFile('./txt/append.txt','utf-8', (err,data3)=>{
            //console.log(data3);
            fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err =>{
                
            });
            });
        });
});
console.log("will read file!");*/

//Load HTML Pages 
const overviewPage = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const cardPage = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const productPage = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

//Load Data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const productData = JSON.parse(data);
const slugs = productData.map(el => slugify(el.productName, {
    lower: true
}));

const server = http.createServer((Req, Res) => {
    const {
        query,
        pathname
    } = url.parse(Req.url, true);
    
    //Overview Page
    if (pathname === '/' || pathname === '/overview') {
        Res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const cards = productData.map(el => replaceTemplate(cardPage, el));
        const output = overviewPage.replace(/{%PRODUCT_CARDS%}/g, cards);              
        Res.end(output);

        //Product Page
    } else if (pathname === '/product') {
        Res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = productData[query.id];
        const output = replaceTemplate(productPage, product);
        Res.end(output);

        //API Page
    } else if (pathname === '/api') {
        Res.writeHead(200, {
            'Content-type': 'application/json'
        });
        Res.end(data);

        //Not Found Page
    } else {
        Res.writeHead(404);
        Res.end('<h1>Page Not Found!</h1>');
    }
});
const port = 3000 || process.env.PORT;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});