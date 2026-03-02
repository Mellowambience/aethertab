// Weather widget — OpenWeatherMap free tier, 30-min cache
const iconEl=document.getElementById('weather-icon');
const tempEl=document.getElementById('weather-temp');
const condEl=document.getElementById('weather-cond');
const WEATHER_EMOJIS={Thunderstorm:'⛈',Drizzle:'🌦',Rain:'🌧',Snow:'❄️',Clear:'☀️',Clouds:'☁️',Mist:'🌫',Fog:'🌫',Haze:'🌫',Dust:'🌪',Sand:'🌪',Tornado:'🌪'};
const CACHE_TTL_MS=30*60*1000;
async function fetchWeather(lat,lon,apiKey){
  const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
  if(!res.ok)throw new Error(`Weather ${res.status}`); return res.json();
}
function renderWeather(data){
  const main=data.weather?.[0]?.main??'Clear'; const temp=Math.round(data.main?.temp??0);
  if(iconEl)iconEl.textContent=WEATHER_EMOJIS[main]??'🌙';
  if(tempEl)tempEl.textContent=`${temp}°F`;
  if(condEl)condEl.textContent=data.weather?.[0]?.description??'';
}
async function loadWeather(){
  const{weatherApiKey,weather_cache}=await chrome.storage.local.get(['weatherApiKey','weather_cache']);
  if(!weatherApiKey){if(condEl)condEl.textContent='add key in ⚙';return;}
  if(weather_cache&&(Date.now()-weather_cache.ts)<CACHE_TTL_MS){renderWeather(weather_cache.data);return;}
  navigator.geolocation.getCurrentPosition(
    async({coords})=>{
      try{const data=await fetchWeather(coords.latitude,coords.longitude,weatherApiKey);chrome.storage.local.set({weather_cache:{data,ts:Date.now()}});renderWeather(data);}
      catch{if(condEl)condEl.textContent='unavailable';}
    },
    ()=>{if(condEl)condEl.textContent='location off';}
  );
}
loadWeather();
