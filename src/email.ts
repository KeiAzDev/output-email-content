import imaps, { ImapSimple, ImapSimpleOptions, Message } from "imap-simple";
import dotenv from "dotenv";
import * as cheerio from "cheerio";

dotenv.config();

const config: ImapSimpleOptions = {
  imap: {
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASS || "",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 10000,
  },
};

function extractTextFromHTML(html: string): string {
  const $ = cheerio.load(html);
  return $.text().trim();
}

async function fetchEmails() {
  try {
    const connection: ImapSimple = await imaps.connect(config);
    await connection.openBox("INBOX");

    const searchCriteria = ["UNSEEN"]; // 未読メールのみ取得
    const fetchOptions = { bodies: ["HEADER", "TEXT"], markSeen: false };

    const messages: Message[] = await connection.search(searchCriteria, fetchOptions);

    messages.forEach((message: Message, index: number) => {
      const all = message.parts.find((part) => part.which === "TEXT");
      
      if (all && all.body) {
        const emailBodyHTML = all.body;
        const emailBodyText = extractTextFromHTML(emailBodyHTML);
        console.log(`📧 ${index + 1}: ${emailBodyText}`);
      } else {
        console.log(`📧 ${index + 1}: (本文なし)`);
      }
    });

    connection.end();
  } catch (error) {
    console.error("エラー:", error);
  }
}

fetchEmails();
