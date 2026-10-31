import type { Language } from './types';

type TranslationKeys = {
  // Nav
  nav_home: string;
  nav_log: string;
  nav_about: string;
  nav_lang: string;
  // Hero
  hero_headline: string;
  hero_sub: string;
  hero_placeholder: string;
  hero_cta: string;
  hero_log_cta: string;
  hero_suggestions_label: string;
  // Sections
  recent_title: string;
  why_title: string;
  // Why cards
  why1_title: string;
  why1_body: string;
  why2_title: string;
  why2_body: string;
  why3_title: string;
  why3_body: string;
  // Case card
  card_solution: string;
  card_steps: string;
  card_source_sample: string;
  card_source_tech: string;
  card_no_recent: string;
  card_open_case: string;
  card_close: string;
  card_case_id: string;
  // Log Case
  log_headline: string;
  log_sub: string;
  log_brand: string;
  log_model: string;
  log_category: string;
  log_symptoms: string;
  log_symptoms_ph: string;
  log_steps: string;
  log_steps_ph: string;
  log_solution: string;
  log_solution_ph: string;
  log_submit: string;
  log_saving: string;
  log_success: string;
  log_success_sub: string;
  log_another: string;
  log_go_home: string;
  log_required: string;
  // Results
  results_back: string;
  results_query: string;
  results_found: string;
  results_none: string;
  results_log_cta: string;
  results_causes: string;
  results_matches: string;
  results_why: string;
  results_loading: string;
  results_error: string;
  results_retry: string;
  results_demo_badge: string;
  // About
  about_headline: string;
  about_sub: string;
  about_what_title: string;
  about_what_body: string;
  about_problem_title: string;
  about_problem_body: string;
  about_solution_title: string;
  about_solution_body: string;
  about_diff_title: string;
  about_diff_body: string;
  about_team_title: string;
  about_team_body: string;
  stats_users: string;
  stats_cases: string;
  stats_churn: string;
  stats_demo: string;
  // Footer
  footer_copy: string;
  footer_about: string;
  // Clear data
  clear_data: string;
  clear_confirm: string;
  clear_confirm_msg: string;
  clear_ok: string;
  clear_cancel: string;
};

const en: TranslationKeys = {
  nav_home: 'Home',
  nav_log: 'Log Case',
  nav_about: 'About',
  nav_lang: 'తెలుగు',
  hero_headline: 'Find the fix. Save the time.',
  hero_sub: "An AI-powered repair guide that finds past fixes for your device's symptoms.",
  hero_placeholder: 'Describe the laptop problem...',
  hero_cta: 'Find Solutions',
  hero_log_cta: 'Log New Case',
  hero_suggestions_label: 'Try searching:',
  recent_title: 'Recent Repair Cases',
  why_title: 'Why FixMemory?',
  why1_title: 'Limited Resources',
  why1_body: 'Many Indian repair shops operate with limited training, staff, and access to parts — making knowledge reuse critical.',
  why2_title: 'High Replacement Costs',
  why2_body: 'High repair costs and parts shortages can make replacement more attractive than repair, especially without quick diagnostic guidance.',
  why3_title: 'Informal Knowledge',
  why3_body: 'Technicians often rely on informal tips and peer knowledge when official documentation is insufficient.',
  card_solution: 'Solution',
  card_steps: 'Troubleshooting Steps Taken',
  card_source_sample: 'Sample',
  card_source_tech: 'Technician Submitted',
  card_no_recent: 'No repair cases yet. Log the first one!',
  card_open_case: 'View Full Case',
  card_close: 'Close',
  card_case_id: 'Case ID',
  log_headline: 'Save a repair. Help solve the next one.',
  log_sub: 'Document what you fixed so every technician can find it.',
  log_brand: 'Device Brand',
  log_model: 'Device Model',
  log_category: 'Problem Category',
  log_symptoms: 'Symptoms',
  log_symptoms_ph: 'Describe what the device is doing or not doing...',
  log_steps: 'Troubleshooting Steps Taken',
  log_steps_ph: 'What did you try to diagnose the problem?',
  log_solution: 'Final Solution / Repair Performed',
  log_solution_ph: 'What fixed it?',
  log_submit: 'Save Repair Case',
  log_saving: 'Saving...',
  log_success: 'Repair case saved!',
  log_success_sub: 'Your submission is now searchable.',
  log_another: 'Log Another Case',
  log_go_home: 'Back to Home',
  log_required: 'This field is required.',
  results_back: 'Back to Home',
  results_query: 'Search query',
  results_found: 'matching cases found',
  results_none: 'No sufficiently similar repair cases found.',
  results_log_cta: 'Log this as a new repair case',
  results_causes: 'Possible Causes',
  results_matches: 'Matching Repair Cases',
  results_why: 'Why this matches',
  results_loading: 'Searching repair cases...',
  results_error: 'Something went wrong while searching.',
  results_retry: 'Retry',
  results_demo_badge: 'Demo Match',
  about_headline: 'Preserving repair knowledge. Making troubleshooting smarter.',
  about_sub: 'Built for technicians, by technicians.',
  about_what_title: 'About FixMemory',
  about_what_body: 'FixMemory is an AI-driven repair knowledge base for technicians. Enter device symptoms; the AI finds matching past fixes from previously documented repair cases. Unlike manuals or forums, we aim to make technician-contributed repair knowledge easier to search and reuse.',
  about_problem_title: 'The Problem',
  about_problem_body: 'Computer and laptop repair technicians repeatedly diagnose the same faults because repair knowledge is scattered across personal notes, YouTube, forums, and conversations. Time is wasted on problems that have been solved before.',
  about_solution_title: 'Our Solution',
  about_solution_body: 'FixMemory retrieves historical repair cases that match the symptoms you describe. Technicians log what they fix; the AI finds those records when the next similar device comes in.',
  about_diff_title: 'What Makes Us Different',
  about_diff_body: 'FixMemory focuses on a searchable, AI-driven database of technician-documented repair cases. We do not claim that every submitted case is verified, but we surface real repair histories from the field.',
  about_team_title: 'Our Team',
  about_team_body: 'FixMemory is built by Team Eleven — a student founding team focused on making repair knowledge accessible to every technician in India.',
  stats_users: 'Active Tech Users',
  stats_cases: 'Repair Cases',
  stats_churn: 'Churn Rate',
  stats_demo: 'Demo Metrics',
  footer_copy: '© 2024 FixMemory · Team Eleven',
  footer_about: 'About',
  clear_data: 'Clear My Data',
  clear_confirm: 'Clear all data?',
  clear_confirm_msg: 'This will delete all your submitted cases and restore the sample records.',
  clear_ok: 'Yes, clear data',
  clear_cancel: 'Cancel',
};

