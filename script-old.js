let generatedOTP = "";
let otpTimer = null;
let otpSeconds = 30;

function showError(msg){
  document.getElementById('loginMsg').innerHTML = `<b style="color:red">❌ ${msg}</b>`;
}

function sendOTP(){
  let name = document.getElementById('name').value.trim();
  let phone = document.getElementById('phone').value.trim();
  let email = document.getElementById('email').value.trim().toLowerCase();

  if(!name){
    showError("Mundu nee peru pettu!");
    return;
  }

  // MOBILE - 10 DIGITS MATRAMAE
  if(phone.length == 0){
    showError("Mobile Number pettu! 10 Digits undali.");
    return;
  }
  if(phone.length < 10){
    showError("Mobile Number Thakkuva Ayindi! 10 Digits undali. Nuvvu " + phone.length + " digits matrame pettav.");
    return;
  }
  if(phone.length > 10){
    showError("Mobile Number Ekkuva Ayindi! 10 Digits matrame undali.");
    return;
  }
  if(!/^[0-9]{10}$/.test(phone)){
    showError("Mobile Number lo Numbers matrame undali! 10 Digits Only.");
    return;
  }
  if(!/^[6-9]/.test(phone)){
    showError("Mobile Number 6,7,8,9 tho start avvali!");
    return;
  }

  // EMAIL - @gmail.com MATRAMAE
  if(!email){
    showError("Email pettu! Ex: raju@gmail.com");
    return;
  }
  if(!email.endsWith("@gmail.com")){
    showError("Email Thappu! Last lo @gmail.com tho ne undali.");
    return;
  }

  // OTP SEND
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  console.log("OTP: " + generatedOTP);

  document.getElementById('loginMsg').innerHTML =
    `<b style="color:green">✅ OTP Send Ayindi!</b><br>
     📱 Mobile (10 Digits): ${phone}<br>
     📧 Email: ${email}<br>
     <b style="color:red; font-size:22px">DEMO OTP: ${generatedOTP}</b><br>
     <span id="otpTimerTxt">Resend ki 30 sec aagu...</span>`;

  document.getElementById('otp').value = "";
  document.getElementById('otp').focus();

  otpSeconds = 30;
  clearInterval(otpTimer);
  otpTimer = setInterval(function(){
    otpSeconds--;
    let t = document.getElementById('otpTimerTxt');
    if(t) t.innerText = "Resend ki " + otpSeconds + " sec aagu...";
    if(otpSeconds <= 0){
      clearInterval(otpTimer);
      if(t) t.innerHTML = `<button onclick="sendOTP()" style="padding:8px 14px;background:#2E7D32;color:white;border:none;border-radius:8px;cursor:pointer">🔄 OTP Malli Pampu</button>`;
    }
  }, 1000);
}

function verifyOTP(){
  let entered = document.getElementById('otp').value.trim();
  let name = document.getElementById('name').value.trim() || "రైతు";
  if(!generatedOTP){
    showError("Mundu OTP Pampu button nokku!");
    return;
  }
  if(entered == ""){
    showError("OTP pettu!");
    return;
  }
  if(entered == generatedOTP){
    clearInterval(otpTimer);
    alert("✅ Login Success! Welcome " + name);
    document.getElementById('loginBox').style.display = "none";
    document.getElementById('dashboard').style.display = "block";
    document.getElementById('userName').innerText = name;
  } else {
    showError("OTP Thappu! Correct OTP: " + generatedOTP);
  }
}

// Phone lo numbers matrame padela
document.addEventListener('DOMContentLoaded', function(){
  let p = document.getElementById('phone');
  if(p){
    p.addEventListener('input', function(){
      this.value = this.value.replace(/[^0-9]/g, '').slice(0,10);
    });
  }
});
// ===== LANGUAGE + CALCULATOR - FINAL =====
let currentLang = localStorage.getItem('lang') || 'te';

const translations = {
  en: {
    calcTitle: "🧮 Pond Calculator",
    calcRateTitle: "📅 Today's Market Rate:",
    calcAcreLabel: "🐟 Pond Acres:",
    calcTypeLabel: "🐠 Type:",
    calcChepa: "🐟 Fish",
    calcRoyya: "🦐 Prawn",
    calcSeed: "🐣 Seed ₹:",
    calcFeed: "🌾 Feed ₹/kg:",
    calcSell: "💰 Selling ₹/kg:",
    calcBtn: "🧮 Calculate"
  },
  te: {
    calcTitle: "🧮 చెరువు కాలిక్యులేటర్",
    calcRateTitle: "📅 ఈ రోజు మార్కెట్ రేటు:",
    calcAcreLabel: "🐟 చెరువు ఎకరాలు:",
    calcTypeLabel: "🐠 రకం:",
    calcChepa: "🐟 చేప",
    calcRoyya: "🦐 రొయ్య",
    calcSeed: "🐣 సీడ్ ₹:",
    calcFeed: "🌾 ఫీడ్ ₹/kg:",
    calcSell: "💰 అమ్మకం ₹/kg:",
    calcBtn: "🧮 లెక్కించు"
  },
  hi: {
    calcTitle: "🧮 तालाब कैलकुलेटर",
    calcRateTitle: "📅 आज का मार्केट रेट:",
    calcAcreLabel: "🐟 तालाब एकड़:",
    calcTypeLabel: "🐠 प्रकार:",
    calcChepa: "🐟 मछली",
    calcRoyya: "🦐 झींगा",
    calcSeed: "🐣 सीड ₹:",
    calcFeed: "🌾 फीड ₹/kg:",
    calcSell: "💰 बिक्री ₹/kg:",
    calcBtn: "🧮 गणना करें"
  }
};

