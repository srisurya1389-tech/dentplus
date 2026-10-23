'use strict';
/* =========================================================
   CLINIC SETTINGS — edit these values to update the site
   ========================================================= */
const CFG = {
  whatsapp: { dental: '919440919770', family: '919492080487' }, // numbers that receive booking requests
  sessions: [[9*60, 14*60], [16*60, 21*60]],                     // opening hours (minutes from midnight, IST)
  reviewsUrl: 'https://www.google.com/maps/search/?api=1&query=Dent+Plus+Multi+Speciality+Dental+%26+Family+Clinic+Ashok+Nagar+Guntur'
};

/* PATIENT REVIEWS — add only real reviews (with the patient's permission).
   Example:
   { name:'Patient name', treatment:{en:'Root Canal Treatment', te:'రూట్ కెనాల్ చికిత్స'},
     text:{en:'Their words…', te:'వారి మాటలు…'} },
*/
const REVIEWS = [];

/* ---------- translations: [English, Telugu] ---------- */
const T = {
  skip:['Skip to content','కంటెంట్‌కు వెళ్ళండి'],
  hours:['9:00 AM – 2:00 PM · 4:00 PM – 9:00 PM','ఉదయం 9:00 – మధ్యాహ్నం 2:00 · సాయంత్రం 4:00 – రాత్రి 9:00'],
  hoursShort:['9 AM–2 PM · 4–9 PM','ఉ. 9–మ. 2 · సా. 4–రా. 9'],
  tbLoc:['Ashok Nagar, Guntur','అశోక్ నగర్, గుంటూరు'],
  brandSub:['Multispeciality Dental &amp; Family Clinic','మల్టీ స్పెషాలిటీ డెంటల్ &amp; ఫ్యామిలీ క్లినిక్'],
  nAbout:['About','మా గురించి'], nServices:['Services','సేవలు'], nDoctors:['Doctors','డాక్టర్లు'], nWhy:['Why Dent Plus','ఎందుకు డెంట్ ప్లస్'],
  nReviews:['Patient Stories','పేషెంట్ అనుభవాలు'], nContact:['Contact','సంప్రదించండి'], nFaq:['FAQ','సందేహాలు'],
  bookBtn:['Book Appointment','అపాయింట్‌మెంట్ బుక్ చేయండి'],
  heroEyebrow:['Beautiful smile. Healthy teeth.','అందమైన నవ్వు… ఆరోగ్యవంతమైన దంతాలు!'],
  heroH1:['Expert dental &amp; family care, <em>designed around you.</em>','మీ కోసమే — నిపుణుల <em>దంత వైద్యం &amp; కుటుంబ వైద్యం.</em>'],
  heroLead:['Four specialist doctors under one roof in Guntur — from dental implants and root canals to eye care, child health and women’s health.','గుంటూరులో ఒకే చోట నలుగురు నిపుణులైన డాక్టర్లు — డెంటల్ ఇంప్లాంట్లు, రూట్ కెనాల్ నుండి కంటి వైద్యం, పిల్లల ఆరోగ్యం మరియు స్త్రీల ఆరోగ్యం వరకు.'],
  heroCta1:['Book an Appointment','అపాయింట్‌మెంట్ బుక్ చేయండి'], heroCta2:['Explore Services','సేవలు చూడండి'],
  trust1:['Experienced specialists','అనుభవజ్ఞులైన నిపుణులు'], trust2:['Dental + family care','దంత + కుటుంబ వైద్యం'], trust3:['Open till 9 PM','రాత్రి 9 వరకు'],
  gRating:['Google rating','గూగుల్ రేటింగ్'],
  qa1:['Book an Appointment','అపాయింట్‌మెంట్ బుక్ చేయండి'], qa2:['Find a Doctor','డాక్టర్‌ను ఎంచుకోండి'], qa3:['Dental Treatments','దంత చికిత్సలు'],
  qa4:['Family Clinic','ఫ్యామిలీ క్లినిక్'], qa5:['Urgent Care','అత్యవసర వైద్యం'], qa6:['Get Directions','దారి చూపించు'],
  aboutEy:['About Dent Plus','డెంట్ ప్లస్ గురించి'],
  aboutH:['Specialist dental care and family medicine, together.','నిపుణుల దంత వైద్యం, కుటుంబ వైద్యం — ఒకే చోట.'],
  aboutP:['Dent Plus Multispeciality Dental &amp; Family Clinic brings specialist dentistry and everyday family medicine under one roof in Guntur. Our doctors care for smiles, eyes, children, women and the whole family — with clear explanations and personal attention at every visit.','డెంట్ ప్లస్ మల్టీ స్పెషాలిటీ డెంటల్ &amp; ఫ్యామిలీ క్లినిక్ గుంటూరులో నిపుణుల దంత వైద్యాన్ని మరియు కుటుంబ వైద్యాన్ని ఒకే చోట అందిస్తుంది. మా డాక్టర్లు దంతాలు, కళ్ళు, పిల్లలు, స్త్రీలు మరియు కుటుంబం మొత్తం ఆరోగ్యాన్ని — ప్రతి విజిట్‌లో స్పష్టమైన వివరణ, వ్యక్తిగత శ్రద్ధతో చూసుకుంటారు.'],
  st1:['Specialist doctors','నిపుణులైన డాక్టర్లు'], st2:['Treatments &amp; services','చికిత్సలు &amp; సేవలు'], st3:['Clinic locations in Guntur','గుంటూరులో క్లినిక్‌లు'], st4:['Patient rating on Google','గూగుల్‌లో పేషెంట్ రేటింగ్'],
  svcEy:['Our Services','మా సేవలు'], svcH:['Explore our treatments','మా చికిత్సలు'],
  svcP:['Complete dental care for every age, plus a family clinic for eyes, children, women and everyday health.','అన్ని వయసుల వారికి పూర్తి దంత వైద్యం, అలాగే కళ్ళు, పిల్లలు, స్త్రీలు మరియు రోజువారీ ఆరోగ్యం కోసం ఫ్యామిలీ క్లినిక్.'],
  tabDental:['Dental Care','దంత వైద్యం'], tabFamily:['Family Clinic','ఫ్యామిలీ క్లినిక్'],
  svcNote:['Not sure which treatment you need? Book a consultation and our doctors will guide you.','మీకు ఏ చికిత్స అవసరమో తెలియదా? కన్సల్టేషన్ బుక్ చేయండి — మా డాక్టర్లు మీకు సరైన మార్గం చూపిస్తారు.'],
  learn:['Learn more','మరింత తెలుసుకోండి'],
  whyEy:['Why Dent Plus','ఎందుకు డెంట్ ప్లస్'], whyH:['Why patients choose Dent Plus','పేషెంట్లు డెంట్ ప్లస్‌ను ఎందుకు ఎంచుకుంటారు'],
  whyP:['Trusted specialists, gentle treatment and care that fits around your family’s life.','నమ్మకమైన నిపుణులు, సున్నితమైన చికిత్స, మీ కుటుంబ జీవితానికి అనుకూలమైన సంరక్షణ.'],
  w1h:['Specialists for your smile — and your whole family','మీ నవ్వుకు — మీ కుటుంబం మొత్తానికి నిపుణులు'],
  w1p:['Two MDS prosthodontists and implantologists look after your teeth, while experienced doctors care for children, eyes, women’s health and general medicine. One trusted clinic for the entire family.','ఇద్దరు MDS ప్రోస్తోడాంటిస్ట్ &amp; ఇంప్లాంటాలజిస్టులు మీ దంతాలను చూసుకుంటారు; అనుభవజ్ఞులైన డాక్టర్లు పిల్లలు, కళ్ళు, స్త్రీల ఆరోగ్యం మరియు జనరల్ మెడిసిన్ చూస్తారు. కుటుంబం మొత్తానికి ఒకే నమ్మకమైన క్లినిక్.'],
  w1a:['Dental and medical care in one place','దంత మరియు వైద్య సేవలు ఒకే చోట'], w1b:['Doctors who explain every option clearly','ప్రతి చికిత్స గురించి స్పష్టంగా వివరించే డాక్టర్లు'],
  w2h:['Advanced, gentle dental treatment','ఆధునిక, సున్నితమైన దంత చికిత్స'],
  w2p:['From dental implants and fixed teeth to laser gum treatment and Invisalign clear aligners, every treatment is planned around your comfort and long-term oral health.','డెంటల్ ఇంప్లాంట్లు, ఫిక్స్‌డ్ దంతాల నుండి లేజర్ చిగుళ్ళ చికిత్స, ఇన్విజలైన్ క్లియర్ అలైనర్ల వరకు — ప్రతి చికిత్స మీ సౌకర్యం, దీర్ఘకాల దంత ఆరోగ్యం దృష్టిలో ఉంచుకుని ప్లాన్ చేయబడుతుంది.'],
  w2a:['Focus on implants and prosthodontics','ఇంప్లాంట్లు &amp; ప్రోస్తోడాంటిక్స్‌లో ప్రత్యేకత'], w2b:['Painless extractions and comfort-first care','నొప్పిలేని పన్ను తొలగింపు, సౌకర్యవంతమైన చికిత్స'],
  w3h:['Prevention for every age','ప్రతి వయసుకు ముందు జాగ్రత్త'],
  w3p:['Sealants and fluoride for children’s teeth, vaccinations, retina checks for diabetics and early cancer screening — we help you catch problems early, when they are easiest to treat.','పిల్లల దంతాలకు సీలెంట్స్ &amp; ఫ్లోరైడ్, టీకాలు, షుగర్ ఉన్నవారికి రెటీనా పరీక్షలు, ప్రాథమిక క్యాన్సర్ స్క్రీనింగ్ — సమస్యలను తొందరగా గుర్తించి, సులభంగా చికిత్స చేయడంలో సహాయం చేస్తాం.'],
  w3a:['Vaccines for children and adults','పిల్లలకు మరియు పెద్దలకు టీకాలు'], w3b:['Pap smear tests and HPV vaccination','పాప్ స్మియర్ పరీక్ష మరియు HPV టీకా'],
  w4h:['Convenient timings, two locations','అనుకూల సమయాలు, రెండు క్లినిక్‌లు'],
  w4p:['Open in the morning and in the evening until 9 PM, at Ashok Nagar and Gunturvari Thota in Guntur — so care fits around school and work.','అశోక్ నగర్ మరియు గుంటూరువారితోటలో — ఉదయం మరియు సాయంత్రం రాత్రి 9 వరకు అందుబాటులో. స్కూల్, ఉద్యోగ సమయాలకు ఇబ్బంది లేకుండా.'],
  w4a:['9 AM – 2 PM and 4 PM – 9 PM','ఉదయం 9 – మధ్యాహ్నం 2, సాయంత్రం 4 – రాత్రి 9'], w4b:['Easy booking by WhatsApp or phone','వాట్సాప్ లేదా ఫోన్ ద్వారా సులభంగా బుకింగ్'],
  docEy:['Find a Doctor','డాక్టర్‌ను ఎంచుకోండి'], docH:['Meet our specialists','మా నిపుణులను కలవండి'], docP:['Qualified, registered doctors who take the time to listen.','మీ సమస్యను శ్రద్ధగా వినే అర్హత కలిగిన, రిజిస్టర్డ్ డాక్టర్లు.'],
  fAll:['All Doctors','అందరు డాక్టర్లు'], docSearch:['Search by name or specialty','పేరు లేదా స్పెషాలిటీతో వెతకండి'],
  viewProfile:['View Profile','ప్రొఫైల్ చూడండి'], book:['Book','బుక్ చేయండి'], noDoc:['No doctors match your search.','మీ శోధనకు సరిపోయే డాక్టర్లు లేరు.'],
  reg:['Reg. No.','రిజి. నం.'], langs:['Telugu, English','తెలుగు, ఇంగ్లీష్'], availNow:['Available now','ఇప్పుడు అందుబాటులో'], availLater:['Next available','తదుపరి అందుబాటు'],
  jEy:['Your Visit','మీ విజిట్'], jH:['Simple, predictable, comfortable','సులభం, స్పష్టం, సౌకర్యవంతం'], jP:['Here’s what to expect from the moment you book.','బుక్ చేసిన క్షణం నుండి ఏమి జరుగుతుందో ఇక్కడ చూడండి.'],
  bkEy:['Book an Appointment','అపాయింట్‌మెంట్ బుకింగ్'], bkH:['Book your visit in under a minute','ఒక్క నిమిషంలో మీ విజిట్ బుక్ చేయండి'],
  bkP:['Choose a treatment, doctor and time. Your request goes straight to the clinic on WhatsApp, and our team will confirm your appointment.','చికిత్స, డాక్టర్ మరియు సమయం ఎంచుకోండి. మీ రిక్వెస్ట్ నేరుగా వాట్సాప్‌లో క్లినిక్‌కు వెళ్తుంది, మా టీమ్ మీ అపాయింట్‌మెంట్‌ను కన్ఫర్మ్ చేస్తుంది.'],
  clDental:['Dental appointments','దంత వైద్యం అపాయింట్‌మెంట్లు'], clFamily:['Family clinic','ఫ్యామిలీ క్లినిక్'], clHours:['Clinic timings','క్లినిక్ సమయాలు'],
  back:['Back','వెనుకకు'], next:['Continue','కొనసాగించండి'], confirm:['Send on WhatsApp','వాట్సాప్‌లో పంపండి'],
  s1:['Choose a service','సేవను ఎంచుకోండి'], s2:['Choose a doctor','డాక్టర్‌ను ఎంచుకోండి'], s3:['Choose a date','తేదీ ఎంచుకోండి'], s4:['Choose a time','సమయం ఎంచుకోండి'], s5:['Your details','మీ వివరాలు'], s6:['Review &amp; confirm','చెక్ చేసి కన్ఫర్మ్ చేయండి'],
  stepOf:['Step {a} of 6','6 లో {a}వ దశ'],
  checkup:['General check-up / Not sure','జనరల్ చెకప్ / తెలియదు'], anyDoc:['Any available doctor','అందుబాటులో ఉన్న ఏ డాక్టర్ అయినా'], anyDocS:['We’ll assign the right specialist','సరైన నిపుణుడిని మేము కేటాయిస్తాము'],
  morning:['Morning','ఉదయం'], evening:['Evening','సాయంత్రం'], today:['Today','ఈరోజు'], noSlots:['No more slots today — please pick another date.','ఈరోజు ఇంకా స్లాట్లు లేవు — వేరే తేదీ ఎంచుకోండి.'],
  fName:['Patient name','పేషెంట్ పేరు'], fPhone:['Mobile number','మొబైల్ నంబర్'], fAge:['Age (optional)','వయసు (ఐచ్ఛికం)'], fLoc:['Preferred clinic','క్లినిక్ ఎంచుకోండి'], fNote:['Anything we should know? (optional)','ఏదైనా చెప్పాలనుకుంటున్నారా? (ఐచ్ఛికం)'],
  eName:['Please enter the patient’s name.','దయచేసి పేషెంట్ పేరు రాయండి.'], ePhone:['Please enter a valid 10-digit mobile number.','దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ రాయండి.'],
  sumService:['Service','సేవ'], sumDoctor:['Doctor','డాక్టర్'], sumDate:['Date','తేదీ'], sumTime:['Time','సమయం'], sumLoc:['Clinic','క్లినిక్'], sumName:['Patient','పేషెంట్'], sumPhone:['Mobile','మొబైల్'],
  bkNote:['This sends a booking request. Your appointment is confirmed once the clinic replies on WhatsApp or calls you.','ఇది బుకింగ్ రిక్వెస్ట్ మాత్రమే. క్లినిక్ వాట్సాప్‌లో రిప్లై ఇచ్చిన తర్వాత లేదా కాల్ చేసిన తర్వాత మీ అపాయింట్‌మెంట్ కన్ఫర్మ్ అవుతుంది.'],
  doneH:['Request ready to send','రిక్వెస్ట్ పంపడానికి సిద్ధం'], doneP:['WhatsApp has opened with your booking details — just tap send. Our team will confirm your appointment shortly. If WhatsApp didn’t open, call us instead.','మీ బుకింగ్ వివరాలతో వాట్సాప్ ఓపెన్ అయింది — సెండ్ నొక్కండి. మా టీమ్ త్వరలో మీ అపాయింట్‌మెంట్ కన్ఫర్మ్ చేస్తుంది. వాట్సాప్ ఓపెన్ కాకపోతే, మాకు కాల్ చేయండి.'],
  again:['Book another appointment','మరో అపాయింట్‌మెంట్ బుక్ చేయండి'], openWa:['Open WhatsApp again','వాట్సాప్ మళ్ళీ ఓపెన్ చేయండి'],
  bandEy:['Preventive Care','ముందు జాగ్రత్త వైద్యం'], bandH:['Get screened. Get vaccinated.','పరీక్షలు చేయించుకోండి. టీకాలు వేయించుకోండి.'],
  bandP:['Simple checks today can prevent serious problems tomorrow. Ask our doctors which screenings are right for you and your family.','ఈరోజు చేసే చిన్న పరీక్షలు రేపటి పెద్ద సమస్యలను నివారిస్తాయి. మీకు, మీ కుటుంబానికి ఏ పరీక్షలు అవసరమో మా డాక్టర్లను అడగండి.'],
  bandCta:['Book a Screening','స్క్రీనింగ్ బుక్ చేయండి'],
  tg1:['HPV vaccine','HPV టీకా'], tg2:['Pap smear test','పాప్ స్మియర్ పరీక్ష'], tg3:['Diabetic retina check','షుగర్ రోగులకు రెటీనా పరీక్ష'], tg4:['Child vaccinations','పిల్లల టీకాలు'], tg5:['BP, sugar &amp; thyroid','బి.పి, షుగర్ &amp; థైరాయిడ్'], tg6:['Kids’ sealants &amp; fluoride','పిల్లలకు సీలెంట్స్ &amp; ఫ్లోరైడ్'],
  rvEy:['Patient Stories','పేషెంట్ అనుభవాలు'], rvH:['What our patients say','మా పేషెంట్లు ఏమంటున్నారు'], rvP:['Real experiences from families who trust Dent Plus.','డెంట్ ప్లస్‌ను నమ్మిన కుటుంబాల నిజమైన అనుభవాలు.'],
  rvRate:['Average rating from patient reviews on Google.','గూగుల్‌లో పేషెంట్ రివ్యూల సగటు రేటింగ్.'], rvRead:['Read reviews on Google','గూగుల్‌లో రివ్యూలు చదవండి'], rvWrite:['Share your experience','మీ అనుభవాన్ని పంచుకోండి'],
  rvEmptyH:['Visited Dent Plus? Tell others about it.','డెంట్ ప్లస్‌కు వచ్చారా? మీ అనుభవాన్ని ఇతరులకు చెప్పండి.'],
  rvEmptyP:['Your review helps other families in Guntur find the right care. It only takes a minute on Google.','మీ రివ్యూ గుంటూరులోని ఇతర కుటుంబాలకు సరైన వైద్యం కనుగొనడంలో సహాయపడుతుంది. గూగుల్‌లో ఒక్క నిమిషం చాలు.'],
  faqEy:['Patient Resources','పేషెంట్ సమాచారం'], faqH:['Frequently asked questions','తరచుగా అడిగే ప్రశ్నలు'],
  faqP:['Answers to common questions about treatments and visits. Still unsure? Call us — we’re happy to help.','చికిత్సలు మరియు విజిట్‌ల గురించి సాధారణ ప్రశ్నలకు సమాధానాలు. ఇంకా సందేహమా? మాకు కాల్ చేయండి.'],
  urH:['Need urgent care?','అత్యవసర వైద్యం కావాలా?'],
  urP:['Severe tooth pain, swelling, a broken tooth or a child with fever? Call us during clinic hours and our team will guide you. For life-threatening emergencies, dial 108.','తీవ్రమైన పంటి నొప్పి, వాపు, విరిగిన పన్ను లేదా పిల్లలకు జ్వరమా? క్లినిక్ సమయాల్లో మాకు కాల్ చేయండి, మా టీమ్ మీకు సహాయం చేస్తుంది. ప్రాణాపాయ పరిస్థితుల్లో 108కి కాల్ చేయండి.'],
  urDental:['Dental: 94409 19770','దంత వైద్యం: 94409 19770'], urFamily:['Family: 94920 80487','ఫ్యామిలీ క్లినిక్: 94920 80487'],
  locEy:['Locations &amp; Contact','లొకేషన్లు &amp; సంప్రదింపు'], locH:['Visit us in Guntur','గుంటూరులో మమ్మల్ని సందర్శించండి'], locP:['Two convenient locations. Select a clinic to see it on the map.','రెండు అనుకూలమైన క్లినిక్‌లు. మ్యాప్‌లో చూడటానికి క్లినిక్‌ను ఎంచుకోండి.'],
  directions:['Get Directions','దారి చూపించు'], call:['Call','కాల్ చేయండి'], mainClinic:['Main clinic','ప్రధాన క్లినిక్'],
  addr1Short:['Door No. 5-72-31/3, Ashok Nagar, Guntur – 522002','డోర్ నెం. 5-72-31/3, అశోక్ నగర్, గుంటూరు – 522002'],
  ftDesc:['Specialist dental care and family medicine in Guntur — for healthy smiles and healthy families.','గుంటూరులో నిపుణుల దంత వైద్యం మరియు కుటుంబ వైద్యం — ఆరోగ్యకరమైన నవ్వులు, ఆరోగ్యకరమైన కుటుంబాల కోసం.'],
  ftDisc:['Information on this website is for general awareness and is not a substitute for a doctor’s consultation.','ఈ వెబ్‌సైట్‌లోని సమాచారం సాధారణ అవగాహన కోసం మాత్రమే; ఇది డాక్టర్ సలహాకు ప్రత్యామ్నాయం కాదు.'],
  mCall:['Call','కాల్'], mBook:['Book','బుక్'],
  openNow:['Open now','ఇప్పుడు తెరిచి ఉంది'], closed:['Closed','మూసి ఉంది'], closes:['closes {t}','{t}కి మూసివేత'], opens:['opens {t}','{t}కి తెరుచుకుంటుంది'], opensTom:['opens 9 AM tomorrow','రేపు ఉదయం 9కి తెరుచుకుంటుంది'],
  whoFor:['Who is it for?','ఎవరికి అవసరం?'], treatedBy:['Your doctors','మీ డాక్టర్లు'], bookThis:['Book this treatment','ఈ చికిత్స బుక్ చేయండి'],
  about:['About','గురించి'], qual:['Qualifications','అర్హతలు'], focus:['Areas of care','చికిత్స రంగాలు'], callClinic:['Call clinic','క్లినిక్‌కు కాల్']
};

