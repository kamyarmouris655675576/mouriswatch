(() => {
  "use strict";
  const loaderStartedAt=Date.now();
  let loaderHideTimer=null;
  const hideLoader=()=>{const el=document.getElementById("preloader");if(el)el.classList.add("hidden-loader");};
  const scheduleLoaderHide=()=>{
    if(loaderHideTimer!==null)return;
    const remaining=Math.max(0,1000-(Date.now()-loaderStartedAt));
    loaderHideTimer=setTimeout(hideLoader,remaining);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",scheduleLoaderHide,{once:true});else scheduleLoaderHide();
  window.addEventListener("load",scheduleLoaderHide,{once:true});
  window.addEventListener("pageshow",()=>{document.body.classList.remove("page-fade-out");scheduleLoaderHide();});
  const progress=document.getElementById("progress-bar");
  if(progress){const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,Math.max(0,scrollY/max*100)):0)+"%";};addEventListener("scroll",update,{passive:true});addEventListener("resize",update,{passive:true});update();}
  const faDigits="۰۱۲۳۴۵۶۷۸۹";
  const englishDigits=v=>String(v??"").replace(/[۰-۹]/g,d=>String(faDigits.indexOf(d))).replace(/[٠-٩]/g,d=>String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const onlyDigits=v=>englishDigits(v).replace(/\D/g,"");

  // تبدیل عدد قیمت به حروف فارسی
  const ones=["","یک","دو","سه","چهار","پنج","شش","هفت","هشت","نه"];
  const teens=["ده","یازده","دوازده","سیزده","چهارده","پانزده","شانزده","هفده","هجده","نوزده"];
  const tens=["","","بیست","سی","چهل","پنجاه","شصت","هفتاد","هشتاد","نود"];
  const hundreds=["","یکصد","دویست","سیصد","چهارصد","پانصد","ششصد","هفتصد","هشتصد","نهصد"];
  const scales=["","هزار","میلیون","میلیارد","تریلیون"];
  function under1000(n){let a=[];if(n>=100){a.push(hundreds[Math.floor(n/100)]);n%=100;}if(n>=10&&n<20)a.push(teens[n-10]);else{if(n>=20){a.push(tens[Math.floor(n/10)]);n%=10;}if(n)a.push(ones[n]);}return a.join(" و ");}
  function numberWords(value){let n=Number(value);if(!Number.isFinite(n)||n<=0)return "صفر";n=Math.floor(n);let parts=[],i=0;while(n>0&&i<scales.length){const chunk=n%1000;if(chunk){let part=under1000(chunk);if(scales[i])part+=" "+scales[i];parts.unshift(part);}n=Math.floor(n/1000);i++;}return parts.join(" و ")||"صفر";}
  document.querySelectorAll("[data-price-format]").forEach(input=>{
    const words=document.querySelector(`[data-price-words="${input.id}"]`);
    const update=()=>{const raw=onlyDigits(input.value);input.value=raw?Number(raw).toLocaleString("en-US"):"";if(words)words.textContent=raw?`به حروف: ${numberWords(raw)} تومان`:"به حروف: — تومان";};
    input.addEventListener("input",update);input.addEventListener("blur",update);update();
  });
  document.querySelectorAll('input[type="tel"]').forEach(input=>input.addEventListener("input",()=>{let v=onlyDigits(input.value);if(v.startsWith("0098"))v="0"+v.slice(4);else if(v.startsWith("98"))v="0"+v.slice(2);else if(v.startsWith("9")&&v.length===10)v="0"+v;input.value=v;if(/^09\d{9}$/.test(v)){input.classList.add("valid-phone");input.classList.remove("input-error");}else input.classList.remove("valid-phone");}));

  // تقویم شمسی تعاملی؛ نمایش ماه و روزها به‌صورت شماتیک و قابل انتخاب
  const cal=document.getElementById("jalali-calendar"),dateInput=document.getElementById("expected-date"),openCal=document.getElementById("open-jalali-calendar");
  if(cal&&dateInput&&openCal){
    // کلیک‌های داخل تقویم (به‌خصوص دکمه‌های جابه‌جایی ماه) نباید به تشخیص کلیک بیرون برسند.
    cal.addEventListener("click",e=>e.stopPropagation());
    const fmt=new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn",{year:"numeric",month:"numeric",day:"numeric"});
    const monthNames=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
    const parts=d=>Object.fromEntries(fmt.formatToParts(d).filter(x=>x.type!=="literal").map(x=>[x.type,Number(x.value)]));
    const today=new Date();let state=parts(today),selected="";
    let monthAnchor;
    function firstGregorianOfJalali(y,m,anchor){for(let delta=-40;delta<=40;delta++){const d=new Date(anchor);d.setDate(d.getDate()+delta);const p=parts(d);if(p.year===y&&p.month===m&&p.day===1)return d;}return new Date(anchor);}
    monthAnchor=firstGregorianOfJalali(state.year,state.month,today);
    function moveMonth(step){
      let year=state.year,month=state.month+step;
      if(month<1){month=12;year--;}
      if(month>12){month=1;year++;}
      const anchor=new Date(monthAnchor);
      monthAnchor=firstGregorianOfJalali(year,month,anchor);
      state={year,month};
      render();
    }
    function localDateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
    function render(){const first=new Date(monthAnchor);const offset=(first.getDay()+1)%7;let html=`<div class="jalali-calendar-head"><button type="button" data-cal-prev aria-label="ماه قبل">ماه قبل</button><strong class="jalali-calendar-title">${monthNames[state.month-1]} ${state.year.toLocaleString("fa-IR")}</strong><button type="button" data-cal-next aria-label="ماه بعد">ماه بعد</button></div><div class="jalali-calendar-grid">${["ش","ی","د","س","چ","پ","ج"].map(x=>`<span class="jalali-calendar-weekday">${x}</span>`).join("")}`;
      for(let i=0;i<offset;i++)html+='<span class="jalali-calendar-day empty"></span>';
      const cursor=new Date(first);for(let i=0;i<31;i++){const p=parts(cursor);if(p.year!==state.year||p.month!==state.month)break;const iso=localDateKey(cursor);const todayFlag=p.year===parts(today).year&&p.month===parts(today).month&&p.day===parts(today).day;html+=`<button type="button" class="jalali-calendar-day${todayFlag?' today':''}${selected===iso?' selected':''}" data-date="${iso}">${p.day.toLocaleString("fa-IR")}</button>`;cursor.setDate(cursor.getDate()+1);}
      html+='</div><div class="jalali-calendar-foot">برای انتخاب، روی روز موردنظر بزنید</div>';cal.innerHTML=html;
      cal.querySelector("[data-cal-prev]").addEventListener("click",()=>moveMonth(-1));cal.querySelector("[data-cal-next]").addEventListener("click",()=>moveMonth(1));
      cal.querySelectorAll("[data-date]").forEach(btn=>btn.addEventListener("click",()=>{selected=btn.dataset.date;const d=new Date(selected+"T12:00:00");dateInput.value=new Intl.DateTimeFormat("fa-IR-u-ca-persian",{year:"numeric",month:"long",day:"numeric"}).format(d);dateInput.dataset.iso=selected;cal.classList.add("hidden");dateInput.setAttribute("aria-expanded","false");}));
    }
    openCal.addEventListener("click",()=>{const hidden=cal.classList.toggle("hidden");dateInput.setAttribute("aria-expanded",String(!hidden));if(!hidden)render();});
    dateInput.addEventListener("click",()=>{cal.classList.remove("hidden");dateInput.setAttribute("aria-expanded","true");render();});
    document.addEventListener("click",e=>{if(!cal.contains(e.target)&&e.target!==dateInput&&e.target!==openCal&&!openCal.contains(e.target)){cal.classList.add("hidden");dateInput.setAttribute("aria-expanded","false");}});
  }

  // دکمه‌های شناور: ارتباط فقط با لوگو، مسیریابی با متن مستقل
  if(!document.querySelector(".mouris-floating-ui")){
    const floating=document.createElement("div");
    floating.className="mouris-floating-ui";
    floating.innerHTML=`
      <nav class="floating-contact" aria-label="راه‌های ارتباطی">
        <a class="floating-contact-btn call" href="tel:09126022112" aria-label="تماس با موریس" title="تماس با موریس"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3H4.8A1.8 1.8 0 0 0 3 4.8C3 13.7 10.3 21 19.2 21a1.8 1.8 0 0 0 1.8-1.8V17l-5-1-1.1 2a14.5 14.5 0 0 1-8.1-8.1l2-1.1L7 3Z"/></svg></a>
        <a class="floating-contact-btn whatsapp" href="https://wa.me/989126022112" target="_blank" rel="noopener noreferrer" aria-label="واتساپ موریس" title="واتساپ"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.437-9.884 9.89-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.892 6.993c-.003 5.45-4.437 9.884-9.887 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.946L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a>
        <a class="floating-contact-btn instagram" href="https://www.instagram.com/morriswatch1/" target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام موریس" title="اینستاگرام"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.848 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.848 0-3.203.013-3.583.07-4.848.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07M12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324ZM12 16a4 4 0 110-8 4 4 0 010 8Zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88Z"/></svg></a>
        <button class="floating-install-btn" type="button" aria-label="نصب اپلیکیشن موریس" title="نصب اپلیکیشن"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3"/></svg><span>نصب اپلیکیشن</span></button>
      </nav>
      <nav class="floating-locations" aria-label="مسیریابی فروشگاه">
        <a href="https://maps.app.goo.gl/UJXAzXb2pjgqmCxh7" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z"/><circle cx="12" cy="9" r="2.4"/></svg>گوگل‌مپ</a>
        <a href="https://nshn.ir/f9_bvZEa5x4bZZ" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z"/><path d="m9 9 2 2 4-4"/></svg>نشان</a>
      </nav>`;
    document.body.appendChild(floating);
  }

  // نصب PWA فقط در ویندوز دسکتاپ؛ در موبایل و سیستم‌عامل‌های دیگر نمایش داده نمی‌شود.
  const installButton=document.querySelector(".floating-install-btn");
  const platform=(navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();
  const isWindowsDesktop=platform.includes("win") && !/android|iphone|ipad|ipod/i.test(navigator.userAgent);
  if(installButton && isWindowsDesktop && window.matchMedia("(min-width: 700px)").matches){
    let installPrompt=null;
    installButton.classList.add("desktop-install-visible");
    window.addEventListener("beforeinstallprompt",event=>{
      event.preventDefault();
      installPrompt=event;
      installButton.classList.add("is-available");
    });
    installButton.addEventListener("click",async()=>{
      if(!installPrompt){
        alert("برای نصب، از منوی Chrome گزینه Install MOURIS WATCH یا آیکون نصب کنار نوار آدرس را انتخاب کنید.");
        return;
      }
      installButton.disabled=true;
      try{
        await installPrompt.prompt();
        await installPrompt.userChoice;
      } finally {
        installPrompt=null;
        installButton.classList.remove("is-available");
        installButton.disabled=false;
      }
    });
    window.addEventListener("appinstalled",()=>{
      installPrompt=null;
      installButton.classList.remove("is-available");
    });
  }

  // محو شدن کنترل‌های شناور در انتهای صفحه؛ دکمه بروزرسانی مستقل می‌ماند.
  const footer=document.querySelector(".site-footer");
  if(footer && "IntersectionObserver" in window){
    const footerObserver=new IntersectionObserver(entries=>{
      document.body.classList.toggle("mouris-footer-near",entries.some(entry=>entry.isIntersecting));
    },{root:null,threshold:0.04});
    footerObserver.observe(footer);
  }
  // واکنش لمسی کوتاه برای کارت‌ها، بدون وابستگی به حرکت ماوس.
  document.querySelectorAll(".service-card").forEach(card=>{
    card.addEventListener("touchstart",()=>card.classList.add("is-pressed"),{passive:true});
    ["touchend","touchcancel"].forEach(type=>card.addEventListener(type,()=>card.classList.remove("is-pressed"),{passive:true}));
  });

  // نرخ ارز: همان Worker استفاده‌شده در پروژه ALMAS
  const RATE_URL="https://almas-api.sherwinisltn.workers.dev/";
  async function loadMourisRates(){
    const footer=document.querySelector(".footer-info");if(!footer||footer.querySelector(".mouris-rates"))return;
    const box=document.createElement("div");box.className="mouris-rates";box.innerHTML='<span class="rates-caption">نرخ لحظه‌ای ارز</span><span data-rate="USD">دلار: در حال دریافت…</span><span data-rate="EUR">یورو: در حال دریافت…</span>';
    const social=footer.querySelector(".mouris-social");footer.insertBefore(box,social||null);
    const validRate=value=>{const normalized=String(value??"").replace(/[۰-۹]/g,d=>String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٬,،\s]/g,"");const n=Number(normalized);return Number.isFinite(n)&&n>0?n:null;};
    try{
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
      const res=await fetch(RATE_URL,{method:"GET",cache:"no-store",signal:controller.signal,headers:{Accept:"application/json"}});clearTimeout(timeout);
      if(!res.ok)throw new Error("Worker HTTP "+res.status);
      const data=await res.json(),source=data&&data.rates?data.rates:data;
      const usd=validRate(source&&(source.dollar??source.usd??source.USD));
      const eur=validRate(source&&(source.euro??source.eur??source.EUR));
      const fmt=n=>n===null?"ناموجود":Math.round(n).toLocaleString("fa-IR")+" تومان";
      box.querySelector('[data-rate="USD"]').textContent="دلار: "+fmt(usd===null?null:usd*1.005);
      box.querySelector('[data-rate="EUR"]').textContent="یورو: "+fmt(eur);
      if(!usd&&!eur)throw new Error("No valid USD/EUR rates");
      box.classList.add("rates-loaded");
    }catch(err){
      box.querySelector('[data-rate="USD"]').textContent="دلار: فعلاً نامشخص";
      box.querySelector('[data-rate="EUR"]').textContent="یورو: فعلاً نامشخص";
      console.warn("MOURIS exchange rates unavailable:",err&&err.message?err.message:err);
    }
  }
  loadMourisRates();

  const form=document.querySelector("#repair-form, #new-order-form");if(!form)return;
  const SHEETS_API="https://script.google.com/macros/s/AKfycbwH8P9MpERpciEMc2OjPGSrX9N2N7jPxu92xL_Q3Sjn_iCQHsU9CLSIgw-7DoAQSdXY0g/exec";
  const labels={name:"نام مشتری",phone:"شماره تماس مشتری",watchBrand:"برند ساعت",watchModel:"مدل ساعت",condition:"وضعیت ظاهری ساعت",issue:"شرح ایراد ساعت",price:"قیمت",itemName:"نام ساعت یا کالا",itemDetails:"جزئیات کالا",expectedDate:"زمان تقریبی تحویل",notes:"توضیحات سفارش"};
  function showError(el,msg){if(el)el.classList.add("input-error");alert(msg);el?.focus();}
  function smsUrl(phone,body){const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);return `sms:${phone}${ios?"&":"?"}body=${encodeURIComponent(body)}`;}
  async function sendToSheets(isRepair,formData,customerPhone){
    const data={};formData.forEach((value,key)=>{data[key]=String(value??"").trim();});
    data.phone=customerPhone;
    if(data.price)data.price=onlyDigits(data.price);
    const approx=document.getElementById("expected-date-note")?.value.trim();
    if(approx)data.expectedDate=(data.expectedDate?data.expectedDate+" — ":"")+approx;
    const payload=isRepair?{
      type:"repair",data:{name:data.name||"",phone:data.phone,watchBrand:data.watchBrand||"",watchModel:data.watchModel||"",condition:data.condition||"",issue:data.issue||"",price:data.price||""}
    }:{
      type:"order",data:{name:data.name||"",phone:data.phone,itemName:data.itemName||"",itemDetails:data.itemDetails||"",price:data.price||"",expectedDate:data.expectedDate||"",notes:data.notes||""}
    };
    // text/plain prevents a CORS preflight; Apps Script receives JSON in e.postData.contents.
    const response=await fetch(SHEETS_API,{method:"POST",mode:"no-cors",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
    return response;
  }
  form.addEventListener("submit",async e=>{e.preventDefault();const required=[...form.querySelectorAll("[required]")];const empty=required.find(x=>!String(x.value||"").trim());if(empty)return showError(empty,"لطفاً همه فیلدهای ضروری را تکمیل کنید.");
    const phoneInput=form.querySelector('input[type="tel"]'),customerPhone=onlyDigits(phoneInput?.value);if(!/^09\d{9}$/.test(customerPhone))return showError(phoneInput,"شماره موبایل باید ۱۱ رقم و با 09 شروع شود.");
    const isRepair=form.id==="repair-form",formData=new FormData(form),lines=[isRepair?"درخواست پذیرش تعمیرات ساعت — موریس":"درخواست سفارش جدید — موریس"];
    formData.forEach((value,key)=>{let v=String(value).trim();if(!v)return;if(key==="phone")v=customerPhone;if(key==="price")v=onlyDigits(v);if(key==="expectedDate"&&dateInput?.dataset.iso)v+=` (${dateInput.dataset.iso})`;lines.push(`${labels[key]||key}: ${v}`);});
    const approx=document.getElementById("expected-date-note")?.value.trim();if(approx)lines.push(`توضیح زمان تحویل: ${approx}`);
    lines.push("نشانی فروشگاه: مرزداران، پاساژ پردیسان، طبقه بالا، واحد ۹۰");
    const destination=isRepair?customerPhone:"09126022112",body=lines.join("\n");
    let send=document.getElementById("send-sms");if(!send){send=document.createElement("a");send.id="send-sms";send.className="btn send-sms-button";form.insertAdjacentElement("afterend",send);}
    send.href=smsUrl(destination,body);send.textContent="تأیید و ارسال";send.setAttribute("aria-label",`تأیید و ارسال پیامک به ${destination}`);send.style.display="inline-flex";
    let preview=document.getElementById("sms-preview");if(!preview){preview=document.createElement("div");preview.id="sms-preview";preview.className="sms-preview sms-preview-soft";send.insertAdjacentElement("afterend",preview);}preview.textContent=body;preview.classList.add("visible");
    let sheetStatus=document.getElementById("sheets-status");if(!sheetStatus){sheetStatus=document.createElement("p");sheetStatus.id="sheets-status";sheetStatus.className="sheets-status";preview.insertAdjacentElement("afterend",sheetStatus);}sheetStatus.textContent="در حال ارسال اطلاعات برای ثبت در سامانه…";
    sendToSheets(isRepair,formData,customerPhone).then(()=>{sheetStatus.textContent="درخواست ثبت اطلاعات به گوگل‌شیت ارسال شد.";sheetStatus.classList.add("sent");}).catch(err=>{sheetStatus.textContent="ارسال خودکار به گوگل‌شیت انجام نشد؛ لطفاً با فروشگاه تماس بگیرید.";sheetStatus.classList.add("failed");console.warn("MOURIS Sheets submission failed:",err);});
    send.scrollIntoView({behavior:"smooth",block:"center"});
  });
})();