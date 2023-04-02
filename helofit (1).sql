-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 02 Apr 2023 pada 06.43
-- Versi server: 10.4.21-MariaDB
-- Versi PHP: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `helofit`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `facilityId` int(11) NOT NULL,
  `total` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  `booking_date` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `time` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `booking`
--

INSERT INTO `booking` (`id`, `facilityId`, `total`, `price`, `booking_date`, `userId`, `time`, `createdAt`, `updatedAt`) VALUES
(2, 1, 200000, 100000, '2023-03-26', 10, '19:00', '2023-03-26 08:28:03', '2023-03-26 08:28:03');

-- --------------------------------------------------------

--
-- Struktur dari tabel `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `category`
--

INSERT INTO `category` (`id`, `category_name`, `createdAt`, `updatedAt`) VALUES
(1, 'badminton', '2023-03-29 05:11:35', '2023-03-29 05:11:35');

-- --------------------------------------------------------

--
-- Struktur dari tabel `facility`
--

CREATE TABLE `facility` (
  `id` int(11) NOT NULL,
  `merchantId` int(11) NOT NULL,
  `facility_name` varchar(255) NOT NULL,
  `banner_img` varchar(255) NOT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `uom` enum('jam') NOT NULL DEFAULT 'jam',
  `categoryId` int(11) NOT NULL,
  `time` varchar(255) DEFAULT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `facility`
--

INSERT INTO `facility` (`id`, `merchantId`, `facility_name`, `banner_img`, `price`, `uom`, `categoryId`, `time`, `available`, `createdAt`, `updatedAt`) VALUES
(3, 2, 'badminton lapangan 1', 'http://localhost:3002/view/image/banner/1680058126051wallpaperflare.com_wallpaper.jpg', 100000, 'jam', 1, '[08:00,17:00]', 1, '2023-03-29 09:48:46', '2023-03-29 09:48:46');

-- --------------------------------------------------------

--
-- Struktur dari tabel `feature`
--

CREATE TABLE `feature` (
  `id` int(11) NOT NULL,
  `feature_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `merchant`
--

CREATE TABLE `merchant` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `merchant_name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `desc` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `merchant`
--

INSERT INTO `merchant` (`id`, `email`, `password`, `merchant_name`, `address`, `desc`, `createdAt`, `updatedAt`, `balance`) VALUES
(2, 'muharisharis13@gmail.com', 'b603b9e5b0a511501e8e92547ccc6348', 'muharis_merchant', 'jln deblod sundoro', 'lorem', '2023-03-23 09:38:05', '2023-03-23 09:38:05', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `merchant_time`
--

CREATE TABLE `merchant_time` (
  `id` int(11) NOT NULL,
  `merchantId` int(11) NOT NULL,
  `sunday` varchar(255) DEFAULT NULL,
  `monday` varchar(255) DEFAULT NULL,
  `tuesday` varchar(255) DEFAULT NULL,
  `wednesday` varchar(255) DEFAULT NULL,
  `thursday` varchar(255) DEFAULT NULL,
  `friday` varchar(255) DEFAULT NULL,
  `saturday` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `merchant_time`
--

INSERT INTO `merchant_time` (`id`, `merchantId`, `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `createdAt`, `updatedAt`) VALUES
(1, 2, '[\"08:00\",\"17:00\"]', '[\"08:00\",\"17:00\"]', '[\"08:00\",\"17:00\"]', '[\"08:00\",\"17:00\"]', '[\"08:00\",\"17:00\"]', '[\"08:00\",\"17:00\"]', '[\"08:00\",\"17:00\"]', '2023-03-29 10:23:33', '2023-03-29 10:23:33');

-- --------------------------------------------------------

--
-- Struktur dari tabel `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `facilityId` int(11) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `range_age` varchar(255) NOT NULL,
  `max_capacity` int(11) DEFAULT 0,
  `room_desc` varchar(255) DEFAULT NULL,
  `room_expired` datetime NOT NULL,
  `visibility` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `bookingId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `room`
--