/* ---------- data ---------- */
const SERVICES = [
  {id:'implants', cat:'dental', icon:'i-implant',
    n:['Dental Implants','డెంటల్ ఇంప్లాంట్లు'],
    d:['Fixed, natural-looking teeth for missing teeth, supported by dental implants.','పళ్ళు లేని చోట ఇంప్లాంట్ సహాయంతో సహజంగా కనిపించే ఫిక్స్‌డ్ దంతాలు.'],
    w:[['One or more missing teeth','ఒకటి లేదా అంతకంటే ఎక్కువ పళ్ళు లేనివారు'],['Loose or uncomfortable dentures','వదులుగా లేదా అసౌకర్యంగా ఉన్న కట్టుడు పళ్ళు ఉన్నవారు'],['Anyone wanting a permanent, fixed solution','శాశ్వత, ఫిక్స్‌డ్ పరిష్కారం కోరుకునేవారు']]},
  {id:'rct', cat:'dental', icon:'i-shield',
    n:['Root Canal Treatment','రూట్ కెనాల్ చికిత్స'],
    d:['Removes infection from decayed, painful teeth and saves your natural tooth.','పిప్పి పట్టిన, నొప్పిగా ఉన్న పంటిలోని ఇన్ఫెక్షన్ తొలగించి సహజ పంటిని కాపాడుతుంది.'],
    w:[['Severe or lingering tooth pain','తీవ్రమైన లేదా ఎక్కువ కాలం ఉండే పంటి నొప్పి'],['Sensitivity to hot or cold','వేడి, చల్లని వాటికి జివ్వుమనడం'],['Deep cavities or swelling near a tooth','లోతైన పిప్పి లేదా పంటి దగ్గర వాపు']]},
  {id:'dentures', cat:'dental', icon:'i-smile',
    n:['Dentures &amp; Fixed Teeth','కట్టుడు పళ్ళు &amp; ఫిక్స్‌డ్ దంతాలు'],
    d:['Removable or fixed replacement teeth to restore chewing and your smile.','నమలడానికి, నవ్వుకు అందం తిరిగి ఇచ్చే తీసిపెట్టుకునే లేదా ఫిక్స్‌డ్ దంతాలు.'],
    w:[['Several or all teeth missing','చాలా లేదా అన్ని పళ్ళు లేనివారు'],['Difficulty chewing or speaking','నమలడం లేదా మాట్లాడటంలో ఇబ్బంది'],['Replacing old, worn dentures','పాత కట్టుడు పళ్ళు మార్చుకోవాలనుకునేవారు']]},
  {id:'extraction', cat:'dental', icon:'i-feather',
    n:['Painless Extractions','నొప్పిలేని పన్ను తొలగింపు'],
    d:['Gentle removal of wisdom teeth and badly decayed teeth.','జ్ఞాన దంతాలు మరియు బాగా పుచ్చిపోయిన దంతాలను నొప్పి లేకుండా తొలగించడం.'],
    w:[['Painful or impacted wisdom teeth','నొప్పిగా ఉన్న లేదా ఇరుక్కుపోయిన జ్ఞాన దంతాలు'],['Teeth too damaged to save','కాపాడలేనంతగా పాడైన పళ్ళు'],['Before braces, when advised','క్లిప్పులకు ముందు, డాక్టర్ సూచిస్తే']]},
  {id:'gum', cat:'dental', icon:'i-zap',
    n:['Laser Gum Treatment','లేజర్ చిగుళ్ళ చికిత్స'],
    d:['Flap surgery with laser for gum disease and bleeding gums.','చిగుళ్ళ సమస్యలు మరియు రక్తస్రావానికి లేజర్ ద్వారా ఫ్లాప్ సర్జరీ.'],
    w:[['Bleeding or swollen gums','చిగుళ్ళ నుండి రక్తం లేదా వాపు'],['Bad breath that doesn’t go away','తగ్గని నోటి దుర్వాసన'],['Loose teeth or receding gums','కదిలే పళ్ళు లేదా తగ్గిపోతున్న చిగుళ్ళు']]},
  {id:'ortho', cat:'dental', icon:'i-spark',
    n:['Braces &amp; Invisalign','క్లిప్పులు &amp; ఇన్విజలైన్'],
    d:['Straighten protruding and crooked teeth with braces or clear aligners.','ఎత్తు పళ్ళు, వంకర పళ్ళను క్లిప్పులు లేదా క్లియర్ అలైనర్లతో సరిచేయడం.'],
    w:[['Protruding or crooked teeth','ఎత్తు పళ్ళు లేదా వంకర పళ్ళు'],['Gaps or crowding','పళ్ళ మధ్య ఖాళీలు లేదా గుంపుగా ఉండటం'],['Teens and adults wanting a straighter smile','అందమైన వరుస పళ్ళు కోరుకునే యువత, పెద్దలు']]},
  {id:'kids', cat:'dental', icon:'i-baby',
    n:['Children’s Dentistry','పిల్లల దంత వైద్యం'],
    d:['Preventive sealants, fluoride gel and early treatment to prevent crooked teeth.','ప్రివెంటివ్ సీలెంట్స్, ఫ్లోరైడ్ జెల్ మరియు వంకర పళ్ళు రాకుండా ముందస్తు (ఇంటర్‌సెప్టివ్) చికిత్స.'],
    w:[['Children’s first dental visit','పిల్లల మొదటి దంత పరీక్ష'],['Cavity prevention for growing teeth','పెరిగే పళ్ళకు పిప్పి రాకుండా రక్షణ'],['Early signs of crooked teeth','వంకర పళ్ళ ప్రారంభ లక్షణాలు']]},
  {id:'eye', cat:'family', icon:'i-eye',
    n:['Eye Care','కంటి వైద్యం'],
    d:['Complete eye check-ups, migraine evaluation and retina tests for diabetics.','సంపూర్ణ కంటి పరీక్షలు, మైగ్రైన్ పరీక్ష మరియు షుగర్ ఉన్నవారికి రెటీనా పరీక్షలు.'],
    w:[['Blurred vision or eye strain','మసకగా కనిపించడం లేదా కంటి అలసట'],['Chronic headaches or migraine','దీర్ఘకాలిక తలనొప్పి లేదా పార్శ్వపు నొప్పి (మైగ్రైన్)'],['People with diabetes (retina check)','షుగర్ ఉన్నవారు (రెటీనా పరీక్ష)']]},
  {id:'vaccines', cat:'family', icon:'i-syringe',
    n:['Vaccinations','టీకాలు'],
    d:['Protective vaccines for children and adults.','పిల్లలకు మరియు పెద్దలకు వ్యాధి నిరోధక టీకాలు.'],
    w:[['Infants and children (as per schedule)','శిశువులు, పిల్లలు (షెడ్యూల్ ప్రకారం)'],['Adults needing boosters','బూస్టర్ డోసులు అవసరమైన పెద్దలు'],['HPV vaccine for girls and women','అమ్మాయిలు, మహిళలకు HPV టీకా']]},
  {id:'general', cat:'family', icon:'i-pulse',
    n:['General Medicine','జనరల్ మెడిసిన్'],
    d:['Care for BP, diabetes, thyroid, gastric and heart-related problems.','బి.పి, షుగర్, థైరాయిడ్, గ్యాస్ మరియు గుండె సంబంధిత సమస్యలకు చికిత్స.'],
    w:[['Blood pressure and diabetes','బి.పి మరియు షుగర్'],['Thyroid and gastric problems','థైరాయిడ్ మరియు గ్యాస్ సమస్యలు'],['Fever, infections and routine check-ups','జ్వరం, ఇన్ఫెక్షన్లు, సాధారణ చెకప్‌లు']]},
  {id:'women', cat:'family', icon:'i-heart',
    n:['Women’s Health &amp; Pregnancy','స్త్రీల ఆరోగ్యం &amp; గర్భధారణ'],
    d:['Pregnancy care, women’s health, family planning and counselling.','గర్భిణీ సంరక్షణ, స్త్రీ సంబంధిత వ్యాధులు, ఫ్యామిలీ ప్లానింగ్ మరియు కౌన్సెలింగ్.'],
    w:[['Expecting mothers','గర్భిణీ స్త్రీలు'],['Menstrual and gynaecological concerns','నెలసరి మరియు స్త్రీ సంబంధిత సమస్యలు'],['Family planning advice','ఫ్యామిలీ ప్లానింగ్ సలహాలు']]},
  {id:'child', cat:'family', icon:'i-smile',
    n:['Child Health','పిల్లల ఆరోగ్యం'],
    d:['Diagnosis and treatment of all common childhood illnesses.','చిన్న పిల్లల్లో వచ్చే అన్ని రకాల వ్యాధులకు చికిత్స.'],
    w:[['Fever, cough and colds','జ్వరం, దగ్గు, జలుబు'],['Growth and development checks','ఎదుగుదల పరీక్షలు'],['Newborn and infant care','నవజాత శిశువులు, చిన్నారుల సంరక్షణ']]},
  {id:'cancer', cat:'family', icon:'i-ribbon',
    n:['Cancer Screening &amp; HPV Vaccine','క్యాన్సర్ స్క్రీనింగ్ &amp; HPV టీకా'],
    d:['Early cancer screening, Pap smear tests and HPV vaccination.','ప్రాథమిక క్యాన్సర్ నిర్ధారణ పరీక్షలు, పాప్ స్మియర్ పరీక్షలు మరియు HPV టీకా.'],
    w:[['Women due for a Pap smear','పాప్ స్మియర్ పరీక్ష చేయించుకోవాల్సిన మహిళలు'],['Girls and young women (HPV vaccine)','అమ్మాయిలు, యువతులు (HPV టీకా)'],['Anyone with a family history of cancer','కుటుంబంలో క్యాన్సర్ చరిత్ర ఉన్నవారు']]}
];

