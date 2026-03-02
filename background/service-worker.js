// service-worker.js — AetherTab background
// chrome.alarms only (SW-safe, no setTimeout/setInterval)
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true});
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
  if(msg.type==='OPEN_SIDEBAR') chrome.sidePanel.open({windowId:sender.tab?.windowId});
  if(msg.type==='OPEN_SETTINGS') chrome.sidePanel.open({windowId:sender.tab?.windowId});
  if(msg.type==='POMODORO_COMPLETE'){
    chrome.tabs.query({active:true,currentWindow:true},([tab])=>{
      if(!tab?.url?.startsWith('chrome://newtab')){
        chrome.notifications?.create({type:'basic',iconUrl:'../icons/icon-48.png',title:'AetherTab',message:msg.session==='break'?'✦ Focus session complete. Take a breath.':'◎ Break over. The void awaits.'});
      }
    });
  }
});
chrome.alarms.create('kofi-check',{periodInMinutes:60});
chrome.alarms.onAlarm.addListener(async(alarm)=>{
  if(alarm.name==='kofi-check'){
    // TODO Phase 3: Ko-fi API new product check
    await chrome.storage.local.set({lastKofiCheck:Date.now()});
  }
});
chrome.runtime.onInstalled.addListener(({reason})=>{
  if(reason==='install') chrome.tabs.create({url:'chrome://newtab'});
});
