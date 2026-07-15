export type Lang = "th" | "en";

interface Dictionary {
  nav: {
    home: string;
    properties: string;
    mortgageCalculator: string;
    booking: string;
    ownerPortal: string;
    forStaff: string;
    blog: string;
    wishlist: string;
  };
  footer: {
    tagline: string;
    menu: string;
    forStaffHeading: string;
    company: string;
    newsletterHeading: string;
    newsletterBody: string;
    newsletterPlaceholder: string;
    rightsReserved: string;
    terms: string;
    privacy: string;
  };
  search: {
    submit: string;
    buyOption: string;
    rentOption: string;
  };
  hero: {
    prev: string;
    next: string;
    slideLabel: string;
    slide1Heading: string;
    slide1Highlight: string;
    slide1Description: string;
    slide1Cta: string;
    slide2Heading: string;
    slide2Highlight: string;
    slide2Description: string;
    slide2Cta: string;
    slide3Heading: string;
    slide3Highlight: string;
    slide3Description: string;
    slide3Cta: string;
  };
  home: {
    focusHeadingBadge: string;
    focusHeading: string;
    focusDescription: string;
    buyTitle: string;
    buyDescription: string;
    rentTitle: string;
    rentDescription: string;
    sellTitle: string;
    sellDescription: string;
    featuredBadge: string;
    featuredHeading: string;
    featuredSubtitle: string;
    viewAll: string;
    statsPropertiesLabel: string;
    statsPropertiesValue: string;
    statsLocationsLabel: string;
    statsLocationsValue: string;
    statsTypesLabel: string;
    statsTypesValue: string;
    statsTimeLabel: string;
    statsTimeValue: string;
    aboutBadge: string;
    aboutHeadingLine1: string;
    aboutHeadingLine2: string;
    aboutParagraph: string;
    aboutChecklist1: string;
    aboutChecklist2: string;
    aboutChecklist3: string;
    aboutChecklist4: string;
    aboutQuote: string;
    aboutCta: string;
    bannerQuote: string;
    bannerAttribution: string;
    testimonialsBadge: string;
    testimonialsHeading: string;
    articlesBadge: string;
    articlesHeading: string;
    articlesEmpty: string;
    readMore: string;
    ctaHeading: string;
    ctaSubtitle: string;
    ctaButton: string;
  };
  properties: {
    title: string;
    searchLabel: string;
    searchPlaceholder: string;
    typeLabel: string;
    districtLabel: string;
    purposeLabel: string;
    priceRangeLabel: string;
    minPlaceholder: string;
    maxPlaceholder: string;
    resultsSummary: string;
    noResults: string;
    all: string;
  };
  propertyDetail: {
    breadcrumb: string;
    generalInfo: string;
    amenities: string;
    costs: string;
    transit: string;
    investorInfo: string;
    bookViewing: string;
    calculateMortgage: string;
    share: string;
    linkCopied: string;
    salesTeam: string;
    contactLine: string;
    relatedProperties: string;
    areaLabel: string;
    bedroomsBathroomsLabel: string;
    floorLabel: string;
    facingLabel: string;
    salePriceLabel: string;
    rentPriceLabel: string;
    rentPriceSuffix: string;
    orRent: string;
    commonFeeLabel: string;
    noData: string;
    avgRentLabel: string;
    transferFeeLabel: string;
    nearestStationLabel: string;
    distanceLabel: string;
    cashflowLabel: string;
    estateAgent: string;
    callButton: string;
  };
  booking: {
    viewTitle: string;
    viewSubtitle: string;
    viewCta: string;
    financingTitle: string;
    financingSubtitle: string;
    financingCta: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    propertyLabel: string;
    propertyUnset: string;
    dateLabel: string;
    timeLabel: string;
    timePlaceholder: string;
    noteLabel: string;
    pdpaText: string;
    errorPhone: string;
    errorDateTime: string;
    errorTimeRange: string;
    errorPdpa: string;
    errorGeneric: string;
    confirmHeading: string;
    confirmSubtitle: string;
    confirmName: string;
    confirmPhone: string;
    confirmEmail: string;
    confirmProperty: string;
    confirmDateTime: string;
    confirmNote: string;
    editButton: string;
    confirmButton: string;
    sending: string;
    successHeading: string;
    successBody: string;
    addToCalendar: string;
  };
  mortgage: {
    heading: string;
    subtitle: string;
    priceLabel: string;
    downPaymentLabel: string;
    interestRateLabel: string;
    loanTermLabel: string;
    yearsSuffix: string;
    incomeLabel: string;
    incomePlaceholder: string;
    bankCustom: string;
    monthlyPaymentLabel: string;
    loanAmountLabel: string;
    totalInterestLabel: string;
    downPaymentResultLabel: string;
    totalPaidLabel: string;
    dtiTitle: string;
    dtiDanger: string;
    dtiWarning: string;
    dtiOk: string;
    ctaButton: string;
    disclaimer: string;
  };
  blog: {
    listTitle: string;
    listSubtitle: string;
    empty: string;
    readMore: string;
    relatedHeading: string;
    breadcrumb: string;
  };
  wishlist: {
    heading: string;
    description: string;
    empty: string;
    browseCta: string;
  };
  units: {
    bedroomsSuffix: string;
    bathroomsSuffix: string;
    sqmSuffix: string;
    meterSuffix: string;
    perMonth: string;
  };
}

