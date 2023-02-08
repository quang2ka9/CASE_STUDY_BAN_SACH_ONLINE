const BaseHandle = require("./BaseHandle");
const url = require("url");
const qs = require("qs");
const fs = require("fs");
const cookie = require('cookie');

class Handle extends BaseHandle{
    async showDashboard(req, res) {
        let html = await this.getTemplate('./src/view/dashboard.html');
        res.write(html)
        res.end();
    }

    async showListUsers(req, res){
        let html = await this.getTemplate('./src/view/users/list.html');
        let sql = 'SELECT id, name, username, email, role, phone FROM users';
        let users = await this.querySQL(sql);
        let newHTML = '';
        users.forEach((user, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td>${user.name}</td>`;
            newHTML += `<td>${user.username}</td>`;
            newHTML += `<td>${user.email}</td>`;
            newHTML += `<td>${(user.role == 1) ? 'admin' : 'user'}</td>`;
            newHTML += `<td>${user.phone}</td>`;
            newHTML += `<td>
                            <a onclick="return confirm('Are you sure you want to delete this user?')" href="/admin/users/delete?id=${user.id}" class="btn btn-danger">Delete</a>
                            <a href="/admin/users/update?id=${user.id}" class="btn btn-primary">Update</a>
                        </td>`;
            newHTML += '</tr>';
        });

        html = html.replace('{list-user}', newHTML)
        res.write(html)

        res.end();
    }

    async deleteUser(req, res) {
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;
        let sql = 'DELETE FROM users WHERE id = ' + id;
        await this.querySQL(sql);
        res.writeHead(301, {Location: '/admin/users'});
        res.end();
    }

    async showFormCreateUser(req, res) {
        let html = await this.getTemplate('./src/view/users/add.html');
        res.write(html)
        res.end();
    }

    async storeUser(req, res) {

        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `CALL addUser('${dataForm.name}','${dataForm.username}', '${dataForm.email}', '${dataForm.password}', '${dataForm.role}', '${dataForm.phone}', '${dataForm.address}')`
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/admin/users'});
            res.end();
        })
    }

    async showFormUpdateUser(req, res) {
        let html = await this.getTemplate('./src/view/users/update.html');
        // thuc hien truy van
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;
        let sql = 'SELECT * FROM users WHERE id = ' + id;
        let data = await this.querySQL(sql);
        html = html.replace('{name}', data[0].name)
        html = html.replace('{username}', data[0].username)
        html = html.replace('{email}', data[0].email)
        html = html.replace('{address}', data[0].address)
        html = html.replace('{phone}', data[0].phone)
        html = html.replace('{id}', data[0].id)

        let  roleHTML = `
            <option ${(data[0].role == 1) ? 'selected': ''} value="1">Admin</option>
            <option ${(data[0].role == 2) ? 'selected' : ''} value="2">User</option>
        `;

        html = html.replace('{role}', roleHTML)
        res.write(html)
        res.end();
    }

    async updateUser(req, res) {
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;
        // lay du  lieu tu  form
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `CALL updateUser('${dataForm.name}','${dataForm.role}','${dataForm.address}', '${dataForm.phone}', '${id}')`
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/admin/users'});
            res.end();
        })
    }

    async showFormLogin(req, res) {
        let html = await this.getTemplate('./src/view/login.html');
        res.write(html)
        res.end();
    }

    async login(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `SELECT name, username, email, phone, role FROM users WHERE username = '${dataForm.username}' AND password = '${dataForm.password}'`;
            let result = await this.querySQL(sql);
            if (result.length == 0) {
                res.writeHead(301, {Location: '/admin/login'})
                return res.end();
            } else {

                let nameFileSessions = result[0].username + '.txt';
                let dataSession = JSON.stringify(result[0]);

                await this.writeFile('./sessions/' + nameFileSessions, dataSession)


                res.setHeader('Set-Cookie','u_user=' + result[0].username);

                res.writeHead(301, {Location: '/admin/users'});
                return res.end()

            }

        })
    }

}

module.exports = new Handle();