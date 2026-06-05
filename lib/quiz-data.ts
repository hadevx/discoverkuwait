export type QuizCategory = "dialect" | "history" | "geography" | "traditions" | "landmarks"

export type QuizQuestion = {
  id: string
  category: QuizCategory
  question: { ar: string; en: string }
  options: { ar: string; en: string }[]
  answer: number // index of correct option
  explanation: { ar: string; en: string }
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    category: "history",
    question: {
      ar: "في أي عام استقلّت دولة الكويت؟",
      en: "In which year did Kuwait gain independence?",
    },
    options: [
      { ar: "1961", en: "1961" },
      { ar: "1971", en: "1971" },
      { ar: "1956", en: "1956" },
      { ar: "1945", en: "1945" },
    ],
    answer: 0,
    explanation: {
      ar: "نالت الكويت استقلالها عن بريطانيا في 19 يونيو 1961.",
      en: "Kuwait gained independence from Britain on 19 June 1961.",
    },
  },
  {
    id: "q2",
    category: "landmarks",
    question: {
      ar: "كم عدد كرات أبراج الكويت الرئيسية؟",
      en: "How many main spheres do the Kuwait Towers have?",
    },
    options: [
      { ar: "اثنتان", en: "Two" },
      { ar: "ثلاث", en: "Three" },
      { ar: "واحدة", en: "One" },
      { ar: "أربع", en: "Four" },
    ],
    answer: 1,
    explanation: {
      ar: "تتكوّن أبراج الكويت من ثلاثة أبراج، اثنان منها يحملان كرات مميزة.",
      en: "The Kuwait Towers consist of three towers, two of which carry the iconic spheres.",
    },
  },
  {
    id: "q3",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «وايد» في اللهجة الكويتية؟",
      en: "What does the Kuwaiti word 'wayed' mean?",
    },
    options: [
      { ar: "قليل", en: "A little" },
      { ar: "كثير", en: "A lot" },
      { ar: "بسرعة", en: "Quickly" },
      { ar: "ربما", en: "Maybe" },
    ],
    answer: 1,
    explanation: {
      ar: "«وايد» تعني «كثير» أو «جداً».",
      en: "'Wayed' means 'a lot' or 'very much'.",
    },
  },
  {
    id: "q4",
    category: "geography",
    question: {
      ar: "ما هي أكبر جزيرة كويتية من حيث المساحة؟",
      en: "What is Kuwait's largest island by area?",
    },
    options: [
      { ar: "فيلكا", en: "Failaka" },
      { ar: "بوبيان", en: "Bubiyan" },
      { ar: "وربة", en: "Warba" },
      { ar: "كبر", en: "Kubbar" },
    ],
    answer: 1,
    explanation: {
      ar: "جزيرة بوبيان هي أكبر الجزر الكويتية بمساحة تقارب 863 كم².",
      en: "Bubiyan is Kuwait's largest island, covering about 863 km².",
    },
  },
  {
    id: "q5",
    category: "traditions",
    question: {
      ar: "ما اسم الحرفة التقليدية لنسج بيوت الشَعر والسجاد البدوي؟",
      en: "What is the traditional Bedouin weaving craft called?",
    },
    options: [
      { ar: "السدو", en: "Al-Sadu" },
      { ar: "التلّي", en: "Al-Talli" },
      { ar: "القرقيعان", en: "Gergean" },
      { ar: "النهام", en: "Al-Nahham" },
    ],
    answer: 0,
    explanation: {
      ar: "السدو حرفة نسيج بدوية تقليدية أُدرجت في قائمة اليونسكو للتراث.",
      en: "Al-Sadu is a traditional Bedouin weaving craft on UNESCO's heritage list.",
    },
  },
  {
    id: "q6",
    category: "history",
    question: {
      ar: "ما المهنة التي اشتهر بها الكويتيون قبل اكتشاف النفط؟",
      en: "What trade were Kuwaitis famous for before oil?",
    },
    options: [
      { ar: "الزراعة", en: "Farming" },
      { ar: "الغوص على اللؤلؤ", en: "Pearl diving" },
      { ar: "التعدين", en: "Mining" },
      { ar: "صناعة الحرير", en: "Silk making" },
    ],
    answer: 1,
    explanation: {
      ar: "اعتمد اقتصاد الكويت قديماً على الغوص على اللؤلؤ والتجارة البحرية.",
      en: "Kuwait's old economy relied on pearl diving and maritime trade.",
    },
  },
  {
    id: "q7",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «شلونك»؟",
      en: "What does 'shlonik' mean?",
    },
    options: [
      { ar: "أين أنت؟", en: "Where are you?" },
      { ar: "كيف حالك؟", en: "How are you?" },
      { ar: "ماذا تريد؟", en: "What do you want?" },
      { ar: "متى ستأتي؟", en: "When will you come?" },
    ],
    answer: 1,
    explanation: {
      ar: "«شلونك» تعني «كيف حالك؟» وأصلها «ش لونك».",
      en: "'Shlonik' means 'How are you?' (literally 'what is your color?').",
    },
  },
  {
    id: "q8",
    category: "landmarks",
    question: {
      ar: "ما اسم أقدم سوق تقليدي في مدينة الكويت؟",
      en: "What is the name of Kuwait City's oldest traditional market?",
    },
    options: [
      { ar: "سوق المباركية", en: "Souq Mubarakiya" },
      { ar: "سوق شرق", en: "Souq Sharq" },
      { ar: "الأفنيوز", en: "The Avenues" },
      { ar: "سوق الجمعة", en: "Friday Market" },
    ],
    answer: 0,
    explanation: {
      ar: "سوق المباركية من أقدم أسواق الكويت ويعود لأكثر من 200 عام.",
      en: "Souq Mubarakiya is one of Kuwait's oldest markets, over 200 years old.",
    },
  },
  {
    id: "q9",
    category: "geography",
    question: {
      ar: "كم عدد محافظات دولة الكويت؟",
      en: "How many governorates does Kuwait have?",
    },
    options: [
      { ar: "أربع", en: "Four" },
      { ar: "خمس", en: "Five" },
      { ar: "ست", en: "Six" },
      { ar: "سبع", en: "Seven" },
    ],
    answer: 2,
    explanation: {
      ar: "تنقسم الكويت إلى ست محافظات إدارية.",
      en: "Kuwait is divided into six administrative governorates.",
    },
  },
  {
    id: "q10",
    category: "traditions",
    question: {
      ar: "ما المناسبة التي يجمع فيها الأطفال الحلوى ويطوفون البيوت؟",
      en: "During which occasion do children collect sweets door to door?",
    },
    options: [
      { ar: "القرقيعان", en: "Gergean" },
      { ar: "الهالة", en: "Hala" },
      { ar: "النيروز", en: "Nowruz" },
      { ar: "السدو", en: "Sadu" },
    ],
    answer: 0,
    explanation: {
      ar: "القرقيعان احتفال يقام منتصف رمضان حيث يجمع الأطفال الحلوى والمكسرات.",
      en: "Gergean is celebrated mid-Ramadan when children collect sweets and nuts.",
    },
  },
  {
    id: "q11",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «زين»؟",
      en: "What does the word 'zain' mean?",
    },
    options: [
      { ar: "سيّئ", en: "Bad" },
      { ar: "جيّد / حسناً", en: "Good / okay" },
      { ar: "غالٍ", en: "Expensive" },
      { ar: "بعيد", en: "Far" },
    ],
    answer: 1,
    explanation: {
      ar: "«زين» تعني «جيّد» أو تُستخدم بمعنى «حسناً».",
      en: "'Zain' means 'good' and is also used to say 'okay'.",
    },
  },
  {
    id: "q12",
    category: "history",
    question: {
      ar: "ماذا يعني اسم «الكويت» لغوياً؟",
      en: "What does the name 'Kuwait' literally mean?",
    },
    options: [
      { ar: "القلعة الصغيرة / الحصن", en: "Small fort / castle" },
      { ar: "الميناء الكبير", en: "The big port" },
      { ar: "أرض اللؤلؤ", en: "Land of pearls" },
      { ar: "الواحة", en: "The oasis" },
    ],
    answer: 0,
    explanation: {
      ar: "«الكويت» تصغير لكلمة «كوت» وتعني الحصن أو القلعة الصغيرة.",
      en: "'Kuwait' is the diminutive of 'kut', meaning a small fort or castle.",
    },
  },
  // ── History ──
  {
    id: "q13",
    category: "history",
    question: {
      ar: "في أي عام اكتُشف النفط تجارياً في الكويت؟",
      en: "In which year was oil commercially discovered in Kuwait?",
    },
    options: [
      { ar: "1938", en: "1938" },
      { ar: "1946", en: "1946" },
      { ar: "1950", en: "1950" },
      { ar: "1928", en: "1928" },
    ],
    answer: 0,
    explanation: {
      ar: "اكتُشف النفط في حقل برقان عام 1938، وبدأ التصدير الفعلي عام 1946.",
      en: "Oil was discovered in the Burgan field in 1938, with actual exports beginning in 1946.",
    },
  },
  {
    id: "q14",
    category: "history",
    question: {
      ar: "في أي عام أُسِّس مجلس الأمة الكويتي؟",
      en: "In which year was Kuwait's National Assembly established?",
    },
    options: [
      { ar: "1961", en: "1961" },
      { ar: "1963", en: "1963" },
      { ar: "1971", en: "1971" },
      { ar: "1969", en: "1969" },
    ],
    answer: 1,
    explanation: {
      ar: "أُسِّس مجلس الأمة عام 1963 وهو هيئة تشريعية وطنية منتخبة.",
      en: "The National Assembly was established in 1963 as an elected national legislature.",
    },
  },
  {
    id: "q15",
    category: "history",
    question: {
      ar: "في أي عام غزا العراق دولة الكويت؟",
      en: "In which year did Iraq invade Kuwait?",
    },
    options: [
      { ar: "1988", en: "1988" },
      { ar: "1991", en: "1991" },
      { ar: "1990", en: "1990" },
      { ar: "1985", en: "1985" },
    ],
    answer: 2,
    explanation: {
      ar: "غزا العراق الكويت في الثاني من أغسطس 1990.",
      en: "Iraq invaded Kuwait on 2 August 1990.",
    },
  },
  {
    id: "q16",
    category: "history",
    question: {
      ar: "في أي تاريخ تمّ تحرير الكويت؟",
      en: "On what date was Kuwait liberated?",
    },
    options: [
      { ar: "26 فبراير 1991", en: "26 February 1991" },
      { ar: "17 يناير 1991", en: "17 January 1991" },
      { ar: "2 أغسطس 1990", en: "2 August 1990" },
      { ar: "1 مارس 1991", en: "1 March 1991" },
    ],
    answer: 0,
    explanation: {
      ar: "تحررت الكويت في 26 فبراير 1991 وهو يوم احتفال وطني رسمي.",
      en: "Kuwait was liberated on 26 February 1991, now a national holiday.",
    },
  },
  {
    id: "q17",
    category: "history",
    question: {
      ar: "ما اسم الأسرة الحاكمة في الكويت؟",
      en: "What is the name of Kuwait's ruling family?",
    },
    options: [
      { ar: "آل سعود", en: "Al-Saud" },
      { ar: "آل الصباح", en: "Al-Sabah" },
      { ar: "آل نهيان", en: "Al-Nahyan" },
      { ar: "آل ثاني", en: "Al-Thani" },
    ],
    answer: 1,
    explanation: {
      ar: "تحكم أسرة آل الصباح الكويت منذ منتصف القرن الثامن عشر.",
      en: "The Al-Sabah family has ruled Kuwait since the mid-18th century.",
    },
  },
  {
    id: "q18",
    category: "history",
    question: {
      ar: "ما اسم أول حاكم لمدينة الكويت؟",
      en: "Who was the first ruler of Kuwait?",
    },
    options: [
      { ar: "الشيخ صباح الأول", en: "Sheikh Sabah I" },
      { ar: "الشيخ جابر الأول", en: "Sheikh Jaber I" },
      { ar: "الشيخ مبارك الكبير", en: "Sheikh Mubarak the Great" },
      { ar: "الشيخ عبدالله الأول", en: "Sheikh Abdullah I" },
    ],
    answer: 0,
    explanation: {
      ar: "الشيخ صباح الأول هو مؤسس إمارة الكويت وأول حكامها في منتصف القرن الثامن عشر.",
      en: "Sheikh Sabah I was the founder and first ruler of Kuwait in the mid-18th century.",
    },
  },
  // ── Geography ──
  {
    id: "q19",
    category: "geography",
    question: {
      ar: "على أي خليج تطلّ الكويت؟",
      en: "Which gulf does Kuwait face?",
    },
    options: [
      { ar: "خليج عُمان", en: "Gulf of Oman" },
      { ar: "خليج عدن", en: "Gulf of Aden" },
      { ar: "الخليج العربي", en: "Arabian Gulf" },
      { ar: "البحر الأحمر", en: "Red Sea" },
    ],
    answer: 2,
    explanation: {
      ar: "تطلّ الكويت على الخليج العربي (الخليج الفارسي) شرقاً.",
      en: "Kuwait faces the Arabian Gulf (Persian Gulf) to the east.",
    },
  },
  {
    id: "q20",
    category: "geography",
    question: {
      ar: "ما تقريباً مساحة دولة الكويت؟",
      en: "What is the approximate area of Kuwait?",
    },
    options: [
      { ar: "17,818 كم²", en: "17,818 km²" },
      { ar: "9,500 كم²", en: "9,500 km²" },
      { ar: "30,000 كم²", en: "30,000 km²" },
      { ar: "6,000 كم²", en: "6,000 km²" },
    ],
    answer: 0,
    explanation: {
      ar: "تبلغ مساحة الكويت نحو 17,818 كم².",
      en: "Kuwait has an area of approximately 17,818 km².",
    },
  },
  {
    id: "q21",
    category: "geography",
    question: {
      ar: "ما اسم أكبر حقل نفطي في الكويت والثاني عالمياً؟",
      en: "What is Kuwait's largest oilfield, the second largest in the world?",
    },
    options: [
      { ar: "حقل الرميلة", en: "Rumaila field" },
      { ar: "حقل برقان", en: "Burgan field" },
      { ar: "حقل الزبير", en: "Zubair field" },
      { ar: "حقل المنقوش", en: "Manqoush field" },
    ],
    answer: 1,
    explanation: {
      ar: "حقل برقان العملاق هو ثاني أكبر حقل نفطي في العالم بعد حقل الغوار السعودي.",
      en: "The Greater Burgan field is the world's second-largest oilfield after Saudi Arabia's Ghawar.",
    },
  },
  {
    id: "q22",
    category: "geography",
    question: {
      ar: "ما الدولة التي تحدّ الكويت من الشمال والغرب؟",
      en: "Which country borders Kuwait to the north and west?",
    },
    options: [
      { ar: "إيران", en: "Iran" },
      { ar: "العراق", en: "Iraq" },
      { ar: "الأردن", en: "Jordan" },
      { ar: "السعودية", en: "Saudi Arabia" },
    ],
    answer: 1,
    explanation: {
      ar: "يحدّ العراقُ الكويتَ من الشمال والشمال الغربي.",
      en: "Iraq borders Kuwait to the north and northwest.",
    },
  },
  {
    id: "q23",
    category: "geography",
    question: {
      ar: "في أي محافظة تقع مدينة الجهراء؟",
      en: "In which governorate is the city of Jahra located?",
    },
    options: [
      { ar: "محافظة الأحمدي", en: "Ahmadi Governorate" },
      { ar: "محافظة مبارك الكبير", en: "Mubarak Al-Kabeer Governorate" },
      { ar: "محافظة الجهراء", en: "Jahra Governorate" },
      { ar: "محافظة الفروانية", en: "Farwaniya Governorate" },
    ],
    answer: 2,
    explanation: {
      ar: "تقع مدينة الجهراء في محافظة الجهراء في غرب الكويت.",
      en: "Jahra city is in Jahra Governorate in western Kuwait.",
    },
  },
  {
    id: "q24",
    category: "geography",
    question: {
      ar: "ما الدولة التي تحدّ الكويت من الجنوب؟",
      en: "Which country borders Kuwait to the south?",
    },
    options: [
      { ar: "العراق", en: "Iraq" },
      { ar: "الإمارات", en: "UAE" },
      { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
      { ar: "قطر", en: "Qatar" },
    ],
    answer: 2,
    explanation: {
      ar: "تحدّ المملكة العربية السعودية الكويتَ من الجنوب والجنوب الغربي.",
      en: "Saudi Arabia borders Kuwait to the south and southwest.",
    },
  },
  // ── Landmarks ──
  {
    id: "q25",
    category: "landmarks",
    question: {
      ar: "ما ارتفاع برج التحرير في الكويت؟",
      en: "What is the height of Liberation Tower in Kuwait?",
    },
    options: [
      { ar: "250 متراً", en: "250 metres" },
      { ar: "372 متراً", en: "372 metres" },
      { ar: "451 متراً", en: "451 metres" },
      { ar: "300 متراً", en: "300 metres" },
    ],
    answer: 1,
    explanation: {
      ar: "يبلغ ارتفاع برج التحرير 372 متراً وكان الأطول في الشرق الأوسط عند افتتاحه.",
      en: "Liberation Tower stands 372 metres tall and was the tallest in the Middle East at opening.",
    },
  },
  {
    id: "q26",
    category: "landmarks",
    question: {
      ar: "أين يقع المركز العلمي الكويتي؟",
      en: "Where is the Kuwait Scientific Center located?",
    },
    options: [
      { ar: "السالمية", en: "Salmiya" },
      { ar: "الفحيحيل", en: "Fahaheel" },
      { ar: "المهبولة", en: "Mahboula" },
      { ar: "الرميثية", en: "Rumaithiya" },
    ],
    answer: 0,
    explanation: {
      ar: "يقع المركز العلمي على الكورنيش في السالمية ويضمّ أكبر أكواريوم في الشرق الأوسط.",
      en: "The Scientific Center is on the Salmiya corniche, home to the Middle East's largest aquarium.",
    },
  },
  {
    id: "q27",
    category: "landmarks",
    question: {
      ar: "ما اسم المقرّ الرسمي لأمير الكويت؟",
      en: "What is the name of the Kuwaiti Emir's official residence?",
    },
    options: [
      { ar: "قصر البيان", en: "Bayan Palace" },
      { ar: "قصر السيف", en: "Seif Palace" },
      { ar: "قصر الشعب", en: "People's Palace" },
      { ar: "قصر دسمان", en: "Dasman Palace" },
    ],
    answer: 0,
    explanation: {
      ar: "قصر البيان هو المقرّ الرسمي لأمير الكويت ويُستخدم للمناسبات الرسمية.",
      en: "Bayan Palace is the official residence of the Kuwaiti Emir, used for state occasions.",
    },
  },
  {
    id: "q28",
    category: "landmarks",
    question: {
      ar: "ما اسم المعلم السياحي الذي يضمّ ملايين المرايا والزجاج الملوّن في الكويت؟",
      en: "What landmark in Kuwait is filled with millions of mirrors and coloured glass?",
    },
    options: [
      { ar: "بيت المرايا", en: "Mirror House" },
      { ar: "بيت السدو", en: "Sadu House" },
      { ar: "المتحف الوطني", en: "National Museum" },
      { ar: "قصر السيف", en: "Seif Palace" },
    ],
    answer: 0,
    explanation: {
      ar: "بيت المرايا في القادسية يضمّ ملايين المرايا والزجاج الملوّن وهو من المعالم السياحية الفريدة.",
      en: "The Mirror House in Qadsiya contains millions of mirrors and coloured glass, a unique tourist landmark.",
    },
  },
  {
    id: "q29",
    category: "landmarks",
    question: {
      ar: "ما أكبر مجمع تجاري في الكويت؟",
      en: "What is the largest shopping mall in Kuwait?",
    },
    options: [
      { ar: "المارينا مول", en: "Marina Mall" },
      { ar: "الأفنيوز", en: "The Avenues" },
      { ar: "360 مول", en: "360 Mall" },
      { ar: "سيتي سنتر", en: "City Centre" },
    ],
    answer: 1,
    explanation: {
      ar: "يُعدّ مجمع الأفنيوز من أكبر مراكز التسوق في الكويت والمنطقة.",
      en: "The Avenues is one of the largest shopping centres in Kuwait and the region.",
    },
  },
  {
    id: "q30",
    category: "landmarks",
    question: {
      ar: "ما اسم أبرز المتاحف التاريخية في الكويت؟",
      en: "What is the name of Kuwait's main history museum?",
    },
    options: [
      { ar: "المتحف الوطني الكويتي", en: "Kuwait National Museum" },
      { ar: "متحف الفن الإسلامي", en: "Museum of Islamic Art" },
      { ar: "متحف النفط", en: "Oil Museum" },
      { ar: "متحف اللؤلؤ", en: "Pearl Museum" },
    ],
    answer: 0,
    explanation: {
      ar: "المتحف الوطني الكويتي يضمّ مقتنيات تاريخية وأثرية تعكس تاريخ الكويت الحضاري.",
      en: "Kuwait National Museum houses historical and archaeological artefacts reflecting Kuwait's civilizational history.",
    },
  },
  // ── Traditions ──
  {
    id: "q31",
    category: "traditions",
    question: {
      ar: "ما هو الديوانية في الثقافة الكويتية؟",
      en: "What is a 'Diwaniya' in Kuwaiti culture?",
    },
    options: [
      { ar: "نوع من الطعام الكويتي", en: "A type of Kuwaiti food" },
      { ar: "مجلس تقليدي للضيافة والاجتماع", en: "A traditional gathering / guest hall" },
      { ar: "حفلة موسيقية", en: "A music concert" },
      { ar: "لباس تقليدي", en: "A traditional garment" },
    ],
    answer: 1,
    explanation: {
      ar: "الديوانية مجلس تقليدي يجتمع فيه الرجال للنقاش والضيافة وتبادل الأفكار.",
      en: "A Diwaniya is a traditional guest hall where men gather for discussion, hospitality, and socialising.",
    },
  },
  {
    id: "q32",
    category: "traditions",
    question: {
      ar: "ما اسم الملبس التقليدي الكويتي للرجال؟",
      en: "What is the traditional Kuwaiti garment for men called?",
    },
    options: [
      { ar: "الكندورة", en: "Kandoura" },
      { ar: "الدشداشة", en: "Dishdasha" },
      { ar: "العباءة", en: "Abaya" },
      { ar: "الجلابية", en: "Jalabiya" },
    ],
    answer: 1,
    explanation: {
      ar: "الدشداشة (أو الثوب) هي الزيّ التقليدي للرجل الكويتي وتُلبس عادةً باللون الأبيض.",
      en: "The Dishdasha (or Thobe) is the traditional Kuwaiti men's garment, typically worn in white.",
    },
  },
  {
    id: "q33",
    category: "traditions",
    question: {
      ar: "ما النشيد البحري التقليدي الذي كان يُغنَّى أثناء الغوص على اللؤلؤ؟",
      en: "What is the traditional sea chant sung during pearl diving called?",
    },
    options: [
      { ar: "الفجري", en: "Fijiri" },
      { ar: "النهمة", en: "Al-Nahma" },
      { ar: "العرضة", en: "Al-Ardha" },
      { ar: "الليوة", en: "Al-Leiwah" },
    ],
    answer: 1,
    explanation: {
      ar: "النهمة موروث غنائي بحري كان يُؤدّيه الغوّاصون والبحّارة لرفع معنوياتهم.",
      en: "Al-Nahma is a maritime musical heritage sung by divers and sailors to boost morale.",
    },
  },
  {
    id: "q34",
    category: "traditions",
    question: {
      ar: "ما الرياضة التقليدية التي تشتهر بها الكويت ودول الخليج؟",
      en: "What traditional sport are Kuwait and the Gulf known for?",
    },
    options: [
      { ar: "الصيد بالقوس", en: "Archery" },
      { ar: "الصقارة", en: "Falconry" },
      { ar: "سباق الجِمال", en: "Camel racing" },
      { ar: "المصارعة", en: "Wrestling" },
    ],
    answer: 1,
    explanation: {
      ar: "الصقارة فنّ تقليدي تعود جذوره لآلاف السنين وأُدرج في قائمة التراث الإنساني لليونسكو.",
      en: "Falconry is a traditional art thousands of years old and inscribed on UNESCO's Intangible Cultural Heritage list.",
    },
  },
  {
    id: "q35",
    category: "traditions",
    question: {
      ar: "ما الاسم الذي يُطلق على الحيّ التقليدي في الكويت القديمة؟",
      en: "What is the name of a traditional neighbourhood in old Kuwait?",
    },
    options: [
      { ar: "فريج", en: "Freej" },
      { ar: "حارة", en: "Hara" },
      { ar: "منطقة", en: "Mintaqa" },
      { ar: "دربون", en: "Darboon" },
    ],
    answer: 0,
    explanation: {
      ar: "الفريج هو الحيّ السكني في الكويت القديمة وكانت العائلات المتقاربة تسكن في نفس الفريج.",
      en: "A 'Freej' is the residential neighbourhood in old Kuwait where close families lived together.",
    },
  },
  {
    id: "q36",
    category: "traditions",
    question: {
      ar: "ما اسم الرقصة الشعبية الخليجية التي تُؤدَّى بالعصي؟",
      en: "What is the traditional Gulf stick dance called?",
    },
    options: [
      { ar: "السامري", en: "Al-Samri" },
      { ar: "العرضة", en: "Al-Ardha" },
      { ar: "الخماري", en: "Al-Khumari" },
      { ar: "الرزفة", en: "Al-Razzfa" },
    ],
    answer: 1,
    explanation: {
      ar: "العرضة رقصة شعبية تراثية تُؤدَّى بالسيوف والعصي وتُعبّر عن الشجاعة والفخر.",
      en: "Al-Ardha is a traditional folk dance performed with swords and sticks, expressing courage and pride.",
    },
  },
  // ── Dialect ──
  {
    id: "q37",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «يلّا» في اللهجة الكويتية؟",
      en: "What does 'yalla' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "مرحباً", en: "Hello" },
      { ar: "هيّا / بسرعة", en: "Let's go / hurry up" },
      { ar: "مع السلامة", en: "Goodbye" },
      { ar: "شكراً", en: "Thank you" },
    ],
    answer: 1,
    explanation: {
      ar: "«يلّا» تُستخدم لحثّ شخص على الإسراع أو للانطلاق معاً.",
      en: "'Yalla' is used to urge someone to hurry up or to signal it's time to go.",
    },
  },
  {
    id: "q38",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «بس» في اللهجة الكويتية؟",
      en: "What does 'bas' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "أكثر", en: "More" },
      { ar: "كفى / خلاص / فقط", en: "Enough / that's it / only" },
      { ar: "ابدأ", en: "Start" },
      { ar: "معاً", en: "Together" },
    ],
    answer: 1,
    explanation: {
      ar: "«بس» تعني كفى أو وقف، وتُستخدم أيضاً بمعنى «فقط».",
      en: "'Bas' means enough or stop, and is also used to mean 'only' or 'just'.",
    },
  },
  {
    id: "q39",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «ليش» في اللهجة الكويتية؟",
      en: "What does 'laish' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "متى؟", en: "When?" },
      { ar: "أين؟", en: "Where?" },
      { ar: "لماذا؟", en: "Why?" },
      { ar: "كيف؟", en: "How?" },
    ],
    answer: 2,
    explanation: {
      ar: "«ليش» هي كلمة استفهامية تعني «لماذا؟».",
      en: "'Laish' is a question word meaning 'Why?'.",
    },
  },
  {
    id: "q40",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «مشخول» في اللهجة الكويتية؟",
      en: "What does 'mashkhool' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "مشغول / منشغل", en: "Busy / occupied" },
      { ar: "سعيد", en: "Happy" },
      { ar: "متعب", en: "Tired" },
      { ar: "خائف", en: "Scared" },
    ],
    answer: 0,
    explanation: {
      ar: "«مشخول» تعني مشغولاً أو منشغلاً بشيء ما.",
      en: "'Mashkhool' means busy or occupied with something.",
    },
  },
  {
    id: "q41",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «تفضّل» في اللهجة الكويتية؟",
      en: "What does 'tfaddal' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "اذهب", en: "Go away" },
      { ar: "أهلاً / تكرّم / تقدّم", en: "Welcome / please go ahead / be my guest" },
      { ar: "انتظر", en: "Wait" },
      { ar: "توقّف", en: "Stop" },
    ],
    answer: 1,
    explanation: {
      ar: "«تفضّل» كلمة كرم ومجاملة تعني «أهلاً بك» أو «تكرّم» أو «تقدّم».",
      en: "'Tfaddal' is a hospitality word meaning 'welcome', 'please go ahead', or 'be my guest'.",
    },
  },
  {
    id: "q42",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «هِنا» في اللهجة الكويتية؟",
      en: "What does 'hnee' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "هناك", en: "Over there" },
      { ar: "هنا", en: "Here" },
      { ar: "بعيد", en: "Far" },
      { ar: "قريب", en: "Near" },
    ],
    answer: 1,
    explanation: {
      ar: "«هنا» أو «hnee» تعني «هنا» وهي نفس الكلمة في العربية الفصحى.",
      en: "'Hnee' means 'here', same as in formal Arabic.",
    },
  },
  {
    id: "q43",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «عسى» في اللهجة الكويتية؟",
      en: "What does 'asa' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "بالتأكيد", en: "Definitely" },
      { ar: "أبداً", en: "Never" },
      { ar: "إن شاء الله / آمل", en: "Hopefully / I hope" },
      { ar: "مستحيل", en: "Impossible" },
    ],
    answer: 2,
    explanation: {
      ar: "«عسى» تعني «أرجو» أو «آمل» وتُستخدم للتعبير عن التمنّي.",
      en: "'Asa' expresses hope — 'I hope' or 'hopefully', used when wishing for something.",
    },
  },
  {
    id: "q44",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «شلون» في اللهجة الكويتية؟",
      en: "What does 'shloon' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "لماذا؟", en: "Why?" },
      { ar: "أين؟", en: "Where?" },
      { ar: "كيف؟ / بأي شكل؟", en: "How? / in what way?" },
      { ar: "متى؟", en: "When?" },
    ],
    answer: 2,
    explanation: {
      ar: "«شلون» تعني «كيف؟» وتُستخدم للسؤال عن الطريقة أو الحال.",
      en: "'Shloon' means 'how?' and is used to ask about manner or condition.",
    },
  },
  {
    id: "q45",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «كافي» في اللهجة الكويتية؟",
      en: "What does 'kafi' mean in Kuwaiti dialect?",
    },
    options: [
      { ar: "ابدأ", en: "Begin" },
      { ar: "كفاية / يكفي", en: "Enough / sufficient" },
      { ar: "أكمل", en: "Continue" },
      { ar: "أسرع", en: "Hurry" },
    ],
    answer: 1,
    explanation: {
      ar: "«كافي» تعني «يكفي» أو «خلاص» وتُستخدم لإيقاف شيء ما.",
      en: "'Kafi' means 'enough' or 'that's sufficient', used to stop or end something.",
    },
  },
  {
    id: "q46",
    category: "dialect",
    question: {
      ar: "ماذا تعني كلمة «أقول» (agool) في اللهجة الكويتية عند بداية الكلام؟",
      en: "What does 'agool' mean when used at the start of a sentence in Kuwaiti dialect?",
    },
    options: [
      { ar: "أنا أقول لك رأيي", en: "I'm telling you my opinion" },
      { ar: "تنبيه / استمع / قل لي", en: "Hey listen / tell me" },
      { ar: "لا أعرف", en: "I don't know" },
      { ar: "أتفق معك", en: "I agree with you" },
    ],
    answer: 1,
    explanation: {
      ar: "«أقول» تُستخدم لاستقطاب الانتباه أو بداية طلب، مثل «أقول، وين رحت؟».",
      en: "'Agool' is used to get someone's attention, like saying 'Hey, listen' before a question.",
    },
  },
]

