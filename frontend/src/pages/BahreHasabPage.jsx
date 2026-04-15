import { useState, useEffect } from 'react';

/**
 * Bahre Hasab (ባህረ ሐሳብ) — Ethiopian Orthodox Calendar Calculator.
 * Port of the original bahre-hasab.js logic into a React component.
 */

const DAYS = ['ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሁድ'];
const TEWSAK = { 'እሁድ': 7, 'ሰኞ': 6, 'ማክሰኞ': 5, 'ረቡዕ': 4, 'ሐሙስ': 3, 'ዓርብ': 2, 'ቅዳሜ': 8 };
const MONTHS = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];

function calculate(year) {
  const ameteAlem = year + 5500;
  const evangelists = ['ዮሐንስ', 'ማቴዎስ', 'ማርቆስ', 'ሉቃስ'];
  const evangelist = evangelists[ameteAlem % 4];
  const meskerem1DayIdx = (ameteAlem + Math.floor(ameteAlem / 4)) % 7;
  const wember = (ameteAlem - 1) % 19;
  const abeqte = (wember * 11) % 30;
  let metqe = (wember * 19) % 30;
  if (metqe === 0) metqe = 30;

  let bealeMetqeMonth, bealeMetqeDay;
  if (metqe > 14) {
    bealeMetqeMonth = 'መስከረም';
    bealeMetqeDay = metqe;
  } else {
    bealeMetqeMonth = 'ጥቅምት';
    bealeMetqeDay = metqe;
  }

  let daysFromMeskerem1 = (bealeMetqeMonth === 'መስከረም') ? (bealeMetqeDay - 1) : (30 + bealeMetqeDay - 1);
  const bealeMetqeDayIdx = (meskerem1DayIdx + daysFromMeskerem1) % 7;
  const bealeMetqeDayName = DAYS[bealeMetqeDayIdx];
  const tewsakValue = TEWSAK[bealeMetqeDayName];
  const mebajaHamer = metqe + tewsakValue;

  let neneweMonth, neneweDay;
  if (bealeMetqeMonth === 'መስከረም') {
    if (mebajaHamer > 30) {
      neneweMonth = 'የካቲት';
      neneweDay = mebajaHamer - 30;
    } else {
      neneweMonth = 'ጥር';
      neneweDay = mebajaHamer;
    }
  } else {
    neneweMonth = 'የካቲት';
    neneweDay = mebajaHamer;
  }

  const movableHolidays = [
    { name: 'ጾመ ነነዌ', month: neneweMonth, day: neneweDay, offset: 0 },
    { name: 'ዓቢይ ጾም', offset: 14 },
    { name: 'ደብረ ዘይት', offset: 41 },
    { name: 'ሆሣዕና', offset: 62 },
    { name: 'ስቅለት', offset: 67 },
    { name: 'ትንሣኤ', offset: 69 },
    { name: 'ርክበ ካህናት', offset: 93 },
    { name: 'ዕርገት', offset: 108 },
    { name: 'ጰራቅሊጦስ', offset: 118 },
    { name: 'ጾመ ሐዋርያት', offset: 119 },
    { name: 'ጾመ ድኅነት', offset: 121 },
  ].map(h => {
    let mIdx, d;
    if (h.name === 'ጾመ ነነዌ') {
      mIdx = MONTHS.indexOf(h.month);
      d = h.day;
    } else {
      let baseDays = (neneweMonth === 'ጥር' ? 4 * 30 : 5 * 30) + neneweDay;
      let totalDays = baseDays + h.offset;
      mIdx = Math.floor((totalDays - 1) / 30);
      d = ((totalDays - 1) % 30) + 1;
    }
    let totalDaysForWeekday = (mIdx * 30) + d - 1;
    let dayIdx = (meskerem1DayIdx + totalDaysForWeekday) % 7;
    let dayName = DAYS[dayIdx];
    return { name: h.name, date: `${MONTHS[mIdx]} ${d} (${dayName})`, type: 'movable' };
  });

  const isYohannes = (year % 4 === 0);
  const ledetDay = isYohannes ? 28 : 29;

  const fixedHolidays = [
    { name: 'እንቁጣጣሽ (አዲስ ዓመት)', date: 'መስከረም 1' },
    { name: 'መስቀል', date: 'መስከረም 17' },
    { name: 'ልደት (ገና)', date: `ታኅሣሥ ${ledetDay}` },
    { name: 'ጥምቀት', date: 'ጥር 11' },
    { name: 'ቃና ዘገሊላ', date: 'ጥር 12' },
    { name: 'ልደተ ማርያም (Nativity of Mary)', date: 'ግንቦት 1' },
    { name: 'ጾመ ጽጌ (Fast of Tsige)', date: 'መስከረም 26' },
    { name: 'ቁስቋም (Kuskwam)', date: 'ኅዳር 6' },
    { name: 'ጾመ ነቢያት (Fast of Prophets)', date: 'ኅዳር 15' },
    { name: 'ደብረ ታቦር (ቡሄ)', date: 'ነሐሴ 13' },
    { name: 'ጾመ ፍልሰታ (የፍልሰታ መግቢያ)', date: 'ነሐሴ 1' },
    { name: 'ፍልሰታ ለማርያም', date: 'ነሐሴ 16' },
  ].map(h => {
    let [mName, d] = h.date.split(' ');
    let mIdx = MONTHS.indexOf(mName);
    let totalDaysForWeekday = (mIdx * 30) + parseInt(d) - 1;
    let dayIdx = (meskerem1DayIdx + totalDaysForWeekday) % 7;
    let dayName = DAYS[dayIdx];
    return { ...h, date: `${h.date} (${dayName})`, type: 'fixed' };
  });

  return { evangelist, holidays: [...fixedHolidays, ...movableHolidays] };
}

