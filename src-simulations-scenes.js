/* © 2026 Erfin. All rights reserved. See LICENSE. */
import {text} from './src-charts-canvas.js';
export function label(c,s,x,y,th,align='left',color=th.text,size=12){text(c,s,x,y,{color,size,align,weight:600})}
export function disk(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill()}
export function line(c,x1,y1,x2,y2,col,width=2){c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
export function grid({ctx:c,w,h,th}){c.fillStyle=th.card; c.fillRect(0,0,w,h);c.fillStyle=th.border;for(let x=16;x<w;x+=24)for(let y=16;y<h;y+=24)disk(c,x,y,0.7,th.border)}
export function axes(c,w,h,th,xmin,xmax,ymin,ymax,fn,mark){const L=42,R=w-22,U=42,B=h-38,X=x=>L+(x-xmin)/(xmax-xmin)*(R-L),Y=y=>B-(y-ymin)/(ymax-ymin)*(B-U);line(c,L,Y(0),R,Y(0),th.border);line(c,X(0),U,X(0),B,th.border);c.strokeStyle=th.primary;c.lineWidth=2.5;c.beginPath();for(let i=0;i<=240;i++){const x=xmin+(xmax-xmin)*i/240,y=Y(fn(x));i?c.lineTo(X(x),y):c.moveTo(X(x),y)}c.stroke();if(mark){disk(c,X(mark[0]),Y(mark[1]),6,th.secondary)}label(c,String(xmin),L,B+22,th);label(c,String(xmax),R,B+22,th,'right');return {X,Y}}
export function beaker(c,x,y,w,h,fill,col,th){c.fillStyle=col;c.globalAlpha=.18;c.fillRect(x+4,y+h*(1-fill),w-8,h*fill-4);c.globalAlpha=1;c.strokeStyle=th.text2;c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+h-12);c.quadraticCurveTo(x,y+h,x+12,y+h);c.lineTo(x+w-12,y+h);c.quadraticCurveTo(x+w,y+h,x+w,y+h-12);c.lineTo(x+w,y);c.stroke()}
export const f=n=>Number(n.toFixed(3)).toLocaleString('id-ID');
