import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
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

    //status 가져오기
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

/**
 * http-client.ts 파일에 withCredentials: true 설정을 자동 추가하는 함수
 * - axios 인스턴스 생성 시 쿠키 등 인증 정보를 자동 포함
 * - swagger-typescrypt-api 실행 후 파일을 읽어와 수정
 */
async function addCredentials() {
  const httpClientPath = join(outputPath, "http-client.ts");
  try {
    let content = fs.readFileSync(httpClientPath, "utf8");

    // withCredentials 설정 없으면 추가
    if (!content.includes("withCredentials")) {
      // axios.create 호출 부분을 찾아서 withCredentials: true 추가
      content = content.replace(/axios\.create\(\{([\s\S]*?)\}\)/, (match, inner) => {
        // 기존 옵션 뒤에 withCredentials: true 추가
        const modifiedInner = inner.trim().endsWith(",")
          ? `${inner} withCredentials: true,`
          : `${inner}, withCredentials: true,`;
        return `axios.create({${modifiedInner}})`;
      });
      // 수정된 내용을 파일에 다시 쓰기
      fs.writeFileSync(httpClientPath, content, "utf8");
      console.log("withCredentials: true 설정이 http-client.ts 에 추가되었습니다.");
    } else {
      console.log("http-client.ts 에 이미 withCredentials 설정이 존재합니다.");
    }
  } catch (err) {
    console.error("http-client.ts 수정 중 오류 발생:", err);
  }
}

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
      // http-client.ts에 withCredentials 설정 자동 추가
      addCredentials();
      console.log("Modular types generated successfully!");
    }
  } catch (error) {
    console.error("Failed generate-types process", error.message);
  }
}

generateTypes();
