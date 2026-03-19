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
        let neneweMonth = (mebajaHamer > 30) ? 'የካቲት' : 'ጥር';
        let neneweDay = (mebajaHamer > 30) ? (mebajaHamer - 30) : mebajaHamer;

        // Base date for offsets (Tir 1)
        // We use a simple offset from Nenewe for consistency
        const holidays = [
            { name: 'ጾመ ነነዌ', month: neneweMonth, day: neneweDay, offset: 0 },
            { name: 'ዓቢይ ጾም', offset: 14 },
            { name: 'ደብረ ዘይት', offset: 41 },
            { name: 'ሆሣዕና', offset: 62 },
            { name: 'ስቅለት', offset: 67 },
            { name: 'ትንሣኤ', offset: 69 },
            { name: 'ርክበ ካህናት', offset: 93 },
            { name: 'ዕርገት', offset: 109 },
            { name: 'ጰራቅሊጦስ', offset: 119 },
            { name: 'ጾመ ሐዋርያት', offset: 120 },
            { name: 'ጾመ ድኅነት', offset: 121 }
        ];

        // Result calculation helper
        return holidays.map(h => {
            if (h.name === 'ጾመ ነነዌ') return { name: h.name, date: `${h.month} ${h.day}` };
            
            // Calculate other dates by adding offset to Nenewe
            // Ethiopian months are 30 days exactly (except Pagume)
            // Since Nenewe is in Tir/Lekatit, and all these holidays are before/in Hamle,
            // we can use a simple 30-day month logic.
            
            let totalDays = (neneweMonth === 'ጥር' ? 4 * 30 : 5 * 30) + neneweDay + h.offset;
            // totalDays is days from Meskerem 1
            // Convert back to month and day
            let mIdx = Math.floor((totalDays - 1) / 30);
            let d = ((totalDays - 1) % 30) + 1;
            
            return {
                name: h.name,
                date: `${this.months[mIdx]} ${d}`
            };
        });
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
    // Approximate: current Gregorian year - 8 (or 7)
    const now = new Date();
    const estYear = now.getFullYear() - (now.getMonth() < 8 || (now.getMonth() === 8 && now.getDate() < 11) ? 8 : 7);
    yearInput.value = estYear;

    function renderResults(year) {
        try {
            const results = BAHRE_HASAB.calculate(parseInt(year));
            resultsContainer.innerHTML = '';
            
            results.forEach((h, index) => {
                const card = document.createElement('div');
                card.className = 'holiday-card';
                card.style.animationDelay = `${index * 0.05}s`;
                card.innerHTML = `
                    <div class="holiday-name">${h.name}</div>
                    <div class="holiday-date">${h.date}</div>
                `;
                resultsContainer.appendChild(card);
            });
            
            if (currentYearSpan) currentYearSpan.textContent = year;
            
            // Haptic feedback if available
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
