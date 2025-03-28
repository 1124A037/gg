// 定義引腳
const int trigPin = 9;
const int echoPin = 10;
const int ledPin = 8;

// 定義變數
long duration;
int distance;

void setup() {
  // 初始化引腳模式
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin, OUTPUT);
  // 初始化序列通訊
  Serial.begin(9600);
}

void loop() {
  // 發送超音波脈衝
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // 讀取回聲脈衝的持續時間
  duration = pulseIn(echoPin, HIGH);

  // 計算距離
  distance = duration * 0.034 / 2;

  // 在序列監視器上輸出距離
  Serial.print("Distance: ");
  Serial.println(distance);

  // 根據距離控制LED
  if (distance < 20) { // 如果距離小於20公分
    digitalWrite(ledPin, HIGH); // 點亮LED
  } else {
    digitalWrite(ledPin, LOW); // 熄滅LED
  }

  delay(100);
}