const te: TranslationKeys = {
  nav_home: 'హోమ్',
  nav_log: 'కేసు నమోదు',
  nav_about: 'గురించి',
  nav_lang: 'English',
  hero_headline: 'పరిష్కారం కనుగొనండి. సమయం ఆదా చేయండి.',
  hero_sub: 'మీ పరికరం లక్షణాలకు గతంలో చేసిన మరమ్మతులను కనుగొనే AI-ఆధారిత రిపేర్ గైడ్.',
  hero_placeholder: 'ల్యాప్‌టాప్ సమస్యను వివరించండి...',
  hero_cta: 'పరిష్కారాలు కనుగొనండి',
  hero_log_cta: 'కొత్త కేసు నమోదు చేయండి',
  hero_suggestions_label: 'ఇవి వెతికి చూడండి:',
  recent_title: 'ఇటీవలి మరమ్మతు కేసులు',
  why_title: 'FixMemory ఎందుకు?',
  why1_title: 'పరిమిత వనరులు',
  why1_body: 'చాలా భారతీయ రిపేర్ దుకాణాలు పరిమిత శిక్షణ, సిబ్బంది మరియు విడిభాగాలతో పనిచేస్తాయి.',
  why2_title: 'అధిక భర్తీ ఖర్చులు',
  why2_body: 'అధిక మరమ్మతు ఖర్చులు మరియు విడిభాగాల కొరత మరమ్మతు కంటే భర్తీని ఆకర్షణీయంగా చేస్తాయి.',
  why3_title: 'అనుభవ జ్ఞానం',
  why3_body: 'అధికారిక డాక్యుమెంటేషన్ సరిపోనప్పుడు టెక్నీషియన్లు అనుభవ జ్ఞానంపై ఆధారపడతారు.',
  card_solution: 'పరిష్కారం',
  card_steps: 'తీసుకున్న పరిష్కార చర్యలు',
  card_source_sample: 'నమూనా',
  card_source_tech: 'టెక్నీషియన్ సమర్పించారు',
  card_no_recent: 'ఇంకా మరమ్మతు కేసులు లేవు. మొదటిది నమోదు చేయండి!',
  card_open_case: 'పూర్తి కేసు చూడండి',
  card_close: 'మూసివేయి',
  card_case_id: 'కేసు ID',
  log_headline: 'ఒక మరమ్మతు నిల్వ చేయండి. తదుపరిదాన్ని పరిష్కరించడానికి సహాయం చేయండి.',
  log_sub: 'మీరు ఏమి పరిష్కరించారో నమోదు చేయండి.',
  log_brand: 'పరికరం బ్రాండ్',
  log_model: 'పరికరం మోడల్',
  log_category: 'సమస్య వర్గం',
  log_symptoms: 'లక్షణాలు',
  log_symptoms_ph: 'పరికరం ఏం చేస్తుందో లేదా చేయడం లేదో వివరించండి...',
  log_steps: 'తీసుకున్న పరిష్కార చర్యలు',
  log_steps_ph: 'సమస్యను నిర్ణయించడానికి మీరు ఏమి ప్రయత్నించారు?',
  log_solution: 'అంతిమ పరిష్కారం / చేసిన మరమ్మతు',
  log_solution_ph: 'దేనివల్ల పరిష్కారమైంది?',
  log_submit: 'మరమ్మతు కేసు సేవ్ చేయండి',
  log_saving: 'సేవ్ అవుతోంది...',
  log_success: 'మరమ్మతు కేసు సేవ్ చేయబడింది!',
  log_success_sub: 'మీ సమర్పణ ఇప్పుడు శోధించవచ్చు.',
  log_another: 'మరొక కేసు నమోదు చేయండి',
  log_go_home: 'హోమ్‌కు వెనక్కి',
  log_required: 'ఈ ఫీల్డ్ అవసరం.',
  results_back: 'హోమ్‌కు వెనక్కి',
  results_query: 'శోధన ప్రశ్న',
  results_found: 'సరిపోయే కేసులు దొరికాయి',
  results_none: 'తగిన మరమ్మతు కేసులు దొరకలేదు.',
  results_log_cta: 'దీన్ని కొత్త మరమ్మతు కేసుగా నమోదు చేయండి',
  results_causes: 'సాధ్యమయ్యే కారణాలు',
  results_matches: 'సరిపోయే మరమ్మతు కేసులు',
  results_why: 'ఇది ఎందుకు సరిపోతుందో',
  results_loading: 'మరమ్మతు కేసులు శోధిస్తోంది...',
  results_error: 'శోధించేటప్పుడు ఏదైనా తప్పు జరిగింది.',
  results_retry: 'మళ్ళీ ప్రయత్నించండి',
  results_demo_badge: 'డెమో మ్యాచ్',
  about_headline: 'మరమ్మతు జ్ఞానాన్ని నిల్వ చేయడం. ట్రబుల్‌షూటింగ్‌ను స్మార్ట్‌గా చేయడం.',
  about_sub: 'టెక్నీషియన్ల కోసం, టెక్నీషియన్ల చేత నిర్మించబడింది.',
  about_what_title: 'FixMemory గురించి',
  about_what_body: 'FixMemory టెక్నీషియన్ల కోసం AI-ఆధారిత మరమ్మతు జ్ఞాన స్థావరం. పరికరం లక్షణాలు నమోదు చేయండి; AI గతంలో నమోదు చేసిన మరమ్మతు కేసుల నుండి సరిపోయే పరిష్కారాలను కనుగొంటుంది.',
  about_problem_title: 'సమస్య',
  about_problem_body: 'కంప్యూటర్ మరియు ల్యాప్‌టాప్ మరమ్మతు టెక్నీషియన్లు మళ్ళీ మళ్ళీ అదే సమస్యలను నిర్ణయిస్తారు ఎందుకంటే మరమ్మతు జ్ఞానం వ్యక్తిగత నోట్స్, YouTube, ఫోరమ్‌లు మరియు సంభాషణలలో చెల్లాచెదురుగా ఉంటుంది.',
  about_solution_title: 'మా పరిష్కారం',
  about_solution_body: 'FixMemory మీరు వివరించిన లక్షణాలకు సరిపోయే చారిత్రిక మరమ్మతు కేసులను తిరిగి పొందుతుంది. టెక్నీషియన్లు వారు పరిష్కరించినదాన్ని నమోదు చేస్తారు; AI తదుపరి సారూప్య పరికరం వచ్చినప్పుడు ఆ రికార్డులను కనుగొంటుంది.',
  about_diff_title: 'మేము వేరుగా ఏమిటి',
  about_diff_body: 'FixMemory టెక్నీషియన్-నమోదు చేసిన మరమ్మతు కేసుల శోధించగలిగే, AI-ఆధారిత డేటాబేస్పై దృష్టి పెడుతుంది.',
  about_team_title: 'మా బృందం',
  about_team_body: 'FixMemory Team Eleven చేత నిర్మించబడింది — భారతదేశంలోని ప్రతి టెక్నీషియన్‌కు మరమ్మతు జ్ఞానాన్ని అందుబాటులో ఉంచడంపై దృష్టి పెట్టిన విద్యార్థి వ్యవస్థాపక బృందం.',
  stats_users: 'యాక్టివ్ టెక్ యూజర్లు',
  stats_cases: 'మరమ్మతు కేసులు',
  stats_churn: 'చర్న్ రేట్',
  stats_demo: 'డెమో మెట్రిక్స్',
  footer_copy: '© 2024 FixMemory · Team Eleven',
  footer_about: 'గురించి',
  clear_data: 'నా డేటా క్లియర్ చేయండి',
  clear_confirm: 'అన్ని డేటా క్లియర్ చేయాలా?',
  clear_confirm_msg: 'ఇది మీ నమోదు చేసిన కేసులన్నింటినీ తొలగించి నమూనా రికార్డులను పునరుద్ధరిస్తుంది.',
  clear_ok: 'అవును, క్లియర్ చేయండి',
  clear_cancel: 'రద్దు చేయండి',
};

const translations: Record<Language, TranslationKeys> = { en, te };

export function t(lang: Language, key: keyof TranslationKeys): string {
  return translations[lang][key] ?? key;
}

export type { TranslationKeys };
