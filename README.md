# README

## 應用程式說明

* 使用 express 打造的餐廳論壇網站

* 實作 MVC 實作 express-handlebars 頁面渲染與 API 伺服器

* 實作 RESTful APIs 路由設計

* MVC 登入使用 passport-local 實作帳號、密碼驗證登入

* API 登入使用 passport-jwt 實作 token-based 驗證登入



## 應用程式畫面

登入頁

![登入](https://ppt.cc/fA6Drx@.png)

登入後頁面

![登入後頁面](https://ppt.cc/fG7gEx@.png)

後台頁面

![後台頁面](https://ppt.cc/flV9ax@.png)

API 完整說明可以查看 **[API 使用說明](https://luminous-whistle-d3b.notion.site/ALPHA-Camp-111e574ad60b80f29718c09bdd3c2db0)**

| 方法  | URL               |
|-------|-------------------|
| GET   | /api/restaurants   |

## 檔案下載

1. Fork
2. git clone

## 初始化(Initialize)

安裝相關套件

```
npm install
```

設定環境變數
* 建立 .env 檔案
* 新增變數 JWT_SECRET 

![還境變數](https://ppt.cc/fZoeex@.png)

## 設定資料庫

需要與 config/database.js 一致

```
create database forum;
```

使用 migration 在資料庫建立資料表

```
npx sequelize db:migrate
```

建立種子資料

```
npx sequelize db:seed:all
```

### 執行測試

```
npm run test
```
