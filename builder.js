const options={
CPU:[['Intel Core i5 14600K',18000,'intel',125],['Intel Core i7 14700K',25000,'intel',180],['AMD Ryzen 7 7800X3D',32000,'amd',120]],
GPU:[['RTX 4060',30000,'',115],['RTX 4070 Super',50000,'',220],['RTX 4080 Super',75000,'',320]],
MOTHERBOARD:[['B760 Gaming',15000,'intel',70],['Z790 Gaming',22000,'intel',80],['B650 Gaming',18000,'amd',70]],
RAM:[['16GB DDR5',6000,'',10],['32GB DDR5',11000,'',12],['64GB DDR5',19000,'',18]],
STORAGE:[['1TB NVMe',5000,'',8],['2TB NVMe',9000,'',8]],
PSU:[['650W Gold',7000,'',0],['750W Gold',10000,'',0],['850W Gold',15000,'',0]],
CASE:[['Airflow Gaming Case',6000,'',0],['RGB Gaming Case',9000,'',0],['Premium Glass Case',14000,'',0]],
COOLER:[['Air Cooler',4000,'',40],['240mm AIO',8000,'',50],['360mm AIO',12000,'',70]]};
const keys=Object.keys(options); const selected={};
const form=document.getElementById('builderForm');
keys.forEach(k=>{const g=document.createElement('div');g.className='form-group';g.innerHTML=`<label>${k}</label><select data-key="${k}">${options[k].map((x,i)=>`<option value="${i}">${x[0]} — ₹${x[1].toLocaleString('en-IN')}</option>`).join('')}</select>`;form.appendChild(g);selected[k]=0;});
function update(){let total=0,power=0,cpuType='',mbType='';const items=[];keys.forEach(k=>{const i=Number(form.querySelector(`[data-key="${k}"]`).value);selected[k]=i;const o=options[k][i];total+=o[1];power+=o[3];items.push([k,o[0],o[1]]);if(k==='CPU')cpuType=o[2];if(k==='MOTHERBOARD')mbType=o[2];});document.getElementById('summaryItems').innerHTML=items.map(x=>`<div style="display:flex;justify-content:space-between;gap:10px;margin:10px 0"><span>${x[0]}<br><small style="color:#777">${x[1]}</small></span><strong>₹${x[2].toLocaleString('en-IN')}</strong></div>`).join('');document.getElementById('total').textContent='₹'+total.toLocaleString('en-IN');document.getElementById('power').textContent=power+'W';let msg='✓ Major compatibility checks passed.';let bad=false;if(cpuType&&mbType&&cpuType!==mbType){msg='⚠ CPU and motherboard socket/platform mismatch.';bad=true}const psu=Number(form.querySelector('[data-key="PSU"]').value);const watts=[650,750,850][psu];if(watts<power+100){msg='⚠ PSU wattage may be too low for this configuration.';bad=true}const box=document.getElementById('compatibility');box.className='compatibility-box '+(bad?'error':'success');box.innerHTML=`<strong>${msg}</strong>`;return {total,power,items};}
form.addEventListener('change',update);update();
document.getElementById('resetBuild').onclick=()=>{form.querySelectorAll('select').forEach(s=>s.value='0');update()};
document.getElementById('addBuild').onclick=()=>{const b=update();localStorage.setItem('cyberflixBuild',JSON.stringify(b));location.href='cart.html'};
