-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: game
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(50) NOT NULL,
  `player1` varchar(50) NOT NULL,
  `player2` varchar(50) NOT NULL,
  `player1Score` int NOT NULL DEFAULT '0',
  `player2Score` int NOT NULL DEFAULT '0',
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_id` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES (1,'abx_xys_akbka-akakvm','mLucasteme','meme',1,5,'2023-11-26 22:28:08'),(2,'abx_xys_akbvvvka-akakvm','meme','vava',1,5,'2023-11-26 22:28:19'),(3,'90fbf3f0-9d45-48c0-87bc-afe9ebacc5ec','73fb7a0b19','15013c86e2',1,0,'2023-11-27 01:10:55'),(4,'f97c2b0e-7e54-4236-9092-53fa14c68b83','46dbc2d10e','62f6ec196a',1,0,'2023-11-27 23:54:12'),(8,'51aa6376-94d6-4655-b90c-adebebd609d0','8def6ba390','user1080',1,0,'2023-12-01 11:13:10'),(9,'d8fba0d2-81a8-4ff4-b3de-c6a028d81702','8def6ba390','user1080',1,0,'2023-12-01 11:13:30'),(27,'fa492bdc-1e60-4e13-8154-1289480f99cf','8def6ba390','user1080',1,0,'2023-12-16 15:34:25'),(36,'c6faabf8-e0c2-4afe-97f7-734580a65e4e','STM32-F103','datvu',1,0,'2023-12-16 20:20:25'),(37,'a7dad1e6-1a81-41a4-a882-e189cf7dcf80','STM32-F103','user1080',1,0,'2023-12-16 20:22:33'),(38,'b13dfb0c-2974-4f5d-84a5-c5b968911830','STM32-F103','user1080',1,1,'2023-12-16 20:29:15'),(39,'8c52a6ba-2682-4b28-8aeb-833106bd9d01','STM32-F103','user1080',1,1,'2023-12-16 20:29:15'),(40,'3b06048f-acaa-4ccb-b8db-f533d1b4dae4','STM32-F103','user1080',1,1,'2023-12-16 20:43:29'),(41,'12067a62-789e-4fe9-965a-dd63208bbdd0','STM32-F103','user1080',1,0,'2023-12-16 20:57:00'),(42,'29828402-ee0d-40ea-acc8-725427758153','STM32-F103','user1080',2,1,'2023-12-16 20:59:29'),(43,'58eb1767-4e53-4dd6-a43c-0bbd7a3c726b','user1080','STM32-F103',4,3,'2023-12-16 21:10:36'),(44,'9b74279f-38d3-4cdc-9671-2da8be78ca05','STM32-F103','datvu',1,2,'2023-12-16 21:37:14');
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','password','admin@gmail.com'),(2,'user1','password','user1@gmail.com'),(3,'catlead','catlead','12345676'),(6,'akSchams','12345676','admakn@gmail.com'),(9,'meme','12345676','meme@gmail.com'),(10,'user1080','user1080','user1080@gmail.com'),(11,'dacvungam','dacvungam','dacvu@gmail.com'),(12,'datvu','datvu','datvu@gmail.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-16 22:33:31
