export const WATER_Y=0;
export const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
// The mesh uses these same piecewise planar samples, including both slope breaks.
export function sampleShore(x,z){
 const height=Math.max(-3.6,Math.min(1.8,-z*.12));
 return {height,depth:Math.max(0,WATER_Y-height),slope:z>-15&&z<30?-.12:0,dry:z<-6};
}
export function createShoreState(){
 return {mode:'swim',land:0,update(dt,x,z){
  const s=sampleShore(x,z),target=smooth((1.2-s.depth)/.85);
  this.land+=(target-this.land)*(1-Math.exp(-dt*7));
  if(this.mode==='swim'&&this.land>.12)this.mode='transition';
  else if(this.mode==='crawl'&&this.land<.88)this.mode='transition';
  else if(this.mode==='transition'){if(this.land>.96)this.mode='crawl';else if(this.land<.04)this.mode='swim';}
  return s;
 }};
}