const DOCTORS = [
  {id:'pk', cat:'dental', ini:'PK', grad:'linear-gradient(145deg,#1E5FBF,#0B2545)',
    n:['Dr. G. Phani Krishna','డా. జి. ఫణి కృష్ణ'], q:'MDS, FICOI (USA)',
    sp:['Prosthodontist &amp; Implantologist','ప్రోస్తోడాంటిస్ట్ &amp; ఇంప్లాంటాలజిస్ట్'],
    ex:['Professor, Sibar Institute of Dental Sciences','ప్రొఫెసర్, సిబార్ ఇన్‌స్టిట్యూట్ ఆఫ్ డెంటల్ సైన్సెస్'], reg:'A6329',
    svc:['implants','dentures','rct','extraction','gum','ortho','kids']},
  {id:'bd', cat:'dental', ini:'BD', grad:'linear-gradient(145deg,#3A8FD8,#13315C)',
    n:['Dr. B. Deepthi','డా. బి. దీప్తి'], q:'MDS (Osmania)',
    sp:['Consultant Prosthodontist &amp; Implantologist','కన్సల్టెంట్ ప్రోస్తోడాంటిస్ట్ &amp; ఇంప్లాంటాలజిస్ట్'],
    ex:['Specialist in fixed teeth, dentures and implants','ఫిక్స్‌డ్ దంతాలు, కట్టుడు పళ్ళు, ఇంప్లాంట్లలో నిపుణురాలు'], reg:'A9254',
    svc:['implants','dentures','rct','extraction','gum','ortho','kids']},
  {id:'vg', cat:'family', ini:'VG', grad:'linear-gradient(145deg,#2B9A8F,#13315C)',
    n:['Dr. G. Venu Gopal Rao','డా. జి. వేణు గోపాల రావు'], q:'MBBS, Sr. Resident (Paediatrics)',
    sp:['Family Physician &amp; Paediatrician','ఫ్యామిలీ ఫిజీషియన్ &amp; పీడియాట్రీషియన్'],
    ex:['Care for children and the whole family','పిల్లలు మరియు కుటుంబం మొత్తానికి వైద్యం'], reg:'',
    svc:['general','child','vaccines']},
  {id:'pr', cat:'family', ini:'PR', grad:'linear-gradient(145deg,#6A6FD6,#13315C)',
    n:['Dr. T. Padmaja Rani','డా. టి. పద్మజ రాణి'], q:'MBBS, D.O.',
    sp:['Eye, Pregnancy &amp; Women’s Health Specialist','నేత్ర, గర్భిణీ &amp; స్త్రీ వ్యాధుల నిపుణులు'],
    ex:['Eye care and women’s health under one roof','కంటి వైద్యం మరియు స్త్రీల ఆరోగ్యం ఒకే చోట'], reg:'',
    svc:['eye','women','cancer','vaccines']}
];

const JOURNEY = [
  [['Book your visit','మీ విజిట్ బుక్ చేయండి'],['Online, on WhatsApp or by phone.','ఆన్‌లైన్‌లో, వాట్సాప్‌లో లేదా ఫోన్ ద్వారా.']],
  [['Meet your doctor','డాక్టర్‌ను కలవండి'],['A calm, unhurried consultation.','ప్రశాంతంగా, తొందర లేని కన్సల్టేషన్.']],
  [['Get your diagnosis','పరీక్ష &amp; నిర్ధారణ'],['A careful examination and tests if needed.','జాగ్రత్తగా పరీక్ష, అవసరమైతే టెస్టులు.']],
  [['Understand your plan','చికిత్స ప్లాన్ తెలుసుకోండి'],['Clear options, timelines and costs.','స్పష్టమైన ఆప్షన్లు, సమయం, ఖర్చు.']],
  [['Begin your care','చికిత్స ప్రారంభం'],['Gentle treatment, with comfort first.','సౌకర్యానికి ప్రాధాన్యతతో సున్నితమైన చికిత్స.']],
  [['Follow-up &amp; support','ఫాలో-అప్ &amp; సహాయం'],['We stay with you after treatment.','చికిత్స తర్వాత కూడా మీకు తోడుగా.']]
];

const FAQ = [
  [['Do I need an appointment?','అపాయింట్‌మెంట్ తప్పనిసరా?'],['We recommend booking ahead so your doctor is available and your waiting time is shorter. You can book on this website, on WhatsApp or by calling the clinic.','మీ డాక్టర్ అందుబాటులో ఉండేలా, వేచి ఉండే సమయం తగ్గేలా ముందుగా బుక్ చేయమని సూచిస్తాం. ఈ వెబ్‌సైట్‌లో, వాట్సాప్‌లో లేదా ఫోన్ చేసి బుక్ చేయవచ్చు.']],
  [['Is root canal treatment painful?','రూట్ కెనాల్ చికిత్స నొప్పిగా ఉంటుందా?'],['Root canal treatment is done under local anaesthesia, so most patients feel little discomfort — often similar to getting a filling. It relieves the pain caused by the infection.','రూట్ కెనాల్ చికిత్స లోకల్ అనస్థీషియా ఇచ్చి చేస్తారు, కాబట్టి చాలా మందికి పెద్దగా ఇబ్బంది ఉండదు — సాధారణ ఫిల్లింగ్‌లాగే ఉంటుంది. ఇది ఇన్ఫెక్షన్ వల్ల వచ్చే నొప్పిని తగ్గిస్తుంది.']],
  [['How long do dental implants last?','డెంటల్ ఇంప్లాంట్లు ఎంత కాలం ఉంటాయి?'],['With good brushing habits and regular check-ups, implants can last for many years — often a lifetime. Your dentist will check your bone and gum health before recommending them.','సరిగ్గా బ్రష్ చేయడం, క్రమం తప్పకుండా చెకప్‌లతో ఇంప్లాంట్లు చాలా సంవత్సరాలు — తరచుగా జీవితాంతం — ఉంటాయి. సూచించే ముందు డాక్టర్ మీ ఎముక, చిగుళ్ళ ఆరోగ్యాన్ని పరీక్షిస్తారు.']],
  [['When should my child first see a dentist?','పిల్లల్ని మొదటిసారి దంత వైద్యుడికి ఎప్పుడు చూపించాలి?'],['Ideally when the first tooth appears or by the first birthday. Sealants and fluoride gel help protect growing teeth from cavities.','మొదటి పన్ను వచ్చినప్పుడు లేదా మొదటి పుట్టినరోజు నాటికి చూపించడం మంచిది. సీలెంట్స్, ఫ్లోరైడ్ జెల్ పెరిగే పళ్ళను పిప్పి నుండి కాపాడతాయి.']],
  [['Who should get the HPV vaccine?','HPV టీకా ఎవరు వేయించుకోవాలి?'],['The HPV vaccine helps protect against cervical cancer. It works best at a young age (commonly 9–14 years), and older girls and women can also receive it as advised by the doctor.','HPV టీకా గర్భాశయ ముఖద్వార (సర్వైకల్) క్యాన్సర్ నుండి రక్షణ ఇస్తుంది. చిన్న వయసులో (సాధారణంగా 9–14 సంవత్సరాలు) వేయించడం ఉత్తమం; పెద్ద అమ్మాయిలు, మహిళలు కూడా డాక్టర్ సలహాతో వేయించుకోవచ్చు.']],
  [['Can I see a dentist and a doctor on the same visit?','ఒకే విజిట్‌లో దంత వైద్యుడిని మరియు డాక్టర్‌ను కలవవచ్చా?'],['Yes. Dental and family-clinic consultations are both available, subject to doctor availability. Mention it when you book and we’ll plan your visit.','అవును. డాక్టర్ల అందుబాటును బట్టి దంత మరియు ఫ్యామిలీ క్లినిక్ కన్సల్టేషన్లు రెండూ ఒకే విజిట్‌లో పొందవచ్చు. బుక్ చేసేటప్పుడు చెప్పండి.']],
  [['Which vaccines does my child need?','నా పిల్లలకు ఏ టీకాలు అవసరం?'],['Our paediatrician will guide you based on the national immunisation schedule and your child’s age. Please bring your child’s vaccination card to the visit.','జాతీయ టీకా షెడ్యూల్ మరియు మీ పిల్లల వయసు ఆధారంగా మా పీడియాట్రీషియన్ సూచిస్తారు. విజిట్‌కు పిల్లల టీకా కార్డు తీసుకురండి.']]
];

const LOCS = [
  {id:'ashok', main:true, map:'8C5H+M5 Guntur, Andhra Pradesh',
    n:['Ashok Nagar Clinic','అశోక్ నగర్ క్లినిక్'],
    a:['Door No. 5-72-31/3, Ashok Nagar (near Devapuram), Guntur, Andhra Pradesh – 522002','డోర్ నెం. 5-72-31/3, అశోక్ నగర్ (దేవాపురం దగ్గర), గుంటూరు, ఆంధ్రప్రదేశ్ – 522002'],
    ph:[['+919440919770','94409 19770'],['+919247591847','92475 91847'],['+919492080487','94920 80487']]},
  {id:'thota', main:false, map:'Padmaja Poly Clinic, Gunturvari Thota, Guntur',
    n:['Gunturvari Thota Clinic','గుంటూరువారితోట క్లినిక్'],
    a:['C/o Padmaja Poly Clinic, 13-8-144, 8th Line, Gunturvari Thota, Opp. RTC Bus Stand (behind petrol bunk), Guntur – 522001','C/o పద్మజ పాలి క్లినిక్, 13-8-144, 8వ లైన్, గుంటూరువారితోట, RTC బస్టాండ్ ఎదురుగా (పెట్రోల్ బంక్ వెనుక), గుంటూరు – 522001'],
    ph:[['+918632224487','0863-2224487']]}
];

/* ---------- translations added for packages, announcement and online booking: [English, Telugu, Hindi] ---------- */
Object.assign(T, {
  annMore:['Learn more','మరింత తెలుసుకోండి','और जानें'],
  annClose:['Close announcement','ప్రకటన మూసివేయండి','सूचना बंद करें'],
  nPackages:['Health Packages','హెల్త్ ప్యాకేజీలు','हेल्थ पैकेज'],
  pkEy:['Health Packages','హెల్త్ ప్యాకేజీలు','हेल्थ पैकेज'],
  pkH:['Check-up packages for the whole family','కుటుంబం మొత్తానికి చెకప్ ప్యాకేజీలు','पूरे परिवार के लिए जाँच पैकेज'],
  pkP:['Simple, clearly priced packages that combine the checks you need in one visit.','ఒకే విజిట్‌లో అవసరమైన పరీక్షలన్నీ కలిపి, స్పష్టమైన ధరలతో సులభమైన ప్యాకేజీలు.','एक ही विज़िट में ज़रूरी जाँचों को मिलाकर, साफ़ कीमतों वाले आसान पैकेज।'],
  pkBook:['Book this package','ఈ ప్యాకేజీ బుక్ చేయండి','यह पैकेज बुक करें'],
  askPrice:['Ask for price','ధర కోసం సంప్రదించండి','कीमत के लिए पूछें'],
  pkSave:['Save ₹{x}','₹{x} ఆదా','₹{x} की बचत'],
  slotsLoading:['Checking available times…','అందుబాటులో ఉన్న సమయాలు చూస్తున్నాం…','उपलब्ध समय देख रहे हैं…'],
  slotTaken:['Sorry, that time was just booked. Please choose another time.','క్షమించండి, ఆ సమయం ఇప్పుడే బుక్ అయింది. దయచేసి వేరే సమయం ఎంచుకోండి.','माफ़ कीजिए, यह समय अभी-अभी बुक हो गया। कृपया दूसरा समय चुनें।'],
  dayOff:['Closed','సెలవు','अवकाश'],
  sending:['Sending…','పంపుతున్నాం…','भेज रहे हैं…'],
  confirmOnline:['Confirm booking','బుకింగ్ కన్ఫర్మ్ చేయండి','बुकिंग कन्फ़र्म करें'],
  doneSavedH:['Appointment request received','అపాయింట్‌మెంట్ రిక్వెస్ట్ అందింది','अपॉइंटमेंट अनुरोध मिल गया'],
  doneSavedP:['Your reference number is <b>{id}</b>. Our team will confirm your appointment by phone or WhatsApp shortly.','మీ రిఫరెన్స్ నంబర్ <b>{id}</b>. మా టీమ్ త్వరలో ఫోన్ లేదా వాట్సాప్ ద్వారా మీ అపాయింట్‌మెంట్ కన్ఫర్మ్ చేస్తుంది.','आपका रेफ़रेंस नंबर <b>{id}</b> है। हमारी टीम जल्द ही फ़ोन या व्हाट्सऐप पर आपका अपॉइंटमेंट कन्फ़र्म करेगी।'],
  alsoWa:['Also send on WhatsApp','వాట్సాప్‌లో కూడా పంపండి','व्हाट्सऐप पर भी भेजें'],
  doneFallP:['We couldn’t save your booking online. Tap below to send it to the clinic on WhatsApp instead.','మీ బుకింగ్ ఆన్‌లైన్‌లో సేవ్ కాలేదు. వాట్సాప్ ద్వారా క్లినిక్‌కు పంపడానికి కింద నొక్కండి.','आपकी बुकिंग ऑनलाइन सेव नहीं हो पाई। व्हाट्सऐप से क्लिनिक को भेजने के लिए नीचे दबाएँ।'],
  bkNoteOnline:['Your appointment is confirmed once the clinic calls you or replies on WhatsApp.','క్లినిక్ మీకు కాల్ చేసిన తర్వాత లేదా వాట్సాప్‌లో రిప్లై ఇచ్చిన తర్వాత మీ అపాయింట్‌మెంట్ కన్ఫర్మ్ అవుతుంది.','क्लिनिक के कॉल करने या व्हाट्सऐप पर जवाब देने के बाद आपका अपॉइंटमेंट कन्फ़र्म होगा।']
});

