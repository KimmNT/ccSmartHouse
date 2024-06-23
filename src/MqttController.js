// mqttUtils.js
import mqtt from "mqtt";

export const brokerConfig = {
  host: "103.151.238.68",
  port: 8087,
  protocol: "websockets",
  username: "guest",
  password: "123456a@",
};

export const brokerUrl = `${brokerConfig.protocol}://${brokerConfig.host}`;

export const connectToBroker = (setClient, qos = 0) => {
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

  return mqttClient;
};

export const publishMessage = (client, topic, message, setResponse) => {
  client.publish(topic, message, (err) => {
    if (err) {
      console.error(`Error publishing message on topic ${topic}:`, err);
    } else {
      setResponse(message);
      console.log(`Published message "${message}" to topic ${topic}`);
    }
  });
};
