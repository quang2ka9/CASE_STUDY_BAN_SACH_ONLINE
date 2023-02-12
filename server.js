const http = require('http');
const url = require('url');
const Handler = require('./controllers/Handle');
const qs = require("qs");
const fs = require('fs')


const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;

        switch (pathName) {
            case '/':
                Handler.showDashboard(req, res).catch(err => {
                    console.log(err.message)
                });
                break;


            case '/books':
                let cookie = req.headers.cookie;
                let usernameLogin = qs.parse(cookie).u_user;
                if (!usernameLogin) {
                    res.writeHead(301, {Location: '/books/login'})
                    return res.end();
                }
                Handler.showListBooks(req, res).catch(err => {
                    console.log(err)
                });
                break;


            case '/books/delete':
                Handler.deleteBooks(req, res).catch(err => {
                    console.log(err)
                });
                break;


            case '/books/create':
                Handler.showFormCreateBooks(req, res).catch(err => {
                    console.log(err)
                });
                break;


            case '/books/store':
                Handler.storeBooks(req, res).catch(err => {
                    console.log(err)
                })
                break;


            case '/books/update':
                Handler.showFormUpdateBooks(req, res).catch(err => {
                    console.log(err)
                });
                break;


            case '/books/edit':
                Handler.updateBooks(req, res).catch(err => {
                    console.log("error update", err)
                });
                break;


            case '/books/client':
                let cookieClient = req.headers.cookie;
                let ClientNameLogin = qs.parse(cookieClient).u_user;
                if (!ClientNameLogin) {
                    res.writeHead(301, {Location: '/books/loginC'})
                    return res.end();
                }
                Handler.ShowAllBook(req, res).catch(err => {
                    console.log(err)
                })
                break;
            case '/books/search':
                Handler.Search(req, res).catch(err => {
                    console.log(err.message)
                });
                break;
            case '/books/login':
                if (req.method === 'GET') {
                    Handler.showFormLogin(req, res).catch(err => {
                        console.log(err)
                    })
                } else {
                    Handler.loginA(req, res).catch(err => {
                        console.log(err)
                    })
                }
                break;

            case '/books/loginC':
                if (req.method === 'GET') {
                    Handler.showFormLoginC(req, res).catch(err => {
                        console.log(err)
                    })
                } else {
                    Handler.loginC(req, res).catch(err => {
                        console.log(err)
                    })
                }
                break;
            case '/loginAdmin':
                Handler.loginAdmin(req, res).catch(err => {
                    console.log(err.message);
                })
                break;
            case '/loginClient':
                Handler.loginClient(req, res).catch(err => {
                    console.log(err.message);
                })
                break;

            case '/signup':
                Handler.SignUpUser(req, res).catch(err => {
                    console.log(err.message);
                })
                break;

            case '/register':
                Handler.register(req, res).catch(err=>{
                    console.log(err.message);
                })
                break;

            default:
                res.end();
        }
});

server.listen(8000, 'localhost', () => {
    console.log('server listening on port' + 8000)
})
