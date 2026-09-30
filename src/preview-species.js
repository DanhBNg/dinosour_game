export const previewKey=id=>({trex:'roar',shark:'drift'}[id]||'clip0');
export function shuffledCycle(ids,initial){let bag=[],last=initial;return ()=>{if(!bag.length){bag=[...ids];for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}if(bag[0]===last&&bag.length>1)[bag[0],bag[1]]=[bag[1],bag[0]];}last=bag.shift();return last;};}
