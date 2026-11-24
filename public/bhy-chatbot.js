/* BHY Hospital website assistant — self-contained, no server, no API key, free.
   Add to any page:  <script src="/bhy-chatbot.js" defer></script>            */
(function () {
  if (window.__bhyChat) return; window.__bhyChat = 1;
  var C = {
    uan: '021-111-111-249', ph: '021-35822770', wa: '0349-5053717', waLink: 'https://wa.me/923495053717',
    map: 'https://maps.app.goo.gl/uAQ4F1ASqfLoyGXW7', web: 'https://bhyhospital.vercel.app',
    fb: 'https://www.facebook.com/bhyhospitalpk/', ig: 'https://www.instagram.com/bhyhospitalpk',
    addr: 'Delhi Colony, Block 8, off Khaliq-uz-Zaman Road, Block 8 Clifton, Karachi 75600',
    addrUr: 'دہلی کالونی، بلاک 8، خلیق الزماں روڈ سے ہٹ کر، بلاک 8 کلفٹن، کراچی 75600'
  };
  var LOGO = 'data:image/png;base64,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';
  var f = function (s) { return s.replace(/\{(\w+)\}/g, function (_, k) { return C[k]; }); };

  /* ---------- Answers (en / ru = Roman Urdu / ur = Urdu) ---------- */
  var A = {
    welcome: {
      en: "Assalam-o-Alaikum! I'm the BHY Hospital information assistant (not a doctor). I can help with contact details, location, OPD hours and departments. Pick an option or type your question.",
      ru: "Assalam-o-Alaikum! Main BHY Hospital ka information assistant hun (doctor nahi). Main rabta, location, OPD timing aur departments ke baare mein bata sakta hun. Neeche se option chunein ya apna sawal likhein.",
      ur: "السلام علیکم! میں بی ایچ وائی ہسپتال کا انفارمیشن اسسٹنٹ ہوں (ڈاکٹر نہیں)۔ میں رابطہ، مقام، او پی ڈی اوقات اور شعبوں کے بارے میں مدد کر سکتا ہوں۔ نیچے سے آپشن چنیں یا اپنا سوال لکھیں۔"
    },
    contact: {
      en: "Contact BHY Hospital:\nUAN: {uan}\nPhone: {ph}\nWhatsApp: {wa}\nAddress: {addr}\nMap: {map}\nWebsite: {web}\nFacebook: {fb}\nInstagram: {ig}",
      ru: "BHY Hospital se rabta:\nUAN: {uan}\nPhone: {ph}\nWhatsApp: {wa}\nAddress: {addr}\nMap: {map}\nWebsite: {web}\nFacebook: {fb}\nInstagram: {ig}",
      ur: "بی ایچ وائی ہسپتال سے رابطہ:\nUAN: {uan}\nفون: {ph}\nواٹس ایپ: {wa}\nپتہ: {addrUr}\nنقشہ: {map}\nویب سائٹ: {web}\nفیس بک: {fb}\nانسٹاگرام: {ig}"
    },
    location: {
      en: "BHY Hospital address:\n{addr}\nMap / directions: {map}",
      ru: "BHY Hospital ka pata:\n{addr}\nMap / directions: {map}",
      ur: "ہسپتال کا پتہ:\n{addrUr}\nنقشہ: {map}"
    },
    web: {
      en: "Website: {web}\nFacebook: {fb}\nInstagram: {ig}",
      ru: "Website: {web}\nFacebook: {fb}\nInstagram: {ig}",
      ur: "ہسپتال کی ویب سائٹ: {web}\nفیس بک: {fb}\nانسٹاگرام: {ig}"
    },
    whatsapp: {
      en: "Message the hospital on WhatsApp: {wa}\n{waLink}",
      ru: "Hospital ko WhatsApp par message karein: {wa}\n{waLink}",
      ur: "ہسپتال کو واٹس ایپ پر پیغام بھیجیں: {wa}\n{waLink}"
    },
    opd: {
      en: "General OPD: Monday to Sunday, 8:00 AM to 10:00 PM.\nIndividual doctors may have different clinic days and timings, so please confirm on UAN {uan} before visiting.",
      ru: "General OPD: Monday se Sunday, subah 8:00 baje se raat 10:00 baje tak.\nHar doctor ke clinic ke din aur timing mukhtalif ho sakte hain, is liye aane se pehle UAN {uan} par confirm kar lein.",
      ur: "جنرل او پی ڈی: پیر تا اتوار، صبح 8:00 تا رات 10:00 بجے۔\nہر ڈاکٹر کے کلینک کے دن اور اوقات مختلف ہو سکتے ہیں، آنے سے پہلے UAN {uan} پر تصدیق کر لیں۔"
    },
    doctor: {
      en: "I don't have a live doctor roster, so I can't confirm which doctors are in today. Each consultant has their own clinic days and timings. Please call UAN {uan} before visiting, or check the Doctors directory: {web}",
      ru: "Mere paas doctors ki live list nahi, is liye main confirm nahi kar sakta ke aaj kaun se doctors maujood hain. Har consultant ke clinic ke din aur timing alag hote hain. Aane se pehle UAN {uan} par call karein ya Doctors directory dekhein: {web}",
      ur: "میرے پاس ڈاکٹروں کی لائیو فہرست نہیں، اس لیے میں تصدیق نہیں کر سکتا کہ آج کون سے ڈاکٹر موجود ہیں۔ ہر کنسلٹنٹ کے کلینک کے دن اور اوقات الگ ہوتے ہیں۔ آنے سے پہلے UAN {uan} پر کال کریں یا ڈاکٹرز ڈائریکٹری دیکھیں: {web}"
    },
    appt: {
      en: "I provide information only and can't book appointments or confirm availability. To book or change an appointment, call UAN {uan} or message WhatsApp {wa}.\n{waLink}",
      ru: "Main sirf maloomat deta hun, appointment book nahi kar sakta. Appointment ke liye UAN {uan} par call karein ya WhatsApp {wa} par rabta karein.\n{waLink}",
      ur: "میں صرف معلومات فراہم کرتا ہوں، اپائنٹمنٹ بک نہیں کر سکتا۔ اپائنٹمنٹ کے لیے UAN {uan} پر کال کریں یا واٹس ایپ {wa} پر رابطہ کریں۔\n{waLink}"
    },
    fee: {
      en: "Doctor fees aren't listed with me and may vary. Please contact the hospital on UAN {uan} for the latest fee.",
      ru: "Doctor ki fees mere paas maujood nahi aur mukhtalif ho sakti hain. Taza fee ke liye UAN {uan} par rabta karein.",
      ur: "ڈاکٹر کی فیس میرے پاس موجود نہیں اور مختلف ہو سکتی ہے۔ تازہ فیس کے لیے UAN {uan} پر رابطہ کریں۔"
    },
    dept: {
      en: "Departments listed on the hospital website:\n• General / Family Physician\n• Gynaecology & Obstetrics\n• Chest Specialist\n• Cardiology\n• Diabetology / Endocrinology\n• General Surgery\n• Orthopaedics\n• Nephrology\n• Neurology & Neurosurgery\n• Ophthalmology\n• Paediatrics\n• Psychiatry & Clinical Psychology\n• Urology\n• Nutrition / Dietitian\n• Vascular Surgery\n• Paediatric Plastic Surgery\nA clinic may not run every day. Please confirm the doctor's timing on UAN {uan}.",
      ru: "Hospital website par ye departments listed hain:\n• General / Family Physician\n• Gynaecology & Obstetrics\n• Chest Specialist\n• Cardiology\n• Diabetology / Endocrinology\n• General Surgery\n• Orthopaedics\n• Nephrology\n• Neurology & Neurosurgery\n• Ophthalmology\n• Paediatrics\n• Psychiatry & Clinical Psychology\n• Urology\n• Nutrition / Dietitian\n• Vascular Surgery\n• Paediatric Plastic Surgery\nClinic har roz hona zaroori nahi. Doctor ki timing UAN {uan} par confirm kar lein.",
      ur: "ہسپتال کی ویب سائٹ پر یہ شعبے درج ہیں:\n• جنرل / فیملی فزیشن\n• گائنی اور زچگی\n• چیسٹ اسپیشلسٹ\n• کارڈیالوجی\n• ذیابیطس / اینڈوکرائنالوجی\n• جنرل سرجری\n• آرتھوپیڈکس\n• نیفرالوجی\n• نیورولوجی اور نیوروسرجری\n• آنکھوں کا شعبہ\n• بچوں کا شعبہ\n• نفسیات اور کلینیکل سائیکالوجی\n• یورولوجی\n• ڈائٹیشن\n• ویسکولر سرجری\n• بچوں کی پلاسٹک سرجری\nکلینک ہر روز ہونا ضروری نہیں، ڈاکٹر کے اوقات UAN {uan} پر پوچھ لیں۔"
    },
    services: {
      en: "Services listed by the hospital:\n• CT Scan\n• X-Ray / Radiology\n• Ultrasound\n• Mammography\n• Echocardiography\n• Physiotherapy\n• Paediatric vaccination\n• Emergency and inpatient services\nTest availability and prices can change. Please confirm on UAN {uan}.",
      ru: "Hospital ki listed services:\n• CT Scan\n• X-Ray / Radiology\n• Ultrasound\n• Mammography\n• Echocardiography\n• Physiotherapy\n• Bachon ki vaccination\n• Emergency aur inpatient services\nTest ki availability aur prices badal sakti hain. UAN {uan} par confirm karein.",
      ur: "ہسپتال کی درج شدہ سہولیات:\n• سی ٹی اسکین\n• ایکس رے / ریڈیالوجی\n• الٹراساؤنڈ\n• میموگرافی\n• ایکوکارڈیوگرافی\n• فزیوتھراپی\n• بچوں کی ویکسینیشن\n• ایمرجنسی اور ان پیشنٹ سہولیات\nٹیسٹ کی دستیابی اور قیمتیں بدل سکتی ہیں، UAN {uan} پر تصدیق کریں۔"
    },
    vaccine: {
      en: "According to hospital information, birth-dose vaccination is available 24 hours a day, 7 days a week. For stock or current arrangements, please confirm on UAN {uan} before visiting.",
      ru: "Hospital ki maloomat ke mutabiq birth-dose vaccination 24 ghante, hafte ke saaton din available hai. Stock ya mojooda intezam ke liye aane se pehle UAN {uan} par confirm karein.",
      ur: "ہسپتال کی معلومات کے مطابق پیدائش کے وقت کی (برتھ ڈوز) ویکسینیشن 24 گھنٹے، ہفتے کے ساتوں دن دستیاب ہے۔ ویکسین اسٹاک وغیرہ کے لیے آنے سے پہلے UAN {uan} پر تصدیق کریں۔"
    },
    emergency: {
      en: "This may be an emergency. Please go to the nearest hospital emergency department or call your local emergency service right now. I can't assess symptoms in chat.\nBHY Hospital: UAN {uan} / Phone {ph}",
      ru: "Ye emergency ho sakti hai. Barah-e-meharbani foran qareebi hospital ki emergency mein jayein ya local emergency service ko call karein. Main chat mein alamaat ka jaiza nahi le sakta.\nBHY Hospital: UAN {uan} / Phone {ph}",
      ur: "یہ ہنگامی صورتحال ہو سکتی ہے۔ براہِ کرم فوراً قریبی ہسپتال کی ایمرجنسی میں جائیں یا مقامی ایمرجنسی سروس کو کال کریں۔ میں چیٹ میں علامات کا جائزہ نہیں لے سکتا۔\nبی ایچ وائی ہسپتال: UAN {uan} / فون {ph}"
    },
    medical: {
      en: "I can't diagnose, suggest medicines or interpret reports. Please consult a doctor. I can show you our departments or help you contact the hospital: UAN {uan}.",
      ru: "Main bimari ki tashkhees, dawai ya reports ki tashreeh nahi kar sakta. Barah-e-meharbani doctor se mashwara karein. Main departments bata sakta hun ya rabta karne mein madad kar sakta hun: UAN {uan}.",
      ur: "میں بیماری کی تشخیص، دوا یا رپورٹس کی تشریح نہیں کر سکتا۔ براہِ کرم ڈاکٹر سے مشورہ کریں۔ میں شعبوں کی فہرست بتا سکتا ہوں یا ہسپتال سے رابطے میں مدد کر سکتا ہوں: UAN {uan}۔"
    },
    staff: {
      en: "Reports, billing, complaints and appointment changes need hospital staff. Please call UAN {uan} or visit the reception.",
      ru: "Reports, billing, shikayat aur appointment mein tabdeeli ke liye hospital staff ki madad chahiye. UAN {uan} par call karein ya reception se rabta karein.",
      ur: "رپورٹس، بلنگ، شکایات یا اپائنٹمنٹ میں تبدیلی کے لیے ہسپتال کے عملے کی مدد درکار ہے۔ براہِ کرم UAN {uan} پر کال کریں یا ریسپشن سے رجوع کریں۔"
    },
    confirm: {
      en: "I don't have confirmed details on dialysis, admission / beds, visiting hours or welfare / Zakat support. Please ask the hospital on UAN {uan}.",
      ru: "Dialysis, admission / beds, visiting hours aur welfare / Zakat support ki confirmed tafseel mere paas nahi. Barah-e-meharbani hospital se UAN {uan} par poochein.",
      ur: "ڈائیلاسز، داخلہ / بستر، ملاقات کے اوقات اور فلاحی / زکوٰۃ امداد کی تصدیق شدہ تفصیل میرے پاس نہیں۔ براہِ کرم UAN {uan} پر ہسپتال سے پوچھیں۔"
    },
    thanks: {
      en: "You're welcome! Is there anything else I can help with?",
      ru: "Shukriya! Kya main aur kisi cheez mein madad kar sakta hun?",
      ur: "خوش آمدید! کیا کسی اور چیز میں مدد کر سکتا ہوں؟"
    },
    fallback: {
      en: "Sorry, I don't have that information. Please call UAN {uan} or choose an option below.",
      ru: "Maazrat, ye maloomat mere paas nahi. Barah-e-meharbani UAN {uan} par rabta karein ya neeche se option chunein.",
      ur: "معذرت، یہ معلومات میرے پاس نہیں۔ براہِ کرم UAN {uan} پر رابطہ کریں یا نیچے سے کوئی آپشن چنیں۔"
    }
  };

  var UI = {
    en: { title: 'BHY Hospital Assistant', sub: 'Information only, not medical advice', ph: 'Type your question', send: 'Send', open: 'Chat with BHY Hospital', close: 'Close chat' },
    ru: { title: 'BHY Hospital Assistant', sub: 'Sirf maloomat, medical mashwara nahi', ph: 'Apna sawal likhein', send: 'Bhejein', open: 'BHY Hospital se chat karein', close: 'Chat band karein' },
    ur: { title: 'بی ایچ وائی ہسپتال اسسٹنٹ', sub: 'صرف معلومات، طبی مشورہ نہیں', ph: 'اپنا سوال لکھیں', send: 'بھیجیں', open: 'بی ایچ وائی ہسپتال سے چیٹ کریں', close: 'چیٹ بند کریں' }
  };
  var CHIPS = [
    ['docs', 'Doctors & OPD', 'Doctors & OPD', 'ڈاکٹرز اور او پی ڈی'], ['today', "Today's Doctors", 'Aaj ke doctors', 'آج کے ڈاکٹر'],
    ['spec', 'Search by Specialty', 'Specialty se talash', 'اسپیشلٹی سے تلاش'], ['name', 'Search by Doctor Name', 'Doctor ke naam se', 'ڈاکٹر کے نام سے'],
    ['dept', 'Departments', 'Departments', 'شعبے'], ['services', 'Hospital Services', 'Hospital Services', 'ہسپتال کی خدمات'],
    ['opd', 'OPD Timings', 'OPD timing', 'او پی ڈی اوقات'], ['appt', 'Appointment Info', 'Appointment ki maloomat', 'اپائنٹمنٹ کی معلومات'],
    ['contact', 'Contact Hospital', 'Hospital se rabta', 'ہسپتال سے رابطہ'], ['whatsapp', 'WhatsApp', 'WhatsApp', 'واٹس ایپ'], ['location', 'Location', 'Location', 'مقام']
  ];
  var LI = { en: 1, ru: 2, ur: 3 };

  /* ---------- Intent matching (first match wins) ---------- */
  var INTENTS = [
    ['emergency', ['emergency', 'breath', 'difficulty breathing', 'seizure', 'severe bleeding', 'unresponsive', 'heart attack', 'chest pain', 'unconscious', 'bleeding', 'accident', "can't breathe", 'cant breathe', 'stroke', 'poison', 'saans nahi', 'saans lene', 'behosh', 'khoon', 'hadsa', 'dil ka daura', 'ایمرجنسی', 'بے ہوش', 'خون', 'حادثہ', 'دل کا دورہ', 'سانس نہیں', 'سانس لینے']],
    ['confirm', ['dialysis', 'admission', 'admit', 'bed', 'ward', 'visiting', 'zakat', 'welfare', 'free treatment', 'insurance', 'discount', 'payment', '=room', 'room charges', 'operation charges', 'test charges', 'lab charges', 'ultrasound charges', 'charges of', 'bima', 'ڈائیلاسز', 'داخلہ', 'زکوٰۃ', 'زکوة', 'بیمہ', 'رعایت']],
    ['vaccine', ['vaccin', 'polio', 'birth dose', 'tika', 'ٹیکہ', 'ٹیکے', 'ویکسین']],
    ['medical', ['=medicine', '=medicines', '=dawai', '=dawa', '=tablet', '=tablets', '=dose', 'symptom', '=bukhar', '=fever', '=pain', '=dard', 'diagnos', 'prescri', 'interpret', 'tashreeh', '=samjha', '=samjhao', '=samjhayen', '=mri', 'report samajh', 'report dekh', 'infection', '=cough', '=khansi', '=ilaj', '=treatment', 'علاج', 'دوا', 'بخار', 'درد', 'کھانسی']],
    ['fee', ['fee', 'fees', 'charges', 'price', 'cost', 'paise', 'qeemat', 'kharcha', 'فیس', 'قیمت', 'خرچ']],
    ['appt', ['appointment', 'apointment', 'booking', 'book', 'اپائنٹمنٹ', 'بکنگ']],
    ['whatsapp', ['whatsapp', 'whats app', 'واٹس ایپ', 'وٹس ایپ']],
    ['contact', ['contact', 'phone', 'number', 'call', 'helpline', 'uan', 'rabta', 'raabta', 'nambar', 'رابطہ', 'نمبر', 'فون']],
    ['location', ['address', 'location', 'where', 'kahan', 'kahaan', 'direction', 'map', 'pata', 'پتہ', 'کہاں', 'مقام', 'لوکیشن']],
    ['web', ['website', 'facebook', 'instagram', 'social', 'site', 'ویب سائٹ', 'فیس بک', 'انسٹاگرام']],
    ['about', ['what is bhy', 'about bhy', 'about us', 'about the hospital', 'who manages', 'managed by', 'management', 'jpsd', 'jamiyat', 'begum haji', 'bhy kya', 'kya hai bhy', 'hospital kya hai', 'hospital ke baare', 'hospital ki maloomat', 'about hospital', 'ہسپتال کیا ہے', 'بی ایچ وائی کیا', 'ownership', 'government hospital', 'sarkari', 'ہسپتال کے بارے', 'انتظامیہ', 'کون چلاتا']],
    ['dept', ['department', 'specialt', 'specialist', 'gynae', 'gynec', 'chest', 'cardio', 'heart', 'ortho', 'pediatric', 'paediatric', 'child', 'bachon', 'neuro', 'urolog', 'eye', 'ophthal', 'psychiat', 'nephro', 'kidney', 'diabet', 'sugar', 'surgery', 'surgeon', 'dietitian', 'nutrition', 'physician', 'shobay', 'shobe', 'shuba', 'شعبے', 'شعبہ', 'ڈیپارٹمنٹ']],
    ['staff', ['report', 'complaint', 'bill', 'refund', 'shikayat', 'feedback', 'رپورٹ', 'شکایت', 'بل']],
    ['services', ['service', 'facilit', 'sahulat', 'scan', 'xray', 'x-ray', 'ultrasound', 'mammograph', 'echo', 'physio', 'lab', 'test', 'radiology', 'خدمات', 'سہولت', 'سہولیات', 'ٹیسٹ']],
    ['doctor', ['doctor', 'dr', 'daktar', 'available', 'availability', 'aaj', 'today', 'schedule', 'consultant', 'ڈاکٹر', 'آج']],
    ['opd', ['opd', 'timing', 'timings', 'time', 'hours', 'open', 'khula', 'khulta', 'waqt', 'اوقات', 'ٹائم', 'وقت']],
    ['thanks', ['thank', 'thanks', 'shukriya', 'jazak', 'شکریہ']],
    ['welcome', ['hello', 'hi', 'hey', 'salam', 'assalam', 'سلام', 'السلام']]
  ];
  function tokens(t) { return t.split(/[^a-z0-9\u0600-\u06ff]+/).filter(Boolean); }
  function match(text) {
    var t = text.toLowerCase().replace(/[؟،۔؛]/g, ' ').replace(/general medicine|rheumatology/g, ' '), tk = tokens(t);
    for (var i = 0; i < INTENTS.length; i++) {
      var ks = INTENTS[i][1];
      for (var j = 0; j < ks.length; j++) {
        var k = ks[j];
        if (k.charAt(0) === '=' ? tk.indexOf(k.slice(1)) > -1 : (k.length <= 3 ? tk.indexOf(k) > -1 : t.indexOf(k) > -1)) return INTENTS[i][0];
      }
    }
    return 'fallback';
  }
  var ROMAN = ['kya', 'hai', 'hain', 'kahan', 'kahaan', 'kese', 'kaise', 'kaisay', 'aap', 'mujhe', 'mujhay', 'kitna', 'kitne', 'nahi', 'nahin', 'kaun', 'kon', 'kab', 'karen', 'karein', 'chahiye', 'chahye', 'batao', 'batayen', 'baat', 'aaj', 'kal', 'mein', 'hum', 'kia', 'ka', 'ki', 'sakta', 'sakti', 'dawai', 'dard', 'bukhar', 'rabta', 'raabta', 'salam', 'shukriya', 'kaun', 'kis', 'din', 'aate', 'hotay', 'hoti', 'hota', 'ko', 'ke', 'jild', 'aankh', 'bachon', 'bachay', 'daktar', 'milega', 'milti', 'chahiye', 'meri', 'mera', 'mere', 'dein', 'dena', 'samjha', 'samjhao', 'konsi', 'lein', 'len', 'bataiye', 'batayiye', 'hogi', 'hoga', 'hongay', 'hain'];
  var ENG = ['the', 'is', 'what', 'where', 'how', 'do', 'you', 'can', 'are', 'your', 'when', 'which', 'does', 'need'];
  function detect(text, cur) {
    if (/[\u0600-\u06FF]/.test(text)) return 'ur';
    var tk = tokens(text.toLowerCase()), i;
    for (i = 0; i < tk.length; i++) if (ROMAN.indexOf(tk[i]) > -1) return 'ru';
    var n = 0; for (i = 0; i < tk.length; i++) if (ENG.indexOf(tk[i]) > -1) n++;
    return n >= 1 ? 'en' : cur;
  }

  /* ================= DOCTOR SCHEDULE (source: Consultant_Schedule_NOV_2026_EXCEL.xlsx, sheet "Table 1") =================
     DOCS row: [name, specialtyId, [ [days(0=Sun..6=Sat), timing, startMin, endMin, fee, flags, note], ... ]]
     flags: p = pre-appointment, a = alternate Sunday, x = timing ambiguous in source (shown exactly as recorded), i = day taken from merged cell */
  var SCH = { y: 2026, m: 11, label: 'November 2026' };
  /*DOCS_START*/
  var DOCS = [["Dr. Saleem Shaikh","cardio",[["123456","02:00 PM – 04:00 PM",840,960,"1,250","",""]]],["Dr. Lal Kumar","cardio",[["12345","06:00 PM – 07:00 PM",1080,1140,"1,150","",""]]],["Dr. Sher Muhammad","cardio",[["135","08:00 PM – 09:00 PM",1200,1260,"1,150","",""]]],["Dr. Saifullah","chest",[["135","05:00 PM – 07:00 PM",1020,1140,"1,150","",""]]],["Dr. Aftab Ali","chest",[["246","05:00 PM – 07:00 PM",1020,1140,"1,150","",""]]],["Dr. M. Raza","chest",[["135","07:30 PM – 08:30 PM",1170,1230,"1,150","",""]]],["Dr. Chandni","chest",[["250","02:00 PM – 04:00 PM",840,960,"","",""]]],["Dr. Shameen Siddiqui","chest",[["246","08:00 PM – 09:00 PM",1200,1260,"1,150","",""]]],["Ms. Sidra Mustaqeem","clinpsy",[["3","04:00 PM – 05:00 PM",960,1020,"1,250","p",""]]],["Dr. Junaid Rabbani","derm",[["123456","03:00 PM – 04:00 PM",900,960,"1,150","",""]]],["Dr. Rajesh","derm",[["25","04:00 PM – 06:00 PM",960,1080,"1,150","",""]]],["Dr. Emmadullah Kirmani","derm",[["36","08:00 PM – 10:00 PM",1200,1320,"1,250","",""]]],["Dr. Faryal Memon","derm",[["25","06:00 PM – 08:00 PM",1080,1200,"","",""]]],["Dr. Huma Panja","derm",[["14","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Farhan Mir Shaikh","derm",[["25","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Liaquat Ali Capt (Retd)","diab",[["24","04:00 PM – 06:00 PM",960,1080,"1,150","",""]]],["Dr. Nusrat Solangi","diab",[["13","04:00 PM – 06:00 PM",960,1080,"1,150","",""],["6","07:00 PM – 09:00 PM",1140,1260,"","",""]]],["Dr. Asmat Nawaz","diab",[["135","06:00 PM – 08:00 PM",1080,1200,"1,150","",""]]],["Dr. Farooq Memon","diab",[["24","06:30 PM – 08:00 PM",1110,1200,"1,150","",""],["6","04:00 PM – 06:00 PM",960,1080,"","",""]]],["Dr. Anwar Bawani","dental",[["123456","02:00 PM – 04:00 PM",840,960,"1,150","",""]]],["Dr. Ayesha Yousuf","dental",[["135","11:00 AM – 01:00 PM",660,780,"","",""],["0","08:00 PM – 10:00 PM",1200,1320,"","",""]]],["Dr. Faryal M Siddique","dental",[["123456","07:00 PM – 09:00 PM",1140,1260,"1,150","",""]]],["Dr. Insha Shahid","dental",[["13","06:00 PM – 07:00 PM",1080,1140,"1,150","",""],["0","04:00 PM – 07:00 PM",960,1140,"","",""]]],["Dr. Fahad Ahmed","maxfac",[["246","04:30 PM – 06:30 PM",990,1110,"1,150","",""]]],["Dr. Tanveer Shaikh","ent",[["24","03:00 PM – 05:00 PM",900,1020,"1,150","",""],["6","03:00 PM – 04:00 PM",900,960,"","",""]]],["Dr. Noor Ahmed Shaikh","ent",[["1356","04:00 PM – 06:00 PM",960,1080,"1,250","",""],["6","04:00 PM – 07:00 PM",960,1140,"","",""]]],["Dr. Abdul Hameed Shaikh","ent",[["145","12:00 PM – 02:00 PM",720,840,"","",""]]],["Dr. Qaiser Sajjad","ent",[["12345","06:00 PM – 08:00 PM",1080,1200,"1,250","",""]]],["Dr. Perwaiz Shaikh","ent",[["123456","08:00 PM – 10:00 PM",1200,1320,"1,250","",""]]],["Dr. Syed Shahid Raza","ent",[["236","12:00 PM – 02:00 PM",720,840,"1,150","",""],["0","06:00 PM – 08:00 PM",1080,1200,"","",""]]],["Dr. M. Ali Taj","gastro",[["136","04:00 PM – 05:00 PM",960,1020,"1,250","",""]]],["Dr. Ghulamullah Lail","gastro",[["245","04:00 PM – 05:00 PM",960,1020,"1,150","",""]]],["Dr. Muhammad Furqan","gastro",[["136","08:00 PM – 09:00 PM",1200,1260,"1,150","",""],["0","03:30 PM – 05:30 PM",930,1050,"1,150","",""]]],["Dr. Anam Siddqui","gastro",[["24","02:30 PM – 03:30 PM",870,930,"1,150","",""]]],["Dr. Saleem Shahzad","gastro",[["135","06:30 TO 08:00 PM",-1,-1,"","x",""]]],["Dr. Kiran","gastro",[["24","08:00 PM – 09:00 PM",1200,1260,"1,150","",""],["0","08:00 PM – 09:00 PM",1200,1260,"","a",""]]],["Dr. Rabail Qureshi","gensurg",[["1234","06:00 PM – 07:30 PM",1080,1170,"1,150","",""]]],["Dr. Kainat Zaffar","gensurg",[["2460","03:00 PM – 04:30 PM",900,990,"1,150","",""]]],["Dr. Dileep Kumar","gensurg",[["123456","04:30 PM – 06:00 PM",990,1080,"1,250","",""]]],["Dr. Tunza Irfan","gensurg",[["135","03:00 PM – 04:30 PM",900,990,"1,150","",""]]],["Dr. Muhammad Hassan","gensurg",[["235","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Abdul Muqeet","gensurg",[["146","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Shazia Iqbal","genphys",[["2","11:00 AM – 01:00 PM",660,780,"1,150","",""],["5","06:00 PM – 08:00 PM",1080,1200,"","",""],["6","08:00 PM – 10:00 PM",1200,1320,"","",""]]],["Dr. Sandeep","genphys",[["246","03:00 PM – 06:00 PM",900,1080,"1,150","",""]]],["Dr. Ihsan Bashir","genphys",[["135","02:00 PM – 05:00 PM",840,1020,"1,150","",""],["0","03:00 PM – 05:00 PM",900,1020,"800","",""]]],["Dr. Zunaira Jalil","genphys",[["13","05:00 PM – 07:00 PM",1020,1140,"1,250","",""]]],["Dr. Zaheer Ahmed","genphys",[["246","06:00 PM – 08:00 PM",1080,1200,"1,150","",""]]],["Dr. Suresh Kumar","genphys",[["12345","08:00 PM – 10:00 PM",1200,1320,"1,250","",""]]],["Dr. Manooj Kumar","genphys",[["46","01:00 PM – 03:00 PM",780,900,"1,150","",""],["0","05:00 PM – 08:00 PM",1020,1200,"800","",""]]],["Dr. Jetender Maheswari","genphys",[["135","11:00 AM – 01:00 PM",660,780,"1,150","",""]]],["Dr. Zahe Gul","gynae",[["246","09:30 AM – 12:00 PM",570,720,"800","",""],["1","05:00 PM – 06:00 PM",1020,1080,"1,150","",""]]],["Dr. Salma Ayaz","gynae",[["1","10:00 AM – 11:00 AM",600,660,"800","",""],["35","10:00 AM – 12:00 PM",600,720,"","",""]]],["Dr. Uzma Akram","gynae",[["14","11:00 AM – 01:00 PM",660,780,"1,150","",""]]],["Dr. Samina Qazi","gynae",[["2356","12:00 PM – 02:00 PM",720,840,"1,150","",""]]],["Dr. Saima Khan","gynae",[["14","02:00 PM – 04:00 PM",840,960,"1,150","",""],["5","06:00 PM – 08:00 PM",1080,1200,"","",""]]],["Dr. Aruna Kumari","gynae",[["356","02:00 PM – 04:00 PM",840,960,"1,250","p",""]]],["Dr. Afshan Javed","gynae",[["3","04:00 PM – 05:30 PM",960,1050,"1,150","",""],["0","03:00 PM – 05:00 PM",900,1020,"1,150","",""]]],["Dr. Farah Naz","gynae",[["2","03:00 PM – 05:00 PM",900,1020,"1,150","",""],["0","05:00 PM – 07:00 PM",1020,1140,"","",""]]],["Dr. Shahnaz Younus","gynae",[["25","05:00 PM – 09:00 PM",1020,1260,"1,250","p",""]]],["Dr. Zahida Soomro","gynae",[["46","05:00 PM – 08:00 PM",1020,1200,"1,250","p",""]]],["Dr. Mussarat Jabeen Kazi","gynae",[["246","05:30 PM – 07:30 PM",1050,1170,"1,150","",""]]],["Dr. Usha Kumari","gynae",[["135","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Rana Bukhari","gynae",[["13","06:00 PM – 08:00 PM",1080,1200,"1,250","p",""]]],["Dr. Rabia Saleem","gynae",[["14","01:00 PM – 02:00 PM",780,840,"","",""],["0","07:00 PM – 09:00 PM",1140,1260,"","",""]]],["Dr. Mala Shahani","gynae",[["246","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Haran Kumar","nephro",[["2","07:30 PM – 08:30 PM",1170,1230,"1,250","",""],["5","08:00 PM – 09:00 PM",1200,1260,"","",""]]],["Dr. Farah Anum Jameel","nephro",[["14","04:00 PM – 06:00 PM",960,1080,"1,150","",""]]],["Dr. Yahya Khan","neurophys",[["12345","06:30 PM – 08:00 PM",1110,1200,"1,250","",""]]],["Dr. Jay Parkash","neurophys",[["2356","08:00 PM – 09:00 PM",1200,1260,"1,150","",""]]],["Dr. Rabail Khan","neurosurg",[["235","05:00 PM – 06:00 PM",1020,1080,"1,150","",""]]],["Dr. Muhammad Adil Khatri","neurosurg",[["46","05:00 PM – 06:00 PM",1020,1080,"1,250","",""]]],["Dr. Ghazala","eye",[["1","05:30 PM – 07:00 PM",1050,1140,"1,150","",""],["246","03:30 PM – 05:30 PM",930,1050,"","",""]]],["Dr. Rizwan Rasheed","eye",[["135","03:30 PM – 05:00 PM",930,1020,"1,150","",""]]],["Dr. Shahla Dareshani","eye",[["35","05:30 PM – 07:30 PM",1050,1170,"1,150","",""]]],["Dr. M. Adnan","eye",[["246","05:30 PM – 07:00 PM",1050,1140,"1,150","",""]]],["Dr. Zeeshan Kamil","eye",[["123456","07:30 PM – 09:30 PM",1170,1290,"1,250","",""]]],["Dr. S.M Tariq","ortho",[["246","11:00 AM – 12:00 PM",660,720,"1,150","",""]]],["Dr. Altaf Hussain","ortho",[["13456","03:30 PM – 05:30 PM",930,1050,"1,150","",""],["2","03:30 PM – 07:30 PM",930,1170,"","",""],["0","06:00 PM – 08:00 PM",1080,1200,"","",""]]],["Dr. Saeed Ahmed Shaikh","ortho",[["1356","06:00 PM – 07:30 PM",1080,1170,"1,150","",""]]],["Dr. Sajjad Ali","ortho",[["135","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Mukesh Kumar","ortho",[["246","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Kashif Murtaza","ortho",[["123456","01:00 PM – 03:00 PM",780,900,"1,150","",""],["0","04:00 PM – 06:00 PM",960,1080,"","",""]]],["Dr. Raheel Aslam","ortho",[["4","06:00 PM – 08:00 PM",1080,1200,"1,150","",""],["0","02:00 PM – 04:00 PM",840,960,"","",""]]],["Dr. Muhammad Lateef","psychiatrist",[["26","07:00 PM – 08:00 PM",1140,1200,"1,250","",""]]],["Dr. Haris Patel","paedsurg",[["15","05:00 PM – 07:00 PM",1020,1140,"","",""]]],["Dr. Sadaf Zehra","paeds",[["123456","09:00 AM TO 11:30PM",-1,-1,"800","x",""]]],["Dr. Shaheen Ahmad","paeds",[["135","11:30PM TO 03:00PM",-1,-1,"1,150","x",""],["0","12:00 PM – 02:00 PM",720,840,"800","","ER Department"],["0","06:00 PM – 08:00 PM",1080,1200,"1,150","i","OPD Department"]]],["Dr. Srichand","paeds",[["123456","03:00 PM – 04:00 PM",900,960,"1,150","",""]]],["Dr. Amanullah Lail","paeds",[["123456","04:00 PM – 07:00 PM",960,1140,"1,150","",""],["0","04:00 PM – 06:00 PM",960,1080,"","",""]]],["Dr. Taj Laghari","paeds",[["123456","07:00 PM – 10:00 PM",1140,1320,"1,150","",""],["0","08:00 PM – 10:00 PM",1200,1320,"1,150","",""]]],["Dr. Lachman Das","paeds",[["1360","10:00 PM – 12:00 AM",1320,1440,"800","","ER Department"]]],["Dr. Muhammad Omair","paeds",[["245","10:00 PM – 12:00 AM",1320,1440,"800","","ER Department"]]],["Dr. Mahak Ali Memon","plastic",[["135","08:00 PM – 09:00 PM",1200,1260,"1,250","",""],["24","06:00 PM – 07:00 PM",1080,1140,"","",""]]],["Dr. Saira Bano","rheum",[["6","05:00 PM – 08:00 PM",1020,1200,"","",""]]],["Dr. Kahkashan","sono",[["123456","11:30 AM – 01:00 PM",690,780,"","",""]]],["Dr. Qurat Ul Ain","sono",[["123456","01:30 PM – 04:00 PM",810,960,"","",""]]],["Dr. Najma Memon","sono",[["123456","04:30 PM – 07:30 PM",990,1170,"","",""]]],["Dr. Manesh Kumar","sono",[["123456","08:00 PM – 10:00 PM",1200,1320,"","",""]]],["Ambreen Sohaib","sono",[["0","04:00 PM – 06:00 PM",960,1080,"","",""]]],["Dr. Shahid Hussain","uro",[["1345","07:00 PM – 09:00 PM",1140,1260,"1,150","",""]]],["Dr. Muhammad Imran","uro",[["26","07:00 PM – 08:30 PM",1140,1230,"1,150","",""]]],["Dr. Waqar Hassan Sheikh","uro",[["1234","04:30 PM – 06:30 PM",990,1110,"1,150","",""]]],["Ms. Rehma","nutri",[["12345","10:00 AM – 01:00 PM",600,780,"1,150","",""]]],["Dr. Fouzia Masood","family",[["0","02:00 PM – 03:00 PM",840,900,"800","",""]]],["Dr. Khalil-Ur-Rehman","vascular",[["26","06:00 PM – 07:00 PM",1080,1140,"1,250","p",""]]]];
  /*DOCS_END*/
  /* WEBSITE DIRECTORY (source: bhyhospital.vercel.app/doctors, read for this build). Kept separate from the schedule file.
     WEB row: [slug, website name, specialty id, qualifications, link type, schedule-file name, [[days, timing, flags, note]]]
     link type: ex = same name, sp = spelling variant only, nm = name differs (not assumed to be the same person) */
  var WEB = [["lal-kumar","Dr. Lal Kumar","cardio","MBBS, DIP CARD","ex","Dr. Lal Kumar",[["12345","06:00 PM – 07:00 PM","",""]]],["saleem-sheikh","Dr. Saleem Sheikh","cardio","MBBS, DIP CARD","sp","Dr. Saleem Shaikh",[["123456","02:00 PM – 04:00 PM","",""]]],["sher-muhammad","Dr. Sher Muhammad","cardio","MBBS, FCPS, (CARD)(NICVD)","ex","Dr. Sher Muhammad",[["135","08:00 PM – 09:00 PM","",""]]],["aftab-ali","Dr. Aftab Ali","chest","MBBS, FCPS","ex","Dr. Aftab Ali",[["246","05:00 PM – 07:00 PM","",""]]],["chandni","Dr. Chandni","chest","MBBS, FCPS","ex","Dr. Chandni",[["250","02:00 PM – 04:00 PM","",""]]],["muhammad-raza","Dr. Muhammad Raza","chest","MBBS, DTCD","sp","Dr. M. Raza",[["135","07:30 PM – 08:30 PM","",""]]],["shahmeen-siddiqui","Dr. Shahmeen Siddiqui","chest","MBBS, DTCD","sp","Dr. Shameen Siddiqui",[["","08:00 PM – 09:00 PM","",""]]],["saifullah","Dr. Saifullah","chest","MBBS, FCPS","ex","Dr. Saifullah",[["135","05:00 PM – 07:00 PM","",""]]],["sidra-mustaqeem","Dr. Sidra Mustaqeem","clinpsy","MA (PSYCOLOGY), PMDACP","ex","Ms. Sidra Mustaqeem",[["3","04:00 PM – 05:00 PM","p",""]]],["emadullah-kirmani","Dr. Emadullah Kirmani","derm","MBBS, D.DERMATOLOGY","sp","Dr. Emmadullah Kirmani",[["36","08:00 PM – 10:00 PM","",""]]],["farhan-mir-shaikh","Dr. Farhan Mir Shaikh","derm","MBBS, FCPS (EUROPEON BOARD CERTIFIED)","ex","Dr. Farhan Mir Shaikh",[["25","08:00 PM – 10:00 PM","",""]]],["faryal-memon","Dr. Faryal Memon","derm","MBBS, FCPS, MRCP","ex","Dr. Faryal Memon",[["25","06:00 PM – 08:00 PM","",""]]],["huma-panja","Dr. Huma Panja","derm","MBBS, MCPS, AAAM(USA)","ex","Dr. Huma Panja",[["14","08:00 PM – 10:00 PM","",""]]],["junaid-rabbani","Dr. Junaid Rabbani","derm","MBBS, D.Dermatology","ex","Dr. Junaid Rabbani",[["123456","03:00 PM – 04:00 PM","",""]]],["rajesh","Dr. Rajesh","derm","MBBS, FCPS, DIP DERMA, MD. DERMA","ex","Dr. Rajesh",[["14","06:00 PM – 07:00 PM","",""],["25","04:00 PM – 06:00 PM","",""]]],["asmat-nawaz","Dr. Asmat Nawaz","diab","MBBS, DIAB, MS (ENDOCRINOLOGY)","ex","Dr. Asmat Nawaz",[["135","06:00 PM – 08:00 PM","",""]]],["capt-liaquat-ali","Dr. Capt. Liaquat Ali","diab","MBBS, D-DIAB","sp","Dr. Liaquat Ali Capt (Retd)",[["24","04:00 PM – 06:00 PM","",""]]],["farooq-memon","Dr. Farooq Memon","diab","MBBS, D-DIAB","ex","Dr. Farooq Memon",[["24","06:30 PM – 08:00 PM","",""],["6","04:00 PM – 06:00 PM","",""]]],["nusrat-solangi","Dr. Nusrat Solangi","diab","MBBS, MS (ENDOCRINOLOGY & DIABETOLOGY)","ex","Dr. Nusrat Solangi",[["13","04:00 PM – 06:00 PM","",""],["6","07:00 PM – 09:00 PM","",""]]],["anwaar-bawani","Dr. Anwaar Bawani","dental","BDS, RDS, C-ALIGNER, C-IMPLANT, C-ENDO","sp","Dr. Anwar Bawani",[["123456","02:00 PM – 04:00 PM","",""]]],["faryal-m-siddique","Dr. Faryal M. Siddique","dental","BDS, RDS, C-ORTHO","sp","Dr. Faryal M Siddique",[["123456","05:00 PM – 09:00 PM","",""]]],["insha-shahid","Dr. Insha Shahid","dental","BDS, RDS","ex","Dr. Insha Shahid",[["13","02:00 PM – 04:00 PM","",""],["0","04:00 PM – 07:00 PM","",""]]],["ayesha-yousuf","Dr. Ayesha Yousuf","maxfac","BDS, RDS, FCPS ORAL AND MAXILLOFICAL SURGERY","ex","Dr. Ayesha Yousuf",[["135","11:00 AM – 01:00 PM","",""],["0","08:00 PM – 10:00 PM","",""]]],["fahad-ahmed","Dr. Fahad Ahmed","maxfac","BDS, RDS, MDS","ex","Dr. Fahad Ahmed",[["246","04:30 PM – 06:30 PM","",""]]],["abdul-hameed-shaikh","Dr. Abdul Hameed Shaikh","ent","MBBS, DLO","ex","Dr. Abdul Hameed Shaikh",[["145","12:00 PM – 02:00 PM","",""]]],["noor-ahmed-shaikh","Dr. Noor Ahmed Shaikh","ent","MBBS, DLO","ex","Dr. Noor Ahmed Shaikh",[["1356","04:00 PM – 06:00 PM","",""],["0","04:00 PM – 07:00 PM","",""]]],["perwaiz-sheikh","Dr. Perwaiz Sheikh","ent","MBBS, DLO","sp","Dr. Perwaiz Shaikh",[["123456","08:00 PM – 10:00 PM","",""]]],["qaiser-sajjad","Dr. Qaiser Sajjad","ent","MBBS, DLO, MS ENT","ex","Dr. Qaiser Sajjad",[["12345","06:00 PM – 08:00 PM","",""]]],["syed-shahid-raza","Dr. Syed Shahid Raza","ent","MBBS, DLO, MCPS, FRCS","ex","Dr. Syed Shahid Raza",[["236","12:00 PM – 02:00 PM","",""],["0","06:00 PM – 08:00 PM","",""]]],["tanveer-shaikh","Dr. Tanveer Shaikh","ent","MBBS, DLO","ex","Dr. Tanveer Shaikh",[["24","03:00 PM – 05:00 PM","",""],["6","03:00 PM – 04:00 PM","",""]]],["anum-siddique","Dr. Anum Siddique","gastro","MBBS, FCPS","sp","Dr. Anam Siddqui",[["24","02:30 PM – 03:30 PM","",""]]],["ghulamullah-lail","Dr. Ghulamullah Lail","gastro","MBBS, FCPS","ex","Dr. Ghulamullah Lail",[["245","04:00 PM – 05:00 PM","",""]]],["kiran-bajaj","Dr. Kiran Bajaj","gastro","MBBS, FCPS","nm","Dr. Kiran",[["24","08:00 PM – 09:00 PM","",""],["0","08:00 PM – 09:00 PM","a",""]]],["m-ali-taj","Dr. M. Ali Taj","gastro","MBBS, FCPS, MRCP","ex","Dr. M. Ali Taj",[["136","04:00 PM – 05:00 PM","",""]]],["muhammad-furqaan","Dr. Muhammad Furqaan","gastro","MBBS, FCPS","sp","Dr. Muhammad Furqan",[["136","08:00 PM – 09:00 PM","",""],["0","03:30 PM – 05:30 PM","",""]]],["saleem-shahzad","Dr. Saleem Shahzad","gastro","MBBS, FCPS, FRCP(London), MRCP(Ireland), MD(Gastroenterology), FCPS(Gastroenterology)","ex","Dr. Saleem Shahzad",[["135","06:30 PM – 08:00 PM","",""]]],["dileep-kumar","Dr. Dileep Kumar","gensurg","MBBS, FCPS, FRCS","ex","Dr. Dileep Kumar",[["123456","04:30 PM – 06:00 PM","",""]]],["kainat-zafar","Dr. Kainat Zafar","gensurg","MBBS, FCPS, CHPE","sp","Dr. Kainat Zaffar",[["2460","03:00 PM – 04:30 PM","",""]]],["muhammad-hassan","Dr. Muhammad Hassan","gensurg","MBBS, FCPS (FELLOWSHIP IN LIVER TRANSPLANT & HPB SURGEON)","ex","Dr. Muhammad Hassan",[["235","08:00 PM – 10:00 PM","",""]]],["rabail-qureshi","Dr. Rabail Qureshi","gensurg","MBBS, FCPS","ex","Dr. Rabail Qureshi",[["1234","06:00 PM – 07:30 PM","",""]]],["tunza-irfan","Dr. Tunza Irfan","gensurg","MBBS, FCPS","ex","Dr. Tunza Irfan",[["135","03:00 PM – 04:30 PM","",""]]],["ihsan-bashir","Dr. Ihsan Bashir","genphys","MBBS, FCPS","ex","Dr. Ihsan Bashir",[["135","02:00 PM – 05:00 PM","",""],["0","03:00 PM – 05:00 PM","",""]]],["manoj-kumar","Dr. Manoj Kumar","genphys","MBBS, FCPS","sp","Dr. Manooj Kumar",[["46","01:00 PM – 03:00 PM","",""],["0","05:00 PM – 08:00 PM","",""]]],["sandeep-kumar","Dr. Sandeep Kumar","genphys","MBBS, FCPS","nm","Dr. Sandeep",[["246","03:00 PM – 06:00 PM","",""]]],["shazia-iqbal","Dr. Shazia Iqbal","genphys","MBBS, FCPS","ex","Dr. Shazia Iqbal",[["2","11:00 AM – 01:00 PM","",""],["5","06:00 PM – 08:00 PM","",""],["6","08:00 PM – 10:00 PM","",""]]],["suresh-kumar","Dr. Suresh Kumar","genphys","MBBS, FCPS","ex","Dr. Suresh Kumar",[["12345","08:00 PM – 10:00 PM","",""]]],["zaheer-ahmed","Dr. Zaheer Ahmed","genphys","MBBS, FCPS","ex","Dr. Zaheer Ahmed",[["246","06:00 PM – 08:00 PM","",""]]],["zunaira-jalil","Dr. Zunaira Jalil","genphys","MBBS, FCPS, MACG","ex","Dr. Zunaira Jalil",[["13","05:00 PM – 07:00 PM","",""]]],["jetender-maheshwari","Dr. Jetender Maheshwari","genphys","MBBS, FCPS, CHPE","sp","Dr. Jetender Maheswari",[["135","11:00 AM – 01:00 PM","",""]]],["salma-ayaz","Dr. Salma Ayaz","gynae","MBBS, FCPS","ex","Dr. Salma Ayaz",[["1","10:00 AM – 12:00 PM","",""],["35","10:00 AM – 12:00 PM","",""]]],["samina-qazi","Dr. Samina Qazi","gynae","MBBS, FCPS","ex","Dr. Samina Qazi",[["2356","12:00 PM – 02:00 PM","",""]]],["afshan-javed","Dr. Afshan Javed","gynae","MBBS, MCPS","ex","Dr. Afshan Javed",[["0","03:00 PM – 05:00 PM","",""]]],["aruna-kumari","Dr. Aruna Kumari","gynae","MBBS, FCPS (ASST. PROF)","ex","Dr. Aruna Kumari",[["356","02:00 PM – 04:00 PM","p",""]]],["raana-bukhari","Dr. Raana Bukhari","gynae","MBBS, MCPS, FCPS","sp","Dr. Rana Bukhari",[["13","06:00 PM – 08:00 PM","p",""]]],["usha-ashok","Dr. Usha Ashok","gynae","MBBS, FCPS","nm","Dr. Usha Kumari",[["135","08:00 PM – 10:00 PM","",""]]],["zahe-gul","Dr. Zahe Gul","gynae","MBBS, FCPS","ex","Dr. Zahe Gul",[["246","09:30 AM – 12:00 PM","",""],["1","05:00 PM – 06:00 PM","",""]]],["saima-khan","Dr. Saima Khan","gynae","MBBS, FCPS","ex","Dr. Saima Khan",[["14","02:00 PM – 04:00 PM","",""],["5","06:00 PM – 08:00 PM","",""]]],["rabia-saleem","Dr. Rabia Saleem","gynae","MBBS, MCPS","ex","Dr. Rabia Saleem",[["14","01:00 PM – 02:00 PM","",""],["0","07:00 PM – 09:00 PM","",""]]],["zahida-somroo","Dr. Zahida Somroo","gynae","MBBS, MCPS","sp","Dr. Zahida Soomro",[["","05:00 PM – 08:00 PM","p",""]]],["uzma-akram","Dr. Uzma Akram","gynae","MBBS, MRCOG, FRCOG","ex","Dr. Uzma Akram",[["14","11:00 AM – 01:00 PM","",""]]],["mala-shahani","Dr. Mala Shahani","gynae","MBBS, FCPS","ex","Dr. Mala Shahani",[["246","08:00 PM – 10:00 PM","",""]]],["musarrat-jabeen-qazi","Dr. Musarrat Jabeen Qazi","gynae","MBBS, MCPS","sp","Dr. Mussarat Jabeen Kazi",[["246","05:30 PM – 07:30 PM","",""]]],["shahnaz-younus","Dr. Shahnaz Younus","gynae","MBBS, MCPS, FCPS","ex","Dr. Shahnaz Younus",[["25","05:00 PM – 09:00 PM","p",""]]],["farah-naz","Dr. Farah Naz","gynae","MBBS, FCPS","ex","Dr. Farah Naz",[["2","03:00 PM – 05:00 PM","",""],["0","05:00 PM – 07:00 PM","",""]]],["farah-anum-jameel","Dr. Farah Anum Jameel","nephro","MBBS, FCPS","ex","Dr. Farah Anum Jameel",[["14","04:00 PM – 06:00 PM","",""]]],["haran-kumar","Dr. Haran Kumar","nephro","MBBS, MD. NEPHROLOGY","ex","Dr. Haran Kumar",[["2","07:30 PM – 08:30 PM","",""],["5","08:00 PM – 09:00 PM","",""]]],["yahya-khan","Dr. Yahya Khan","neurophys","MBBS, DCN, MPH","ex","Dr. Yahya Khan",[["12345","06:30 PM – 08:00 PM","",""]]],["jay-parkash","Dr. Jay Parkash","neurophys","MBBS, DCN, MPH","ex","Dr. Jay Parkash",[["2356","08:00 PM – 09:00 PM","",""]]],["rabail-khan","Dr. Rabail Khan","neurosurg","MBBS, FCPS","ex","Dr. Rabail Khan",[["235","05:00 PM – 06:00 PM","",""]]],["muhammad-adil-khatri","Dr. Muhamamd Adil Khatri","neurosurg","MBBS, FCPS","sp","Dr. Muhammad Adil Khatri",[["46","05:00 PM – 06:00 PM","",""]]],["rizwan-rasheed","Dr. Rizwan Rasheed","eye","MBBS, FCPS","ex","Dr. Rizwan Rasheed",[["135","03:30 PM – 05:30 PM","",""]]],["ghazala-tabassum","Dr. Ghazala Tabassum","eye","MBBS, FCPS","nm","Dr. Ghazala",[["1","05:30 PM – 07:30 PM","",""],["246","03:30 PM – 05:30 PM","",""]]],["zeeshan-kamil","Prof. Dr. Zeeshan Kamil","eye","MBBS, FCPS, CRCP, CHPE, MCPS, FRCS(UK)","ex","Dr. Zeeshan Kamil",[["123456","07:30 PM – 09:30 PM","",""]]],["muhammad-adnan","Dr. Muhammad Adnan","eye","MBBS, FCPS","sp","Dr. M. Adnan",[["246","05:30 PM – 07:30 PM","",""]]],["shahla-dareshani","Dr. Shahla Dareshani","eye","MBBS, FCPS (ASST. PROF)","ex","Dr. Shahla Dareshani",[["35","05:30 PM – 07:30 PM","",""]]],["kashif-murtaza","Dr. Kashif Murtaza","ortho","MBBS, FCPS","ex","Dr. Kashif Murtaza",[["123456","01:00 PM – 03:00 PM","",""],["0","04:00 PM – 06:00 PM","",""]]],["altaf-hussain","Dr. Altaf Hussain","ortho","MBBS, FCPS","ex","Dr. Altaf Hussain",[["13456","03:30 PM – 05:30 PM","",""],["2","03:30 PM – 07:30 PM","",""],["0","06:00 PM – 08:00 PM","",""]]],["saeed-sheikh","Prof. Dr. Saeed Sheikh","ortho","MBBS, FCPS","nm","Dr. Saeed Ahmed Shaikh",[["1356","06:00 PM – 07:30 PM","",""]]],["sajjad-ali","Dr. Sajjad Ali","ortho","MBBS, FCPS","ex","Dr. Sajjad Ali",[["135","08:00 PM – 10:00 PM","",""]]],["mukesh-kumar","Dr. Mukesh Kumar","ortho","MBBS, MRCS (Ireland), MRCS (Edinburgh), FCPS, CHPE","ex","Dr. Mukesh Kumar",[["246","08:00 PM – 10:00 PM","",""]]],["sm-tariq","Dr. S.M. Tariq","ortho","MBBS, MS","sp","Dr. S.M Tariq",[["246","11:00 AM – 12:00 PM","",""]]],["raheel-aslam","Dr. Raheel Aslam","ortho","MBBS, FCPS","ex","Dr. Raheel Aslam",[["2","06:00 PM – 08:00 PM","",""],["0","02:00 PM – 04:00 PM","",""]]],["muhammad-lateef","Dr. Muhammad Lateef","psychiatrist","MBBS, FCPS (Psychiatry), DIPLOMA (Psychology Medicine)","ex","Dr. Muhammad Lateef",[["26","07:00 PM – 08:00 PM","",""]]],["muhammad-haris-patel","Dr. Muhammad Haris Patel","paedsurg","MBBS, FCPS","nm","Dr. Haris Patel",[["15","05:00 PM – 07:00 PM","",""]]],["sadaf-zehra","Dr. Sadaf Zehra","paeds","MBBS, MCPS","ex","Dr. Sadaf Zehra",[["123456","09:00 AM – 11:30 AM","",""]]],["srichand","Dr. Srichand","paeds","MBBS, FCPS","ex","Dr. Srichand",[["123456","09:00 AM – 11:30 AM","",""]]],["amanullah-lail","Prof. Dr. Amanullah Lail","paeds","MBBS, FCPS, PGPN, IPPN","ex","Dr. Amanullah Lail",[["123456","04:00 PM – 07:00 PM","",""],["0","04:00 PM – 06:00 PM","",""]]],["taj-laghari","Prof. Dr. Taj Laghari","paeds","MBBS, DCH, MCPS, FCPS","ex","Dr. Taj Laghari",[["123456","07:00 PM – 10:00 PM","",""],["0","08:00 PM – 10:00 PM","",""]]],["muhammad-omair","Dr. Muhammad Omair","paeds","MBBS, MCPS","ex","Dr. Muhammad Omair",[["245","10:00 PM TO 12:00 AM","",""]]],["shaheen-ahmad","Dr. Shaheen Ahmad","paeds","MBBS, DCH, MCPS(PEADS), FCPS(PEADS) PGPN","ex","Dr. Shaheen Ahmad",[["135","12:00 PM – 03:00 PM","",""],["0","12:00 PM – 02:00 PM","","Emergency Department"],["0","06:00 PM – 08:00 PM","","OPD Department"]]],["lachman-das","Dr. Lachman Das","paeds","MBBS, DCH","ex","Dr. Lachman Das",[["1360","10:00 PM TO 12:00 AM","","Emergency Department"]]],["mehak-ali-memon","Dr. Mehak Ali Memon","plastic","MBBS, FCPS (PLAST)","sp","Dr. Mahak Ali Memon",[["135","08:00 PM – 09:00 PM","",""]]],["kehkashan-khoso","Dr. Kehkashan Khoso","sono","","nm","Dr. Kahkashan",[["123456","11:30 AM – 01:00 PM","",""]]],["qurat-ul-ain","Dr. Qurat-ul-ain","sono","","sp","Dr. Qurat Ul Ain",[["123456","01:30 PM – 04:00 PM","",""]]],["najma-memon","Dr. Najma Memon","sono","","ex","Dr. Najma Memon",[["123456","04:30 PM – 07:30 PM","",""]]],["manesh-kumar","Dr. Manesh Kumar","sono","","ex","Dr. Manesh Kumar",[["123456","08:00 PM – 10:00 PM","",""]]],["ambreen-sohaib","Ambreen Sohaib","sono","","ex","Ambreen Sohaib",[["0","04:00 PM – 06:00 PM","",""]]],["waqar-hassan-shaikh","Dr. Waqar Hassan Shaikh","uro","MBBS, FCPS, FSIU","sp","Dr. Waqar Hassan Sheikh",[["1234","04:30 PM – 06:30 PM","",""]]],["shahid-hussain","Dr. Shahid Hussain","uro","MBBS, FCPS, MRCPS, CHPE (ASST. PROF)","ex","Dr. Shahid Hussain",[["1345","07:00 PM – 09:00 PM","",""]]],["muhammad-imran","Dr. Muhamamd Imran","uro","MBBS, FCPS","sp","Dr. Muhammad Imran",[["26","07:00 PM – 08:30 PM","",""]]],["rahma-ayaz","Ms. Rahma Ayaz","nutri","MSC (Nutrition)","nm","Ms. Rehma",[["12345","10:00 AM – 01:00 PM","",""]]],["fouzia-masood","Dr. Fouzia Masood","family","MBBS, MCPS (Family Medicine)","ex","Dr. Fouzia Masood",[["0","02:00 PM – 03:00 PM","",""]]],["khalil-ur-rehman","Dr. Khalil-ur-Rehman","vascular","MBBS, FCPS","ex","Dr. Khalil-Ur-Rehman",[["26","06:00 PM – 07:00 PM","p",""]]]];
  var DW = {"Dr. Shameen Siddiqui":"246","Dr. Faryal M Siddique":"123456","Dr. Insha Shahid":"13","Dr. Noor Ahmed Shaikh":"6","Dr. Saleem Shahzad":"135","Dr. Salma Ayaz":"1","Dr. Afshan Javed":"3","Dr. Zahida Soomro":"46","Dr. Rizwan Rasheed":"135","Dr. Ghazala":"1","Dr. M. Adnan":"246","Dr. Raheel Aslam":"4","Dr. Sadaf Zehra":"123456","Dr. Srichand":"123456","Dr. Shaheen Ahmad":"135","Dr. Mahak Ali Memon":"24"}; /* schedule-file name -> days where the website shows something different */
  var WEBX = [["Dr. Rajesh","14","06:00 PM – 07:00 PM"],["Dr. Noor Ahmed Shaikh","0","04:00 PM – 07:00 PM"],["Dr. Raheel Aslam","2","06:00 PM – 08:00 PM"]]; /* [schedule-file name, days, timing]: sessions listed only on the website */
  var POSTER = [['dental', '04:00 PM – 07:00 PM'], ['genphys', '02:00 PM – 08:00 PM'], ['paeds', '04:00 PM – 10:00 PM'], ['gynae', '03:00 PM – 07:00 PM'], ['sono', '04:00 PM – 06:00 PM'], ['ortho', '02:00 PM – 08:00 PM'], ['ent', '06:00 PM – 08:00 PM'], ['gensurg', '03:00 PM – 04:30 PM']];
  var WBY = {}, WNM = {}; WEB.forEach(function (w) { if (w[4] === 'nm') WNM[w[5]] = w; else WBY[w[5]] = w; });
  var SPEC = {
    cardio: ['Cardiologist', 'کارڈیالوجسٹ'], chest: ['Chest Specialist', 'چیسٹ اسپیشلسٹ'], clinpsy: ['Clinical Psychologist', 'کلینیکل سائیکالوجسٹ'],
    derm: ['Dermatologist (Skin)', 'ڈرمیٹولوجسٹ (جلد)'], diab: ['Diabetologist / Endocrinologist', 'ڈائیبیٹولوجسٹ / اینڈوکرائنالوجسٹ'], dental: ['Dental Surgeon', 'ڈینٹل سرجن'],
    maxfac: ['Dental & Maxillofacial Surgeon', 'ڈینٹل اینڈ میکسیلوفیشل سرجن'], ent: ['ENT Surgeon', 'ای این ٹی سرجن'], gastro: ['Gastroenterologist', 'گیسٹرو اینٹرولوجسٹ'],
    gensurg: ['General & Laparoscopic Surgeon', 'جنرل اینڈ لیپروسکوپک سرجن'], genphys: ['General Physician', 'جنرل فزیشن'], gynae: ['Gynaecologist', 'گائناکالوجسٹ'],
    nephro: ['Nephrologist', 'نیفرولوجسٹ'], neurophys: ['Neuro Physician', 'نیورو فزیشن'], neurosurg: ['Neuro Surgeon', 'نیورو سرجن'],
    eye: ['Ophthalmologist (Eye Specialist)', 'آنکھوں کے ماہر (آفتھلمولوجسٹ)'], ortho: ['Orthopaedic Surgeon', 'آرتھوپیڈک سرجن'], psychiatrist: ['Psychiatrist', 'سائیکاٹرسٹ'],
    paedsurg: ['Paediatric Surgeon', 'بچوں کا سرجن'], paeds: ['Paediatrician', 'بچوں کے ڈاکٹر (پیڈیاٹریشن)'], plastic: ['Plastic Surgeon', 'پلاسٹک سرجن'],
    rheum: ['Rheumatology & General Medicine', 'ریومیٹولوجی اور جنرل میڈیسن'], sono: ['Sonologist', 'سونولوجسٹ'], uro: ['Urologist', 'یورولوجسٹ'],
    nutri: ['Nutritionist', 'نیوٹریشنسٹ'], family: ['Family Physician', 'فیملی فزیشن'], vascular: ['Vascular Surgeon', 'ویسکولر سرجن']
  };
  var SORD = Object.keys(SPEC);
  var DN = { en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ur: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'] };
  DN.ru = DN.en;
  var DS = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ur: DN.ur }; DS.ru = DS.en;
  var MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var ROLE = { fe: ['Female echocardiographer', 'خاتون ایکوکارڈیوگرافر'], me: ['Male echocardiographer', 'مرد ایکوکارڈیوگرافر'], va: ['Vaccinator', 'ویکسینیٹر'], fp: ['Female physiotherapist', 'خاتون فزیوتھراپسٹ'], mp: ['Male physiotherapist', 'مرد فزیوتھراپسٹ'] };
  var SVC = [ /* [id, [en, ur], rows: [role, days, timing, fee, flag]] */
    ['ct', ['CT Scan', 'سی ٹی اسکین'], [['', '', '', '2,000', 'ct']]],
    ['echo', ['Echocardiography', 'ایکوکارڈیوگرافی'], [['fe', '246', '04:00 PM – 07:00 PM', '3,000'], ['me', '135', '07:00 PM – 09:00 PM', '3,000']]],
    ['mammo', ['Mammography', 'میموگرافی'], [['', '6', '03:00 PM – 05:00 PM', '1,000', 'pre']]],
    ['vacc', ['Paediatric vaccination', 'بچوں کی ویکسینیشن'], [['va', '123456', '10:00 AM – 02:00 PM', '350']]],
    ['physio', ['Physiotherapy', 'فزیوتھراپی'], [['fp', '123456', '10:00 AM – 05:00 PM', '900'], ['mp', '123456', '04:00 PM – 07:00 PM', '']]]
  ];
  var T = {
    en: {
      today: 'Today', tomorrow: 'Tomorrow', fee: 'PKR', sched: "Scheduled OPD sessions from the hospital's " + SCH.label + " consultant schedule. I can't confirm that a doctor is physically present. Please confirm on UAN {uan} before visiting.",
      conf: 'Please confirm the timing before visiting (UAN {uan}).', none: 'No doctor is listed for {x} in our current OPD schedule. Please confirm on UAN {uan}.',
      nf: 'Confirmed availability information for this specialty or doctor is not in our current OPD schedule. For more information, please contact BHY Hospital UAN {uan}.',
      pre: 'pre-appointment', alt: 'alternate Sunday only – confirm which Sunday', amb: 'timing unclear in schedule – please confirm', ended: 'session ended', now: 'in session per schedule',
      old: '⚠ The schedule I have is for ' + SCH.label + ' and may be outdated. Please confirm on UAN {uan}.', noclock: "I can't reliably read today's date right now. Please contact the hospital on UAN {uan} to confirm which doctors are scheduled.",
      ask: "Type a doctor's name (e.g. Dr. Lal Kumar) or a specialty (e.g. skin specialist, heart specialist, child specialist).", multi: 'Several doctors match. Please type the full name for exact details.',
      more: '…and {n} more. Please type a more specific name.', pick: 'Choose a specialty:', menu: 'What would you like to know about doctors and OPD?',
      mb: ["Today's doctors", "Tomorrow's doctors", 'By specialty', 'By doctor name', 'OPD timings'], dept: 'Specialties in the BHY consultant schedule (number of doctors):',
      deptn: 'Each doctor has their own clinic days. Type a specialty to see days and timings.', apptH: "I can't book or confirm appointments. To book, call UAN {uan} or WhatsApp {wa}.",
      svc: 'Services in the hospital schedule:', svx: 'Other services (X-Ray, emergency, inpatient) and test prices: please confirm on UAN {uan}.',
      ct: "CT Scan is listed as '7 Days 24 Hours', but the schedule also shows 10:00 AM – 09:00 PM. Please confirm CT timing on UAN {uan}.", at: 'Fees are as listed in the schedule and may change.'
    },
    ru: {
      today: 'Aaj', tomorrow: 'Kal', fee: 'PKR', sched: "Ye hospital ke " + SCH.label + " consultant schedule ke mutabiq OPD sessions hain. Main confirm nahi kar sakta ke doctor maujood hain. Aane se pehle UAN {uan} par confirm karein.",
      conf: 'Aane se pehle timing UAN {uan} par confirm kar lein.', none: '{x} ke liye hamare current OPD schedule mein koi doctor listed nahi. UAN {uan} par confirm karein.',
      nf: 'Is specialty ki doctor availability ki confirmed information hamare current OPD schedule mein available nahi hai. Mazeed maloomat ke liye BHY Hospital UAN {uan} par rabta karein.',
      pre: 'pre-appointment', alt: 'sirf alternate Sunday – confirm karein kaun si Sunday', amb: 'schedule mein timing wazeh nahi – confirm karein', ended: 'session khatam', now: 'schedule ke mutabiq session jari',
      old: '⚠ Mere paas ' + SCH.label + ' ka schedule hai jo purana ho sakta hai. UAN {uan} par confirm karein.', noclock: 'Main abhi aaj ki date durust tareeqe se nahi parh sakta. Doctors confirm karne ke liye UAN {uan} par rabta karein.',
      ask: 'Doctor ka naam likhein (jaise Dr. Lal Kumar) ya specialty (jaise skin specialist, dil ka doctor, bachon ka doctor).', multi: 'Kai doctors match hue. Durust tafseel ke liye poora naam likhein.',
      more: '…aur {n} mazeed. Mazeed wazeh naam likhein.', pick: 'Specialty chunein:', menu: 'Doctors aur OPD ke baare mein kya janna chahte hain?',
      mb: ['Aaj ke doctors', 'Kal ke doctors', 'Specialty se', 'Doctor ke naam se', 'OPD timing'], dept: 'BHY consultant schedule ki specialties (doctors ki tadaad):',
      deptn: 'Har doctor ke clinic ke din alag hain. Din aur timing ke liye specialty likhein.', apptH: 'Main appointment book ya confirm nahi kar sakta. Appointment ke liye UAN {uan} par call karein ya WhatsApp {wa} par rabta karein.',
      svc: 'Hospital schedule ki services:', svx: 'Dusri services (X-Ray, emergency, inpatient) aur test ki qeematein: UAN {uan} par confirm karein.',
      ct: "CT Scan '7 Days 24 Hours' listed hai, lekin schedule mein 10:00 AM – 09:00 PM bhi likha hai. CT timing UAN {uan} par confirm karein.", at: 'Fees schedule ke mutabiq hain aur badal sakti hain.'
    },
    ur: {
      today: 'آج', tomorrow: 'کل', fee: 'PKR', sched: 'یہ ہسپتال کے ' + SCH.label + ' کنسلٹنٹ شیڈول کے مطابق او پی ڈی سیشن ہیں۔ میں تصدیق نہیں کر سکتا کہ ڈاکٹر موجود ہیں۔ آنے سے پہلے UAN {uan} پر تصدیق کریں۔',
      conf: 'آنے سے پہلے وقت کی تصدیق UAN {uan} پر کر لیں۔', none: '{x} کے لیے ہمارے موجودہ او پی ڈی شیڈول میں کوئی ڈاکٹر درج نہیں۔ UAN {uan} پر تصدیق کریں۔',
      nf: 'اس اسپیشلٹی کے ڈاکٹر کی دستیابی کی تصدیق شدہ معلومات ہمارے موجودہ او پی ڈی شیڈول میں موجود نہیں۔ مزید معلومات کے لیے بی ایچ وائی ہسپتال UAN {uan} پر رابطہ کریں۔',
      pre: 'پیشگی اپائنٹمنٹ', alt: 'صرف متبادل اتوار – تصدیق کریں کون سا اتوار', amb: 'شیڈول میں وقت واضح نہیں – تصدیق کریں', ended: 'سیشن ختم', now: 'شیڈول کے مطابق سیشن جاری',
      old: '⚠ میرے پاس ' + SCH.label + ' کا شیڈول ہے جو پرانا ہو سکتا ہے۔ UAN {uan} پر تصدیق کریں۔', noclock: 'میں ابھی آج کی تاریخ درست طور پر نہیں پڑھ سکتا۔ ڈاکٹروں کی تصدیق کے لیے UAN {uan} پر رابطہ کریں۔',
      ask: 'ڈاکٹر کا نام لکھیں (جیسے Dr. Lal Kumar) یا اسپیشلٹی (جیسے جلد کا ماہر، دل کا ڈاکٹر، بچوں کا ڈاکٹر)۔', multi: 'کئی ڈاکٹر مل گئے۔ درست تفصیل کے لیے پورا نام لکھیں۔',
      more: '…اور {n} مزید۔ مزید واضح نام لکھیں۔', pick: 'اسپیشلٹی چنیں:', menu: 'ڈاکٹروں اور او پی ڈی کے بارے میں کیا جاننا چاہتے ہیں؟',
      mb: ['آج کے ڈاکٹر', 'کل کے ڈاکٹر', 'اسپیشلٹی سے', 'ڈاکٹر کے نام سے', 'او پی ڈی اوقات'], dept: 'بی ایچ وائی کنسلٹنٹ شیڈول کی اسپیشلٹیز (ڈاکٹروں کی تعداد):',
      deptn: 'ہر ڈاکٹر کے کلینک کے دن الگ ہیں۔ دن اور وقت کے لیے اسپیشلٹی لکھیں۔', apptH: 'میں اپائنٹمنٹ بک یا کنفرم نہیں کر سکتا۔ اپائنٹمنٹ کے لیے UAN {uan} پر کال کریں یا واٹس ایپ {wa} پر رابطہ کریں۔',
      svc: 'ہسپتال شیڈول کی خدمات:', svx: 'دیگر خدمات (ایکس رے، ایمرجنسی، ان پیشنٹ) اور ٹیسٹ کی قیمتیں: UAN {uan} پر تصدیق کریں۔',
      ct: "سی ٹی اسکین '7 Days 24 Hours' درج ہے، لیکن شیڈول میں 10:00 AM – 09:00 PM بھی لکھا ہے۔ سی ٹی کا وقت UAN {uan} پر تصدیق کریں۔", at: 'فیس شیڈول کے مطابق ہے اور بدل سکتی ہے۔'
    }
  };

  T.en.wd = 'website shows different days/timing – please confirm'; T.ru.wd = 'website par din/timing mukhtalif hain – confirm karein'; T.ur.wd = 'ویب سائٹ پر دن/وقت مختلف ہیں – تصدیق کریں';
  T.en.wx = 'Also listed on the website but not in the schedule file (please confirm):'; T.ru.wx = 'Website par bhi listed hain lekin schedule file mein nahi (confirm karein):'; T.ur.wx = 'ویب سائٹ پر درج ہیں لیکن شیڈول فائل میں نہیں (تصدیق کریں):';
  T.en.q = 'Qualifications (website)'; T.ru.q = 'Qualifications (website)'; T.ur.q = 'قابلیت (ویب سائٹ)';
  T.en.ws = 'Website category'; T.ru.ws = 'Website par category'; T.ur.ws = 'ویب سائٹ پر زمرہ';
  T.en.pf = 'Website profile'; T.ru.pf = 'Website profile'; T.ur.pf = 'ویب سائٹ پروفائل';
  T.en.wt = 'Website timing'; T.ru.wt = 'Website par timing'; T.ur.wt = 'ویب سائٹ پر وقت';
  T.en.sp = 'website spelling'; T.ru.sp = 'website par spelling'; T.ur.sp = 'ویب سائٹ پر ہجے';
  T.en.nmn = "The website name differs from the schedule file ('{x}'). Please confirm with the hospital whether this is the same doctor."; T.ru.nmn = "Website par naam schedule file ('{x}') se mukhtalif hai. Hospital se confirm karein ke ye wahi doctor hain ya nahi."; T.ur.nmn = "ویب سائٹ پر نام شیڈول فائل ('{x}') سے مختلف ہے۔ ہسپتال سے تصدیق کریں کہ یہ وہی ڈاکٹر ہیں یا نہیں۔";
  T.en.pt = "Website's Sunday consultant OPD poster (department-level time ranges, not each doctor's own timing):"; T.ru.pt = "Website ka Sunday consultant OPD poster (department ke time ranges, har doctor ki apni timing nahi):"; T.ur.pt = 'ویب سائٹ کا اتوار کنسلٹنٹ او پی ڈی پوسٹر (شعبے کے اوقات، ہر ڈاکٹر کا اپنا وقت نہیں):';
  T.en.nmn2 = "The website lists a doctor as '{x}' (name differs from the schedule file; please confirm whether this is the same doctor)."; T.ru.nmn2 = "Website par '{x}' naam se doctor listed hain (schedule file se naam mukhtalif; confirm karein ke wahi doctor hain ya nahi)."; T.ur.nmn2 = "ویب سائٹ پر '{x}' کے نام سے ڈاکٹر درج ہیں (شیڈول فائل سے نام مختلف؛ تصدیق کریں کہ یہ وہی ڈاکٹر ہیں یا نہیں)۔";
  T.en.deptx = '* Listed in the schedule file but not in the website department list.'; T.ru.deptx = '* Schedule file mein hai lekin website ke department list mein nahi.'; T.ur.deptx = '* شیڈول فائل میں ہے لیکن ویب سائٹ کی شعبہ فہرست میں نہیں۔';
  T.en.ct = "CT Scan is published as available 24/7 on the website. The schedule file lists '7 Days 24 Hours' but also shows 10:00 AM – 09:00 PM, so please confirm CT availability on UAN {uan} before visiting.";
  T.ru.ct = "CT Scan service BHY Hospital mein 24/7 available published hai. Schedule file mein 10:00 AM – 09:00 PM bhi likha hai, is liye visit se pehle UAN {uan} par availability confirm kar lein.";
  T.ur.ct = "سی ٹی اسکین کی سروس ویب سائٹ پر 24/7 دستیاب شائع کی گئی ہے۔ شیڈول فائل میں 10:00 AM – 09:00 PM بھی لکھا ہے، اس لیے آنے سے پہلے UAN {uan} پر دستیابی کی تصدیق کر لیں۔";
  A.welcome = {
    en: "Assalam-o-Alaikum! Welcome to BHY Hospital. I am your virtual assistant. You can ask me about doctors' OPD timings, departments, hospital services and general information. I am here to help!",
    ru: "Assalam-o-Alaikum! BHY Hospital mein khush aamdeed. Main aapka virtual assistant hoon. Aap doctors ki OPD timings, departments, hospital services aur general information ke hawale se mujhse sawal kar sakte hain. Main aapki madad ke liye hazir hoon!",
    ur: "السلام علیکم! بی ایچ وائی ہسپتال میں خوش آمدید۔ میں آپ کا ورچوئل اسسٹنٹ ہوں۔ آپ ڈاکٹروں کے او پی ڈی اوقات، شعبوں، ہسپتال کی خدمات اور عمومی معلومات کے بارے میں مجھ سے سوال کر سکتے ہیں۔ میں آپ کی مدد کے لیے حاضر ہوں!"
  };
  A.about = {
    en: "Begum Haji Yousuf Hospital (BHY Hospital) is a project of Jamiyat Punjabi Saudagran-e-Delhi Karachi (JPSD) and is managed by the B.H.Y. Hospital Management Board. Website: {web}",
    ru: "Begum Haji Yousuf Hospital (BHY Hospital) Jamiyat Punjabi Saudagran-e-Delhi Karachi (JPSD) ka project hai aur B.H.Y. Hospital Management Board ke zer-e-intezam chalta hai. Website: {web}",
    ur: "بیگم حاجی یوسف ہسپتال (بی ایچ وائی ہسپتال) جمعیت پنجابی سوداگران دہلی کراچی (JPSD) کا منصوبہ ہے اور بی ایچ وائی ہسپتال مینجمنٹ بورڈ کے زیرِ انتظام ہے۔ ویب سائٹ: {web}"
  };
  A.confirm = {
    en: "Confirmed details for this are not available in this chatbot. Please contact BHY Hospital on UAN {uan}.",
    ru: "Is information ki confirmed details hamare chatbot ke paas available nahi hain. Barah-e-karam BHY Hospital UAN {uan} par rabta karein.",
    ur: "اس معلومات کی تصدیق شدہ تفصیل ہمارے چیٹ بوٹ کے پاس موجود نہیں۔ براہِ کرم بی ایچ وائی ہسپتال UAN {uan} پر رابطہ کریں۔"
  };
  A.emergency = {
    en: "This may be an emergency. Please do not wait for this chat or a routine OPD appointment: go to the nearest hospital emergency department or call your local emergency service right now. I can't assess symptoms.\nBHY Hospital: UAN {uan} / Phone {ph}",
    ru: "Ye emergency ho sakti hai. Chat ya routine OPD appointment ka intezar na karein: foran qareebi hospital ki emergency mein jayein ya local emergency service ko call karein. Main alamaat ka jaiza nahi le sakta.\nBHY Hospital: UAN {uan} / Phone {ph}",
    ur: "یہ ہنگامی صورتحال ہو سکتی ہے۔ اس چیٹ یا معمول کی او پی ڈی اپائنٹمنٹ کا انتظار نہ کریں: فوراً قریبی ہسپتال کی ایمرجنسی میں جائیں یا مقامی ایمرجنسی سروس کو کال کریں۔ میں علامات کا جائزہ نہیں لے سکتا۔\nبی ایچ وائی ہسپتال: UAN {uan} / فون {ph}"
  };
  A.vaccine = {
    en: "Please note: the regular paediatric vaccination clinic (listed above) is different from the birth-dose vaccination. Hospital information states birth-dose vaccination is available 24 hours a day, 7 days a week. For stock or current arrangements, please confirm on UAN {uan} before visiting.",
    ru: "Note: regular paediatric vaccination clinic (upar listed) aur birth-dose vaccination alag hain. Hospital ki maloomat ke mutabiq birth-dose vaccination 24 ghante, hafte ke saaton din available hai. Stock ya mojooda intezam ke liye aane se pehle UAN {uan} par confirm karein.",
    ur: "نوٹ: بچوں کی باقاعدہ ویکسینیشن کلینک (اوپر درج) اور پیدائش کے وقت کی (برتھ ڈوز) ویکسینیشن الگ ہیں۔ ہسپتال کی معلومات کے مطابق برتھ ڈوز ویکسینیشن 24 گھنٹے، ہفتے کے ساتوں دن دستیاب ہے۔ اسٹاک یا موجودہ انتظامات کے لیے آنے سے پہلے UAN {uan} پر تصدیق کریں۔"
  };
  A.appt = {
    en: "I provide information only and can't book appointments or confirm availability. The hospital website has no online booking or enquiry form, so please call UAN {uan} or message WhatsApp {wa}.\n{waLink}\nDoctors marked [pre-appointment] in the schedule need an appointment in advance.",
    ru: "Main sirf maloomat deta hun, appointment book ya confirm nahi kar sakta. Hospital website par online booking ya enquiry form nahi hai, is liye UAN {uan} par call karein ya WhatsApp {wa} par rabta karein.\n{waLink}\nJin doctors ke saath [pre-appointment] likha ho unke liye pehle se appointment zaroori hai.",
    ur: "میں صرف معلومات فراہم کرتا ہوں، اپائنٹمنٹ بک یا کنفرم نہیں کر سکتا۔ ہسپتال کی ویب سائٹ پر آن لائن بکنگ یا انکوائری فارم نہیں ہے، اس لیے UAN {uan} پر کال کریں یا واٹس ایپ {wa} پر رابطہ کریں۔\n{waLink}\nجن ڈاکٹروں کے ساتھ [پیشگی اپائنٹمنٹ] لکھا ہو ان کے لیے پہلے سے اپائنٹمنٹ ضروری ہے۔"
  };
  A.welcomeOLD = {
    en: "Assalam-o-Alaikum! I'm the BHY Hospital information assistant (not a doctor). I can help with doctors' OPD days and timings, specialties, contact details and services. Pick an option or type your question, e.g. \"Who is the cardiologist?\" or \"Today's doctors\".",
    ru: "Assalam-o-Alaikum! Main BHY Hospital ka information assistant hun (doctor nahi). Main doctors ke OPD din aur timing, specialties, rabta aur services ke baare mein bata sakta hun. Option chunein ya sawal likhein, jaise \"Dil ka doctor kaun hai?\" ya \"Aaj kaun se doctors hain?\".",
    ur: "السلام علیکم! میں بی ایچ وائی ہسپتال کا انفارمیشن اسسٹنٹ ہوں (ڈاکٹر نہیں)۔ میں ڈاکٹروں کے او پی ڈی دن اور اوقات، اسپیشلٹیز، رابطہ اور خدمات کے بارے میں مدد کر سکتا ہوں۔ آپشن چنیں یا سوال لکھیں، جیسے \"دل کے ڈاکٹر کون ہیں؟\" یا \"آج کون سے ڈاکٹر ہیں؟\""
  };
  A.fee = {
    en: "Consultation fees are listed per doctor in the schedule. Ask for a doctor or specialty (e.g. \"Dr. Lal Kumar fee\" or \"cardiologist fee\"). For lab, admission, dialysis or other charges, please call UAN {uan}.",
    ru: "Consultation fees schedule mein har doctor ke saath listed hain. Doctor ya specialty ka naam likhein (jaise \"Dr. Lal Kumar fee\" ya \"cardiologist fee\"). Lab, admission, dialysis ya dusre charges ke liye UAN {uan} par call karein.",
    ur: "کنسلٹیشن فیس شیڈول میں ہر ڈاکٹر کے ساتھ درج ہے۔ ڈاکٹر یا اسپیشلٹی کا نام لکھیں (جیسے \"Dr. Lal Kumar fee\")۔ لیب، داخلہ، ڈائیلاسز یا دیگر چارجز کے لیے UAN {uan} پر کال کریں۔"
  };

  /* ---------- helpers ---------- */
  var g = function (s, x) { return f(s.replace('{x}', x || '')); };
  var lab = function (id, l) { return SPEC[id][l === 'ur' ? 1 : 0]; };
  var pos = function (d) { return (d + 6) % 7; };
  function nowPK() {
    try {
      if (window.__bhyNow) return window.__bhyNow;
      var o = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
      var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
      if (!(+o.year > 2000) || wd < 0) return null;
      return { y: +o.year, m: +o.month, d: +o.day, wd: wd, min: (+o.hour % 24) * 60 + +o.minute };
    } catch (e) { return null; }
  }
  function addDay(n) { var t = new Date(Date.UTC(n.y, n.m - 1, n.d + 1)); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), wd: t.getUTCDay() }; }
  function stale(n) { return !!n && (n.y !== SCH.y || n.m !== SCH.m); }
  function fd(s, l) {
    var a = [1, 2, 3, 4, 5, 6, 0].filter(function (d) { return s.indexOf(d) > -1; }), out = [], i = 0, j, k, n = DS[l];
    while (i < a.length) {
      j = i; while (j + 1 < a.length && pos(a[j + 1]) === pos(a[j]) + 1) j++;
      if (j - i >= 2) out.push(n[a[i]] + '–' + n[a[j]]); else for (k = i; k <= j; k++) out.push(n[a[k]]);
      i = j + 1;
    }
    return out.join(', ');
  }
  function flagTxt(x, l) { var t = T[l], s = '', fl = x[5]; if (fl.indexOf('p') > -1) s += ' [' + t.pre + ']'; if (fl.indexOf('a') > -1) s += ' [' + t.alt + ']'; if (fl.indexOf('x') > -1) s += ' [' + t.amb + ']'; return s; }
  function ss(x, l) { var s = fd(x[0], l) + ' · ' + x[1]; if (x[4]) s += ' · ' + T[l].fee + ' ' + x[4]; if (x[6]) s += ' · ' + x[6]; return s + flagTxt(x, l); }
  var plain = function (n) { return n.toLowerCase().replace(/prof\.|dr\.|ms\.|[^a-z]/g, ''); };
  function tagW(name, days, l) { var w = DW[name]; if (!w) return ''; for (var i = 0; i < days.length; i++) if (w.indexOf(days[i]) > -1) return ' [' + T[l].wd + ']'; return ''; }
  function extra(d, l) {
    var w = WBY[d[0]], s = '';
    if (w) {
      if (w[3]) s += '\n' + T[l].q + ': ' + w[3];
      if (w[2] !== d[1]) s += '\n' + T[l].ws + ': ' + lab(w[2], l);
      if (plain(w[1]) !== plain(d[0])) s += '\n(' + T[l].sp + ': ' + w[1] + ')';
      s += '\n' + T[l].pf + ': https://bhyhospital.vercel.app/doctors/' + w[0];
    }
    if (WNM[d[0]]) s += '\n' + g(T[l].nmn2, WNM[d[0]][1]);
    if (WEBX.some(function (x) { return x[0] === d[0]; })) s += '\n[' + T[l].wd + ']';
    var cov = d[2].map(function (x) { return x[0]; }).join(''), dw = DW[d[0]] || '';
    for (var i = 0; i < dw.length; i++) if (cov.indexOf(dw[i]) < 0) { s += '\n[' + T[l].wd + ']'; break; }
    return s;
  }
  function sess(d, l) { return d[2].map(function (x) { return '• ' + ss(x, l) + tagW(d[0], x[0], l); }).join('\n'); }
  function cardNS(d, l) { return '**' + d[0] + '**\n' + sess(d, l) + extra(d, l); }
  function card(d, l) { return '**' + d[0] + '** — ' + lab(d[1], l) + '\n' + sess(d, l) + extra(d, l); }
  function webCard(w, l) {
    var d = DOCS.filter(function (x) { return x[0] === w[5]; })[0];
    return '**' + w[1] + '** — ' + lab(w[2], l) + ' (' + T[l].pf + ')' + (w[3] ? '\n' + T[l].q + ': ' + w[3] : '') + '\n' +
      w[6].map(function (s) { return '• ' + T[l].wt + ': ' + (s[0] ? fd(s[0], l) + ' · ' : '') + s[1] + (s[3] ? ' · ' + s[3] : '') + (s[2].indexOf('p') > -1 ? ' [' + T[l].pre + ']' : ''); }).join('\n') +
      '\n' + g(T[l].nmn, w[5]) + '\n' + T[l].pf + ': https://bhyhospital.vercel.app/doctors/' + w[0];
  }
  function webx(wd, ids, l) {
    var r = WEBX.filter(function (x) { if (x[1].indexOf(wd) < 0) return false; if (!ids) return true; var d = DOCS.filter(function (y) { return y[0] === x[0]; })[0]; return d && ids.indexOf(d[1]) > -1; });
    return r.length ? '\n\n' + T[l].wx + '\n' + r.map(function (x) { return '• ' + x[0] + ' — ' + x[2]; }).join('\n') : '';
  }
  function poster(l) { return '\n\n' + T[l].pt + '\n' + POSTER.map(function (p) { return '• ' + lab(p[0], l) + (p[0] === 'sono' ? ' (female)' : '') + ': ' + p[1]; }).join('\n'); }
  function warn(l) { var n = nowPK(); return stale(n) ? g(T[l].old) + '\n\n' : ''; }
  function specView(ids, l) {
    return warn(l) + ids.map(function (id) { return '**' + lab(id, l) + ' – BHY Hospital**\n\n' + DOCS.filter(function (d) { return d[1] === id; }).map(function (d) { return cardNS(d, l); }).join('\n\n'); }).join('\n\n') + '\n\n' + g(T[l].conf) + '\n' + T[l].at;
  }
  function dayView(wd, ids, l, dt, nm) {
    var G = {}, seen = {}, t = T[l], pre = warn(l);
    DOCS.forEach(function (d) {
      if (ids && ids.indexOf(d[1]) < 0) return;
      d[2].forEach(function (x) { if (x[0].indexOf(wd) > -1) { (G[d[1]] = G[d[1]] || []).push([d, x]); seen[d[0]] = 1; } });
    });
    var head = dt ? (dt.isToday ? t.today : t.tomorrow) + ' – ' + DN[l][wd] + ', ' + dt.d + ' ' + MN[dt.m - 1] + ' ' + dt.y : DN[l][wd];
    if (ids) head = ids.map(function (i) { return lab(i, l); }).join(' / ') + ' – ' + head;
    var keys = SORD.filter(function (k) { return G[k]; });
    if (!keys.length) return pre + '**' + head + '**\n\n' + g(t.none, ids ? ids.map(function (i) { return lab(i, l); }).join(' / ') + ' (' + DN[l][wd] + ')' : DN[l][wd]);
    var body = keys.map(function (k) {
      return (keys.length > 1 ? '**' + lab(k, l) + '**\n' : '') + G[k].map(function (p) {
        var x = p[1], st = '';
        if (nm != null && x[2] >= 0) st = nm >= x[3] ? ' [' + t.ended + ']' : (nm >= x[2] ? ' [' + t.now + ']' : '');
        return '• ' + p[0][0] + ' — ' + x[1] + (x[6] ? ' · ' + x[6] : '') + flagTxt(x, l) + tagW(p[0][0], String(wd), l) + st;
      }).join('\n');
    }).join('\n\n');
    return pre + '**' + head + '** (' + Object.keys(seen).length + ' ' + (l === 'ur' ? 'ڈاکٹر' : 'doctors') + ')\n\n' + body + webx(wd, ids, l) + (wd === 0 && !ids ? poster(l) : '') + '\n\n' + g(t.sched);
  }
  function svcText(only, l) {
    var t = T[l], out = [];
    SVC.forEach(function (s) {
      if (only && only.indexOf(s[0]) < 0) return;
      var rows = s[2].map(function (r) {
        var p = (r[0] ? ROLE[r[0]][l === 'ur' ? 1 : 0] + ': ' : '') + (r[1] ? fd(r[1], l) + ' · ' : '') + r[2] + (r[3] ? (r[2] ? ' · ' : '') + t.fee + ' ' + r[3] : '');
        if (r[4] === 'pre') p += ' [' + t.pre + ']';
        if (r[4] === 'ct') p = (l === 'ur' ? 'فیس: ' : 'Fee: ') + p + '\n' + g(t.ct);
        return '• ' + p;
      });
      out.push('**' + s[1][l === 'ur' ? 1 : 0] + '**\n' + rows.join('\n'));
    });
    return out.join('\n\n');
  }

  /* ---------- search: doctor names, specialties, days, services ---------- */
  function nrm(w) { return w.toLowerCase().replace(/[^a-z]/g, '').replace(/sheikh|shaikh|sheik/g, 'shaikh').replace(/(.)\1/g, '$1').replace(/^moh?[ua]?m+[ua]?d$/, 'muhammad'); }
  var NT = DOCS.map(function (d) { return d[0].split(/[\s.\-]+/).map(nrm).filter(function (w) { return w.length >= 3 && w !== 'dr'; }); });
  var NTW = WEB.map(function (w) { return w[1].split(/[\s.\-]+/).map(nrm).filter(function (x) { return x.length >= 3 && x !== 'dr' && x !== 'prof'; }); });
  function hit(q, nt) { var n = 0, used = {}; q.forEach(function (w) { if (used[w]) return; if (nt.some(function (x) { return x === w || (w.length >= 4 && x.indexOf(w) === 0); })) { n++; used[w] = 1; } }); return n; }
  function findAll(text) {
    var q = text.toLowerCase().replace(/begum\s+haji\s+yousuf|b\.?\s?h\.?\s?y\.?/g, ' ').match(/[a-z]{3,}/g) || [];
    q = q.map(nrm).filter(function (w) { return w.length >= 3 && w !== 'doctor' && w !== 'hospital' && w !== 'doctors' && w !== 'prof'; });
    var out = { docs: [], webs: [] }; if (!q.length) return out;
    var sd = DOCS.map(function (d, i) {
      var s = hit(q, NT[i]), w = WBY[d[0]]; if (w) s = Math.max(s, hit(q, NTW[WEB.indexOf(w)])); return s;
    });
    var sw = WEB.map(function (w, i) { return w[4] === 'nm' ? hit(q, NTW[i]) : 0; });
    var best = Math.max.apply(null, sd.concat(sw)); if (!best) return out;
    DOCS.forEach(function (d, i) { if (sd[i] === best) out.docs.push(d); });
    WEB.forEach(function (w, i) { if (sw[i] === best) out.webs.push(w); });
    out.webs.forEach(function (w) { var d = DOCS.filter(function (x) { return x[0] === w[5]; })[0]; if (d && out.docs.indexOf(d) < 0) out.docs.push(d); });
    out.docs.forEach(function (d) { var w = WNM[d[0]]; if (w && out.webs.indexOf(w) < 0) out.webs.push(w); });
    return out;
  }
  var ALI = [
    ['cardiolog', ['cardio']], ['cardiac', ['cardio']], ['heart', ['cardio']], ['dil', ['cardio']], ['دل', ['cardio']], ['ہارٹ', ['cardio']], ['کارڈیو', ['cardio']],
    ['chest', ['chest']], ['pulmon', ['chest']], ['lung', ['chest']], ['seena', ['chest']], ['seene', ['chest']], ['سینے', ['chest']], ['پھیپھڑ', ['chest']], ['چیسٹ', ['chest']],
    ['psycholog', ['clinpsy']], ['counsel', ['clinpsy']], ['سائیکالوجسٹ', ['clinpsy']], ['کلینیکل', ['clinpsy']],
    ['dermatolog', ['derm']], ['skin', ['derm']], ['jild', ['derm']], ['جلد', ['derm']], ['چمڑی', ['derm']], ['ڈرمیٹ', ['derm']],
    ['diabet', ['diab']], ['endocrin', ['diab']], ['sugar', ['diab']], ['shugar', ['diab']], ['thyroid', ['diab']], ['ذیابیطس', ['diab']], ['شوگر', ['diab']],
    ['dental', ['dental', 'maxfac']], ['dentist', ['dental', 'maxfac']], ['dant', ['dental', 'maxfac']], ['daant', ['dental', 'maxfac']], ['دانت', ['dental', 'maxfac']], ['ڈینٹ', ['dental', 'maxfac']],
    ['dental surgeon', ['dental']], ['maxillofacial', ['maxfac']], ['jaw', ['maxfac']],
    ['ent', ['ent']], ['ear', ['ent']], ['nose', ['ent']], ['throat', ['ent']], ['kaan', ['ent']], ['naak', ['ent']], ['gala', ['ent']], ['کان', ['ent']], ['ناک', ['ent']], ['گلا', ['ent']], ['ای این ٹی', ['ent']],
    ['gastro', ['gastro']], ['stomach', ['gastro']], ['pait', ['gastro']], ['meda', ['gastro']], ['liver', ['gastro']], ['معدہ', ['gastro']], ['معدے', ['gastro']], ['پیٹ', ['gastro']], ['جگر', ['gastro']], ['گیسٹرو', ['gastro']],
    ['surgeon', ['gensurg']], ['ent surgeon', ['ent']], ['ent specialist', ['ent']], ['eye surgeon', ['eye']], ['eye specialist', ['eye']], ['bone surgeon', ['ortho']], ['bone specialist', ['ortho']], ['surgery', ['gensurg']], ['laparoscop', ['gensurg']], ['سرجن', ['gensurg']], ['سرجری', ['gensurg']],
    ['physician', ['genphys', 'family']], ['general physician', ['genphys']], ['general doctor', ['genphys']], ['general medicine', ['genphys', 'rheum']], ['فزیشن', ['genphys', 'family']], ['جنرل فزیشن', ['genphys']], ['جنرل ڈاکٹر', ['genphys']],
    ['family physician', ['family']], ['family doctor', ['family']], ['فیملی', ['family']],
    ['gynaecolog', ['gynae']], ['gynecolog', ['gynae']], ['gynae', ['gynae']], ['gynec', ['gynae']], ['obstetric', ['gynae']], ['women', ['gynae']], ['ladies', ['gynae']], ['lady doctor', ['gynae']], ['pregnan', ['gynae']], ['zachgi', ['gynae']], ['khawateen', ['gynae']], ['خواتین', ['gynae']], ['گائنی', ['gynae']], ['گائنا', ['gynae']], ['زچگی', ['gynae']], ['لیڈی ڈاکٹر', ['gynae']], ['عورتوں', ['gynae']],
    ['nephrolog', ['nephro']], ['kidney', ['nephro']], ['gurda', ['nephro']], ['gurde', ['nephro']], ['گردے', ['nephro']], ['گردہ', ['nephro']], ['نیفرو', ['nephro']],
    ['neuro', ['neurophys', 'neurosurg']], ['neurolog', ['neurophys']], ['neuro physician', ['neurophys']], ['nerve', ['neurophys']], ['brain', ['neurophys']], ['dimagh', ['neurophys']], ['اعصاب', ['neurophys']], ['دماغ', ['neurophys']], ['نیورو', ['neurophys', 'neurosurg']], ['نیورولوجسٹ', ['neurophys']],
    ['neurosurgeon', ['neurosurg']], ['neuro surgeon', ['neurosurg']], ['brain surgeon', ['neurosurg']], ['نیورو سرجن', ['neurosurg']],
    ['ophthalm', ['eye']], ['opthalm', ['eye']], ['eye', ['eye']], ['aankh', ['eye']], ['ankh', ['eye']], ['آنکھ', ['eye']], ['آنکھوں', ['eye']],
    ['orthopaed', ['ortho']], ['orthopedic', ['ortho']], ['ortho', ['ortho']], ['bone', ['ortho']], ['haddi', ['ortho']], ['ہڈی', ['ortho']], ['ہڈیوں', ['ortho']], ['آرتھو', ['ortho']],
    ['psychiatr', ['psychiatrist']], ['mental', ['psychiatrist']], ['سائیکاٹر', ['psychiatrist']], ['نفسیات', ['psychiatrist', 'clinpsy']], ['نفسیاتی', ['psychiatrist', 'clinpsy']],
    ['paediatric surgeon', ['paedsurg']], ['pediatric surgeon', ['paedsurg']], ['child surgeon', ['paedsurg']], ['بچوں کا سرجن', ['paedsurg']],
    ['paediatric', ['paeds']], ['pediatric', ['paeds']], ['paeds', ['paeds']], ['child', ['paeds']], ['children', ['paeds']], ['bachon', ['paeds']], ['bachay', ['paeds']], ['bacha', ['paeds']], ['bache', ['paeds']], ['بچوں', ['paeds']], ['بچے', ['paeds']], ['بچہ', ['paeds']], ['پیڈیا', ['paeds']],
    ['plastic', ['plastic']], ['cosmetic', ['plastic']], ['پلاسٹک', ['plastic']],
    ['rheumat', ['rheum']], ['arthritis', ['rheum']], ['ریومیٹ', ['rheum']],
    ['sonolog', ['sono']], ['sonograph', ['sono']], ['ultrasound', ['sono']], ['ultra sound', ['sono']], ['sono', ['sono']], ['الٹراساؤنڈ', ['sono']], ['سونو', ['sono']],
    ['urolog', ['uro']], ['urine', ['uro']], ['peshab', ['uro']], ['پیشاب', ['uro']], ['یورو', ['uro']],
    ['nutrition', ['nutri']], ['dietitian', ['nutri']], ['dietician', ['nutri']], ['diet', ['nutri']], ['خوراک', ['nutri']], ['ڈائٹ', ['nutri']],
    ['vascular', ['vascular']], ['vein', ['vascular']], ['varicose', ['vascular']], ['ویسکولر', ['vascular']]
  ];
  function findSpec(text) {
    var t = text.toLowerCase().replace(/[؟،۔؛?!.,:;()]/g, ' '), tk = tokens(t), best = 0, ids = null;
    ALI.forEach(function (a) {
      var k = a[0], hit = k.length <= 3 ? tk.indexOf(k) > -1 : t.indexOf(k) > -1;
      if (hit && k.length >= best) { best = k.length; ids = a[1]; }
    });
    return ids;
  }
  var DAYW = { 1: ['monday', 'mon', 'somwar', 'peer', 'پیر', 'سوموار'], 2: ['tuesday', 'tue', 'tues', 'mangal', 'منگل'], 3: ['wednesday', 'wed', 'budh', 'بدھ'], 4: ['thursday', 'thu', 'thur', 'thurs', 'jumerat', 'jumeraat', 'جمعرات'], 5: ['friday', 'fri', 'jumma', 'juma', 'جمعہ', 'جمعے'], 6: ['saturday', 'sat', 'ہفتہ'], 0: ['sunday', 'sun', 'itwar', 'ittwar', 'اتوار'] };
  function findDay(text) {
    var tk = tokens(text.toLowerCase().replace(/[؟،۔؛]/g, ' '));
    for (var d in DAYW) if (DAYW[d].some(function (w) { return tk.indexOf(w) > -1; })) return +d;
    if (tk.some(function (w) { return ['today', 'aaj', 'آج', 'tonight'].indexOf(w) > -1; })) return 'today';
    if (tk.some(function (w) { return ['tomorrow', 'tomorow', 'kal', 'کل'].indexOf(w) > -1; })) return 'tomorrow';
    return null;
  }
  function findSvc(text) {
    var t = text.toLowerCase(), tk = tokens(t);
    if (/ct scan|ctscan|سی ٹی/.test(t) || tk.indexOf('ct') > -1) return ['ct'];
    if (/echo|ایکو/.test(t)) return ['echo'];
    if (/mammograph|میمو/.test(t)) return ['mammo'];
    if (/physio|فزیو/.test(t)) return ['physio'];
    return null;
  }

  /* ---------- responders ---------- */
  var S = function (id) { return function (l) { return f(A[id][l]); }; };
  var optsFor = function (l, codes) { var m = { today: 0, tomorrow: 1, spec: 2, name: 3, opd: 4 }; return codes.map(function (c) { return [T[l].mb[m[c]], c]; }); };
  function dayResp(which, ids, l) {
    var n = nowPK(); if (!n) return g(T[l].noclock);
    var dt = which === 'today' ? { y: n.y, m: n.m, d: n.d, wd: n.wd, isToday: true } : (function (a) { a.isToday = false; return a; })(addDay(n));
    return dayView(dt.wd, ids, l, dt, which === 'today' ? n.min : null);
  }
  function H(c) {
    if (c === 'today' || c === 'tomorrow') return function (l) { return dayResp(c, null, l); };
    if (c === 'docs') return function (l) { return { t: T[l].menu, o: optsFor(l, ['today', 'tomorrow', 'spec', 'name', 'opd']) }; };
    if (c === 'spec') return function (l) { return { t: T[l].pick, o: SORD.map(function (id) { return [lab(id, l), 'sp:' + id]; }) }; };
    if (c.indexOf('sp:') === 0) return function (l) { return specView([c.slice(3)], l); };
    if (c === 'name') return function (l) { return T[l].ask; };
    if (c === 'opd') return function (l) { return { t: f(A.opd[l]), o: optsFor(l, ['today', 'tomorrow', 'spec']) }; };
    if (c === 'dept') return function (l) {
      return { t: '**' + T[l].dept + '**\n' + SORD.map(function (id) { return '• ' + lab(id, l) + (id === 'rheum' ? ' *' : '') + ' (' + DOCS.filter(function (d) { return d[1] === id; }).length + ')'; }).join('\n') + '\n' + T[l].deptx + '\n\n' + T[l].deptn, o: optsFor(l, ['spec']) };
    };
    if (c === 'services') return function (l) { return '**' + T[l].svc + '**\n\n' + svcText(null, l) + '\n\n' + T[l].at + '\n' + g(T[l].svx); };
    if (c === 'vaccine') return function (l) { return svcText(['vacc'], l) + '\n\n' + f(A.vaccine[l]); };
    return S(c);
  }
  var APPT = ['appointment', 'apointment', 'book', 'اپائنٹمنٹ', 'بکنگ'];
  function route(text) {
    var id = match(text), low = text.toLowerCase();
    if (['emergency', 'confirm', 'vaccine', 'medical'].indexOf(id) > -1) {
      if (id === 'medical') return function (l) { return { t: f(A.medical[l]), o: optsFor(l, ['spec']) }; };
      return H(id);
    }
    var wantsAppt = APPT.some(function (k) { return low.indexOf(k) > -1; });
    var tail = function (l) { return wantsAppt ? '\n\n' + g(T[l].apptH) : ''; };
    var D = findDay(text), fa = findAll(text), docs = fa.docs;
    if (docs.length) {
      return function (l) {
        var shown = docs.slice(0, 6), r = warn(l) + shown.map(function (d) { return card(d, l); }).join('\n\n');
        r += fa.webs.map(function (w) { return '\n\n' + webCard(w, l); }).join('');
        if (docs.length > 1) r += '\n\n' + T[l].multi;
        if (docs.length > 6) r += ' ' + g(T[l].more.replace('{n}', docs.length - 6));
        return r + '\n\n' + g(T[l].conf) + tail(l);
      };
    }
    var ids = findSpec(text);
    if (ids) {
      return function (l) {
        if (D === null) return specView(ids, l) + tail(l);
        if (D === 'today' || D === 'tomorrow') return dayResp(D, ids, l) + tail(l);
        return dayView(D, ids, l, null, null) + tail(l);
      };
    }
    var sv = findSvc(text);
    if (sv) return function (l) { return svcText(sv, l) + '\n\n' + T[l].at + tail(l); };
    if (D !== null) return function (l) { return (D === 'today' || D === 'tomorrow') ? dayResp(D, null, l) : dayView(D, null, l, null, null); };
    var nm = low.match(/\b(?:dr|ms)\.?\s*([a-z]{3,})/);
    if (nm && ROMAN.indexOf(nm[1]) < 0 && ENG.indexOf(nm[1]) < 0) return function (l) { return { t: g(T[l].nf), o: optsFor(l, ['spec', 'name']) }; };
    if (id === 'doctor') return H('docs');
    if (id === 'about') return S('about');
    if (id === 'opd') return H('opd');
    if (id === 'dept') return H('dept');
    if (id === 'services') return H('services');
    if (id === 'fallback') return function (l) { var dr = /doctor|specialist|consultant|\bdr\b|ologist|iatrist|ician|surgeon|ڈاکٹر|ماہر|daktar/.test(low); return { t: dr ? g(T[l].nf) : f(A.fallback[l]), o: optsFor(l, ['spec', 'name']) }; };
    return S(id);
  }

  /* ---------- UI ---------- */
  var host = document.createElement('div'); host.id = 'bhy-chatbot';
  host.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;margin:0;padding:0;border:0;overflow:visible;display:block;z-index:2147483000';
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML = '<style>' +
    ':host{all:initial;--blue:#0b4fa8;--red:#e8202a;--bg:#fff;--fg:#14213d;--bot:#eef3fa;--line:#dbe4f0;--mut:#5b6b85}' +
    '@media(prefers-color-scheme:dark){:host{--bg:#16202e;--fg:#e8eef7;--bot:#223149;--line:#2d3f5a;--mut:#9fb0c8}}' +
    '*{box-sizing:border-box;font-family:"Segoe UI",Tahoma,"Noto Naskh Arabic",system-ui,sans-serif}' +
    '.wrap{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483000;display:flex;flex-direction:column;align-items:flex-end;gap:12px}' +
    '.btn{width:64px;height:64px;border-radius:50%;border:3px solid var(--blue);background:#fff;padding:0;cursor:pointer;box-shadow:0 6px 18px rgba(11,79,168,.35);overflow:hidden}' +
    '.btn img{width:100%;height:100%;display:block}' +
    '.btn:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid var(--red);outline-offset:2px}' +
    '.panel{display:none;width:min(380px,calc(100vw - 24px));max-width:380px;max-height:560px;height:min(560px,calc(100vh - 110px));background:var(--bg);color:var(--fg);border-radius:16px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.28);border:1px solid var(--line);flex-direction:column}' +
    '.panel.on{display:flex}@supports(height:100dvh){.panel{height:min(560px,calc(100dvh - 110px))}}' +
    '.head{background:var(--blue);color:#fff;padding:10px 12px;display:flex;align-items:center;gap:10px;border-bottom:4px solid var(--red)}' +
    '.head img{width:42px;height:42px;border-radius:50%;background:#fff;flex:none}' +
    '.ht{flex:1;min-width:0}.ht b{display:block;font-size:15px;line-height:1.2}.ht span{font-size:11.5px;opacity:.85}' +
    '.lang{display:flex;gap:4px}.lang button,.x{background:rgba(255,255,255,.16);color:#fff;border:0;border-radius:6px;padding:4px 7px;font-size:12px;cursor:pointer}' +
    '.lang button.on{background:#fff;color:var(--blue);font-weight:700}.x{font-size:16px;line-height:1;padding:4px 8px}' +
    '.msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:9px}' +
    '.m{max-width:86%;padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.5;word-wrap:break-word;overflow-wrap:anywhere}' +
    '.m.b{background:var(--bot);border-bottom-left-radius:4px;align-self:flex-start}.m.u{background:var(--blue);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
    '.m a{color:inherit;font-weight:600;text-decoration:underline}.m.b a{color:var(--blue)}' +
    '@media(prefers-color-scheme:dark){.m.b a{color:#8fc0ff}}' +
    '.dots{display:inline-flex;gap:4px}.dots i{width:6px;height:6px;border-radius:50%;background:var(--mut);animation:d 1s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}' +
    '@keyframes d{0%,80%,100%{opacity:.25}40%{opacity:1}}@media(prefers-reduced-motion:reduce){.dots i{animation:none}}' +
    '.chips{display:flex;gap:6px;overflow-x:auto;padding:8px 10px;border-top:1px solid var(--line);scrollbar-width:thin}' +
    '.chips button{flex:none;border:1px solid var(--blue);background:transparent;color:var(--blue);border-radius:999px;padding:5px 11px;font-size:12.5px;cursor:pointer;white-space:nowrap}' +
    '@media(prefers-color-scheme:dark){.chips button{color:#8fc0ff;border-color:#8fc0ff}}' +
    '.chips button:hover{background:var(--blue);color:#fff}' +
    '.o{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.o button{border:1px solid var(--blue);background:transparent;color:var(--blue);border-radius:999px;padding:5px 10px;font-size:12.5px;cursor:pointer}.o button:hover{background:var(--blue);color:#fff}' +
    '@media(prefers-color-scheme:dark){.o button{color:#8fc0ff;border-color:#8fc0ff}}' +
    '.row{display:flex;gap:8px;padding:8px 10px 12px}.row input{flex:1;min-width:0;border:1px solid var(--line);background:var(--bg);color:var(--fg);border-radius:999px;padding:9px 14px;font-size:14px}' +
    '.row button{border:0;background:var(--red);color:#fff;border-radius:999px;padding:0 16px;font-size:14px;font-weight:600;cursor:pointer}' +
    '</style>' +
    '<div class="wrap" style="position:fixed;right:18px;bottom:18px;display:flex;flex-direction:column;align-items:flex-end;gap:12px"><section class="panel" style="max-width:380px;max-height:560px" role="dialog" aria-label="BHY Hospital chat">' +
    '<div class="head"><img alt="" src="' + LOGO + '"><div class="ht"><b id="t"></b><span id="s"></span></div>' +
    '<div class="lang"><button data-l="en">EN</button><button data-l="ru">Roman</button><button data-l="ur">اردو</button></div><button class="x" id="x">✕</button></div>' +
    '<div class="msgs" id="m" aria-live="polite"></div><div class="chips" id="c"></div>' +
    '<div class="row"><input id="i" autocomplete="off"><button id="g"></button></div></section>' +
    '<button class="btn" id="o" style="width:64px;height:64px;border-radius:50%;padding:0;overflow:hidden"><img alt="BHY Hospital" src="' + LOGO + '"></button></div>';
  document.body.appendChild(host);

  var $ = function (id) { return root.getElementById(id); };
  var panel = root.querySelector('.panel'), lang = 'en', started = false, busy = false;

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmt(s) {
    s = esc(s).replace(/https?:\/\/[^\s<]+/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') + '</a>'; });
    s = s.split(C.uan).join('<a href="tel:021111111249">' + C.uan + '</a>').split(C.ph).join('<a href="tel:02135822770">' + C.ph + '</a>').split(C.wa).join('<a href="' + C.waLink + '" target="_blank" rel="noopener">' + C.wa + '</a>');
    return s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  }
  function add(html, who) {
    var d = document.createElement('div'); d.className = 'm ' + who; d.setAttribute('dir', 'auto'); d.innerHTML = html;
    $('m').appendChild(d); $('m').scrollTop = $('m').scrollHeight; return d;
  }
  function reply(fn) {
    busy = true;
    var t = add('<span class="dots"><i></i><i></i><i></i></span>', 'b');
    setTimeout(function () {
      var r; try { r = fn(lang); } catch (e) { r = f(A.fallback[lang]); }
      if (typeof r === 'string') r = { t: r };
      t.innerHTML = fmt(r.t);
      if (r.o) {
        var w = document.createElement('div'); w.className = 'o';
        r.o.forEach(function (o) { var b = document.createElement('button'); b.textContent = o[0]; b.onclick = function () { if (busy) return; add(esc(o[0]), 'u'); reply(H(o[1])); }; w.appendChild(b); });
        t.appendChild(w);
      }
      $('m').scrollTop = $('m').scrollHeight; busy = false;
    }, 450);
  }
  function renderUI() {
    var u = UI[lang];
    $('t').textContent = u.title; $('s').textContent = u.sub; $('i').placeholder = u.ph; $('g').textContent = u.send;
    $('x').setAttribute('aria-label', u.close); $('o').setAttribute('aria-label', u.open);
    panel.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
    root.querySelectorAll('.lang button').forEach(function (b) { b.classList.toggle('on', b.dataset.l === lang); });
    $('c').innerHTML = '';
    CHIPS.forEach(function (c) {
      var b = document.createElement('button'); b.textContent = c[LI[lang]];
      b.onclick = function () { if (busy) return; add(esc(b.textContent), 'u'); reply(H(c[0])); };
      $('c').appendChild(b);
    });
  }
  function send() {
    var v = $('i').value.trim(); if (!v || busy) return;
    $('i').value = ''; var l = detect(v, lang);
    if (l !== lang) { lang = l; renderUI(); }
    add(esc(v), 'u'); reply(route(v));
  }
  function toggle(on) {
    panel.classList.toggle('on', on);
    if (on && !started) { started = true; renderUI(); add(fmt(A.welcome[lang]), 'b'); }
    if (on) $('i').focus();
  }
  $('o').onclick = function () { toggle(!panel.classList.contains('on')); };
  $('x').onclick = function () { toggle(false); };
  $('g').onclick = send;
  $('i').onkeydown = function (e) { if (e.key === 'Enter') send(); };
  root.querySelectorAll('.lang button').forEach(function (b) { b.onclick = function () { lang = b.dataset.l; renderUI(); }; });
  renderUI();
})();