/* live data from the admin panel (filled by loadServer; defaults used when the database isn't connected) */
let SRV = null, BLOCKS = [], ANN = null;
let PACKAGES = (window.DP_DEFAULT_PACKAGES || []).slice();

/* ---------- Hindi (हिंदी) translations — merged into T and the data lists below ---------- */
const HI = {
 T: {
  skip:'सामग्री पर जाएँ',
  hours:'सुबह 9:00 – दोपहर 2:00 · शाम 4:00 – रात 9:00',
  hoursShort:'सुबह 9–दोप. 2 · शाम 4–रात 9',
  tbLoc:'अशोक नगर, गुंटूर',
  brandSub:'मल्टी स्पेशलिटी डेंटल &amp; फैमिली क्लिनिक',
  nAbout:'हमारे बारे में', nServices:'सेवाएँ', nDoctors:'डॉक्टर', nWhy:'डेंट प्लस क्यों', nReviews:'मरीज़ों के अनुभव', nContact:'संपर्क', nFaq:'सवाल-जवाब',
  bookBtn:'अपॉइंटमेंट बुक करें',
  heroEyebrow:'सुंदर मुस्कान… स्वस्थ दाँत!',
  heroH1:'आपके लिए — विशेषज्ञ <em>दंत चिकित्सा और पारिवारिक इलाज।</em>',
  heroLead:'गुंटूर में एक ही छत के नीचे चार विशेषज्ञ डॉक्टर — डेंटल इम्प्लांट और रूट कैनाल से लेकर आँखों की देखभाल, बच्चों के स्वास्थ्य और महिलाओं के स्वास्थ्य तक।',
  heroCta1:'अपॉइंटमेंट बुक करें', heroCta2:'सेवाएँ देखें',
  trust1:'अनुभवी विशेषज्ञ', trust2:'दंत + पारिवारिक इलाज', trust3:'रात 9 बजे तक खुला',
  gRating:'गूगल रेटिंग',
  qa1:'अपॉइंटमेंट बुक करें', qa2:'डॉक्टर चुनें', qa3:'दंत उपचार', qa4:'फैमिली क्लिनिक', qa5:'आपातकालीन देखभाल', qa6:'रास्ता देखें',
  aboutEy:'डेंट प्लस के बारे में',
  aboutH:'विशेषज्ञ दंत चिकित्सा और पारिवारिक इलाज — एक साथ।',
  aboutP:'डेंट प्लस मल्टी स्पेशलिटी डेंटल &amp; फैमिली क्लिनिक गुंटूर में विशेषज्ञ दंत चिकित्सा और रोज़मर्रा के पारिवारिक इलाज को एक ही छत के नीचे लाता है। हमारे डॉक्टर दाँत, आँखें, बच्चे, महिलाएँ और पूरे परिवार की देखभाल करते हैं — हर विज़िट में साफ़ जानकारी और व्यक्तिगत ध्यान के साथ।',
  st1:'विशेषज्ञ डॉक्टर', st2:'उपचार &amp; सेवाएँ', st3:'गुंटूर में क्लिनिक', st4:'गूगल पर मरीज़ों की रेटिंग',
  svcEy:'हमारी सेवाएँ', svcH:'हमारे उपचार',
  svcP:'हर उम्र के लिए संपूर्ण दंत चिकित्सा, साथ ही आँखों, बच्चों, महिलाओं और रोज़मर्रा के स्वास्थ्य के लिए फैमिली क्लिनिक।',
  tabDental:'दंत चिकित्सा', tabFamily:'फैमिली क्लिनिक',
  svcNote:'पता नहीं कौन-सा इलाज चाहिए? परामर्श बुक करें — हमारे डॉक्टर आपको सही सलाह देंगे।',
  learn:'और जानें',
  whyEy:'डेंट प्लस क्यों', whyH:'मरीज़ डेंट प्लस को क्यों चुनते हैं',
  whyP:'भरोसेमंद विशेषज्ञ, कोमल इलाज और ऐसी देखभाल जो आपके परिवार की दिनचर्या में आसानी से फिट हो।',
  w1h:'आपकी मुस्कान के लिए — और पूरे परिवार के लिए विशेषज्ञ',
  w1p:'दो MDS प्रोस्थोडॉन्टिस्ट और इम्प्लांटोलॉजिस्ट आपके दाँतों की देखभाल करते हैं, जबकि अनुभवी डॉक्टर बच्चों, आँखों, महिलाओं के स्वास्थ्य और जनरल मेडिसिन को देखते हैं। पूरे परिवार के लिए एक भरोसेमंद क्लिनिक।',
  w1a:'दंत और चिकित्सा सेवाएँ एक ही जगह', w1b:'हर विकल्प को साफ़ समझाने वाले डॉक्टर',
  w2h:'आधुनिक, कोमल दंत उपचार',
  w2p:'डेंटल इम्प्लांट और फिक्स्ड दाँतों से लेकर लेज़र मसूड़ों के इलाज और इनविज़लाइन क्लियर अलाइनर तक — हर उपचार आपकी सुविधा और लंबे समय तक दाँतों के स्वास्थ्य को ध्यान में रखकर किया जाता है।',
  w2a:'इम्प्लांट और प्रोस्थोडॉन्टिक्स में विशेषज्ञता', w2b:'दर्द रहित दाँत निकालना, आराम को प्राथमिकता',
  w3h:'हर उम्र के लिए बचाव',
  w3p:'बच्चों के दाँतों के लिए सीलेंट और फ्लोराइड, टीके, डायबिटीज़ वालों के लिए रेटिना जाँच और कैंसर की शुरुआती जाँच — हम समस्याओं को जल्दी पकड़ने में मदद करते हैं, जब उनका इलाज सबसे आसान होता है।',
  w3a:'बच्चों और बड़ों के लिए टीके', w3b:'पैप स्मीयर जाँच और HPV टीका',
  w4h:'सुविधाजनक समय, दो क्लिनिक',
  w4p:'अशोक नगर और गुंटूरवारी थोटा, गुंटूर में — सुबह और शाम रात 9 बजे तक खुला, ताकि स्कूल और काम के साथ इलाज आसान रहे।',
  w4a:'सुबह 9 – दोपहर 2 और शाम 4 – रात 9', w4b:'व्हाट्सऐप या फ़ोन से आसान बुकिंग',
  docEy:'डॉक्टर चुनें', docH:'हमारे विशेषज्ञों से मिलें', docP:'योग्य, पंजीकृत डॉक्टर जो ध्यान से आपकी बात सुनते हैं।',
  fAll:'सभी डॉक्टर', docSearch:'नाम या विशेषज्ञता से खोजें',
  viewProfile:'प्रोफ़ाइल देखें', book:'बुक करें', noDoc:'आपकी खोज से कोई डॉक्टर मेल नहीं खाता।',
  reg:'रजि. नं.', langs:'तेलुगु, अंग्रेज़ी', availNow:'अभी उपलब्ध', availLater:'अगली उपलब्धता',
  jEy:'आपकी विज़िट', jH:'आसान, साफ़ और आरामदायक', jP:'बुकिंग से लेकर इलाज तक क्या होता है, यहाँ देखें।',
  bkEy:'अपॉइंटमेंट बुकिंग', bkH:'एक मिनट में अपनी विज़िट बुक करें',
  bkP:'इलाज, डॉक्टर और समय चुनें। आपका अनुरोध सीधे व्हाट्सऐप पर क्लिनिक को जाएगा, और हमारी टीम आपका अपॉइंटमेंट कन्फ़र्म करेगी।',
  clDental:'दंत चिकित्सा अपॉइंटमेंट', clFamily:'फैमिली क्लिनिक', clHours:'क्लिनिक का समय',
  back:'पीछे', next:'आगे बढ़ें', confirm:'व्हाट्सऐप पर भेजें',
  s1:'सेवा चुनें', s2:'डॉक्टर चुनें', s3:'तारीख चुनें', s4:'समय चुनें', s5:'आपकी जानकारी', s6:'जाँचें और कन्फ़र्म करें',
  stepOf:'6 में से चरण {a}',
  checkup:'सामान्य जाँच / पता नहीं', anyDoc:'कोई भी उपलब्ध डॉक्टर', anyDocS:'हम सही विशेषज्ञ तय करेंगे',
  morning:'सुबह', evening:'शाम', today:'आज', noSlots:'आज कोई स्लॉट उपलब्ध नहीं — कृपया दूसरी तारीख चुनें।',
  fName:'मरीज़ का नाम', fPhone:'मोबाइल नंबर', fAge:'उम्र (वैकल्पिक)', fLoc:'क्लिनिक चुनें', fNote:'कुछ और बताना चाहते हैं? (वैकल्पिक)',
  eName:'कृपया मरीज़ का नाम लिखें।', ePhone:'कृपया सही 10 अंकों का मोबाइल नंबर लिखें।',
  sumService:'सेवा', sumDoctor:'डॉक्टर', sumDate:'तारीख', sumTime:'समय', sumLoc:'क्लिनिक', sumName:'मरीज़', sumPhone:'मोबाइल',
  bkNote:'यह केवल बुकिंग अनुरोध है। क्लिनिक के व्हाट्सऐप पर जवाब देने या कॉल करने के बाद आपका अपॉइंटमेंट कन्फ़र्म होगा।',
  doneH:'अनुरोध भेजने के लिए तैयार',
  doneP:'आपकी बुकिंग जानकारी के साथ व्हाट्सऐप खुल गया है — बस सेंड दबाएँ। हमारी टीम जल्द ही आपका अपॉइंटमेंट कन्फ़र्म करेगी। अगर व्हाट्सऐप नहीं खुला, तो हमें कॉल करें।',
  again:'एक और अपॉइंटमेंट बुक करें', openWa:'व्हाट्सऐप फिर से खोलें',
  bandEy:'बचाव की देखभाल', bandH:'जाँच करवाएँ। टीका लगवाएँ।',
  bandP:'आज की छोटी जाँचें कल की बड़ी समस्याओं को रोक सकती हैं। अपने और अपने परिवार के लिए सही जाँचों के बारे में हमारे डॉक्टरों से पूछें।',
  bandCta:'जाँच बुक करें',
  tg1:'HPV टीका', tg2:'पैप स्मीयर जाँच', tg3:'डायबिटीज़ में रेटिना जाँच', tg4:'बच्चों के टीके', tg5:'बीपी, शुगर &amp; थायरॉइड', tg6:'बच्चों के लिए सीलेंट &amp; फ्लोराइड',
  rvEy:'मरीज़ों के अनुभव', rvH:'हमारे मरीज़ क्या कहते हैं', rvP:'डेंट प्लस पर भरोसा करने वाले परिवारों के सच्चे अनुभव।',
  rvRate:'गूगल पर मरीज़ों की समीक्षाओं की औसत रेटिंग।', rvRead:'गूगल पर समीक्षाएँ पढ़ें', rvWrite:'अपना अनुभव साझा करें',
  rvEmptyH:'डेंट प्लस आए थे? दूसरों को भी बताएँ।',
  rvEmptyP:'आपकी समीक्षा गुंटूर के दूसरे परिवारों को सही इलाज ढूँढने में मदद करती है। गूगल पर बस एक मिनट लगता है।',
  faqEy:'मरीज़ों के लिए जानकारी', faqH:'अक्सर पूछे जाने वाले सवाल',
  faqP:'इलाज और विज़िट से जुड़े आम सवालों के जवाब। फिर भी कोई सवाल है? हमें कॉल करें — हम मदद करेंगे।',
  urH:'तुरंत इलाज चाहिए?',
  urP:'दाँत में तेज़ दर्द, सूजन, टूटा दाँत या बच्चे को बुखार? क्लिनिक के समय में हमें कॉल करें, हमारी टीम आपकी मदद करेगी। जान को खतरा हो तो 108 पर कॉल करें।',
  urDental:'दंत चिकित्सा: 94409 19770', urFamily:'फैमिली क्लिनिक: 94920 80487',
  locEy:'पता &amp; संपर्क', locH:'गुंटूर में हमसे मिलें', locP:'दो सुविधाजनक क्लिनिक। मैप पर देखने के लिए क्लिनिक चुनें।',
  directions:'रास्ता देखें', call:'कॉल करें', mainClinic:'मुख्य क्लिनिक',
  addr1Short:'डोर नं. 5-72-31/3, अशोक नगर, गुंटूर – 522002',
  ftDesc:'गुंटूर में विशेषज्ञ दंत चिकित्सा और पारिवारिक इलाज — स्वस्थ मुस्कान और स्वस्थ परिवारों के लिए।',
  ftDisc:'इस वेबसाइट की जानकारी केवल सामान्य जागरूकता के लिए है; यह डॉक्टर की सलाह का विकल्प नहीं है।',
  mCall:'कॉल', mBook:'बुक',
  openNow:'अभी खुला है', closed:'बंद है', closes:'{t} बजे बंद होगा', opens:'{t} बजे खुलेगा', opensTom:'कल सुबह 9 बजे खुलेगा',
  whoFor:'किसके लिए?', treatedBy:'आपके डॉक्टर', bookThis:'यह इलाज बुक करें',
  about:'परिचय', qual:'योग्यता', focus:'इलाज के क्षेत्र', callClinic:'क्लिनिक को कॉल करें'
 },
 SERVICES: {
  implants:{n:'डेंटल इम्प्लांट', d:'गायब दाँतों की जगह इम्प्लांट की मदद से प्राकृतिक दिखने वाले फिक्स्ड दाँत।', w:['एक या ज़्यादा दाँत न होने पर','ढीले या असुविधाजनक नकली दाँत वालों के लिए','स्थायी, फिक्स्ड समाधान चाहने वालों के लिए']},
  rct:{n:'रूट कैनाल उपचार', d:'सड़े हुए, दर्द वाले दाँत से संक्रमण हटाकर आपके असली दाँत को बचाता है।', w:['तेज़ या लंबे समय तक रहने वाला दाँत दर्द','गर्म या ठंडा लगने पर झनझनाहट','गहरी कैविटी या दाँत के पास सूजन']},
  dentures:{n:'नकली दाँत &amp; फिक्स्ड दाँत', d:'चबाने और मुस्कान को वापस लाने के लिए निकालने वाले या फिक्स्ड दाँत।', w:['कई या सभी दाँत न होने पर','चबाने या बोलने में दिक्कत','पुराने, घिसे हुए नकली दाँत बदलने के लिए']},
  extraction:{n:'दर्द रहित दाँत निकालना', d:'अक्ल दाढ़ और बुरी तरह सड़े दाँतों को आराम से निकालना।', w:['दर्द वाली या फँसी हुई अक्ल दाढ़','जो दाँत बचाए नहीं जा सकते','ब्रेसेस से पहले, डॉक्टर की सलाह पर']},
  gum:{n:'लेज़र मसूड़ों का इलाज', d:'मसूड़ों की बीमारी और खून आने पर लेज़र से फ्लैप सर्जरी।', w:['मसूड़ों से खून या सूजन','न जाने वाली मुँह की दुर्गंध','हिलते दाँत या पीछे हटते मसूड़े']},
  ortho:{n:'ब्रेसेस &amp; इनविज़लाइन', d:'आगे निकले और टेढ़े दाँतों को ब्रेसेस या क्लियर अलाइनर से सीधा करना।', w:['आगे निकले या टेढ़े दाँत','दाँतों के बीच गैप या भीड़','सीधी मुस्कान चाहने वाले किशोर और बड़े']},
  kids:{n:'बच्चों की दंत चिकित्सा', d:'प्रिवेंटिव सीलेंट, फ्लोराइड जेल और टेढ़े दाँतों को रोकने के लिए शुरुआती इलाज।', w:['बच्चे की पहली दंत जाँच','बढ़ते दाँतों में कैविटी से बचाव','टेढ़े दाँतों के शुरुआती लक्षण']},
  eye:{n:'आँखों की देखभाल', d:'आँखों की संपूर्ण जाँच, माइग्रेन की जाँच और डायबिटीज़ वालों के लिए रेटिना जाँच।', w:['धुंधला दिखना या आँखों में थकान','पुराना सिरदर्द या माइग्रेन','डायबिटीज़ वाले लोग (रेटिना जाँच)']},
  vaccines:{n:'टीकाकरण', d:'बच्चों और बड़ों के लिए रोग-रोधी टीके।', w:['शिशु और बच्चे (शेड्यूल के अनुसार)','बूस्टर डोज़ वाले बड़े','लड़कियों और महिलाओं के लिए HPV टीका']},
  general:{n:'जनरल मेडिसिन', d:'बीपी, डायबिटीज़, थायरॉइड, गैस और दिल से जुड़ी समस्याओं का इलाज।', w:['ब्लड प्रेशर और डायबिटीज़','थायरॉइड और पेट की समस्याएँ','बुखार, संक्रमण और नियमित जाँच']},
  women:{n:'महिला स्वास्थ्य &amp; गर्भावस्था', d:'गर्भावस्था की देखभाल, महिलाओं का स्वास्थ्य, परिवार नियोजन और काउंसलिंग।', w:['गर्भवती महिलाएँ','मासिक धर्म और स्त्री रोग से जुड़ी समस्याएँ','परिवार नियोजन की सलाह']},
  child:{n:'बच्चों का स्वास्थ्य', d:'बचपन की सभी आम बीमारियों की जाँच और इलाज।', w:['बुखार, खाँसी और ज़ुकाम','बढ़त और विकास की जाँच','नवजात और शिशु की देखभाल']},
  cancer:{n:'कैंसर जाँच &amp; HPV टीका', d:'कैंसर की शुरुआती जाँच, पैप स्मीयर टेस्ट और HPV टीकाकरण।', w:['पैप स्मीयर जाँच करवाने वाली महिलाएँ','लड़कियाँ और युवतियाँ (HPV टीका)','परिवार में कैंसर का इतिहास होने पर']}
 },
 DOCTORS: {
  pk:{n:'डॉ. जी. फणि कृष्णा', sp:'प्रोस्थोडॉन्टिस्ट &amp; इम्प्लांटोलॉजिस्ट', ex:'प्रोफ़ेसर, सिबार इंस्टिट्यूट ऑफ़ डेंटल साइंसेज़'},
  bd:{n:'डॉ. बी. दीप्ति', sp:'कंसल्टेंट प्रोस्थोडॉन्टिस्ट &amp; इम्प्लांटोलॉजिस्ट', ex:'फिक्स्ड दाँत, नकली दाँत और इम्प्लांट की विशेषज्ञ'},
  vg:{n:'डॉ. जी. वेणु गोपाल राव', sp:'फैमिली फ़िज़िशियन &amp; बाल रोग विशेषज्ञ', ex:'बच्चों और पूरे परिवार का इलाज'},
  pr:{n:'डॉ. टी. पद्मजा रानी', sp:'नेत्र, गर्भावस्था &amp; महिला स्वास्थ्य विशेषज्ञ', ex:'आँखों की देखभाल और महिला स्वास्थ्य एक ही जगह'}
 },
 JOURNEY: [
  ['अपनी विज़िट बुक करें','ऑनलाइन, व्हाट्सऐप पर या फ़ोन से।'],
  ['डॉक्टर से मिलें','शांत, बिना जल्दबाज़ी के परामर्श।'],
  ['जाँच और निदान','ध्यान से जाँच, ज़रूरत हो तो टेस्ट।'],
  ['इलाज की योजना समझें','साफ़ विकल्प, समय और खर्च।'],
  ['इलाज शुरू करें','आराम को प्राथमिकता देते हुए कोमल इलाज।'],
  ['फ़ॉलो-अप &amp; सहायता','इलाज के बाद भी हम आपके साथ।']
 ],
 FAQ: [
  ['क्या अपॉइंटमेंट ज़रूरी है?','हम पहले से बुक करने की सलाह देते हैं ताकि आपके डॉक्टर उपलब्ध रहें और इंतज़ार कम हो। आप इस वेबसाइट पर, व्हाट्सऐप पर या क्लिनिक को कॉल करके बुक कर सकते हैं।'],
  ['क्या रूट कैनाल में दर्द होता है?','रूट कैनाल लोकल एनेस्थीसिया देकर किया जाता है, इसलिए ज़्यादातर मरीज़ों को बहुत कम तकलीफ़ होती है — अक्सर फ़िलिंग जैसी। यह संक्रमण से होने वाले दर्द को दूर करता है।'],
  ['डेंटल इम्प्लांट कितने समय तक चलते हैं?','अच्छी ब्रशिंग और नियमित जाँच से इम्प्लांट कई सालों तक — अक्सर जीवन भर — चलते हैं। सलाह देने से पहले डॉक्टर आपकी हड्डी और मसूड़ों की जाँच करेंगे।'],
  ['बच्चे को पहली बार दंत चिकित्सक के पास कब ले जाएँ?','पहला दाँत आने पर या पहले जन्मदिन तक। सीलेंट और फ्लोराइड जेल बढ़ते दाँतों को कैविटी से बचाते हैं।'],
  ['HPV टीका किसे लगवाना चाहिए?','HPV टीका सर्वाइकल (गर्भाशय ग्रीवा) कैंसर से बचाव में मदद करता है। यह कम उम्र में (आमतौर पर 9–14 साल) सबसे अच्छा काम करता है, और बड़ी लड़कियाँ व महिलाएँ भी डॉक्टर की सलाह से लगवा सकती हैं।'],
  ['क्या एक ही विज़िट में दंत चिकित्सक और डॉक्टर दोनों से मिल सकते हैं?','हाँ। डॉक्टरों की उपलब्धता के अनुसार दंत और फैमिली क्लिनिक दोनों परामर्श एक ही विज़िट में मिल सकते हैं। बुक करते समय बताएँ।'],
  ['मेरे बच्चे को कौन-से टीके चाहिए?','राष्ट्रीय टीकाकरण शेड्यूल और बच्चे की उम्र के अनुसार हमारे बाल रोग विशेषज्ञ सलाह देंगे। विज़िट पर बच्चे का टीकाकरण कार्ड साथ लाएँ।']
 ],
 LOCS: {
  ashok:{n:'अशोक नगर क्लिनिक', a:'डोर नं. 5-72-31/3, अशोक नगर (देवापुरम के पास), गुंटूर, आंध्र प्रदेश – 522002'},
  thota:{n:'गुंटूरवारी थोटा क्लिनिक', a:'C/o पद्मजा पॉली क्लिनिक, 13-8-144, 8वीं लाइन, गुंटूरवारी थोटा, RTC बस स्टैंड के सामने (पेट्रोल पंप के पीछे), गुंटूर – 522001'}
 }
};
for (const k in T) { if (HI.T[k]) T[k][2] = HI.T[k]; else if (!T[k][2]) T[k][2] = T[k][0]; }
SERVICES.forEach(s => { const h = HI.SERVICES[s.id]; s.n[2] = h.n; s.d[2] = h.d; s.w.forEach((w, i) => w[2] = h.w[i]); });
DOCTORS.forEach(d => { const h = HI.DOCTORS[d.id]; d.n[2] = h.n; d.sp[2] = h.sp; d.ex[2] = h.ex; });
JOURNEY.forEach((j, i) => { j[0][2] = HI.JOURNEY[i][0]; j[1][2] = HI.JOURNEY[i][1]; });
FAQ.forEach((f, i) => { f[0][2] = HI.FAQ[i][0]; f[1][2] = HI.FAQ[i][1]; });
LOCS.forEach(l => { const h = HI.LOCS[l.id]; l.n[2] = h.n; l.a[2] = h.a; });

