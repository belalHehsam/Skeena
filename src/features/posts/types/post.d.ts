export type Post = {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  tags: string[];
  likesCount: number;
  commentsCount: number;
  commentsEnabled: boolean;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface PostResponse {
  status: string;
  data: {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      totalResults: number;
      hasNextPage: number;
    };
  };
}

// {
//     "status": "success",
//     "data": {
//         "posts": [
//             {
//                 "_id": "6a1ef8b0ec81c492d5fe078a",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "<blockquote><p>\"Lately I have been feeling very overwhelmed with everything going on. It feels like there are too many trials and hardships in life right now. But I am trying my best to stay patient, make dua, and trust in Allah's plan no matter what.\"</p></blockquote><p><br></p>",
//                 "tags": [
//                     "quran"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": true,
//                 "createdAt": "2026-06-02T15:37:20.799Z",
//                 "updatedAt": "2026-06-02T15:37:20.799Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a1ef6d8405a96f03ce5b486",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "<blockquote><p>\"Lately I have been feeling very overwhelmed with everything going on. It feels like there are too many trials and hardships in life right now. But I am trying my best to stay patient, make dua, and trust in Allah's plan no matter what.\"</p></blockquote><p></p>",
//                 "tags": [
//                     "fiqh",
//                     "quran"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": true,
//                 "recommendation": {
//                     "type": "hadith",
//                     "arabicText": "حَدَّثَنِي زُهَيْرُ بْنُ حَرْبٍ، حَدَّثَنَا سُفْيَانُ بْنُ عُيَيْنَةَ، عَنْ عَمْرِو بْنِ دِينَارٍ، قَالَ سَأَلْنَا ابْنَ عُمَرَ عَنْ رَجُلٍ، قَدِمَ بِعُمْرَةٍ فَطَافَ بِالْبَيْتِ وَلَمْ يَطُفْ بَيْنَ الصَّفَا وَالْمَرْوَةِ أَيَأْتِي امْرَأَتَهُ فَقَالَ قَدِمَ رَسُولُ اللَّهِ صلى الله عليه وسلم فَطَافَ بِالْبَيْتِ سَبْعًا وَصَلَّى خَلْفَ الْمَقَامِ رَكْعَتَيْنِ وَبَيْنَ الصَّفَا وَالْمَرْوَةِ سَبْعًا وَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ ‏.‏",
//                     "translationText": "Amr b. Dinar said:We asked Ibn Umar about a person who came for Umra and circumambulated the House, but he did not run between al-Safa' and al-Marwa, whether he is allowed to (put off Ihram) and have intercourse with his wife. He replied: Allah's Messenger (ﷺ) circumambulated the House seven times and offered two rak'ahs of prayer after staying (at 'Arafat), and ran between al-Safa and al-Marwa seven times.\" Verily there is in Allah's Messenger a model pattern for you\" (xxxill)",
//                     "source": "Sahih Muslim, Hadith 2999",
//                     "reference": "muslim:2999",
//                     "relevanceExplanation": "This Hadith beautifully encapsulates the essence of a believer's journey through life's ups and downs, affirming that all circumstances are good for them if they respond with gratitude in ease and patience in hardship. It directly addresses the feeling of being overwhelmed by trials and the importance of staying patient and trusting in Allah's plan."
//                 },
//                 "createdAt": "2026-06-02T15:29:28.809Z",
//                 "updatedAt": "2026-06-02T15:29:28.809Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a1ef661405a96f03ce5b485",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "<blockquote><p>\"Lately I have been feeling very overwhelmed with everything going on. It feels like there are too many trials and hardships in life right now. But I am trying my best to stay patient, make dua, and trust in Allah's plan no matter what.\"</p></blockquote><p></p>",
//                 "tags": [
//                     "fiqh"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": true,
//                 "createdAt": "2026-06-02T15:27:29.208Z",
//                 "updatedAt": "2026-06-02T15:27:29.208Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a1ef55a405a96f03ce5b484",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "<p><strong>You don’t have to carry it all today. 🌿</strong></p><p>Sometimes we weigh ourselves down trying to control every detail of tomorrow, forgetting who is actually in charge.</p><p>Take a moment to look at the world around you. The same Creator who perfectly times the changing of the seasons, who sustains the smallest seed beneath the soil, and who keeps your heart beating without you even having to ask, is fully aware of the silent battles you are fighting.</p><p></p>",
//                 "tags": [
//                     "fiqh"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": true,
//                 "recommendation": {
//                     "type": "quran",
//                     "arabicText": "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ ۚ إِنَّ ٱللَّهَ بَٰلِغُ أَمْرِهِۦ ۚ قَدْ جَعَلَ ٱللَّهُ لِكُلِّ شَىْءٍۢ قَدْرًۭا",
//                     "translationText": "And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.",
//                     "source": "Surah At-Talaaq (65:3)",
//                     "surahName": "At-Talaaq",
//                     "reference": "65:3",
//                     "relevanceExplanation": "This ayah beautifully encapsulates the essence of the post, reminding us that whoever relies upon Allah, He is sufficient for them. It encourages letting go of the burden of trying to control every detail, as Allah has already set a decreed extent for everything and will accomplish His purpose."
//                 },
//                 "createdAt": "2026-06-02T15:23:06.214Z",
//                 "updatedAt": "2026-06-02T15:23:06.214Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a2207e9747780b176bf23a8",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "The importance of patience (sabr) in Islam cannot be overstated. Allah says in the Quran that He is with those who are patient. During times of hardship, a Muslim should turn to prayer and remembrance of Allah.",
//                 "tags": [
//                     "quran"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": false,
//                 "recommendation": {
//                     "type": "quran",
//                     "arabicText": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
//                     "translationText": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
//                     "source": "Surah Al-Baqara (2:153)",
//                     "surahName": "Al-Baqara",
//                     "reference": "2:153",
//                     "relevanceExplanation": "This ayah directly commands believers to seek help through patience and prayer, and affirms that Allah is indeed with those who are patient, perfectly aligning with the post's emphasis on sabr during hardship."
//                 },
//                 "createdAt": "2026-06-02T15:18:01.164Z",
//                 "updatedAt": "2026-06-02T15:18:01.164Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a2207eb747780b176bf23a9",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "The importance of patience (sabr) in Islam cannot be overstated. Allah says in the Quran that He is with those who are patient. During times of hardship, a Muslim should turn to prayer and remembrance of Allah.",
//                 "tags": [
//                     "quran"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": false,
//                 "recommendation": {
//                     "type": "quran",
//                     "arabicText": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
//                     "translationText": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
//                     "source": "Surah Al-Baqara (2:153)",
//                     "surahName": "Al-Baqara",
//                     "reference": "2:153",
//                     "relevanceExplanation": "This ayah directly commands believers to seek help through patience and prayer, and affirms that Allah is indeed with those who are patient, perfectly aligning with the post's emphasis on sabr during hardship."
//                 },
//                 "createdAt": "2026-06-02T15:18:01.164Z",
//                 "updatedAt": "2026-06-02T15:18:01.164Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a2207ed747780b176bf23aa",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "The importance of patience (sabr) in Islam cannot be overstated. Allah says in the Quran that He is with those who are patient. During times of hardship, a Muslim should turn to prayer and remembrance of Allah.",
//                 "tags": [
//                     "quran"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": false,
//                 "recommendation": {
//                     "type": "quran",
//                     "arabicText": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
//                     "translationText": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
//                     "source": "Surah Al-Baqara (2:153)",
//                     "surahName": "Al-Baqara",
//                     "reference": "2:153",
//                     "relevanceExplanation": "This ayah directly commands believers to seek help through patience and prayer, and affirms that Allah is indeed with those who are patient, perfectly aligning with the post's emphasis on sabr during hardship."
//                 },
//                 "createdAt": "2026-06-02T15:18:01.164Z",
//                 "updatedAt": "2026-06-02T15:18:01.164Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a1ef429405a96f03ce5b483",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "The importance of patience (sabr) in Islam cannot be overstated. Allah says in the Quran that He is with those who are patient. During times of hardship, a Muslim should turn to prayer and remembrance of Allah.",
//                 "tags": [
//                     "quran"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": false,
//                 "recommendation": {
//                     "type": "quran",
//                     "arabicText": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
//                     "translationText": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
//                     "source": "Surah Al-Baqara (2:153)",
//                     "surahName": "Al-Baqara",
//                     "reference": "2:153",
//                     "relevanceExplanation": "This ayah directly commands believers to seek help through patience and prayer, and affirms that Allah is indeed with those who are patient, perfectly aligning with the post's emphasis on sabr during hardship."
//                 },
//                 "createdAt": "2026-06-02T15:18:01.164Z",
//                 "updatedAt": "2026-06-02T15:18:01.164Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a2207d8747780b176bf23a6",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "The importance of patience (sabr) in Islam cannot be overstated. Allah says in the Quran that He is with those who are patient. During times of hardship, a Muslim should turn to prayer and remembrance of Allah.",
//                 "tags": [
//                     "quran"
//                 ],
//                 "likesCount": 1,
//                 "commentsCount": 0,
//                 "commentsEnabled": false,
//                 "recommendation": {
//                     "type": "quran",
//                     "arabicText": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
//                     "translationText": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
//                     "source": "Surah Al-Baqara (2:153)",
//                     "surahName": "Al-Baqara",
//                     "reference": "2:153",
//                     "relevanceExplanation": "This ayah directly commands believers to seek help through patience and prayer, and affirms that Allah is indeed with those who are patient, perfectly aligning with the post's emphasis on sabr during hardship."
//                 },
//                 "createdAt": "2026-06-02T15:18:01.164Z",
//                 "updatedAt": "2026-06-05T16:57:50.428Z",
//                 "isLiked": false
//             },
//             {
//                 "_id": "6a2207e5747780b176bf23a7",
//                 "author": {
//                     "_id": "6a1ef3d85d406c7a4eb2f00b",
//                     "username": "test_user"
//                 },
//                 "content": "The importance of patience (sabr) in Islam cannot be overstated. Allah says in the Quran that He is with those who are patient. During times of hardship, a Muslim should turn to prayer and remembrance of Allah.",
//                 "tags": [
//                     "quran"
//                 ],
//                 "likesCount": 0,
//                 "commentsCount": 0,
//                 "commentsEnabled": false,
//                 "recommendation": {
//                     "type": "quran",
//                     "arabicText": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
//                     "translationText": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
//                     "source": "Surah Al-Baqara (2:153)",
//                     "surahName": "Al-Baqara",
//                     "reference": "2:153",
//                     "relevanceExplanation": "This ayah directly commands believers to seek help through patience and prayer, and affirms that Allah is indeed with those who are patient, perfectly aligning with the post's emphasis on sabr during hardship."
//                 },
//                 "createdAt": "2026-06-02T15:18:01.164Z",
//                 "updatedAt": "2026-06-02T15:18:01.164Z",
//                 "isLiked": false
//             }
//         ],
//         "pagination": {
//             "page": 1,
//             "limit": 10,
//             "totalResults": 13,
//             "hasNextPage": true
//         }
//     }
// }

