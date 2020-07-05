# Restaurant Forum 餐廳論壇

這是一個利用 MySQL + Express + Node.js 所打造的 餐廳論壇

**Heroku 專案連結:** [https://floating-island-40859.herokuapp.com/](https://floating-island-40859.herokuapp.com/)

## 專案畫面

**登入畫面/LoginPage**
![專案畫面](/public/images/screenshot_1.png)

**註冊畫面/RegisterPage**
![專案畫面](/public/images/screenshot_2.png)

**管理者新增餐廳畫面/Admin Create Restaurant**
![專案畫面](/public/images/screenshot_3.png)

**餐廳後台管理畫面/Restaurants Management**
![專案畫面](/public/images/screenshot_4.png)

**帳號權限管理畫面/User Auth Management**
![專案畫面](/public/images/screenshot_5.png)

## 安裝&使用

#### 下載專案

```
git clone https://github.com/waiting33118/restaurant-forum.git
```

#### 安裝 Package

```
npm install
```

#### 建立 MySQL Connection(請在 WorkBench 裡操作 SQL 指令)

**預設密碼為 password**

```
drop database if exists restaurant_forum;
create database restaurant_forum;
use restaurant_forum;
```

#### 建立 Table & Schema (請在 VSCode 裡操作 Sequelize 指令)

```
npx sequelize db:migrate
```

#### 建立種子資料 (請在 VSCode 裡操作 Sequelize 指令)

```
npx sequelize db:seed:all
```

#### 使用 nodemon 啟動伺服器

```
npm run dev
```

#### 或正常啟動

```
npm start
```

#### 進入專案

[http://localhost:3000](http://localhost:3000)

#### 預設測試帳號 Default Testing Account

```
   email:  root@example.com
password:  12345678
   email:  user1@example.com
password:  12345678
   email:  user2@example.com
password:  12345678
```

## 環境建置

```
"node":"^12.18.1",
"bcryptjs": "^2.4.3",
"body-parser": "^1.19.0",
"connect-flash": "^0.1.1",
"express": "^4.17.1",
"express-handlebars": "^4.0.4",
"express-session": "^1.17.1",
"faker": "^4.1.0",
"imgur-node-api": "^0.1.0",
"method-override": "^3.0.0",
"multer": "^1.4.2",
"mysql2": "^2.1.0",
"passport": "^0.4.1",
"passport-local": "^1.0.0",
"pg": "^8.2.1",
"sequelize": "^6.2.4",
"sequelize-cli": "^6.1.0"
```

## 產品功能(User Story)

- 使用者可以**瀏覽**所有的餐廳(In progress...開發中...)
- 管理者可以**新增**餐廳
- 管理者可以**修改**餐廳內容
- 管理者可以**刪除**餐廳
- 管理者可以**修改**使用者權限
- 遊客必須先**註冊**帳號才可使用此服務

## Contributor

- [x] TonyChung