/* ---------- v3 design: new and updated text [English, Telugu, Hindi] ---------- */
Object.assign(T, {
  nNavPk:['Packages','ప్యాకేజీలు','पैकेज'],
  nNavRv:['Reviews','రివ్యూలు','समीक्षाएँ'],
  nGallery:['Our Clinic','మా క్లినిక్','हमारा क्लिनिक'],
  qbSvc:['Treatment','చికిత్స','इलाज'],
  qbDoc:['Doctor','డాక్టర్','डॉक्टर'],
  qbDate:['Date','తేదీ','तारीख'],
  qbBtn:['Find a time','సమయం చూడండి','समय देखें'],
  qbChoose:['Choose a treatment','చికిత్సను ఎంచుకోండి','इलाज चुनें'],
  qbAnyDate:['Pick a date','తేదీ ఎంచుకోండి','तारीख चुनें'],
  tomorrow:['Tomorrow','రేపు','कल'],
  proof1:['4 specialists','4 నిపుణులు','4 विशेषज्ञ'],
  proof1s:['under one roof','ఒకే చోట','एक ही छत के नीचे'],
  proof2:['5.0 rating on Google','గూగుల్‌లో 5.0 రేటింగ్','गूगल पर 5.0 रेटिंग'],
  aboutSig:['Dental + family care under one roof','దంత + కుటుంబ వైద్యం ఒకే చోట','दंत + पारिवारिक इलाज एक ही छत के नीचे'],
  aboutH:['Specialist dental care and family medicine, <em>together.</em>','నిపుణుల దంత వైద్యం, కుటుంబ వైద్యం — <em>ఒకే చోట.</em>','विशेषज्ञ दंत चिकित्सा और पारिवारिक इलाज — <em>एक साथ।</em>'],
  svcH:['Explore our <em>treatments</em>','మా <em>చికిత్సలు</em>','हमारे <em>उपचार</em>'],
  pkH:['Check-up packages for the <em>whole family</em>','<em>కుటుంబం మొత్తానికి</em> చెకప్ ప్యాకేజీలు','<em>पूरे परिवार</em> के लिए जाँच पैकेज'],
  whyH:['Why patients <em>choose</em> Dent Plus','పేషెంట్లు డెంట్ ప్లస్‌ను <em>ఎందుకు</em> ఎంచుకుంటారు','मरीज़ डेंट प्लस को <em>क्यों</em> चुनते हैं'],
  docH:['Meet our <em>specialists</em>','మా <em>నిపుణులను</em> కలవండి','हमारे <em>विशेषज्ञों</em> से मिलें'],
  jH:['Simple, predictable, <em>comfortable</em>','సులభం, స్పష్టం, <em>సౌకర్యవంతం</em>','आसान, साफ़ और <em>आरामदायक</em>'],
  bkH:['Book your visit in <em>under a minute</em>','<em>ఒక్క నిమిషంలో</em> మీ విజిట్ బుక్ చేయండి','<em>एक मिनट में</em> अपनी विज़िट बुक करें'],
  rvH:['What our <em>patients</em> say','మా <em>పేషెంట్లు</em> ఏమంటున్నారు','हमारे <em>मरीज़</em> क्या कहते हैं'],
  faqH:['Frequently asked <em>questions</em>','తరచుగా అడిగే <em>ప్రశ్నలు</em>','अक्सर पूछे जाने वाले <em>सवाल</em>'],
  locH:['Visit us in <em>Guntur</em>','<em>గుంటూరులో</em> మమ్మల్ని సందర్శించండి','<em>गुंटूर</em> में हमसे मिलें'],
  bentoCtaH:['Not sure what you need?','మీకు ఏ చికిత్స అవసరమో తెలియదా?','पता नहीं क्या इलाज चाहिए?'],
  bentoCtaP:['Book a consultation and our doctors will guide you to the right treatment.','కన్సల్టేషన్ బుక్ చేయండి — మీకు సరైన చికిత్సను మా డాక్టర్లు సూచిస్తారు.','परामर्श बुक करें — हमारे डॉक्टर आपको सही इलाज बताएँगे।'],
  notSureL:['Not sure?','తెలియదా?','पता नहीं?'],
  bentoCtaBtn:['Book a consultation','కన్సల్టేషన్ బుక్ చేయండి','परामर्श बुक करें'],
  pkPopular:['Most popular','ఎక్కువ మంది ఎంచుకున్నది','सबसे लोकप्रिय'],
  wb1:['4 specialists','4 నిపుణులు','4 विशेषज्ञ'], wb1s:['Dental + medical','దంత + వైద్య సేవలు','दंत + चिकित्सा'],
  wb2:['Implant specialists','ఇంప్లాంట్ నిపుణులు','इम्प्लांट विशेषज्ञ'], wb2s:['MDS prosthodontists','MDS ప్రోస్తోడాంటిస్టులు','MDS प्रोस्थोडॉन्टिस्ट'],
  wb3:['Every age','అన్ని వయసుల వారికి','हर उम्र के लिए'], wb3s:['Kids to seniors','పిల్లల నుండి పెద్దల వరకు','बच्चों से बुज़ुर्गों तक'],
  ttLocs:['2 locations · Ashok Nagar &amp; Gunturvari Thota','2 క్లినిక్‌లు · అశోక్ నగర్ &amp; గుంటూరువారితోట','2 क्लिनिक · अशोक नगर &amp; गुंटूरवारी थोटा'],
  galEy:['Inside Dent Plus','డెంట్ ప్లస్ లోపల','डेंट प्लस के अंदर'],
  galH:['A calm, <em>modern</em> space for your care','మీ చికిత్స కోసం ప్రశాంతమైన, <em>ఆధునిక</em> వాతావరణం','आपकी देखभाल के लिए शांत, <em>आधुनिक</em> माहौल'],
  galP:['Clean, comfortable rooms and modern equipment, so you know what to expect before you arrive.','శుభ్రమైన, సౌకర్యవంతమైన గదులు, ఆధునిక పరికరాలు — మీరు రాకముందే ఎలా ఉంటుందో తెలుసుకోండి.','साफ़, आरामदायक कमरे और आधुनिक उपकरण — ताकि आने से पहले ही आपको पता रहे कि क्या उम्मीद करें।'],
  faqCtaH:['Still have questions?','ఇంకా సందేహాలు ఉన్నాయా?','अब भी कोई सवाल है?'],
  faqCtaP:['Message our team on WhatsApp. We’re happy to help.','వాట్సాప్‌లో మా టీమ్‌కు మెసేజ్ చేయండి. సహాయం చేయడానికి సిద్ధంగా ఉన్నాం.','व्हाट्सऐप पर हमारी टीम को मैसेज करें। हम मदद के लिए तैयार हैं।'],
  faqCtaBtn:['Chat on WhatsApp','వాట్సాప్‌లో చాట్ చేయండి','व्हाट्सऐप पर बात करें'],
  fctaH:['Your smile deserves <em>expert care.</em>','మీ నవ్వుకు <em>నిపుణుల సంరక్షణ</em> అవసరం.','आपकी मुस्कान को चाहिए <em>विशेषज्ञ देखभाल।</em>'],
  fctaP:['Book in under a minute, or call us. Our team is happy to help.','ఒక్క నిమిషంలో బుక్ చేయండి లేదా మాకు కాల్ చేయండి. మా టీమ్ సహాయం చేస్తుంది.','एक मिनट में बुक करें या हमें कॉल करें। हमारी टीम मदद करेगी।'],
  mapLoad:['Show map','మ్యాప్ చూపించు','मैप दिखाएँ'],
  ss1:['Service','సేవ','सेवा'], ss2:['Doctor','డాక్టర్','डॉक्टर'], ss3:['Date','తేదీ','तारीख'],
  ss4:['Time','సమయం','समय'], ss5:['Details','వివరాలు','जानकारी'], ss6:['Confirm','కన్ఫర్మ్','कन्फ़र्म'],
  gal1:['Treatment room','చికిత్స గది','उपचार कक्ष'], gal2:['Dental chair','డెంటల్ చైర్','डेंटल चेयर'],
  gal3:['Eye-care equipment','కంటి పరీక్ష పరికరాలు','आँखों की जाँच के उपकरण'], gal4:['Gentle treatment','సున్నితమైన చికిత్స','कोमल इलाज'],
  gal5:['Children’s dentistry','పిల్లల దంత వైద్యం','बच्चों की दंत चिकित्सा']
});

