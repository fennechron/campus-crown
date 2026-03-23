// Award Categories and Nominees Data
// 30 categories, EXACTLY 67 shared nominees total

const AVATAR_COLORS = [
    "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#ef4444",
    "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
    "#3b82f6", "#6d7b8a", "#d946ef", "#f43f5e", "#84cc16",
    "#10b981", "#0ea5e9", "#8b5e3c", "#c084fc", "#fb7185",
];

let colorIndex = 0;
function nextColor() {
    return AVATAR_COLORS[colorIndex++ % AVATAR_COLORS.length];
}

function n(name, tagline) {
    const firstName = name.split(" ")[0].toLowerCase();
    const isFemale = ["priya", "riya", "sneha", "ananya", "meera", "shreya", "nandini", "tanya", "lalitha", "preethi", "tanvi", "divya", "anjali", "keerthi", "swathi", "roshni", "ishita", "deepa", "neha", "simran", "leena", "kavya", "revathi", "shruti", "pooja", "mia", "zara", "trisha", "sunita", "anita", "shalini"].includes(firstName) || firstName.endsWith("a");
    const gender = isFemale ? "Female" : "Male";

    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        tagline,
        initials,
        color: nextColor(),
        gender
    };
}

// THE SHARED 67 NOMINEES
export const GLOBAL_NOMINEES = [
    n("Arjun Mehta", "Melts hearts with every note"),
    n("Priya Sharma", "The voice of an angel"),
    n("Riya Thomas", "Born to perform"),
    n("Kabir Nair", "Mic drop moments only"),
    n("Sneha Patel", "Charts? She sets them"),
    n("Dev Kapoor", "From bathroom to stage"),
    n("Ananya Rao", "Can't stop, won't stop"),
    n("Rohan Verma", "Footwork that defies physics"),
    n("Meera Iyer", "Rhythm is her mother tongue"),
    n("Varun Singh", "The floor belongs to him"),
    n("Shreya Gupta", "Dance = breathing for her"),
    n("Kiran Joshi", "One move and the crowd loses it"),
    n("Nandini Das", "Paints the world in her colors"),
    n("Aditya Kumar", "Sketchbook always open"),
    n("Tanya Reddy", "Her art speaks louder than words"),
    n("Siddharth Rao", "Even his doodles are masterpieces"),
    n("Lalitha Menon", "Color palette? Her whole life"),
    n("Rahul Bose", "Portrait king of the class"),
    n("Aditya Sharma", "Debugs life issues too"),
    n("Preethi K", "Her code reads like poetry"),
    n("Nikhil Jain", "Stack Overflow? He wrote it"),
    n("Tanvi Shetty", "Turns caffeine into code"),
    n("Harsh Patel", "Has never seen a runtime error"),
    n("Divya Nair", "AI tells her for help"),
    n("Vishal Menon", "Makes even silence sound profound"),
    n("Anjali Singh", "Microphone activated confidence"),
    n("Rohit Pillai", "Debate champion, life champion"),
    n("Keerthi Rao", "Every word is a quote"),
    n("Amol Desai", "Convinces professors to extend deadlines"),
    n("Swathi Nair", "TED talk in every lecture"),
    n("Roshni Kumar", "Short stories but big dreams"),
    n("Aman Verma", "Journals are his diary and destiny"),
    n("Priya Pillai", "Writes 5000 words for a 500 word limit"),
    n("Kartik Nair", "Poetry at 3 AM, essays by morning"),
    n("Ishita Joshi", "Every caption could be a novel"),
    n("Vikas Sharma", "The campus blog legend"),
    n("Suresh Kumar", "Born on the field"),
    n("Deepa Nair", "Runs faster than deadlines"),
    n("Ramesh Iyer", "Trophy shelf? Needs a room"),
    n("Neha Reddy", "100m sprint? Easy"),
    n("Sanjay Pillai", "The human sports encyclopedia"),
    n("Divya Thomas", "Coach's favorite — always"),
    n("Akash Gupta", "Lens is his third eye"),
    n("Simran Kaur", "Instagram worthy by default"),
    n("Pranav Rao", "Catches light like magic"),
    n("Leena Joshi", "Even blurry shots look aesthetic"),
    n("Mihir Das", "Angles nobody else notices"),
    n("Kavya Shetty", "Shot on iPhone… but make it art"),
    n("Revathi Menon", "Hostel kitchen her kingdom"),
    n("Gaurav Patel", "Spice level: dangerous"),
    n("Shruti Nair", "Maggi? Now gourmet"),
    n("Aryan Singh", "Feeds the whole floor every Sunday"),
    n("Pooja Sharma", "Baked her way into everyone's heart"),
    n("Faizan Khan", "Secret recipe: love + ghee"),
    n("Mia Thomas", "Lives outside every box"),
    n("Vikram Nair", "Idea machine, 24/7"),
    n("Zara Kapoor", "Normal? Never heard of it"),
    n("Arun Joshi", "DIY everything from scratch"),
    n("Trisha Menon", "Pinterest dreams, reality executed"),
    n("Samir Reddy", "Innovative or chaotic? Both"),
    n("Sunita Iyer", "Has notes for classes she didn't attend"),
    n("Rajesh Kumar", "Carries a spare charger always"),
    n("Anita Sharma", "Your emergency contact in college"),
    n("Vinod Pillai", "Answers 2AM SOS messages"),
    n("Shalini Thomas", "Helped someone write their thesis"),
    n("Deepak Nair", "Wikipedia of project submissions"),
    n("Manan Patel", "Universal friend"),
];

