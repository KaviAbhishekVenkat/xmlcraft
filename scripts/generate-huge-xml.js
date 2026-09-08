const fs = require('fs');
const path = require('path');

const generatePain001 = (numTx, filename) => {
    const filePath = path.join(__dirname, '..', 'public', filename);
    const stream = fs.createWriteStream(filePath);

    stream.write(`<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG_HUGE_${Date.now()}</MsgId>
      <CreDtTm>2023-10-25T10:30:00Z</CreDtTm>
      <NbOfTxs>${numTx}</NbOfTxs>
      <CtrlSum>${(numTx * 1500.00).toFixed(2)}</CtrlSum>
      <InitgPty>
        <Nm>Enterprise Bank Group</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT_BATCH_001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <Dbtr>
        <Nm>Acme Corp Global</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>GB12ABCD34567890123456</IBAN>
        </Id>
      </DbtrAcct>`);

    for (let i = 0; i < numTx; i++) {
        stream.write(`
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>E2E_${i}_${Date.now()}</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="USD">1500.00</InstdAmt>
        </Amt>
        <CdtrAgt>
          <FinInstnId>
            <BIC>BOFAUS3N</BIC>
          </FinInstnId>
        </CdtrAgt>
        <Cdtr>
          <Nm>Vendor ${i} LLC</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>US9876543210987654321${i % 10}</IBAN>
          </Id>
        </CdtrAcct>
        <Purp>
          <Cd>SUPP</Cd>
        </Purp>
      </CdtTrfTxInf>`);
    }

    stream.write(`
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`);
    
    stream.end();
    
    stream.on('finish', () => {
        const stats = fs.statSync(filePath);
        console.log(`Generated ${filename} with ${numTx} transactions. Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    });
};

// Generate test payloads
generatePain001(1000, 'huge_payload_1k.xml');
generatePain001(10000, 'huge_payload_10k.xml');
generatePain001(100000, 'huge_payload_100k.xml');