/* photos (free Unsplash licence) — replace ids with the clinic's own photos in /assets/img when available */
const IMG = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? '&h=' + h : ''}&q=70`;
const FEATURE = { dental:{ id:'implants', img:'1643660527071-52e37cf7c7ea' }, family:{ id:'eye', img:'1539036776273-021ec1d78bec' } };
const GALLERY = [
  { img:'1629909614456-6b1c5c94cecc', k:'gal1' }, { img:'1643660527071-52e37cf7c7ea', k:'gal2' },
  { img:'1539036776273-021ec1d78bec', k:'gal3' }, { img:'1662543701887-91f8f042a338', k:'gal4' },
  { img:'1653508310895-62141575a3a9', k:'gal5' }
];

/* ---------- helpers ---------- */
let L = 'en';
try { const s = localStorage.getItem('dp-lang'); if (['en','te','hi'].includes(s)) L = s; } catch(e) {}
const LANGS = {en:0, te:1, hi:2};
const ix = () => LANGS[L] || 0;
const t = (k, rep) => { let s = T[k] ? (T[k][ix()] || T[k][0]) : k; if (rep) for (const r in rep) s = s.replace('{' + r + '}', rep[r]); return s; };
const p = arr => arr[ix()] || arr[0];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const ic = (id, cls='i') => `<svg class="${cls}"><use href="#${id}"/></svg>`;
const strip = s => s.replace(/&amp;/g,'&');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svcById = id => SERVICES.find(s => s.id === id);
const docById = id => DOCTORS.find(d => d.id === id);

function istNow(){
  const parts = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
  const g = k => +parts.find(x => x.type === k).value;
  return {y:g('year'), m:g('month'), d:g('day'), min:(g('hour') % 24) * 60 + g('minute')};
}
function fmtTime(min){
  const h = Math.floor(min/60), m = String(min%60).padStart(2,'0');
  if (L === 'hi'){
    const per = h < 12 ? 'सुबह' : h < 16 ? 'दोपहर' : h < 19 ? 'शाम' : 'रात';
    return `${per} ${((h+11)%12)+1}:${m}`;
  }
  if (L === 'te'){
    const per = h < 12 ? 'ఉదయం' : h < 16 ? 'మధ్యాహ్నం' : h < 19 ? 'సాయంత్రం' : 'రాత్రి';
    return `${per} ${((h+11)%12)+1}:${m}`;
  }
  return `${((h+11)%12)+1}:${m} ${h < 12 ? 'AM' : 'PM'}`;
}
function openState(){
  const {min} = istNow();
  for (const [a,b] of CFG.sessions) if (min >= a && min < b) return {open:true, text:`${t('openNow')} · ${t('closes',{t:fmtTime(b)})}`};
  const nxt = CFG.sessions.find(([a]) => min < a);
  return {open:false, text: nxt ? `${t('closed')} · ${t('opens',{t:fmtTime(nxt[0])})}` : `${t('closed')} · ${t('opensTom')}`};
}
function renderStatus(){
  const s = openState();
  $$('[data-status]').forEach(el => { el.classList.toggle('open', s.open); el.querySelector('.st-t').textContent = s.text; });
  $$('[data-status-h]').forEach(el => el.textContent = s.open ? t('openNow') : t('closed'));
  $$('[data-tt]').forEach(el => { const [a, b] = CFG.sessions[+el.dataset.tt]; el.textContent = fmtTime(a) + ' – ' + fmtTime(b); });
  if (lastOpen !== s.open){ lastOpen = s.open; renderDocs(); }
}

/* ---------- static text ---------- */
function applyStatic(){
  document.documentElement.lang = L; ensureFont(L);
  $$('[data-t]').forEach(el => { const k = el.dataset.t; if (T[k]) el.innerHTML = T[k][ix()] || T[k][0]; });
  $$('[data-tp]').forEach(el => el.placeholder = t(el.dataset.tp));
  $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === L)));
}

/* ---------- services (bento) + marquee + footer lists ---------- */
let svcCat = 'dental';
function renderServices(){
  const list = SERVICES.filter(s => s.cat === svcCat);
  const f = FEATURE[svcCat];
  const feat = list.find(s => s.id === f.id) || list[0];
  const rest = list.filter(s => s !== feat);
  const span = (4 - ((rest.length + 4) % 4)) % 4 || 4;
  const view = ['View','చూడండి','देखें'][ix()];
  $('#svcGrid').innerHTML =
    `<button class="bt bt-lg" data-svc-open="${feat.id}" data-cursor="${view}">
      <span class="bimg"><img src="${IMG(f.img, 900)}" srcset="${IMG(f.img, 560)} 560w, ${IMG(f.img, 900)} 900w" sizes="(max-width:720px) 92vw, 600px" alt="" loading="lazy" decoding="async" width="600" height="500"></span>
      <span class="go">${ic('i-arrow')}</span>
      <span class="bt-in"><span class="tag">${t(svcCat === 'dental' ? 'tabDental' : 'tabFamily')}</span><h3>${p(feat.n)}</h3><p>${p(feat.d)}</p></span>
    </button>` +
    rest.map(s => `<button class="bt spot" data-svc-open="${s.id}" data-cursor="${view}">
      <span class="si">${ic(s.icon)}</span><span class="go">${ic('i-arrow')}</span>
      <h3>${p(s.n)}</h3><p>${p(s.d)}</p>
    </button>`).join('') +
    `<div class="bt bt-cta" style="grid-column:span ${span}"${rest.length % 2 ? ' data-odd' : ''}><h3>${t('bentoCtaH')}</h3><p>${t('bentoCtaP')}</p>
      <a class="btn btn-m btn-sm" href="#book" data-svc="checkup">${t('bentoCtaBtn')}${ic('i-arrow','i arr')}</a></div>`;
  $$('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.cat === svcCat)));
  $('#ftDental').innerHTML = SERVICES.filter(s => s.cat==='dental').map(s => `<li><a href="#services" data-svc-open="${s.id}">${p(s.n)}</a></li>`).join('');
  $('#ftFamily').innerHTML = SERVICES.filter(s => s.cat==='family').map(s => `<li><a href="#services" data-svc-open="${s.id}">${p(s.n)}</a></li>`).join('');
  const words = SERVICES.map(s => `<span>${p(s.n)}</span>`).join('');
  $('#mqT').innerHTML = words + words;   // duplicated so the loop is seamless
}

/* ---------- doctors ---------- */
let docF = 'all', docQ = '', lastOpen = null;
const person = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#i-person"/></svg>`;
function renderDocs(){
  const st = openState(), open = st.open;
  const q = docQ.trim().toLowerCase();
  const list = DOCTORS.filter(d => (docF === 'all' || d.cat === docF) &&
    (!q || [...d.n, ...d.sp, d.q, ...d.svc.flatMap(id => svcById(id).n)].join(' ').toLowerCase().includes(q)));
  const prof = ['Profile','ప్రొఫైల్','प्रोफ़ाइल'][ix()];
  $('#docGrid').innerHTML = list.length ? list.map(d => `
    <article class="doc" data-cursor="${prof}">
      <div class="doc-ph" style="background:${d.grad}">
        ${d.photo ? `<img src="${esc(d.photo)}" alt="${esc(p(d.n))}" loading="lazy" decoding="async">` : `<span class="archf">${person()}</span>`}
        <span class="dept">${t(d.cat==='dental'?'tabDental':'tabFamily')}</span><span class="ini" aria-hidden="true">${d.ini}</span>
      </div>
      <div class="doc-b">
        <h3>${p(d.n)}</h3>
        <div class="q">${d.q}</div>
        <div class="sp">${p(d.sp)}</div>
        <div class="doc-meta">
          <span>${ic('i-lang')}${t('langs')}</span>
          ${d.reg ? `<span>${ic('i-award')}${t('reg')} ${d.reg}</span>` : ''}
          <span class="avail ${open?'open':''}"><span class="dot"></span>${open ? t('availNow') : t('availLater') + ' · ' + st.text.split('·')[1].trim()}</span>
        </div>
        <div class="doc-act">
          <button class="btn btn-s" data-doc-open="${d.id}">${t('viewProfile')}</button>
          <button class="btn btn-p" data-doc-book="${d.id}">${t('book')}</button>
        </div>
      </div>
    </article>`).join('') : `<div class="empty">${t('noDoc')}</div>`;
}

/* ---------- gallery ---------- */
function renderGallery(){
  $('#galGrid').innerHTML = GALLERY.map((g, i) => `<figure>
    <img src="${IMG(g.img, i ? 600 : 800)}" srcset="${IMG(g.img, 480)} 480w, ${IMG(g.img, i ? 600 : 800)} ${i ? 600 : 800}w" sizes="(max-width:720px) 78vw, ${i ? 380 : 520}px" alt="${esc(strip(t(g.k)))}" loading="lazy" decoding="async" width="${i ? 380 : 520}" height="${i ? 260 : 536}">
    <figcaption>${t(g.k)}</figcaption></figure>`).join('');
}

/* ---------- hero quick booking ---------- */
const QB = { svc:'', doc:'any', date:'' };
function qbDocs(){ const i = svcInfo(QB.svc); return DOCTORS.filter(d => !i || i.docs.includes(d.id)); }
function renderQuick(){
  const opt = (v, l, sel) => `<option value="${esc(v)}"${sel ? ' selected' : ''}>${l}</option>`;
  const grp = (label, items) => items.length ? `<optgroup label="${esc(strip(label))}">${items.join('')}</optgroup>` : '';
  $('#qbSvc').innerHTML = opt('', t('qbChoose'), !QB.svc) +
    grp(t('tabDental'), SERVICES.filter(s => s.cat === 'dental').map(s => opt(s.id, p(s.n), QB.svc === s.id))) +
    grp(t('tabFamily'), SERVICES.filter(s => s.cat === 'family').map(s => opt(s.id, p(s.n), QB.svc === s.id))) +
    grp(t('nPackages'), PACKAGES.map(k => opt('pkg:' + k.id, esc(tx(k.name)), QB.svc === 'pkg:' + k.id))) +
    opt('checkup', t('checkup'), QB.svc === 'checkup');
  const docs = qbDocs(); if (QB.doc !== 'any' && !docs.some(d => d.id === QB.doc)) QB.doc = 'any';
  $('#qbDoc').innerHTML = opt('any', t('anyDoc'), QB.doc === 'any') + docs.map(d => opt(d.id, p(d.n), QB.doc === d.id)).join('');
  const ds = days(); const off = k => { const ids = QB.doc !== 'any' ? [QB.doc] : docs.map(d => d.id); return ids.every(id => docOff(id, k)); };
  if (QB.date && off(QB.date)) QB.date = '';
  $('#qbDate').innerHTML = opt('', t('qbAnyDate'), !QB.date) + ds.map((d, i) => {
    const lbl = i === 0 ? t('today') : i === 1 ? t('tomorrow') : fmtDate(d.dt, {weekday:'short', day:'numeric', month:'short'});
    return off(d.key) ? `<option value="${d.key}" disabled>${lbl} · ${t('dayOff')}</option>` : opt(d.key, i < 2 ? `${lbl}, ${fmtDate(d.dt, {day:'numeric', month:'short'})}` : lbl, QB.date === d.key);
  }).join('');
}
function quickGo(e){
  e.preventDefault();
  trackOnce('book_start');
  goBook({svc:QB.svc || null, doc:QB.svc ? QB.doc : null, date:QB.date || null});
}

/* ---------- journey / faq / reviews / locations ---------- */
function renderJourney(){
  $('#journeyList').innerHTML = JOURNEY.map((j,i) => `<div class="js"><span class="n">0${i+1}</span><h4>${p(j[0])}</h4><p>${p(j[1])}</p></div>`).join('');
}
function renderFaq(){
  const openIdx = $$('.acc-i.open').map(el => +el.dataset.i);
  $('#faqList').innerHTML = FAQ.map((f,i) => `
    <div class="acc-i ${openIdx.includes(i)?'open':''}" data-i="${i}">
      <button class="acc-b" aria-expanded="${openIdx.includes(i)}" aria-controls="fa${i}" id="fq${i}">${p(f[0])}<span class="pm">${ic('i-plus')}</span></button>
      <div class="acc-p" id="fa${i}" role="region" aria-labelledby="fq${i}"><div><p>${p(f[1])}</p></div></div>
    </div>`).join('');
}
function renderReviews(){
  $$('[data-href="reviews"]').forEach(a => a.href = CFG.reviewsUrl);
  $('#rvList').innerHTML = REVIEWS.length ? REVIEWS.map(r => `
    <figure class="rv">
      <span class="tr">${esc(p([r.treatment.en, r.treatment.te, r.treatment.hi || r.treatment.en]))}</span>
      <blockquote>“${esc(p([r.text.en, r.text.te, r.text.hi || r.text.en]))}”</blockquote>
      <figcaption class="who"><span class="av">${esc(r.name.charAt(0))}</span><span><b>${esc(r.name)}</b><small>${t('rvEy')}</small></span></figcaption>
    </figure>`).join('') : `
    <div class="rv-empty"><span class="qm">“</span><h3>${t('rvEmptyH')}</h3><p>${t('rvEmptyP')}</p>
      <div style="margin-top:22px"><a class="btn btn-p btn-sm" href="${esc(CFG.reviewsUrl)}" target="_blank" rel="noopener noreferrer">${t('rvWrite')}${ic('i-arrow','i arr')}</a></div></div>`;
}
let locSel = 'ashok';
function mapUrl(q, embed){ return embed ? `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`; }
function renderLocs(){
  $('#locList').innerHTML = LOCS.map(l => `
    <div class="loc" role="button" tabindex="0" data-loc="${l.id}" aria-pressed="${l.id===locSel}">
      <div class="lt"><h3>${p(l.n)}</h3>${l.main ? `<span class="tag">${t('mainClinic')}</span>` : ''}</div>
      <div class="ln">${ic('i-pin')}<span>${p(l.a)}</span></div>
      <div class="ln">${ic('i-clock')}<span>${t('hours')}</span></div>
      <div class="ln">${ic('i-phone')}<span>${l.ph.map(([h,d]) => `<a href="tel:${h}">${d}</a>`).join(' · ')}</span></div>
      <div class="la">
        <a class="btn btn-p btn-sm" href="${mapUrl(l.map)}" target="_blank" rel="noopener noreferrer">${ic('i-pin')}${t('directions')}</a>
        <a class="btn btn-s btn-sm" href="tel:${l.ph[0][0]}">${ic('i-phone')}${t('call')}</a>
      </div>
    </div>`).join('');
  if (typeof mapOn === 'undefined' || !mapOn) return;
  const f = $('#mapFrame'); const src = mapUrl(LOCS.find(l => l.id===locSel).map, true);
  if (f.dataset.src !== src){ f.src = src; f.dataset.src = src; }
}

