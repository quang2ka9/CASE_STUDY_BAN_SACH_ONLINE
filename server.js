const http = require('http');
const url = require('url');
const Handler = require('./controllers/Handle')
const qs = require("qs");

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    const methodRequest = req.method;

    switch (pathName) {
        case '/':
            Handler.showDashboard(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/books':

            // let cookie = req.headers.cookie;
            //
            // let usernameLogin = qs.parse(cookie).u_user;
            // if (!usernameLogin) {
            //     res.writeHead(301, {Location: '/admin/login'})
            //     return res.end();
            // }

            Handler.showListbooks(req, res).catch(err => {
                console.log(err)
            });
            break;

        case '/books/delete':
            Handler.deleteUser(req, res).catch(err => {
                console.log(err)
            })
            break;
        case '/books/create':

            Handler.showFormCreateUser(req, res).catch(err => {
                console.log(err.message)

            })
            break;
        case '/books/store':
            Handler.storeUser(req, res).catch(err => {
                console.log(err)
            })
            break;
        case '/books/update':
            Handler.showFormUpdateUser(req, res).catch(err => {
                console.log(err)
            })
            break;
        case '/books/edit':
            Handler.updateUser(req, res).catch(err => {
                console.log(err)
            })
            break
        // case '/admin/login':
        //     if (methodRequest == 'GET') {
        //         Handler.showFormLogin(req, res).catch(err => {
        //             console.log(err.message)
        //         })
        //     } else {
        //         Handler.login(req, res).catch(err => {
        //             console.log(err.message)
        //         })
        //     }
        //     break

        default:
            res.end();
    }

})

server.listen(8000, 'localhost', () => {
    console.log('server listening on port' + 8000)
})