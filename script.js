const dob = document.getElementById('dob');
const on = document.getElementById('on');
const err = document.getElementById('err');
const result = document.getElementById('result');
const $ = id => document.getElementById(id);

function toInput(d){
  const p = n => String(n).padStart(2,'0');
  return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
}
function parse(v){
  const [y,m,d] = v.split('-').map(Number);
  return new Date(y, m-1, d);
}
function setDefaults(){
  const today = new Date();
  on.value = toInput(today);
  dob.max = toInput(today);
}

function calculate(){
  err.textContent = '';
  if(!dob.value){ err.textContent = 'Choose a date of birth.'; result.hidden = true; return; }
  const birth = parse(dob.value);
  const target = on.value ? parse(on.value) : new Date();
  if(birth > target){
    err.textContent = 'Date of birth must be before the comparison date.';
    result.hidden = true; return;
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if(days < 0){
    months--;
    // days in the month before the target month
    days += new Date(target.getFullYear(), target.getMonth(), 0).getDate();
  }
  if(months < 0){ years--; months += 12; }

  const ms = 24*60*60*1000;
  const totalDays = Math.round((Date.UTC(target.getFullYear(), target.getMonth(), target.getDate())
                  - Date.UTC(birth.getFullYear(), birth.getMonth(), birth.getDate())) / ms);

  // next birthday
  let next = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if(next < target) next = new Date(target.getFullYear()+1, birth.getMonth(), birth.getDate());
  const untilNext = Math.round((Date.UTC(next.getFullYear(), next.getMonth(), next.getDate())
                  - Date.UTC(target.getFullYear(), target.getMonth(), target.getDate())) / ms);

  $('y').textContent = years;
  $('m').textContent = months;
  $('d').textContent = days;
  $('tm').textContent = (years*12 + months).toLocaleString();
  $('tw').textContent = Math.floor(totalDays/7).toLocaleString();
  $('td').textContent = totalDays.toLocaleString();
  $('nb').textContent = untilNext === 0 ? 'Today!' :
    next.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'}) +
    ' (in ' + untilNext + (untilNext === 1 ? ' day)' : ' days)');
  result.hidden = false;
}

$('calc').addEventListener('click', calculate);
$('reset').addEventListener('click', () => {
  dob.value = ''; err.textContent = ''; result.hidden = true; setDefaults();
});
[dob,on].forEach(el => el.addEventListener('keydown', e => { if(e.key === 'Enter') calculate(); }));
setDefaults();
