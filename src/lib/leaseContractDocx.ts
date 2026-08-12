import {
  AlignmentType,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { readFile } from "fs/promises";
import path from "path";
import { formatThaiDate } from "./format";
import { thaiBahtText } from "./thaiBahtText";
import type { LeaseContract } from "./types";

function money(n: number) {
  return n.toLocaleString("th-TH");
}

function date(iso: string | null) {
  return iso ? formatThaiDate(iso) : "………………………………";
}

function blank(value: string) {
  return value.trim() || "………………………………";
}

function textWithBreaks(text: string): TextRun[] {
  return text.split("\n").flatMap((line, i) => (i === 0 ? [new TextRun(line)] : [new TextRun({ text: line, break: 1 })]));
}

function para(text: string, opts?: { bold?: boolean; align?: (typeof AlignmentType)[keyof typeof AlignmentType]; spacingBefore?: number }) {
  return new Paragraph({
    alignment: opts?.align,
    spacing: { after: 160, before: opts?.spacingBefore },
    children: [new TextRun({ text, bold: opts?.bold })],
  });
}

/** Mirrors each <p className="indent-8"><b>ข้อ N</b> ...</p> block in LeaseContractPrint.tsx. */
function clause(body: string, label?: string, opts?: { spacingBefore?: number; pageBreakBefore?: boolean }) {
  return new Paragraph({
    indent: { firstLine: 480 },
    spacing: { after: 160, before: opts?.spacingBefore },
    pageBreakBefore: opts?.pageBreakBefore,
    children: [...(label ? [new TextRun({ text: `${label} `, bold: true })] : []), ...textWithBreaks(body)],
  });
}

function cell(text: string, opts?: { align?: (typeof AlignmentType)[keyof typeof AlignmentType]; bold?: boolean; colSpan?: number }) {
  return new TableCell({
    columnSpan: opts?.colSpan,
    children: [new Paragraph({ alignment: opts?.align, children: [new TextRun({ text, bold: opts?.bold })] })],
  });
}

const headerCell = (text: string) => cell(text, { align: AlignmentType.CENTER, bold: true });

export async function buildLeaseContractDocx(contract: LeaseContract): Promise<Buffer> {
  const rentText = contract.rentPerMonth > 0 ? thaiBahtText(contract.rentPerMonth) : "";
  const depositText = contract.depositAmount > 0 ? thaiBahtText(contract.depositAmount) : "";
  const totalReceipt = contract.reservationDepositAmount + contract.damageDepositAmount;
  const totalReceiptText = totalReceipt > 0 ? thaiBahtText(totalReceipt) : "";

  let logoRun: ImageRun | null = null;
  try {
    const logoBuffer = await readFile(path.join(process.cwd(), "public", "logo-paramee-maroon.png"));
    logoRun = new ImageRun({
      data: logoBuffer,
      transformation: { width: 100, height: 96 },
      type: "png",
    });
  } catch {
    logoRun = null;
  }

  // Pinned to the bottom of whichever page it lands on via an absolute frame
  // (anchored to the page, y-aligned bottom) rather than relying on normal
  // document flow — so it sits flush with the bottom margin regardless of
  // how much checklist content precedes it.
  const signatureBlock = new Paragraph({
    frame: {
      type: "alignment",
      anchor: { horizontal: "margin", vertical: "page" },
      alignment: { x: "center", y: "bottom" },
      width: 9070,
      height: 700,
    },
    alignment: AlignmentType.RIGHT,
    children: [
      new TextRun("ลงชื่อ…………………………………ผู้ให้เช่า"),
      new TextRun({ text: "        ลงชื่อ…………………………………ผู้เช่า" }),
    ],
  });

  const checklistRows = contract.checklistItems.map(
    (item) =>
      new TableRow({
        children: [
          cell(item.name),
          cell(item.ready ? "✓" : "", { align: AlignmentType.CENTER }),
          cell(item.value, { align: AlignmentType.CENTER }),
          cell(item.detail),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        children: [
          // Cover page
          ...(logoRun ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [logoRun] })] : []),
          para("หนังสือสัญญาเช่า (LEASE AGREEMENT)", { align: AlignmentType.CENTER, bold: true, spacingBefore: 200 }),
          para(`ชื่อโครงการ (Project) ${blank(contract.projectName)}`, { spacingBefore: 400 }),
          para(`ที่อยู่ (Address) ${blank(contract.projectAddress)}`),
          para(`ผู้ให้เช่า (The Lessor) ${blank(contract.lessorName)}`),
          para(`ผู้เช่า (The Lessee) ${blank(contract.lesseeName)}`),
          para("Line: @paramee   FB : Paramee Asset", { align: AlignmentType.CENTER, spacingBefore: 600 }),
          para("PARAMEE ASSET Co., LTD.", { align: AlignmentType.CENTER }),

          // Contract body
          para(`สัญญาเช่าห้องชุดโครงการ ${blank(contract.projectName)}`, {
            align: AlignmentType.CENTER,
            bold: true,
            spacingBefore: 200,
          }),
          para(`ทำเมื่อวันที่ ${date(contract.contractDate)}`, { align: AlignmentType.RIGHT }),
          clause(
            `สัญญานี้ทำขึ้นที่ ${blank(contract.projectName)} ${blank(contract.projectAddress)} ระหว่าง ${blank(
              contract.lessorName
            )} เลขบัตรประชาชน ${blank(contract.lessorIdCard)} บ้านเลขที่ ${blank(
              contract.lessorAddress
            )} ซึ่งต่อไปในสัญญานี้จะเรียกว่า "ผู้ให้เช่า" ฝ่ายหนึ่ง กับ ${blank(contract.lesseeName)} เลขบัตรประชาชน ${blank(
              contract.lesseeIdCard
            )} บ้านเลขที่ ${blank(contract.lesseeAddress)} ซึ่งต่อไปในสัญญานี้จะเรียกว่า "ผู้เช่า" อีกฝ่ายหนึ่ง`
          ),
          clause("ทั้งสองฝ่ายตกลงทำสัญญากันโดยมีข้อความดังต่อไปนี้"),
          clause(
            `ผู้เช่าตกลงเช่าและผู้ให้เช่าตกลงให้เช่าห้องพักอาศัยห้องเลขที่ ${blank(contract.roomNumber)} ตึก ${blank(
              contract.building
            )} ชั้น ${blank(contract.floor)} ของห้องชุด ${blank(contract.projectName)} ที่อยู่ ${blank(
              contract.projectAddress
            )}\nเพื่อใช้เป็นที่พักอาศัย ในอัตราค่าเช่าเดือนละ ${money(
              contract.rentPerMonth
            )} บาท (${rentText}) ค่าเช่านี้รวมถึงค่าส่วนกลางรายเดือน แต่ไม่รวมค่าไฟฟ้า ค่าน้ำประปา ซึ่งผู้เช่าต้องชำระแก่ผู้ให้เช่าตามอัตราที่กำหนดไว้ในสัญญาข้อ 4`,
            "ข้อ 1"
          ),
          clause(
            `ผู้เช่าตกลงเช่าห้องพักอาศัยตามสัญญาข้อ 1 มีกำหนดเวลา ${contract.contractYears || "…"} ปี นับตั้งแต่ วันที่ ${date(
              contract.startDate
            )} ถึง วันที่ ${date(contract.endDate)}`,
            "ข้อ 2"
          ),
          clause(
            `การชำระค่าเช่า ผู้เช่าตกลงจะชำระค่าเช่าแก่ผู้ให้เช่าเป็นการล่วงหน้า โดยชำระภายใน วันที่ 1 ของทุกเดือนตลอดเวลาอายุการเช่า โดยการโอนเข้า\nบัญชีธนาคาร ${blank(
              contract.bankName
            )} เลขที่ ${blank(contract.bankAccountNumber)}\nชื่อบัญชี ${blank(
              contract.bankAccountName
            )}\nและถ้าชำระล่าช้าเกินกว่าวันที่ ${blank(contract.paymentDueDay)} ของทุกเดือน ผู้เช่ายินยอมให้ปรับวันละ 500 บาท`,
            "ข้อ 3"
          ),
          clause(
            "ผู้ให้เช่าคิด ค่าไฟฟ้า ค่าน้ำประปา ในอัตราดังนี้\n(1) ค่าไฟฟ้าตามใบแจ้งหนี้ของการไฟฟ้า\n(2) ค่าน้ำประปา ผู้เช่าต้องชำระ ตามจำนวนหน่วยที่ใช้ในแต่ละเดือน ที่นิติบุคคล",
            "ข้อ 4"
          ),
          clause(
            `เพื่อเป็นการปฏิบัติตามสัญญาเช่า ผู้เช่าตกลงมอบเงินประกันแก่ผู้ให้เช่าไว้เป็น จำนวน ${money(
              contract.depositAmount
            )} บาท (${depositText}) เงินประกันนี้ผู้ให้เช่าจะคืนให้แก่ผู้เช่าเมื่อผู้เช่ามิได้ผิดสัญญาและมิได้ค้างชำระเงิน ต่างๆ ตามสัญญานี้`,
            "ข้อ 5"
          ),
          clause(
            "5.1 เงินประกันการเช่านี้ เป็นเงินประกันในการที่ผู้เช่า จะปฏิบัติตามเงื่อนไขตามสัญญาฉบับนี้ และประกันความรับผิดชอบสำหรับค่าเสียหายต่างๆอันอาจเกิดกับห้องชุดและรวมถึงหนี้สินที่ผู้เช่าจะต้องชำระให้แก่ผู้ให้เช่า ซึ่งผู้ให้เช่าจะคืนเงินประกันนี้แก่ผู้เช่า ภายใน 30 วัน นับจากวันที่สัญญาสิ้นสุดลง โดยผู้เช่าไม่ได้กระทำผิดสัญญาข้อใดข้อหนึ่ง และได้ส่งมอบห้องชุดแก่ผู้ให้เช่าในสภาพเรียบร้อย"
          ),
          clause(
            "5.2 ระหว่างอายุสัญญา หากผู้เช่าผิดนัดชำระค่าเช่า นานกว่า 10 วัน นับจากวันกำหนดชำระค่าเช่า และผู้ให้เช่าไม่สามารถติดต่อผู้เช่าได้ หรือไม่มีการบอกกล่าว ผู้ให้เช่ามีสิทธิบอกเลิกสัญญาและยึดเงินประกันทั้งหมดทันที พร้อมทั้งมีสิทธิ์เข้าครอบครองทรัพย์สินที่ให้เช่าได้โดยถูกต้องตามกฎหมาย"
          ),
          clause(
            "5.3 หลังสัญญาเช่าสิ้นสุดลง หากผู้เช่าค้างชำระค่าเช่า หรือค่าใช้จ่ายใดๆที่ต้องชำระแก่ผู้ให้เช่า ผู้ให้เช่ามีสิทธิ์หักเงินประกันนี้ได้ และคืนเงินที่เหลือแก่ผู้เช่า แต่หากเงินประกันไม่พอชำระ ผู้เช่าจะต้องชำระส่วนที่ขาดแก่ผู้ให้เช่า ภายใน 7 วัน"
          ),
          clause(
            "5.4 เงินประกันการเช่านี้ ไม่ได้เป็นส่วนหนึ่งของค่าเช่า ผู้เช่าจะนำเงินประกันมาหักชำระเป็นเงินค่าเช่ารายเดือนไม่ได้ และผู้เช่าไม่มีสิทธิ์ขออาศัยอยู่ในห้องชุดแทนการรับเงินประกันคืนจากผู้ให้เช่า"
          ),
          clause(
            "5.5 กรณีห้องชุดชำรุดเสียหาย อันเนื่องมาจากความผิดของผู้เช่าผู้ให้เช่ามีสิทธิใช้เงินประกันดังกล่าวเพื่อนำมาซ่อมแซมห้องชุดให้กลับคืนสภาพดีดังเดิม และผู้เช่าตกลงจะนำเงินประกันการเช่ามาวางเพิ่มเติมให้ครบตามจำนวนที่ระบุไว้ตามสัญญาข้อ 5 ภายใน 7 วัน"
          ),
          clause(
            "5.6 ในกรณีผู้เช่าแบ่งชำระเงินประกันที่ระบุไว้ตามสัญญาข้อ 5 หลังสัญญาเช่าเริ่มขึ้น หากผู้เช่าไม่สามารถชำระเงินประกันได้ครบตามกำหนดเวลาที่ตกลงไว้ ผู้ให้เช่ามีสิทธิ์บอกเลิกสัญญาฉบับนี้ และมีสิทธิ์ยึดเงินประกันการเช่าทั้งหมด ทั้งนี้ ผู้ให้เช่ายังสามารถเรียกร้องค่าเสียหายอันเกิดจากการใช้ห้องชุดได้อีกส่วนหนึ่งตามความเป็นจริง"
          ),
          clause(
            "5.7 หากผู้เช่ากระทำผิดสัญญาข้อใดข้อหนึ่งในสัญญาฉบับนี้ สัญญาเช่าจะสิ้นสุดลง และผู้ให้เช่ามีสิทธิ์ยึดเงินประกันการเช่าทั้งหมด ทั้งนี้ ผู้ให้เช่ายังสามารถเรียกร้องค่าเสียหายอันเกิดจากการใช้ห้องชุดได้อีกส่วนหนึ่งตามความเป็นจริง"
          ),
          clause(
            `5.8 ค่าทำความสะอาดกรณีผู้เช่าย้ายออก คิดค่าทำความสะอาดและค่าล้างแอร์เป็นเงิน ${money(
              contract.cleaningFee
            )} บาท โดยจะหักกับเงินประกัน กรณีไม่มีทรัพย์สินเสียหายมูลค่าเกินกว่าเงินประกันดังกล่าว`
          ),
          clause("5.9 ผู้ให้เช่าตกลงจะรับผิดชอบค่าใช้จ่ายในการล้างแอร์ปีละ 1 ครั้ง นอกเหนือจากนั้นให้ผู้เช่าเป็นผู้รับผิดชอบค่าใช้จ่ายส่วนนี้เอง"),
          clause(`จำนวนผู้พักอาศัยภายในห้องพักอาศัยเลขที่ ${blank(contract.roomNumber)} จะต้องไม่เกิน 2 คน`, "ข้อ 6"),
          clause(
            "ผู้เช่าต้องเป็นผู้ดูแลรักษาความสะอาดบริเวณทางเดินส่วนกลางหน้าห้องพักอาศัยของผู้เช่า และผู้เช่าจะต้องไม่นำสิ่งของใดๆ มาวางไว้ในบริเวณทางเดินดังกล่าว",
            "ข้อ 7"
          ),
          clause(
            "ผู้เช่าต้องดูแลห้องพักอาศัย ทรัพย์สินต่างๆ รวมทั้งเครื่องใช้ไฟฟ้าในห้องพักดังกล่าวเสมือนเป็นทรัพย์สินของตนเองและต้องรักษาความสะอาดตลอดจนรักษาความสงบเรียบร้อย ไม่ก่อให้เกิดเสียงให้เป็นที่เดือดร้อนรำคาญแก่ผู้อยู่ห้องพักอาศัยข้างเคียง",
            "ข้อ 8"
          ),
          clause(
            "ผู้เช่าต้องเป็นผู้รับผิดชอบในบรรดาความสูญหาย เสียหาย หรือบุบสลายอย่างใดๆ อันเกิดแก่ห้องพักอาศัยและทรัพย์สินต่างๆ ในห้องพักดังกล่าว ในกรณีที่ทรัพย์ที่เช่าชำรุดบกพร่องเล็กน้อย ผู้เช่าจะต้องแจ้งให้ผู้ให้เช่าทราบทันทีและต้องจัดการซ่อมแซมให้อยู่ในสภาพปกติ โดยผู้เช่าเป็นฝ่ายรับผิดชอบค่าใช้จ่ายเอง และหากผู้เช่าไม่จัดการซ่อมแซม ผู้ให้เช่าจัดการซ่อมแซมเองแล้วเรียกเงินค่าใช้จ่ายที่ผู้ให้เช่าต้องเสียไปคืนจากผู้เช่าได้",
            "ข้อ 9"
          ),
          clause(
            "ผู้เช่าต้องยอมให้ผู้ให้เช่า หรือตัวแทนของผู้ให้เช่าเข้าตรวจห้องพักอาศัยได้เป็นครั้งคราวในระยะเวลาอันสมควร โดยมีการนัดล่วงหน้าอย่างน้อย 3-5 วัน",
            "ข้อ 10"
          ),
          clause(
            "ผู้เช่าต้องไม่ทำการดัดแปลง ต่อเติม เจาะ แปะกาวสองหน้า หรือรื้อถอนห้องพักอาศัยและทรัพย์สินต่างๆ ในห้องพักดังกล่าว ไม่ว่าทั้งหมดหรือบางส่วน หากฝ่าฝืน ผู้ให้เช่าจะเรียกให้ผู้เช่าทำทรัพย์สินดังกล่าว ให้กลับคืนสู่สภาพเดิม และเรียกให้ผู้เช่ารับผิดชดใช้ค่าเสียหายอันเกิดความสูญหาย เสียหาย หรือบุบสลายใดๆ อันเนื่องมาจากการดัดแปลง ต่อเติม หรือรื้อถอนดังกล่าว ตามมูลค่าจริง",
            "ข้อ 11"
          ),
          clause(
            `ผู้เช่าสัญญาว่าจะปฏิบัติตามระเบียบข้อบังคับของห้องชุดโครงการ ${blank(
              contract.projectName
            )} สัญญานี้ ซึ่งคู่สัญญาทั้งสองฝ่ายให้ถือว่าระเบียบข้อบังคับดังกล่าวเป็นส่วนหนึ่งแห่งสัญญาเช่านี้ด้วย หากผู้เช่าละเมิดแล้ว ผู้ให้เช่า ย่อมให้สิทธิ์ตามข้อ 14 และข้อ 15 แห่งสัญญานี้ได้`,
            "ข้อ 12"
          ),
          clause(
            "ผู้ให้เช่าไม่ต้องรับผิดชอบในความสูญหายหรือความเสียหายอย่างใดๆ อันเกิดขึ้นแก่รถยนต์ หรือรถจักรยานยนต์ รวมทั้งทรัพย์สินต่างๆ ในรถยนต์ หรือรถจักรยานยนต์ของผู้เช่า ซึ่งได้นำมาจอดไว้ในที่จอดรถที่ผู้ให้เช่าจัดไว้ให้",
            "ข้อ 13"
          ),
          clause(
            "หากผู้เช่าประพฤติผิดสัญญาข้อหนึ่งข้อใด หรือหลายข้อก็ดี ผู้เช่าตกลงให้ผู้ให้เช่าใช้สิทธิดังต่อไปนี้ ข้อใดข้อหนึ่งหรือหลายข้อรวมกันก็ได้ คือ\n(1) บอกเลิกสัญญาเช่า\n(2) เรียกค่าเสียหาย\n(3) บอกกล่าวให้ผู้เช่าปฏิบัติตามข้อกำหนดให้สัญญาภายในกำหนดเวลาที่ผู้ให้เช่าเห็นสมควร\n(4) ตัดกระแสไฟฟ้า น้ำประปา ได้ในทันที โดยไม่จำเป็นต้องบอกกล่าวแก่ผู้เช่าเป็นการล่วงหน้า",
            "ข้อ 14"
          ),
          clause(
            "กรณีสัญญาเลิกกัน ในกรณีที่สัญญาเลิกกันไม่ว่าจะด้วยเหตุครบกำหนดระยะเวลาการเช่า หรือด้วยเหตุหนึ่งเหตุใดก็ตาม ผู้เช่าต้องย้ายบุคคลและทรัพย์สินออกจากทรัพย์ที่เช่า และส่งคืนทรัพย์ที่เช่าให้แก่ผู้ให้เช่าในสภาพเรียบร้อยภายในเวลา 7 วัน นับจากสัญญาเลิกกันและหากผู้เช่าไม่สามารถคืนทรัพย์ที่เช่าได้ภายในเวลาดังกล่าว ผู้เช่ายินยอมชดใช้ค่าเสียหายนับจากวันเลิกสัญญาถึงวันส่งคืนทรัพย์ที่เช่าด้วยในอัตราวันละ 500 บาท\nหากครบกำหนดระยะเวลาตามวรรคแรกแล้ว ผู้เช่ายังไม่ได้ส่งมอบทรัพย์ที่เช่าหรือยังไม่ได้ย้ายบุคคลหรือทรัพย์ให้เสร็จสิ้น หรือยังไม่ได้ซ่อมแซมทรัพย์ที่เช่าให้อยู่ในสภาพเรียบร้อย ผู้ให้เช่ามีสิทธิ์เข้าครอบครองสถานที่เช่าได้และมีสิทธิ์ย้ายบุคคล หรือทรัพย์สินออกจากสถานที่เช่า หรือจัดการซ่อมแซมทรัพย์ที่เช่าให้อยู่ในสภาพเรียบร้อย โดยผู้เช่าจะต้องรับผิดชอบในค่าใช้จ่ายต่าง ๆ ที่ผู้ให้เช่าเสียไป ทั้งนี้ ผู้ให้เช่ามีสิทธิ์ไม่คืนเงินประกันการเช่า ตามที่ระบุไว้ใน สัญญาข้อ 5 ได้ด้วย",
            "ข้อ 15"
          ),
          clause(
            "หากผู้ให้เช่า ขอยกเลิกสัญญาเช่าฉบับนี้ก่อนวันที่กำหนดในสัญญาข้อ 2 ผู้ให้เช่าต้องทำการคืนเงินมัดจำทั้งหมดพร้อมชำระค่าปรับเท่ากับจำนวนค่ามัดจำที่ได้รับชำระมา ภายใน 7 วัน ให้แก่ผู้เช่า โดยไม่โต้แย้งประการใดๆทั้งสิ้น",
            "ข้อ 16"
          ),
          clause(
            "ในวันทำสัญญานี้ ผู้เช่าได้ตรวจดูห้องพักอาศัยที่เช่าตลอดจนทรัพย์สินต่างๆ ในห้องพักดังกล่าวแล้ว เห็นว่ามีสภาพปกติทุกประการ และผู้ให้เช่าได้ส่งมอบห้องพักอาศัยและทรัพย์สินต่างๆ ในห้องพัก แก่ผู้เช่าแล้ว",
            "ข้อ 17"
          ),
          clause(
            "ผู้เช่ารับรองว่าจะไม่ให้ผู้อื่นเช่าช่วงไปอีกทอดหนึ่ง หรือจะไม่ยอมให้ผู้อื่นเข้าครอบครองห้องที่เช่าในระหว่างอายุสัญญาเช่า เว้นแต่ผู้เช่าจะได้รับความยินยอมจากผู้ให้เช่าเป็นลายลักษณ์อักษรเสียก่อน",
            "ข้อ 18"
          ),
          clause("ผู้เช่ายินดีจะปฏิบัติตามกฎระเบียบดังต่อไปนี้", "ข้อ 19"),
          clause("19.1 ไม่อนุญาตให้กระทำการใดๆที่ส่งเสียงดังรบกวน หรือก่อความไม่สงบแก่ผู้พักอาศัยห้องอื่นๆและในบริเวณอาคารชุด"),
          clause(
            `19.2 ไม่อนุญาตให้เล่นการพนัน เสพ จำหน่าย หรือครอบครองยาเสพติดทุกประเภท หรือสิ่งผิดกฎหมายในห้องพักอาศัยเลขที่ ${blank(
              contract.roomNumber
            )} หากพบเห็นการกระทำดังกล่าว ผู้เช่าต้องรับผิดชอบทุกประการ และให้ผู้เช่าย้ายออกทันทีโดยผู้ให้เช่าไม่ต้องคืนเงินประกันทั้งหมด`
          ),
          clause("19.3 ไม่อนุญาตให้นำสัตว์เลี้ยงเข้ามาในบริเวณอาคารชุด"),
          clause(
            "19.4 ไม่อนุญาตให้ดัดแปลง แก้ไข มิเตอร์น้ำ, ไฟฟ้า, ปลั๊กไฟ, สายเคเบิ้ล, สาย LAN, เครื่องปรับอากาศ, เฟอร์นิเจอร์รวมถึงทรัพย์สินอื่นๆในห้องชุดโดยเด็ดขาด หากพบความเสียหายดังกล่าวเกิดจากการะกระทำโดยผู้เช่า ผู้เช่าจะถูกปรับค่าความเสียหายตามมูลค่าที่กำหนดไว้ตามเอกสารแนบท้ายสัญญานี้"
          ),
          clause("19.5 ไม่อนุญาตให้ประกอบอาหารโดยใช้แก๊ส, เตาไฟ ภายในบริเวณห้องชุดโดยเด็ดขาด"),
          clause(
            "19.6 ไม่กระทำการใดๆอันเป็นสาเหตุให้เกิดเพลิงไหม้ เช่น ก่อไฟ, เก็บสารเคมี, หรือวัตถุไวไฟในบริเวณอาคารชุดโดยเด็ดขาด หากพบว่าเกิดความเสียหายขึ้นจากการกระทำโดยผู้เช่า ผู้เช่าจะต้องรับผิดชอบค่าเสียหายที่เกี่ยวข้องทั้งหมดโดยลำพัง"
          ),
          clause(
            "19.7 หากผู้เช่าละเมิดกฎ และ/หรือก่อให้เกิดความเดือดร้อน เสียหายอย่างแรงต่อผู้อื่น หรือต่อตัวอาคาร ให้ผู้เช่าย้ายออกจากห้องชุดทันที โดยผู้ให้เช่าไม่ต้องคืนเงินประกันทั้งหมด"
          ),
          clause(
            "ทั้งนี้ผู้เช่าสัญญาว่าจะปฏิบัติตามกฎระเบียบ ข้อบังคับของนิติบุคคลอาคารชุดโดยเคร่งครัด ในการใช้ห้องชุดและทรัพย์สินส่วนกลาง และการกระทำอย่างใดๆ จนเกิดความเสียหายขึ้นแล้ว ผู้เช่ายินยอมชดใช้ค่าเสียหายให้กับนิติบุคคลอาคารชุดโดยลำพังทุกประการ"
          ),
          clause(
            "ถ้าเกิดอัคคีภัยขึ้น สัญญานี้เป็นอันระงับสิ้นสุดลงทันที โดยผู้เช่าไม่มีสิทธิเรียกร้องค่าเสียหายจากผู้ให้เช่าไม่ว่ากรณีใดๆทั้งสิ้น",
            "ข้อ 20"
          ),
          clause(
            "สถานที่ติดต่อผู้เช่า ในระหว่างอายุสัญญาเช่า บรรดาหนังสือติดต่อ ทวงถาม บอกกล่าว หรือหนังสืออื่นใดที่ผู้ให้เช่าจะส่งให้แก่ผู้เช่านั้น ไม่ว่าจะส่งทางไปรษณีย์หรือให้คนนำไปส่งเอง ถ้าหากได้ส่งไปยังสถานที่เช่าแล้ว ให้ถือว่าได้ส่งให้แก่ผู้เช่าโดยชอบแล้ว",
            "ข้อ 21"
          ),
          clause(
            "สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความในสัญญานี้โดยตลอดแล้ว เห็นถูกต้อง จึงได้ลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยาน"
          ),

          // ID copy placeholder pages
          para("สำเนาบัตรประชาชนผู้ให้เช่า", { align: AlignmentType.CENTER, bold: true, spacingBefore: 1200 }),
          new Paragraph({ pageBreakBefore: true, alignment: AlignmentType.CENTER, spacing: { before: 1200 }, children: [new TextRun({ text: "สำเนาบัตรประชาชนผู้เช่า", bold: true })] }),

          // Receipt
          new Paragraph({
            pageBreakBefore: true,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "ใบเสร็จรับเงินมัดจำจอง/เงินประกัน", bold: true })],
          }),
          para(`วันที่ ${date(contract.receiptDate)}`, { align: AlignmentType.RIGHT }),
          para(
            `สัญญาเช่าฉบับนี้ ระหว่าง ${blank(contract.lessorName)} (รายละเอียดตามสำเนาบัตรประชาชน เอกสารแนบท้ายสัญญา) ซึ่งในสัญญานี้จะเรียกว่า "ผู้ให้เช่า" ฝ่ายหนึ่ง`
          ),
          para(
            `กับ ${blank(contract.lesseeName)} (รายละเอียดตามสำเนาบัตรประชาชน เอกสารแนบท้ายสัญญา) ซึ่งในสัญญานี้จะเรียกว่า "ผู้เช่า" อีกฝ่ายหนึ่ง`
          ),
          para(`ผู้เช่าชำระเงินทั้งหมดเป็นจำนวนเงิน ${money(totalReceipt)} บาท (${totalReceiptText}) ให้แก่ผู้ให้เช่าแล้ว โดยมีรายละเอียดดังต่อไปนี้`),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [headerCell("ลำดับ"), headerCell("รายการ"), headerCell("จำนวนเงิน (บาท)")] }),
              new TableRow({
                children: [
                  cell("1", { align: AlignmentType.CENTER }),
                  cell("เงินมัดจำจอง (ค่าเช่าล่วงหน้า 1 เดือน)"),
                  cell(money(contract.reservationDepositAmount), { align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [
                  cell("2", { align: AlignmentType.CENTER }),
                  cell("เงินประกันความเสียหาย (ค่าเช่า 2 เดือน)"),
                  cell(money(contract.damageDepositAmount), { align: AlignmentType.RIGHT }),
                ],
              }),
              new TableRow({
                children: [cell(`รวมเป็นเงิน ${money(totalReceipt)} บาท (${totalReceiptText})`, { align: AlignmentType.RIGHT, bold: true, colSpan: 2 }), cell("")],
              }),
            ],
          }),

          // Checklist
          new Paragraph({
            pageBreakBefore: true,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "เอกสารแนบท้ายสัญญา", bold: true })],
          }),
          para(`Check list รายการอุปกรณ์เครื่องใช้ไฟฟ้า และเฟอร์นิเจอร์ภายในห้อง เลขที่ ${blank(contract.roomNumber)} ณ วันส่งมอบ`, {
            align: AlignmentType.CENTER,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [headerCell("รายการ"), headerCell("พร้อมใช้งาน"), headerCell("มูลค่าต่อหน่วย"), headerCell("รายละเอียด")],
              }),
              ...checklistRows,
            ],
          }),

          // Single signature block for the whole document, at the very bottom.
          signatureBlock,
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
