const BaseHandle = require("./BaseHandle");
const url = require("url");
const qs = require("qs");
const fs = require("fs");
const cookie = require('cookie');



class Handle extends BaseHandle {
    async showDashboard(req, res) {
        let html = await this.getTemplate('./src/home.html');
        res.write(html)
        res.end();
    }

    async showListBooks(req, res) {
        let html = await this.getTemplate('./src/views/books/list.html');
        let sql = 'SELECT BookCode, BookName, Author, CategoryCode, UnitPrice, Quantity, img FROM Book';
        let Book = await this.querySQL(sql);
        let newHTML = '';
        Book.forEach((book, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${book.BookCode}</td>`;
            newHTML += `<td>${book.BookName}</td>`;
            newHTML += `<td>${book.Author}</td>`;
            newHTML += `<td>${book.CategoryCode}</td>`;
            newHTML += `<td>${book.UnitPrice}</td>`;
            newHTML += `<td>${book.Quantity}</td>`;
            newHTML += `<td><img width="150" height="150" src="${book.img}"></td>`
            newHTML += `<td>
                            <a onclick=" return confirm('Are you sure you want to delete this user?')" href="/books/delete?BookCode=${book.BookCode}" class="btn btn-danger">Delete</a>
                            <a href="/books/update?BookCode=${book.BookCode}" class="btn btn-primary">Update</a>
                        </td>`;
            newHTML += '</tr>';
        });

        html = html.replace('{list-book}', newHTML)
        res.write(html)

        res.end();

    }

    async deleteBooks(req, res) {
        let query = url.parse(req.url).query;
        let BookCodes = qs.parse(query).BookCode;
        let sql1 = `DELETE FROM Detailhdb WHERE BookCode = '${BookCodes}'`;
        await this.querySQL(sql1);
        console.log("Delete detail success!!!")
        let sql = `DELETE FROM Book WHERE BookCode = '${BookCodes}'`;
        await this.querySQL(sql);
        console.log("Delete book success!!!")
        res.writeHead(301, {Location: '/books'});
        console.log("success delete!!")
        res.end();
    }

    async showFormCreateBooks(req, res) {
        let html = await this.getTemplate('./src/views/books/add.html');
        res.write(html)
        res.end();
    }

    async storeBooks(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            console.log(dataForm)
            let sql = `insert into Book(BookCode, BookName, Author, CategoryCode, UnitPrice, Quantity, img) value ('${dataForm.BookCode}','${dataForm.BookName}','${dataForm.Author}','${dataForm.CategoryCode}','${dataForm.UnitPrice}','${dataForm.Quantity}','${dataForm.img}')`;
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/books'});
            res.end();
        })
    }

    async showFormUpdateBooks(req, res) {
        let html = await this.getTemplate('./src/views/books/update.html');
        let query = url.parse(req.url).query;
        let BookCodes = qs.parse(query).BookCode;
        let sql = `SELECT * FROM Book WHERE BookCode = '${BookCodes}'`;
        let data = await this.querySQL(sql);
        console.log('Show BookCodes', BookCodes)
        html = html.replace('{BookCode}', BookCodes)
        html = html.replace('{BookName}', data[0].BookName)
        html = html.replace('{Author}', data[0].Author)
        html = html.replace('{UnitPrice}', data[0].UnitPrice)
        html = html.replace('{Quantity}', data[0].Quantity)
        html = html.replace('{img}', data[0].img)

        sql = `SELECT * FROM Category` ;
        let listCategory = await this.querySQL(sql);
        let CategoryCodeHTML = '';
        listCategory.forEach(item => {
            CategoryCodeHTML += `
            <option value="${item.CategoryCode}">${item.CategoryName}</option>
        `;
        })
        html = html.replace('{CategoryCode}', CategoryCodeHTML)

        res.write(html);
        res.end();
    }

    async updateBooks(req, res) {
        let query = url.parse(req.url).query;
        let BookCode = qs.parse(query).BookCode;
        console.log('data query', query)
        console.log('data BookCode', BookCode)
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        console.log('data update', data)
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            console.log('data dataForm', dataForm)
            let sql = `UPDATE book SET BookName = '${dataForm.BookName}', Author = '${dataForm.Author}', CategoryCode= '${dataForm.CategoryCode}', UnitPrice ='${dataForm.UnitPrice}',  Quantity = '${dataForm.Quantity}', img = '${dataForm.img}' WHERE BookCode = '${BookCode}'`
            await this.querySQL(sql);

            res.writeHead(301,{Location: "/books"});
            res.end();
        })
    };

    async ShowAllBook(req, res) {
        let html = await this.getTemplate('./src/views/books/client.html');
        let sql = 'SELECT BookCode, BookName, Author, CategoryCode, UnitPrice, Quantity, img FROM Book';
        let Book = await this.querySQL(sql);
        let newHTML = '';
        Book.forEach((book, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${book.BookCode}</td>`;
            newHTML += `<td>${book.BookName}</td>`;
            newHTML += `<td>${book.Author}</td>`;
            newHTML += `<td>${book.CategoryCode}</td>`;
            newHTML += `<td>${book.UnitPrice}</td>`;
            newHTML += `<td>${book.Quantity}</td>`;
            newHTML += `<td><img width="150" height="150" src="${book.img}"></td>`
            newHTML += `<td>
                            <a href="/books/update?BookCode=${book.BookCode}" class="btn btn-primary">Add to Basket</a>
                        </td>`;
            newHTML += '</tr>';
        });

        html = html.replace('{list-book}', newHTML)
        res.write(html)

        res.end();
    }

