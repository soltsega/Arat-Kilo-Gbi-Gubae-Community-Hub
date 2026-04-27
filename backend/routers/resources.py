"""
Resources API router.
Returns structured data for gospel chapter links and academic resources.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/resources", tags=["resources"])

# Google Docs base URL for Matthew
MATTHEW_BASE = "https://docs.google.com/document/d/1goKAt_5FQUYsgEANQz3r7RUJj6yEKwNYcIsaQkADbT4/edit"
# Google Docs base URL for Mark
MARK_BASE = "https://docs.google.com/document/d/1hqU95sqpDfecgS_JUvdH6K1A0rpDf6Duo_yOC2cWZ40/edit"

SPIRITUAL_RESOURCES = [
    {
        "id": "matthew",
        "title": "የማቴዎስ ወንጌል",
        "description": "የማቴዎስ ወንጌል ማጠቃለያ እና የጥያቄዎች መልስ",
        "available": True,
        "chapters": [
            {"number": 1, "label": "ምዕራፍ 1", "url": f"{MATTHEW_BASE}?tab=t.0#heading=h.muxoi2gbuf95"},
            {"number": 2, "label": "ምዕራፍ 2", "url": f"{MATTHEW_BASE}?tab=t.h8m1eyr3jguf#heading=h.9jioa9y70f29"},
            {"number": 3, "label": "ምዕራፍ 3", "url": f"{MATTHEW_BASE}?tab=t.klictecyijp9#heading=h.6ycjdtji4low"},
            {"number": 4, "label": "ምዕራፍ 4", "url": f"{MATTHEW_BASE}?tab=t.dyyprd2aeiui#heading=h.77n2hhgjqunv"},
            {"number": 5, "label": "ምዕራፍ 5", "url": f"{MATTHEW_BASE}?tab=t.q3i1d45oc71o#heading=h.lihy482kyuxj"},
            {"number": 6, "label": "ምዕራፍ 6", "url": f"{MATTHEW_BASE}?tab=t.l9l5u5q21nz6#heading=h.6fyr54qfnoe"},
            {"number": 7, "label": "ምዕራፍ 7", "url": f"{MATTHEW_BASE}?tab=t.ae91nbcletli#heading=h.5u96bt78tz9t"},
            {"number": 8, "label": "ምዕራፍ 8", "url": f"{MATTHEW_BASE}?tab=t.q6dua0hl79mq#heading=h.jmx92gi56ids"},
            {"number": 9, "label": "ምዕራፍ 9", "url": f"{MATTHEW_BASE}?tab=t.ahfzevh7iv3#heading=h.4g95qdtre26"},
            {"number": 10, "label": "ምዕራፍ 10", "url": f"{MATTHEW_BASE}?tab=t.7uy6h6cdw3ck"},
            {"number": 11, "label": "ምዕራፍ 11", "url": f"{MATTHEW_BASE}?tab=t.smp92zaisz29#heading=h.guk2axk8n8yu"},
            {"number": 12, "label": "ምዕራፍ 12", "url": f"{MATTHEW_BASE}?tab=t.j9rs8itw392b#heading=h.laohr8w7f0z6"},
            {"number": 13, "label": "ምዕራፍ 13", "url": f"{MATTHEW_BASE}?tab=t.viso3lw19zhc#heading=h.g99u9z5iyxx1"},
            {"number": 14, "label": "ምዕራፍ 14", "url": f"{MATTHEW_BASE}?tab=t.dhom4u9yemby#heading=h.h3wizfhryx48"},
            {"number": 15, "label": "ምዕራፍ 15", "url": f"{MATTHEW_BASE}?tab=t.wg9leuyahawu#heading=h.fxphmwlppvlk"},
            {"number": 16, "label": "ምዕራፍ 16", "url": f"{MATTHEW_BASE}?tab=t.290lf8nmzzkj#heading=h.g1mdpy6npz7f"},
            {"number": 17, "label": "ምዕራፍ 17", "url": f"{MATTHEW_BASE}?tab=t.kvhbcuajiktc#heading=h.154wx4rt18gw"},
            {"number": 18, "label": "ምዕራፍ 18", "url": f"{MATTHEW_BASE}?tab=t.wshihmandwad#heading=h.wpjw3ain8cp8"},
            {"number": 19, "label": "ምዕራፍ 19", "url": f"{MATTHEW_BASE}?tab=t.9pdaubc2t7iw#heading=h.4laqnb1dqm2x"},
            {"number": 20, "label": "ምዕራፍ 20", "url": f"{MATTHEW_BASE}?tab=t.gze3jko8a0v1#heading=h.hjlcwwu4rsn0"},
            {"number": 21, "label": "ምዕራፍ 21", "url": f"{MATTHEW_BASE}?tab=t.thpjtu7yhm9v#heading=h.z08eydlh75fy"},
            {"number": 22, "label": "ምዕራፍ 22", "url": f"{MATTHEW_BASE}?tab=t.jahmdapxxwvw#heading=h.gsrx2dvwi4kn"},
            {"number": 23, "label": "ምዕራፍ 23", "url": f"{MATTHEW_BASE}?tab=t.l46r0lb31kcy#heading=h.e1e7tnk9s1vw"},
            {"number": 24, "label": "ምዕራፍ 24", "url": f"{MATTHEW_BASE}?tab=t.fu2me6m4xkte#heading=h.k89z73qp4fk"},
            {"number": 25, "label": "ምዕራፍ 25", "url": f"{MATTHEW_BASE}?tab=t.ivsdpqxvk2td#heading=h.ei7xkb3yss2t"},
            {"number": 26, "label": "ምዕራፍ 26", "url": f"{MATTHEW_BASE}?tab=t.5zqgevfeqn5f#heading=h.f4aedd6yvkm8"},
            {"number": 27, "label": "ምዕራፍ 27", "url": f"{MATTHEW_BASE}?tab=t.2oxyzw3sipwa#heading=h.ov6fkh9rrbmu"},
            {"number": 28, "label": "ምዕራፍ 28", "url": f"{MATTHEW_BASE}?tab=t.m85ex3cmejkk#heading=h.dll0x0phndrb"},
        ],
    },
    {
        "id": "mark",
        "title": "የማርቆስ ወንጌል",
        "description": "የማርቆስ ወንጌል ማጠቃለያ እና የጥያቄዎች መልስ",
        "available": True,
        "chapters": [
            {"number": 1, "label": "ምዕራፍ 1", "url": f"{MARK_BASE}?tab=t.0#heading=h.18or3vayv84b"},
            {"number": 2, "label": "ምዕራፍ 2", "url": f"{MARK_BASE}?tab=t.lonm9cd0mepx#heading=h.r0hcyimvy7"},
            {"number": 3, "label": "ምዕራፍ 3", "url": f"{MARK_BASE}?tab=t.54sm88rpul82#heading=h.a0n61d019ek"},
            {"number": 4, "label": "ምዕራፍ 4", "url": f"{MARK_BASE}?tab=t.vlhzeinrs79z#heading=h.ovk3zxu07bil"},
            {"number": 5, "label": "ምዕራፍ 5", "url": f"{MARK_BASE}?tab=t.vpbdkcqy00z2#heading=h.vtwq1ej2kqw9"},
            {"number": 6, "label": "ምዕራፍ 6", "url": f"{MARK_BASE}?tab=t.gj8hj2cxh1jx#heading=h.gf26jk3zxqyy"},
            {"number": 7, "label": "ምዕራፍ 7", "url": f"{MARK_BASE}?tab=t.scyi86364c3r#heading=h.hgs6qedg9k8q"},
            {"number": 8, "label": "ምዕራፍ 8", "url": f"{MARK_BASE}?tab=t.2c7ekx5pq4ab#heading=h.h8d060c12pjg"},
            {"number": 9, "label": "ምዕራፍ 9", "url": f"{MARK_BASE}?tab=t.vsgj3glr4q8f#heading=h.x2iiy0675bi2"},
            {"number": 10, "label": "ምዕራፍ 10", "url": f"{MARK_BASE}?tab=t.6jlpxvlv3zej#heading=h.6asxgzerq4ad"},
            {"number": 11, "label": "ምዕራፍ 11", "url": f"{MARK_BASE}?tab=t.6jlpxvlv3zej"},
            {"number": 12, "label": "ምዕራፍ 12", "url": f"{MARK_BASE}?tab=t.3kdzhihokewo"},
            {"number": 13, "label": "ምዕራፍ 13", "url": f"{MARK_BASE}?tab=t.ffebddm638a1#heading=h.xux4b7fisydw"},
            {"number": 14, "label": "ምዕራፍ 14", "url": f"{MARK_BASE}?tab=t.qe0wc1o7o0bf#heading=h.dxuzc4e7ekl8"},
            {"number": 15, "label": "ምዕራፍ 15", "url": f"{MARK_BASE}?tab=t.w0oicgamg028#heading=h.tbbg0jhr8zaw"},
            {"number": 16, "label": "ምዕራፍ 16", "url": f"{MARK_BASE}?tab=t.ah1bytt1glpa"},
        ],
    },
    {
        "id": "luke",
        "title": "የሉቃስ ወንጌል",
        "description": "Gospel of Luke Summary",
        "available": False,
        "chapters": [],
    },
    {
        "id": "john",
        "title": "የዮሐንስ ወንጌል",
        "description": "Gospel of John Summary",
        "available": False,
        "chapters": [],
    },
    {
        "id": "acts",
        "title": "የሐዋርያት ስራ",
        "description": "Acts of Apostles Summary",
        "available": False,
        "chapters": [],
    },
]

SPIRITUAL_QUESTIONS = [
    {"id": 1, "title": "ማቴዎስ", "english": "Matthew", "available": False},
    {"id": 2, "title": "ማርቆስ", "english": "Mark", "available": False},
    {"id": 3, "title": "ሉቃስ", "english": "Luke", "available": False},
    {"id": 4, "title": "ዮሐንስ", "english": "John", "available": False},
    {"id": 5, "title": "የሐዋርያት ሥራ", "english": "Acts", "available": False},
    {"id": 6, "title": "ሮሜ", "english": "Romans", "available": False},
    {"id": 7, "title": "1ኛ ቆሮንቶስ", "english": "1 Corinthians", "available": False},
    {"id": 8, "title": "2ኛ ቆሮንቶስ", "english": "2 Corinthians", "available": False},
    {"id": 9, "title": "ገላትያ", "english": "Galatians", "available": False},
    {"id": 10, "title": "ኤፌሶን", "english": "Ephesians", "available": False},
    {"id": 11, "title": "ፊልጵስዩስ", "english": "Philippians", "available": False},
    {"id": 12, "title": "ቆላስይስ", "english": "Colossians", "available": False},
    {"id": 13, "title": "1ኛ ተሰሎንቄ", "english": "1 Thessalonians", "available": False},
    {"id": 14, "title": "2ኛ ተሰሎንቄ", "english": "2 Thessalonians", "available": False},
    {"id": 15, "title": "1ኛ ጢሞቴዎስ", "english": "1 Timothy", "available": False},
    {"id": 16, "title": "2ኛ ጢሞቴዎስ", "english": "2 Timothy", "available": False},
    {"id": 17, "title": "ቲቶ", "english": "Titus", "available": False},
    {"id": 18, "title": "ፊልሞና", "english": "Philemon", "available": False},
    {"id": 19, "title": "ዕብራውያን", "english": "Hebrews", "available": False},
    {"id": 20, "title": "ያዕቆብ", "english": "James", "available": False},
    {"id": 21, "title": "1ኛ ጴጥሮስ", "english": "1 Peter", "available": False},
    {"id": 22, "title": "2ኛ ጴጥሮስ", "english": "2 Peter", "available": False},
    {"id": 23, "title": "1ኛ ዮሐንስ", "english": "1 John", "available": False},
    {"id": 24, "title": "2ኛ ዮሐንስ", "english": "2 John", "available": False},
    {"id": 25, "title": "3ኛ ዮሐንስ", "english": "3 John", "available": False},
    {"id": 26, "title": "ይሁዳ", "english": "Jude", "available": False},
    {"id": 27, "title": "ራእይ", "english": "Revelation", "available": False},
]

ACADEMIC_RESOURCES = [
    {
        "id": "notes",
        "icon": "🎓",
        "title": "Subject Notes",
        "description": "Comprehensive notes for various engineering and science courses.",
        "status": "Updating",
    },
    {
        "id": "exams",
        "icon": "📝",
        "title": "Old Exams",
        "description": "Past papers and model answers for midterm and final examinations.",
        "status": "Updating",
    },
]


@router.get("/spiritual")
def get_spiritual_resources():
    """Return spiritual resources (gospel chapter links)."""
    return SPIRITUAL_RESOURCES


@router.get("/questions")
def get_spiritual_questions():
    """Return list of books for spiritual questions and answers."""
    return SPIRITUAL_QUESTIONS


@router.get("/academic")
def get_academic_resources():
    """Return academic resources."""
    return ACADEMIC_RESOURCES
