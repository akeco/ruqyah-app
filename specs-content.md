# Software Specification: Quranic Healing & Ruqyah Web Application

This specification outlines the layout, content structure, and UI requirements for a multi-page web application focused on Ruqyah Shariah, counseling, and Prophetic medicine. 

## Architectural & Technical Constraints
* **Language Support:** Localization required for English (`en`) and Bosanski (`bs`).
* **Visual Theme:** Organic olive green, soft cream/parchment, white, and subtle gold accents. Incorporate traditional Islamic geometric structures and motifs where applicable.
* **SEO Quality:** Clean, keyword-optimized strings without special dashboard breaking characters or long dashes (m-dash).
* **Routes Implemented:**
  * `/` (Homepage)
  * `/lectures` (Text Articles Grid)
  * `/lectures/:id` (Individual Article View)
  * `/audio-lectures` (Audio Catalog Grid)
  * `/audio-lectures/:id` (Individual Audio Player View)

---

## Shared Application Layout

### Navigation Header Component
* **Global Navigation Links (EN):** Home, Lectures, Audio Library, Contact
* **Global Navigation Links (BS):** Početna, Predavanja, Audio Biblioteka, Kontakt

### Navigation Footer Component
* **English Text:** Healing comes only from Allah. Copyright 2026. All rights reserved.
* **Bosanski Text:** Lijek je jedino od Allaha. Autorska prava 2026. Sva prava zadržana.

---

## Detailed Page Content & Architecture

### 1. Homepage (`/`)

#### Hero Section
* **English Context:**
  * Headline: Authentic Spiritual Healing and Prophetic Medicine
  * Subheadline: Discover peace, protection, and holistic well-being through authentic Ruqyah Shariah and natural remedies from the Sunnah.
  * CTA Button: Book a Consultation
* **Bosanski Context:**
  * Naslov: Autentično duhovno liječenje i proročanska medicina
  * Podnaslov: Pronađite mir, zaštitu i cjelovito blagostanje kroz ispravnu Rukju i prirodne lijekove iz Sunneta.
  * CTA Dugme: Zakažite savjetovanje

#### Core Services Section (3 Grid Cards Below Hero)
* **Card 1 (Ruqyah Shariah):**
  * EN Title: Ruqyah Shariah Treatment
  * EN Description: Spiritual protection and therapy strictly in accordance with Islamic principles and Quranic recitation.
  * BS Naslov: Liječenje Rukjom
  * BS Tekst: Duhovna zaštita i terapija u potpunosti usklađena sa islamskim principima i učenjem Kur'ana.
* **Card 2 (Prophetic Remedies):**
  * EN Title: Prophetic Remedies
  * EN Description: Guidance on natural healing ingredients like black seed oil, pure honey, and olive leaf extracts.
  * BS Naslov: Proročanska medicina
  * BS Tekst: Savjeti o upotrebi prirodnih lijekova poput ćurekotovog ulja, čistog meda i ekstrakta maslinovog lista.
* **Card 3 (Spiritual Counseling):**
  * EN Title: Spiritual Counseling
  * EN Description: Personalized advice to strengthen your faith, ease anxiety, and build healthy daily protective habits.
  * BS Naslov: Duhovno savjetovanje
  * BS Tekst: Individualni savjeti za jačanje imana, ublažavanje tjeskobe i izgradnju svakodnevnih navika zaštite.

#### Contact Form Section (Positioned Directly Above Footer)
* **English Context:**
  * Section Title: Start Your Journey to Recovery
  * Input Form Fields: Full Name, Email Address, Message
  * Submit Action Button: Send Message
* **Bosanski Context:**
  * Naslov Sekcije: Započnite svoj put ka izlječenju
  * Polja Forme: Ime i prezime, Email adresa, Poruka
  * Dugme: Pošalji poruku

---

### 2. Lectures Grid Page (`/lectures`)

#### Page Header & Layout Description
* **English Context:**
  * Page Title: Educational Islamic Lectures and Articles
  * Description: Expand your knowledge on spiritual diseases, types of envy, and the correct methods of self-protection through the Quran.
* **Bosanski Context:**
  * Naslov Stranice: Edukativna predavanja i tekstovi
  * Opis: Proširite svoje znanje o duhovnim bolestima, vrstama uroka i ispravnim metodama samopomoći i zaštite kroz Kur'an.

