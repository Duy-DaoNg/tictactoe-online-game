package com.example.tictactoeserver.config;

import com.example.tictactoeserver.utils.AesEncryption;
import com.hivemq.client.mqtt.MqttClient;
import com.hivemq.client.mqtt.mqtt3.Mqtt3AsyncClient;
import static java.nio.charset.StandardCharsets.UTF_8;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

public class MqttConfig {
    static Mqtt3AsyncClient client = null;
    static Map<String, Match> matchList = null;
    static List<String> playerQueue = null;
    public MqttConfig() {
        client = MqttConfig.configureAndConnect();
        matchList = new HashMap<>();
        playerQueue = new ArrayList<>();
    }

    public static void sendMessage(String message) {
//        String cipherText = AesEncryption.encrypt(message);
//        assert cipherText != null;
//        client.publishWith()
//                .topic("my/test/topic")
//                .payload(UTF_8.encode(cipherText))
//                .send();
        client.publishWith()
                .topic("my/test/topic")
                .payload(UTF_8.encode(message))
                .send();
    }
    public static void gameStart(String playerId) {
        if(!playerQueue.isEmpty()) {
            if(playerQueue.contains(playerId)) return;
            // TODO: Pop out of queue create new match
            String firstPlayerId = playerQueue.remove(0);
            Match newMatch = new Match(firstPlayerId, playerId);
            matchList.put(newMatch.roomId, newMatch);

            String message =
                            "{\"operation\":\"match-found\"," +
                              "\"roomId\":\"" + newMatch.roomId + "\"," +
                              "\"currentPlayer\":\""+ newMatch.currentPlayer + "\","  +
                              "\"secondId\":\""+ playerId + "\""  +
                            "}";
            sendMessage(message);
        } else {
            playerQueue.add(playerId);
        }
    }
    public static void playerChoice(String roomId, String player, Integer value) {
        Match temp = matchList.get(roomId);
        if( temp != null) {
            if(temp.currentPlayer.compareTo(player) == 0) {
                temp.makeMove(value);
                String message = "";
                switch (temp.result()) {
                    case -1:
                        message =
                                "{\"operation\":\"match\"," +
                                    "\"roomId\":\""+ temp.roomId + "\","  +
                                    "\"currentPlayer\":\""+ temp.currentPlayer + "\"" +
                                "}";
                        break;
                    case 0:
                        message =
                                "{\"operation\":\"result\"," +
                                    "\"roomId\":\""+ temp.roomId + "\","  +
                                    "\"type\":\"draw\"," +
                                    "\"winnerId\":\""+ temp.currentPlayer + "\""  +
                                "}";
                        break;
                    default:
                        message =
                                "{\"operation\":\"result\"," +
                                    "\"roomId\":\""+ temp.roomId + "\"," +
                                    "\"type\":\"winner\"," +
                                    "\"winnerId\":\""+ player + "\"" +
                                "}";

                }
                sendMessage(message);
            }
        }
    }