INSERT INTO `room` (`id`, `room_name`, `facilityId`, `gender`, `range_age`, `max_capacity`, `room_desc`, `room_expired`, `visibility`, `createdAt`, `updatedAt`, `userId`, `bookingId`) VALUES
(9, 'Ayo main bareng', 3, 'male', '[17,25]', 10, 'room desc', '2023-03-30 08:50:50', 1, '2023-03-29 08:50:50', '2023-03-29 08:50:50', 10, 2),
(10, 'Ayo main bareng', 1, 'male', '[17,25]', 10, 'room desc', '2023-03-30 08:52:24', 1, '2023-03-29 08:52:24', '2023-03-29 08:52:24', 20, 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `room_detail`
--

CREATE TABLE `room_detail` (
  `id` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status_approved` enum('approved','reject','unapproved') DEFAULT 'unapproved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `room_detail`
--

INSERT INTO `room_detail` (`id`, `roomId`, `userId`, `qty`, `createdAt`, `updatedAt`, `status_approved`) VALUES
(1, 9, 10, 3, '2023-03-29 07:18:48', '2023-03-29 07:18:48', 'approved'),
(3, 9, 20, 2, '2023-03-31 22:01:21', '2023-04-01 04:07:26', 'approved');

-- --------------------------------------------------------

--
-- Struktur dari tabel `token`
--

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `token` text DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `token`
--

INSERT INTO `token` (`id`, `userId`, `token`, `refreshToken`, `createdAt`, `updatedAt`) VALUES
(5, 10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoibXVoYXJpc2hhcmlzMTMiLCJlbWFpbCI6Im11aGFyaXNoYXJpczEzQGdtYWlsLmNvbSIsInBob25lX251bWJlciI6IjA4MjIzOTcyMDMxOCIsImdlbmRlciI6Im1hbGUiLCJwb2ludCI6IjAiLCJiYWxhbmNlIjowLCJjcmVhdGVkQXQiOiIyMDIzLTAzLTIzIDA3OjUzOjM1IiwidXBkYXRlZEF0IjoiMjAyMy0wMy0yMyAwNzo1MzozNSIsImlhdCI6MTY4MDQxMDA0Nn0.EY3J8yhzxv6ftrb6a7hemKXeLXlZPhhV5i8EzqexNKU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoibXVoYXJpc2hhcmlzMTMiLCJlbWFpbCI6Im11aGFyaXNoYXJpczEzQGdtYWlsLmNvbSIsInBob25lX251bWJlciI6IjA4MjIzOTcyMDMxOCIsImdlbmRlciI6Im1hbGUiLCJwb2ludCI6IjAiLCJiYWxhbmNlIjowLCJjcmVhdGVkQXQiOiIyMDIzLTAzLTIzIDA3OjUzOjM1IiwidXBkYXRlZEF0IjoiMjAyMy0wMy0yMyAwNzo1MzozNSIsImlhdCI6MTY4MDQxMDA0Nn0.M7m9G2hO8whYoiMBraVkb7EIVqc7qIL-SqF1dU3c4kA', '2023-03-23 07:53:35', '2023-04-02 11:34:06'),
(6, 20, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsInVzZXJuYW1lIjoibXVoYXJpc2hhcmlzMTMzIiwiZW1haWwiOiJtdWhhcmlzaGFyaXMxMzNAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMDgyMjM5NzIwMzE4IiwiZ2VuZGVyIjoibWFsZSIsImJhbGFuY2UiOjAsImNyZWF0ZWRBdCI6IjIwMjMtMDMtMjNUMDg6MDI6MDAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjMtMDMtMjNUMDg6Mjc6MzYuMDAwWiIsImlhdCI6MTY3OTU2MDA3OH0.RmoWzDAFwqk1uSPqTrmt4HnOdoj68__usJgNs2LhEt0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsInVzZXJuYW1lIjoibXVoYXJpc2hhcmlzMTMzIiwiZW1haWwiOiJtdWhhcmlzaGFyaXMxMzNAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMDgyMjM5NzIwMzE4IiwiZ2VuZGVyIjoibWFsZSIsImJhbGFuY2UiOjAsImNyZWF0ZWRBdCI6IjIwMjMtMDMtMjNUMDg6MDI6MDAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjMtMDMtMjNUMDg6Mjc6MzYuMDAwWiIsImlhdCI6MTY3OTU2MDA3OH0.ZSdNTpxgRLzbmQNUpmhqYhEAvaKs4hGwjknjSg0ZTGQ', '2023-03-23 08:02:00', '2023-03-23 08:27:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `token_admin`
--

CREATE TABLE `token_admin` (
  `id` int(11) NOT NULL,
  `adminId` int(11) NOT NULL,
  `token` text DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `token_admin`
--

INSERT INTO `token_admin` (`id`, `adminId`, `token`, `refreshToken`, `createdAt`, `updatedAt`) VALUES
(2, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJtdWhhcmlzaGFyaXMxM0BnbWFpbC5jb20iLCJtZXJjaGFudF9uYW1lIjoibXVoYXJpc19tZXJjaGFudCIsImFkZHJlc3MiOiJqbG4gZGVibG9kIHN1bmRvcm8iLCJkZXNjIjoibG9yZW0iLCJiYWxhbmNlIjowLCJjcmVhdGVkQXQiOiIyMDIzLTAzLTIzIDA5OjM4OjA1IiwidXBkYXRlZEF0IjoiMjAyMy0wMy0yMyAwOTozODowNSIsImlhdCI6MTY4MDA1ODk5MH0.qOBdbxxPIwpXfTDQbAiXnUfAjcMmJisqNIsdJyxRbQo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJtdWhhcmlzaGFyaXMxM0BnbWFpbC5jb20iLCJtZXJjaGFudF9uYW1lIjoibXVoYXJpc19tZXJjaGFudCIsImFkZHJlc3MiOiJqbG4gZGVibG9kIHN1bmRvcm8iLCJkZXNjIjoibG9yZW0iLCJiYWxhbmNlIjowLCJjcmVhdGVkQXQiOiIyMDIzLTAzLTIzIDA5OjM4OjA1IiwidXBkYXRlZEF0IjoiMjAyMy0wMy0yMyAwOTozODowNSIsImlhdCI6MTY4MDA1ODk5MH0.kHWUsdSag-IvFF9u8FlLhfEK9UZnsjopNTNnZh9gfaM', '2023-03-23 09:38:05', '2023-03-29 10:03:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `pin` varchar(255) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `point` varchar(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `phone_number`, `gender`, `pin`, `balance`, `createdAt`, `updatedAt`, `point`) VALUES
(10, 'muharisharis13', 'muharisharis13@gmail.com', 'cfc28b7514861811eca6b1cec7c1238a', '082239720318', 'male', '3f118e6d28a96ec03f08eabac6fa17c5', 0, '2023-03-23 07:53:35', '2023-03-23 07:53:35', '0'),
(20, 'muharisharis133', 'muharisharis133@gmail.com', 'dcf534bc2e6f533165332e30bca8b576', '082239720318', 'male', '3f118e6d28a96ec03f08eabac6fa17c5', 0, '2023-03-23 08:02:00', '2023-03-23 08:27:36', '0');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `facility`
--
ALTER TABLE `facility`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `feature`
--
ALTER TABLE `feature`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `merchant`
--
ALTER TABLE `merchant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `merchant_time`
--
ALTER TABLE `merchant_time`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `room_detail`
--
ALTER TABLE `room_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roomId` (`roomId`),
  ADD KEY `userId` (`userId`);

--
-- Indeks untuk tabel `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `userId_2` (`userId`),
  ADD UNIQUE KEY `userId_3` (`userId`),
  ADD UNIQUE KEY `userId_4` (`userId`),
  ADD UNIQUE KEY `userId_5` (`userId`),
  ADD UNIQUE KEY `userId_6` (`userId`),
  ADD UNIQUE KEY `userId_7` (`userId`),
  ADD UNIQUE KEY `userId_8` (`userId`),
  ADD UNIQUE KEY `userId_9` (`userId`),
  ADD UNIQUE KEY `userId_10` (`userId`),
  ADD UNIQUE KEY `userId_11` (`userId`),
  ADD UNIQUE KEY `userId_12` (`userId`),
  ADD UNIQUE KEY `userId_13` (`userId`),
  ADD UNIQUE KEY `userId_14` (`userId`),
  ADD UNIQUE KEY `userId_15` (`userId`),
  ADD UNIQUE KEY `userId_16` (`userId`),
  ADD UNIQUE KEY `userId_17` (`userId`),
  ADD UNIQUE KEY `userId_18` (`userId`),
  ADD UNIQUE KEY `userId_19` (`userId`),
  ADD UNIQUE KEY `userId_20` (`userId`),
  ADD UNIQUE KEY `userId_21` (`userId`),
  ADD UNIQUE KEY `userId_22` (`userId`),
  ADD UNIQUE KEY `userId_23` (`userId`),
  ADD UNIQUE KEY `userId_24` (`userId`),
  ADD UNIQUE KEY `userId_25` (`userId`),
  ADD UNIQUE KEY `userId_26` (`userId`),
  ADD UNIQUE KEY `userId_27` (`userId`),
  ADD UNIQUE KEY `userId_28` (`userId`),
  ADD UNIQUE KEY `userId_29` (`userId`),
  ADD UNIQUE KEY `userId_30` (`userId`),
  ADD UNIQUE KEY `userId_31` (`userId`),
  ADD UNIQUE KEY `userId_32` (`userId`),
  ADD UNIQUE KEY `userId_33` (`userId`),
  ADD UNIQUE KEY `userId_34` (`userId`),
  ADD UNIQUE KEY `userId_35` (`userId`),
  ADD UNIQUE KEY `userId_36` (`userId`),
  ADD UNIQUE KEY `userId_37` (`userId`),
  ADD UNIQUE KEY `userId_38` (`userId`),
  ADD UNIQUE KEY `userId_39` (`userId`),
  ADD UNIQUE KEY `userId_40` (`userId`),
  ADD UNIQUE KEY `userId_41` (`userId`),
  ADD UNIQUE KEY `userId_42` (`userId`),
  ADD UNIQUE KEY `userId_43` (`userId`),
  ADD UNIQUE KEY `userId_44` (`userId`),
  ADD UNIQUE KEY `userId_45` (`userId`),
  ADD UNIQUE KEY `userId_46` (`userId`),
  ADD UNIQUE KEY `userId_47` (`userId`),
  ADD UNIQUE KEY `userId_48` (`userId`),
  ADD UNIQUE KEY `userId_49` (`userId`),
  ADD UNIQUE KEY `userId_50` (`userId`),
  ADD UNIQUE KEY `userId_51` (`userId`),
  ADD UNIQUE KEY `userId_52` (`userId`),
  ADD UNIQUE KEY `userId_53` (`userId`),
  ADD UNIQUE KEY `userId_54` (`userId`),
  ADD UNIQUE KEY `userId_55` (`userId`),
  ADD UNIQUE KEY `userId_56` (`userId`),
  ADD UNIQUE KEY `userId_57` (`userId`),
  ADD UNIQUE KEY `userId_58` (`userId`),
  ADD UNIQUE KEY `userId_59` (`userId`),
  ADD UNIQUE KEY `userId_60` (`userId`),
  ADD UNIQUE KEY `userId_61` (`userId`),
  ADD UNIQUE KEY `userId_62` (`userId`),
  ADD UNIQUE KEY `userId_63` (`userId`);

--
-- Indeks untuk tabel `token_admin`
--
ALTER TABLE `token_admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `adminId` (`adminId`),
  ADD UNIQUE KEY `adminId_2` (`adminId`),
  ADD UNIQUE KEY `adminId_3` (`adminId`),
  ADD UNIQUE KEY `adminId_4` (`adminId`),
  ADD UNIQUE KEY `adminId_5` (`adminId`),
  ADD UNIQUE KEY `adminId_6` (`adminId`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `username_20` (`username`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `username_21` (`username`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `username_22` (`username`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `username_23` (`username`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `username_24` (`username`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `username_25` (`username`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `username_26` (`username`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `username_27` (`username`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `username_28` (`username`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `username_29` (`username`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `username_30` (`username`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `username_31` (`username`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `username_32` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `facility`
--
ALTER TABLE `facility`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `feature`
--
ALTER TABLE `feature`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `merchant`
--
ALTER TABLE `merchant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `merchant_time`
--
ALTER TABLE `merchant_time`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `room_detail`
--
ALTER TABLE `room_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `token_admin`
--
ALTER TABLE `token_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `room_detail`
--
ALTER TABLE `room_detail`
  ADD CONSTRAINT `room_detail_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `room_detail_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