export default function BahreHasabPage() {
  const now = new Date();
  const estYear = now.getFullYear() - (now.getMonth() < 8 || (now.getMonth() === 8 && now.getDate() < 11) ? 8 : 7);
  const [year, setYear] = useState(estYear);
  const [results, setResults] = useState(null);

  useEffect(() => {
    try {
      setResults(calculate(parseInt(year)));
    } catch {
      setResults(null);
    }
  }, []);

  const handleCalculate = () => {
    try {
      setResults(calculate(parseInt(year)));
      if ('vibrate' in navigator) navigator.vibrate(50);
    } catch {
      setResults(null);
    }
  };

  const fixed = results ? results.holidays.filter(h => h.type === 'fixed') : [];
  const movable = results ? results.holidays.filter(h => h.type === 'movable') : [];

  return (
    <main id="main" className="container">
      <header>
        <h1>ባህረ ሐሳብ</h1>
        <p className="subtitle">የአጽዋማትና የበዓላት ማውጫ</p>
      </header>

      <section className="calculator-container">
        <div className="input-group">
          <input
            type="number"
            id="yearInput"
            placeholder="ዓመተ ምሕረት"
            min="1"
            max="9999"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleCalculate(); }}
          />
          <button id="calculateBtn" className="btn-calculate" onClick={handleCalculate}>
            አስላ
          </button>
        </div>

        <div className="year-indicator">
          የ <span id="currentYearDisplay">{year}</span> ዓ.ም በዓላትና አጽዋማት
        </div>

        <div id="resultsContainer">
          {results && (
            <>
              <div className="evangelist-info" style={{ gridColumn: '1 / -1' }}>
                የአመቱ ወንጌላዊ፡ <strong>{results.evangelist}</strong>
              </div>

              {/* Fixed Holidays */}
              <div className="holiday-section">
                <h3 className="section-title-alt">ቋሚ በዓላት (Fixed)</h3>
                <div className="results-grid">
                  {fixed.map((h, i) => (
                    <div key={i} className="holiday-card fixed" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="holiday-name">{h.name}</div>
                      <div className="holiday-date">{h.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Movable Holidays */}
              <div className="holiday-section">
                <h3 className="section-title-alt">ተንቀሳቃሽ በዓላትና አጽዋማት (Movable)</h3>
                <div className="results-grid">
                  {movable.map((h, i) => (
                    <div key={i} className="holiday-card movable" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="holiday-name">{h.name}</div>
                      <div className="holiday-date">{h.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
