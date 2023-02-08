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
        let sql = 'SELECT MaSach, TenSach, TacGia, MaTheLoai, MaNXB, DonGiaBan, SoLuong, SoTrang FROM Sach';
        let Sach = await this.querySQL(sql);
        let newHTML = '';
        Sach.forEach((sach, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${sach.MaSach}</td>`;
            newHTML += `<td>${sach.TenSach}</td>`;
            newHTML += `<td>${sach.TacGia}</td>`;
            newHTML += `<td>${sach.MaTheLoai}</td>`;
            newHTML += `<td>${sach.MaNXB}</td>`;
            newHTML += `<td>${sach.DonGiaBan}</td>`;
            newHTML += `<td>${sach.SoLuong}</td>`;
            newHTML += `<td>${sach.SoTrang}</td>`;
            newHTML += `<td>
                            <a onclick="return confirm('Are you sure you want to delete this user?')" href="/admin/users/delete?id=${Sach.MaSach}" class="btn btn-danger">Delete</a>
                            <a href="/admin/users/update?id=${sach.MaSach}" class="btn btn-primary">Update</a>
                        </td>`;
            newHTML += '</tr>';
        });

        html = html.replace('{list-sach}', newHTML)
        res.write(html)

        res.end();
    }

    async deleteUser(req, res) {
        let query = url.parse(req.url).query;
        let MaSach = qs.parse(query).MaSach;
        let sql = 'DELETE FROM users WHERE MaSach = ' + MaSach;
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
            let sql = `CALL addSach('${dataForm.MaSach}','${dataForm.TenSach}', '${dataForm.TacGia}', '${dataForm.MaTheLoai}', '${dataForm.MaNXB}', '${dataForm.DonGiaBan}', '${dataForm.SoLuong}','${dataForm.SoTrang}' )`
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/admin/users'});
            res.end();
        })
    }

    async showFormUpdateUser(req, res) {
        let html = await this.getTemplate('./src/view/users/update.html');
        let query = url.parse(req.url).query;
        let MaSach = qs.parse(query).MaSach;
        let sql = 'SELECT * FROM users WHERE MaSach = ' + MaSach;
        let data = await this.querySQL(sql);
        html = html.replace('{MaSach}', data[0].MaSach)
        html = html.replace('{TenSach}', data[0].TenSach)
        html = html.replace('{TacGia}', data[0].TacGia)
        html = html.replace('{MaTheLoai}', data[0].MaTheLoai)
        html = html.replace('{MaNXB}', data[0].MaNXB)
        html = html.replace('{DonGiaBan}', data[0].DonGiaBan)
        html = html.replace('{SoLuong}', data[0].SoLuong)
        html = html.replace('{SoTrang}', data[0].SoTrang)

        res.write(html)
        res.end();
    }

    async updateUser(req, res) {
        let query = url.parse(req.url).query;
        let MaSach = qs.parse(query).MaSach;

        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `CALL updateSach('${MaSach}','${dataForm.TenSach}', '${dataForm.TacGia}', '${dataForm.MaTheLoai}', '${dataForm.MaNXB}', '${dataForm.DonGiaBan}', '${dataForm.SoLuong}','${dataForm.SoTrang}')`
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