    async showFormLogin(req, res) {
        let html = await this.getTemplate('./src/loginAdmin.html');
        res.write(html)
        res.end();
    }

    async showFormLoginC(req, res) {
        let html = await this.getTemplate('./src/loginClient.html');
        res.write(html)
        res.end();
    }



    async loginA(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `SELECT CodeNV, NameTK, Passwords, NameNV, Gender, Birthday, Address, Phone FROM Staff WHERE NameTK = '${dataForm.NameTK}' AND Passwords = '${dataForm.Passwords}'`;
            let result = await this.querySQL(sql);
            if (result.length == 0) {
                res.writeHead(301, {Location: '/books/login'})
                return res.end();
            } else {

                let nameFileSessions = result[0].BookName + '.txt';
                let dataSession = JSON.stringify(result[0]);

                await this.writeFile('./sessions/' + nameFileSessions, dataSession)

                res.setHeader('Set-Cookie','u_user=' + result[0].BookName);

                res.writeHead(301, {Location: '/books'});
                return res.end()

            }

        })
    }

    async loginAdmin(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./src/loginAdmin.html', "utf-8", (err, loginHtml) => {
                if (err) {
                    console.log(err.message);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});

                res.write(loginHtml);
                res.end();
            });
        } else {
            let dataLogin = '';
            req.on('data', chunk => {
                dataLogin += chunk;
            });
            req.on('end', async () => {
                const user = qs.parse(dataLogin);
                await userService.login(user, res);
            });
        }
    }


    async loginC(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `SELECT CodeKH, NameTK, Passwords, NameKH, Address, Phone  FROM Client WHERE NameTK = '${dataForm.NameTK}' AND Passwords = '${dataForm.Passwords}'`;
            let result = await this.querySQL(sql);
            if (result.length == 0) {
                res.writeHead(301, {Location: '/books/client'})
                return res.end();
            } else {

                let nameFileSessions1 = result[0].BookName + '.txt';
                let dataSession = JSON.stringify(result[0]);

                await this.writeFile('./sessions/' + nameFileSessions1, dataSession)

                res.setHeader('Set-Cookie','u_user=' + result[0].BookName);

                res.writeHead(301, {Location: '/books/loginC'});
                return res.end()

            }

        })
    }

    async loginClient(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./src/loginClient.html', "utf-8", (err, loginHtml) => {
                if (err) {
                    console.log(err.message);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});

                res.write(loginHtml);
                res.end();
            });
        } else {
            let dataLogin = '';
            req.on('data', chunk => {
                dataLogin += chunk;
            });
            req.on('end', async () => {
                const user = qs.parse(dataLogin);
                await userService.login(user, res);
            });
        }
    }


    async SignUpUser(req, res) {
        if (req.method === 'GET') {
            fs.readFile('C:\\CASE_STYDY_BAN_SACH_ONLINE\\src\\register.html', "utf-8", (err, loginHtml) => {
                if (err) {
                    console.log(err.message);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});

                res.write(loginHtml);
                res.end();
            });
        } else {
            let dataLogin = '';
            req.on('data', chunk => {
                dataLogin += chunk;
            });
            req.on('end', async () => {
                const user = qs.parse(dataLogin);
                await userService.login(user, res);
            });
        }
    }

    async Search(req, res){
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let param = dataForm.search;
            console.log("param", param)
            let sql = `SELECT * FROM Book WHERE BookName  like '%${param}%'`;
            console.log("sql", sql)

            let html = await this.getTemplate('./src/views/books/list.html');
            let Book =  await this.querySQL(sql);
            let newHTML = '';
            Book.forEach((book, index) => {
                newHTML += '<tr>';
                newHTML += `<td>${book.BookCode}</td>`;
                newHTML += `<td>${book.BookName}</td>`;
                newHTML += `<td>${book.Author}</td>`;
                newHTML += `<td>${book.CategoryCode}</td>`;
                newHTML += `<td>${book.UnitPrice}</td>`;
                newHTML += `<td>${book.Quantity}</td>`;
                newHTML += `<td><img width="150" height="150" src="${book.img}"></td>`
                newHTML += '</tr>';
            });

            html = html.replace('{list-book}', newHTML)
            res.write(html)
            res.end();
        })
    }

    async register(req,res){
        if (req.method==="GET"){
            let html= await this.getTemplate('C:\\CASE_STYDY_BAN_SACH_ONLINE\\src\\register.html');
            res.write(html);
            res.end();
        }else{
            let data='';
            req.on('data', chunk=>{
                data += chunk
            })
            req.on('end',async ()=>{
                let dataForm = qs.parse(data);
                let sql = `insert into Client(NameTK, Passwords, NameKH, Address, Phone ) value ('${dataForm.NameTK}','${dataForm.Passwords}','${dataForm.NameKH}''${dataForm.Address}','${dataForm.Phone}'`;
                await this.querySQL(sql);
                res.writeHead(301, {Location: '/'});
                res.end();
            })
        }
    }


}

module.exports = new Handle();









