import {sampleShore} from './turtle-shore-state.js';
export const NEST_STAGES={
 bodyPit:{label:'Tạo hõm thân',duration:2.5},dig:{label:'Đào hố trứng',duration:4},
 lay:{label:'Đẻ trứng',duration:5},cover:{label:'Lấp tổ',duration:3},disguise:{label:'Xóa dấu tổ',duration:2.5},
 return:{label:'Trở lại biển'},complete:{label:'Tổ đã nằm yên trong cát'}
};
const sequence=Object.keys(NEST_STAGES);
export function createNestState(){
 return {stage:'bodyPit',busy:false,time:0,site:null,eggs:0,
  canStart(p){return !this.busy&&!!NEST_STAGES[this.stage].duration&&sampleShore(p.x,p.z).dry&&(!this.site||Math.hypot(p.x-this.site.x,p.z-this.site.z)<1.6);},
  start(p){if(!this.canStart(p))return false;this.site??={x:p.x,z:p.z};this.busy=true;return true;},
  update(dt){if(!this.busy)return;this.time=Math.min(this.time+Math.max(0,dt),NEST_STAGES[this.stage].duration);if(this.stage==='lay')this.eggs=Math.min(8,Math.floor(this.time/5*8));if(this.time>=NEST_STAGES[this.stage].duration){this.busy=false;this.time=0;this.stage=sequence[sequence.indexOf(this.stage)+1];this.busy=!!NEST_STAGES[this.stage].duration;}},
  cancel(){this.busy=false;},returnToSea(swimming){if(this.stage==='return'&&swimming)this.stage='complete';},
  reset(){this.stage='bodyPit';this.busy=false;this.time=0;this.site=null;this.eggs=0;},
  get progress(){return this.time/(NEST_STAGES[this.stage].duration||1);}
 };
}
