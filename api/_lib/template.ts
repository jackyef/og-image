import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);
const avatar = `data:image/png;base64,${readFileSync(
  `${__dirname}/../_images/3d-avatar-optimized.png`
).toString("base64")}`;

function getCss(theme: string, _fontSize: string) {
  let background = "white";
  let foreground = "black";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "#111820";
    foreground = "white";
    radial = "#1F2930";
  }

  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
    }

    .avatar {
      position: absolute;
      left: -120px;
      height: 100%;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-family: 'Inter', sans-serif;
        font-size: 100px;
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
        margin-left: 38%;
        display: flex;
        height: 100%;
        max-height: 500px;
        padding: 160px 80px 160px 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize } = parsedReq;

  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <img class="avatar" src="${avatar}"></img>
        <div class="heading">${emojify(
          md ? marked(text) : sanitizeHtml(text)
        )}
        </div>
    </body>
</html>`;
}
