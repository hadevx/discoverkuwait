export type Bilingual = {
  ar: string
  en: string
}

export type Landmark = {
  id: string
  name: Bilingual
  category: Bilingual
  description: Bilingual
}

export type Governorate = {
  id: string
  name: Bilingual
  tagline: Bilingual
  description: Bilingual
  /** stylized SVG polygon points within a 600x600 viewBox */
  shape: string
  /** approximate label anchor inside the shape */
  label: { x: number; y: number }
  color: string
  colorActive: string
  areaKm2: number
  population: string
  points: number
  landmarks: Landmark[]
  facts: Bilingual[]
  notableAreas: Bilingual[]
}

export const GOVERNORATES: Governorate[] = [
  {
    id: "jahra",
    name: { ar: "الجهراء", en: "Al Jahra" },
    tagline: { ar: "بوابة الصحراء والتاريخ", en: "Gateway of desert and history" },
    description: {
      ar: "أكبر محافظات الكويت مساحةً، تمتد عبر الصحراء الشمالية والغربية وتضم جزيرة بوبيان وبرّ الصبية. اشتهرت بمعركة الجهراء التاريخية والقصر الأحمر، وتحتضن الجزء الأكبر من المناطق الطبيعية والزراعية في الكويت.",
      en: "Kuwait's largest governorate by area, stretching across the northern and western desert. Home to Bubiyan Island, Subiya, and the historic Red Fort. It contains most of Kuwait's natural and agricultural land.",
    },
    shape: "60,170 210,105 330,150 300,250 180,272 92,300 60,250",
    label: { x: 175, y: 205 },
    color: "oklch(0.82 0.07 75)",
    colorActive: "oklch(0.72 0.12 70)",
    areaKm2: 12130,
    population: "≈ 580,000",
    points: 120,
    landmarks: [
      {
        id: "red-fort",
        name: { ar: "القصر الأحمر", en: "The Red Fort" },
        category: { ar: "موقع تاريخي", en: "Historic site" },
        description: {
          ar: "حصن طيني تاريخي كان مركزاً لمعركة الجهراء عام 1920 ضد قوات الإخوان، وأُعيد ترميمه كمتحف وطني.",
          en: "A historic mud fort that was the center of the 1920 Battle of Jahra, now restored as a national museum.",
        },
      },
      {
        id: "bubiyan",
        name: { ar: "جزيرة بوبيان", en: "Bubiyan Island" },
        category: { ar: "طبيعة", en: "Nature" },
        description: {
          ar: "أكبر جزر الكويت بمساحة 863 كم²، محمية طبيعية غنية بالطيور المهاجرة وأشجار القرم والأسماك.",
          en: "Kuwait's largest island at 863 km², a nature reserve rich in migratory birds, mangroves and fish.",
        },
      },
      {
        id: "jaber-causeway",
        name: { ar: "جسر الشيخ جابر", en: "Sheikh Jaber Causeway" },
        category: { ar: "معلم حديث", en: "Modern landmark" },
        description: {
          ar: "أحد أطول الجسور البحرية في العالم بطول 36 كم، يربط مدينة الكويت بمنطقة الصبية شمالاً.",
          en: "One of the world's longest sea crossings at 36 km, linking Kuwait City to Subiya in the north.",
        },
      },
      {
        id: "mutla-ridge",
        name: { ar: "حافة المطلاع", en: "Al Mutla Ridge" },
        category: { ar: "طبيعة", en: "Nature" },
        description: {
          ar: "أعلى نقطة طبيعية في الكويت بارتفاع نحو 145 متراً، تُقدّم إطلالة بانورامية على الصحراء والخليج.",
          en: "Kuwait's highest natural point at about 145 m, offering a panoramic view over the desert and bay.",
        },
      },
      {
        id: "kabd",
        name: { ar: "منطقة كبد", en: "Kabd District" },
        category: { ar: "زراعة وترفيه", en: "Agriculture & leisure" },
        description: {
          ar: "تُعرف بمزارعها ومسالخها ومضمار سباق الهجن، وتستضيف مهرجانات البادية الشعبية.",
          en: "Known for its farms, camel-racing track and folk desert festivals held throughout the year.",
        },
      },
      {
        id: "warba",
        name: { ar: "جزيرة وربة", en: "Warba Island" },
        category: { ar: "طبيعة", en: "Nature" },
        description: {
          ar: "جزيرة غير مأهولة في أقصى شمال الكويت تُعدّ موقعاً بيئياً حساساً وملجأً للطيور.",
          en: "An uninhabited island at Kuwait's northernmost tip, an ecologically sensitive bird refuge.",
        },
      },
    ],
    facts: [
      {
        ar: "تشكّل الجهراء نحو ثلثي مساحة الكويت الإجمالية.",
        en: "Jahra makes up roughly two-thirds of Kuwait's total land area.",
      },
      {
        ar: "حافة المطلاع هي أعلى نقطة جغرافية طبيعية في الكويت بارتفاع ≈ 145 م.",
        en: "Al Mutla Ridge is Kuwait's highest natural geographic point at ≈ 145 m above sea level.",
      },
      {
        ar: "معركة الجهراء عام 1920 كانت نقطة تحوّل دفاعية مهمة في تاريخ الكويت الحديث.",
        en: "The 1920 Battle of Jahra was a pivotal defensive turning point in modern Kuwaiti history.",
      },
      {
        ar: "جسر الشيخ جابر الأحمد البحري يمتد 36 كم ويُعدّ أحد أطول الجسور البحرية في العالم.",
        en: "Sheikh Jaber Causeway stretches 36 km and ranks among the world's longest marine bridges.",
      },
    ],
    notableAreas: [
      { ar: "الجهراء القديمة", en: "Old Jahra" },
      { ar: "الصليبية", en: "Sulaibiya" },
      { ar: "الصبية", en: "Sabiya" },
      { ar: "كبد", en: "Kabd" },
      { ar: "النعيم", en: "Al Naeem" },
      { ar: "العيون", en: "Al Uyoun" },
    ],
  },
  {
    id: "capital",
    name: { ar: "العاصمة", en: "Al Asimah" },
    tagline: { ar: "قلب الكويت النابض", en: "The beating heart of Kuwait" },
    description: {
      ar: "محافظة العاصمة هي المركز السياسي والتجاري والثقافي للبلاد. تحتضن مدينة الكويت بأبراجها الشامخة وقصورها الرسمية وأسواقها التراثية العريقة ومتاحفها وكورنيشها الخليجي الشهير.",
      en: "The political, commercial and cultural center of Kuwait. Home to Kuwait City with its towers, royal palaces, heritage souqs, museums, and the famous Gulf corniche.",
    },
    shape: "330,150 440,168 446,232 360,262 300,250",
    label: { x: 385, y: 210 },
    color: "oklch(0.70 0.09 200)",
    colorActive: "oklch(0.60 0.12 205)",
    areaKm2: 200,
    population: "≈ 530,000",
    points: 150,
    landmarks: [
      {
        id: "kuwait-towers",
        name: { ar: "أبراج الكويت", en: "Kuwait Towers" },
        category: { ar: "رمز وطني", en: "National icon" },
        description: {
          ar: "أشهر معالم الكويت، ثلاثة أبراج مائية على ساحل الخليج افتُتحت عام 1979 وتحمل مطعماً دوّاراً يُطلّ على الخليج.",
          en: "Kuwait's most iconic landmark, three water towers on the Gulf coast opened in 1979, with a revolving restaurant inside.",
        },
      },
      {
        id: "mubarakiya",
        name: { ar: "سوق المباركية", en: "Souq Mubarakiya" },
        category: { ar: "تراث", en: "Heritage" },
        description: {
          ar: "أحد أقدم أسواق الكويت يعود لأكثر من 200 عام، نابض بالعطور والتوابل والمأكولات الشعبية والحرف اليدوية.",
          en: "One of Kuwait's oldest markets — over 200 years old — alive with perfumes, spices, local food and crafts.",
        },
      },
      {
        id: "grand-mosque",
        name: { ar: "المسجد الكبير", en: "Grand Mosque" },
        category: { ar: "عمارة دينية", en: "Religious architecture" },
        description: {
          ar: "أكبر مساجد الكويت، تحفة معمارية إسلامية افتُتحت عام 1986 وتتسع لأكثر من 10,000 مصلٍّ، وتتميز بقبتها الضخمة ومنارتها الشاهقة.",
          en: "Kuwait's largest mosque, an Islamic architectural masterpiece opened in 1986, accommodating over 10,000 worshippers.",
        },
      },
      {
        id: "national-museum",
        name: { ar: "المتحف الوطني", en: "National Museum" },
        category: { ar: "ثقافة", en: "Culture" },
        description: {
          ar: "يروي تاريخ الكويت من عصور الغوص على اللؤلؤ إلى النهضة الحديثة، ويضم مجموعات من السفن التقليدية والمقتنيات الأثرية.",
          en: "Chronicles Kuwait's story from pearl diving to the modern era, with collections of traditional dhows and archaeological artefacts.",
        },
      },
      {
        id: "liberation-tower",
        name: { ar: "برج التحرير", en: "Liberation Tower" },
        category: { ar: "معلم حديث", en: "Modern landmark" },
        description: {
          ar: "ثاني أطول برج في الكويت بارتفاع 372 متراً، شُيّد بعد التحرير عام 1993 ويُضيء سماء العاصمة.",
          en: "Kuwait's second-tallest structure at 372 m, built after liberation in 1993 and a defining feature of the city's skyline.",
        },
      },
      {
        id: "seif-palace",
        name: { ar: "قصر السيف", en: "Seif Palace" },
        category: { ar: "قصر تاريخي", en: "Historic palace" },
        description: {
          ar: "مقرّ الديوان الأميري التاريخي المطلّ على خليج الكويت، يجمع بين العمارة الإسلامية والحداثة ويُعدّ رمزاً للسلطة الكويتية.",
          en: "The historic Emiri Diwan overlooking Kuwait Bay, blending Islamic and modern architecture as a symbol of Kuwaiti statehood.",
        },
      },
      {
        id: "mirror-house",
        name: { ar: "بيت المرايا", en: "Mirror House" },
        category: { ar: "فن", en: "Art" },
        description: {
          ar: "منزل فريد مغطّى من الداخل بالكامل بملايين المرايا والزجاج الملوّن، تحفة فنية بصرية مذهلة في منطقة القادسية.",
          en: "A unique house entirely covered inside with millions of mirrors and coloured glass, a dazzling visual art installation in Qadsiya.",
        },
      },
    ],
    facts: [
      {
        ar: "كانت مدينة الكويت محاطة بسور دفاعي حُفظت بواباته الخمس حتى اليوم في مواقعها الأصلية.",
        en: "Old Kuwait City was ringed by a defensive wall whose five gates still stand in their original locations today.",
      },
      {
        ar: "شارع الخليج العربي (الكورنيش) يمتد أكثر من 30 كم على ساحل الخليج ويُعدّ أجمل واجهات الكويت البحرية.",
        en: "Arabian Gulf Street (the Corniche) stretches over 30 km along the coast and is considered Kuwait's finest waterfront.",
      },
      {
        ar: "تستضيف محافظة العاصمة مجلس الأمة الكويتي والديوان الأميري ووزارات الدولة الرئيسية.",
        en: "The Capital Governorate hosts Kuwait's National Assembly, the Emiri Diwan, and all major state ministries.",
      },
    ],
    notableAreas: [
      { ar: "شرق", en: "Sharq" },
      { ar: "القبلة", en: "Qibla" },
      { ar: "الدسمة", en: "Dasman" },
      { ar: "عبدالله السالم", en: "Abdullah Al-Salem" },
      { ar: "الديرة", en: "Al Daira" },
      { ar: "القادسية", en: "Qadsiya" },
    ],
  },
  {
    id: "hawalli",
    name: { ar: "حولي", en: "Hawalli" },
    tagline: { ar: "الحياة الساحلية والعائلية", en: "Coastal city life" },
    description: {
      ar: "محافظة حضرية مكتظة على الساحل الشرقي، تشتهر بالسالمية الحيّة ومراكز التسوق والكورنيش البحري وتنوّعها الثقافي الذي يجعلها واحدة من أنشط مناطق الكويت.",
      en: "A dense urban governorate on the east coast, known for vibrant Salmiya, malls, the seaside corniche, and its cultural diversity — making it one of Kuwait's busiest areas.",
    },
    shape: "360,262 446,232 452,318 372,344 332,300",
    label: { x: 405, y: 290 },
    color: "oklch(0.74 0.10 145)",
    colorActive: "oklch(0.64 0.13 148)",
    areaKm2: 84,
    population: "≈ 950,000",
    points: 110,
    landmarks: [
      {
        id: "scientific-center",
        name: { ar: "المركز العلمي", en: "Scientific Center" },
        category: { ar: "علوم", en: "Science" },
        description: {
          ar: "يضم أحد أكبر أحواض الأسماك في الشرق الأوسط وقبة IMAX السينمائية ومعارض العلوم التفاعلية، على كورنيش السالمية.",
          en: "Home to one of the Middle East's largest aquariums, an IMAX dome, and interactive science exhibits on Salmiya's corniche.",
        },
      },
      {
        id: "salmiya",
        name: { ar: "السالمية", en: "Salmiya" },
        category: { ar: "تسوق وترفيه", en: "Shopping & leisure" },
        description: {
          ar: "منطقة تجارية ساحلية حيوية تُطلّ على الخليج وتضم المارينا مول ومرسى اليخوت والمطاعم العالمية.",
          en: "A vibrant coastal commercial district on the Gulf, featuring Marina Mall, a yacht marina, and international restaurants.",
        },
      },
      {
        id: "bayan-palace",
        name: { ar: "منطقة بيان", en: "Bayan Area" },
        category: { ar: "ضاحية راقية", en: "Upscale suburb" },
        description: {
          ar: "تضم قصر البيان المقرّ الرسمي لأمير الكويت، وتتميز بطابعها السكني الراقي وحدائقها المنسّقة.",
          en: "Home to Bayan Palace, the official residence of the Kuwaiti Emir, set amid well-kept gardens and upscale residences.",
        },
      },
      {
        id: "rumaithiya",
        name: { ar: "الرميثية", en: "Rumaithiya" },
        category: { ar: "مجتمع سكني", en: "Residential community" },
        description: {
          ar: "من أرقى المناطق السكنية في حولي، تشتهر بشوارعها الهادئة وقُربها من الشاطئ.",
          en: "One of Hawalli's most prestigious residential areas, known for its quiet streets and proximity to the beach.",
        },
      },
      {
        id: "marina-crescent",
        name: { ar: "مارينا كريسنت", en: "Marina Crescent" },
        category: { ar: "ترفيه", en: "Leisure" },
        description: {
          ar: "واجهة بحرية تفاعلية تضم مسارات للمشي والدراجات والمطاعم المفتوحة على الخليج.",
          en: "An interactive waterfront with walking and cycling paths and open-air restaurants overlooking the Gulf.",
        },
      },
    ],
    facts: [
      {
        ar: "حولي من أكثر مناطق الكويت كثافة سكانية وتنوعاً ثقافياً بوجود عشرات الجنسيات.",
        en: "Hawalli is among Kuwait's most densely populated and culturally diverse areas, home to dozens of nationalities.",
      },
      {
        ar: "محافظة حولي هي الأصغر مساحةً بين المحافظات الست لكنها تحتضن ما يزيد على 15% من سكان الكويت.",
        en: "Hawalli is the smallest of the six governorates by area yet houses over 15% of Kuwait's population.",
      },
      {
        ar: "تُعدّ السالمية أحد أبرز مراكز التسوق والترفيه في الخليج العربي.",
        en: "Salmiya is considered one of the most prominent shopping and entertainment hubs in the Arabian Gulf.",
      },
    ],
    notableAreas: [
      { ar: "السالمية", en: "Salmiya" },
      { ar: "الرميثية", en: "Rumaithiya" },
      { ar: "سلوى", en: "Salwa" },
      { ar: "بيان", en: "Bayan" },
      { ar: "المسيلة", en: "Messila" },
      { ar: "حولي", en: "Hawalli" },
    ],
  },
  {
    id: "farwaniya",
    name: { ar: "الفروانية", en: "Al Farwaniyah" },
    tagline: { ar: "المحافظة الأكثر سكاناً", en: "The most populous governorate" },
    description: {
      ar: "تقع في قلب البلاد وتضم مطار الكويت الدولي ومجمع الأفنيوز الشهير، وهي بوتقة تنصهر فيها جنسيات العالم وتُمثّل تنوّع المجتمع الكويتي الحديث.",
      en: "At the heart of the country, home to Kuwait International Airport and The Avenues. A melting pot of nationalities that represents the diversity of modern Kuwaiti society.",
    },
    shape: "180,272 300,250 332,300 372,344 300,402 200,384",
    label: { x: 268, y: 322 },
    color: "oklch(0.78 0.09 55)",
    colorActive: "oklch(0.68 0.13 52)",
    areaKm2: 204,
    population: "≈ 1,100,000",
    points: 100,
    landmarks: [
      {
        id: "avenues",
        name: { ar: "مجمع الأفنيوز", en: "The Avenues Mall" },
        category: { ar: "تسوق", en: "Shopping" },
        description: {
          ar: "أكبر مجمعات التسوق في الكويت بمساحة 400,000 م² وأحد أكبرها في الشرق الأوسط، يضم أكثر من 1000 متجر ومطعم.",
          en: "Kuwait's largest mall at 400,000 m², one of the Middle East's biggest, with over 1,000 shops and restaurants.",
        },
      },
      {
        id: "airport",
        name: { ar: "مطار الكويت الدولي", en: "Kuwait Int'l Airport" },
        category: { ar: "بوابة دولية", en: "International gateway" },
        description: {
          ar: "البوابة الجوية الرئيسية للبلاد، يخدم أكثر من 12 مليون مسافر سنوياً عبر أكثر من 50 شركة طيران.",
          en: "The country's main air gateway, serving over 12 million passengers annually via more than 50 airlines.",
        },
      },
      {
        id: "rai",
        name: { ar: "منطقة الري التجارية", en: "Rai Commercial District" },
        category: { ar: "تجارة", en: "Commerce" },
        description: {
          ar: "مركز تجاري وصناعي حيوي يضم شركات التجزئة والمستودعات والمنشآت التجارية.",
          en: "A vibrant commercial and light-industrial hub hosting retail companies, warehouses and commercial facilities.",
        },
      },
      {
        id: "jleeb",
        name: { ar: "جليب الشيوخ", en: "Jleeb Al-Shuyoukh" },
        category: { ar: "مجتمع متنوع", en: "Diverse community" },
        description: {
          ar: "حيٌّ شعبي متعدد الجنسيات يعكس التنوع الكبير في المجتمع الكويتي ويزخر بالمطاعم العالمية.",
          en: "A multicultural neighbourhood reflecting Kuwait's great social diversity, brimming with international restaurants.",
        },
      },
    ],
    facts: [
      {
        ar: "الفروانية هي المحافظة الأكثر سكاناً في الكويت وتضم نحو 35% من إجمالي السكان.",
        en: "Farwaniyah is Kuwait's most populous governorate, housing roughly 35% of the total population.",
      },
      {
        ar: "يُعدّ مجمع الأفنيوز من ضمن أكبر 10 مراكز تسوق في الشرق الأوسط من حيث المساحة.",
        en: "The Avenues mall ranks among the top 10 largest shopping centres in the Middle East by floor area.",
      },
      {
        ar: "يستقبل مطار الكويت الدولي رحلات إلى أكثر من 70 وجهة عالمية في جميع القارات.",
        en: "Kuwait International Airport operates flights to over 70 international destinations across all continents.",
      },
    ],
    notableAreas: [
      { ar: "خيطان", en: "Khaitan" },
      { ar: "العارضية", en: "Ardiya" },
      { ar: "الري", en: "Rai" },
      { ar: "جليب الشيوخ", en: "Jleeb Al-Shuyoukh" },
      { ar: "الرقعي", en: "Riqqa" },
      { ar: "الفروانية", en: "Farwaniya" },
    ],
  },
  {
    id: "mubarak",
    name: { ar: "مبارك الكبير", en: "Mubarak Al-Kabeer" },
    tagline: { ar: "الضواحي الهادئة", en: "Calm residential suburbs" },
    description: {
      ar: "أحدث محافظات الكويت تأسيساً عام 1999، ذات طابع سكني هادئ ومنظّم، تُطلّ على خليج الكويت وتجمع بين البيئة العائلية الهادئة والقُرب من المرافق الحيوية.",
      en: "Kuwait's newest governorate, established in 1999, with a quiet and organised residential character overlooking Kuwait Bay, blending a calm family environment with proximity to key facilities.",
    },
    shape: "300,402 372,344 452,318 456,398 380,432",
    label: { x: 388, y: 380 },
    color: "oklch(0.72 0.08 320)",
    colorActive: "oklch(0.62 0.11 322)",
    areaKm2: 104,
    population: "≈ 270,000",
    points: 130,
    landmarks: [
      {
        id: "sadu",
        name: { ar: "بيت السدو", en: "Sadu House" },
        category: { ar: "حرف تراثية", en: "Heritage crafts" },
        description: {
          ar: "مركز تراثي يحتفي بفن السدو البدوي (النسيج اليدوي)، أُدرج في قائمة التراث غير المادي لليونسكو.",
          en: "A heritage centre celebrating Bedouin Sadu weaving, inscribed on UNESCO's Intangible Cultural Heritage list.",
        },
      },
      {
        id: "sabah-salem",
        name: { ar: "صباح السالم", en: "Sabah Al-Salem" },
        category: { ar: "مجتمع سكني", en: "Residential community" },
        description: {
          ar: "من أكبر وأرقى المناطق السكنية المخطّطة في المحافظة، بشوارع منظّمة وخدمات متكاملة.",
          en: "One of the largest and most prestigious planned residential districts in the governorate, with organised streets and full services.",
        },
      },
      {
        id: "messila-beach",
        name: { ar: "شاطئ المسيلة", en: "Messila Beach" },
        category: { ar: "طبيعة وترفيه", en: "Nature & leisure" },
        description: {
          ar: "شاطئ رملي هادئ يُقبل عليه العائلات الكويتية للترفيه والاسترخاء، مزوّد بمرافق ترفيهية.",
          en: "A calm sandy beach popular with Kuwaiti families for leisure and relaxation, with recreational facilities.",
        },
      },
      {
        id: "funaitees",
        name: { ar: "ميناء الفنيطيس", en: "Funaitees Harbour" },
        category: { ar: "صيد", en: "Fishing" },
        description: {
          ar: "ميناء صيد تقليدي ومحطة لليخوت، يُجسّد الموروث البحري الكويتي في صيد الأسماك.",
          en: "A traditional fishing harbour and yacht marina that embodies Kuwait's maritime fishing heritage.",
        },
      },
    ],
    facts: [
      {
        ar: "تأسست محافظة مبارك الكبير عام 1999 لتكون أحدث محافظات البلاد، انفصلت عن محافظة حولي.",
        en: "Mubarak Al-Kabeer was established in 1999 as Kuwait's newest governorate, split from Hawalli.",
      },
      {
        ar: "تُعدّ من أهدأ المحافظات وأنظمها عمرانياً، وتُفضّلها العائلات الكويتية للسكن.",
        en: "It is considered one of the quietest and most urbanely organised governorates, preferred by Kuwaiti families.",
      },
      {
        ar: "سُمّيت نسبةً للشيخ مبارك الكبير «مبارك الصباح» أحد أبرز حكام الكويت التاريخيين.",
        en: "Named after Sheikh Mubarak Al-Kabeer ('Mubarak Al-Sabah'), one of Kuwait's most prominent historical rulers.",
      },
    ],
    notableAreas: [
      { ar: "المسيلة", en: "Messila" },
      { ar: "أبو حليفة", en: "Abu Halifa" },
      { ar: "الفنيطيس", en: "Funaitees" },
      { ar: "صباح السالم", en: "Sabah Al-Salem" },
      { ar: "العقيلة", en: "Aqeela" },
      { ar: "مبارك الكبير", en: "Mubarak Al-Kabeer" },
    ],
  },
  {
    id: "ahmadi",
    name: { ar: "الأحمدي", en: "Al Ahmadi" },
    tagline: { ar: "عاصمة النفط والبحر", en: "The oil and sea capital" },
    description: {
      ar: "محافظة جنوبية شاسعة هي مهد صناعة النفط الكويتية وموطن حقل برقان العملاق. تمتد من الفحيحيل المطلّة على البحر جنوباً حتى منطقة الوفرة الزراعية، وتتميز بطابعها الصناعي والطبيعي الفريد.",
      en: "A vast southern governorate and birthplace of Kuwait's oil industry, home to the giant Burgan field. It stretches from the seafront Fahaheel south to the agricultural Wafra area, with a unique industrial and natural character.",
    },
    shape: "92,300 180,272 200,384 300,402 380,432 456,398 460,520 200,540 96,470",
    label: { x: 250, y: 460 },
    color: "oklch(0.66 0.08 30)",
    colorActive: "oklch(0.57 0.13 28)",
    areaKm2: 5120,
    population: "≈ 980,000",
    points: 140,
    landmarks: [
      {
        id: "al-kout",
        name: { ar: "مجمع الكوت", en: "Al Kout Mall" },
        category: { ar: "واجهة بحرية", en: "Waterfront" },
        description: {
          ar: "وجهة ترفيهية وتجارية راقية على ساحل البحر في الفحيحيل، تضم مرسى للقوارب ونوافير وأسواقاً ومطاعم.",
          en: "A premium leisure and retail destination on the Fahaheel seafront, with a boat marina, fountains, shops and restaurants.",
        },
      },
      {
        id: "burgan",
        name: { ar: "حقل برقان النفطي", en: "Burgan Oil Field" },
        category: { ar: "صناعة", en: "Industry" },
        description: {
          ar: "ثاني أكبر حقل نفطي في العالم، اكتُشف عام 1938 وبدأ الإنتاج عام 1946، وهو العمود الفقري للاقتصاد الكويتي.",
          en: "The world's second-largest oilfield, discovered in 1938 and producing since 1946 — the backbone of Kuwait's economy.",
        },
      },
      {
        id: "fintas-beach",
        name: { ar: "شاطئ الفنطاس", en: "Fintas Beach" },
        category: { ar: "طبيعة", en: "Nature" },
        description: {
          ar: "شواطئ رملية ممتدة تُطلّ على الخليج العربي، تُعدّ من أجمل الشواطئ الكويتية وتستقطب الزوار طوال العام.",
          en: "Expansive sandy beaches along the Arabian Gulf coast, considered among Kuwait's most beautiful and visited year-round.",
        },
      },
      {
        id: "khairan",
        name: { ar: "منتجعات الخيران", en: "Khairan Resorts" },
        category: { ar: "منتجع", en: "Resort" },
        description: {
          ar: "وجهة ترفيه وعطلات شهيرة في جنوب الكويت تضم قرى شاطئية وملاجئ للقوارب الشراعية والمحركة.",
          en: "A popular southern leisure destination with beach chalets and berths for sailing and motor boats.",
        },
      },
      {
        id: "wafra",
        name: { ar: "منطقة الوفرة الزراعية", en: "Wafra Agricultural Area" },
        category: { ar: "زراعة", en: "Agriculture" },
        description: {
          ar: "أكبر منطقة زراعية في الكويت، تُنتج الخضروات والفواكه وتُشكّل جزءاً من مشروع الأمن الغذائي الكويتي.",
          en: "Kuwait's largest agricultural zone, producing vegetables and fruits as part of Kuwait's food security project.",
        },
      },
      {
        id: "koc-hq",
        name: { ar: "مقرّ شركة نفط الكويت", en: "Kuwait Oil Company HQ" },
        category: { ar: "صناعة", en: "Industry" },
        description: {
          ar: "المقرّ الرئيسي لشركة نفط الكويت في مدينة الأحمدي، التي بُنيت خصيصاً لإسكان العمال النفطيين في الخمسينيات.",
          en: "Headquarters of Kuwait Oil Company in Ahmadi city, a planned town built in the 1950s to house oil workers.",
        },
      },
    ],
    facts: [
      {
        ar: "سُمّيت الأحمدي نسبةً للشيخ أحمد الجابر الصباح، وبُنيت مدينتها عام 1947 لإسكان عمال النفط.",
        en: "Ahmadi was named after Sheikh Ahmad Al-Jaber Al-Sabah; its city was built in 1947 to house oil workers.",
      },
      {
        ar: "حقل برقان وحده يحمل نحو 70 مليار برميل من الاحتياطيات النفطية المؤكّدة.",
        en: "The Burgan field alone holds around 70 billion barrels of proven oil reserves.",
      },
      {
        ar: "تُعدّ الأحمدي ثاني أكبر محافظات الكويت مساحةً وتضم منفذ نويصيب الحدودي مع المملكة العربية السعودية.",
        en: "Ahmadi is Kuwait's second-largest governorate by area and includes the Nuwaisib border crossing with Saudi Arabia.",
      },
      {
        ar: "تحتضن المحافظة ميناء شعيبة الصناعي وميناء الأحمدي النفطي، وهما من أكبر موانئ المنطقة.",
        en: "The governorate hosts Shuaiba Industrial Port and Ahmadi Oil Port, among the region's largest.",
      },
    ],
    notableAreas: [
      { ar: "الفحيحيل", en: "Fahaheel" },
      { ar: "المنقف", en: "Mangaf" },
      { ar: "أبو حليفة", en: "Abu Halifa" },
      { ar: "الوفرة", en: "Wafra" },
      { ar: "الخيران", en: "Khairan" },
      { ar: "الفنطاس", en: "Fintas" },
    ],
  },
]

export const TOTAL_POINTS = GOVERNORATES.reduce((sum, g) => sum + g.points, 0)