export const CATEGORIES = [
     
  { id: "enthino-vendi-class-il-varunnu", title: "enthino vendi class il varunnu", emoji: "😐", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "one-side-lover-ultra-pro-max", title: "One side lover ultra pro max", emoji: "❤️", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "udaayippu", title: "Udaayippu", emoji: "😏", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "wifi-hunter", title: "wifi hunter", emoji: "📶", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "vaayinokki", title: "vaayinokki", emoji: "👀", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "wikipedia-of-the-class", title: "Wikipedia of the class", emoji: "📚", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "silent-killer", title: "Silent Killer", emoji: "😶", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "reels-nu-vendi-janichavan", title: "Reels nu vendi janichavan", emoji: "🎬", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Male" },
  { id: "reels-nu-vendi-janichaval", title: "Reels nu vendi janichaval", emoji: "🎬", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Female" },

  { id: "full-time-negative", title: "Full time negative", emoji: "☹️", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "mr-ponjikkara", title: "Mr Ponjikkara", emoji: "😎", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "main-attention-seeker", title: "Main attention seeker", emoji: "🎯", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "issac-newton-nte-kochumon", title: "Issac Newton nte kochumon", emoji: "🍎", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "enikku-athu-ariyaam", title: "That enthu paranjaalum \"Enikku athu ariyaam\" type", emoji: "🤓", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "that-kozhi", title: "That Kozhi", emoji: "🐔", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "ezhu-swarangal-keezhadakkiyavan", title: "that ezhu swarangaludeyum keezhadakkiyavan", emoji: "🎵", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Male" },
  { id: "ezhu-swarangal-keezhadakkiyaval", title: "that ezhu swarangaludeyum keezhadakkiyaval", emoji: "🎵", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Female" },

  { id: "ai-snehichavan-snehichaval", title: "That AI ye Snehichavan/Snehichaval", emoji: "🤖❤️", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "that-arana", title: "That arana", emoji: "🦎", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "that-nagavalli", title: "That nagavalli", emoji: "👻", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Female" },
  { id: "late-commer", title: "That late commer", emoji: "⏰", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "pro-gamer", title: "Pro gamer", emoji: "🎮", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "sigma-pro-max", title: "That Sigma pro max", emoji: "😎", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "that-annyan", title: "That annyan", emoji: "😈", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Male" },
 { id: "pun-master", title: "Chali unlimited supply", emoji: "🤣", type: "fun", nominees: GLOBAL_NOMINEES },
 { id: "multi-talented-nothing", title: "Ellam ariyam... paksha onnum cheyyilla", emoji: "🤡", type: "fun", nominees: GLOBAL_NOMINEES },
 { id: "idea-machine", title: "Ideas unlimited, execution zero", emoji: "💡", type: "fun", nominees: GLOBAL_NOMINEES },
 { id: "overthinking-pro", title: "Overthinkingil olympics gold kittunna aal", emoji: "🧠", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "double-tick-waiter", title: "Double tickinu vendi jeevikkunna aal", emoji: "✔️", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "neelakkuyil", title: "Neelakkuyil", emoji: "🐦", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "niraasha-kaamuki", title: "That niraasha kaamuki", emoji: "💔", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Female" },
  { id: "niraasha-kaamukan", title: "That niraasha Kaamukan", emoji: "💔", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Male" },

  { id: "nanma-maram", title: "Nanma maram", emoji: "🌳", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "nasa-hack", title: "HTML vachu nasa ye hack cheythavan", emoji: "💻", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "musle-aliyan", title: "That Musle aliyan", emoji: "🧔", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Male" },
  { id: "committee-main", title: "Parathookshana committee yude main", emoji: "📢", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "shuttumani", title: "That Shuttumani of class", emoji: "🔔", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "lipstick-lover", title: "Lipstick ne Pranayichaval", emoji: "💄", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Female" },
  { id: "infinite-aura", title: "Infinite Aura", emoji: "✨", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "kalakaaran", title: "That Kalakaaran", emoji: "🎨", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Male" },
  { id: "kalakaari", title: "That Kalakaari", emoji: "🎨", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Female" },

  { id: "sloth", title: "That Sloth(Full time urakkam)", emoji: "😴", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "tube-light", title: "That Tube light", emoji: "💡", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "valli", title: "That valli", emoji: "🌿", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "chennaaya", title: "That aatum tholitta chennaaya", emoji: "🐺", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "mandi-lover", title: "Mandi lover", emoji: "🍗", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "last-minute-deivam", title: "Last minute deivam", emoji: "🙏", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "cheevedu", title: "That Cheeveedu", emoji: "😬", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "classil-varaathavan-varathaval", title: "That classil varaathavan/varathaval", emoji: "🚫", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "velivum-velliyaazhchayum", title: "That velivum velliyaazhchayum illathathu", emoji: "🤯", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "thottaavaadi", title: "Thottaavaadi", emoji: "🌱", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "kuzhimadiyan", title: "That kuzhimadiyan", emoji: "😵", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "chaya-lover", title: "That Chaya lover", emoji: "☕", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "kallatharam", title: "That kallatharathinu kayyum kaalum vachathu", emoji: "🕵️", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "curry-veppila", title: "That curry veppila", emoji: "🌿", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "pishukkan", title: "That pishukkan", emoji: "💰", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "dirty-mind", title: "That innocent face with a dirty mind", emoji: "😇😈", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "onthu", title: "That onthu", emoji: "🦎", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "voice-message", title: "Voice message lover", emoji: "🎤", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "vikaara-jeevi", title: "Vikaara Jeevi", emoji: "🎤", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "thantha-vibe", title: "That Thantha vibe", emoji: "😄", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Male" },
  { id: "thalla-vibe", title: "That Thalla vibe", emoji: "😄", type: "fun", nominees: GLOBAL_NOMINEES, gender: "Female" },

  { id: "putty", title: "Always on putty", emoji: "📱", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "nimisha-kavi", title: "That nimisha kavi", emoji: "✍️", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "chali-phd", title: "Chaliyil phd eduthavan/eduthaval", emoji: "😂", type: "fun", nominees: GLOBAL_NOMINEES },

  { id: "vaayithalam", title: "That Vaayithalam adikkunna type", emoji: "🗣️", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "sticker-maker", title: "Sticker maker", emoji: "🧩", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "no-reply", title: "That reply tharaatha type", emoji: "📵", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "nere-va", title: "That nere va nere po type", emoji: "➡️", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "swayam-prakash", title: "That swayam prakash", emoji: "💡", type: "fun", nominees: GLOBAL_NOMINEES },
  { id: "not-interested", title: "Not interested in anything", emoji: "😑", type: "fun", nominees: GLOBAL_NOMINEES }

];

export const CATEGORY_COUNT = CATEGORIES.length;

export function getCategoryById(id) {
    return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryByIndex(index) {
    return CATEGORIES[index] || null;
}

export function formatNominee(doc) {
    const name = doc.name;
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return {
        id: doc.$id || name.toLowerCase().replace(/\s+/g, "-"),
        name,
        tagline: doc.tagline || "",
        initials,
        color: nextColor(),
        gender: doc.gender || "Male" // Fallback to avoid filtering bugs on split categories
    };
}

export function getDynamicCategories(remoteNominees = []) {
    const nominees = remoteNominees.length > 0
        ? remoteNominees.map(formatNominee)
        : GLOBAL_NOMINEES;

    return CATEGORIES.map(cat => ({
        ...cat,
        nominees: nominees
    }));
}

export default CATEGORIES;
