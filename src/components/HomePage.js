import React, { useEffect, useState } from "react";
import "../sass/shareStyle.scss";
import "../sass/Home.scss";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowAltCircleRight,
  FaPlus,
  FaTimes,
  FaLightbulb,
  FaFan,
  FaWind,
  FaPlug,
} from "react-icons/fa";
import { query } from "firebase/firestore";
import { db, realtimeDB } from "../firebase";
import {
  ref,
  set,
  push,
  get,
  update,
  remove,
  onValue,
} from "firebase/database";
import {
  brokerConfig,
  brokerUrl,
  connectToBroker,
  publishMessage,
} from "../MqttController";

export default function HomePage() {
  //CREATE
  const [isPopUp, setIsPopUp] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceSlot, setDeviceSlot] = useState(0);
  const [deviceType, setDeviceType] = useState("");

  //MQTT
  const [client, setClient] = useState(null);
  const qos = 0;

  //DISPLAY
  const [devices, setDevices] = useState([]);

  const slotArray = [{ slot: 3 }, { slot: 4 }, { slot: 5 }, { slot: 6 }];
  const typeArray = [
    { typeName: "Light" },
    { typeName: "Fan" },
    { typeName: "AC" },
    { typeName: "Socket" },
    { typeName: "Others" },
  ];

  const navigate = useNavigate();

  const { state } = useLocation();
  const userId = state?.userId;
  const userName = state?.userName;

  const navigateToPage = (pageUrl, stateData) => {
    navigate(pageUrl, { state: stateData });
  };

  useEffect(() => {
    const mqttClient = connectToBroker(setClient, qos);
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  useEffect(() => {
    if (userId) {
      const devicesRef = ref(realtimeDB, `devices/${userId}`);
      // Set up the real-time listener
      const unsubscribe = onValue(devicesRef, (snapshot) => {
        if (snapshot.exists()) {
          const devicesData = snapshot.val();
          const devicesList = Object.keys(devicesData).map((key) => ({
            id: key,
            ...devicesData[key],
          }));
          setDevices(devicesList);
        } else {
          setDevices([]);
        }
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } else {
      console.error("Error: userId is undefined.");
    }
  }, [userId]);

  const handleCreateDevice = () => {
    if (!userId) {
      console.error("Error: userId is undefined.");
      return;
    }

    // Create a unique reference for each new device under the userId
    const newDeviceRef = push(ref(realtimeDB, `devices/${userId}`));

    set(newDeviceRef, {
      deviceName: deviceName,
      deviceSlot: deviceSlot,
      deviceType: deviceType,
      state: 0,
      userId: userId,
    })
      .then(() => {
        // Clear the input fields
        setDeviceName("");
        setDeviceSlot(0);
        setDeviceType("");
        setIsPopUp(false);
      })
      .catch((error) => {
        console.error("Error creating device: ", error);
      });
  };

  const TurnDeviceOn = (device) => {
    const editDeviceId = device.id;
    if (!editDeviceId) {
      console.error("Error: editDeviceId is undefined.");
      return;
    }
    const deviceRef = ref(realtimeDB, `devices/${userId}/${editDeviceId}`);
    update(deviceRef, {
      state: 1,
    }).catch((error) => {
      console.error("Error updating device: ", error);
    });
    if (client) {
      publishMessage(client, "device/test", `LCTRL-0${device.deviceSlot}-ER`, {
        qos,
      });
    }
  };
  const TurnDeviceOff = (device) => {
    const editDeviceId = device.id;
    if (!editDeviceId) {
      console.error("Error: editDeviceId is undefined.");
      return;
    }
    const deviceRef = ref(realtimeDB, `devices/${userId}/${editDeviceId}`);
    update(deviceRef, {
      state: 0,
    }).catch((error) => {
      console.error("Error updating device: ", error);
    });
    if (client) {
      publishMessage(client, "device/test", `LCTRL-0${device.deviceSlot}-OK`, {
        qos,
      });
    }
  };

  const handleDeleteDevice = (deviceId) => {
    const deviceRef = ref(realtimeDB, `devices/${userId}/${deviceId}`);

    remove(deviceRef).catch((error) => {
      console.error("Error deleting device: ", error);
    });
  };

  return (
    <div className="container">
      <div className="home__container">
        <div className="home__content">
          <div className="home__headline">
            <div className="headline__welcome">Welcome back!</div>
            <div className="headline__exit" onClick={() => navigateToPage("/")}>
              <FaArrowAltCircleRight />
            </div>
          </div>
          <div className="home__item">
            {devices.map((device, index) => (
              <div
                className={`device ${
                  device.state === 1 ? "active" : "inactive"
                }`}
                key={index}
              >
                <div className="device__headline">
                  <div className="devce__name">{device.deviceName}</div>
                  <div className="device__btn_control">
                    {device.state === 0 ? (
                      <div
                        className="btn off"
                        onClick={() => TurnDeviceOn(device)}
                      >
                        off
                      </div>
                    ) : (
                      <div
                        className="btn on"
                        onClick={() => TurnDeviceOff(device)}
                      >
                        on
                      </div>
                    )}
                  </div>
                </div>
                <div className="device__type">
                  {device.deviceType === "Light" ? (
                    <FaLightbulb
                      className={`light ${
                        device.state === 1 ? "active" : "inactive"
                      }`}
                    />
                  ) : device.deviceType === "Fan" ? (
                    <FaFan
                      className={`fan ${
                        device.state === 1 ? "active" : "inactive"
                      }`}
                    />
                  ) : device.deviceType === "AC" ? (
                    <FaWind
                      className={`ac ${
                        device.state === 1 ? "active" : "inactive"
                      }`}
                    />
                  ) : device.deviceType === "Socket" ? (
                    <FaPlug
                      className={`plug ${
                        device.state === 1 ? "active" : "inactive"
                      }`}
                    />
                  ) : (
                    <FaPlus
                      className={`plus ${
                        device.state === 1 ? "active" : "inactive"
                      }`}
                    />
                  )}
                </div>
                <div
                  className="device__delete"
                  onClick={() => handleDeleteDevice(device.id)}
                >
                  <FaTimes />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="home__adding" onClick={() => setIsPopUp(true)}>
        <FaPlus />
      </div>
      {isPopUp ? (
        <div className="create__container">
          <div className="create__content">
            <div className="create__headline">Create new</div>
            <div className="create__form">
              <div className="form__item">
                <div className="item__lable">Device name</div>
                <input
                  type="text"
                  placeholder="Name"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                />
              </div>
              <div className="form__choose">
                <div className="item__lable">Device slot</div>
                <div className="item__list">
                  {slotArray.map((item, index) => (
                    <div
                      className={`item ${
                        item.slot === deviceSlot ? `active` : `inactive`
                      }`}
                      key={index}
                      onClick={() => setDeviceSlot(item.slot)}
                    >
                      {item.slot}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form__choose">
                <div className="item__lable">Device type</div>
                <div className="item__list">
                  {typeArray.map((item, index) => (
                    <div
                      className={`item ${
                        item.typeName === deviceType ? `active` : `inactive`
                      }`}
                      key={index}
                      onClick={() => setDeviceType(item.typeName)}
                    >
                      {item.typeName}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form__btn" onClick={handleCreateDevice}>
                <div className="btn__text">create</div>
              </div>
            </div>
            <div
              className="create__icon"
              onClick={() => {
                setIsPopUp(false);
                setDeviceName("");
                setDeviceSlot(0);
                setDeviceType("");
              }}
            >
              <FaTimes />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
