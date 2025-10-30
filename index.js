const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const mqtt = require("mqtt");

// Serial Arduino
const port = new SerialPort({ path: "COM5", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// MQTT via WebSocket
const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt"); // WebSocket público HiveMQ
const topicDados = "senai/iot/dht11";

client.on("connect", ()=>{
  console.log("Conectado MQTT!");
});

// Recebe dados do Arduino via Serial e publica no MQTT
parser.on("data", (line)=>{
  try{
    const data = JSON.parse(line.trim());
    console.log("Recebido Arduino:", data);
    client.publish(topicDados, JSON.stringify(data));
  }catch(e){
    console.log("Erro parse:", line);
  }
});
