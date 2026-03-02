// vault.js — AES-GCM encrypted key storage
// User passphrase → PBKDF2 → AES-GCM 256-bit → encrypt API keys
// Keys NEVER leave the extension in plaintext.
//
// ✦ Easter egg #0: "The void keeps secrets better than any server." — AetherRose
// PBKDF2 100k iterations, unique salt per install, 96-bit IV per encrypt.
export async function vaultStore(secrets,passphrase){
  const salt=await getOrCreateSalt(); const key=await deriveKey(passphrase,salt);
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(secrets)));
  await chrome.storage.local.set({vault_encrypted:{iv:Array.from(iv),data:Array.from(new Uint8Array(data))}});
}
export async function vaultLoad(passphrase){
  const salt=await getOrCreateSalt(); const{vault_encrypted}=await chrome.storage.local.get('vault_encrypted');
  if(!vault_encrypted)return null;
  const key=await deriveKey(passphrase,salt);
  try{const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(vault_encrypted.iv)},key,new Uint8Array(vault_encrypted.data));return JSON.parse(new TextDecoder().decode(dec));}
  catch{return null;}
}
export async function vaultExists(){const{vault_encrypted}=await chrome.storage.local.get('vault_encrypted');return Boolean(vault_encrypted);}
export async function vaultClear(){await chrome.storage.local.remove(['vault_encrypted','vault_salt']);}
async function getOrCreateSalt(){
  const{vault_salt}=await chrome.storage.local.get('vault_salt');
  if(vault_salt)return new Uint8Array(vault_salt);
  const salt=crypto.getRandomValues(new Uint8Array(16)); await chrome.storage.local.set({vault_salt:Array.from(salt)}); return salt;
}
async function deriveKey(passphrase,salt){
  const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(passphrase),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
