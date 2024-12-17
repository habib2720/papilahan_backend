const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/config");
const router = express.Router();

const SALT_ROUNDS = 10;
const jwt = require("jsonwebtoken");
const SECRET_KEY = "papilahan12333";

const fs = require("node:fs");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extName) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diperbolehkan!"));
    }
  },
});

router.post(
  "/lahan/buat-lahan",
  upload.fields([{ name: "gambar", maxCount: 1 }]),
  async (req, res) => {
    try {
      const {
        id_pemilik,
        namaLahan,
        alamat,
        periode,
        luasLahan,
        harga,
        deskripsi,
        tipeLahan,
        sertifikat,
        linkLokasi,
      } = req.body;

      const gambar = req.files["gambar"] ? req.files["gambar"][0].path : null;

      const query = `
                INSERT INTO lahan (id_pemilik, nama_lahan, alamat, periode, luas_lahan, harga, deskripsi, tipe_lahan, sertifikat, link_lokasi, gambar)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

      db.query(
        query,
        [
          id_pemilik,
          namaLahan,
          alamat,
          periode,
          luasLahan,
          harga,
          deskripsi,
          tipeLahan,
          sertifikat,
          linkLokasi,
          gambar,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.status(201).json({ message: "Lahan berhasil dibuat!" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/lahan", (req, res) => {
  const query = `SELECT * FROM lahan`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results);
  });
});

router.get("/lahan/:id_pemilik", (req, res) => {
  const { id_pemilik } = req.params;

  const query = `SELECT 
    lahan.id,
    lahan.nama_lahan,
    lahan.alamat,
    lahan.periode,
    lahan.luas_lahan,
    lahan.harga,
    lahan.deskripsi,
    lahan.status,
    lahan.tipe_lahan,
    lahan.sertifikat,
    lahan.link_lokasi,
    lahan.gambar,
    id_penyewa,
    user_pencari_lahan.nama as nama_penyewa,
    user_pencari_lahan.no_hp as no_hp_penyewa,
    user_pemilik_lahan.nama as nama_pemilik,
    user_pemilik_lahan.no_hp as no_hp_pemilik
    FROM lahan LEFT JOIN user_pencari_lahan ON lahan.id_penyewa = user_pencari_lahan.id 
    LEFT JOIN user_pemilik_lahan ON lahan.id_pemilik = user_pemilik_lahan.id
    WHERE id_pemilik = ?`;

  db.query(query, [id_pemilik], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results);
  });
});

router.get("/lahan/detail/:id_lahan", (req, res) => {
  const { id_lahan } = req.params;

  const query = `SELECT lahan.id,
    lahan.nama_lahan,
    lahan.alamat,
    lahan.periode,
    lahan.luas_lahan,
    lahan.harga,
    lahan.deskripsi,
    lahan.status,
    lahan.tipe_lahan,
    lahan.sertifikat,
    lahan.link_lokasi,
    lahan.gambar,
    id_penyewa,
    id_pemilik,
    user_pencari_lahan.nama as nama_penyewa,
    user_pencari_lahan.no_hp as no_hp_penyewa,
    user_pemilik_lahan.nama as nama_pemilik,
    user_pemilik_lahan.no_hp as no_hp_pemilik
    FROM lahan LEFT JOIN user_pencari_lahan ON lahan.id_penyewa = user_pencari_lahan.id 
    LEFT JOIN user_pemilik_lahan ON lahan.id_pemilik = user_pemilik_lahan.id 
    WHERE lahan.id = ?`;

  db.query(query, [id_lahan], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results[0]);
  });
});

router.put(
  "/lahan/edit-lahan/:id_lahan",
  upload.fields([{ name: "gambar", maxCount: 1 }]),
  (req, res) => {
    const { id_lahan } = req.params;
    const {
      namaLahan,
      alamat,
      periode,
      luasLahan,
      harga,
      deskripsi,
      tipeLahan,
      sertifikat,
      linkLokasi,
    } = req.body;

    const gambar = req.files["gambar"] ? req.files["gambar"][0].path : null;

    const updateLahan = (imagePath = null) => {
      const query = `
        UPDATE lahan
        SET nama_lahan = ?, alamat = ?, periode = ?, luas_lahan = ?, harga = ?, deskripsi = ?, tipe_lahan = ?, sertifikat = ?, link_lokasi = ?, gambar = ?
        WHERE id = ?
      `;
      db.query(
        query,
        [
          namaLahan,
          alamat,
          periode,
          luasLahan,
          harga,
          deskripsi,
          tipeLahan,
          sertifikat,
          linkLokasi,
          imagePath,
          id_lahan,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(200).json({ message: "Lahan berhasil diubah!" });
        }
      );
    };

    if (gambar) {
      const queryImage = `SELECT gambar FROM lahan WHERE id = ?`;
      db.query(queryImage, [id_lahan], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const oldImage = results[0]?.gambar;
        if (oldImage) {
          fs.unlink(oldImage, (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            updateLahan(gambar);
          });
        } else {
          updateLahan(gambar);
        }
      });
    } else {
      updateLahan();
    }
  }
);

router.delete("/lahan/hapus-lahan/:id_lahan", (req, res) => {
  const { id_lahan } = req.params;

  const isLahanRent = `SELECT * FROM lahan WHERE id = ? AND status = 'Penyewa'`;

  db.query(isLahanRent, [id_lahan], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Lahan sedang disewa!" });
    }

    const queryImage = `SELECT gambar FROM lahan WHERE id = ?`;

    db.query(queryImage, [id_lahan], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const imagePath = results[0]?.gambar;
      if (imagePath) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          deleteLahan(id_lahan);
        });
      } else {
        deleteLahan(id_lahan);
      }
    });
  });

  const deleteLahan = (id_lahan) => {
    const query = `DELETE FROM lahan WHERE id = ?`;

    db.query(query, [id_lahan], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({ message: "Lahan berhasil dihapus!" });
    });
  };
});

router.get("/lahan/cek-penyewa/:id_pemilik", (req, res) => {
  const { id_pemilik } = req.params;

  const query = `SELECT * FROM lahan WHERE id_pemilik = ? AND status = 'Penyewa'`;

  db.query(query, [id_pemilik], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results);
  });
});

router.get("/lahan/penyewa/:id_penyewa", (req, res) => {
  const { id_penyewa } = req.params;

  const query = `SELECT 
    sewa.id,
    sewa.tgl_sewa,
    sewa.tgl_selesai,
    lahan.id as id_lahan,
    lahan.nama_lahan,
    lahan.alamat,
    lahan.periode,
    lahan.luas_lahan,
    lahan.harga,
    lahan.deskripsi,
    lahan.status,
    lahan.tipe_lahan,
    lahan.sertifikat,
    lahan.link_lokasi,
    lahan.gambar,
    lahan.id_pemilik,
    user_pemilik_lahan.nama as nama_pemilik,
    user_pemilik_lahan.no_hp as no_hp_pemilik
    FROM sewa
    LEFT JOIN lahan ON sewa.id_lahan = lahan.id
    LEFT JOIN user_pemilik_lahan ON lahan.id_pemilik = user_pemilik_lahan.id
    WHERE lahan.id_penyewa = ?`;

  db.query(query, [id_penyewa], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results);
  });
});

router.put("/lahan/terima-penyewa/:id_lahan", (req, res) => {
  const { id_lahan } = req.params;

  const query = `UPDATE lahan SET status = 'Penyewa' WHERE id = ?`;

  const createDataSewa = `INSERT INTO sewa (id_lahan, tgl_sewa, tgl_selesai) VALUES (?, ?, ?)`;

  const querySelect = `SELECT * FROM lahan WHERE id = ?`;

  db.query(query, [id_lahan], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.query(querySelect, [id_lahan], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const dataLahan = results[0];

      const date = new Date();
      const year = date.getFullYear();
      const newDate = new Date(date.setFullYear(year + parseInt(dataLahan.periode)));

      db.query(createDataSewa, [id_lahan, new Date(), newDate], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(200).json({ message: "Penyewa berhasil diterima!" });
      });
    });
  });
});

router.put("/lahan/tolak-penyewa/:id_lahan", (req, res) => {
  const { id_lahan } = req.params;

  const query = `UPDATE lahan SET status = 'Belum Disewa', id_penyewa = NULL WHERE id = ?`;

  db.query(query, [id_lahan], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ message: "Penyewa berhasil ditolak!" });
  });
});

router.get("/lahan/cek-menyewa/:id_pemilik", (req, res) => {
  const { id_pemilik } = req.params;

  const query = `SELECT * FROM lahan WHERE id_pemilik = ? AND status = 'Calon Penyewa'`;

  db.query(query, [id_pemilik], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results);
  });
});

router.get("/lahan/cek-pendapatan/:id_pemilik", (req, res) => {
  const { id_pemilik } = req.params;

  const query = `SELECT SUM(harga) as pendapatan FROM lahan WHERE id_pemilik = ? AND status = 'Penyewa'`;

  db.query(query, [id_pemilik], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results[0]);
  });
});

router.put("/lahan/sewa/:id_lahan", (req, res) => {
  const { id_lahan } = req.params;
  const token = req.headers["authorization"].split(" ")[1];

  const decoded = jwt.verify(token, SECRET_KEY);
  const id_penyewa = decoded.id;

  const query = `UPDATE lahan SET status = 'Calon Penyewa', id_penyewa = ? WHERE id = ?`;

  db.query(query, [id_penyewa, id_lahan], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ message: "Berhasil menyewa lahan!" });
  });
});

module.exports = router;