/* ---------- modal ---------- */
let lastFocus = null;
function openModal(html){
  lastFocus = document.activeElement;
  $('#mdl').innerHTML = `<button class="mdl-x" data-mclose aria-label="Close">${ic('i-x')}</button>` + html;
  $('#modal').classList.add('on'); document.body.style.overflow = 'hidden';
  $('#mdl .mdl-x').focus();
}
function closeModal(){ $('#modal').classList.remove('on'); document.body.style.overflow=''; if (lastFocus) lastFocus.focus(); }
function svcModal(id){
  const s = svcById(id); const docs = DOCTORS.filter(d => d.svc.includes(id));
  openModal(`<div class="mdl-h"><span class="si">${ic(s.icon)}</span><div><small>${t(s.cat==='dental'?'tabDental':'tabFamily')}</small><h3 id="mdlT">${p(s.n)}</h3></div></div>
    <div class="mdl-b"><p>${p(s.d)}</p>
      <h4>${t('whoFor')}</h4><ul>${s.w.map(w => `<li>${ic('i-check')}<span>${p(w)}</span></li>`).join('')}</ul>
      <h4>${t('treatedBy')}</h4><ul>${docs.map(d => `<li>${ic('i-check')}<span><b>${p(d.n)}</b> — ${p(d.sp)}</span></li>`).join('')}</ul>
      <div class="mdl-act"><button class="btn btn-p btn-sm" data-book-svc="${id}">${t('bookThis')}${ic('i-arrow','i arr')}</button></div></div>`);
}
function docModal(id){
  const d = docById(id);
  openModal(`<div class="mdl-h"><span class="avm" style="background:${d.grad}">${person()}</span><div><small>${t(d.cat==='dental'?'tabDental':'tabFamily')}</small><h3 id="mdlT">${p(d.n)}</h3></div></div>
    <div class="mdl-b">
      <h4>${t('qual')}</h4><p style="margin-bottom:0"><b style="color:var(--navy)">${d.q}</b> · ${p(d.sp)}${d.reg ? ` · ${t('reg')} ${d.reg}` : ''}</p>
      <h4>${t('about')}</h4><p style="margin-bottom:0">${p(d.ex)}. ${t('langs')}.</p>
      <h4>${t('focus')}</h4><ul>${d.svc.map(sid => `<li>${ic('i-check')}<span>${p(svcById(sid).n)}</span></li>`).join('')}</ul>
      <div class="mdl-act"><button class="btn btn-p btn-sm" data-doc-book="${d.id}">${t('book')}${ic('i-arrow','i arr')}</button>
      <a class="btn btn-s btn-sm" href="tel:+91${d.cat==='dental'?'9440919770':'9492080487'}">${ic('i-phone')}${t('callClinic')}</a></div></div>`);
}

/* ---------- booking ---------- */
const B = {step:1, svc:null, doc:null, date:null, time:null, loc:'ashok', name:'', phone:'', age:'', note:'', web:'', done:false, errs:{}, taken:null, takenKey:'', busy:false, ref:null, fallback:false, msg:''};
const tx = o => (o && (o[L] || o.en)) || '';
const pkgById = id => PACKAGES.find(x => x.id === id);
function svcInfo(svc){
  if (!svc) return null;
  if (svc === 'checkup') return {label:t('checkup'), en:'General check-up', cat:null, docs:DOCTORS.map(d => d.id)};
  if (svc.startsWith('pkg:')){ const k = pkgById(svc.slice(4)); if (!k) return null;
    return {label:esc(tx(k.name)), en:'Package: ' + k.name.en, cat:k.cat, docs:DOCTORS.filter(d => d.cat === k.cat).map(d => d.id)}; }
  const s = svcById(svc); if (!s) return null;
  return {label:p(s.n), en:strip(s.n[0]), cat:s.cat, docs:DOCTORS.filter(d => d.svc.includes(svc)).map(d => d.id)};
}
const catOf = () => { const i = svcInfo(B.svc); if (i && i.cat) return i.cat; return B.doc && B.doc !== 'any' ? docById(B.doc).cat : 'dental'; };
const candDocs = () => { const i = svcInfo(B.svc); const all = i ? i.docs : DOCTORS.map(d => d.id); return B.doc && B.doc !== 'any' ? [B.doc] : all; };
const docOff = (docId, date) => { const d = docById(docId); return BLOCKS.some(b => b.date === date && (b.scope === 'all' || b.scope === d.cat || b.scope === d.id)); };
const dayOff = date => candDocs().every(id => docOff(id, date));
function days(){
  const n = istNow(); const out = [];
  for (let i=0;i<14;i++){ const dt = new Date(Date.UTC(n.y, n.m-1, n.d+i, 6, 0)); out.push({key:dt.toISOString().slice(0,10), dt, today:i===0}); }
  return out;
}
const fmtDate = (dt, o) => dt.toLocaleDateString(['en-IN','te-IN','hi-IN'][ix()], Object.assign({timeZone:'Asia/Kolkata'}, o));
function slots(){ const out = []; for (const [a,b] of CFG.sessions) for (let m=a; m<b; m+=30) out.push(m); return out; }
function slotDisabled(m){
  if (!B.date) return false;
  if (B.date === days()[0].key && m <= istNow().min + 30) return true;
  return !!(B.taken && B.taken.includes(m));
}
async function loadTaken(){
  const key = [B.date, B.svc, B.doc].join('|');
  if (!SRV || B.takenKey === key) return;
  B.takenKey = key; B.taken = null;
  try {
    const r = await fetch(`/api/slots?date=${encodeURIComponent(B.date)}&svc=${encodeURIComponent(B.svc)}&doc=${encodeURIComponent(B.doc)}`);
    const j = r.ok ? await r.json() : {taken:[]};
    if (B.takenKey === key){ B.taken = j.taken || []; if (B.time !== null && slotDisabled(B.time)) B.time = null; if (B.step === 4) renderBook(); }
  } catch(_) { if (B.takenKey === key){ B.taken = []; if (B.step === 4) renderBook(); } }
}
function valid(){
  switch(B.step){
    case 1: return !!svcInfo(B.svc); case 2: return !!B.doc; case 3: return !!B.date && !dayOff(B.date);
    case 4: return B.time !== null && !slotDisabled(B.time) && !(SRV && B.taken === null);
    default: return !B.busy;
  }
}
function renderBook(){
  const titles = ['s1','s2','s3','s4','s5','s6'];
  $('#bkProg').innerHTML = titles.map((_,i) => `<span class="${i < B.step ? 'on':''}">${t('ss'+(i+1))}</span>`).join('');
  const foot = $('#bkFoot'), body = $('#bkBody');
  if (B.done){
    $('#bkTitle').innerHTML = ''; $('#bkStep').textContent=''; foot.style.display='none';
    const head = B.ref ? `<h3>${t('doneSavedH')}</h3><p>${t('doneSavedP',{id:esc(B.ref)})}</p>`
      : B.fallback ? `<h3>${t('doneH')}</h3><p>${t('doneFallP')}</p>` : `<h3>${t('doneH')}</h3><p>${t('doneP')}</p>`;
    const waLbl = B.ref ? t('alsoWa') : B.fallback ? t('confirm') : t('openWa');
    body.innerHTML = `<div class="done"><span class="ok">${ic('i-check')}</span>${head}
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn ${B.ref?'btn-s':'btn-p'} btn-sm" href="${waLink()}" target="_blank" rel="noopener">${ic('i-chat')}${waLbl}</a>
      <button class="btn ${B.ref?'btn-p':'btn-s'} btn-sm" id="bkAgain">${t('again')}</button></div></div>`;
    return;
  }
  foot.style.display='';
  $('#bkTitle').innerHTML = t(titles[B.step-1]); $('#bkStep').textContent = t('stepOf',{a:B.step});
  let h = B.msg ? `<p class="bk-msg" role="alert">${ic('i-alert')}<span>${esc(B.msg)}</span></p>` : '';
  if (B.step === 1){
    const dCat = B.doc && B.doc !== 'any' ? docById(B.doc) : null;
    const grp = cat => SERVICES.filter(s => s.cat===cat && (!dCat || dCat.svc.includes(s.id)));
    for (const cat of ['dental','family']){
      const g = grp(cat); if (!g.length) continue;
      h += `<div class="grp-l">${t(cat==='dental'?'tabDental':'tabFamily')}</div><div class="opt-g">` +
        g.map(s => `<button class="opt" data-b-svc="${s.id}" aria-pressed="${B.svc===s.id}"><span class="oi">${ic(s.icon)}</span><span>${p(s.n)}</span></button>`).join('') + `</div>`;
    }
    const pk = PACKAGES.filter(k => !dCat || k.cat === dCat.cat);
    if (pk.length) h += `<div class="grp-l">${t('nPackages')}</div><div class="opt-g">` +
      pk.map(k => `<button class="opt" data-b-svc="pkg:${esc(k.id)}" aria-pressed="${B.svc==='pkg:'+k.id}"><span class="oi">${ic('i-award')}</span><span>${esc(tx(k.name))}${k.price!=null?`<small>₹${k.price.toLocaleString('en-IN')}</small>`:''}</span></button>`).join('') + `</div>`;
    h += `<div class="grp-l">${t('notSureL')}</div><div class="opt-g"><button class="opt" data-b-svc="checkup" aria-pressed="${B.svc==='checkup'}"><span class="oi">${ic('i-steth')}</span><span>${t('checkup')}</span></button></div>`;
  }
  if (B.step === 2){
    const ids = svcInfo(B.svc).docs;
    h += `<div class="opt-g">` + DOCTORS.filter(d => ids.includes(d.id)).map(d => `<button class="opt" data-b-doc="${d.id}" aria-pressed="${B.doc===d.id}"><span class="oi" style="background:${d.grad};color:#fff;font-weight:700;font-size:12px">${d.ini}</span><span>${p(d.n)}<small>${p(d.sp)}</small></span></button>`).join('') +
      `<button class="opt" data-b-doc="any" aria-pressed="${B.doc==='any'}"><span class="oi">${ic('i-users')}</span><span>${t('anyDoc')}<small>${t('anyDocS')}</small></span></button></div>`;
  }
  if (B.step === 3){
    h += `<div class="dates">` + days().map(d => { const off = dayOff(d.key);
      return `<button class="date" data-b-date="${d.key}" aria-pressed="${B.date===d.key}" ${off?'disabled':''}><small>${d.today ? t('today') : fmtDate(d.dt,{weekday:'short'})}</small><b>${fmtDate(d.dt,{day:'numeric'})}</b><small>${off ? t('dayOff') : fmtDate(d.dt,{month:'short'})}</small></button>`; }).join('') + `</div>`;
  }
  if (B.step === 4){
    loadTaken();
    if (SRV && B.taken === null) h += `<div class="empty">${t('slotsLoading')}</div>`;
    else {
      const all = slots(); const m = all.filter(x => x < 14*60), e = all.filter(x => x >= 16*60);
      const row = arr => `<div class="slots">` + arr.map(x => `<button class="slot" data-b-time="${x}" aria-pressed="${B.time===x}" ${slotDisabled(x)?'disabled':''}>${fmtTime(x)}</button>`).join('') + `</div>`;
      h += all.every(slotDisabled) ? `<div class="empty">${t('noSlots')}</div>` : `<div class="grp-l">${t('morning')}</div>${row(m)}<div class="grp-l">${t('evening')}</div>${row(e)}`;
    }
  }
  if (B.step === 5){
    const e = B.errs;
    h += `<div class="form-g">
      <div class="fld ${e.name?'bad':''}"><label for="bName">${t('fName')} *</label><input id="bName" autocomplete="name" maxlength="60" value="${esc(B.name)}"><span class="err">${e.name?t('eName'):''}</span></div>
      <div class="fld ${e.phone?'bad':''}"><label for="bPhone">${t('fPhone')} *</label><input id="bPhone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="14" value="${esc(B.phone)}"><span class="err">${e.phone?t('ePhone'):''}</span></div>
      <div class="fld"><label for="bAge">${t('fAge')}</label><input id="bAge" inputmode="numeric" maxlength="3" value="${esc(B.age)}"></div>
      <div class="fld"><label for="bLoc">${t('fLoc')}</label><select id="bLoc">${LOCS.map(l => `<option value="${l.id}" ${B.loc===l.id?'selected':''}>${p(l.n)}</option>`).join('')}</select></div>
      <div class="fld full"><label for="bNote">${t('fNote')}</label><textarea id="bNote" maxlength="300">${esc(B.note)}</textarea></div>
      <div class="hp" aria-hidden="true"><label for="bWeb">Website</label><input id="bWeb" tabindex="-1" autocomplete="off" value=""></div></div>`;
  }
  if (B.step === 6){
    const d = days().find(x => x.key===B.date);
    const rows = [['sumService', svcInfo(B.svc).label], ['sumDoctor', B.doc==='any'?t('anyDoc'):p(docById(B.doc).n)],
      ['sumDate', fmtDate(d.dt,{weekday:'long',day:'numeric',month:'long'})], ['sumTime', fmtTime(B.time)], ['sumLoc', p(LOCS.find(l=>l.id===B.loc).n)],
      ['sumName', esc(B.name) + (B.age ? `, ${esc(B.age)}` : '')], ['sumPhone', esc(B.phone)]];
    h += `<div class="sum">${rows.map(([k,v]) => `<div><span>${t(k)}</span><b>${v}</b></div>`).join('')}</div>
      <p class="bk-note">${ic('i-shield')}<span>${SRV ? t('bkNoteOnline') : t('bkNote')}</span></p>`;
  }
  body.innerHTML = h;
  $('#bkBack').style.visibility = B.step === 1 ? 'hidden' : 'visible';
  const nx = $('#bkNext'); nx.disabled = !valid(); nx.style.opacity = valid() ? 1 : .45;
  nx.querySelector('span').innerHTML = B.step === 6 ? (B.busy ? t('sending') : SRV ? t('confirmOnline') : t('confirm')) : t('next');
}
function waLink(){
  const d = days().find(x => x.key===B.date) || days()[0];
  const lines = ['Hello Dent Plus, I would like to book an appointment.', ''];
  if (B.ref) lines.push('Reference: ' + B.ref);
  lines.push('Service: ' + (svcInfo(B.svc) ? svcInfo(B.svc).en : '-'),
    'Doctor: ' + (B.doc==='any' || !B.doc ? 'Any available doctor' : docById(B.doc).n[0]),
    'Date: ' + d.dt.toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata',weekday:'short',day:'numeric',month:'short',year:'numeric'}),
    'Time: ' + (B.time === null ? '-' : (() => { const s=L; L='en'; const r=fmtTime(B.time); L=s; return r; })()),
    'Clinic: ' + LOCS.find(l=>l.id===B.loc).n[0],
    'Patient: ' + B.name + (B.age ? ' (Age ' + B.age + ')' : ''),
    'Mobile: ' + B.phone);
  if (B.note) lines.push('Note: ' + B.note);
  return `https://wa.me/${CFG.whatsapp[catOf()]}?text=${encodeURIComponent(lines.join('\n'))}`;
}
function readForm(){
  if (B.step !== 5) return;
  B.name = $('#bName').value.trim(); B.phone = $('#bPhone').value.replace(/[^\d+]/g,''); B.age = $('#bAge').value.replace(/\D/g,'');
  B.loc = $('#bLoc').value; B.note = $('#bNote').value.trim(); B.web = $('#bWeb').value;
}
async function submitOnline(){
  B.busy = true; B.msg = ''; renderBook();
  try {
    const r = await fetch('/api/book', {method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({svc:B.svc, doc:B.doc, date:B.date, time:B.time, loc:B.loc, name:B.name, phone:B.phone, age:B.age, note:B.note, lang:L, website:B.web})});
    const j = await r.json().catch(() => ({}));
    B.busy = false;
    if (r.ok && j.id){ B.ref = j.id; B.done = true; track('book_done'); }
    else if (r.status === 409){ B.msg = t('slotTaken'); B.step = 4; B.time = null; B.takenKey = ''; }
    else if (r.status === 400 || r.status === 429){ B.msg = j.error || t('slotTaken'); }
    else { B.fallback = true; B.done = true; }
  } catch(_) { B.busy = false; B.fallback = true; B.done = true; }
  renderBook();
}
function nextStep(){
  B.msg = '';
  if (B.step === 5){
    readForm(); const digits = B.phone.replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'');
    B.errs = {name: !B.name, phone: !/^[6-9]\d{9}$/.test(digits)};
    if (B.errs.name || B.errs.phone){ renderBook(); $(B.errs.name?'#bName':'#bPhone').focus(); return; }
    B.phone = digits;
  }
  if (B.step === 6){
    if (B.busy) return;
    if (SRV) return submitOnline();
    window.open(waLink(), '_blank', 'noopener'); track('book_done'); B.done = true; renderBook(); return;
  }
  if (!valid()) return;
  B.step++;
  renderBook(); $('#bk').scrollIntoView({behavior:'smooth', block:'nearest'});
}
function goBook(opts){
  Object.assign(B, {step:1, svc:null, doc:null, date:null, time:null, done:false, errs:{}, taken:null, takenKey:'', busy:false, ref:null, fallback:false, msg:''}, opts||{});
  const info = svcInfo(B.svc);
  if (info){
    B.step = 2;
    if (B.doc && B.doc !== 'any' && !info.docs.includes(B.doc)) B.doc = null;
    if (B.doc){ B.step = 3; if (B.date && !dayOff(B.date)) B.step = 4; else B.date = null; }
  } else { B.svc = null; B.date = null; }
  renderBook(); closeModal();
  document.getElementById('book').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});
}

