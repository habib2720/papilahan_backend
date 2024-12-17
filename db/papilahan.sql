-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 17, 2024 at 04:26 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `papilahan`
--

-- --------------------------------------------------------

--
-- Table structure for table `lahan`
--

CREATE TABLE `lahan` (
  `id` int NOT NULL,
  `id_pemilik` int NOT NULL,
  `nama_lahan` varchar(255) NOT NULL,
  `alamat` text NOT NULL,
  `periode` varchar(255) NOT NULL,
  `luas_lahan` int NOT NULL,
  `harga` int NOT NULL,
  `deskripsi` longtext NOT NULL,
  `tipe_lahan` varchar(255) NOT NULL,
  `sertifikat` varchar(255) NOT NULL,
  `link_lokasi` varchar(255) NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Belum Disewa',
  `id_penyewa` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lahan`
--

INSERT INTO `lahan` (`id`, `id_pemilik`, `nama_lahan`, `alamat`, `periode`, `luas_lahan`, `harga`, `deskripsi`, `tipe_lahan`, `sertifikat`, `link_lokasi`, `gambar`, `status`, `id_penyewa`) VALUES
(4, 1, 'Sawah Dekat Kebun ragunan', 'Sukabumi, Jawabarat', '2', 400, 20000000, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'Sawah', 'test', 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2135.089684806564!2d106.10979335609778!3d-5.1674548574584165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sid!4v1734377922243!5m2!1sen!2sid', 'uploads\\lahan-1.png', 'Calon Penyewa', 5),
(5, 1, 'Sawah Dekat Kebun Monas', 'Sukabumi, Jawabarat', '1', 400, 20000000, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'Sawah', 'test', 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2135.089684806564!2d106.10979335609778!3d-5.1674548574584165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sid!4v1734377922243!5m2!1sen!2sid', 'uploads\\lahan-2.png', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sewa`
--

CREATE TABLE `sewa` (
  `id` int NOT NULL,
  `id_lahan` int NOT NULL,
  `tgl_sewa` date NOT NULL,
  `tgl_selesai` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_pemilik_lahan`
--

CREATE TABLE `user_pemilik_lahan` (
  `id` int NOT NULL,
  `nama` varchar(255) NOT NULL,
  `no_hp` varchar(13) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_pemilik_lahan`
--

INSERT INTO `user_pemilik_lahan` (`id`, `nama`, `no_hp`, `email`, `password`) VALUES
(1, 'test123', '1212121', 'test@gmail.com', '$2b$10$yeJVAk39e4WXl/bvoBUV3uUTV9L0PmBlLygIM1pVEDFCw4hoY72G2');

-- --------------------------------------------------------

--
-- Table structure for table `user_pencari_lahan`
--

CREATE TABLE `user_pencari_lahan` (
  `id` int NOT NULL,
  `nama` varchar(255) NOT NULL,
  `no_hp` varchar(13) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_pencari_lahan`
--

INSERT INTO `user_pencari_lahan` (`id`, `nama`, `no_hp`, `email`, `password`) VALUES
(5, 'test123', '11111111111', 'test@gmail.com', '$2b$10$g6AdtfkyisPgqE.qM8zVseuMtmyQ7CFBcvvryXS42IpYIMEwA4hbq');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lahan`
--
ALTER TABLE `lahan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemilik_ibfk_1` (`id_pemilik`),
  ADD KEY `penyewa_ibfk_1` (`id_penyewa`);

--
-- Indexes for table `sewa`
--
ALTER TABLE `sewa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lahan_ibfk_1` (`id_lahan`);

--
-- Indexes for table `user_pemilik_lahan`
--
ALTER TABLE `user_pemilik_lahan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_pencari_lahan`
--
ALTER TABLE `user_pencari_lahan`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lahan`
--
ALTER TABLE `lahan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sewa`
--
ALTER TABLE `sewa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_pemilik_lahan`
--
ALTER TABLE `user_pemilik_lahan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_pencari_lahan`
--
ALTER TABLE `user_pencari_lahan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `lahan`
--
ALTER TABLE `lahan`
  ADD CONSTRAINT `pemilik_ibfk_1` FOREIGN KEY (`id_pemilik`) REFERENCES `user_pemilik_lahan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `penyewa_ibfk_1` FOREIGN KEY (`id_penyewa`) REFERENCES `user_pencari_lahan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `sewa`
--
ALTER TABLE `sewa`
  ADD CONSTRAINT `lahan_ibfk_1` FOREIGN KEY (`id_lahan`) REFERENCES `lahan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
