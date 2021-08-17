# checker

一个可配置的，用于河北农业大学检查签到情况的 Web 应用。

提供到 http://211.68.191.30:8090/ 的正向代理接口。

该应用目前部署在 http://1.117.228.194/。

## build

```shell
npm i
npm run build
```

## usage

```shell
npm start
```

## config

如果需要查询你的班级，请在 `server/public/config.json` 中的 classes 数组下添加一个对象，然后提交 PR 给我。

```ts
interface classesElement{
  name: string;    // 下拉框中显示的班级姓名
  stuid: number[]; // 该班级的所有学号
}
```
