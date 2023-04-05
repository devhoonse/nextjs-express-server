const { parse } = require('url');
const next = require('next');
const express = require('express');

/**
 * 현재 어플리케이션이 production 환경에서 동작 중인지 여부
 */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Next.js 어플리케이션 참조
 */
const nextApp = next({
  dev: !isProduction
});

/**
 * 자신에게 들어오는 GET 요청들을 Next.js 로 전달하는 Express.js 서버를 구동합니다.
 */
async function main() {
  try {
    // Next.js 어플리케이션이 준비되기를 기다립니다.
    await nextApp.prepare();

    /**
     * Next.js 의 요청 핸들러 객체 참조
     */
    const nextRequestHandler = nextApp.getRequestHandler();

    /**
     * Express.js 서버 객체 참조
     */
    const expressServer = express();

    // 예시 1 - Express.js 서버로 들어오는 모든 GET 요청은 Next.js 요청 핸들러로 전달합니다.
    // expressServer
    //   .get('*', (req, res) => {
    //     const url = parse(req.url, true);
    //     requestHandler(req, res, url);
    //   })
    //   .listen(3000, () => { // Express.js 서버의 서비스 포트를 설정하고 기동합니다.
    //     console.log('Express.js Server Listening on Port ', 3000);
    //   });

    // 예시 2 - 특정 라우트에 대한 요청만 Next.js 핸들러로 전달합니다.
    expressServer
      .get('/', (req, res) => {
        res.send('Hello World!');
      })
      .get('/api/greet', (req, res) => {
        res.json({ name: req.query?.name ?? 'unknown' });
      })
      .get('/about', (req, res) => {
        // /about 요청은 Next.js 가 렌더링한 페이지를 응답합니다.
        const { query } = parse(req.url, true);
        nextApp.render(req, res, '/about', query);
      })
      .get(/_next\/.+/, (req, res) => {
        // Next.js 페이지의 하이드레이션에 필요한 정적 자원들을 제공하기 위한 요청 경로입니다.
        const parsedUrl = parse(req.url, true);
        nextRequestHandler(req, res, parsedUrl);
      })
      .listen(3000, () => { // Express.js 서버의 서비스 포트를 설정하고 기동합니다.
        console.log('Express.js Server Listening on Port ', 3000);
      });
  } catch (error) {
    console.error('Problem Preparing Express.js Server...', error);
  }
}

// Express.js 서버를 실행합니다.
main();