export const QUIZ_LENGTH = 8

/** Picks a deterministic shuffled set using the given numeric seed. */
export function getQuizQuestions(seed: number): QuizQuestion[] {
  const shuffled = [...QUIZ_QUESTIONS]
  let m = shuffled.length
  let s = seed
  while (m) {
    s = (s * 9301 + 49297) % 233280
    const i = Math.floor((s / 233280) * m--)
    ;[shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]]
  }
  return shuffled.slice(0, QUIZ_LENGTH)
}

/** Daily seed — same for everyone on the same calendar day. */
export function getDailyQuestions(): QuizQuestion[] {
  const seed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""))
  return getQuizQuestions(seed)
}

export type LeaderboardEntry = {
  name: string
  points: number
  flag?: boolean // is the current user
}

export const LEADERBOARD_SEED: LeaderboardEntry[] = [
  { name: "أبو ناصر · Abu Nasser", points: 1840 },
  { name: "دانة · Dana", points: 1620 },
  { name: "يوسف · Yousef", points: 1475 },
  { name: "العنود · Alanoud", points: 1290 },
  { name: "بدر · Bader", points: 1130 },
  { name: "موضي · Moudhi", points: 980 },
  { name: "خالد · Khaled", points: 845 },
  { name: "نورة · Noura", points: 720 },
]
