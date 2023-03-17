import { Configuration, OpenAIApi } from "openai";
import Koa from "koa"
import Router from "koa-router";

// https://platform.openai.com/docs/api-reference/images

const configuration = new Configuration({
//     organization: process.env.APP_ORG,
    apiKey: process.env.APP_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

const app = new Koa()
const router = new Router();


router.get("/chat", async (ctx, next) => {
    // 获取请求中的参数
    const { prompt } = ctx.request.query;

//     const res = await openai.createCompletion({
//         // 对话模型
//         model: "text-davinci-003",//  text-davinci-003 对话模型
//         prompt: prompt,
//         max_tokens: 2048,
//         temperature: 0.2
//     })
    // gpt-3.5-turbo
// replace .createCompletion() with .createChatCompletion()
    const res = await openai.createChatCompletion({ 
             model: "gpt-3.5-turbo",
// replace prompt with messages and set prompt as content with a role.
             messages: [{"role": "system", "content": "你是一个旅游博主，有很丰富旅游经历，能够写出很受欢迎的旅游攻略。"},
             {"role": "user", "content": "写一份长沙游玩3天的旅行攻略"},
             {"role": "assistant", "content": "长沙3天旅游攻略。行李准备:1、证件类:驾驶证、身份证、学生证等优惠证件。2、电器类：手机、充电器、耳机、充电宝、相机、自拍杆。3、护肤类：化妆品、防晒霜、卸妆水、护肤品、口红。4、生活类：洗漱用品、兩伞手背包宝纸巾、食物、湿纸巾。5、药品类：肠胃药、消食片、感冒药、创可贴、晕车药。6、出门前注意：关闭门窗、倒垃圾、关电源查看天气。美食推荐:1、光脑壳家常菜馆,藏老小区里最接地气的苍蝇小馆一这家店真的很小。2、天马牛肉饼，每次去都排满长长的队回外表皮炸到焦黄酥脆，酥到咬一口就掉渣。行程规划：DAY1:五一广坊→IFS国金中心→太平老街→坡子街→黄兴路步行街。DAY2:岳麓山→岳麓书院→橘子洲→万家雨广场→扬帆夜市。DAY3:谢子龙影像艺术中心→李自健美术馆→湖南博物院→四方坪夜市。避坑:1、不要和孙悟空、僵尸、等合照，都是收费的。千万别买水果捞，特别贵！~看完这篇就可以快乐游长沙啦~"},
             {role: "user", content: prompt}], 
//              messages: [{role: "user", content: "简单介绍一下自己"}], 
             temperature: 0.7
        });
    console.log(res.data.choices[0].message.content);
    // 将生成的内容返回给客户端
    ctx.body = res.data.choices[0].message
});

router.get("/image", async (ctx, next) => {
    // 获取请求中的参数
    const { prompt } = ctx.request.query;
    const res = await openai.createImage({
        // 对话模型
        model: "image-alpha-001",
        prompt: prompt,
        size: "256x256",
        n: 1
    })
    // 将生成的内容返回给客户端
    var url = res.data.data[0].url

    ctx.body = "<img src=\"" + url + "\"></>"
});


// 启用路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
app.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
});

