const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/config');
const router = express.Router();

const SALT_ROUNDS = 10;
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'papilahan12333';

router.post('/auth/register-pemilik-lahan', async (req, res) => {
    const { nama, no_hp, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const query = `INSERT INTO user_pemilik_lahan (nama, no_hp, email, password) VALUES (?, ?, ?, ?)`;

        db.query(query, [nama, no_hp, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send('Berhasil mendaftar');
        });
    } catch (error) {
        res.status(500).send('Gagal mendaftar');
    }
});

router.post('/auth/register-pencari-lahan', async (req, res) => {
    const { nama, no_hp, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const query = `INSERT INTO user_pencari_lahan (nama, no_hp, email, password) VALUES (?, ?, ?, ?)`;

        db.query(query, [nama, no_hp, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send('Berhasil mendaftar');
        });
    } catch (error) {
        res.status(500).send('Gagal mendaftar');
    }
});

router.post('/auth/login-pencari-lahan', (req, res) => {
    const { no_hp, password } = req.body;

    const query = `SELECT * FROM user_pencari_lahan WHERE no_hp = ?`;

    db.query(query, [no_hp], async (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({ role: "pencari", id: user.id, no_hp: user.no_hp }, SECRET_KEY);
                res.status(200).send({ token });
            } else {
                res.status(401).send('Password tidak valid');
            }
        } else {
            res.status(404).send('User tidak ditemukan');
        }
    });
});

router.post('/auth/login-pemilik-lahan', (req, res) => {
    const { no_hp, password } = req.body;

    const query = `SELECT * FROM user_pemilik_lahan WHERE no_hp = ?`;

    db.query(query, [no_hp], async (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({ role: "pemilik", id: user.id, no_hp: user.no_hp }, SECRET_KEY);
                res.status(200).send({ token });
            } else {
                res.status(401).send('Password tidak valid');
            }
        } else {
            res.status(404).send('User tidak ditemukan');
        }
    });
});

router.get('/auth/data-pemilik', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const query = `SELECT * FROM user_pemilik_lahan WHERE id = ?`;

    db.query(query, [decoded.id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send(results[0]);
    });
});

router.put('/auth/update-pemilik', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const { nama, no_hp, email } = req.body;

    const query = `UPDATE user_pemilik_lahan SET nama = ?, no_hp = ?, email = ? WHERE id = ?`;

    db.query(query, [nama, no_hp, email, decoded.id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send('Berhasil update data');
    });
});

router.get('/auth/data-pencari', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const query = `SELECT * FROM user_pencari_lahan WHERE id = ?`;

    db.query(query, [decoded.id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send(results[0]);
    });
});

router.put('/auth/update-pencari', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const { nama, no_hp, email } = req.body;

    const query = `UPDATE user_pencari_lahan SET nama = ?, no_hp = ?, email = ? WHERE id = ?`;

    db.query(query, [nama, no_hp, email, decoded.id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send('Berhasil update data');
    });
});


module.exports = router;
