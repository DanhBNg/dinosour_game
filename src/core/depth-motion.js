export function createDepthMotion(){
 let action='',start=0,target=0,time=0,wasHeld=false;
 return {
  begin(next,height,destination){action=next;start=height;target=destination;time=0;wasHeld=false;},
  update(dt,height,held,min=0,max=6){
   if(held==='dive'||held==='rise'){
    wasHeld=true;action=held;
    const next=Math.max(min,Math.min(max,height+(held==='rise'?1:-1)*2.5*dt));
    return {height:next,action,finished:next===min||next===max};
   }
   if(wasHeld)return {height,action,finished:true};
   time+=dt;const phase=Math.min(1,time/1.6),blend=phase*phase*(3-2*phase);
   return {height:Math.max(min,Math.min(max,start+(target-start)*blend)),action,finished:phase===1};
  }
 };
}
