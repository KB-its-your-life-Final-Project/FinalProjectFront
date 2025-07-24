import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//env 가져오기
dotenv.config();

//백엔드 설정
const backendPort = process.env.VITE_BACKEND_PORT || 8080
const backendUrl = `http://localhost:${backendPort}`;

//파일 생성 위치
const outputPath = join(__dirname, "../api/autoLoad");

//swagger로 api 가져오기 명령어
const command = `npx swagger-typescript-api generate --path ${backendUrl}/v2/api-docs --output ${outputPath} --modular --modular-type`;

try {
  execSync(command, { stdio: "inherit" });
  console.log("Modular types generated successfully!");
} catch (error) {
  console.error("Failed to generate types:", error.message);
  process.exit(1);
}
