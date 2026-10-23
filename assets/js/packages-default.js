/* Starter health packages, shown until the clinic saves its own in the admin panel.
   Prices are left empty on purpose ("Ask for price"); set real prices in Admin → Packages. */
window.DP_DEFAULT_PACKAGES = [
  { id:'dental-checkup', cat:'dental', active:true, price:null, mrp:null,
    name:{ en:'Complete Dental Check-up', te:'సంపూర్ణ దంత పరీక్ష', hi:'संपूर्ण दंत जाँच' },
    items:{
      en:['Examination by a dental specialist','Gum and cavity check','Oral hygiene guidance','Treatment plan with cost estimate'],
      te:['దంత నిపుణుడితో పరీక్ష','చిగుళ్ళు, పిప్పి పరీక్ష','నోటి శుభ్రతపై సలహాలు','ఖర్చు అంచనాతో చికిత్స ప్లాన్'],
      hi:['दंत विशेषज्ञ द्वारा जाँच','मसूड़ों और कैविटी की जाँच','मुँह की सफ़ाई पर सलाह','खर्च के अनुमान के साथ इलाज योजना'] } },
  { id:'kids-smile', cat:'dental', active:true, price:null, mrp:null,
    name:{ en:'Kids’ Smile Protection', te:'పిల్లల నవ్వు రక్షణ', hi:'बच्चों की मुस्कान सुरक्षा' },
    items:{
      en:['Child-friendly dental check-up','Fluoride gel application','Preventive sealants (if advised)','Check for early crooked teeth'],
      te:['పిల్లలకు అనుకూలమైన దంత పరీక్ష','ఫ్లోరైడ్ జెల్ అప్లికేషన్','ప్రివెంటివ్ సీలెంట్స్ (అవసరమైతే)','వంకర పళ్ళ ప్రారంభ పరీక్ష'],
      hi:['बच्चों के अनुकूल दंत जाँच','फ्लोराइड जेल लगाना','प्रिवेंटिव सीलेंट (ज़रूरत हो तो)','टेढ़े दाँतों की शुरुआती जाँच'] } },
  { id:'diabetic-care', cat:'family', active:true, price:null, mrp:null,
    name:{ en:'Diabetic Care Check', te:'షుగర్ కేర్ చెకప్', hi:'डायबिटीज़ केयर जाँच' },
    items:{
      en:['Doctor consultation','Blood pressure & sugar check','Retina (eye) examination','Diet and follow-up advice'],
      te:['డాక్టర్ కన్సల్టేషన్','బి.పి & షుగర్ పరీక్ష','రెటీనా (కంటి) పరీక్ష','ఆహారం & ఫాలో-అప్ సలహాలు'],
      hi:['डॉक्टर से परामर्श','ब्लड प्रेशर और शुगर जाँच','रेटिना (आँख) जाँच','खान-पान और फ़ॉलो-अप सलाह'] } },
  { id:'womens-wellness', cat:'family', active:true, price:null, mrp:null,
    name:{ en:'Women’s Wellness', te:'మహిళల ఆరోగ్య పరీక్ష', hi:'महिला स्वास्थ्य जाँच' },
    items:{
      en:['Consultation with women’s health specialist','Pap smear test','HPV vaccine guidance','Family planning counselling'],
      te:['స్త్రీల ఆరోగ్య నిపుణులతో కన్సల్టేషన్','పాప్ స్మియర్ పరీక్ష','HPV టీకాపై సలహా','ఫ్యామిలీ ప్లానింగ్ కౌన్సెలింగ్'],
      hi:['महिला स्वास्थ्य विशेषज्ञ से परामर्श','पैप स्मीयर जाँच','HPV टीके पर सलाह','परिवार नियोजन काउंसलिंग'] } }
];