/* ---------- packages ---------- */
function renderPackages(){
  const wrap = $('#packages'); if (!wrap) return;
  wrap.hidden = !PACKAGES.length;
  $('#pkGrid').innerHTML = PACKAGES.map((k, idx) => {
    const items = (k.items && (k.items[L] && k.items[L].length ? k.items[L] : k.items.en)) || [];
    const price = k.price != null
      ? `<span class="pk-price">₹${k.price.toLocaleString('en-IN')}</span>${k.mrp && k.mrp > k.price ? `<s class="pk-mrp">₹${k.mrp.toLocaleString('en-IN')}</s><span class="pk-save">${t('pkSave',{x:(k.mrp-k.price).toLocaleString('en-IN')})}</span>` : ''}`
      : `<span class="pk-ask">${t('askPrice')}</span>`;
    return `<article class="pk${idx === 0 && PACKAGES.length > 2 ? ' feat' : ''}">${idx === 0 && PACKAGES.length > 2 ? `<span class="pk-badge">${t('pkPopular')}</span>` : ''}
      <span class="pk-cat">${t(k.cat==='dental'?'tabDental':'tabFamily')}</span>
      <h3>${esc(tx(k.name))}</h3>
      <div class="pk-pr">${price}</div>
      <ul>${items.map(i => `<li>${ic('i-check')}<span>${esc(i)}</span></li>`).join('')}</ul>
      <button class="btn btn-p btn-sm" data-pkg-book="${esc(k.id)}">${t('pkBook')}${ic('i-arrow','i arr')}</button>
    </article>`; }).join('');
}

/* ---------- announcement bar ---------- */
function renderAnn(){
  const el = $('#annc'); const txt = ANN ? (ANN.text[L] || ANN.text.en) : '';
  let dismissed = ''; try { dismissed = sessionStorage.getItem('dp-annc') || ''; } catch(_) {}
  if (!txt || dismissed === (ANN.text.en || txt)){ el.hidden = true; return; }
  el.hidden = false; el.className = 'annc annc-' + (ANN.style || 'info');
  el.innerHTML = `<div class="wrap"><span class="annc-t">${ic(ANN.style==='alert'?'i-alert':ANN.style==='offer'?'i-spark':'i-plus')}<span>${esc(txt)}</span>${ANN.link ? ` <a href="${esc(ANN.link)}">${t('annMore')} →</a>` : ''}</span>
    <button class="annc-x" data-annc-x aria-label="${t('annClose')}">${ic('i-x')}</button></div>`;
}

/* ---------- server data + anonymous tracking ---------- */
async function loadServer(){
  try {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch('/api/public', {signal:ctl.signal}); clearTimeout(to);
    if (!r.ok) return;
    const j = await r.json();
    SRV = j;
    if (j.whatsapp && j.whatsapp.dental) CFG.whatsapp = j.whatsapp;
    if (j.reviewUrl) CFG.reviewsUrl = j.reviewUrl;
    if (Array.isArray(j.packages)) PACKAGES = j.packages;
    BLOCKS = Array.isArray(j.blocks) ? j.blocks : [];
    ANN = j.announcement || null;
    renderAll();
  } catch(_) {}
}
function track(e){
  try {
    const body = JSON.stringify({e});
    if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], {type:'application/json'}));
    else fetch('/api/track', {method:'POST', body, keepalive:true, headers:{'Content-Type':'application/json'}});
  } catch(_) {}
}
function trackOnce(e){ try { if (sessionStorage.getItem('dp-t-' + e)) return; sessionStorage.setItem('dp-t-' + e, '1'); } catch(_) {} track(e); }
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]'); if (!a) return;
  const h = a.getAttribute('href');
  if (h.startsWith('tel:')) track('call');
  else if (h.includes('wa.me/')) track('whatsapp');
  else if (h.includes('google.com/maps')) track('directions');
}, true);

/* ---------- render all ---------- */
function renderAll(){
  applyStatic(); renderAnn(); renderServices(); renderPackages(); lastOpen = null; renderStatus(); renderGallery(); renderQuick();
  renderJourney(); renderFaq(); renderReviews(); renderLocs(); renderBook(); setupReveal();
  const wa = `https://wa.me/${CFG.whatsapp.dental}?text=${encodeURIComponent('Hello Dent Plus, I would like to book an appointment.')}`;
  $('#mWa').href = wa; $('#faqWa').href = wa;
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-pkg-book],[data-annc-x],[data-lang],[data-cat],[data-svc-open],[data-doc-open],[data-doc-book],[data-book-svc],[data-f],[data-loc],[data-b-svc],[data-b-doc],[data-b-date],[data-b-time],[data-mclose],[data-close],.acc-b,#bkAgain,[data-tab],[data-svc]');
  if (!el) { if (e.target.id === 'modal') closeModal(); return; }
  const d = el.dataset;
  if (d.pkgBook){ track('package_click'); goBook({svc:'pkg:' + d.pkgBook}); return; }
  if ('anncX' in d){ try { sessionStorage.setItem('dp-annc', ANN.text.en || ANN.text[L]); } catch(_){} $('#annc').hidden = true; return; }
  if (d.lang){ L = d.lang; try{localStorage.setItem('dp-lang', L);}catch(_){}; renderAll(); return; }
  if (d.cat){ svcCat = d.cat; renderServices(); return; }
  if (d.tab){ svcCat = d.tab; renderServices(); }
  if (d.svcOpen){ e.preventDefault(); if (el.closest('footer')) { svcCat = svcById(d.svcOpen).cat; renderServices(); } svcModal(d.svcOpen); return; }
  if (d.docOpen){ docModal(d.docOpen); return; }
  if (d.docBook){ goBook({doc:d.docBook}); return; }
  if (d.bookSvc){ goBook({svc:d.bookSvc}); return; }
  if (d.svc && el.tagName === 'A'){ e.preventDefault(); goBook({svc:d.svc}); return; }
  if (d.f){ docF = d.f; $$('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.f===docF))); renderDocs(); return; }
  if (d.loc){ locSel = d.loc; B.loc = d.loc; renderLocs(); return; }
  if (d.bSvc){ B.svc = d.bSvc; trackOnce('book_start'); const i = svcInfo(B.svc); if (B.doc && B.doc!=='any' && i && !i.docs.includes(B.doc)) B.doc = null; B.takenKey=''; renderBook(); return; }
  if (d.bDoc){ B.doc = d.bDoc; B.takenKey=''; if (B.date && dayOff(B.date)) B.date = null; renderBook(); return; }
  if (d.bDate){ B.date = d.bDate; B.takenKey=''; B.taken=null; B.time = null; renderBook(); return; }
  if (d.bTime){ B.time = +d.bTime; renderBook(); return; }
  if ('mclose' in d){ closeModal(); return; }
  if ('close' in d){ toggleMenu(false); return; }
  if (el.classList.contains('acc-b')){ const it = el.parentElement; const on = !it.classList.contains('open'); it.classList.toggle('open', on); el.setAttribute('aria-expanded', on); return; }
  if (el.id === 'bkAgain'){ goBook(); return; }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){ closeModal(); toggleMenu(false); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-loc]')){ e.preventDefault(); e.target.click(); }
});
$('#bkNext').addEventListener('click', nextStep);
$('#bkBack').addEventListener('click', () => { readForm(); B.msg=''; if (B.step>1){ B.step--; renderBook(); } });
$('#docQ').addEventListener('input', e => { docQ = e.target.value; renderDocs(); });
function toggleMenu(on){ $('#mnav').classList.toggle('on', on); $('#mnav').setAttribute('aria-hidden', String(!on)); $('#burger').setAttribute('aria-expanded', String(on)); document.body.style.overflow = on ? 'hidden' : ''; }
$('#burger').addEventListener('click', () => toggleMenu(true));

/* ---------- header state + active nav (IntersectionObserver: no scroll-event work) ---------- */
const hdr = $('#hdr');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window){
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(([en]) => hdr.classList.toggle('scrolled', !en.isIntersecting)).observe(sentinel);
  const navLinks = $$('.nav ul a');
  const navIO = new IntersectionObserver(ents => ents.forEach(en => {
    if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), {rootMargin:'-45% 0px -50% 0px'});
  ['services','packages','doctors','why','reviews','contact'].forEach(id => { const s = document.getElementById(id); if (s) navIO.observe(s); });
}

/* ---------- broken images fade out instead of showing an icon ---------- */
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.classList.add('broken'); }, true);

/* ---------- reveal on scroll + counters ---------- */
let io;
function setupReveal(){
  const els = $$('.rv-up:not(.in), .stagger:not(.in)');
  if (reduce || !('IntersectionObserver' in window)){ els.forEach(el => el.classList.add('in')); return; }
  if (!io) io = new IntersectionObserver(ents => ents.forEach(en => {
    if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); count(en.target); }
  }), {threshold:.1, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el => io.observe(el));
}
function count(root){
  if (reduce) return;
  root.querySelectorAll('[data-count]').forEach(el => { const n = +el.dataset.count; let s = null;
    const step = ts => { if (!s) s = ts; const k = Math.min((ts - s)/1100, 1); el.textContent = Math.round(n * (1 - Math.pow(1-k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); });
}

/* ---------- map: load Google Maps only when needed (saves ~1 MB on first visit) ---------- */
let mapOn = false;
function loadMap(){ mapOn = true; $('#mapPh').hidden = true; $('#mapFrame').hidden = false; renderLocs(); }
$('#mapLoad').addEventListener('click', loadMap);
if ('IntersectionObserver' in window){
  const mio = new IntersectionObserver(([en]) => { if (en.isIntersecting){ loadMap(); mio.disconnect(); } }, {rootMargin:'200px'});
  mio.observe($('#mapBox'));
}

/* ---------- fonts: self-hosted; Telugu/Hindi files download only when those scripts appear on screen ---------- */
function ensureFont(){}

/* ---------- desktop-only flourishes: soft spotlight on cards + custom cursor (paused when idle) ---------- */
if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce){
  let spotEl = null, sx = 0, sy = 0, spotQ = false;
  document.addEventListener('pointermove', e => {
    const el = e.target.closest('.spot'); if (!el) return;
    spotEl = el; sx = e.clientX; sy = e.clientY;
    if (!spotQ){ spotQ = true; requestAnimationFrame(() => { spotQ = false; const r = spotEl.getBoundingClientRect(); spotEl.style.setProperty('--mx', (sx - r.left) + 'px'); spotEl.style.setProperty('--my', (sy - r.top) + 'px'); }); }
  }, {passive:true});

  const c = $('#cur'), lab = c.querySelector('span'); let x = 0, y = 0, cx = 0, cy = 0, running = false;
  const loop = () => {
    cx += (x - cx) * .24; cy += (y - cy) * .24;
    c.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    if (Math.abs(x - cx) + Math.abs(y - cy) > .3) requestAnimationFrame(loop); else running = false;
  };
  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    const el = e.target.closest('[data-cursor]'), act = e.target.closest('a,button,input,select,textarea,[role=button]');
    const cls = el && (!act || el.matches('.bt')) ? 'cur on lab' : 'cur on' + (act ? ' grow' : '');
    if (c.className !== cls) c.className = cls;
    if (el && lab.textContent !== el.dataset.cursor) lab.textContent = el.dataset.cursor;
    if (!running){ running = true; requestAnimationFrame(loop); }
  }, {passive:true});
  document.addEventListener('mouseleave', () => c.classList.remove('on'));
}

$('#yr').textContent = new Date().getFullYear();
$('#qb').addEventListener('submit', quickGo);
$('#qb').addEventListener('change', e => {
  if (e.target.id === 'qbSvc'){ QB.svc = e.target.value; renderQuick(); }
  if (e.target.id === 'qbDoc'){ QB.doc = e.target.value; renderQuick(); }
  if (e.target.id === 'qbDate') QB.date = e.target.value;
});
renderAll();
loadServer();
trackOnce('view');
setInterval(renderStatus, 60000);
