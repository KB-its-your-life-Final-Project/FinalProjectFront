import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//env 가져오기
dotenv.config();

//백엔드 설정
const backendUrl = `http://localhost:${process.env.VITE_BACKEND_PORT}` || "http://localhost:8080";

function checkServerStatus(url) {
  const promise = new Promise((resolve) => {
    //http 구별
    const protocol = url.startsWith("https") ? https : http;

    //status 가졍오기
    const req = protocol.get(url, (res) => {
      resolve(res.statusCode === 200);
    });

    //에러
    req.on("error", () => {
      resolve(false);
    });

    //5초이상 응답 없어도 fail
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });

  return promise;
}

//파일 생성 위치
const outputPath = join(__dirname, "../src/api/autoLoad");

//swagger로 api 가져오기 명령어
const command = `npx swagger-typescript-api generate --path ${backendUrl}/v2/api-docs --output ${outputPath} --http-client axios --modular --modular-type`;

//타입 생성 시작
async function generateTypes() {
  try {
    //서버 체크
    console.log("Checking Server...");
    const isRunning = await checkServerStatus(backendUrl);

    //응답없음
    if (!isRunning) {
      console.log("Backend Server is not responding");
    } else {
      console.log("Backend Server is currently running");
      console.log("Generating Types...");
      //커맨드 실행
      execSync(command, { studio: "inherit" });
      console.log("Modular types generated successfully!");
    }
  } catch (error) {
    console.error("Failed generate-types process", error.message);
  }
}

generateTypes();