export const dictionaries: Record<Lang, Dictionary> = {
  th: {
    nav: {
      home: "หน้าแรก",
      properties: "ทรัพย์ทั้งหมด",
      mortgageCalculator: "คำนวณสินเชื่อ",
      booking: "นัดชมทรัพย์",
      ownerPortal: "Owner Portal",
      forStaff: "สำหรับทีมงาน",
      blog: "บทความ",
      wishlist: "รายการที่ถูกใจ",
    },
    footer: {
      tagline: "แพลตฟอร์มอสังหาริมทรัพย์ครบวงจร คัดสรรคอนโด บ้าน ทาวน์โฮม และที่ดินคุณภาพทั่วกรุงเทพฯ และปริมณฑล",
      menu: "เมนู",
      forStaffHeading: "สำหรับทีมงาน",
      company: "บริษัท",
      newsletterHeading: "รับข่าวสารทรัพย์ใหม่",
      newsletterBody: "สมัครรับข้อมูลทรัพย์และโปรโมชันใหม่ๆ ทางอีเมล",
      newsletterPlaceholder: "อีเมลของคุณ",
      rightsReserved: "สงวนลิขสิทธิ์",
      terms: "เงื่อนไขการใช้บริการ",
      privacy: "นโยบายความเป็นส่วนตัว",
    },
    search: {
      submit: "ค้นหาทรัพย์",
      buyOption: "ซื้อ",
      rentOption: "เช่า",
    },
    hero: {
      prev: "ก่อนหน้า",
      next: "ถัดไป",
      slideLabel: "สไลด์ที่",
      slide1Heading: "ค้นหาบ้านในฝัน",
      slide1Highlight: "ที่ใช่สำหรับคุณ",
      slide1Description:
        "รวมทรัพย์คัดสรรกว่า 300–500 รายการทั่วกรุงเทพฯ พร้อมระบบนัดชม จองมัดจำออนไลน์ และคำนวณสินเชื่อ ครบในที่เดียว",
      slide1Cta: "ค้นหาทรัพย์ทันที",
      slide2Heading: "ลงทุนอสังหาฯ อย่างมั่นใจ",
      slide2Highlight: "ด้วยข้อมูลที่ครบ",
      slide2Description: "ดู ROI, Rental Yield และ Cashflow ของทุกทรัพย์ตั้งแต่หน้ารายละเอียด ไม่ต้องคำนวณเอง",
      slide2Cta: "ดูทรัพย์เพื่อการลงทุน",
      slide3Heading: "ฝากขายหรือปล่อยเช่า",
      slide3Highlight: "ให้เราดูแลคุณ",
      slide3Description: "ติดตามยอดเข้าชม รายได้ค่าเช่า และสถานะทรัพย์แบบเรียลไทม์ผ่าน Owner Portal",
      slide3Cta: "เข้าสู่ Owner Portal",
    },
    home: {
      focusHeadingBadge: "บริการของเรา",
      focusHeading: "โฟกัสหลักของ Paramee",
      focusDescription: "เลือกทรัพย์ หาทำเลที่ตรงใจคุณมากที่สุด",
      buyTitle: "ซื้อบ้าน/คอนโด",
      buyDescription: "ค้นหาบ้าน คอนโด และที่ดินกว่า 300–500 รายการ พร้อมข้อมูลเปรียบเทียบราคาตลาด",
      rentTitle: "เช่าบ้าน/เช่าคอนโด",
      rentDescription: "เลือกทรัพย์ให้เช่าทำเลดี พร้อมคำนวณค่าเช่าเฉลี่ยในพื้นที่ก่อนตัดสินใจ",
      sellTitle: "ฝากขาย / ลงทุน",
      sellDescription: "ให้ทีม Paramee ช่วยวิเคราะห์ราคาแนะนำ Rental Yield และดูแลทรัพย์ของคุณผ่าน Owner Portal",
      featuredBadge: "ทรัพย์",
      featuredHeading: "ทรัพย์แนะนำ",
      featuredSubtitle: "คัดสรรทำเลดี ราคาคุ้มค่า พร้อมข้อมูลนักลงทุนครบถ้วน",
      viewAll: "ดูทรัพย์ทั้งหมด →",
      statsPropertiesLabel: "ทรัพย์ในระบบ",
      statsPropertiesValue: "300–500+",
      statsLocationsLabel: "ทำเลทั่วกรุงเทพฯ",
      statsLocationsValue: "20+",
      statsTypesLabel: "ประเภททรัพย์",
      statsTypesValue: "4",
      statsTimeLabel: "เวลาเฉลี่ยยืนยันนัด",
      statsTimeValue: "< 24 ชม.",
      aboutBadge: "เกี่ยวกับเรา",
      aboutHeadingLine1: "แพลตฟอร์มอสังหาริมทรัพย์ครบวงจร",
      aboutHeadingLine2: "ที่ดูแลคุณจนถึงวันโอนกรรมสิทธิ์",
      aboutParagraph:
        "Paramee รวบรวมทรัพย์คุณภาพหลากหลายทำเลทั่วกรุงเทพฯ และปริมณฑล พร้อมระบบนัดชม จองมัดจำ คำนวณสินเชื่อ และข้อมูลนักลงทุนครบถ้วน เพื่อให้ทุกการตัดสินใจง่ายและมั่นใจขึ้น",
      aboutChecklist1: "ทำเลคัดสรร",
      aboutChecklist2: "ข้อมูลโปร่งใส",
      aboutChecklist3: "นัดชมออนไลน์",
      aboutChecklist4: "ปลอดภัยทุกขั้นตอน",
      aboutQuote:
        "“เราเชื่อว่าการหาบ้านที่ใช่ ควรเป็นเรื่องง่ายและโปร่งใส ทุกตัวเลขต้องตรวจสอบได้ ทุกนัดหมายต้องได้รับการดูแล”",
      aboutCta: "บริการของเรา",
      bannerQuote: "“เริ่มต้นจากความจริงใจ Built on Trust”",
      bannerAttribution: "— Paramee Asset",
      testimonialsBadge: "เสียงจากลูกค้า",
      testimonialsHeading: "ลูกค้าพูดถึงเราอย่างไร",
      articlesBadge: "บทความน่ารู้",
      articlesHeading: "เกร็ดความรู้เรื่องอสังหาริมทรัพย์",
      articlesEmpty: "ยังไม่มีบทความในขณะนี้",
      readMore: "อ่านต่อ",
      ctaHeading: "กำลังมองหาบ้านในฝันอยู่ใช่ไหม?",
      ctaSubtitle: "ให้ทีม Paramee ช่วยคุณค้นหาทรัพย์ที่ใช่ วันนี้",
      ctaButton: "ค้นหาทรัพย์ →",
    },
    properties: {
      title: "ทรัพย์ทั้งหมด",
      searchLabel: "ค้นหาชื่อโครงการ",
      searchPlaceholder: "ชื่อโครงการ...",
      typeLabel: "ประเภททรัพย์",
      districtLabel: "ทำเล",
      purposeLabel: "วัตถุประสงค์",
      priceRangeLabel: "ช่วงราคา (บาท)",
      minPlaceholder: "ต่ำสุด",
      maxPlaceholder: "สูงสุด",
      resultsSummary: "พบ {count} รายการ จากทั้งหมด {total} รายการตัวอย่าง (ระบบเต็มรองรับ 300–500 รายการ)",
      noResults: "ไม่พบทรัพย์ที่ตรงกับเงื่อนไข ลองปรับตัวกรองใหม่",
      all: "ทั้งหมด",
    },
    propertyDetail: {
      breadcrumb: "ทรัพย์ทั้งหมด",
      generalInfo: "ข้อมูลทั่วไป",
      amenities: "สิ่งอำนวยความสะดวก",
      costs: "ค่าใช้จ่าย",
      transit: "ระบบขนส่งและทำเล",
      investorInfo: "ข้อมูลสำหรับนักลงทุน",
      bookViewing: "นัดชมทรัพย์นี้",
      calculateMortgage: "คำนวณสินเชื่อสำหรับทรัพย์นี้",
      share: "แชร์ทรัพย์นี้",
      linkCopied: "คัดลอกลิงก์แล้ว",
      salesTeam: "ทีมขาย Paramee",
      contactLine: "ติดต่อผ่าน LINE OA",
      relatedProperties: "ทรัพย์ใกล้เคียง",
      areaLabel: "ขนาดพื้นที่",
      bedroomsBathroomsLabel: "ห้องนอน / ห้องน้ำ",
      floorLabel: "ชั้น",
      facingLabel: "ทิศ",
      salePriceLabel: "ราคาขาย",
      rentPriceLabel: "ราคาเช่า",
      rentPriceSuffix: "/เดือน",
      orRent: "หรือเช่า",
      commonFeeLabel: "ค่าส่วนกลาง",
      noData: "ไม่มีข้อมูล",
      avgRentLabel: "ค่าเช่าเฉลี่ยในพื้นที่",
      transferFeeLabel: "ค่าโอนกรรมสิทธิ์ (ประมาณการ)",
      nearestStationLabel: "สถานีใกล้ที่สุด",
      distanceLabel: "ระยะทาง",
      cashflowLabel: "Cashflow ต่อเดือน",
      estateAgent: "Estate Agent",
      callButton: "โทร",
    },
    booking: {
      viewTitle: "นัดเข้าชมโครงการ / ห้อง",
      viewSubtitle: "เลือกวัน เวลา และทรัพย์ที่สนใจ ทีมงานจะยืนยันการนัดหมายผ่านอีเมล (เวลาทำการ 09:00-17:00 น.)",
      viewCta: "ยืนยันการนัดชม",
      financingTitle: "ขอสินเชื่อ / นัดพบเจ้าหน้าที่การเงิน",
      financingSubtitle: "ทีมงานจะติดต่อกลับพร้อมข้อเสนอสินเชื่อที่เหมาะกับคุณ",
      financingCta: "ส่งคำขอสินเชื่อ",
      nameLabel: "ชื่อ-นามสกุล หรือ ชื่อเล่น",
      phoneLabel: "เบอร์โทร (10 หลัก)",
      emailLabel: "อีเมล",
      propertyLabel: "ทรัพย์ที่สนใจ",
      propertyUnset: "— ยังไม่ระบุ —",
      dateLabel: "วันที่นัด",
      timeLabel: "เวลานัด (09:00-17:00 น.)",
      timePlaceholder: "— เลือกเวลา —",
      noteLabel: "หมายเหตุเพิ่มเติม",
      pdpaText:
        "ข้าพเจ้ายินยอมให้ Paramee Asset เก็บรวบรวม ใช้ และติดต่อกลับตามข้อมูลที่ให้ไว้ เพื่อวัตถุประสงค์ในการนัดหมายและให้บริการ ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
      errorPhone: "กรุณากรอกเบอร์โทร 10 หลักให้ครบถ้วน",
      errorDateTime: "กรุณาเลือกวันและเวลานัด",
      errorTimeRange: "เวลานัดต้องอยู่ระหว่าง 09:00-17:00 น.",
      errorPdpa: "กรุณายินยอมให้เก็บและติดต่อข้อมูลตามนโยบาย PDPA",
      errorGeneric: "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      confirmHeading: "ยืนยันข้อมูลการนัด",
      confirmSubtitle: "กรุณาตรวจสอบข้อมูลก่อนยืนยัน",
      confirmName: "ชื่อ",
      confirmPhone: "เบอร์โทร",
      confirmEmail: "อีเมล",
      confirmProperty: "ทรัพย์ที่สนใจ",
      confirmDateTime: "วันเวลานัด",
      confirmNote: "หมายเหตุ",
      editButton: "แก้ไขข้อมูล",
      confirmButton: "ยืนยันการนัด",
      sending: "กำลังส่ง...",
      successHeading: "ส่งคำขอเรียบร้อยแล้ว",
      successBody: "ทีมงาน Paramee Asset ได้รับข้อมูลของคุณแล้ว และได้ส่งอีเมลยืนยันไปที่",
      addToCalendar: "เพิ่มนัดหมายลง Google Calendar",
    },
    mortgage: {
      heading: "คำนวณสินเชื่อ",
      subtitle: "ประเมินยอดผ่อนต่อเดือน ดอกเบี้ยรวม และยอดกู้สุทธิ ก่อนตัดสินใจซื้อ",
      priceLabel: "ราคาทรัพย์ (บาท)",
      downPaymentLabel: "เงินดาวน์",
      interestRateLabel: "อัตราดอกเบี้ย (%ต่อปี)",
      loanTermLabel: "ระยะเวลาผ่อน",
      yearsSuffix: "ปี",
      incomeLabel: "รายได้ต่อเดือนของผู้กู้ (บาท)",
      incomePlaceholder: "กรอกรายได้เพื่อประเมินภาระผ่อนต่อรายได้ (DSR)",
      bankCustom: "กำหนดเอง",
      monthlyPaymentLabel: "ยอดผ่อนต่อเดือน (โดยประมาณ)",
      loanAmountLabel: "ยอดกู้สุทธิ",
      totalInterestLabel: "ดอกเบี้ยรวมตลอดสัญญา",
      downPaymentResultLabel: "เงินดาวน์",
      totalPaidLabel: "ยอดชำระรวมทั้งหมด",
      dtiTitle: "ยอดผ่อนคิดเป็น",
      dtiDanger:
        "เกิน 70% ของรายได้ — ธนาคารส่วนใหญ่มีเกณฑ์อนุมัติสินเชื่อต่ำมากในระดับนี้ ควรลดวงเงินกู้หรือเพิ่มเงินดาวน์",
      dtiWarning:
        "อยู่ในช่วง 40–70% ของรายได้ ธนาคารบางแห่งอาจมีเกณฑ์อนุมัติค่อนข้างต่ำ แนะนำให้ปรึกษาเจ้าหน้าที่สินเชื่อก่อนตัดสินใจ",
      dtiOk: "อยู่ในเกณฑ์ปกติที่ธนาคารทั่วไปยอมรับ",
      ctaButton: "ขอสินเชื่อ / นัดพบเจ้าหน้าที่",
      disclaimer: "ผลลัพธ์เป็นการประมาณการเบื้องต้นเท่านั้น อัตราจริงขึ้นอยู่กับการพิจารณาของธนาคาร",
    },
    blog: {
      listTitle: "บทความน่ารู้",
      listSubtitle: "เกร็ดความรู้เรื่องอสังหาริมทรัพย์ การลงทุน และสินเชื่อ",
      empty: "ยังไม่มีบทความในขณะนี้",
      readMore: "อ่านต่อ",
      relatedHeading: "บทความอื่นๆ",
      breadcrumb: "บทความน่ารู้",
    },
    wishlist: {
      heading: "รายการที่ถูกใจ",
      description: "ทรัพย์ที่คุณกดบันทึกไว้ (ไอคอนรูปหัวใจบนการ์ดทรัพย์) จะแสดงที่นี่ — บันทึกไว้ในเบราว์เซอร์นี้",
      empty: "คุณยังไม่ได้บันทึกทรัพย์ใดไว้",
      browseCta: "ไปดูทรัพย์ทั้งหมด →",
    },
    units: {
      bedroomsSuffix: "นอน",
      bathroomsSuffix: "น้ำ",
      sqmSuffix: "ตร.ม.",
      meterSuffix: "ม.",
      perMonth: "/เดือน",
    },
  },
  en: {
    nav: {
      home: "Home",
      properties: "All Properties",
      mortgageCalculator: "Mortgage Calculator",
      booking: "Book a Viewing",
      ownerPortal: "Owner Portal",
      forStaff: "Staff Login",
      blog: "Blog",
      wishlist: "Wishlist",
    },
    footer: {
      tagline: "A full-service real estate platform curating quality condos, houses, townhomes and land across Bangkok and its suburbs.",
      menu: "Menu",
      forStaffHeading: "For Staff",
      company: "Company",
      newsletterHeading: "New Listings Newsletter",
      newsletterBody: "Subscribe by email to get new listings and promotions.",
      newsletterPlaceholder: "Your email",
      rightsReserved: "All rights reserved.",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
    },
    search: {
      submit: "Search Properties",
      buyOption: "Buy",
      rentOption: "Rent",
    },
    hero: {
      prev: "Previous",
      next: "Next",
      slideLabel: "Slide",
      slide1Heading: "Find the dream home",
      slide1Highlight: "that's right for you",
      slide1Description:
        "300–500+ curated listings across Bangkok, with online viewing bookings, deposit reservations, and mortgage calculations all in one place.",
      slide1Cta: "Search Properties Now",
      slide2Heading: "Invest in real estate",
      slide2Highlight: "with confidence",
      slide2Description: "See ROI, Rental Yield and Cashflow for every property right on the detail page — no manual math needed.",
      slide2Cta: "View Investment Properties",
      slide3Heading: "List for sale or rent",
      slide3Highlight: "and let us handle it",
      slide3Description: "Track views, rental income, and property status in real time through the Owner Portal.",
      slide3Cta: "Go to Owner Portal",
    },
    home: {
      focusHeadingBadge: "Our Services",
      focusHeading: "Paramee's Main Focus",
      focusDescription: "Find the property and location that suits you best.",
      buyTitle: "Buy a House/Condo",
      buyDescription: "Browse 300–500+ houses, condos and land listings with market price comparisons.",
      rentTitle: "Rent a House/Condo",
      rentDescription: "Find a great-location rental and compare average rents in the area before deciding.",
      sellTitle: "List for Sale / Invest",
      sellDescription: "Let the Paramee team analyze pricing, rental yield, and manage your property via the Owner Portal.",
      featuredBadge: "Listings",
      featuredHeading: "Featured Properties",
      featuredSubtitle: "Great locations, good value, with full investor data.",
      viewAll: "View all properties →",
      statsPropertiesLabel: "Properties listed",
      statsPropertiesValue: "300–500+",
      statsLocationsLabel: "Locations across Bangkok",
      statsLocationsValue: "20+",
      statsTypesLabel: "Property types",
      statsTypesValue: "4",
      statsTimeLabel: "Average booking confirmation",
      statsTimeValue: "< 24 hrs",
      aboutBadge: "About Us",
      aboutHeadingLine1: "A full-service real estate platform",
      aboutHeadingLine2: "that supports you through to title transfer.",
      aboutParagraph:
        "Paramee brings together quality properties across Bangkok and its suburbs, with viewing bookings, deposit reservations, mortgage calculations, and complete investor data — making every decision easier and more confident.",
      aboutChecklist1: "Curated locations",
      aboutChecklist2: "Transparent data",
      aboutChecklist3: "Online booking",
      aboutChecklist4: "Secure at every step",
      aboutQuote:
        "“We believe finding the right home should be easy and transparent. Every number should be verifiable, every appointment should be taken care of.”",
      aboutCta: "Our Services",
      bannerQuote: "“Built on Trust”",
      bannerAttribution: "— Paramee Asset",
      testimonialsBadge: "Testimonials",
      testimonialsHeading: "What Our Customers Say",
      articlesBadge: "Articles",
      articlesHeading: "Real Estate Insights",
      articlesEmpty: "No articles yet.",
      readMore: "Read more",
      ctaHeading: "Looking for your dream home?",
      ctaSubtitle: "Let the Paramee team help you find the right property today.",
      ctaButton: "Search Properties →",
    },
    properties: {
      title: "All Properties",
      searchLabel: "Search by project name",
      searchPlaceholder: "Project name...",
      typeLabel: "Property Type",
      districtLabel: "Location",
      purposeLabel: "Purpose",
      priceRangeLabel: "Price range (THB)",
      minPlaceholder: "Min",
      maxPlaceholder: "Max",
      resultsSummary: "Found {count} of {total} sample properties (the full system supports 300–500 listings)",
      noResults: "No properties match your filters. Try adjusting them.",
      all: "All",
    },
    propertyDetail: {
      breadcrumb: "All Properties",
      generalInfo: "General Information",
      amenities: "Amenities",
      costs: "Costs",
      transit: "Transit & Location",
      investorInfo: "Investor Information",
      bookViewing: "Book a Viewing",
      calculateMortgage: "Calculate Mortgage for This Property",
      share: "Share this property",
      linkCopied: "Link copied",
      salesTeam: "Paramee Sales Team",
      contactLine: "Contact via LINE OA",
      relatedProperties: "Related Properties",
      areaLabel: "Floor Area",
      bedroomsBathroomsLabel: "Bedrooms / Bathrooms",
      floorLabel: "Floor",
      facingLabel: "Facing",
      salePriceLabel: "Sale Price",
      rentPriceLabel: "Rent Price",
      rentPriceSuffix: "/month",
      orRent: "or rent",
      commonFeeLabel: "Common Fee",
      noData: "No data",
      avgRentLabel: "Average Rent in Area",
      transferFeeLabel: "Estimated Transfer Fee",
      nearestStationLabel: "Nearest Station",
      distanceLabel: "Distance",
      cashflowLabel: "Cashflow / month",
      estateAgent: "Estate Agent",
      callButton: "Call",
    },
    booking: {
      viewTitle: "Book a Property Viewing",
      viewSubtitle: "Choose a date, time, and the property you're interested in. Our team will confirm by email (business hours 09:00-17:00).",
      viewCta: "Confirm Viewing",
      financingTitle: "Request Financing / Meet a Loan Officer",
      financingSubtitle: "Our team will get back to you with a financing offer that suits you.",
      financingCta: "Submit Financing Request",
      nameLabel: "Full Name or Nickname",
      phoneLabel: "Phone Number (10 digits)",
      emailLabel: "Email",
      propertyLabel: "Property of Interest",
      propertyUnset: "— Not specified —",
      dateLabel: "Appointment Date",
      timeLabel: "Appointment Time (09:00-17:00)",
      timePlaceholder: "— Select a time —",
      noteLabel: "Additional Notes",
      pdpaText:
        "I consent to Paramee Asset collecting, using, and contacting me based on the information provided, for the purpose of scheduling and providing service, in accordance with the Personal Data Protection Act (PDPA).",
      errorPhone: "Please enter a complete 10-digit phone number",
      errorDateTime: "Please select an appointment date and time",
      errorTimeRange: "Appointment time must be between 09:00-17:00",
      errorPdpa: "Please consent to the PDPA data collection policy",
      errorGeneric: "Unable to submit. Please try again.",
      confirmHeading: "Confirm Your Appointment",
      confirmSubtitle: "Please review your details before confirming",
      confirmName: "Name",
      confirmPhone: "Phone",
      confirmEmail: "Email",
      confirmProperty: "Property of Interest",
      confirmDateTime: "Date & Time",
      confirmNote: "Note",
      editButton: "Edit",
      confirmButton: "Confirm Appointment",
      sending: "Sending...",
      successHeading: "Request Submitted",
      successBody: "The Paramee Asset team has received your information and sent a confirmation email to",
      addToCalendar: "Add to Google Calendar",
    },
    mortgage: {
      heading: "Mortgage Calculator",
      subtitle: "Estimate your monthly payment, total interest, and net loan amount before you decide.",
      priceLabel: "Property Price (THB)",
      downPaymentLabel: "Down Payment",
      interestRateLabel: "Interest Rate (% per year)",
      loanTermLabel: "Loan Term",
      yearsSuffix: "years",
      incomeLabel: "Borrower's Monthly Income (THB)",
      incomePlaceholder: "Enter income to estimate debt-service ratio (DSR)",
      bankCustom: "Custom",
      monthlyPaymentLabel: "Estimated Monthly Payment",
      loanAmountLabel: "Net Loan Amount",
      totalInterestLabel: "Total Interest Over the Term",
      downPaymentResultLabel: "Down Payment",
      totalPaidLabel: "Total Amount Paid",
      dtiTitle: "Payment is",
      dtiDanger:
        "Over 70% of income — most banks have very low approval odds at this level. Consider reducing the loan amount or increasing the down payment.",
      dtiWarning:
        "In the 40–70% range. Some banks may have stricter approval criteria. We recommend consulting a loan officer before deciding.",
      dtiOk: "Within the normal range accepted by most banks.",
      ctaButton: "Request Financing / Meet a Loan Officer",
      disclaimer: "These results are preliminary estimates only. Actual rates depend on the bank's assessment.",
    },
    blog: {
      listTitle: "Articles",
      listSubtitle: "Real estate, investment, and mortgage insights",
      empty: "No articles yet.",
      readMore: "Read more",
      relatedHeading: "More Articles",
      breadcrumb: "Articles",
    },
    wishlist: {
      heading: "Wishlist",
      description: "Properties you've saved (using the heart icon on property cards) will show up here — saved in this browser.",
      empty: "You haven't saved any properties yet.",
      browseCta: "Browse all properties →",
    },
    units: {
      bedroomsSuffix: "bed",
      bathroomsSuffix: "bath",
      sqmSuffix: "sqm",
      meterSuffix: "m",
      perMonth: "/month",
    },
  },
};
