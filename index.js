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
             messages: [{role: "user", content: prompt}], 
             temperature: 0.7
        });
    
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