#### Data Grid Array (Routing Target: `/lectures/:id`)
* **Item 1:**
  * ID: `1`
  * EN Card Title: Understanding the Symptoms of Envy and Sihr
  * BS Kartica Naslov: Prepoznavanje simptoma uroka i sihra
* **Item 2:**
  * ID: `2`
  * EN Card Title: The Benefits of Olive Oil in Prophetic Medicine
  * BS Kartica Naslov: Blagodati maslinovog ulja u proročanskoj medicini

---

### 3. Individual Lecture Page (`/lectures/:id`)

#### Dynamic View Configuration (Example for ID: `1`)
* **English Context:**
  * Back Link Text: < Back to Lectures (Target: `/lectures`)
  * Article Title: Understanding the Symptoms of Envy and Sihr
  * Article Content Body: Spiritual health is just as important as physical health. Islamic teachings provide clear guidelines on how to identify the symptoms of negative spiritual influences like Ayn or Sihr. Constant blockages in life, unexplained anxiety, and sudden changes in behavior are common signs. The primary cure lies in consistent morning and evening remembrance, regular prayer, and reciting specific verses from the Holy Quran.
* **Bosanski Context:**
  * Nazad Link: < Nazad na predavanja (Target: `/lectures`)
  * Naslov: Prepoznavanje simptoma uroka i sihra
  * Glavni Tekst: Duhovno zdravlje je podjednako važno kao i fizičko. Islamska učenja pružaju jasne smjernice o tome kako prepoznati simptome negativnih duhovnih utjecaja poput uroka ili sihra. Česte blokade u životu, neobjašnjiva tjeskoba i nagle promjene u ponašanju su česti znakovi. Primarni lijek leži u ustrajnom jutarnjem i večernjem zikru, redovnom namazu i učenju specifičnih ajeta iz Časnog Kur'ana.

---

### 4. Audio Lectures Catalog (`/audio-lectures`)

#### Page Header & Layout Description
* **English Context:**
  * Page Title: Audio Lectures and Ruqyah Recitations
  * Description: Listen to authentic educational audio files, lectures from reliable scholars, and continuous Ruqyah recitations for home protection.
* **Bosanski Context:**
  * Naslov Stranice: Audio predavanja i učenje Rukje
  * Opis: Slušajte autentične edukativne audio zapise, predavanja provjerenih alima i učenje Rukje za zaštitu vašeg doma.

#### Audio Catalog Grid Array (Routing Target: `/audio-lectures/:id`)
* **Audio Item 1:**
  * ID: `1`
  * EN Card Title: Full Ruqyah Shariah for Protection and Healing
  * BS Kartica Naslov: Cjelovita Rukja za zaštitu i iscjeljenje
* **Audio Item 2:**
  * ID: `2`
  * EN Card Title: How to Protect Your Home and Family from Evil
  * BS Kartica Naslov: Kako zaštititi kuću i porodicu od zla

---

### 5. Individual Audio View Page (`/audio-lectures/:id`)

#### Player UI Configuration (Example for ID: `1`)
* **English Context:**
  * Back Link Text: < Back to Audio Library (Target: `/audio-lectures`)
  * Track Title: Full Ruqyah Shariah for Protection and Healing
  * Description Component: This audio recording features a powerful and slow recitation of verses from Surah Al-Baqarah, Ayat al-Kursi, and the last three chapters of the Quran. It is highly recommended to listen to this recitation in a state of calm focus or to let it play in your house to repel negative energy.
* **Bosanski Context:**
  * Nazad Link: < Nazad na audio biblioteku (Target: `/audio-lectures`)
  * Naslov: Cjelovita Rukja za zaštitu i iscjeljenje
  * Opis: Ovaj audio snimak sadrži smireno i ustrajno učenje odabranih ajeta iz Sure Al-Baqarah, Ajetul-Kursije i posljednjih sura iz Kur'ana. Preporučuje se slušanje ovog zapisa u stanju smirenosti i fokusa, ili puštanje unutar doma radi uklanjanja negativne energije.
* **Functional Feature Requirement:** Implement an HTML5 `<audio>` player block mapping to corresponding backend media source URLs.