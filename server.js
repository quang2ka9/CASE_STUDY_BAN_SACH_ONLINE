const http = require('http');
const url = require('url');
const Handler = require('./handles/Handle')
const qs = require("qs");

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    const methodRequest = req.method;


    switch (pathName) {
        case '/admin':
            Handler.showDashboard(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin/users':
            // kiem tra session
            // lay  thong tin session tu cookie cua request
            let cookie = req.headers.cookie;

            let usernameLogin = qs.parse(cookie).u_user;
            if (!usernameLogin) {
                res.writeHead(301, {Location: '/admin/login'})
                return res.end();
            }

            Handler.showListUsers(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin/users/delete':
            Handler.deleteUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/create':

            Handler.showFormCreateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/store':
            Handler.storeUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/update':
            Handler.showFormUpdateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/edit':
            Handler.updateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break
        case '/admin/login':
            if (methodRequest == 'GET') {
                Handler.showFormLogin(req, res).catch(err => {
                    console.log(err.message)
                })
            } else {
                Handler.login(req, res).catch(err => {
                    console.log(err.message)
                })
            }
            break

        default:
            res.end();
    }

})

server.listen(8000, 'localhost', () => {
    console.log('server listening on port' + 8000)
})