// Nee site lo unna setLanguage / changeLanguage function unte - dani badulu idi petti
// Leda - nee patha function lo ee 3 lines ni add chey
function setLanguage(lang){
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    let key = el.getAttribute('data-i18n');
    if(translations[lang] && translations[lang][key]){
      el.textContent = translations[lang][key];
    }
  });
  // Language marchagane - Result kuda aa language lo ki marali ante
  let res = document.getElementById('calcResult');
  if(res && res.innerHTML !== ""){ calcPond(); }
}

function calcPond(){
  try{
    let acres = parseFloat(document.getElementById('calcAcre').value) || 1;
    let type = document.getElementById('calcType').value;
    let out = document.getElementById('calcResult');
    if(!out) return;
    let seedRate = parseFloat(document.getElementById('rateSeed').value) || 0;
    let feedRate = parseFloat(document.getElementById('rateFeed').value) || 0;
    let sellRate = parseFloat(document.getElementById('rateSell').value) || 0;

    let T;
    if(currentLang === 'hi'){
      T = { seed:"सीड", feed:"फीड", other:"अन्य खर्च", harvest:"उपज", fish:"मछली", prawn:"झींगा", total:"कुल खर्च", income:"आय", profit:"लाभ" };
    } else if(currentLang === 'en'){
      T = { seed:"Seed", feed:"Feed", other:"Other Cost", harvest:"Harvest", fish:"Fish", prawn:"Prawns", total:"Total Cost", income:"Income", profit:"Profit" };
    } else {
      T = { seed:"సీడ్", feed:"ఫీడ్", other:"ఇతర ఖర్చులు", harvest:"దిగుబడి", fish:"చేపలు", prawn:"రొయ్యలు", total:"మొత్తం ఖర్చు", income:"ఆదాయం", profit:"లాభం" };
    }

    let totalCost=0, revenue=0, harvestKg=0, detail="";
    if(type === "chepa"){
      let fingerlings = Math.round(4000 * acres);
      let harvestFish = Math.round(fingerlings * 0.80);
      harvestKg = Math.round(harvestFish * 1.0);
      let feedKg = Math.round(harvestKg * 1.5);
      let seedCost = fingerlings * seedRate;
      let feedCost = feedKg * feedRate;
      let otherCost = 1800 * 8 * acres;
      totalCost = seedCost + feedCost + otherCost;
      revenue = harvestKg * sellRate;
      detail = T.seed+": "+fingerlings+" x ₹"+seedRate+" = ₹"+Math.round(seedCost).toLocaleString('en-IN')+
               "<br>"+T.feed+": "+feedKg+" Kg x ₹"+feedRate+" = ₹"+Math.round(feedCost).toLocaleString('en-IN')+
               "<br>"+T.other+": ₹"+Math.round(otherCost).toLocaleString('en-IN')+
               "<br>"+T.harvest+": "+harvestFish+" "+T.fish+" = "+harvestKg+" Kg";
    } else {
      let seedCount = Math.round(50000 * acres);
      let harvestCount = Math.round(seedCount * 0.70);
      harvestKg = Math.round(harvestCount * 0.025);
      let feedKg = Math.round(harvestKg * 1.4);
      let seedCost = Math.round(seedCount * seedRate);
      let feedCost = feedKg * feedRate;
      let otherCost = Math.round(25000 * acres);
      totalCost = seedCost + feedCost + otherCost;
      revenue = harvestKg * sellRate;
      detail = T.seed+": "+seedCount+" x ₹"+seedRate+" = ₹"+Math.round(seedCost).toLocaleString('en-IN')+
               "<br>"+T.feed+": "+feedKg+" Kg x ₹"+feedRate+" = ₹"+Math.round(feedCost).toLocaleString('en-IN')+
               "<br>"+T.other+": ₹"+Math.round(otherCost).toLocaleString('en-IN')+
               "<br>"+T.harvest+": "+harvestCount.toLocaleString('en-IN')+" "+T.prawn+" = "+harvestKg+" Kg";
    }
    let profit = revenue - totalCost;
    out.innerHTML = "<hr><b>"+T.total+": ₹"+Math.round(totalCost).toLocaleString('en-IN')+"</b><br>"+detail+"<br><b>"+T.income+": ₹"+Math.round(revenue).toLocaleString('en-IN')+" ("+harvestKg+" Kg x ₹"+sellRate+")</b><br><b>"+T.profit+": ₹"+Math.round(profit).toLocaleString('en-IN')+"</b>";
  } catch(e){ alert("Error: " + e.message); }
}