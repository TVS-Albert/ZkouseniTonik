const paths={
 trophy:'M17 6h22v17a11 11 0 0 1-22 0Z M17 10H7v8c0 8 5 12 12 12m20-20h10v8c0 8-5 12-12 12 M28 35v11m-9 1h18v6H19Z',
 pen:'M9 40 35 10l7 6-26 30-9 3Z M31 14l7 6 M10 40l6 6',
 pencil:'m9 39 25-29 10 9-25 28-12 3Z M29 16l10 9 M9 39l10 8 M34 10l4-4 10 9-4 4',
 ruler:'m6 37 31-29 13 14-31 29Z M13 31l5 5m2-12 5 5m2-12 5 5m2-12 5 5',
 eraser:'m8 30 20-20a4 4 0 0 1 6 0l14 14a4 4 0 0 1 0 6L28 50H14L8 44a10 10 0 0 1 0-14Z M18 20l22 22 M28 50h22',
 book:'M10 8h33v39H14a5 5 0 0 1 0-10h29 M10 8v34 M18 17h17m-17 7h13',
 bag:'M12 19h34v30H12Z M21 19v-6a8 8 0 0 1 16 0v6 M19 29h20v13H19Z',
 desk:'M5 19h46v9H5Z M10 28v23m36-23v23 M14 32h18v8H14Z',
 table:'M4 18h48v9H4Z M10 27v24m36-24v24',
 chair:'M15 7h26v25H15Z M11 32h34v9H11Z M15 41v11m26-11v11 M15 17h26',
 board:'M5 9h46v31H5Z M10 35h36 M19 40l-5 12m23-12 5 12 M15 19h12m-12 7h24',
 cupboard:'M9 5h38v45H9Z M28 5v45 M22 25v7m12-7v7 M13 50v4m30-4v4',
 bookcase:'M8 5h40v47H8Z M8 29h40 M14 11v14m6-14v14m7-14 7 14m6-14v14 M15 34v13m8-13v13m6-13 6 13m6-13v13',
 door:'M10 52V5h36v47 M18 13h20v19H18Z M36 40h2 M5 52h46',
 classroom:'M3 16 28 4l25 12 M7 17v35h42V17 M20 52V34h16v18 M13 22h7m16 0h7',
 teacher:'M21 11a7 7 0 1 0 14 0 7 7 0 0 0-14 0 M18 47V29a10 10 0 0 1 20 0v18 M12 31l-7-9m33 9 12-14 M23 47v7m10-7v7',
 computer:'M5 8h46v31H5Z M23 39v9m10-9v9 M15 49h26 M10 33h36',
 television:'M5 15h46v34H5Z M17 5l11 10L40 5 M10 20h29v23H10Z M45 24v2m0 7v2',
 whiteboard:'M4 8h48v33H4Z M10 35h36 M14 41v12m28-12v12',
 wall:'M4 8h48v42H4Z M4 22h48 M4 36h48 M18 8v14m20-14v14 M28 22v14 M16 36v14m24-14v14',
 poster:'M10 5h36v48H10Z M15 39l10-15 6 8 6-9 4 16Z M19 16h1',
 tree:'M28 36v18 M16 38C-1 37 2 16 15 15 13-2 42-2 41 15c16 2 15 25-3 24Z',
 pin:'M28 51S10 34 10 22a18 18 0 0 1 36 0c0 12-18 29-18 29Z M21 22a7 7 0 1 0 14 0 7 7 0 0 0-14 0',
 tactics:'M6 6h44v44H6Z M15 35l25-20m-8 0h8v8 M14 14l7 7m0-7-7 7 M34 37a5 5 0 1 0 10 0 5 5 0 0 0-10 0',
};
export const colors={purple:'#9865bd',blue:'#4a8dcb',pink:'#ec8ab0',black:'#273b35',yellow:'#f1cd42',green:'#559d68',grey:'#9fa9ab',brown:'#99683f',orange:'#f59644'};
export function icon(name,cls=''){
  if(name==='11')return `<svg class="art-icon ${cls}" viewBox="0 0 56 56" fill="currentColor" aria-hidden="true"><text x="28" y="43" font-size="43" font-family="sans-serif" font-weight="800" text-anchor="middle">11</text></svg>`;
  if(colors[name])return `<span class="color-swatch ${cls}" style="--swatch:${colors[name]}" aria-hidden="true"></span>`;
  return `<svg class="art-icon ${cls}" viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]?`<path d="${paths[name]}"/>`:'<circle cx="28" cy="28" r="20"/><path d="m28 14 13 10-5 15H20l-5-15Z"/>'}</svg>`;
}
export function pitch(){return `<svg class="hero-pitch" viewBox="0 0 500 330" aria-hidden="true"><defs><linearGradient id="turf" x2="1" y2="1"><stop stop-color="#7aab70"/><stop offset="1" stop-color="#347254"/></linearGradient></defs><g transform="translate(240 168) rotate(-18) translate(-210 -130)"><rect x="0" y="0" width="420" height="260" rx="18" fill="#143d2e" transform="translate(0 12)"/><rect width="420" height="260" rx="18" fill="url(#turf)"/><path d="M70 0v260M210 0v260M350 0v260" stroke="#9cc685" stroke-opacity=".18" stroke-width="70"/><g fill="none" stroke="#e0efcd" stroke-width="2.3" opacity=".8"><rect x="18" y="18" width="384" height="224" rx="4"/><path d="M210 18v224M18 75h65v110H18m384-110h-65v110h65"/><circle cx="210" cy="130" r="44"/><circle cx="210" cy="130" r="3" fill="#e0efcd"/></g></g><g transform="translate(355 110) rotate(12)"><rect x="-43" y="-60" width="86" height="108" rx="14" fill="#fff9e9"/><rect x="-34" y="-51" width="68" height="66" rx="9" fill="#f1c38a"/><text y="-2" text-anchor="middle" font-size="49" font-weight="800" fill="#75472d">A</text><text y="36" text-anchor="middle" font-size="13" font-family="sans-serif" font-weight="700" fill="#174936">ENGLISH</text></g><g transform="translate(153 100) rotate(-12)"><rect x="-37" y="-51" width="74" height="95" rx="12" fill="#e3f598"/><text text-anchor="middle" y="7" fill="#174936" font-size="43" font-family="sans-serif" font-weight="800">11</text><text y="29" text-anchor="middle" fill="#174936" font-size="12" font-family="sans-serif">eleven</text></g><circle cx="302" cy="242" r="40" fill="#123a2b" opacity=".3"/><circle cx="300" cy="229" r="40" fill="#fffdf2"/><path d="m300 208 19 14-7 23h-24l-7-23Z" fill="#214b39"/><path d="m300 189v19m-38 8 19 6m7 23-10 17m34-17 10 17m-3-40 19-6" stroke="#214b39" stroke-width="5"/><g fill="#d9ef8a"><path d="m75 62 3 9 10 1-8 6 3 10-8-6-8 6 3-10-8-6 10-1Z"/><path d="m433 207 3 8 9 1-7 5 2 9-7-5-7 5 2-9-7-5 9-1Z"/></g></svg>`;}
function deskSvg(){return '<rect x="110" y="121" width="180" height="16" rx="4" fill="#d9ad79" stroke="#754f32" stroke-width="3"/><path d="M127 139v70m146-70v70" stroke="#754f32" stroke-width="9"/>';}
function pencilSvg(x,y,rotate=0){return `<g transform="translate(${x} ${y}) rotate(${rotate})"><path d="M-35-7h62v14h-62l-16-7Z" fill="#efc953" stroke="#7d622e" stroke-width="2"/><path d="M20-7h10v14H20Z" fill="#ee9f9a"/><path d="m-51 0 10-4v8Z" fill="#374b43"/></g>`;}
function bagSvg(x,y){return `<g transform="translate(${x} ${y})"><path d="M-47-36h94v91h-94Z" fill="#8fb0d5" stroke="#385c7b" stroke-width="3"/><path d="M-22-36v-14a22 22 0 0 1 44 0v14" fill="none" stroke="#385c7b" stroke-width="6"/><rect x="-31" y="0" width="62" height="38" rx="7" fill="#7299c4"/><path d="M-20 12h40" stroke="#e8f1ff" stroke-width="3"/></g>`;}
function bookSvg(x,y,color='#e6a28e'){return `<g transform="translate(${x} ${y})"><path d="M-27-18h52v32h-52Z" fill="${color}" stroke="#754f32" stroke-width="2"/><path d="M-19-18v32m0-24H16" stroke="#fff4dc" stroke-width="3"/></g>`;}
export function scene(spec){
  let inside='',label='';
  if(spec.type==='count')return `<div class="count-scene" role="img" aria-label="Spočítej zobrazené předměty"><div class="count-grid">${Array.from({length:spec.count},()=>icon(spec.item)).join('')}</div></div>`;
  if(spec.type==='position'){
    const p=spec.position;
    if(p==='in'){inside=bagSvg(200,128)+pencilSvg(197,110,-38)+'<path d="M153 117v66h94v-66" fill="#8fb0d5" stroke="#385c7b" stroke-width="3"/><rect x="169" y="141" width="62" height="33" rx="6" fill="#7299c4"/>';label='Tužka je uvnitř tašky.';}
    if(p==='on'){inside=deskSvg()+pencilSvg(200,111);label='Tužka leží na horní desce lavice.';}
    if(p==='under'){inside=deskSvg()+pencilSvg(200,194);label='Tužka leží pod lavicí.';}
    if(p==='next-to'){inside=bagSvg(150,125)+pencilSvg(279,171);label='Tužka leží vedle tašky.';}
  }else if(spec.type==='grammar'){
    if(spec.kind==='positive-one'){inside=deskSvg()+bookSvg(200,104);label='Na lavici je jedna kniha.';}
    if(spec.kind==='positive-many'){inside=deskSvg()+bookSvg(142,103)+bookSvg(200,103,'#afc994')+bookSvg(258,103,'#95b8d5');label='Na lavici jsou tři knihy.';}
    if(spec.kind==='negative-one'||spec.kind==='negative-many'){
      inside='<path d="M120 53h160v141H120Z" fill="#9ab9dc" stroke="#385c7b" stroke-width="3"/><path d="m120 53 25 20h110l25-20" fill="#c8d6e9" stroke="#385c7b" stroke-width="3"/><rect x="146" y="79" width="108" height="91" rx="5" fill="#e5eef7" stroke="#385c7b" stroke-width="2"/><path d="M174 53V36a26 26 0 0 1 52 0v17" fill="none" stroke="#385c7b" stroke-width="6"/><text x="200" y="131" text-anchor="middle" fill="#385c7b" font-size="17" font-family="sans-serif">prázdná taška</text>';label='Otevřená taška je prázdná, nejsou v ní žádné předměty.';
    }
  }else if(spec.type==='ruler'){
    inside=bagSvg(200,128)+'<g transform="translate(218 86) rotate(15)"><rect x="-10" y="-48" width="20" height="104" rx="2" fill="#efcf6c" stroke="#866b36" stroke-width="2"/><path d="M-9-32h10m-10 12h7m-7 12h10m-10 12h7m-7 12h10" stroke="#866b36" stroke-width="2"/></g><path d="M153 128v55h94v-55" fill="#8fb0d5" stroke="#385c7b" stroke-width="3"/>';label='Z tašky vyčnívá jedno pravítko.';
  }else{inside=deskSvg()+bookSvg(162,104)+bookSvg(238,104,'#95b8d5');label='Na lavici leží dvě knihy.';}
  return `<div class="scene-wrap"><svg class="scene" viewBox="0 0 400 230" role="img" aria-label="${label}"><ellipse cx="200" cy="212" rx="139" ry="8" fill="#dce4d8"/>${inside}</svg></div>`;
}
