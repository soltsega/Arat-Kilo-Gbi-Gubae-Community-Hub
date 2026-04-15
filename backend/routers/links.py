"""
Links API router.
Returns community links data for the Links page.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/links", tags=["links"])

LOCAL_LINKS = [
    {
        "title": "የአዲስ አበባ ዩኒቨርሲቲ ተማሪዎች Discussion Hub",
        "description": "Socialization Hub - ለተማሪዎች የእርስ በእርስ ግንኙነት እና መረጃ መለዋወጫ ግሩፕ።",
        "url": "https://t.me/aauorthodoxgroup",
    },
    {
        "title": "መጽሐፍ ቅዱስ ጥናት ዘ4 ኪሎ",
        "description": "Official የቴሌግራም ቻነል - ለዕለታዊ የመጽሐፍ ቅዱስ ጥናት ትምህርቶች።",
        "url": "https://t.me/gibi_gubae_bible",
    },
    {
        "title": "የ፬ ኪሎ የመጽሐፍ ቅዱስ ጥናት Notion Resource",
        "description": "የመጽሐፍ ቅዱስ ጥናት schedule የሚያገኙበት ገጽ",
        "url": "https://luxurious-borogovia-755.notion.site/2a371e5308f481c4a312f7ee55f4d0b3?v=2a371e5308f481589edb000ca46d3978",
    },
    {
        "title": "፭ ኪሎ ግቢ ጉባኤ",
        "description": "የአምስት ኪሎ ግቢ ጉባኤ Official የቴሌግራም ቻነል",
        "url": "https://t.me/amstkiloGG",
    },
    {
        "title": "ቅዱስ ጴጥሮስ ግቢ ጉባኤ",
        "description": "የቅዱስ ጴጥሮስ ግቢ ጉባኤ መረጃ መለዋወጫ ቻነል",
        "url": "https://t.me/kidus_petros_mereja",
    },
    {
        "title": "፮ ኪሎ ግቢ ጉባኤ",
        "description": "የስድስት ኪሎ ግቢ ጉባኤ Official የቴሌግራም ቻነል",
        "url": "https://t.me/SidistKiloGibiGubae",
    },
    {
        "title": "፬ ኪሎ ግቢ ጉባኤ ቴሌግራም",
        "description": "የ፬ ኪሎ ግቢ ጉባኤ ዋና የቴሌግራም ቻነል",
        "url": "https://t.me/gubaeze4k",
    },
    {
        "title": "፬ ኪሎ ፳፻፲፯ (2017)",
        "description": "የ፬ ኪሎ ግቢ ጉባኤ ፳፻፲፯ Batch ቻነል",
        "url": "https://t.me/Aratkilo2017",
    },
    {
        "title": "፬ ኪሎ ፳፻፲፰ (2018)",
        "description": "የ፬ ኪሎ ግቢ ጉባኤ ፳፻፲፰ Batch ቻነል",
        "url": "https://t.me/gubaeze4k2018",
    },
    {
        "title": "፬ ኪሎ ፳፻፲፮ (2016)",
        "description": "የ፬ ኪሎ ግቢ ጉባኤ ፳፻፲፮ Batch ቻነል",
        "url": "https://t.me/gubaeze4k2016",
    },
    {
        "title": "፬ ኪሎ ፳፻፲፭ (2015)",
        "description": "የ፬ ኪሎ ግቢ ጉባኤ ፳፻፲፭ Batch ቻነል",
        "url": "https://t.me/gubaeze4k2015",
    },
    {
        "title": "፬ ኪሎ ግቢ ጉባኤ YouTube",
        "description": "፬ ኪሎ ግቢ ጉባኤ 4 kilo gibi gubae Youtube Channel",
        "url": "https://www.youtube.com/channel/UCdLKUWOxqRNQcNlTrs3tcmw",
    },
]

WIDER_LINKS = [
    {
        "title": "EOTC Official Website",
        "description": "Official portal of the Ethiopian Orthodox Tewahedo Church.",
        "url": "http://www.ethiopianorthodox.org",
    },
    {
        "title": "Mahibere Kidusan",
        "description": "Official website for MK spiritual articles and resources.",
        "url": "https://eotcmk.org",
    },
    {
        "title": "EOTC TV",
        "description": "Official Telegram channel for the Church's television ministry.",
        "url": "https://t.me/eotctvchannel",
    },
    {
        "title": "EOTCMK Official",
        "description": "Daily spiritual feed from Mahibere Kidusan.",
        "url": "https://t.me/eotcmkq",
    },
    {
        "title": "TMC Media",
        "description": "The true voice of the Orthodox Tewahedo Church.",
        "url": "https://t.me/tewahedomediacenter",
    },
    {
        "title": "Orthodox Tewahedo",
        "description": "Popular community channel for spiritual poems and lessons.",
        "url": "https://t.me/TewahedoEthiopia",
    },
    {
        "title": "ጃን ደረባው ሚዲያ",
        "description": "የጃን ደረባው ቴሌግራም ቻነል - ወቅታዊ መረጃዎች እና ትምህርቶች",
        "url": "https://t.me/janderebaw_media",
    },
]


@router.get("/local")
def get_local_links():
    """Return local community links."""
    return LOCAL_LINKS


@router.get("/wider")
def get_wider_links():
    """Return wider community resource links."""
    return WIDER_LINKS


@router.get("/all")
def get_all_links():
    """Return all links grouped by category."""
    return {"local": LOCAL_LINKS, "wider": WIDER_LINKS}
