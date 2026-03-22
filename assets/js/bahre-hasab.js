/**
 * Bahre Hasab (ባህረ ሐሳብ) - Ethiopian Orthodox Tewahedo Church Calendar Calculator
 * Calculates movable holidays and fasts based on the Ethiopian year.
 */

const BAHRE_HASAB = {
    // Days of the week in Amharic
    days: ['ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሁድ'],
    
    // Day constants (Tewsak)
    tewsak: {
        'እሁድ': 7,
        'ሰኞ': 6,
        'ማክሰኞ': 5,
        'ረቡዕ': 4,
        'ሐሙስ': 3,
        'ዓርብ': 2,
        'ቅዳሜ': 8
    },
    
    // Day names for result display
    dayNames: ['ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሁድ'],

    // Months in Amharic
    months: [
        'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
        'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
    ],

    /**
     * Calculate all movable holidays for a given Ethiopian year
     * @param {number} year - Ethiopian Year (E.C.)
     */
    calculate: function(year) {
        const ameteAlem = year + 5500;
        
        // 1. Day of Meskerem 1
        // Mapping: 0: Monday, 1: Tuesday, 2: Wednesday, 3: Thursday, 4: Friday, 5: Saturday, 6: Sunday
        const meskerem1DayIdx = (ameteAlem + Math.floor(ameteAlem / 4)) % 7;
        const meskerem1Day = this.days[meskerem1DayIdx];

        // 2. Wember (ወንበር)
        const wember = (ameteAlem - 1) % 19;

        // 3. Abeqte (አበቅቴ)
        const abeqte = (wember * 11) % 30;

        // 4. Metqe (መጥቅዕ)
        let metqe = (wember * 19) % 30;
        if (metqe === 0) metqe = 30;

        // 5. Be'ale Metqe (በዓለ መጥቅዕ)
        let bealeMetqeMonth, bealeMetqeDay;
        if (metqe > 14) {
            bealeMetqeMonth = 'መስከረም';
            bealeMetqeDay = metqe;
        } else {
            bealeMetqeMonth = 'ጥቅምት';
            bealeMetqeDay = metqe;
        }

        // 6. Day of Be'ale Metqe
        let daysFromMeskerem1 = (bealeMetqeMonth === 'መስከረም') ? (bealeMetqeDay - 1) : (30 + bealeMetqeDay - 1);
        const bealeMetqeDayIdx = (meskerem1DayIdx + daysFromMeskerem1) % 7;
        const bealeMetqeDayName = this.days[bealeMetqeDayIdx];

        // 7. Mebaja Hamer (መባጃ ሐመር)
        const tewsakValue = this.tewsak[bealeMetqeDayName];
        const mebajaHamer = metqe + tewsakValue;

        // 8. Nenewe (ጾመ ነነዌ)
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
            // If Beale Metqe is in Tikimt, Nenewe is always in Yekatit
            neneweMonth = 'የካቲት';
            neneweDay = mebajaHamer;
        }

        // Base date for offsets (Tir 1)
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
            { name: 'ጾመ ድኅነት', offset: 121 }
        ].map(h => {
            let mIdx, d, dayName;
            if (h.name === 'ጾመ ነነዌ') {
                mIdx = this.months.indexOf(h.month);
                d = h.day;
            } else {
                let baseDays = (neneweMonth === 'ጥር' ? 4 * 30 : 5 * 30) + neneweDay;
                let totalDays = baseDays + h.offset;
                mIdx = Math.floor((totalDays - 1) / 30);
                d = ((totalDays - 1) % 30) + 1;
            }
            
            // Calculate day name
            let totalDaysForWeekday = (mIdx * 30) + d - 1;
            let dayIdx = (meskerem1DayIdx + totalDaysForWeekday) % 7;
            dayName = this.dayNames[dayIdx];

            return { 
                name: h.name, 
                date: `${this.months[mIdx]} ${d} (${dayName})`, 
                type: 'movable' 
            };
        });

        // Fixed holidays logic
        const isYohannes = (year % 4 === 0);
        const ledetDay = isYohannes ? 28 : 29;

        const fixedHolidays = [
            { name: 'እንቁጣጣሽ (አዲስ ዓመት)', date: 'መስከረም 1' },
            { name: 'መስቀል', date: 'መስከረም 17' },
            { name: 'ልደት (ገና)', date: `ታኅሣሥ ${ledetDay}` },
            { name: 'ጥምቀት', date: 'ጥር 11' },
            { name: 'ቃና ዘገሊላ', date: 'ጥር 12' },
            { name: 'ደብረ ታቦር (ቡሄ)', date: 'ነሐሴ 13' },
            { name: 'ጾመ ፍልሰታ', date: 'ነሐሴ 1 - 15' },
            { name: 'ፍልሰታ ለማርያም', date: 'ነሐሴ 16' }
        ].map(h => {
            if (h.date.includes('-')) return { ...h, type: 'fixed' }; // Range doesn't get a single day name
            let [mName, d] = h.date.split(' ');
            let mIdx = this.months.indexOf(mName);
            let totalDaysForWeekday = (mIdx * 30) + parseInt(d) - 1;
            let dayIdx = (meskerem1DayIdx + totalDaysForWeekday) % 7;
            let dayName = this.dayNames[dayIdx];
            return { 
                ...h, 
                date: `${h.date} (${dayName})`,
                type: 'fixed' 
            };
        });

        return [...fixedHolidays, ...movableHolidays];
    }
};

// UI Logic
document.addEventListener('DOMContentLoaded', () => {
    const yearInput = document.getElementById('yearInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const currentYearSpan = document.getElementById('currentYearDisplay');

    if (!yearInput || !calculateBtn || !resultsContainer) return;

    // Set default year (current Ethiopian year)
    const now = new Date();
    const estYear = now.getFullYear() - (now.getMonth() < 8 || (now.getMonth() === 8 && now.getDate() < 11) ? 8 : 7);
    yearInput.value = estYear;

    function renderResults(year) {
        try {
            const results = BAHRE_HASAB.calculate(parseInt(year));
            resultsContainer.innerHTML = '';
            
            // Group by type for better UI
            const fixed = results.filter(r => r.type === 'fixed');
            const movable = results.filter(r => r.type === 'movable');

            const renderSection = (title, items) => {
                const section = document.createElement('div');
                section.className = 'holiday-section';

                const header = document.createElement('h3');
                header.className = 'section-title-alt';
                header.textContent = title;
                section.appendChild(header);

                const grid = document.createElement('div');
                grid.className = 'results-grid';
                items.forEach((h, index) => {
                    const card = document.createElement('div');
                    card.className = `holiday-card ${h.type}`;
                    card.style.animationDelay = `${index * 0.05}s`;
                    card.innerHTML = `
                        <div class="holiday-name">${h.name}</div>
                        <div class="holiday-date">${h.date}</div>
                    `;
                    grid.appendChild(card);
                });
                section.appendChild(grid);
                resultsContainer.appendChild(section);
            };

            renderSection('ቋሚ በዓላት (Fixed)', fixed);
            renderSection('ተንቀሳቃሽ በዓላትና አጽዋማት (Movable)', movable);
            
            if (currentYearSpan) currentYearSpan.textContent = year;
            if ('vibrate' in navigator) navigator.vibrate(50);
            
        } catch (e) {
            resultsContainer.innerHTML = '<div class="error">Error calculating dates. Please check the year.</div>';
        }
    }

    calculateBtn.addEventListener('click', () => {
        renderResults(yearInput.value);
    });

    yearInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') renderResults(yearInput.value);
    });

    // Initial calculation
    renderResults(yearInput.value);
});
