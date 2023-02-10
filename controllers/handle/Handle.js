const BaseHandle = require("./BaseHandle");
const url = require("url");
const qs = require("qs");
const fs = require("fs");
const cookie = require('cookie');

class Handle extends BaseHandle {
    async showDashboard(req, res) {
        let html = await this.getTemplate('./src/dashboard.html');
        res.write(html)
        res.end();
    }

    async showListBooks(req, res) {
        let html = await this.getTemplate('./src/views/books/list.html');
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
                            <a onclick=" return confirm('Are you sure you want to delete this user?')" href="/books/delete?MaSach=${sach.MaSach}" class="btn btn-danger">Delete</a>
                            <a href="/books/update?MaSach=${sach.MaSach}" class="btn btn-primary">Update</a>
                        </td>`;
            newHTML += '</tr>';
        });

        html = html.replace('{list-sach}', newHTML)
        res.write(html)

        res.end();

    }

    async deleteBooks(req, res) {
        let query = url.parse(req.url).query;
        let MaSachs = qs.parse(query).MaSach;
        let sql = `DELETE FROM Sach WHERE MaSach = '${MaSachs}'`;
        await this.querySQL(sql);
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
            let sql = `insert into Sach(MaSach, TenSach, TacGia, MaTheLoai, MaNXB, DonGiaBan, SoLuong, SoTrang) value ('${dataForm.MaSach}','${dataForm.TenSach}','${dataForm.TacGia}','${dataForm.MaTheLoai}','${dataForm.MaNXB}','${dataForm.DonGiaBan}','${dataForm.SoLuong}','${dataForm.SoTrang}')`;
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/books'});
            res.end();
        })
    }

    async showFormUpdateBooks(req, res) {
        let html = await this.getTemplate('./src/views/books/update.html');
        let query = url.parse(req.url).query;
        let MaSachs = qs.parse(query).MaSach;
        let sql = `SELECT * FROM Sach WHERE MaSach = '${MaSachs}'`;
        let data = await this.querySQL(sql);
        html = html.replace('{MaSach}', data[0].MaSach)
        html = html.replace('{TenSach}', data[0].TenSach)
        html = html.replace('{TacGia}', data[0].TacGia)
        html = html.replace('{DonGiaBan}', data[0].DonGiaBan)
        html = html.replace('{SoLuong}', data[0].SoLuong)
        html = html.replace('{SoTrang}', data[0].SoTrang)


        sql = `SELECT * FROM TheLoai`;
        let listTheLoai = await this.querySQL(sql);
        let MaTheLoaiHTML = '';
        listTheLoai.forEach(item => {
            MaTheLoaiHTML += `
            <option value="${item.MaTheLoai}">${item.TenTheLoai}</option>
        `;
        })

        html = html.replace('{MaTheLoai}', MaTheLoaiHTML)


        sql = `SELECT * FROM NhaXuatBan`;
        let listNhaXuatBan = await this.querySQL(sql);
        let NhaXUatBanHTML = '';
        listNhaXuatBan.forEach(item => {
            NhaXUatBanHTML += `
            <option value="${item.MaNXB}">${item.TenNXB}</option>
        `;
        })

        html = html.replace('{MaNXB}', NhaXUatBanHTML)

        res.write(html);
        res.end();
    }

    async updateBooks(req, res) {
        let query = url.parse(req.url).query;
        let MaSach = qs.parse(query).MaSach;

        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `CALL updateSach('${MaSach}','${dataForm.TenSach}', '${dataForm.TacGia}', '${dataForm.MaTheLoai}', '${dataForm.MaNXB}', '${dataForm.DonGiaBan}', '${dataForm.SoLuong}','${dataForm.SoTrang}')`;
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/books'});
            res.end();
        })
    }


    async searchBooks(req, res) {

        let html = await this.getTemplate('./src/views/books/search.html');
        let TenSachs = qs.parse(query).TenSach;

        let sql = `SELECT MaSach, TenSach, TacGia, MaTheLoai, MaNXB, DonGiaBan, SoLuong, SoTrang FROM Sach WHERE TenSach = '${TenSachs}'`;
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
                             <a onclick=" return confirm('Are you sure you want to delete this user?')" href="/books/delete?MaSach=${sach.MaSach}" class="btn btn-danger">Delete</a>
                            <a href="/books/update?MaSach=${sach.MaSach}" class="btn btn-primary">Update</a>
                       </td>`;
            newHTML += '</tr>';
        });

        html = html.replace('{search-sach}', newHTML)
        res.write(html)

        res.end();
    }


    async ShowAllBook(req, res) {
        let html = await this.getTemplate('./src/views/users/client.html');
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
                        <a href="/books/update?MaSach=${sach.MaSach}" class="btn btn-primary">addToCart</a>
                       </td>`;
            newHTML += '</tr>'
        });

        html = html.replace('{list-sach}', newHTML)
        res.write(html)

        res.end();

    }



    async showFormLogin(req, res) {
        let html = await this.getTemplate('./src/login.html');
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
            let sql = `SELECT MaNV, TenNV, GioiTinh, NgaySinh, DiaChi, DienThoai FROM NhanVien WHERE DienThoai= '${dataForm.DienThoai}' AND MaNV = '${dataForm.MaNV}'`;
            let result = await this.querySQL(sql);
            if (result.length == 0) {
                res.writeHead(301, {Location: '/books/login'})
                return res.end();
            } else {

                let nameFileSessions = result[0].TenSach + '.txt';
                let dataSession = JSON.stringify(result[0]);

                await this.writeFile('./sessions/' + nameFileSessions, dataSession)

                res.setHeader('Set-Cookie','u_user=' + result[0].TenSach);

                res.writeHead(301, {Location: '/books'});
                return res.end()

            }

        })
    }

    async loginAdmin(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./src/login.html', "utf-8", (err, loginHtml) => {
                if (err) {
                    console.log(err.message);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});

                // loginHtml = loginHtml.replace('{notification}', '');
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

}

module.exports = new Handle();






