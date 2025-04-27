void setup() {
    Serial.begin(9600); // 初始化串口
}

void loop() {
    int sensorValue = analogRead(A0); // 讀取可變電阻數值
    Serial.println(sensorValue);      // 發送數據到串口
    delay(50);                       // 每 100 毫秒發送一次
}