    public static void restartMatch(String roomId, String player) {
        Match temp = matchList.get(roomId);
        if( temp != null) {
            boolean result = temp.restart(player);
            if (result) {
                String message =
                        "{\"operation\":\"match\"," +
                            "\"roomId\":\""+ roomId + "\","  +
                            "\"currentPlayer\":\""+ temp.currentPlayer + "\"" +
                        "}";
                sendMessage(message);
            }
        }
    }
    public static void disconnectPlayer(String roomId, String player) {
        try {
            playerQueue.remove(player);

            Iterator<Map.Entry<String, Match>> iterator = matchList.entrySet().iterator();

            while (iterator.hasNext()) {
                Map.Entry<String, Match> entry = iterator.next();
                Match value = entry.getValue();

                if (value.firstPlayerID.equals(player) || value.secondPlayerID.equals(player)) {
                    iterator.remove(); // Removes the current entry from matchList

                    String winnerId = (value.firstPlayerID.equals(player)) ? value.secondPlayerID : value.firstPlayerID;
                    value.updateScore(winnerId);
                    value.sendRequest();
                    String message =
                            "{\"operation\":\"result-error\"," +
                                    "\"roomId\":\""+ entry.getKey() + "\","  +
                                    "\"type\":\"winner\"," +
                                    "\"winnerId\":\""+ winnerId + "\"" +
                                    "}";
                    sendMessage(message);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    public static void stopPlay(String roomId, String player) {
        Match temp = matchList.get(roomId);
        matchList.remove(roomId);
        temp.sendRequest();
    }
    public static void exitMatch(String roomId, String player) {
        Match temp = matchList.get(roomId);
        matchList.remove(roomId);
        if (temp == null) return;
        String winner = (player.equals(temp.firstPlayerID)) ? temp.secondPlayerID : temp.firstPlayerID;
        temp.updateScore(winner);
        temp.sendRequest();
        String message =
                "{\"operation\":\"exit-player\"," +
                    "\"roomId\":\""+ roomId + "\","  +
                    "\"type\":\"winner\"," +
                    "\"winnerId\":\""+ winner + "\"" +
                "}";
        sendMessage(message);
    }

    public static Mqtt3AsyncClient configureAndConnect() {
        Mqtt3AsyncClient client = MqttClient.builder()
                .useMqttVersion3()
                .identifier("server-id")
                .serverHost("06cc6c19611745ce805a4ae16024bc92.s2.eu.hivemq.cloud")
                .serverPort(8883)
                .useSslWithDefaultConfig()
                .buildAsync();
        // connect to MQTT broker
        client.connectWith()
                .simpleAuth()
                .username("admin")
                .password("Admin123".getBytes())
                .applySimpleAuth()
                .send()
                .whenComplete((connAck, throwable) -> {
                    if (throwable != null) {
                        // handle failure
                        System.exit(1);
                    } else {

                    }
                });
        client.subscribeWith()
                .topicFilter("my/test/topic")
                .callback(publish -> {
                    // Process the received message
                    String cipherText = String.valueOf(UTF_8.decode(publish.getPayload().get()));

//                    String temp = AesEncryption.decrypt(cipherText);
                    String message = cipherText;
//                    int indexOfTargetChar = cipherText.indexOf("}");

                    System.out.println("Received message: " +
                            publish.getTopic() + " -> " + message);
//                    if (indexOfTargetChar != -1) {
//                        String message = temp.substring(0, indexOfTargetChar + 1);
                    //                    String message = String.valueOf(UTF_8.decode(publish.getPayload().get()));

                        try {
                            ObjectMapper objectMapper = new ObjectMapper();

                            // Parse JSON string to JsonNode
                            JsonNode jsonNode = objectMapper.readTree(message);

                            String operation = jsonNode.get("operation").asText();

                            switch (operation) {
                                case "start":
                                    // TODO: start new game here
                                    String playerStart = jsonNode.get("senderId").asText();
                                    gameStart(playerStart);
                                    break;

                                case "choose":
                                    // TODO: makeMove
                                    String roomId = jsonNode.get("roomId").asText();
                                    String playerChoice = jsonNode.get("senderId").asText();
                                    Integer value = jsonNode.get("value").asInt();
                                    playerChoice(roomId, playerChoice, value);
                                    break;
                                case "restart":
                                    // TODO:
                                    String roomIdRestart = jsonNode.get("roomId").asText();
                                    String playerRestart = jsonNode.get("senderId").asText();
                                    restartMatch(roomIdRestart, playerRestart);
                                    break;
                                case "exit":
                                    // TODO:
                                    String roomIdExit = jsonNode.get("roomId").asText();
                                    String playerExit = jsonNode.get("senderId").asText();
                                    exitMatch(roomIdExit, playerExit);
                                    break;
                                case "disconnect":
                                    String roomIdDis = jsonNode.get("roomId").asText();
                                    String playerDis = jsonNode.get("senderId").asText();
                                    // TODO: pop out of queue terminate match
                                    disconnectPlayer(roomIdDis, playerDis);
                                    break;
                                case "stop":
                                    String roomIdStop = jsonNode.get("roomId").asText();
                                    String playerStop = jsonNode.get("senderId").asText();
                                    stopPlay(roomIdStop, playerStop);
                                    break;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
//                    }
                })
                .send()
                .whenComplete((subAck, newThrowable) -> {
                    if (newThrowable != null) {
                        // Handle failure to subscribe

                    } else {
                        // Handle successful subscription, e.g. logging or incrementing a metric
                    }
                });
        return client;
    }
}

