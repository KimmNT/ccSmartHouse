import mqtt from "mqtt";
import React, { useEffect, useState } from "react";

export default function DetailPage() {
  const [client, setClient] = useState(null);
  const [qos, setQos] = useState(2);

  const brokerConfig = {
    host: "103.151.238.68",
    port: 8087,
    protocol: "websockets",
    username: "guest",
    password: "123456a@",
  };
  // BROKER URL
  // const brokerUrl = `${brokerConfig.protocol}://${brokerConfig.host}:${brokerConfig.port}`;
  const brokerUrl = `${brokerConfig.protocol}://${brokerConfig.host}`;

  //MQTT
  useEffect(() => {
    const mqttClient = mqtt.connect(brokerUrl, brokerConfig);
    setClient(mqttClient);
    mqttClient.on("connect", () => {
      console.log("CONNECTED");
      mqttClient.subscribe("server/test", { qos }, (err) => {
        if (err) {
          console.error(`Error subscribing to topic:`, err);
        }
      });
    });

    mqttClient.on("message", (topic, payload) => {
      try {
        // const now = new Date();
        // let hours = String(now.getHours()).padStart(2, "0");
        // let minutes = String(now.getMinutes()).padStart(2, "0");
        // let seconds = String(now.getSeconds()).padStart(2, "0");
        // let current = `${hours}:${minutes}:${seconds}`;
        // console.log(current);
        const receivedMessage = payload.toString();
        console.log(`Received message on topic ${topic}:`, receivedMessage);
      } catch (error) {
        console.error(`Error parsing JSON message on topic ${topic}:`, error);
      }
    });

    mqttClient.on("error", (error) => {
      console.error("MQTT Error:", error);
    });

    mqttClient.on("close", () => {
      console.log("Connection to MQTT broker closed");
    });

    mqttClient.on("offline", () => {
      console.log("MQTT client is offline");
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const handleTurnOn = () => {
    client.publish("device/test", "LCTRL-03-ER", { qos });
  };
  const handleTurnOff = () => {
    client.publish("device/test", "LCTRL-03-OK", { qos });
  };

  return (
    <div>
      <button onClick={handleTurnOn}>FIRE!!!!</button>
      <button onClick={handleTurnOff}>NAHH!!!!</button>
    </div>
  );
}
