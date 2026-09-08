# XMLCraft 🛡️

**A 100% air-gapped, zero-egress, privacy-first XML Workbench and Data Studio for enterprise developers.**

[**View Live App**](https://xmlcraft.app)

---

## 🛑 The Problem

Engineers working in banking, healthcare, or strictly regulated enterprises frequently need to format, query (XPath), transform (XSLT), and debug complex XML payloads like **ISO 20022 payment messages**, **HL7/FHIR healthcare records**, or **SOAP/SAML assertions**.

However, because these payloads contain highly sensitive PII (Personally Identifiable Information) or financial data, **engineers are strictly forbidden by corporate DLP (Data Loss Prevention) monitors and Secure Web Gateways from pasting this data into random online XML formatters** because those sites send the data to external backend servers.

## 💡 The Solution

XMLCraft is a modern, web-based alternative to heavy desktop applications (like Altova XMLSpy) that **executes entirely in your browser's local memory**. 

It has an absolute **zero-backend architecture**. 
- No network requests are made. 
- No telemetry or analytics are collected.
- Nothing is ever saved to `localStorage` or `IndexedDB`.
- It enforces a strict Content Security Policy (`connect-src 'none'`) ensuring that data physically cannot leave the client-side sandbox.

## ✨ Features

- **Blazing Fast Virtualized Explorer:** Formats and explores massive 50MB+ XML files (e.g., 100,000 ISO 20022 transactions) instantly without crashing the browser.
- **Local File Upload/Download:** Read huge XML files securely from your hard drive via the HTML5 FileReader API, without uploading them to any server.
- **XPath 1.0 Query Engine:** Write and evaluate XPath queries in real-time. It automatically handles tricky default namespaces.
- **Data Sanitizer (PII Masking):** Safely obfuscate sensitive fields (e.g., `<IBAN>`, `<AccountNumber>`, `<Password>`) with asterisks via a single click while perfectly preserving the XML structure.
- **XSLT 1.0 Sandbox:** Test and apply XSLT transformations directly against your payload.
- **XML to JSON Converter:** Convert complex XML payloads to structured JSON natively.

## 🚀 Tech Stack

- **Framework:** Next.js (App Router, Static HTML Export)
- **Styling:** Tailwind CSS v4 & Lucide React
- **Editor:** CodeMirror 6
- **Tree Virtualization:** TanStack Virtual (`@tanstack/react-virtual`)
- **State Management:** Zustand (Transient memory only)

## 💻 Local Development

1. Clone the repository:
   \`\`\`bash
   git clone git@github.com:KaviAbhishekVenkat/xmlcraft.git
   cd xmlcraft
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000)

## 🤖 Attribution

This project was built entirely using AI assistance via **Google Antigravity**, executing autonomously in a zero-backend constraint environment. It demonstrates how AI can architect and implement secure, compliance-ready enterprise tooling from scratch.

## 📜 License

MIT License. Open source and free to use.
