/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Alur POE murni: tidak bergantung DOM agar transisi bisa diuji deterministik.
export class PoeState {
  constructor(){ this.state='prediksi'; this.prediction=''; this.explanation=''; this.results=[]; }
  predict(text){ const value=String(text).trim(); if(!value) return false; this.prediction=value.slice(0,1200); this.state='eksperimen'; this.explanation=''; this.results=[]; return true; }
  complete(results){ if(this.state!=='eksperimen')return false; this.results=results.map(row=>({...row})); this.state='kesimpulan'; return true; }
  explain(text){ if(this.state!=='kesimpulan')return false; this.explanation=String(text).slice(0,1200); return true; }
  reset(){this.state='prediksi';this.explanation='';this.results=[];}
  // Menjelajah ulang waktu memakai prediksi yang sama, namun penjelasan harus dibuat ulang.
  reopen(){if(this.state==='kesimpulan'){this.state='eksperimen';this.explanation='';this.results=[];}}
  snapshot(){return {state:this.state,prediction:this.prediction,explanation:this.explanation,results:this.results.map(row=>({...row}))}}
}
