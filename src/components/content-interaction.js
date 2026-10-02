export function installContentInteractionPolicy(doc=document){
 const editable=target=>{
  const element=target?.nodeType===3?target.parentElement:target;
  return element?.isContentEditable||!!element?.closest?.('input,textarea');
 };
 const prevent=event=>{if(!editable(event.target))event.preventDefault();};
 const shortcut=event=>{
  if((event.ctrlKey||event.metaKey)&&['a','c','x'].includes(event.key?.toLowerCase()))prevent(event);
 };
 const events=['selectstart','copy','cut','contextmenu','dragstart'];
 for(const event of events)doc.addEventListener(event,prevent);
 doc.addEventListener('keydown',shortcut);
 return ()=>{
  for(const event of events)doc.removeEventListener(event,prevent);
  doc.removeEventListener('keydown',shortcut);
 };
}
