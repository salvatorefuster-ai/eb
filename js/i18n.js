/**
 * EscortBenidorm — full tourist UI languages
 * ES EN DE FR NL IT PT NO SV RU PL
 * Language choice is sticky: localStorage + cookie until user changes it.
 */
const I18N = {
  langs: [
    { code: "es", flag: "🇪🇸", name: "Español", short: "ES" },
    { code: "en", flag: "🇬🇧", name: "English", short: "EN" },
    { code: "de", flag: "🇩🇪", name: "Deutsch", short: "DE" },
    { code: "fr", flag: "🇫🇷", name: "Français", short: "FR" },
    { code: "nl", flag: "🇳🇱", name: "Nederlands", short: "NL" },
    { code: "it", flag: "🇮🇹", name: "Italiano", short: "IT" },
    { code: "pt", flag: "🇵🇹", name: "Português", short: "PT" },
    { code: "no", flag: "🇳🇴", name: "Norsk", short: "NO" },
    { code: "sv", flag: "🇸🇪", name: "Svenska", short: "SV" },
    { code: "ru", flag: "🇷🇺", name: "Русский", short: "RU" },
    { code: "pl", flag: "🇵🇱", name: "Polski", short: "PL" },
  ],

  langAliases: {
    ES: "es", EN: "en", DE: "de", FR: "fr", NL: "nl", IT: "it",
    PT: "pt", NO: "no", SV: "sv", RU: "ru", PL: "pl",
    UK: "en", UA: "ru", BR: "pt", BE: "nl", AT: "de", DK: "no", SE: "sv",
  },

  dict: {},
};

const I18N_CODES = ["es", "en", "de", "fr", "nl", "it", "pt", "no", "sv", "ru", "pl"];

/* —— Dictionary: key → { es, en, de, ... } —— */
(function buildDict() {
  const L = (row) => {
    // row: [key, es, en, de, fr, nl, it, pt, no, sv, ru, pl]
    // Missing slots fall back to EN then ES so short rows still work.
    const o = {};
    I18N_CODES.forEach((c, i) => {
      o[c] = row[i + 1] ?? row[2] ?? row[1] ?? "";
    });
    I18N.dict[row[0]] = o;
  };

  // Age gate
  L(["age_title", "Solo mayores de 18", "18+ only", "Nur ab 18", "Réservé aux +18", "Alleen 18+", "Solo +18", "Apenas +18", "Kun 18+", "Endast 18+", "Только 18+", "Tylko 18+"]);
  L(["age_text", "EscortBenidorm es el directorio premium de escorts solo en Benidorm. Perfiles de calidad. Contenido para adultos.", "EscortBenidorm is the premium Benidorm-only escorts directory. Quality profiles. Adult content.", "EscortBenidorm ist das Premium-Escort-Verzeichnis nur für Benidorm. Qualitätsprofile. Inhalt für Erwachsene.", "EscortBenidorm est l’annuaire premium d’escorts uniquement à Benidorm. Profils de qualité. Contenu adulte.", "EscortBenidorm is de premium escorts-gids alleen voor Benidorm. Kwaliteitsprofielen. 18+ content.", "EscortBenidorm è la directory premium di escort solo a Benidorm. Profili di qualità. Contenuti per adulti.", "EscortBenidorm é o diretório premium de escorts só em Benidorm. Perfis de qualidade. Conteúdo adulto.", "EscortBenidorm er premium escortkatalogen bare for Benidorm. Kvalitetsprofiler. Voksent innhold.", "EscortBenidorm är premium escortkatalogen bara för Benidorm. Kvalitetsprofiler. Vuxeninnehåll.", "EscortBenidorm — премиум-каталог эскорта только в Бенидорме. Качественные анкеты. 18+.", "EscortBenidorm to premium katalog escortów tylko w Benidorm. Profile jakościowe. Treści dla dorosłych."]);
  L(["age_yes", "Tengo +18 años", "I am 18+", "Ich bin 18+", "J’ai 18 ans ou plus", "Ik ben 18+", "Ho 18+ anni", "Tenho 18+", "Jeg er 18+", "Jag är 18+", "Мне есть 18", "Mam 18+ lat"]);
  L(["age_no", "Salir", "Leave", "Verlassen", "Quitter", "Verlaten", "Esci", "Sair", "Gå ut", "Lämna", "Выйти", "Wyjdź"]);

  // Nav
  L(["nav_home", "Inicio", "Home", "Start", "Accueil", "Home", "Home", "Início", "Hjem", "Hem", "Главная", "Start"]);
  L(["nav_ads", "Anuncios", "Listings", "Anzeigen", "Annonces", "Advertenties", "Annunci", "Anúncios", "Annonser", "Annonser", "Объявления", "Ogłoszenia"]);
  L(["nav_zones", "Zonas", "Areas", "Gebiete", "Zones", "Wijken", "Zone", "Zonas", "Soner", "Områden", "Районы", "Strefy"]);
  L(["nav_guide", "Guía", "Guide", "Guide", "Guide", "Gids", "Guida", "Guia", "Guide", "Guide", "Гид", "Przewodnik"]);
  L(["nav_publish", "Publicar", "Advertise", "Inserieren", "Publier", "Adverteren", "Pubblica", "Publicar", "Annonser", "Annonsera", "Разместить", "Dodaj"]);
  L(["nav_cta", "Anunciar · 24h", "Advertise · 24h", "Inserieren · 24h", "Annoncer · 24h", "Adverteren · 24h", "Pubblica · 24h", "Anunciar · 24h", "Annonser · 24h", "Annonsera · 24h", "24ч", "Dodaj · 24h"]);

  // Hero unique
  L(["rank_pill", "El lugar seguro para elegir en Benidorm", "The trusted place to choose in Benidorm", "Der sichere Ort für die Wahl in Benidorm", "L’endroit de confiance à Benidorm", "De betrouwbare plek in Benidorm", "Il posto sicuro per scegliere a Benidorm", "O sítio de confiança em Benidorm", "Det trygge valget i Benidorm", "Den trygga platsen i Benidorm", "Надёжный выбор в Бенидорме", "Zaufane miejsce w Benidorm"]);
  L(["hero_h1_a", "Escorts en", "Escorts in", "Escorts in", "Escorts à", "Escorts in", "Escort a", "Escorts em", "Escorts i", "Escorts i", "Эскорт в", "Escorty w"]);
  L(["hero_h1_b", "reales, verificadas, sin sorpresas", "real, verified, no surprises", "echt, geprüft, ohne böse Überraschungen", "réelles, vérifiées, sans mauvaises surprises", "echt, gecontroleerd, geen verrassingen", "reali, verificate, senza sorprese", "reais, verificadas, sem surpresas", "ekte, verifisert, uten overraskelser", "äkta, verifierade, utan överraskningar", "реальные, проверенные, без сюрпризов", "prawdziwe, zweryfikowane, bez niespodzianek"]);
  L(["hero_lead", "El único directorio de Benidorm pensado para que no te sientas estafado: perfiles de calidad superior, datos claros y contacto directo. Discreción y seriedad desde el primer mensaje.", "The only Benidorm directory built so you never feel scammed: superior-quality profiles, clear details and direct contact. Discretion and reliability from the first message.", "Das einzige Benidorm-Verzeichnis, bei dem du dich nicht betrogen fühlst: erstklassige Profile, klare Angaben und direkter Kontakt. Diskret und seriös ab der ersten Nachricht.", "Le seul annuaire de Benidorm conçu pour ne pas te faire arnaquer : profils haut de gamme, infos claires et contact direct. Discrétion et sérieux dès le premier message.", "De enige Benidorm-gids waarbij je je niet opgelicht voelt: topprofielen, duidelijke info en direct contact. Discreet en serieus vanaf het eerste bericht.", "L’unica directory di Benidorm pensata perché non ti senta truffato: profili di alta qualità, dati chiari e contatto diretto. Discrezione e serietà dal primo messaggio.", "O único diretório de Benidorm feito para não te sentires enganado: perfis de qualidade superior, dados claros e contacto direto. Discrição e seriedade desde a primeira mensagem.", "Den eneste Benidorm-katalogen laget for at du ikke skal føle deg lurt: kvalitetsprofiler, tydelig info og direkte kontakt. Diskresjon og seriøsitet fra første melding.", "Den enda Benidorm-katalogen där du inte ska känna dig lurad: premiumprofiler, tydlig info och direktkontakt. Diskretion och seriositet från första meddelandet.", "Единственный каталог Бенидорма, где вас не обманут: анкеты высшего уровня, понятные данные и прямой контакт. Дискретность и надёжность с первого сообщения.", "Jedyny katalog Benidorm, w którym nie poczujesz się oszukany: profile najwyższej jakości, jasne dane i bezpośredni kontakt. Dyskrecja i powaga od pierwszej wiadomości."]);
  L(["search_zone", "Todas las zonas", "All areas", "Alle Gebiete", "Toutes les zones", "Alle wijken", "Tutte le zone", "Todas as zonas", "Alle soner", "Alla områden", "Все районы", "Wszystkie strefy"]);
  L(["search_ph", "Nombre, nacionalidad…", "Name, nationality…", "Name, Nationalität…", "Nom, nationalité…", "Naam, nationaliteit…", "Nome, nazionalità…", "Nome, nacionalidade…", "Navn, nasjonalitet…", "Namn, nationalitet…", "Имя, национальность…", "Imię, narodowość…"]);
  L(["search_btn", "Buscar en Benidorm", "Search Benidorm", "Benidorm suchen", "Chercher à Benidorm", "Zoek Benidorm", "Cerca a Benidorm", "Pesquisar Benidorm", "Søk Benidorm", "Sök Benidorm", "Искать в Бенидорме", "Szukaj Benidorm"]);
  L(["cta_all", "Ver todos los anuncios", "View all listings", "Alle Anzeigen", "Voir toutes les annonces", "Alle advertenties", "Vedi tutti gli annunci", "Ver todos os anúncios", "Se alle annonser", "Se alla annonser", "Все объявления", "Wszystkie ogłoszenia"]);
  L(["cta_adv", "Soy anunciante →", "I'm an advertiser →", "Ich inseriere →", "Je suis annonceuse →", "Ik adverteer →", "Sono un’inserzionista →", "Sou anunciante →", "Jeg annonserer →", "Jag annonserar →", "Я рекламодатель →", "Jestem reklamodawcą →"]);

  // Stats
  L(["stat_ads", "Anuncios", "Listings", "Anzeigen", "Annonces", "Ads", "Annunci", "Anúncios", "Annonser", "Annonser", "Объявления", "Ogłoszenia"]);
  L(["stat_online", "En línea", "Online", "Online", "En ligne", "Online", "Online", "Online", "Pålogget", "Online", "Онлайн", "Online"]);
  L(["stat_zones", "Zonas", "Areas", "Gebiete", "Zones", "Wijken", "Zone", "Zonas", "Soner", "Områden", "Районы", "Strefy"]);
  L(["stat_langs", "Idiomas UI", "UI languages", "UI-Sprachen", "Langues UI", "UI-talen", "Lingue UI", "Idiomas UI", "UI-språk", "UI-språk", "Языки UI", "Języki UI"]);

  // Trust
  L(["trust_niche", "Solo Benidorm", "Benidorm only", "Nur Benidorm", "100% Benidorm", "Alleen Benidorm", "Solo Benidorm", "Só Benidorm", "Bare Benidorm", "Bara Benidorm", "Только Бенидорм", "Tylko Benidorm"]);
  L(["trust_niche_s", "Cero otras ciudades", "Zero other cities", "Keine anderen Städte", "Aucune autre ville", "Geen andere steden", "Nessun’altra città", "Zero outras cidades", "Ingen andre byer", "Inga andra städer", "Без других городов", "Zero innych miast"]);
  L(["trust_lang", "Calidad superior", "Superior quality", "Höchste Qualität", "Qualité supérieure", "Topkwaliteit", "Qualità superiore", "Qualidade superior", "Overlegen kvalitet", "Överlägsen kvalitet", "Высшее качество", "Najwyższa jakość"]);
  L(["trust_lang_s", "Perfiles seleccionados", "Curated profiles", "Ausgewählte Profile", "Profils sélectionnés", "Geselecteerde profielen", "Profili selezionati", "Perfis selecionados", "Utvalgte profiler", "Utvalda profiler", "Отобранные анкеты", "Wybrane profile"]);
  L(["trust_wa", "WhatsApp directo", "Direct WhatsApp", "Direkt WhatsApp", "WhatsApp direct", "Direct WhatsApp", "WhatsApp diretto", "WhatsApp direto", "Direkte WhatsApp", "Direkt WhatsApp", "Прямой WhatsApp", "Bezpośredni WhatsApp"]);
  L(["trust_wa_s", "Sin intermediarios", "No middlemen", "Ohne Vermittler", "Sans intermédiaire", "Geen tussenpersoon", "Senza intermediari", "Sem intermediários", "Uten mellomledd", "Inga mellanhänder", "Без посредников", "Bez pośredników"]);
  L(["trust_zone", "Sin estafas", "No scams", "Kein Betrug", "Sans arnaque", "Geen oplichting", "Senza truffe", "Sem burla", "Ingen svindel", "Inga bluffar", "Без обмана", "Bez oszustw"]);
  L(["trust_zone_s", "Datos claros y reales", "Clear, real details", "Klare, echte Angaben", "Infos claires et réelles", "Duidelijke, echte info", "Dati chiari e reali", "Dados claros e reais", "Tydelig, ekte info", "Tydlig, äkta info", "Понятные реальные данные", "Jasne, prawdziwe dane"]);

  // Sections
  L(["feat_title", "Destacadas en Benidorm", "Featured in Benidorm", "Highlights in Benidorm", "À la une à Benidorm", "Uitgelicht in Benidorm", "In evidenza a Benidorm", "Destaques em Benidorm", "Utvalgte i Benidorm", "Utvalda i Benidorm", "Избранное в Бенидорме", "Polecane w Benidorm"]);
  L(["feat_sub", "VIP · verificadas · en línea ahora", "VIP · verified · online now", "VIP · geprüft · jetzt online", "VIP · vérifiées · en ligne", "VIP · gecontroleerd · nu online", "VIP · verificate · online ora", "VIP · verificadas · online agora", "VIP · verifisert · online nå", "VIP · verifierade · online nu", "VIP · проверенные · онлайн", "VIP · zweryfikowane · online teraz"]);
  L(["see_all", "Ver listado completo →", "Full list →", "Alle anzeigen →", "Liste complète →", "Volledige lijst →", "Elenco completo →", "Lista completa →", "Full liste →", "Full lista →", "Весь список →", "Pełna lista →"]);
  L(["zones_title", "Escorts por zona en Benidorm", "Escorts by Benidorm area", "Escorts nach Gebiet", "Escorts par zone", "Escorts per wijk", "Escort per zona", "Escorts por zona", "Escorts etter sone", "Escorts per område", "Эскорт по районам", "Escorty według strefy"]);
  L(["zones_sub", "Elige la playa o barrio de tu hotel", "Pick the beach or area near your hotel", "Wähle Strand oder Viertel deines Hotels", "Choisis la plage ou le quartier de ton hôtel", "Kies het strand of de wijk bij je hotel", "Scegli spiaggia o zona del tuo hotel", "Escolhe a praia ou zona do teu hotel", "Velg strand eller sone nær hotellet", "Välj strand eller område nära hotellet", "Выбери пляж или район отеля", "Wybierz plażę lub strefę hotelu"]);
  L(["how_title", "Cómo funciona", "How it works", "So funktioniert’s", "Comment ça marche", "Hoe het werkt", "Come funziona", "Como funciona", "Slik fungerer det", "Så fungerar det", "Как это работает", "Jak to działa"]);
  L(["how_sub", "3 pasos. Claro, discreto, sin líos", "3 steps. Clear, discreet, no drama", "3 Schritte. Klar, diskret, ohne Stress", "3 étapes. Clair, discret, sans prise de tête", "3 stappen. Duidelijk, discreet, zonder gedoe", "3 passi. Chiaro, discreto, senza stress", "3 passos. Claro, discreto, sem stress", "3 steg. Tydelig, diskret, uten stress", "3 steg. Tydligt, diskret, utan krångel", "3 шага. Понятно, дискретно, без нервов", "3 kroki. Jasno, dyskretnie, bez stresu"]);
  L(["step1_t", "Elige zona en Benidorm", "Choose your Benidorm area", "Gebiet in Benidorm wählen", "Choisir la zone à Benidorm", "Kies je wijk in Benidorm", "Scegli la zona a Benidorm", "Escolhe a zona em Benidorm", "Velg sone i Benidorm", "Välj område i Benidorm", "Выбери район Бенидорма", "Wybierz strefę w Benidorm"]);
  L(["step1_p", "Levante, Poniente, Rincón de Loix… filtra cerca de tu hotel y evita desplazamientos innecesarios.", "Levante, Poniente, Rincón de Loix… filter near your hotel and avoid wasted trips.", "Levante, Poniente, Rincón de Loix… filtere nahe deinem Hotel und spare unnötige Wege.", "Levante, Poniente, Rincón de Loix… filtre près de ton hôtel et évite les déplacements inutiles.", "Levante, Poniente, Rincón de Loix… filter bij je hotel en vermijd onnodige trips.", "Levante, Poniente, Rincón de Loix… filtra vicino al tuo hotel ed evita spostamenti inutili.", "Levante, Poniente, Rincón de Loix… filtra perto do hotel e evita deslocações desnecessárias.", "Levante, Poniente, Rincón de Loix… filtrer nær hotellet og unngå unødvendige turer.", "Levante, Poniente, Rincón de Loix… filtrera nära hotellet och undvik onödiga resor.", "Levante, Poniente, Rincón de Loix… фильтр рядом с отелем без лишних поездок.", "Levante, Poniente, Rincón de Loix… filtruj blisko hotelu i unikaj zbędnych dojazdów."]);
  L(["step2_t", "Revisa la ficha con calma", "Review the profile calmly", "Profil in Ruhe prüfen", "Vérifie le profil tranquillement", "Bekijk het profiel rustig", "Controlla la scheda con calma", "Revisa o perfil com calma", "Se gjennom profilen i ro", "Granska profilen i lugn och ro", "Спокойно изучи анкету", "Sprawdź profil na spokojnie"]);
  L(["step2_p", "Tarifa, zona, idiomas y servicios a la vista. Sin letra pequeña ni anuncios confusos.", "Rate, area, languages and services in plain sight. No fine print, no confusing ads.", "Tarif, Gebiet, Sprachen und Services klar sichtbar. Kein Kleingedrucktes, keine verwirrenden Anzeigen.", "Tarif, zone, langues et services bien visibles. Pas de petits caractères ni d’annonces floues.", "Tarief, wijk, talen en diensten duidelijk. Geen kleine lettertjes, geen vage ads.", "Tariffa, zona, lingue e servizi in chiaro. Niente clausole nascoste né annunci confusi.", "Tarifa, zona, idiomas e serviços à vista. Sem letra pequena nem anúncios confusos.", "Pris, sone, språk og tjenester synlig. Ingen liten skrift, ingen uklare annonser.", "Pris, område, språk och tjänster synliga. Ingen finstilt, inga oklara annonser.", "Тариф, район, языки и услуги на виду. Без мелкого шрифта и путаных объявлений.", "Cena, strefa, języki i usługi na wierzchu. Bez drobnego druku i mylących ogłoszeń."]);
  L(["step3_t", "Contacto directo por WhatsApp", "Direct WhatsApp contact", "Direkter WhatsApp-Kontakt", "Contact WhatsApp direct", "Direct WhatsApp-contact", "Contatto diretto WhatsApp", "Contacto direto por WhatsApp", "Direkte WhatsApp-kontakt", "Direkt WhatsApp-kontakt", "Прямой контакт WhatsApp", "Bezpośredni kontakt WhatsApp"]);
  L(["step3_p", "Hablas tú con ella. Nosotros no intermediamos ni escondemos el número detrás de pagos raros.", "You talk to her directly. We don’t middleman or hide the number behind odd paywalls.", "Du sprichst direkt mit ihr. Wir vermitteln nicht und verstecken keine Nummer hinter seltsamen Paywalls.", "Tu parles directement avec elle. Pas d’intermédiaire ni de numéro caché derrière des paiements bizarres.", "Jij praat rechtstreeks met haar. Wij bemiddelen niet en verstoppen geen nummer achter rare paywalls.", "Parli direttamente con lei. Niente intermediari né numeri nascosti dietro pagamenti strani.", "Falas tu diretamente com ela. Não intermediamos nem escondemos o número atrás de pagamentos estranhos.", "Du snakker direkte med henne. Vi er ikke mellomledd og skjuler ikke nummer bak rare betalinger.", "Du pratar direkt med henne. Vi förmedlar inte och gömmer inte numret bakom konstiga betalväggar.", "Вы говорите с ней напрямую. Мы не посредники и не прячем номер за странными оплатами.", "Rozmawiasz z nią bezpośrednio. Nie pośredniczymy i nie chowamy numeru za dziwnymi płatnościami."]);

  L(["unique_title", "Por qué aquí no te sientes estafado", "Why you won’t feel scammed here", "Warum du dich hier nicht betrogen fühlst", "Pourquoi tu ne te sentiras pas arnaqué ici", "Waarom je je hier niet opgelicht voelt", "Perché qui non ti senti truffato", "Porque aqui não te sentes enganado", "Hvorfor du ikke føler deg lurt her", "Varför du inte känner dig lurad här", "Почему здесь вас не обманут", "Dlaczego tutaj nie poczujesz się oszukany"]);
  L(["unique_sub", "Calidad, claridad y seriedad: lo que los portales genéricos no controlan", "Quality, clarity and reliability — what generic portals don’t control", "Qualität, Klarheit und Seriosität — was generische Portale nicht prüfen", "Qualité, clarté et sérieux — ce que les portails génériques ne contrôlent pas", "Kwaliteit, duidelijkheid en serieux — wat generieke portals niet controleren", "Qualità, chiarezza e serietà — ciò che i portali generici non controllano", "Qualidade, clareza e seriedade — o que os portais genéricos não controlam", "Kvalitet, tydelighet og seriositet — det generiske portaler ikke sjekker", "Kvalitet, tydlighet och seriositet — det generiska portaler inte kontrollerar", "Качество, прозрачность и надёжность — то, что общие порталы не контролируют", "Jakość, jasność i rzetelność — czego generyczne portale nie kontrolują"]);

  L(["cmp_feat", "Ventaja", "Advantage", "Vorteil", "Avantage", "Voordeel", "Vantaggio", "Vantagem", "Fordel", "Fördel", "Преимущество", "Zaleta"]);
  L(["cmp_us", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm", "EscortBenidorm"]);
  L(["cmp_others", "Portales genéricos", "Generic portals", "Generische Portale", "Portails génériques", "Generieke portals", "Portali generici", "Portais genéricos", "Generiske portaler", "Generiska portaler", "Общие порталы", "Portale generyczne"]);
  L(["cmp_r1", "Solo Benidorm", "Benidorm only", "Nur Benidorm", "100% Benidorm", "Alleen Benidorm", "Solo Benidorm", "Só Benidorm", "Bare Benidorm", "Bara Benidorm", "Только Бенидорм", "Tylko Benidorm"]);
  L(["cmp_r1y", "✓ Sí", "✓ Yes", "✓ Ja", "✓ Oui", "✓ Ja", "✓ Sì", "✓ Sim", "✓ Ja", "✓ Ja", "✓ Да", "✓ Tak"]);
  L(["cmp_r1n", "Mezclan 50+ ciudades", "Mix 50+ cities", "50+ Städte gemischt", "50+ villes mélangées", "50+ steden gemengd", "50+ città mescolate", "Misturam 50+ cidades", "Blander 50+ byer", "Blandar 50+ städer", "Смешивают 50+ городов", "Mieszają 50+ miast"]);
  L(["cmp_r2", "Enfoque en calidad", "Quality-first curation", "Fokus auf Qualität", "Priorité qualité", "Kwaliteit eerst", "Focus sulla qualità", "Foco na qualidade", "Fokus på kvalitet", "Fokus på kvalitet", "Фокус на качестве", "Nacisk na jakość"]);
  L(["cmp_r2y", "✓ Perfiles premium", "✓ Premium profiles", "✓ Premium-Profile", "✓ Profils premium", "✓ Premium profielen", "✓ Profili premium", "✓ Perfis premium", "✓ Premiumprofiler", "✓ Premiumprofiler", "✓ Премиум-анкеты", "✓ Profile premium"]);
  L(["cmp_r2n", "Cantidad sin filtro", "Quantity over quality", "Menge ohne Filter", "Quantité sans filtre", "Kwantiteit zonder filter", "Quantità senza filtro", "Quantidade sem filtro", "Mengde uten filter", "Kvantitet utan filter", "Количество без отбора", "Ilość bez filtra"]);
  L(["cmp_r3", "Menos riesgo de engaño", "Lower scam risk", "Weniger Betrugsrisiko", "Moins d’arnaques", "Minder oplichting", "Meno rischi di truffa", "Menos risco de burla", "Lavere svindelrisiko", "Lägre bluffrisk", "Меньше риска обмана", "Mniejsze ryzyko oszustwa"]);
  L(["cmp_r3y", "✓ Datos claros + contacto", "✓ Clear details + contact", "✓ Klare Daten + Kontakt", "✓ Infos claires + contact", "✓ Duidelijke info + contact", "✓ Dati chiari + contatto", "✓ Dados claros + contacto", "✓ Tydelig info + kontakt", "✓ Tydlig info + kontakt", "✓ Понятные данные + контакт", "✓ Jasne dane + kontakt"]);
  L(["cmp_r3n", "Anuncios opacos", "Opaque ads", "Undurchsichtige Anzeigen", "Annonces floues", "Onduidelijke ads", "Annunci opachi", "Anúncios opacos", "Uklare annonser", "Oklara annonser", "Непрозрачные объявления", "Niejasne ogłoszenia"]);
  L(["cmp_r4", "Solo Benidorm, zona a zona", "Benidorm area by area", "Benidorm Viertel für Viertel", "Benidorm quartier par quartier", "Benidorm wijk per wijk", "Benidorm zona per zona", "Benidorm zona a zona", "Benidorm sone for sone", "Benidorm område för område", "Бенидорм район за районом", "Benidorm strefa po strefie"]);
  L(["cmp_r4y", "✓ 6 zonas reales", "✓ 6 real areas", "✓ 6 echte Gebiete", "✓ 6 zones réelles", "✓ 6 echte wijken", "✓ 6 zone reali", "✓ 6 zonas reais", "✓ 6 ekte soner", "✓ 6 riktiga områden", "✓ 6 реальных районов", "✓ 6 prawdziwych stref"]);
  L(["cmp_r4n", "Listado genérico", "Generic list", "Generische Liste", "Liste générique", "Generieke lijst", "Elenco generico", "Lista genérica", "Generisk liste", "Generisk lista", "Общий список", "Ogólna lista"]);

  L(["langbar_title", "Idiomas de turistas en Benidorm", "Tourist languages in Benidorm", "Touristensprachen in Benidorm", "Langues des touristes à Benidorm", "Toeristentalen in Benidorm", "Lingue dei turisti a Benidorm", "Idiomas de turistas em Benidorm", "Turistspråk i Benidorm", "Turistspråk i Benidorm", "Языки туристов в Бенидорме", "Języki turystów w Benidorm"]);
  L(["langbar_sub", "Cambia la web entera · filtra anuncios que hablan tu lengua", "Switch the whole site · filter ads that speak your tongue", "Ganze Seite wechseln · Anzeigen nach Sprache filtern", "Change tout le site · filtre les annonces par langue", "Hele site wisselen · filter ads op taal", "Cambia tutto il sito · filtra annunci per lingua", "Muda o site inteiro · filtra anúncios por idioma", "Bytt hele siden · filtrer annonser på språk", "Byt hela sajten · filtrera annonser på språk", "Переключи весь сайт · фильтр по языку анкет", "Zmień całą stronę · filtruj ogłoszenia po języku"]);
  L(["speak_filter", "Habla mi idioma", "Speaks my language", "Spricht meine Sprache", "Parle ma langue", "Spreekt mijn taal", "Parla la mia lingua", "Fala o meu idioma", "Snakker mitt språk", "Talar mitt språk", "Говорит на моём языке", "Mówi moim językiem"]);
  L(["speak_badge", "Habla tu idioma", "Speaks your language", "Spricht deine Sprache", "Parle ta langue", "Spreekt jouw taal", "Parla la tua lingua", "Fala o teu idioma", "Snakker ditt språk", "Talar ditt språk", "Говорит на твоём", "Mówi twoim"]);
  // speak_filter kept as utility filter label (secondary UX, not main brand)
  L(["loading", "Cargando…", "Loading…", "Laden…", "Chargement…", "Laden…", "Caricamento…", "A carregar…", "Laster…", "Laddar…", "Загрузка…", "Ładowanie…"]);
  L(["no_results", "No hay anuncios con esos filtros en Benidorm.", "No listings match these filters in Benidorm.", "Keine Anzeigen mit diesen Filtern in Benidorm.", "Aucune annonce avec ces filtres à Benidorm.", "Geen ads met deze filters in Benidorm.", "Nessun annuncio con questi filtri a Benidorm.", "Sem anúncios com esses filtros em Benidorm.", "Ingen annonser med disse filtrene i Benidorm.", "Inga annonser med dessa filter i Benidorm.", "Нет объявлений с этими фильтрами в Бенидорме.", "Brak ogłoszeń z tymi filtrami w Benidorm."]);
  L(["clear_filters", "Quitar filtros", "Clear filters", "Filter zurücksetzen", "Effacer les filtres", "Filters wissen", "Azzera filtri", "Limpar filtros", "Nullstill filtre", "Rensa filter", "Сбросить фильтры", "Wyczyść filtry"]);
  L(["view_profile", "Ver ficha", "View", "Profil", "Voir", "Bekijk", "Scheda", "Ver", "Se", "Visa", "Смотреть", "Zobacz"]);
  L(["online_now", "En línea", "Online", "Online", "En ligne", "Online", "Online", "Online", "Online", "Online", "Онлайн", "Online"]);
  L(["offline", "Ahora no", "Away", "Offline", "Hors ligne", "Offline", "Offline", "Offline", "Offline", "Offline", "Не в сети", "Offline"]);
  L(["new_tag", "Nueva", "New", "Neu", "Nouvelle", "Nieuw", "Nuova", "Nova", "Ny", "Ny", "Новая", "Nowa"]);
  L(["hour", "hora", "hr", "Std.", "h", "uur", "ora", "hora", "t", "tim", "час", "godz."]);
  L(["results", "anuncios en Benidorm", "listings in Benidorm", "Anzeigen in Benidorm", "annonces à Benidorm", "ads in Benidorm", "annunci a Benidorm", "anúncios em Benidorm", "annonser i Benidorm", "annonser i Benidorm", "объявлений в Бенидорме", "ogłoszeń w Benidorm"]);
  L(["sort_feat", "Destacadas primero", "Featured first", "Highlights zuerst", "À la une d’abord", "Uitgelicht eerst", "In evidenza prima", "Destaques primeiro", "Utvalgte først", "Utvalda först", "Сначала избранные", "Polecane najpierw"]);
  L(["sort_online", "En línea primero", "Online first", "Online zuerst", "En ligne d’abord", "Online eerst", "Online prima", "Online primeiro", "Online først", "Online först", "Сначала онлайн", "Online najpierw"]);
  L(["sort_new", "Más nuevas", "Newest", "Neueste", "Plus récentes", "Nieuwste", "Più nuove", "Mais novas", "Nyeste", "Nyaste", "Новые", "Najnowsze"]);
  L(["sort_price_asc", "Precio ↑", "Price ↑", "Preis ↑", "Prix ↑", "Prijs ↑", "Prezzo ↑", "Preço ↑", "Pris ↑", "Pris ↑", "Цена ↑", "Cena ↑"]);
  L(["sort_price_desc", "Precio ↓", "Price ↓", "Preis ↓", "Prix ↓", "Prijs ↓", "Prezzo ↓", "Preço ↓", "Pris ↓", "Pris ↓", "Цена ↓", "Cena ↓"]);
  L(["any_price", "Cualquier precio", "Any price", "Jeder Preis", "Tous prix", "Elke prijs", "Qualsiasi prezzo", "Qualquer preço", "Enhver pris", "Valfritt pris", "Любая цена", "Dowolna cena"]);
  L(["only_online", "Solo en línea ahora", "Online now only", "Nur jetzt online", "En ligne seulement", "Alleen nu online", "Solo online ora", "Só online agora", "Bare online nå", "Bara online nu", "Только онлайн сейчас", "Tylko online teraz"]);
  L(["filter_lang", "Idioma del anuncio", "Listing language", "Anzeigensprache", "Langue de l’annonce", "Taal van de ad", "Lingua annuncio", "Idioma do anúncio", "Annonse-språk", "Annons-språk", "Язык анкеты", "Język ogłoszenia"]);
  L(["all_langs", "Cualquier idioma", "Any language", "Jede Sprache", "Toute langue", "Elke taal", "Qualsiasi lingua", "Qualquer idioma", "Ethvert språk", "Valfritt språk", "Любой язык", "Dowolny język"]);
  L(["listings_h1", "Anuncios de escorts en Benidorm", "Escort listings in Benidorm", "Escort-Anzeigen in Benidorm", "Annonces d’escorts à Benidorm", "Escort-ads in Benidorm", "Annunci escort a Benidorm", "Anúncios de escorts em Benidorm", "Escort-annonser i Benidorm", "Escortannonser i Benidorm", "Объявления эскорта в Бенидорме", "Ogłoszenia escort w Benidorm"]);
  L(["listings_lead", "Filtra por zona del hotel, precio e idioma. Solo Benidorm.", "Filter by hotel area, price and language. Benidorm only.", "Filter nach Hotelgebiet, Preis und Sprache. Nur Benidorm.", "Filtre par zone d’hôtel, prix et langue. Uniquement Benidorm.", "Filter op hotelwijk, prijs en taal. Alleen Benidorm.", "Filtra per zona hotel, prezzo e lingua. Solo Benidorm.", "Filtra por zona do hotel, preço e idioma. Só Benidorm.", "Filtrer på hotellsone, pris og språk. Bare Benidorm.", "Filtrera på hotellområde, pris och språk. Bara Benidorm.", "Фильтр по району отеля, цене и языку. Только Бенидорм.", "Filtruj strefę hotelu, cenę i język. Tylko Benidorm."]);
  L(["publish_title", "Publicar anuncio en Benidorm", "Advertise in Benidorm", "In Benidorm inserieren", "Publier à Benidorm", "Adverteren in Benidorm", "Pubblica a Benidorm", "Publicar em Benidorm", "Annonser i Benidorm", "Annonsera i Benidorm", "Разместить в Бенидорме", "Dodaj w Benidorm"]);
  L(["wa_msg", "Hola {name}, te escribo desde EscortBenidorm. Estoy en Benidorm.", "Hi {name}, I found you on EscortBenidorm. I'm in Benidorm.", "Hallo {name}, ich schreibe über EscortBenidorm. Ich bin in Benidorm.", "Salut {name}, je t’écris via EscortBenidorm. Je suis à Benidorm.", "Hoi {name}, ik schrijf via EscortBenidorm. Ik ben in Benidorm.", "Ciao {name}, ti scrivo da EscortBenidorm. Sono a Benidorm.", "Olá {name}, escrevo pelo EscortBenidorm. Estou em Benidorm.", "Hei {name}, jeg skriver via EscortBenidorm. Jeg er i Benidorm.", "Hej {name}, jag skriver via EscortBenidorm. Jag är i Benidorm.", "Привет, {name}! Пишу через EscortBenidorm. Я в Бенидорме.", "Cześć {name}, piszę z EscortBenidorm. Jestem w Benidorm."]);
  L(["more_in", "Más en", "More in", "Mehr in", "Plus dans", "Meer in", "Altro a", "Mais em", "Mer i", "Mer i", "Ещё в", "Więcej w"]);
  L(["area", "Zona", "Area", "Gebiet", "Zone", "Wijk", "Zona", "Zona", "Sone", "Område", "Район", "Strefa"]);
  L(["height", "Altura", "Height", "Größe", "Taille", "Lengte", "Altezza", "Altura", "Høyde", "Längd", "Рост", "Wzrost"]);
  L(["languages", "Idiomas", "Languages", "Sprachen", "Langues", "Talen", "Lingue", "Idiomas", "Språk", "Språk", "Языки", "Języki"]);
  L(["rate", "Tarifa", "Rate", "Tarif", "Tarif", "Tarief", "Tariffa", "Tarifa", "Pris", "Pris", "Тариф", "Cena"]);
  L(["services", "Servicios", "Services", "Services", "Services", "Diensten", "Servizi", "Serviços", "Tjenester", "Tjänster", "Услуги", "Usługi"]);
  L(["call", "Llamar", "Call", "Anrufen", "Appeler", "Bellen", "Chiama", "Ligar", "Ring", "Ring", "Позвонить", "Zadzwoń"]);
  L(["views", "visitas", "views", "Aufrufe", "vues", "weergaven", "visualizzazioni", "visitas", "visninger", "visningar", "просмотров", "wyświetleń"]);
  L(["seo_block_title", "Escorts en Benidorm: calidad, confianza y sin complicaciones", "Escorts in Benidorm: quality, trust and no hassle", "Escorts in Benidorm: Qualität, Vertrauen, ohne Stress", "Escorts à Benidorm : qualité, confiance, sans complications", "Escorts in Benidorm: kwaliteit, vertrouwen, zonder gedoe", "Escort a Benidorm: qualità, fiducia, senza problemi", "Escorts em Benidorm: qualidade, confiança e sem complicações", "Escorts i Benidorm: kvalitet, tillit og uten stress", "Escorts i Benidorm: kvalitet, förtroende och utan krångel", "Эскорт в Бенидорме: качество, доверие, без проблем", "Escorty w Benidorm: jakość, zaufanie, bez problemów"]);
  L(["seo_block_p", "Si buscas escorts en Benidorm, mereces un listado serio: perfiles de nivel, zona clara (Levante, Poniente, Rincón de Loix…) y contacto directo. EscortBenidorm no es un tablón caótico de toda España: es el directorio local donde priorizamos calidad y transparencia para que la experiencia sea limpia, discreta y sin malos ratos.", "If you’re looking for escorts in Benidorm, you deserve a serious listing: high-standard profiles, clear areas (Levante, Poniente, Rincón de Loix…) and direct contact. EscortBenidorm isn’t a chaotic Spain-wide board — it’s the local directory that puts quality and transparency first so your experience stays clean, discreet and free of bad surprises.", "Wer Escorts in Benidorm sucht, verdient ein seriöses Verzeichnis: Profile auf hohem Niveau, klare Gebiete (Levante, Poniente, Rincón de Loix…) und direkter Kontakt. EscortBenidorm ist kein chaotisches Spanien-Brett — sondern das lokale Verzeichnis mit Fokus auf Qualität und Transparenz.", "Si tu cherches des escorts à Benidorm, tu mérites un annuaire sérieux : profils haut de gamme, zones claires (Levante, Poniente, Rincón de Loix…) et contact direct. EscortBenidorm n’est pas un tableau chaotique de toute l’Espagne — c’est l’annuaire local qui privilégie qualité et transparence.", "Zoek je escorts in Benidorm, dan verdien je een serieuze gids: profielen van niveau, duidelijke wijken (Levante, Poniente, Rincón de Loix…) en direct contact. EscortBenidorm is geen chaotisch Spanje-breed bord — het is de lokale gids met kwaliteit en transparantie voorop.", "Se cerchi escort a Benidorm, meriti un elenco serio: profili di alto livello, zone chiare (Levante, Poniente, Rincón de Loix…) e contatto diretto. EscortBenidorm non è un bacheca caotica di tutta la Spagna: è la directory locale che mette qualità e trasparenza al primo posto.", "Se procuras escorts em Benidorm, mereces um diretório sério: perfis de nível, zonas claras (Levante, Poniente, Rincón de Loix…) e contacto direto. EscortBenidorm não é um mural caótico de toda a Espanha — é o diretório local que prioriza qualidade e transparência.", "Hvis du leter etter escorts i Benidorm, fortjener du en seriøs katalog: profiler på høyt nivå, tydelige soner (Levante, Poniente, Rincón de Loix…) og direkte kontakt. EscortBenidorm er ikke et kaotisk Spania-brett — det er den lokale katalogen med kvalitet og åpenhet først.", "Letar du efter escorts i Benidorm förtjänar du en seriös katalog: profiler av hög klass, tydliga områden (Levante, Poniente, Rincón de Loix…) och direktkontakt. EscortBenidorm är inte en kaotisk Spanien-tavla — det är den lokala katalogen med kvalitet och transparens först.", "Если вы ищете эскорт в Бенидорме, вам нужен серьёзный каталог: анкеты высокого уровня, понятные районы (Levante, Poniente, Rincón de Loix…) и прямой контакт. EscortBenidorm — не хаотичная доска всей Испании, а локальный каталог с приоритетом качества и прозрачности.", "Szukając escort w Benidorm, zasługujesz na poważny katalog: profile na wysokim poziomie, jasne strefy (Levante, Poniente, Rincón de Loix…) i bezpośredni kontakt. EscortBenidorm to nie chaotyczna tablica całej Hiszpanii — to lokalny katalog z jakością i przejrzystością na pierwszym miejscu."]);
  L(["faq_title", "Preguntas frecuentes", "FAQ", "FAQ", "FAQ", "FAQ", "FAQ", "FAQ", "FAQ", "FAQ", "FAQ", "FAQ"]);
  L(["faq1_q", "¿La web está en mi idioma?", "Is the site in my language?", "Ist die Seite in meiner Sprache?", "Le site est-il dans ma langue ?", "Is de site in mijn taal?", "Il sito è nella mia lingua?", "O site está no meu idioma?", "Er siden på mitt språk?", "Är sajten på mitt språk?", "Сайт на моём языке?", "Czy strona jest w moim języku?"]);
  L(["faq1_a", "Sí. La web está en español e inglés. Se guarda tu preferencia en este dispositivo.", "Yes. The site is in Spanish and English. Your choice is saved on this device."]);
  L(["faq2_q", "¿Solo hay anuncios de Benidorm?", "Only Benidorm listings?", "Nur Anzeigen aus Benidorm?", "Uniquement Benidorm ?", "Alleen Benidorm?", "Solo annunci di Benidorm?", "Só anúncios de Benidorm?", "Bare annonser fra Benidorm?", "Bara annonser från Benidorm?", "Только объявления из Бенидорма?", "Tylko ogłoszenia z Benidorm?"]);
  L(["faq2_a", "Sí. No publicamos otras ciudades. Eso nos hace únicos frente a portales nacionales.", "Yes. We don’t list other cities. That’s what makes us unique vs national portals.", "Ja. Keine anderen Städte. Das macht uns einzigartig gegenüber nationalen Portalen.", "Oui. Pas d’autres villes. C’est ce qui nous rend uniques face aux portails nationaux.", "Ja. Geen andere steden. Daardoor zijn we uniek t.o.v. nationale portals.", "Sì. Nessun’altra città. Ecco perché siamo unici rispetto ai portali nazionali.", "Sim. Sem outras cidades. É o que nos torna únicos face a portais nacionais.", "Ja. Ingen andre byer. Det gjør oss unike mot nasjonale portaler.", "Ja. Inga andra städer. Det gör oss unika mot nationella portaler.", "Да. Без других городов. Поэтому мы уникальны на фоне национальных порталов.", "Tak. Bez innych miast. To czyni nas wyjątkowymi wobec portali krajowych."]);
  L(["faq3_q", "¿Cómo filtro quien habla mi idioma?", "How do I filter who speaks my language?", "Wie filtere ich nach meiner Sprache?", "Comment filtrer qui parle ma langue ?", "Hoe filter ik op mijn taal?", "Come filtro chi parla la mia lingua?", "Como filtro quem fala o meu idioma?", "Hvordan filtrerer jeg på mitt språk?", "Hur filtrerar jag på mitt språk?", "Как отфильтровать мой язык?", "Jak filtrować mój język?"]);
  L(["faq3_a", "Activa «Habla mi idioma» o elige un idioma en el filtro. Verás el badge SpeaksMatch en las fichas.", "Turn on “Speaks my language” or pick a language filter. You’ll see the SpeaksMatch badge on cards.", "Aktiviere „Spricht meine Sprache“ oder wähle einen Sprachfilter. Du siehst das SpeaksMatch-Badge.", "Active « Parle ma langue » ou choisis une langue. Tu verras le badge SpeaksMatch.", "Zet «Spreekt mijn taal» aan of kies een taalfilter. Je ziet de SpeaksMatch-badge.", "Attiva «Parla la mia lingua» o scegli una lingua. Vedrai il badge SpeaksMatch.", "Ativa «Fala o meu idioma» ou escolhe um idioma. Vês o badge SpeaksMatch.", "Slå på «Snakker mitt språk» eller velg språkfilter. Du ser SpeaksMatch-badge.", "Slå på «Talar mitt språk» eller välj språkfilter. Du ser SpeaksMatch-badge.", "Включи «Говорит на моём» или выбери язык. Увидишь бейдж SpeaksMatch.", "Włącz «Mówi moim językiem» lub wybierz język. Zobaczysz badge SpeaksMatch."]);
  L(["faq4_q", "¿Cómo edito o renuevo mi anuncio?", "How do I edit or renew my ad?", "Wie bearbeite oder erneuere ich meine Anzeige?", "Comment modifier ou renouveler mon annonce ?", "Hoe bewerk of vernieuw ik mijn ad?", "Come modifico o rinnovo il mio annuncio?", "Como edito ou renovo o meu anúncio?", "Hvordan redigerer eller fornyer jeg annonsen?", "Hur redigerar eller förnyar jag min annons?", "Как редактировать или обновить объявление?", "Jak edytować lub odnowić ogłoszenie?"]);
  L(["faq4_a", "Al publicar recibes un PIN de gestión. Entra en Mi anuncio con tu WhatsApp y el PIN para editar, subir el anuncio, pausarlo o eliminarlo. También puedes recargar créditos y gastarlos ahí.", "When you publish you get a management PIN. Open My ad with your WhatsApp and PIN to edit, bump, pause or delete. You can also top up credits and spend them there.", "Beim Veröffentlichen erhältst du eine PIN. Öffne Mein Inserat mit WhatsApp + PIN zum Bearbeiten, Bumpen, Pausieren oder Löschen. Dort lädst du auch Credits auf.", "À la publication tu reçois un PIN. Va dans Mon annonce avec WhatsApp + PIN pour modifier, remonter, pause ou supprimer. Tu y recharges aussi les crédits.", "Bij publiceren krijg je een PIN. Open Mijn ad met WhatsApp + PIN om te bewerken, bumpen, pauzeren of verwijderen. Daar laad je ook credits op.", "Alla pubblicazione ricevi un PIN. Apri Il mio annuncio con WhatsApp + PIN per modificare, rinnovare, mettere in pausa o eliminare. Lì ricarichi anche i crediti.", "Ao publicar recebes um PIN. Entra em O meu anúncio com WhatsApp + PIN para editar, renovar, pausar ou eliminar. Também recarregas créditos aí.", "Når du publiserer får du en PIN. Gå til Min annonse med WhatsApp + PIN for å redigere, fornye, pause eller slette. Der fyller du også på credits.", "När du publicerar får du en PIN. Gå till Min annons med WhatsApp + PIN för att redigera, förnya, pausa eller ta bort. Där fyller du också på credits.", "При публикации вы получаете PIN. Откройте «Моё объявление» с WhatsApp и PIN, чтобы править, поднимать, паузить или удалять. Там же пополняете кредиты.", "Po dodaniu ogłoszenia dostajesz PIN. Wejdź w Moje ogłoszenie z WhatsApp + PIN, by edytować, odnawiać, wstrzymać lub usunąć. Tam też doładujesz kredyty."]);
  L(["faq5_q", "¿Cómo denuncio un perfil falso?", "How do I report a fake profile?", "Wie melde ich ein Fake-Profil?", "Comment signaler un faux profil ?", "Hoe meld ik een nepprofiel?", "Come segnalo un profilo falso?", "Como denuncio um perfil falso?", "Hvordan anmelder jeg en falsk profil?", "Hur anmäler jag en falsk profil?", "Как пожаловаться на фейк?", "Jak zgłosić fałszywy profil?"]);
  L(["faq5_a", "Abre la ficha y usa Reportar anuncio. El equipo lo revisa desde el panel admin. También puedes escribir en Contacto.", "Open the profile and use Report ad. The team reviews it in the admin panel. You can also write via Contact.", "Öffne das Profil und nutze Anzeige melden. Das Team prüft im Admin. Du kannst auch über Kontakt schreiben.", "Ouvre le profil et utilise Signaler. L’équipe vérifie dans l’admin. Tu peux aussi écrire via Contact.", "Open het profiel en gebruik Melden. Het team checkt in de admin. Je kunt ook via Contact schrijven.", "Apri la scheda e usa Segnala. Il team controlla dall’admin. Puoi anche scrivere da Contatto.", "Abre o perfil e usa Denunciar. A equipa revê no admin. Também podes escrever em Contacto.", "Åpne profilen og bruk Rapporter. Teamet sjekker i admin. Du kan også skrive via Kontakt.", "Öppna profilen och använd Anmäl. Teamet granskar i admin. Du kan också skriva via Kontakt.", "Открой анкету и нажми Пожаловаться. Команда проверит в админке. Можно написать через Контакты.", "Otwórz profil i użyj Zgłoś. Zespół sprawdzi w adminie. Możesz też napisać w Kontakt."]);
  L(["adv_title", "Para anunciantes en Benidorm", "For advertisers in Benidorm", "Für Inserenten in Benidorm", "Pour les annonceuses à Benidorm", "Voor adverteerders in Benidorm", "Per inserzioniste a Benidorm", "Para anunciantes em Benidorm", "For annonsører i Benidorm", "För annonsörer i Benidorm", "Для рекламодателей в Бенидорме", "Dla reklamodawców w Benidorm"]);
  L(["adv_sub", "Publica en minutos y gestiona tú misma con PIN — sin intermediarios confusos.", "Publish in minutes and manage yourself with a PIN — no confusing middlemen.", "In Minuten inserieren und selbst mit PIN verwalten — ohne verwirrende Vermittler.", "Publie en quelques minutes et gère toi-même avec un PIN — sans intermédiaires flous.", "Publiceer in minuten en beheer zelf met PIN — zonder vage tussenpersonen.", "Pubblica in pochi minuti e gestisci tu con PIN — senza intermediari confusi.", "Publica em minutos e gere tu com PIN — sem intermediários confusos.", "Publiser på minutter og administrer selv med PIN — uten forvirrende mellomledd.", "Publicera på minuter och hantera själv med PIN — utan förvirrande mellanhänder.", "Публикуй за минуты и управляй сама с PIN — без запутанных посредников.", "Dodaj w kilka minut i zarządzaj sama z PIN — bez mylących pośredników."]);
  L(["adv1_t", "Publica", "Publish", "Inserieren", "Publier", "Publiceren", "Pubblica", "Publicar", "Publiser", "Publicera", "Опубликовать", "Opublikuj"]);
  L(["adv1_p", "Nombre, zona, tarifa, WhatsApp y fotos. 24 h de prueba; luego créditos (Día 5 · VIP 7 · TOP 10).", "Name, area, rate, WhatsApp and photos. 24h trial; then credits (Day 5 · VIP 7 · TOP 10).", "Name, Gebiet, Tarif, WhatsApp und Fotos. 24h Test; dann Credits (Tag 5 · VIP 7 · TOP 10).", "Nom, zone, tarif, WhatsApp et photos. Essai 24h ; puis crédits (Jour 5 · VIP 7 · TOP 10).", "Naam, wijk, tarief, WhatsApp en foto’s. 24u proef; daarna credits (Dag 5 · VIP 7 · TOP 10).", "Nome, zona, tariffa, WhatsApp e foto. Prova 24h; poi crediti (Giorno 5 · VIP 7 · TOP 10).", "Nome, zona, tarifa, WhatsApp e fotos. Teste 24h; depois créditos (Dia 5 · VIP 7 · TOP 10).", "Navn, sone, pris, WhatsApp og bilder. 24t prøve; deretter credits (Dag 5 · VIP 7 · TOP 10).", "Namn, område, pris, WhatsApp och foton. 24h prov; sedan credits (Dag 5 · VIP 7 · TOP 10).", "Имя, район, тариф, WhatsApp и фото. 24ч проба; потом кредиты (День 5 · VIP 7 · TOP 10).", "Imię, strefa, stawka, WhatsApp i zdjęcia. 24h próba; potem kredyty (Dzień 5 · VIP 7 · TOP 10)."]);
  L(["adv2_t", "Guarda el PIN", "Save your PIN", "PIN speichern", "Garde le PIN", "Bewaar de PIN", "Salva il PIN", "Guarda o PIN", "Lagre PIN", "Spara PIN", "Сохрани PIN", "Zapisz PIN"]);
  L(["adv2_p", "Al publicar recibes un PIN de gestión (solo una vez). Sin él no se edita el anuncio.", "When you publish you get a one-time management PIN. Without it the ad can’t be edited.", "Beim Veröffentlichen bekommst du einmalig eine PIN. Ohne sie lässt sich die Anzeige nicht bearbeiten.", "À la publication tu reçois un PIN unique. Sans lui l’annonce ne se modifie pas.", "Bij publiceren krijg je één keer een PIN. Zonder die kun je de ad niet bewerken.", "Alla pubblicazione ricevi un PIN una sola volta. Senza non si modifica l’annuncio.", "Ao publicar recebes um PIN uma vez. Sem ele o anúncio não se edita.", "Når du publiserer får du en PIN én gang. Uten den kan annonsen ikke redigeres.", "När du publicerar får du en PIN en gång. Utan den kan annonsen inte redigeras.", "При публикации PIN выдаётся один раз. Без него объявление не редактируется.", "Po dodaniu dostajesz PIN raz. Bez niego nie edytujesz ogłoszenia."]);
  L(["adv3_t", "Renueva y edita", "Renew & edit", "Erneuern & bearbeiten", "Renouveler et modifier", "Vernieuw en bewerk", "Rinnova e modifica", "Renova e edita", "Forny og rediger", "Förnya och redigera", "Обновляй и правь", "Odnów i edytuj"]);
  L(["adv3_p", "En Mi anuncio subes el perfil, cambias precio, fotos, gastas créditos o lo pausas.", "In My ad you bump the profile, change price, photos, spend credits or pause it.", "Unter Mein Inserat bumpen, Preis/Fotos ändern, Credits ausgeben oder pausieren.", "Dans Mon annonce : remonter, changer prix/photos, dépenser des crédits ou pause.", "In Mijn ad: bumpen, prijs/foto’s wijzigen, credits uitgeven of pauzeren.", "In Il mio annuncio: rinnova, cambia prezzo/foto, spendi crediti o metti in pausa.", "Em O meu anúncio: renova, muda preço/fotos, gasta créditos ou pausa.", "I Min annonse: forny, endre pris/bilder, bruk credits eller pause.", "I Min annons: förnya, ändra pris/foton, spendera credits eller pausa.", "В «Моём объявлении»: поднимай, меняй цену/фото, трать кредиты или пауза.", "W Moje ogłoszenie: odnów, zmień cenę/zdjęcia, wydaj kredyty lub wstrzymaj."]);
  L(["have_pin", "Ya tengo PIN", "I already have a PIN", "Ich habe schon eine PIN", "J’ai déjà un PIN", "Ik heb al een PIN", "Ho già un PIN", "Já tenho PIN", "Jeg har allerede PIN", "Jag har redan PIN", "У меня уже есть PIN", "Mam już PIN"]);
  L(["nav_prices", "Precios", "Prices", "Preise", "Tarifs", "Prijzen", "Prezzi", "Preços", "Priser", "Priser", "Цены", "Ceny"]);
  L(["nav_favs", "Favoritos", "Favorites", "Favoriten", "Favoris", "Favorieten", "Preferiti", "Favoritos", "Favoritter", "Favoriter", "Избранное", "Ulubione"]);
  L(["nav_login", "Entrar", "Log in", "Anmelden", "Connexion", "Inloggen", "Accedi", "Entrar", "Logg inn", "Logga in", "Войти", "Zaloguj"]);
  L(["nav_register", "Registro", "Sign up", "Registrieren", "Inscription", "Registreren", "Registrati", "Registo", "Registrer", "Registrera", "Регистрация", "Rejestracja"]);
  L(["nav_myad", "Mi anuncio", "My ad", "Mein Inserat", "Mon annonce", "Mijn ad", "Il mio annuncio", "O meu anúncio", "Min annonse", "Min annons", "Моё объявление", "Moje ogłoszenie"]);
  L(["nav_putas", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm", "Putas Benidorm"]);
  L(["nav_scorts", "Scorts", "Scorts", "Scorts", "Scorts", "Scorts", "Scorts", "Scorts", "Scorts", "Scorts", "Scorts", "Scorts"]);
  L(["nav_escorts", "Escorts", "Escorts", "Escorts", "Escorts", "Escorts", "Escort", "Escorts", "Escorts", "Escorts", "Эскорт", "Escorty"]);
  L(["zones_page_h1", "Escorts y putas por zona en Benidorm", "Escorts & putas by Benidorm area", "Escorts & Putas nach Gebiet in Benidorm", "Escorts et putas par zone à Benidorm", "Escorts & putas per wijk in Benidorm", "Escort e putas per zona a Benidorm", "Escorts e putas por zona em Benidorm", "Escorts & putas etter sone i Benidorm", "Escorts & putas per område i Benidorm", "Эскорт и putas по районам Бенидорма", "Escorty i putas według stref Benidorm"]);
  L(["zones_page_lead", "Elige el barrio o playa. Cada zona tiene página propia para búsquedas locales.", "Pick the neighbourhood or beach. Each area has its own page for local searches.", "Wähle Viertel oder Strand. Jedes Gebiet hat eine eigene Seite.", "Choisis le quartier ou la plage. Chaque zone a sa page.", "Kies wijk of strand. Elke zone heeft een eigen pagina.", "Scegli quartiere o spiaggia. Ogni zona ha la sua pagina.", "Escolhe o bairro ou praia. Cada zona tem a sua página.", "Velg strøk eller strand. Hver sone har egen side.", "Välj område eller strand. Varje zon har egen sida.", "Выбери район или пляж. У каждой зоны своя страница.", "Wybierz dzielnicę lub plażę. Każda strefa ma własną stronę."]);
  L(["zones_why_h2", "Por qué segmentamos Benidorm por zonas", "Why we split Benidorm by areas", "Warum wir Benidorm nach Gebieten trennen", "Pourquoi on découpe Benidorm par zones", "Waarom we Benidorm per wijk splitsen", "Perché dividiamo Benidorm per zone", "Porque separamos Benidorm por zonas", "Hvorfor vi deler Benidorm i soner", "Varför vi delar Benidorm i områden", "Почему мы делим Бенидорм по районам", "Dlaczego dzielimy Benidorm na strefy"]);
  L(["zones_why_p", "Separar Levante, Poniente y Rincón de Loix permite páginas específicas que Google puede posicionar y que el usuario filtra en segundos según su hotel.", "Splitting Levante, Poniente and Rincón de Loix lets Google rank specific pages and lets users filter in seconds by hotel area.", "Levante, Poniente und Rincón de Loix getrennt zu listen hilft Google und spart dem Nutzer Wege.", "Séparer Levante, Poniente et Rincón de Loix aide Google et le filtre par hôtel en quelques secondes.", "Levante, Poniente en Rincón de Loix apart houden helpt Google en snelle filters bij je hotel.", "Separare Levante, Poniente e Rincón de Loix aiuta Google e il filtro per hotel in secondi.", "Separar Levante, Poniente e Rincón de Loix ajuda o Google e o filtro por hotel em segundos.", "Å skille Levante, Poniente og Rincón de Loix hjelper Google og rask filter ved hotellet.", "Att dela Levante, Poniente och Rincón de Loix hjälper Google och snabb filter vid hotellet.", "Разделение Levante, Poniente и Rincón de Loix помогает Google и быстрому фильтру у отеля.", "Podział na Levante, Poniente i Rincón de Loix pomaga Google i szybkiemu filtrowi przy hotelu."]);
  L(["zones_work", "¿Trabajas en una zona? Publica con 24 h de prueba y luego renueva con créditos.", "Working in an area? Publish with a 24h trial, then renew with credits.", "Arbeitest du in einem Gebiet? 24h-Test, dann Credits.", "Tu travailles dans une zone ? Essai 24h, puis crédits.", "Werk je in een wijk? 24u proef, daarna credits.", "Lavori in una zona? Prova 24h, poi crediti.", "Trabalhas numa zona? Teste 24h, depois créditos.", "Jobber du i en sone? 24t prøve, deretter credits.", "Jobbar du i ett område? 24h prov, sedan credits.", "Работаешь в районе? 24ч проба, потом кредиты.", "Pracujesz w strefie? 24h próba, potem kredyty."]);
  L(["putas_h1", "Putas en Benidorm — anuncios por zona", "Putas in Benidorm — ads by area", "Putas in Benidorm — Anzeigen nach Gebiet", "Putas à Benidorm — annonces par zone", "Putas in Benidorm — ads per wijk", "Putas a Benidorm — annunci per zona", "Putas em Benidorm — anúncios por zona", "Putas i Benidorm — annonser etter sone", "Putas i Benidorm — annonser per område", "Putas в Бенидорме — объявления по районам", "Putas w Benidorm — ogłoszenia według stref"]);
  L(["putas_lead", "Buscas putas Benidorm con datos claros: barrio, tarifa y WhatsApp. Solo Benidorm, sin mezclar otras ciudades.", "Looking for putas Benidorm with clear details: area, rate and WhatsApp. Benidorm only — no other cities mixed in.", "Putas Benidorm mit klaren Daten: Viertel, Tarif und WhatsApp. Nur Benidorm.", "Putas Benidorm avec infos claires : quartier, tarif et WhatsApp. Uniquement Benidorm.", "Putas Benidorm met duidelijke info: wijk, tarief en WhatsApp. Alleen Benidorm.", "Putas Benidorm con dati chiari: zona, tariffa e WhatsApp. Solo Benidorm.", "Putas Benidorm com dados claros: zona, tarifa e WhatsApp. Só Benidorm.", "Putas Benidorm med tydelig info: sone, pris og WhatsApp. Bare Benidorm.", "Putas Benidorm med tydlig info: område, pris och WhatsApp. Bara Benidorm.", "Putas Benidorm с понятными данными: район, тариф и WhatsApp. Только Бенидорм.", "Putas Benidorm z jasnymi danymi: strefa, stawka i WhatsApp. Tylko Benidorm."]);
  L(["scorts_h1", "Scorts Benidorm — anuncios locales", "Scorts Benidorm — local ads", "Scorts Benidorm — lokale Anzeigen", "Scorts Benidorm — annonces locales", "Scorts Benidorm — lokale ads", "Scorts Benidorm — annunci locali", "Scorts Benidorm — anúncios locais", "Scorts Benidorm — lokale annonser", "Scorts Benidorm — lokala annonser", "Scorts Benidorm — местные объявления", "Scorts Benidorm — lokalne ogłoszenia"]);
  L(["scorts_lead", "Scorts y escorts en Benidorm por zona. Contacto directo y tarifas claras.", "Scorts and escorts in Benidorm by area. Direct contact and clear rates.", "Scorts und Escorts in Benidorm nach Gebiet. Direkter Kontakt, klare Tarife.", "Scorts et escorts à Benidorm par zone. Contact direct, tarifs clairs.", "Scorts en escorts in Benidorm per wijk. Direct contact, duidelijke tarieven.", "Scorts ed escort a Benidorm per zona. Contatto diretto, tariffe chiare.", "Scorts e escorts em Benidorm por zona. Contacto direto, tarifas claras.", "Scorts og escorts i Benidorm etter sone. Direkte kontakt, tydelige priser.", "Scorts och escorts i Benidorm per område. Direktkontakt, tydliga priser.", "Scorts и эскорт в Бенидорме по районам. Прямой контакт, понятные тарифы.", "Scorts i escorty w Benidorm według stref. Bezpośredni kontakt, jasne stawki."]);
  L(["prices_h1", "Compra créditos · gástalos en visibilidad", "Buy credits · spend on visibility", "Credits kaufen · für Sichtbarkeit ausgeben", "Acheter des crédits · dépenser pour la visibilité", "Credits kopen · uitgeven aan zichtbaarheid", "Compra crediti · spendi per la visibilità", "Compra créditos · gasta em visibilidade", "Kjøp credits · bruk på synlighet", "Köp credits · spendera på synlighet", "Купи кредиты · трать на видимость", "Kup kredyty · wydaj na widoczność"]);
  L(["prices_lead", "Elige de 1 a 1000 € (solo enteros). 1 € = 1 crédito base. Luego gastas en Día (5) · VIP (7) · TOP (10) / día.", "Choose 1 to 1000 € (integers only). 1 € = 1 base credit. Then spend on Day (5) · VIP (7) · TOP (10) / day.", "1 bis 1000 € (nur ganze Zahlen). 1 € = 1 Credit. Dann Tag (5) · VIP (7) · TOP (10) / Tag.", "1 à 1000 € (entiers seulement). 1 € = 1 crédit. Puis Jour (5) · VIP (7) · TOP (10) / jour.", "1 tot 1000 € (alleen gehele getallen). 1 € = 1 credit. Daarna Dag (5) · VIP (7) · TOP (10) / dag.", "Da 1 a 1000 € (solo interi). 1 € = 1 credito. Poi Giorno (5) · VIP (7) · TOP (10) / giorno.", "De 1 a 1000 € (só inteiros). 1 € = 1 crédito. Depois Dia (5) · VIP (7) · TOP (10) / dia.", "1 til 1000 € (bare hele tall). 1 € = 1 credit. Deretter Dag (5) · VIP (7) · TOP (10) / dag.", "1 till 1000 € (bara heltal). 1 € = 1 credit. Sedan Dag (5) · VIP (7) · TOP (10) / dag.", "От 1 до 1000 € (только целые). 1 € = 1 кредит. Потом День (5) · VIP (7) · TOP (10) / день.", "1 do 1000 € (tylko liczby całkowite). 1 € = 1 kredyt. Potem Dzień (5) · VIP (7) · TOP (10) / dzień."]);
  L(["prices_bonus", "🎁 Bonus: 50–999 € → +20% · 1000 € → +50%", "🎁 Bonus: 50–999 € → +20% · 1000 € → +50%", "🎁 Bonus: 50–999 € → +20% · 1000 € → +50%", "🎁 Bonus : 50–999 € → +20% · 1000 € → +50%", "🎁 Bonus: 50–999 € → +20% · 1000 € → +50%", "🎁 Bonus: 50–999 € → +20% · 1000 € → +50%", "🎁 Bónus: 50–999 € → +20% · 1000 € → +50%", "🎁 Bonus: 50–999 € → +20% · 1000 € → +50%", "🎁 Bonus: 50–999 € → +20% · 1000 € → +50%", "🎁 Бонус: 50–999 € → +20% · 1000 € → +50%", "🎁 Bonus: 50–999 € → +20% · 1000 € → +50%"]);
  L(["see_listings", "Ver anuncios activos", "View active ads", "Aktive Anzeigen", "Voir les annonces", "Actieve ads", "Vedi annunci", "Ver anúncios", "Se annonser", "Se annonser", "Смотреть объявления", "Zobacz ogłoszenia"]);
  L(["cta_band_t", "¿Trabajas en Benidorm?", "Working in Benidorm?", "Arbeitest du in Benidorm?", "Tu travailles à Benidorm ?", "Werk je in Benidorm?", "Lavori a Benidorm?", "Trabalhas em Benidorm?", "Jobber du i Benidorm?", "Jobbar du i Benidorm?", "Работаешь в Бенидорме?", "Pracujesz w Benidorm?"]);
  L(["cta_band_p", "Publica donde los turistas ya buscan en su idioma.", "List where tourists already search in their language.", "Inseriere, wo Touristen schon in ihrer Sprache suchen.", "Publie là où les touristes cherchent déjà dans leur langue.", "Adverteer waar toeristen al in hun taal zoeken.", "Pubblica dove i turisti cercano già nella loro lingua.", "Publica onde os turistas já procuram no seu idioma.", "Annonser der turister allerede søker på sitt språk.", "Annonsera där turister redan söker på sitt språk.", "Размещайся там, где туристы уже ищут на своём языке.", "Dodaj tam, gdzie turyści już szukają w swoim języku."]);
  L(["cta_band_btn", "Publicar · 24h prueba", "Publish · 24h trial", "Inserieren · 24h", "Publier · 24h", "Adverteren · 24u", "Pubblica · 24h", "Publicar · 24h", "Publiser · 24t", "Publicera · 24h", "24ч пробa", "Dodaj · 24h"]);
  L(["footer_blurb", "Directorio premium de escorts solo en Benidorm. Calidad, discreción y sin complicaciones.", "Premium escorts directory only in Benidorm. Quality, discretion, no hassle.", "Premium-Escort-Verzeichnis nur in Benidorm. Qualität, Diskretion, ohne Stress.", "Annuaire premium d’escorts uniquement à Benidorm. Qualité, discrétion, sans complications.", "Premium escorts-gids alleen in Benidorm. Kwaliteit, discretie, zonder gedoe.", "Directory premium di escort solo a Benidorm. Qualità, discrezione, senza problemi.", "Diretório premium de escorts só em Benidorm. Qualidade, discrição, sem complicações.", "Premium escortkatalog bare i Benidorm. Kvalitet, diskresjon, uten stress.", "Premium escortkatalog bara i Benidorm. Kvalitet, diskretion, utan krångel.", "Премиум-каталог эскорта только в Бенидорме. Качество, дискретность, без проблем.", "Premium katalog escortów tylko w Benidorm. Jakość, dyskrecja, bez problemów."]);
  L(["legal_18", "Contenido +18", "18+ content", "18+ Inhalt", "Contenu +18", "18+ content", "Contenuti +18", "Conteúdo +18", "18+ innhold", "18+ innehåll", "Контент 18+", "Treści 18+"]);
  L(["api_off", "No se pudo cargar la API. Arranca: npm start", "Could not load API. Run: npm start", "API nicht erreichbar. Starte: npm start", "API hors service. Lance: npm start", "API offline. Start: npm start", "API non disponibile. Avvia: npm start", "API offline. Corre: npm start", "API nede. Kjør: npm start", "API nere. Kör: npm start", "API недоступен. Запусти: npm start", "API offline. Uruchom: npm start"]);
  L(["home", "Inicio", "Home", "Start", "Accueil", "Home", "Home", "Início", "Hjem", "Hem", "Главная", "Start"]);
  L(["lang_picker", "Idioma", "Language", "Sprache", "Langue", "Taal", "Lingua", "Idioma", "Språk", "Språk", "Язык", "Język"]);
  L(["usp_no_scam", "Sin estafas", "No scams", "Kein Betrug", "Sans arnaque", "Geen oplichting", "Senza truffe", "Sem burla", "Ingen svindel", "Inga bluffar", "Без обмана", "Bez oszustw"]);
  L(["usp_quality", "Calidad superior", "Superior quality", "Höchste Qualität", "Qualité supérieure", "Topkwaliteit", "Qualità superiore", "Qualidade superior", "Overlegen kvalitet", "Överlägsen kvalitet", "Высшее качество", "Najwyższa jakość"]);
  L(["usp_100", "100% Benidorm", "100% Benidorm", "100% Benidorm", "100% Benidorm", "100% Benidorm", "100% Benidorm", "100% Benidorm", "100% Benidorm", "100% Benidorm", "100% Бенидорм", "100% Benidorm"]);
  L(["putas_h2_areas", "Putas Benidorm por barrios", "Putas Benidorm by neighbourhood", "Putas Benidorm nach Viertel", "Putas Benidorm par quartiers", "Putas Benidorm per wijk", "Putas Benidorm per quartiere", "Putas Benidorm por bairros", "Putas Benidorm etter strøk", "Putas Benidorm per område", "Putas Benidorm по районам", "Putas Benidorm według dzielnic"]);
  L(["putas_areas_p", "Filtra por la zona de tu hotel: Levante, Poniente, Rincón de Loix, Casco Antiguo, Nueva Poniente, Foietes.", "Filter by your hotel area: Levante, Poniente, Rincón de Loix, Old Town, Nueva Poniente, Foietes.", "Filtere nach Hotelgebiet: Levante, Poniente, Rincón de Loix…", "Filtre par zone d’hôtel : Levante, Poniente, Rincón de Loix…", "Filter op hotelwijk: Levante, Poniente, Rincón de Loix…", "Filtra per zona hotel: Levante, Poniente, Rincón de Loix…", "Filtra por zona do hotel: Levante, Poniente, Rincón de Loix…", "Filtrer på hotellsone: Levante, Poniente, Rincón de Loix…", "Filtrera på hotellområde: Levante, Poniente, Rincón de Loix…", "Фильтр по району отеля: Levante, Poniente, Rincón de Loix…", "Filtruj strefę hotelu: Levante, Poniente, Rincón de Loix…"]);
  L(["putas_h2_contact", "Cómo contactar", "How to contact", "So kontaktieren", "Comment contacter", "Hoe contacten", "Come contattare", "Como contactar", "Hvordan kontakte", "Hur man kontaktar", "Как связаться", "Jak kontaktować"]);
  L(["putas_contact_p", "Abre el anuncio, mira si habla tu idioma y escribe por WhatsApp. Confirma tarifa y ubicación en Benidorm antes de quedar.", "Open the ad, check if she speaks your language and write on WhatsApp. Confirm rate and location in Benidorm before meeting.", "Anzeige öffnen, Sprache prüfen und per WhatsApp schreiben. Tarif und Ort in Benidorm vorher bestätigen.", "Ouvre l’annonce, vérifie la langue et écris sur WhatsApp. Confirme tarif et lieu à Benidorm avant le rendez-vous.", "Open de ad, check de taal en schrijf via WhatsApp. Bevestig tarief en locatie in Benidorm vooraf.", "Apri l’annuncio, controlla la lingua e scrivi su WhatsApp. Conferma tariffa e luogo a Benidorm prima di incontrarvi.", "Abre o anúncio, vê se fala o teu idioma e escreve no WhatsApp. Confirma tarifa e local em Benidorm antes de encontrar.", "Åpne annonsen, sjekk språk og skriv på WhatsApp. Bekreft pris og sted i Benidorm før dere møtes.", "Öppna annonsen, kolla språk och skriv på WhatsApp. Bekräfta pris och plats i Benidorm innan ni ses.", "Открой объявление, проверь язык и напиши в WhatsApp. Подтверди тариф и место в Бенидорме до встречи.", "Otwórz ogłoszenie, sprawdź język i napisz na WhatsApp. Potwierdź stawkę i miejsce w Benidorm przed spotkaniem."]);
  L(["putas_work_p", "¿Trabajas en Benidorm? Regístrate y anúnciate. Prueba 24 h y luego créditos diarios.", "Working in Benidorm? Sign up and list. 24h trial then daily credits.", "Arbeitest du in Benidorm? Registrieren und inserieren. 24h-Test, dann Tages-Credits.", "Tu travailles à Benidorm ? Inscris-toi et publie. Essai 24h puis crédits journaliers.", "Werk je in Benidorm? Registreer en adverteer. 24u proef, daarna dagcredits.", "Lavori a Benidorm? Registrati e pubblica. Prova 24h poi crediti giornalieri.", "Trabalhas em Benidorm? Regista-te e anuncia. Teste 24h e depois créditos diários.", "Jobber du i Benidorm? Registrer deg og annonser. 24t prøve, deretter daglige credits.", "Jobbar du i Benidorm? Registrera dig och annonsera. 24h prov, sedan dagliga credits.", "Работаешь в Бенидорме? Зарегистрируйся и разместись. 24ч проба, потом дневные кредиты.", "Pracujesz w Benidorm? Zarejestruj się i dodaj ogłoszenie. 24h próba, potem dzienne kredyty."]);
  L(["zones_bc", "Zonas de Benidorm", "Benidorm areas", "Benidorm-Gebiete", "Zones de Benidorm", "Wijken van Benidorm", "Zone di Benidorm", "Zonas de Benidorm", "Soner i Benidorm", "Områden i Benidorm", "Районы Бенидорма", "Strefy Benidorm"]);
  L(["from_day", "Desde 5€/día", "From 5€/day", "Ab 5€/Tag", "Dès 5€/jour", "Vanaf 5€/dag", "Da 5€/giorno", "Desde 5€/dia", "Fra 5€/dag", "Från 5€/dag", "От 5€/день", "Od 5€/dzień"]);
  L(["view_all_ads", "Ver todos los anuncios", "View all listings", "Alle Anzeigen", "Toutes les annonces", "Alle ads", "Tutti gli annunci", "Todos os anúncios", "Alle annonser", "Alla annonser", "Все объявления", "Wszystkie ogłoszenia"]);
  L(["create_account", "Crear cuenta", "Create account", "Konto erstellen", "Créer un compte", "Account aanmaken", "Crea account", "Criar conta", "Opprett konto", "Skapa konto", "Создать аккаунт", "Utwórz konto"]);
  L(["menu", "Menú", "Menu", "Menü", "Menu", "Menu", "Menu", "Menu", "Meny", "Meny", "Меню", "Menu"]);
  L(["login_h1", "Acceso anunciantes", "Advertiser login", "Anmelden für Inserenten", "Connexion annonceuse", "Inloggen adverteerder", "Accesso inserzioniste", "Acesso anunciantes", "Innlogging annonsør", "Inloggning annonsör", "Вход для рекламодателей", "Logowanie reklamodawcy"]);
  L(["login_lead", "Entra con tu email (o teléfono) y contraseña. Publica con 24 h de prueba y renueva desde 5€/día.", "Sign in with email (or phone) and password. Publish with a 24h trial and renew from 5€/day.", "Mit E-Mail (oder Telefon) und Passwort anmelden. 24h-Test, dann ab 5€/Tag.", "Connecte-toi avec email (ou téléphone) et mot de passe. Essai 24h, puis dès 5€/jour.", "Log in met e-mail (of telefoon) en wachtwoord. 24u proef, daarna vanaf 5€/dag.", "Accedi con email (o telefono) e password. Prova 24h, poi da 5€/giorno.", "Entra com email (ou telefone) e palavra-passe. Teste 24h, depois desde 5€/dia.", "Logg inn med e-post (eller telefon) og passord. 24t prøve, deretter fra 5€/dag.", "Logga in med e-post (eller telefon) och lösenord. 24h prov, sedan från 5€/dag.", "Войдите по email (или телефону) и паролю. 24ч проба, потом от 5€/день.", "Zaloguj się e-mailem (lub telefonem) i hasłem. 24h próba, potem od 5€/dzień."]);
  L(["login_email", "Email o teléfono", "Email or phone", "E-Mail oder Telefon", "Email ou téléphone", "E-mail of telefoon", "Email o telefono", "Email ou telefone", "E-post eller telefon", "E-post eller telefon", "Email или телефон", "E-mail lub telefon"]);
  L(["login_pass", "Contraseña", "Password", "Passwort", "Mot de passe", "Wachtwoord", "Password", "Palavra-passe", "Passord", "Lösenord", "Пароль", "Hasło"]);
  L(["login_btn", "Entrar", "Log in", "Anmelden", "Connexion", "Inloggen", "Accedi", "Entrar", "Logg inn", "Logga in", "Войти", "Zaloguj"]);
  L(["login_no_account", "¿No tienes cuenta?", "No account?", "Noch kein Konto?", "Pas de compte ?", "Geen account?", "Non hai un account?", "Não tens conta?", "Har du ikke konto?", "Har du inget konto?", "Нет аккаунта?", "Nie masz konta?"]);
  L(["login_register", "Regístrate", "Sign up", "Registrieren", "S’inscrire", "Registreren", "Registrati", "Regista-te", "Registrer deg", "Registrera dig", "Регистрация", "Zarejestruj się"]);
  L(["login_pin", "¿Solo tienes PIN antiguo? Entrar con PIN", "Only have an old PIN? Log in with PIN", "Nur alte PIN? Mit PIN anmelden", "Seulement un ancien PIN ? Connexion PIN", "Alleen oude PIN? Inloggen met PIN", "Solo un vecchio PIN? Accedi con PIN", "Só tens PIN antigo? Entrar com PIN", "Bare gammel PIN? Logg inn med PIN", "Bara gammal PIN? Logga in med PIN", "Только старый PIN? Войти с PIN", "Tylko stary PIN? Zaloguj z PIN"]);
  L(["reg_h1", "Crea tu cuenta de anunciante", "Create your advertiser account", "Inserentenkonto erstellen", "Créer ton compte annonceuse", "Maak je adverteerdersaccount", "Crea il tuo account inserzionista", "Cria a tua conta de anunciante", "Opprett annonsørkonto", "Skapa annonsörskonto", "Создайте аккаунт рекламодателя", "Utwórz konto reklamodawcy"]);
  L(["reg_lead", "Regístrate con email y teléfono, publica con 24 h de prueba y luego paga solo el día: 5€ / 7€ / 10€.", "Sign up with email and phone, publish with a 24h trial, then pay per day: 5€ / 7€ / 10€.", "Mit E-Mail und Telefon registrieren, 24h-Test, dann Tagestarife 5/7/10€.", "Inscris-toi avec email et téléphone, essai 24h, puis 5/7/10€ par jour.", "Registreer met e-mail en telefoon, 24u proef, daarna 5/7/10€ per dag.", "Registrati con email e telefono, prova 24h, poi 5/7/10€ al giorno.", "Regista-te com email e telefone, teste 24h, depois 5/7/10€ por dia.", "Registrer deg med e-post og telefon, 24t prøve, deretter 5/7/10€ per dag.", "Registrera dig med e-post och telefon, 24h prov, sedan 5/7/10€ per dag.", "Регистрация с email и телефоном, 24ч проба, потом 5/7/10€ в день.", "Zarejestruj się e-mailem i telefonem, 24h próba, potem 5/7/10€ dziennie."]);
  L(["reg_btn", "Crear cuenta y continuar", "Create account & continue", "Konto erstellen und weiter", "Créer le compte et continuer", "Account maken en doorgaan", "Crea account e continua", "Criar conta e continuar", "Opprett konto og fortsett", "Skapa konto och fortsätt", "Создать аккаунт и продолжить", "Utwórz konto i kontynuuj"]);
  L(["reg_have_account", "¿Ya tienes cuenta?", "Already have an account?", "Schon ein Konto?", "Déjà un compte ?", "Al een account?", "Hai già un account?", "Já tens conta?", "Har du allerede konto?", "Har du redan konto?", "Уже есть аккаунт?", "Masz już konto?"]);
  L(["see_prices", "Ver precios diarios", "See daily prices", "Tagespreise ansehen", "Voir les tarifs journaliers", "Bekijk dagprijzen", "Vedi prezzi giornalieri", "Ver preços diários", "Se dagspriser", "Se dagspriser", "Смотреть дневные цены", "Zobacz ceny dzienne"]);
  L(["blog_h1", "Guía y blog: escorts en Benidorm", "Guide & blog: escorts in Benidorm", "Guide & Blog: Escorts in Benidorm", "Guide & blog : escorts à Benidorm", "Gids & blog: escorts in Benidorm", "Guida e blog: escort a Benidorm", "Guia e blog: escorts em Benidorm", "Guide og blogg: escorts i Benidorm", "Guide och blogg: escorts i Benidorm", "Гид и блог: эскорт в Бенидорме", "Przewodnik i blog: escorty w Benidorm"]);
  L(["blog_lead", "Contenido local para usuarios y para posicionar búsquedas de escorts en Benidorm.", "Local content for visitors and for ranking escort searches in Benidorm.", "Lokale Inhalte für Besucher und SEO rund um Escorts in Benidorm.", "Contenu local pour visiteurs et SEO escorts à Benidorm.", "Lokale content voor bezoekers en SEO over escorts in Benidorm.", "Contenuti locali per visitatori e SEO escort a Benidorm.", "Conteúdo local para visitantes e SEO de escorts em Benidorm.", "Lokalt innhold for besøkende og SEO for escorts i Benidorm.", "Lokalt innehåll för besökare och SEO för escorts i Benidorm.", "Локальный контент для гостей и SEO по эскорту в Бенидорме.", "Lokalne treści dla gości i SEO escort w Benidorm."]);
  L(["have_account_cta", "Ya tengo cuenta", "I already have an account", "Ich habe schon ein Konto", "J’ai déjà un compte", "Ik heb al een account", "Ho già un account", "Já tenho conta", "Jeg har allerede konto", "Jag har redan konto", "У меня уже есть аккаунт", "Mam już konto"]);

  // —— Publish + My ad + JS UI: full multi-lang (es en de fr nl it pt no sv ru pl) ——
  // Helper: when only 3 args shown historically, use M(es,en,de) expanded below via full rows.
  L(["pub_h1", "Publica en Benidorm en 2 minutos", "Publish in Benidorm in 2 minutes", "In Benidorm in 2 Minuten inserieren", "Publie à Benidorm en 2 minutes", "Publiceer in Benidorm in 2 minuten", "Pubblica a Benidorm in 2 minuti", "Publica em Benidorm em 2 minutos", "Publiser i Benidorm på 2 minutter", "Publicera i Benidorm på 2 minuter", "Размести в Бенидорме за 2 минуты", "Dodaj w Benidorm w 2 minuty"]);
  L(["pub_lead", "Registro obligatorio · 24h de prueba · luego créditos (5 / 7 / 10 al día).", "Account required · 24h trial · then credits (5 / 7 / 10 per day).", "Konto nötig · 24h-Test · dann Credits (5 / 7 / 10 pro Tag).", "Compte requis · essai 24h · puis crédits (5 / 7 / 10 par jour).", "Account vereist · 24u proef · daarna credits (5 / 7 / 10 per dag).", "Account obbligatorio · prova 24h · poi crediti (5 / 7 / 10 al giorno).", "Conta obrigatória · teste 24h · depois créditos (5 / 7 / 10 por dia).", "Konto påkrevd · 24t prøve · deretter credits (5 / 7 / 10 per dag).", "Konto krävs · 24h prov · sedan credits (5 / 7 / 10 per dag).", "Нужен аккаунт · 24ч проба · потом кредиты (5 / 7 / 10 в день).", "Konto wymagane · 24h próba · potem kredyty (5 / 7 / 10 dziennie)."]);
  L(["pub_buy_credits", "Comprar créditos", "Buy credits", "Credits kaufen", "Acheter des crédits", "Credits kopen", "Compra crediti", "Comprar créditos", "Kjøp credits", "Köp credits", "Купить кредиты", "Kup kredyty"]);
  L(["pub_trust_24h", "✓ 24h de prueba", "✓ 24h trial", "✓ 24h Test", "✓ Essai 24h", "✓ 24u proef", "✓ Prova 24h", "✓ Teste 24h", "✓ 24t prøve", "✓ 24h prov", "✓ 24ч проба", "✓ 24h próba"]);
  L(["pub_trust_only", "✓ Solo Benidorm", "✓ Benidorm only", "✓ Nur Benidorm", "✓ 100% Benidorm", "✓ Alleen Benidorm", "✓ Solo Benidorm", "✓ Só Benidorm", "✓ Bare Benidorm", "✓ Bara Benidorm", "✓ Только Бенидорм", "✓ Tylko Benidorm"]);
  L(["pub_trust_wa", "✓ WhatsApp directo", "✓ Direct WhatsApp", "✓ Direkt WhatsApp", "✓ WhatsApp direct", "✓ Direct WhatsApp", "✓ WhatsApp diretto", "✓ WhatsApp direto", "✓ Direkte WhatsApp", "✓ Direkt WhatsApp", "✓ Прямой WhatsApp", "✓ Bezpośredni WhatsApp"]);
  L(["pub_trust_price", "✓ Desde 5€/día", "✓ From 5€/day", "✓ Ab 5€/Tag", "✓ Dès 5€/jour", "✓ Vanaf 5€/dag", "✓ Da 5€/giorno", "✓ Desde 5€/dia", "✓ Fra 5€/dag", "✓ Från 5€/dag", "✓ От 5€/день", "✓ Od 5€/dzień"]);
  L(["pub_ok_badge", "✓ Publicado y online", "✓ Live online", "✓ Live und online", "✓ En ligne", "✓ Live online", "✓ Online", "✓ Online", "✓ Online", "✓ Online", "✓ Онлайн", "✓ Online"]);
  L(["pub_ok_title", "Tu anuncio ya está en el listado", "Your ad is live in the listings", "Deine Anzeige ist live im Verzeichnis", "Ton annonce est en ligne", "Je ad staat live", "Il tuo annuncio è online", "O teu anúncio está online", "Annonsen er live", "Din annons är live", "Объявление в списке", "Twoje ogłoszenie jest live"]);
  L(["pub_ok_lead", "Guarda este PIN de gestión. No se volverá a mostrar.", "Save this management PIN. It won’t be shown again.", "Speichere diese PIN. Sie wird nicht erneut angezeigt.", "Garde ce PIN. Il ne sera plus affiché.", "Bewaar deze PIN. Hij wordt niet meer getoond.", "Salva questo PIN. Non verrà più mostrato.", "Guarda este PIN. Não será mostrado de novo.", "Lagre denne PIN. Den vises ikke igjen.", "Spara denna PIN. Den visas inte igen.", "Сохрани PIN. Он больше не покажется.", "Zapisz ten PIN. Nie pokażemy go ponownie."]);
  L(["pub_copy_pin", "Copiar PIN", "Copy PIN", "PIN kopieren", "Copier le PIN", "PIN kopiëren", "Copia PIN", "Copiar PIN", "Kopier PIN", "Kopiera PIN", "Копировать PIN", "Kopiuj PIN"]);
  L(["pub_manage_ad", "Gestionar anuncio", "Manage ad", "Anzeige verwalten", "Gérer l’annonce", "Ad beheren", "Gestisci annuncio", "Gerir anúncio", "Administrer annonse", "Hantera annons", "Управлять объявлением", "Zarządzaj ogłoszeniem"]);
  L(["pub_view_public", "Ver ficha pública", "View public profile", "Öffentliches Profil", "Voir le profil public", "Openbaar profiel", "Vedi scheda pubblica", "Ver perfil público", "Se offentlig profil", "Visa offentlig profil", "Публичный профиль", "Zobacz profil publiczny"]);
  L(["pub_next_credits", "Siguiente: recarga créditos", "Next: top up credits", "Als Nächstes: Credits aufladen", "Ensuite : recharger des crédits", "Volgende: credits opladen", "Poi: ricarica crediti", "Seguinte: recarregar créditos", "Neste: fyll på credits", "Nästa: fyll på credits", "Далее: пополнить кредиты", "Dalej: doładuj kredyty"]);
  L(["pub_next_credits_p", "Tienes 24h de prueba. Luego gasta créditos (Día 5 · VIP 7 · TOP 10).", "You have a 24h trial. Then spend credits (Day 5 · VIP 7 · TOP 10).", "Du hast 24h Test. Dann Credits ausgeben (Tag 5 · VIP 7 · TOP 10).", "Tu as 24h d’essai. Puis dépense des crédits (Jour 5 · VIP 7 · TOP 10).", "Je hebt 24u proef. Daarna credits (Dag 5 · VIP 7 · TOP 10).", "Hai 24h di prova. Poi crediti (Giorno 5 · VIP 7 · TOP 10).", "Tens 24h de teste. Depois créditos (Dia 5 · VIP 7 · TOP 10).", "Du har 24t prøve. Deretter credits (Dag 5 · VIP 7 · TOP 10).", "Du har 24h prov. Sedan credits (Dag 5 · VIP 7 · TOP 10).", "У вас 24ч проба. Потом кредиты (День 5 · VIP 7 · TOP 10).", "Masz 24h próbę. Potem kredyty (Dzień 5 · VIP 7 · TOP 10)."]);
  L(["pub_topup", "Recargar créditos", "Top up credits", "Credits aufladen", "Recharger des crédits", "Credits opladen", "Ricarica crediti", "Recarregar créditos", "Fyll på credits", "Fyll på credits", "Пополнить кредиты", "Doładuj kredyty"]);
  L(["pub_tip", "Consejo: renueva cada pocos días desde Mi anuncio.", "Tip: renew every few days from My ad.", "Tipp: erneuere alle paar Tage unter Mein Inserat.", "Conseil : renouvelle tous les quelques jours dans Mon annonce.", "Tip: vernieuw om de paar dagen via Mijn ad.", "Suggerimento: rinnova ogni pochi giorni da Il mio annuncio.", "Dica: renova de poucos em poucos dias em O meu anúncio.", "Tips: forny hver få dag fra Min annonse.", "Tips: förnya varannan dag från Min annons.", "Совет: обновляй каждые несколько дней в «Моём объявлении».", "Wskazówka: odnawiaj co kilka dni w Moje ogłoszenie."]);
  L(["pub_progress", "% completo · campos obligatorios", "% complete · required fields", "% fertig · Pflichtfelder", "% complet · champs requis", "% compleet · verplichte velden", "% completo · campi obbligatori", "% completo · campos obrigatórios", "% fullført · obligatoriske felt", "% klart · obligatoriska fält", "% готово · обязательные поля", "% ukończone · pola wymagane"]);
  L(["pub_sec_photos", "Fotos", "Photos", "Fotos", "Photos", "Foto’s", "Foto", "Fotos", "Bilder", "Foton", "Фото", "Zdjęcia"]);
  L(["pub_sec_photos_p", "La primera es la portada. Mejor calidad = más clics.", "First photo is the cover. Better quality = more clicks.", "Das erste Foto ist das Cover. Bessere Qualität = mehr Klicks.", "La première est la couverture. Meilleure qualité = plus de clics.", "Eerste foto is de cover. Betere kwaliteit = meer clicks.", "La prima è la copertina. Più qualità = più click.", "A primeira é a capa. Melhor qualidade = mais cliques.", "Første bilde er cover. Bedre kvalitet = flere klikk.", "Första fotot är omslaget. Bättre kvalitet = fler klick.", "Первое фото — обложка. Лучше качество = больше кликов.", "Pierwsze zdjęcie to okładka. Lepsza jakość = więcej kliknięć."]);
  L(["pub_drop_strong", "Arrastra fotos aquí", "Drop photos here", "Fotos hier ablegen", "Dépose les photos ici", "Sleep foto’s hierheen", "Trascina le foto qui", "Larga fotos aqui", "Slipp bilder her", "Släpp foton här", "Перетащи фото сюда", "Upuść zdjęcia tutaj"]);
  L(["pub_drop_sub", "o toca para elegir · JPG/PNG/WEBP · máx. 6 · 5 MB c/u", "or tap to choose · JPG/PNG/WEBP · max 6 · 5 MB each", "oder tippen · JPG/PNG/WEBP · max. 6 · 5 MB je", "ou toucher · JPG/PNG/WEBP · max 6 · 5 Mo chacune", "of tik om te kiezen · max 6 · 5 MB elk", "o tocca · max 6 · 5 MB ciascuna", "ou toca · máx. 6 · 5 MB cada", "eller trykk · maks 6 · 5 MB hver", "eller tryck · max 6 · 5 MB vardera", "или нажми · макс. 6 · 5 МБ", "lub dotknij · max 6 · 5 MB każde"]);
  L(["pub_photo_count", "0 / 6 fotos · opcional pero recomendable", "0 / 6 photos · optional but recommended", "0 / 6 Fotos · optional aber empfohlen", "0 / 6 photos · optionnel mais recommandé", "0 / 6 foto’s · optioneel maar aanbevolen", "0 / 6 foto · opzionale ma consigliato", "0 / 6 fotos · opcional mas recomendado", "0 / 6 bilder · valgfritt men anbefalt", "0 / 6 foton · valfritt men rekommenderas", "0 / 6 фото · желательно", "0 / 6 zdjęć · opcjonalne, ale zalecane"]);
  L(["pub_sec_profile", "Perfil", "Profile", "Profil", "Profil", "Profiel", "Profilo", "Perfil", "Profil", "Profil", "Профиль", "Profil"]);
  L(["pub_sec_profile_p", "Cómo te verán en el listado de Benidorm.", "How you’ll appear in the Benidorm listings.", "So wirst du im Benidorm-Verzeichnis gesehen.", "Comment tu apparaîtras dans l’annuaire Benidorm.", "Hoe je eruitziet in de Benidorm-lijst.", "Come apparirai nell’elenco di Benidorm.", "Como vais aparecer no listado de Benidorm.", "Slik vises du i Benidorm-katalogen.", "Så syns du i Benidorm-katalogen.", "Как тебя увидят в каталоге Бенидорма.", "Jak będziesz wyglądać na liście Benidorm."]);
  L(["pub_label_title", "Título del anuncio", "Ad title", "Anzeigentitel", "Titre de l’annonce", "Ad-titel", "Titolo annuncio", "Título do anúncio", "Annonsetittel", "Annonstitel", "Заголовок", "Tytuł ogłoszenia"]);
  L(["pub_suggest", "Sugerir título", "Suggest title", "Titel vorschlagen", "Suggérer un titre", "Titel voorstellen", "Suggerisci titolo", "Sugerir título", "Foreslå tittel", "Föreslå titel", "Предложить заголовок", "Zaproponuj tytuł"]);
  L(["pub_label_name", "Nombre artístico *", "Display name *", "Künstlername *", "Nom d’artiste *", "Artiestennaam *", "Nome d’arte *", "Nome artístico *", "Artistnavn *", "Artistnamn *", "Имя *", "Pseudonim *"]);
  L(["pub_label_age", "Edad * (18+)", "Age * (18+)", "Alter * (18+)", "Âge * (18+)", "Leeftijd * (18+)", "Età * (18+)", "Idade * (18+)", "Alder * (18+)", "Ålder * (18+)", "Возраст * (18+)", "Wiek * (18+)"]);
  L(["pub_label_zone", "Zona de Benidorm *", "Benidorm area *", "Gebiet in Benidorm *", "Zone à Benidorm *", "Wijk in Benidorm *", "Zona a Benidorm *", "Zona em Benidorm *", "Sone i Benidorm *", "Område i Benidorm *", "Район Бенидорма *", "Strefa Benidorm *"]);
  L(["pub_select_zone", "Selecciona zona", "Select area", "Gebiet wählen", "Choisir la zone", "Kies wijk", "Scegli zona", "Escolhe zona", "Velg sone", "Välj område", "Выбери район", "Wybierz strefę"]);
  L(["pub_label_price", "Tarifa €/hora *", "Rate €/hour *", "Tarif €/Stunde *", "Tarif €/heure *", "Tarief €/uur *", "Tariffa €/ora *", "Tarifa €/hora *", "Pris €/time *", "Pris €/timme *", "Тариф €/час *", "Stawka €/godz. *"]);
  L(["pub_label_nat", "Nacionalidad", "Nationality", "Nationalität", "Nationalité", "Nationaliteit", "Nazionalità", "Nacionalidade", "Nasjonalitet", "Nationalitet", "Национальность", "Narodowość"]);
  L(["pub_label_height", "Altura", "Height", "Größe", "Taille", "Lengte", "Altezza", "Altura", "Høyde", "Längd", "Рост", "Wzrost"]);
  L(["pub_label_loc", "Ubicación detallada", "Detailed location", "Genaue Lage", "Emplacement détaillé", "Gedetailleerde locatie", "Posizione dettagliata", "Localização detalhada", "Detaljert sted", "Detaljerad plats", "Точное место", "Szczegółowa lokalizacja"]);
  L(["pub_loc_hint", "No pongas el número exacto de piso. Barrio u hotel cercano basta.", "No need for exact flat number. Neighbourhood or nearby hotel is enough.", "Keine exakte Hausnummer nötig. Viertel oder nahes Hotel reicht.", "Pas besoin du numéro exact. Quartier ou hôtel proche suffit.", "Geen exact huisnummer nodig. Wijk of hotel in de buurt is genoeg.", "Non serve il numero esatto. Quartiere o hotel vicino bastano.", "Não precisas do número exato. Bairro ou hotel próximo chega.", "Trenger ikke eksakt nummer. Strøk eller hotell i nærheten holder.", "Inget exakt nummer behövs. Område eller hotell nära räcker.", "Точный номер не нужен. Район или отель рядом достаточно.", "Nie podawaj dokładnego numeru. Dzielnica lub hotel w pobliżu wystarczy."]);
  L(["pub_sec_contact", "Contacto", "Contact", "Kontakt", "Contact", "Contact", "Contatto", "Contacto", "Kontakt", "Kontakt", "Контакт", "Kontakt"]);
  L(["pub_sec_contact_p", "WhatsApp real. Es lo que más usan los clientes en Benidorm.", "Real WhatsApp — what clients use most in Benidorm.", "Echtes WhatsApp — was Kunden in Benidorm am meisten nutzen.", "Vrai WhatsApp — ce que les clients utilisent le plus à Benidorm.", "Echte WhatsApp — wat klanten in Benidorm het meest gebruiken.", "WhatsApp reale — ciò che i clienti usano di più a Benidorm.", "WhatsApp real — o que os clientes mais usam em Benidorm.", "Ekte WhatsApp — det kundene bruker mest i Benidorm.", "Riktig WhatsApp — det kunder använder mest i Benidorm.", "Настоящий WhatsApp — так клиенты чаще всего пишут в Бенидорме.", "Prawdziwy WhatsApp — tak klienci najczęściej piszą w Benidorm."]);
  L(["pub_label_phone", "WhatsApp del anuncio *", "Ad WhatsApp *", "WhatsApp der Anzeige *", "WhatsApp de l’annonce *", "WhatsApp van de ad *", "WhatsApp annuncio *", "WhatsApp do anúncio *", "WhatsApp for annonse *", "WhatsApp för annons *", "WhatsApp объявления *", "WhatsApp ogłoszenia *"]);
  L(["pub_phone_hint", "Se rellena con el de tu cuenta; puedes cambiarlo. Se publica.", "Filled from your account; you can change it. It is published.", "Wird aus deinem Konto gefüllt; änderbar. Wird veröffentlicht.", "Rempli depuis ton compte ; modifiable. Il est publié.", "Gevuld vanuit je account; te wijzigen. Wordt gepubliceerd.", "Compilato dal tuo account; modificabile. Viene pubblicato.", "Preenchido da tua conta; podes mudar. É publicado.", "Fylt fra kontoen din; kan endres. Publiseres.", "Fylls från ditt konto; kan ändras. Publiceras.", "Берётся из аккаунта; можно менять. Публикуется.", "Z konta; możesz zmienić. Jest publikowany."]);
  L(["pub_label_langs", "Idiomas", "Languages", "Sprachen", "Langues", "Talen", "Lingue", "Idiomas", "Språk", "Språk", "Языки", "Języki"]);
  L(["pub_sec_details", "Detalles", "Details", "Details", "Détails", "Details", "Dettagli", "Detalhes", "Detaljer", "Detaljer", "Детали", "Szczegóły"]);
  L(["pub_sec_details_p", "Servicios, horario y modalidad.", "Services, schedule and modality.", "Services, Zeiten und Modalität.", "Services, horaires et modalité.", "Diensten, uren en modaliteit.", "Servizi, orari e modalità.", "Serviços, horário e modalidade.", "Tjenester, tid og modalitet.", "Tjänster, tider och modalitet.", "Услуги, график и формат.", "Usługi, godziny i tryb."]);
  L(["pub_label_services", "Servicios", "Services", "Services", "Services", "Diensten", "Servizi", "Serviços", "Tjenester", "Tjänster", "Услуги", "Usługi"]);
  L(["pub_services_hint", "Toca para marcar. También puedes escribir extras abajo.", "Tap to select. You can add extras below.", "Tippen zum Auswählen. Extras unten möglich.", "Touche pour cocher. Extras en bas.", "Tik om te selecteren. Extra’s hieronder.", "Tocca per selezionare. Extra sotto.", "Toca para marcar. Extras em baixo.", "Trykk for å velge. Ekstra under.", "Tryck för att välja. Extra nedan.", "Нажми, чтобы выбрать. Дополнительно ниже.", "Dotknij, by wybrać. Dodatki poniżej."]);
  L(["pub_label_other", "Otros servicios (opcional)", "Other services (optional)", "Weitere Services (optional)", "Autres services (optionnel)", "Andere diensten (optioneel)", "Altri servizi (opzionale)", "Outros serviços (opcional)", "Andre tjenester (valgfritt)", "Andra tjänster (valfritt)", "Другие услуги (необязательно)", "Inne usługi (opcjonalnie)"]);
  L(["pub_label_schedule", "Horario", "Schedule", "Zeiten", "Horaires", "Tijden", "Orari", "Horário", "Tider", "Tider", "График", "Godziny"]);
  L(["pub_indep", "Independiente", "Independent", "Unabhängig", "Indépendante", "Onafhankelijk", "Indipendente", "Independente", "Uavhengig", "Oberoende", "Независимая", "Niezależna"]);
  L(["pub_incall", "Recibe", "Incall", "Empfängt", "Reçoit", "Ontvangt", "Riceve", "Recebe", "Mottar", "Tar emot", "Принимает", "Przyjmuje"]);
  L(["pub_outcall", "Salidas / hotel", "Outcall / hotel", "Hausbesuche / Hotel", "Déplacements / hôtel", "Uitgaan / hotel", "Uscite / hotel", "Saídas / hotel", "Ut / hotell", "Ut / hotell", "Выезды / отель", "Wyjazdy / hotel"]);
  L(["pub_24h", "Disponible 24h", "Available 24h", "24h verfügbar", "Dispo 24h", "24u beschikbaar", "Disponibile 24h", "Disponível 24h", "Tilgjengelig 24t", "Tillgänglig 24h", "Доступна 24ч", "Dostępna 24h"]);
  L(["pub_label_desc", "Descripción *", "Description *", "Beschreibung *", "Description *", "Beschrijving *", "Descrizione *", "Descrição *", "Beskrivelse *", "Beskrivning *", "Описание *", "Opis *"]);
  L(["pub_desc_hint", "Sé concreta y honesta", "Be clear and honest", "Sei klar und ehrlich", "Sois claire et honnête", "Wees duidelijk en eerlijk", "Sii chiara e onesta", "Sê clara e honesta", "Vær tydelig og ærlig", "Var tydlig och ärlig", "Будь ясной и честной", "Bądź jasna i szczera"]);
  L(["pub_sec_plan", "Plan de visibilidad", "Visibility plan", "Sichtbarkeitsplan", "Plan de visibilité", "Zichtbaarheidsplan", "Piano visibilità", "Plano de visibilidade", "Synlighetsplan", "Synlighetsplan", "План видимости", "Plan widoczności"]);
  L(["pub_sec_plan_p", "24 h de prueba al publicar. Luego 5€ / 7€ / 10€ al día.", "24h trial when you publish. Then 5€ / 7€ / 10€ per day.", "24h Test beim Veröffentlichen. Dann 5€ / 7€ / 10€ pro Tag.", "Essai 24h à la publication. Puis 5€ / 7€ / 10€ par jour.", "24u proef bij publiceren. Daarna 5€ / 7€ / 10€ per dag.", "Prova 24h alla pubblicazione. Poi 5€ / 7€ / 10€ al giorno.", "Teste 24h ao publicar. Depois 5€ / 7€ / 10€ por dia.", "24t prøve ved publisering. Deretter 5€ / 7€ / 10€ per dag.", "24h prov vid publicering. Sedan 5€ / 7€ / 10€ per dag.", "24ч проба при публикации. Потом 5€ / 7€ / 10€ в день.", "24h próba przy dodaniu. Potem 5€ / 7€ / 10€ dziennie."]);
  L(["pub_plan_day", "Día", "Day", "Tag", "Jour", "Dag", "Giorno", "Dia", "Dag", "Dag", "День", "Dzień"]);
  L(["pub_plan_day_d", "Visible 24h en el listado", "Visible 24h in the list", "24h im Verzeichnis sichtbar", "Visible 24h dans la liste", "24u zichtbaar in de lijst", "Visibile 24h in elenco", "Visível 24h na lista", "Synlig 24t i listen", "Synlig 24h i listan", "Видна 24ч в списке", "Widoczna 24h na liście"]);
  L(["pub_plan_vip", "VIP día", "VIP day", "VIP-Tag", "Jour VIP", "VIP-dag", "Giorno VIP", "Dia VIP", "VIP-dag", "VIP-dag", "VIP день", "Dzień VIP"]);
  L(["pub_plan_vip_d", "Destacado · más visitas", "Featured · more views", "Hervorgehoben · mehr Aufrufe", "À la une · plus de vues", "Uitgelicht · meer views", "In evidenza · più visite", "Destaque · mais visitas", "Fremhevet · flere visninger", "Utvald · fler visningar", "В топе · больше просмотров", "Wyróżniona · więcej wyświetleń"]);
  L(["pub_plan_top", "TOP día", "TOP day", "TOP-Tag", "Jour TOP", "TOP-dag", "Giorno TOP", "Dia TOP", "TOP-dag", "TOP-dag", "TOP день", "Dzień TOP"]);
  L(["pub_plan_top_d", "Máxima prioridad hoy", "Highest priority today", "Höchste Priorität heute", "Priorité max aujourd’hui", "Hoogste prioriteit vandaag", "Massima priorità oggi", "Prioridade máxima hoje", "Høyeste prioritet i dag", "Högsta prioritet idag", "Максимальный приоритет сегодня", "Najwyższy priorytet dziś"]);
  L(["pub_plan_hint", "Al publicar tienes 24h de prueba gratis. Luego recargas y gastas en Mi anuncio.", "Publishing gives a free 24h trial. Then top up and spend in My ad.", "Beim Veröffentlichen 24h gratis Test. Dann aufladen und unter Mein Inserat ausgeben.", "À la publication : essai 24h gratuit. Puis recharge et dépense dans Mon annonce.", "Bij publiceren 24u gratis proef. Daarna opladen en uitgeven in Mijn ad.", "Alla pubblicazione prova 24h gratis. Poi ricarica e spendi in Il mio annuncio.", "Ao publicar tens 24h grátis. Depois recarrega e gasta em O meu anúncio.", "Ved publisering 24t gratis prøve. Deretter fyll på og bruk i Min annonse.", "Vid publicering 24h gratis prov. Sedan fyll på och spendera i Min annons.", "При публикации 24ч бесплатно. Потом пополни и трать в «Моём объявлении».", "Po dodaniu 24h gratis. Potem doładuj i wydaj w Moje ogłoszenie."]);
  L(["pub_legal", "Soy mayor de 18, trabajo en Benidorm, la información es veraz y acepto el aviso legal y la privacidad.", "I am 18+, work in Benidorm, the info is true and I accept the legal notice and privacy policy.", "Ich bin 18+, arbeite in Benidorm, die Angaben sind wahr und ich akzeptiere Impressum und Datenschutz.", "J’ai 18 ans ou plus, je travaille à Benidorm, les infos sont exactes et j’accepte les mentions légales et la confidentialité.", "Ik ben 18+, werk in Benidorm, de info is juist en ik accepteer de juridische voorwaarden en privacy.", "Ho 18+ anni, lavoro a Benidorm, le info sono vere e accetto l’informativa legale e privacy.", "Tenho 18+, trabalho em Benidorm, a info é verdadeira e aceito o aviso legal e a privacidade.", "Jeg er 18+, jobber i Benidorm, infoen er sann og jeg godtar juridiske vilkår og personvern.", "Jag är 18+, jobbar i Benidorm, infon är sann och jag godkänner juridisk info och integritet.", "Мне 18+, работаю в Бенидорме, данные верны, принимаю правовые условия и политику.", "Mam 18+, pracuję w Benidorm, dane są prawdziwe i akceptuję regulamin oraz prywatność."]);
  L(["pub_submit", "Publicar anuncio ahora", "Publish ad now", "Jetzt inserieren", "Publier maintenant", "Nu publiceren", "Pubblica ora", "Publicar agora", "Publiser nå", "Publicera nu", "Опубликовать сейчас", "Opublikuj teraz"]);
  L(["pub_have_pin", "Al publicar recibirás un PIN. ¿Ya tienes uno?", "You’ll get a PIN after publishing. Already have one?", "Beim Veröffentlichen erhältst du eine PIN. Schon eine?", "Tu reçois un PIN à la publication. Tu en as déjà un ?", "Bij publiceren krijg je een PIN. Heb je er al een?", "Alla pubblicazione ricevi un PIN. Ne hai già uno?", "Ao publicar recebes um PIN. Já tens um?", "Når du publiserer får du en PIN. Har du allerede en?", "När du publicerar får du en PIN. Har du redan en?", "При публикации выдаётся PIN. Уже есть?", "Po dodaniu dostajesz PIN. Masz już?"]);
  L(["pub_preview", "Así se verá", "Preview", "Vorschau", "Aperçu", "Voorbeeld", "Anteprima", "Pré-visualização", "Forhåndsvisning", "Förhandsvisning", "Превью", "Podgląd"]);
  L(["pub_preview_name", "Tu nombre, 24", "Your name, 24", "Dein Name, 24", "Ton nom, 24", "Jouw naam, 24", "Il tuo nome, 24", "O teu nome, 24", "Ditt navn, 24", "Ditt namn, 24", "Твоё имя, 24", "Twoje imię, 24"]);
  L(["pub_preview_zone", "Zona Benidorm", "Benidorm area", "Gebiet Benidorm", "Zone Benidorm", "Wijk Benidorm", "Zona Benidorm", "Zona Benidorm", "Sone Benidorm", "Område Benidorm", "Район Бенидорм", "Strefa Benidorm"]);
  L(["pub_preview_desc", "Tu descripción aparecerá aquí…", "Your description will appear here…", "Deine Beschreibung erscheint hier…", "Ta description apparaîtra ici…", "Je beschrijving verschijnt hier…", "La tua descrizione apparirà qui…", "A tua descrição aparece aqui…", "Beskrivelsen din vises her…", "Din beskrivning visas här…", "Описание появится здесь…", "Twój opis pojawi się tutaj…"]);
  L(["pub_tip1", "Fotos reales y nítidas generan más WhatsApp.", "Clear real photos get more WhatsApp.", "Klare echte Fotos bringen mehr WhatsApp.", "Des photos nettes et réelles = plus de WhatsApp.", "Duidelijke echte foto’s = meer WhatsApp.", "Foto chiare e reali = più WhatsApp.", "Fotos nítidas e reais = mais WhatsApp.", "Klare ekte bilder = mer WhatsApp.", "Tydliga äkta foton = mer WhatsApp.", "Чёткие реальные фото = больше WhatsApp.", "Wyraźne prawdziwe zdjęcia = więcej WhatsApp."]);
  L(["pub_tip2", "Indica zona + idiomas: filtran mucho en Benidorm.", "Area + languages matter a lot in Benidorm.", "Gebiet + Sprachen sind in Benidorm wichtig.", "Zone + langues comptent beaucoup à Benidorm.", "Wijk + talen zijn belangrijk in Benidorm.", "Zona + lingue contano molto a Benidorm.", "Zona + idiomas importam muito em Benidorm.", "Sone + språk betyr mye i Benidorm.", "Område + språk spelar stor roll i Benidorm.", "Район + языки важны в Бенидорме.", "Strefa + języki dużo znaczą w Benidorm."]);
  L(["pub_tip3", "Tras publicar, renueva con tu PIN para subir posiciones.", "After publishing, renew with your PIN to climb the list.", "Nach dem Veröffentlichen mit PIN erneuern, um hochzusteigen.", "Après publication, renouvelle avec ton PIN pour monter.", "Na publiceren: vernieuw met PIN om te stijgen.", "Dopo la pubblicazione rinnova con PIN per salire.", "Depois de publicar, renova com o PIN para subir.", "Etter publisering: forny med PIN for å stige.", "Efter publicering: förnya med PIN för att stiga.", "После публикации обновляй с PIN, чтобы подняться.", "Po dodaniu odnów z PIN, by wejść wyżej."]);
  L(["pub_footer", "Publicación real en servidor", "Live publishing on server", "Echte Veröffentlichung auf dem Server", "Publication réelle sur le serveur", "Echte publicatie op de server", "Pubblicazione reale sul server", "Publicação real no servidor", "Ekte publisering på server", "Riktig publicering på servern", "Реальная публикация на сервере", "Prawdziwa publikacja na serwerze"]);

  L(["my_h1", "Panel del anunciante", "Advertiser panel", "Inserenten-Panel", "Espace annonceuse", "Adverteerderspaneel", "Pannello inserzionista", "Painel do anunciante", "Annonsørpanel", "Annonsörspanel", "Панель рекламодателя", "Panel reklamodawcy"]);
  L(["my_lead", "Si tienes cuenta: inicia sesión. También puedes usar el PIN del anuncio.", "If you have an account: log in. You can also use the ad PIN.", "Mit Konto: anmelden. Du kannst auch die Anzeigen-PIN nutzen.", "Avec un compte : connecte-toi. Tu peux aussi utiliser le PIN.", "Met account: log in. Je kunt ook de ad-PIN gebruiken.", "Con account: accedi. Puoi anche usare il PIN annuncio.", "Com conta: entra. Também podes usar o PIN do anúncio.", "Med konto: logg inn. Du kan også bruke annonse-PIN.", "Med konto: logga in. Du kan också använda annons-PIN.", "С аккаунтом: войди. Можно и PIN объявления.", "Z kontem: zaloguj się. Możesz też użyć PIN ogłoszenia."]);
  L(["my_login_link", "inicia sesión", "log in", "anmelden", "connexion", "inloggen", "accedi", "entrar", "logg inn", "logga in", "войти", "zaloguj"]);
  L(["my_private", "Acceso privado", "Private access", "Privater Zugang", "Accès privé", "Privé toegang", "Accesso privato", "Acesso privado", "Privat tilgang", "Privat åtkomst", "Частный доступ", "Dostęp prywatny"]);
  L(["my_pin_h2", "Entra con tu PIN", "Sign in with your PIN", "Mit PIN anmelden", "Connexion avec PIN", "Inloggen met PIN", "Accedi con PIN", "Entrar com PIN", "Logg inn med PIN", "Logga in med PIN", "Войти с PIN", "Zaloguj z PIN"]);
  L(["my_pin_hint", "WhatsApp del anuncio + PIN. Solo en este dispositivo.", "Ad WhatsApp + PIN. Saved only on this device.", "WhatsApp der Anzeige + PIN. Nur auf diesem Gerät.", "WhatsApp de l’annonce + PIN. Seulement sur cet appareil.", "WhatsApp van de ad + PIN. Alleen op dit apparaat.", "WhatsApp annuncio + PIN. Solo su questo dispositivo.", "WhatsApp do anúncio + PIN. Só neste dispositivo.", "WhatsApp for annonse + PIN. Bare på denne enheten.", "WhatsApp för annons + PIN. Bara på den här enheten.", "WhatsApp объявления + PIN. Только на этом устройстве.", "WhatsApp ogłoszenia + PIN. Tylko na tym urządzeniu."]);
  L(["my_phone", "WhatsApp / Teléfono", "WhatsApp / Phone", "WhatsApp / Telefon", "WhatsApp / Téléphone", "WhatsApp / Telefoon", "WhatsApp / Telefono", "WhatsApp / Telefone", "WhatsApp / Telefon", "WhatsApp / Telefon", "WhatsApp / Телефон", "WhatsApp / Telefon"]);
  L(["my_pin", "PIN de gestión", "Management PIN", "Verwaltungs-PIN", "PIN de gestion", "Beheer-PIN", "PIN di gestione", "PIN de gestão", "Administrasjons-PIN", "Hanterings-PIN", "PIN управления", "PIN zarządzania"]);
  L(["my_show", "Ver", "Show", "Zeigen", "Afficher", "Tonen", "Mostra", "Mostrar", "Vis", "Visa", "Показать", "Pokaż"]);
  L(["my_pin_once", "Se mostró una sola vez al publicar. Si lo perdiste, publica de nuevo o contacta.", "Shown once when publishing. If lost, publish again or contact us.", "Einmalig beim Veröffentlichen. Bei Verlust neu inserieren oder Kontakt.", "Affiché une fois à la publication. Si perdu, republie ou contacte-nous.", "Eén keer bij publiceren. Kwijt? Opnieuw publiceren of contact.", "Mostrato una sola volta. Se perso, ripubblica o contattaci.", "Mostrado uma vez ao publicar. Se perdeste, publica de novo ou contacta.", "Vist én gang ved publisering. Mistet? Publiser på nytt eller kontakt.", "Visas en gång vid publicering. Borttappad? Publicera igen eller kontakta.", "Показывается один раз. Потерял — публикуй снова или напиши нам.", "Pokazywany raz przy dodaniu. Zgubiony? Dodaj ponownie lub napisz."]);
  L(["my_remember", "Recordar en este dispositivo", "Remember on this device", "Auf diesem Gerät merken", "Mémoriser sur cet appareil", "Onthouden op dit apparaat", "Ricorda su questo dispositivo", "Lembrar neste dispositivo", "Husk på denne enheten", "Kom ihåg på den här enheten", "Запомнить на этом устройстве", "Zapamiętaj na tym urządzeniu"]);
  L(["my_access", "Acceder a mi anuncio", "Access my ad", "Mein Inserat öffnen", "Accéder à mon annonce", "Mijn ad openen", "Apri il mio annuncio", "Aceder ao meu anúncio", "Åpne min annonse", "Öppna min annons", "Открыть моё объявление", "Otwórz moje ogłoszenie"]);
  L(["my_new_ad", "Publicar anuncio nuevo", "Publish a new ad", "Neue Anzeige inserieren", "Publier une nouvelle annonce", "Nieuwe ad publiceren", "Pubblica un nuovo annuncio", "Publicar anúncio novo", "Publiser ny annonse", "Publicera ny annons", "Новое объявление", "Dodaj nowe ogłoszenie"]);
  L(["my_forgot", "¿Olvidé el PIN?", "Forgot PIN?", "PIN vergessen?", "PIN oublié ?", "PIN vergeten?", "PIN dimenticato?", "Esqueceste o PIN?", "Glemt PIN?", "Glömt PIN?", "Забыл PIN?", "Zapomniałeś PIN?"]);
  L(["my_recover_h2", "Recuperar PIN", "Recover PIN", "PIN wiederherstellen", "Récupérer le PIN", "PIN herstellen", "Recupera PIN", "Recuperar PIN", "Gjenopprett PIN", "Återställ PIN", "Восстановить PIN", "Odzyskaj PIN"]);
  L(["my_recover_p", "Usa el email de registro. Si hay SMTP, te enviamos el PIN.", "Use your registration email. If SMTP is set, we send the PIN.", "Registrierungs-E-Mail nutzen. Mit SMTP senden wir die PIN.", "Utilise l’email d’inscription. Avec SMTP on envoie le PIN.", "Gebruik je registratie-e-mail. Met SMTP sturen we de PIN.", "Usa l’email di registrazione. Con SMTP inviamo il PIN.", "Usa o email de registo. Com SMTP enviamos o PIN.", "Bruk registrerings-e-post. Med SMTP sender vi PIN.", "Använd registrerings-e-post. Med SMTP skickar vi PIN.", "Используй email регистрации. При SMTP пришлём PIN.", "Użyj e-maila rejestracji. Przy SMTP wyślemy PIN."]);
  L(["my_recover_email", "Email de gestión", "Management email", "Verwaltungs-E-Mail", "Email de gestion", "Beheer-e-mail", "Email di gestione", "Email de gestão", "Administrasjons-e-post", "Hanterings-e-post", "Email управления", "E-mail zarządzania"]);
  L(["my_request_pin", "Solicitar PIN", "Request PIN", "PIN anfordern", "Demander le PIN", "PIN aanvragen", "Richiedi PIN", "Pedir PIN", "Be om PIN", "Begär PIN", "Запросить PIN", "Poproś o PIN"]);
  L(["my_back", "Volver al acceso", "Back to sign-in", "Zurück zur Anmeldung", "Retour à la connexion", "Terug naar inloggen", "Torna all’accesso", "Voltar ao acesso", "Tilbake til innlogging", "Tillbaka till inloggning", "Назад ко входу", "Wróć do logowania"]);
  L(["my_view_public", "Ver público", "View public", "Öffentlich ansehen", "Voir public", "Openbaar bekijken", "Vedi pubblico", "Ver público", "Se offentlig", "Visa offentligt", "Смотреть публично", "Zobacz publicznie"]);
  L(["my_logout", "Salir", "Log out", "Abmelden", "Déconnexion", "Uitloggen", "Esci", "Sair", "Logg ut", "Logga ut", "Выйти", "Wyloguj"]);
  L(["my_views", "Vistas", "Views", "Aufrufe", "Vues", "Weergaven", "Visualizzazioni", "Visitas", "Visninger", "Visningar", "Просмотры", "Wyświetlenia"]);
  L(["my_photos", "Fotos", "Photos", "Fotos", "Photos", "Foto’s", "Foto", "Fotos", "Bilder", "Foton", "Фото", "Zdjęcia"]);
  L(["my_last_bump", "Última renovación", "Last bump", "Letzte Erneuerung", "Dernier renouvellement", "Laatste vernieuwing", "Ultimo rinnovo", "Última renovação", "Siste fornyelse", "Senaste förnyelse", "Последнее обновление", "Ostatnie odnowienie"]);
  L(["my_bump", "↑ Renovar / subir listado", "↑ Renew / bump listing", "↑ Erneuern / nach oben", "↑ Renouveler / remonter", "↑ Vernieuwen / omhoog", "↑ Rinnova / sali", "↑ Renovar / subir", "↑ Forny / løft", "↑ Förnya / lyft", "↑ Обновить / поднять", "↑ Odnów / podnieś"]);
  L(["my_online", "En línea", "Online", "Online", "En ligne", "Online", "Online", "Online", "Online", "Online", "Онлайн", "Online"]);
  L(["my_pause", "Pausar", "Pause", "Pausieren", "Pause", "Pauzeren", "Pausa", "Pausar", "Pause", "Pausa", "Пауза", "Wstrzymaj"]);
  L(["my_bump_hint", "Renovar pone el anuncio arriba y lo marca en línea.", "Renew bumps the ad to the top and marks it online.", "Erneuern setzt die Anzeige nach oben und online.", "Renouveler remonte l’annonce et la met en ligne.", "Vernieuwen zet de ad bovenaan en online.", "Rinnovare porta l’annuncio in alto e online.", "Renovar sobe o anúncio e marca online.", "Forny løfter annonsen og setter den online.", "Förnya lyfter annonsen och sätter den online.", "Обновление поднимает объявление и включает онлайн.", "Odnowienie podnosi ogłoszenie i ustawia online."]);
  L(["my_spend_h3", "Gastar créditos en visibilidad", "Spend credits on visibility", "Credits für Sichtbarkeit ausgeben", "Dépenser des crédits pour la visibilité", "Credits uitgeven aan zichtbaarheid", "Spendi crediti per la visibilità", "Gastar créditos em visibilidade", "Bruk credits på synlighet", "Spendera credits på synlighet", "Тратить кредиты на видимость", "Wydaj kredyty na widoczność"]);
  L(["my_balance", "Saldo: —", "Balance: —", "Guthaben: —", "Solde : —", "Saldo: —", "Saldo: —", "Saldo: —", "Saldo: —", "Saldo: —", "Баланс: —", "Saldo: —"]);
  L(["my_plan", "Plan actual: prueba", "Current plan: trial", "Aktueller Plan: Test", "Plan actuel : essai", "Huidig plan: proef", "Piano attuale: prova", "Plano atual: teste", "Nåværende plan: prøve", "Aktuell plan: prov", "Текущий план: проба", "Aktualny plan: próba"]);
  L(["my_buy_cr", "Comprar créditos", "Buy credits", "Credits kaufen", "Acheter des crédits", "Credits kopen", "Compra crediti", "Comprar créditos", "Kjøp credits", "Köp credits", "Купить кредиты", "Kup kredyty"]);
  L(["my_spend_hint", "Primero compras créditos · luego gastas aquí.", "Buy credits first · spend here.", "Zuerst Credits kaufen · dann hier ausgeben.", "D’abord acheter des crédits · puis dépenser ici.", "Eerst credits kopen · hier uitgeven.", "Prima compra crediti · poi spendi qui.", "Primeiro compras créditos · depois gastas aqui.", "Først kjøp credits · bruk her.", "Köp credits först · spendera här.", "Сначала купи кредиты · трать здесь.", "Najpierw kup kredyty · wydaj tutaj."]);
  L(["my_sec_photos_p", "Portada = primera foto. Añade más para la galería.", "Cover = first photo. Add more for the gallery.", "Cover = erstes Foto. Mehr für die Galerie.", "Couverture = première photo. Ajoute pour la galerie.", "Cover = eerste foto. Voeg meer toe voor galerij.", "Copertina = prima foto. Aggiungi per la galleria.", "Capa = primeira foto. Adiciona mais à galeria.", "Cover = første bilde. Legg til flere for galleri.", "Omslag = första fotot. Lägg till fler till galleriet.", "Обложка = первое фото. Добавь ещё в галерею.", "Okładka = pierwsze zdjęcie. Dodaj więcej do galerii."]);
  L(["my_current_photos", "Fotos actuales", "Current photos", "Aktuelle Fotos", "Photos actuelles", "Huidige foto’s", "Foto attuali", "Fotos atuais", "Nåværende bilder", "Nuvarande foton", "Текущие фото", "Aktualne zdjęcia"]);
  L(["my_add_photos", "Añadir fotos", "Add photos", "Fotos hinzufügen", "Ajouter des photos", "Foto’s toevoegen", "Aggiungi foto", "Adicionar fotos", "Legg til bilder", "Lägg till foton", "Добавить фото", "Dodaj zdjęcia"]);
  L(["my_add_photos_h", "Hasta el límite del plan (Día 4 · VIP 6 · TOP 8).", "Up to plan limit (Day 4 · VIP 6 · TOP 8).", "Bis Planlimit (Tag 4 · VIP 6 · TOP 8).", "Jusqu’à la limite du plan (Jour 4 · VIP 6 · TOP 8).", "Tot planlimiet (Dag 4 · VIP 6 · TOP 8).", "Fino al limite piano (Giorno 4 · VIP 6 · TOP 8).", "Até ao limite do plano (Dia 4 · VIP 6 · TOP 8).", "Opptil plangrense (Dag 4 · VIP 6 · TOP 8).", "Upp till plangräns (Dag 4 · VIP 6 · TOP 8).", "До лимита плана (День 4 · VIP 6 · TOP 8).", "Do limitu planu (Dzień 4 · VIP 6 · TOP 8)."]);
  L(["my_sec_profile_p", "Textos y datos del listado.", "Listing text and details.", "Texte und Daten der Anzeige.", "Textes et données de l’annonce.", "Tekst en gegevens van de ad.", "Testi e dati dell’annuncio.", "Textos e dados do anúncio.", "Tekst og data for annonsen.", "Text och data för annonsen.", "Тексты и данные объявления.", "Teksty i dane ogłoszenia."]);
  L(["my_label_title", "Título", "Title", "Titel", "Titre", "Titel", "Titolo", "Título", "Tittel", "Titel", "Заголовок", "Tytuł"]);
  L(["my_label_name", "Nombre *", "Name *", "Name *", "Nom *", "Naam *", "Nome *", "Nome *", "Navn *", "Namn *", "Имя *", "Imię *"]);
  L(["my_label_age", "Edad *", "Age *", "Alter *", "Âge *", "Leeftijd *", "Età *", "Idade *", "Alder *", "Ålder *", "Возраст *", "Wiek *"]);
  L(["my_label_zone", "Zona", "Area", "Gebiet", "Zone", "Wijk", "Zona", "Zona", "Sone", "Område", "Район", "Strefa"]);
  L(["my_label_price", "Tarifa €/h *", "Rate €/h *", "Tarif €/h *", "Tarif €/h *", "Tarief €/u *", "Tariffa €/h *", "Tarifa €/h *", "Pris €/t *", "Pris €/t *", "Тариф €/ч *", "Stawka €/h *"]);
  L(["my_avail", "Disponibilidad", "Availability", "Verfügbarkeit", "Disponibilité", "Beschikbaarheid", "Disponibilità", "Disponibilidade", "Tilgjengelighet", "Tillgänglighet", "Доступность", "Dostępność"]);
  L(["my_avail_p", "Controla si te ven en línea y si el anuncio está activo.", "Control online status and whether the ad is active.", "Steuere Online-Status und ob die Anzeige aktiv ist.", "Contrôle le statut en ligne et si l’annonce est active.", "Beheer online-status en of de ad actief is.", "Controlla se sei online e se l’annuncio è attivo.", "Controla se estás online e se o anúncio está ativo.", "Styr online-status og om annonsen er aktiv.", "Styr online-status och om annonsen är aktiv.", "Управляй онлайном и активностью объявления.", "Kontroluj status online i aktywność ogłoszenia."]);
  L(["my_online_now", "En línea ahora", "Online now", "Jetzt online", "En ligne maintenant", "Nu online", "Online ora", "Online agora", "Online nå", "Online nu", "Сейчас онлайн", "Online teraz"]);
  L(["my_visibility", "Visibilidad en el listado", "Listing visibility", "Sichtbarkeit im Verzeichnis", "Visibilité dans la liste", "Zichtbaarheid in de lijst", "Visibilità in elenco", "Visibilidade na lista", "Synlighet i listen", "Synlighet i listan", "Видимость в списке", "Widoczność na liście"]);
  L(["my_active", "Activo (visible en Benidorm)", "Active (visible in Benidorm)", "Aktiv (sichtbar in Benidorm)", "Active (visible à Benidorm)", "Actief (zichtbaar in Benidorm)", "Attivo (visibile a Benidorm)", "Ativo (visível em Benidorm)", "Aktiv (synlig i Benidorm)", "Aktiv (synlig i Benidorm)", "Активно (видно в Бенидорме)", "Aktywne (widoczne w Benidorm)"]);
  L(["my_hidden", "Pausado (oculto)", "Paused (hidden)", "Pausiert (versteckt)", "En pause (cachée)", "Gepauzeerd (verborgen)", "In pausa (nascosto)", "Pausado (oculto)", "Pauset (skjult)", "Pausad (dold)", "На паузе (скрыто)", "Wstrzymane (ukryte)"]);
  L(["my_save", "Guardar cambios", "Save changes", "Änderungen speichern", "Enregistrer", "Wijzigingen opslaan", "Salva modifiche", "Guardar alterações", "Lagre endringer", "Spara ändringar", "Сохранить", "Zapisz zmiany"]);
  L(["my_delete", "Eliminar anuncio permanentemente", "Delete ad permanently", "Anzeige endgültig löschen", "Supprimer l’annonce définitivement", "Ad permanent verwijderen", "Elimina annuncio definitivamente", "Eliminar anúncio permanentemente", "Slett annonse permanent", "Ta bort annons permanent", "Удалить объявление навсегда", "Usuń ogłoszenie trwale"]);
  L(["my_footer", "Gestión privada", "Private management", "Private Verwaltung", "Gestion privée", "Privé beheer", "Gestione privata", "Gestão privada", "Privat administrasjon", "Privat hantering", "Частное управление", "Prywatne zarządzanie"]);

  L(["pub_need_auth", "Debes registrarte o iniciar sesión para publicar anuncios.", "You must sign up or log in to publish ads.", "Du musst dich registrieren oder anmelden, um Anzeigen zu inserieren.", "Tu dois t’inscrire ou te connecter pour publier.", "Je moet registreren of inloggen om te publiceren.", "Devi registrarti o accedere per pubblicare.", "Tens de te registar ou entrar para publicar.", "Du må registrere deg eller logge inn for å publisere.", "Du måste registrera dig eller logga in för att publicera.", "Нужна регистрация или вход для публикации.", "Musisz się zarejestrować lub zalogować, by dodać ogłoszenie."]);
  L(["pub_need_auth_strong", "Debes registrarte o iniciar sesión", "You must sign up or log in", "Registrieren oder anmelden", "Inscris-toi ou connecte-toi", "Registreer of log in", "Registrati o accedi", "Regista-te ou entra", "Registrer deg eller logg inn", "Registrera dig eller logga in", "Зарегистрируйся или войди", "Zarejestruj się lub zaloguj"]);
  L(["pub_need_auth_rest", "para publicar anuncios.", "to publish ads.", "um Anzeigen zu inserieren.", "pour publier des annonces.", "om ads te publiceren.", "per pubblicare annunci.", "para publicar anúncios.", "for å publisere annonser.", "för att publicera annonser.", "чтобы публиковать объявления.", "aby dodać ogłoszenia."]);
  L(["pub_logged_as", "Conectada:", "Signed in:", "Angemeldet:", "Connectée :", "Ingelogd:", "Connessa:", "Ligado:", "Innlogget:", "Inloggad:", "Вход:", "Zalogowano:"]);
  L(["pub_logout", "Salir", "Log out", "Abmelden", "Déconnexion", "Uitloggen", "Esci", "Sair", "Logg ut", "Logga ut", "Выйти", "Wyloguj"]);
  L(["js_creating", "Creando…", "Creating…", "Erstellen…", "Création…", "Aanmaken…", "Creazione…", "A criar…", "Oppretter…", "Skapar…", "Создание…", "Tworzenie…"]);
  L(["js_entering", "Entrando…", "Signing in…", "Anmelden…", "Connexion…", "Inloggen…", "Accesso…", "A entrar…", "Logger inn…", "Loggar in…", "Вход…", "Logowanie…"]);
  L(["js_publishing", "Publicando…", "Publishing…", "Veröffentlichen…", "Publication…", "Publiceren…", "Pubblicazione…", "A publicar…", "Publiserer…", "Publicerar…", "Публикация…", "Publikowanie…"]);
  L(["js_saving", "Guardando…", "Saving…", "Speichern…", "Enregistrement…", "Opslaan…", "Salvataggio…", "A guardar…", "Lagrer…", "Sparar…", "Сохранение…", "Zapisywanie…"]);
  L(["js_sending", "Enviando…", "Sending…", "Senden…", "Envoi…", "Verzenden…", "Invio…", "A enviar…", "Sender…", "Skickar…", "Отправка…", "Wysyłanie…"]);
  L(["js_renewing", "Renovando…", "Renewing…", "Erneuern…", "Renouvellement…", "Vernieuwen…", "Rinnovo…", "A renovar…", "Fornyer…", "Förnyar…", "Обновление…", "Odnawianie…"]);
  L(["js_account_ok", "Cuenta creada", "Account created", "Konto erstellt", "Compte créé", "Account aangemaakt", "Account creato", "Conta criada", "Konto opprettet", "Konto skapat", "Аккаунт создан", "Konto utworzone"]);
  L(["js_session_ok", "Sesión iniciada", "Signed in", "Angemeldet", "Connecté", "Ingelogd", "Accesso eseguito", "Sessão iniciada", "Innlogget", "Inloggad", "Вход выполнен", "Zalogowano"]);
  L(["js_pass_mismatch", "Las contraseñas no coinciden", "Passwords do not match", "Passwörter stimmen nicht überein", "Les mots de passe ne correspondent pas", "Wachtwoorden komen niet overeen", "Le password non coincidono", "As palavras-passe não coincidem", "Passordene stemmer ikke", "Lösenorden matchar inte", "Пароли не совпадают", "Hasła nie są zgodne"]);
  L(["js_error", "Error", "Error", "Fehler", "Erreur", "Fout", "Errore", "Erro", "Feil", "Fel", "Ошибка", "Błąd"]);
  L(["js_fav_on", "Guardado en favoritos", "Saved to favorites", "Zu Favoriten hinzugefügt", "Ajouté aux favoris", "Opgeslagen in favorieten", "Salvato nei preferiti", "Guardado nos favoritos", "Lagret i favoritter", "Sparad i favoriter", "В избранном", "Dodano do ulubionych"]);
  L(["js_fav_off", "Quitado de favoritos", "Removed from favorites", "Aus Favoriten entfernt", "Retiré des favoris", "Uit favorieten verwijderd", "Rimosso dai preferiti", "Removido dos favoritos", "Fjernet fra favoritter", "Borttagen från favoriter", "Убрано из избранного", "Usunięto z ulubionych"]);
  L(["js_link_copied", "Link copiado", "Link copied", "Link kopiert", "Lien copié", "Link gekopieerd", "Link copiato", "Link copiado", "Lenke kopiert", "Länk kopierad", "Ссылка скопирована", "Link skopiowany"]);
  L(["js_pin_copied", "PIN copiado", "PIN copied", "PIN kopiert", "PIN copié", "PIN gekopieerd", "PIN copiato", "PIN copiado", "PIN kopiert", "PIN kopierad", "PIN скопирован", "PIN skopiowany"]);
  L(["js_published", "✓ Anuncio publicado", "✓ Ad published", "✓ Anzeige veröffentlicht", "✓ Annonce publiée", "✓ Ad gepubliceerd", "✓ Annuncio pubblicato", "✓ Anúncio publicado", "✓ Annonse publisert", "✓ Annons publicerad", "✓ Объявление опубликовано", "✓ Ogłoszenie opublikowane"]);
  L(["js_access_ok", "Acceso correcto", "Access granted", "Zugang OK", "Accès OK", "Toegang OK", "Accesso OK", "Acesso OK", "Tilgang OK", "Åtkomst OK", "Доступ OK", "Dostęp OK"]);
  L(["js_no_ads", "Sin anuncios aún", "No ads yet", "Noch keine Anzeigen", "Pas encore d’annonces", "Nog geen ads", "Nessun annuncio ancora", "Sem anúncios ainda", "Ingen annonser ennå", "Inga annonser än", "Пока нет объявлений", "Brak ogłoszeń"]);
  L(["js_no_ads_p", "Publica tu primer anuncio para gestionarlo aquí.", "Publish your first ad to manage it here.", "Inseriere deine erste Anzeige, um sie hier zu verwalten.", "Publie ta première annonce pour la gérer ici.", "Publiceer je eerste ad om hier te beheren.", "Pubblica il primo annuncio per gestirlo qui.", "Publica o teu primeiro anúncio para o gerir aqui.", "Publiser din første annonse for å administrere her.", "Publicera din första annons för att hantera här.", "Опубликуй первое объявление, чтобы управлять здесь.", "Dodaj pierwsze ogłoszenie, by zarządzać tutaj."]);
  L(["js_publish_ad", "Publicar anuncio", "Publish ad", "Anzeige inserieren", "Publier une annonce", "Ad publiceren", "Pubblica annuncio", "Publicar anúncio", "Publiser annonse", "Publicera annons", "Опубликовать", "Opublikuj"]);
  L(["js_show", "Ver", "Show", "Zeigen", "Afficher", "Tonen", "Mostra", "Mostrar", "Vis", "Visa", "Показать", "Pokaż"]);
  L(["js_hide", "Ocultar", "Hide", "Ausblenden", "Masquer", "Verbergen", "Nascondi", "Ocultar", "Skjul", "Dölj", "Скрыть", "Ukryj"]);
  L(["js_paused", "Anuncio pausado", "Ad paused", "Anzeige pausiert", "Annonce en pause", "Ad gepauzeerd", "Annuncio in pausa", "Anúncio em pausa", "Annonse pauset", "Annons pausad", "Объявление на паузе", "Ogłoszenie wstrzymane"]);
  L(["js_paused_p", "No aparece en el listado. Reactívalo y asegúrate de tener el día pagado.", "Not in the list. Reactivate it and make sure the day is paid.", "Nicht in der Liste. Reaktiviere und stelle sicher, dass der Tag bezahlt ist.", "Pas dans la liste. Réactive et vérifie que le jour est payé.", "Niet in de lijst. Activeer opnieuw en check of de dag betaald is.", "Non in elenco. Riattiva e assicurati che il giorno sia pagato.", "Não está na lista. Reativa e confirma que o dia está pago.", "Ikke i listen. Reaktiver og sørg for at dagen er betalt.", "Inte i listan. Aktivera igen och se till att dagen är betald.", "Нет в списке. Активируй снова и проверь оплату дня.", "Nie ma na liście. Aktywuj ponownie i upewnij się, że dzień jest opłacony."]);
  L(["js_off_list", "Fuera del listado público", "Off the public list", "Nicht in der öffentlichen Liste", "Hors liste publique", "Buiten openbare lijst", "Fuori elenco pubblico", "Fora da lista pública", "Utenfor offentlig liste", "Utanför offentlig lista", "Вне публичного списка", "Poza listą publiczną"]);
  L(["js_renew_soon", "Renueva el día ahora para no caer del listado esta noche.", "Renew the day now so you don’t drop off the list tonight.", "Erneuere den Tag jetzt, damit du heute Nacht nicht rausfällst.", "Renouvelle le jour maintenant pour ne pas tomber ce soir.", "Vernieuw de dag nu zodat je vannacht niet verdwijnt.", "Rinnova il giorno ora per non sparire stasera.", "Renova o dia agora para não saíres esta noite.", "Forny dagen nå så du ikke forsvinner i natt.", "Förnya dagen nu så du inte åker ur listan i natt.", "Обнови день сейчас, чтобы не выпасть из списка ночью.", "Odnów dzień teraz, by nie spaść z listy dziś w nocy."]);
  L(["js_visible", "Visible en el listado", "Visible in the list", "Sichtbar im Verzeichnis", "Visible dans la liste", "Zichtbaar in de lijst", "Visibile in elenco", "Visível na lista", "Synlig i listen", "Synlig i listan", "Видна в списке", "Widoczna na liście"]);
  L(["js_review_form", "Revisa el formulario", "Check the form", "Formular prüfen", "Vérifie le formulaire", "Controleer het formulier", "Controlla il modulo", "Revê o formulário", "Sjekk skjemaet", "Kontrollera formuläret", "Проверь форму", "Sprawdź formularz"]);
  L(["js_publish_fail", "No se pudo publicar", "Could not publish", "Veröffentlichen fehlgeschlagen", "Échec de la publication", "Publiceren mislukt", "Pubblicazione non riuscita", "Não foi possível publicar", "Kunne ikke publisere", "Kunde inte publicera", "Не удалось опубликовать", "Nie udało się opublikować"]);
  L(["js_err_age", "Edad mínima 18 años.", "Minimum age 18.", "Mindestalter 18.", "Âge minimum 18 ans.", "Minimumleeftijd 18.", "Età minima 18.", "Idade mínima 18.", "Minimumsalder 18.", "Minsta ålder 18.", "Минимум 18 лет.", "Minimalny wiek 18."]);
  L(["js_err_zone", "Elige una zona de Benidorm.", "Choose a Benidorm area.", "Wähle ein Gebiet in Benidorm.", "Choisis une zone à Benidorm.", "Kies een wijk in Benidorm.", "Scegli una zona a Benidorm.", "Escolhe uma zona em Benidorm.", "Velg en sone i Benidorm.", "Välj ett område i Benidorm.", "Выбери район Бенидорма.", "Wybierz strefę w Benidorm."]);
  L(["js_err_price", "Tarifa mínima 50 €/h.", "Minimum rate 50 €/h.", "Mindesttarif 50 €/h.", "Tarif minimum 50 €/h.", "Minimumtarief 50 €/u.", "Tariffa minima 50 €/h.", "Tarifa mínima 50 €/h.", "Minimumspris 50 €/t.", "Minimipris 50 €/t.", "Минимум 50 €/ч.", "Minimalna stawka 50 €/h."]);
  L(["js_err_phone", "WhatsApp / teléfono inválido.", "Invalid WhatsApp / phone.", "Ungültiges WhatsApp / Telefon.", "WhatsApp / téléphone invalide.", "Ongeldige WhatsApp / telefoon.", "WhatsApp / telefono non valido.", "WhatsApp / telefone inválido.", "Ugyldig WhatsApp / telefon.", "Ogiltig WhatsApp / telefon.", "Неверный WhatsApp / телефон.", "Nieprawidłowy WhatsApp / telefon."]);
  L(["js_err_login", "Debes iniciar sesión para publicar.", "You must log in to publish.", "Zum Inserieren musst du dich anmelden.", "Tu dois te connecter pour publier.", "Je moet inloggen om te publiceren.", "Devi accedere per pubblicare.", "Tens de entrar para publicar.", "Du må logge inn for å publisere.", "Du måste logga in för att publicera.", "Нужен вход для публикации.", "Musisz się zalogować, by dodać ogłoszenie."]);
  L(["js_err_desc", "Descripción: mínimo 20 caracteres.", "Description: min. 20 characters.", "Beschreibung: mind. 20 Zeichen.", "Description : min. 20 caractères.", "Beschrijving: min. 20 tekens.", "Descrizione: min. 20 caratteri.", "Descrição: mín. 20 caracteres.", "Beskrivelse: min. 20 tegn.", "Beskrivning: min. 20 tecken.", "Описание: мин. 20 символов.", "Opis: min. 20 znaków."]);
  L(["js_err_legal", "Debes aceptar el aviso legal.", "You must accept the legal notice.", "Du musst das Impressum akzeptieren.", "Tu dois accepter les mentions légales.", "Je moet de juridische voorwaarden accepteren.", "Devi accettare l’informativa legale.", "Tens de aceitar o aviso legal.", "Du må godta juridiske vilkår.", "Du måste godkänna juridisk info.", "Нужно принять правовые условия.", "Musisz zaakceptować regulamin."]);
  L(["js_ticker_1", "Solo Benidorm", "Benidorm only", "Nur Benidorm", "100% Benidorm", "Alleen Benidorm", "Solo Benidorm", "Só Benidorm", "Bare Benidorm", "Bara Benidorm", "Только Бенидорм", "Tylko Benidorm"]);
  L(["js_ticker_2", "Calidad verificada", "Verified quality", "Geprüfte Qualität", "Qualité vérifiée", "Geverifieerde kwaliteit", "Qualità verificata", "Qualidade verificada", "Verifisert kvalitet", "Verifierad kvalitet", "Проверенное качество", "Zweryfikowana jakość"]);
  L(["js_ticker_3", "Sin intermediarios", "No middlemen", "Ohne Vermittler", "Sans intermédiaire", "Geen tussenpersoon", "Senza intermediari", "Sem intermediários", "Uten mellomledd", "Inga mellanhänder", "Без посредников", "Bez pośredników"]);
  L(["js_ticker_4", "Contacto directo", "Direct contact", "Direkter Kontakt", "Contact direct", "Direct contact", "Contatto diretto", "Contacto direto", "Direkte kontakt", "Direktkontakt", "Прямой контакт", "Bezpośredni kontakt"]);
  L(["js_empty_fav", "No hay favoritos todavía.", "No favorites yet.", "Noch keine Favoriten.", "Pas encore de favoris.", "Nog geen favorieten.", "Nessun preferito ancora.", "Ainda sem favoritos.", "Ingen favoritter ennå.", "Inga favoriter än.", "Пока нет избранного.", "Brak ulubionych."]);
  L(["js_max_photos", "Máximo {n} fotos en este plan", "Maximum {n} photos on this plan", "Maximal {n} Fotos in diesem Plan", "Maximum {n} photos pour ce plan", "Maximaal {n} foto’s op dit plan", "Massimo {n} foto per questo piano", "Máximo {n} fotos neste plano", "Maks {n} bilder på denne planen", "Max {n} foton på denna plan", "Максимум {n} фото на этом плане", "Maks. {n} zdjęć w tym planie"]);
  L(["js_photo_deleted", "Foto eliminada", "Photo deleted", "Foto gelöscht", "Photo supprimée", "Foto verwijderd", "Foto eliminata", "Foto eliminada", "Bilde slettet", "Foto borttagen", "Фото удалено", "Zdjęcie usunięte"]);
  L(["js_check_email", "Revisa tu email", "Check your email", "Prüfe deine E-Mail", "Vérifie ton email", "Check je e-mail", "Controlla la tua email", "Verifica o teu email", "Sjekk e-posten din", "Kolla din e-post", "Проверь email", "Sprawdź e-mail"]);
  L(["js_request_ok", "Solicitud registrada", "Request logged", "Anfrage registriert", "Demande enregistrée", "Aanvraag geregistreerd", "Richiesta registrata", "Pedido registado", "Forespørsel registrert", "Förfrågan registrerad", "Заявка принята", "Zgłoszenie zapisane"]);

  // Listings — full DE (and EN fallback for other langs via L())
  L(["list_also", "También:", "Also:", "Auch:"]);
  L(["list_advertise_from", "anunciarse desde 5€/día", "advertise from 5€/day", "inserieren ab 5€/Tag"]);
  L(["list_filters", "Filtros", "Filters", "Filter"]);
  L(["list_close", "Cerrar", "Close", "Schließen"]);
  L(["list_chip_new", "Novedades", "New", "Neu"]);
  L(["list_chip_online", "En línea", "Online", "Online"]);
  L(["list_chip_outcall", "Salidas", "Outcall", "Hausbesuche"]);
  L(["list_chip_indep", "Indep.", "Indep.", "Unabh."]);
  L(["list_nat", "Nacionalidad", "Nationality", "Nationalität"]);
  L(["list_age_from", "Edad desde", "Age from", "Alter ab"]);
  L(["list_age_to", "Edad hasta", "Age to", "Alter bis"]);
  L(["list_sort_age", "Edad ↑", "Age ↑", "Alter ↑"]);
  L(["list_sort_mylang", "Mi idioma", "My language", "Meine Sprache"]);
  L(["list_indep", "Independiente", "Independent", "Unabhängig"]);
  L(["list_outcall", "Salidas / hotel", "Outcall / hotel", "Hausbesuche / Hotel"]);
  L(["list_incall", "Recibe", "Incall", "Empfängt"]);
  L(["list_24h", "24 horas", "24 hours", "24 Stunden"]);
  L(["list_clear", "Limpiar", "Clear", "Zurücksetzen"]);
  L(["list_apply", "Ver resultados", "See results", "Ergebnisse"]);
  L(["list_grid", "Cuadrícula", "Grid", "Raster"]);
  L(["list_list", "Lista", "List", "Liste"]);
  L(["list_plans", "Planes", "Plans", "Pläne"]);
  L(["list_cta_adv", "¿Anunciante?", "Advertiser?", "Inserentin?"]);
  L(["list_cta_pub", "Publica · 24h prueba", "Publish · 24h trial", "Inserieren · 24h Test"]);
  L(["list_cta_day", "desde 5€/día", "from 5€/day", "ab 5€/Tag"]);
  L(["list_cta_manage", "Gestionar con PIN", "Manage with PIN", "Mit PIN verwalten"]);
  L(["list_seo_h2", "Escorts y anuncios de calidad en Benidorm", "Quality escort listings in Benidorm", "Escorts und Qualitätsanzeigen in Benidorm"]);
  L(["list_seo_p1", "En EscortBenidorm encontrarás escorts en Benidorm con información clara: zona real, tarifa, nacionalidad, si reciben o hacen salidas, y WhatsApp o teléfono. Priorizamos calidad.", "On EscortBenidorm you’ll find escorts in Benidorm with clear info: real area, rate, nationality, incall or outcall, and WhatsApp or phone. We prioritise quality.", "Bei EscortBenidorm findest du Escorts in Benidorm mit klaren Angaben: echtes Gebiet, Tarif, Nationalität, Empfang oder Hausbesuche, WhatsApp oder Telefon. Qualität zuerst."]);
  L(["list_seo_h3", "Cómo filtrar… pero solo Benidorm", "How to filter… Benidorm only", "So filterst du… nur Benidorm"]);
  L(["list_seo_li1", "TOP / VIP — destacadas y premium", "TOP / VIP — featured and premium", "TOP / VIP — hervorgehoben und Premium"]);
  L(["list_seo_li2", "Novedades — recién publicadas", "New — just published", "Neu — gerade veröffentlicht"]);
  L(["list_seo_li3", "Independientes — sin intermediarios", "Independent — no middlemen", "Unabhängig — ohne Vermittler"]);
  L(["list_seo_li4", "Salidas — hotel o domicilio en Benidorm", "Outcall — hotel or home in Benidorm", "Hausbesuche — Hotel oder Wohnung in Benidorm"]);
  L(["list_seo_li5", "24h — disponibilidad amplia", "24h — wide availability", "24h — große Verfügbarkeit"]);
  L(["list_seo_p2", "Comparado con portales nacionales, aquí no mezclamos otras ciudades: todo es Benidorm. Confirma zona por WhatsApp antes de quedar.", "Unlike national portals, we don’t mix other cities: everything is Benidorm. Confirm the area on WhatsApp before meeting.", "Anders als nationale Portale mischen wir keine Städte: alles ist Benidorm. Bestätige das Gebiet per WhatsApp vor dem Treffen."]);
  L(["card_view", "Ver", "View", "Ansehen"]);
  L(["card_incall", "Recibe", "Incall", "Empfängt"]);
  L(["card_outcall", "Salidas", "Outcall", "Hausbesuche"]);
  L(["card_new", "Nueva", "New", "Neu"]);
  L(["card_real", "Real", "Real", "Echt"]);
  L(["card_indep", "Indep.", "Indep.", "Unabh."]);

  // Prices / credits page
  L(["pr_buy_h2", "1. Comprar créditos", "1. Buy credits", "1. Credits kaufen"]);
  L(["pr_amount_label", "Importe a recargar (€)", "Amount to top up (€)", "Aufladebetrag (€)"]);
  L(["pr_amount_hint", "1 – 1000 · sin decimales", "1 – 1000 · integers only", "1 – 1000 · nur ganze Zahlen"]);
  L(["pr_buy_btn", "Comprar esta cantidad", "Buy this amount", "Diesen Betrag kaufen"]);
  L(["pr_shortcuts", "Atajos rápidos:", "Quick amounts:", "Schnellbeträge:"]);
  L(["pr_spend_h2", "2. Gastar en servicios (por día)", "2. Spend on services (per day)", "2. Services ausgeben (pro Tag)"]);
  L(["pr_how_h2", "Cómo funciona", "How it works", "So funktioniert’s"]);
  L(["pr_step1", "Regístrate (email + teléfono).", "Sign up (email + phone).", "Registrieren (E-Mail + Telefon)."]);
  L(["pr_step2", "Recarga entre 1 y 1000 € (enteros; 50–999 +20%, 1000 +50%).", "Top up 1 to 1000 € (integers; 50–999 +20%, 1000 +50%).", "1 bis 1000 € aufladen (ganze Zahlen; 50–999 +20%, 1000 +50%)."]);
  L(["pr_step3", "Al confirmar el pago, los créditos entran en tu saldo.", "When payment is confirmed, credits go to your balance.", "Nach Zahlungsbestätigung landen Credits auf deinem Saldo."]);
  L(["pr_step4", "En Mi anuncio gastas créditos para activar Día / VIP / TOP (1 día o packs de 3).", "In My ad you spend credits for Day / VIP / TOP (1 day or 3-day packs).", "Unter Mein Inserat gibst du Credits für Tag / VIP / TOP aus."]);
  L(["pr_step5", "Publicar da 24 h de prueba gratis; después usas créditos para seguir visible.", "Publishing gives a free 24h trial; then use credits to stay visible.", "Veröffentlichen = 24h gratis Test; danach Credits."]);
  L(["pr_pay_h3", "Datos de pago (recarga de créditos)", "Payment details (credit top-up)", "Zahlungsdaten (Credit-Aufladung)"]);
  L(["pr_bizum", "Bizum:", "Bizum:"]);
  L(["pr_iban", "IBAN:", "IBAN:"]);
  L(["pr_holder", "Titular:", "Account holder:", "Kontoinhaber:"]);
  L(["pr_faq_h2", "FAQ", "FAQ"]);
  L(["pr_faq1_q", "¿Hay bonus por recargar mucho?", "Is there a bonus for larger top-ups?", "Gibt es Bonus bei größerer Aufladung?"]);
  L(["pr_faq1_a", "50–999 € → +20% de créditos. 1000 € → +50%. Ej.: 50→60 · 100→120 · 500→600 · 1000→1500. Importes 1–49 sin bonus.", "50–999 € → +20% credits. 1000 € → +50%. E.g. 50→60 · 100→120 · 500→600 · 1000→1500. Amounts 1–49 have no bonus.", "50–999 € → +20%. 1000 € → +50%. Z.B. 50→60 · 100→120 · 1000→1500."]);
  L(["pr_faq2_q", "¿Puedo poner decimales (10,50 €)?", "Can I use decimals (10.50 €)?", "Darf ich Dezimalstellen nutzen?"]);
  L(["pr_faq2_a", "No. Solo números enteros del 1 al 1000.", "No. Only whole numbers from 1 to 1000.", "Nein. Nur ganze Zahlen 1–1000."]);
  L(["pr_faq3_q", "¿Caducan los créditos?", "Do credits expire?", "Verfallen Credits?"]);
  L(["pr_faq3_a", "No hay caducidad automática. Los usas cuando quieras en visibilidad.", "No automatic expiry. Use them whenever you want on visibility.", "Kein automatisches Verfallen."]);
  L(["pr_faq4_q", "¿Puedo pagar un día sin recargar?", "Can I pay for one day without topping up?", "Kann ich einen Tag ohne Aufladung zahlen?"]);
  L(["pr_faq4_a", "El modelo es por créditos. Si te falta saldo, recarga y gasta en Mi anuncio.", "Credits only. If you lack balance, top up and spend in My ad.", "Nur Credits. Aufladen und unter Mein Inserat ausgeben."]);
  L(["pr_faq5_q", "¿Cómo pago con Bizum?", "How do I pay with Bizum?", "Wie zahle ich mit Bizum?"]);
  L(["pr_faq5_a", "Al comprar recibes un código EB-XXXX. Envía el importe por Bizum con ese concepto y confirma en el checkout.", "When you buy you get code EB-XXXX. Send the amount via Bizum with that reference and confirm in checkout.", "Du bekommst Code EB-XXXX. Sende den Betrag per Bizum mit diesem Verwendungszweck."]);
  L(["pr_bal_login", "Saldo: inicia sesión", "Balance: log in", "Guthaben: anmelden"]);
  L(["pr_bal_you", "Tu saldo:", "Your balance:", "Dein Guthaben:"]);
  L(["pr_bal_spend", "Gastar en mi anuncio", "Spend in My ad", "In Mein Inserat ausgeben"]);
  L(["pr_bal_fail", "No se pudo cargar el saldo.", "Could not load balance.", "Guthaben konnte nicht geladen werden."]);
  L(["pr_pay", "Pagas", "You pay", "Du zahlst"]);
  L(["pr_base", "base", "base"]);
  L(["pr_get", "recibes", "you get", "du erhältst"]);
  L(["pr_credits", "créditos", "credits", "Credits"]);
  L(["pr_no_bonus", "(sin bonus; a partir de 50€ hay +20%)", "(no bonus; from 50€ you get +20%)", "(kein Bonus; ab 50€ +20%)"]);
  L(["pr_ints_only", "Solo enteros, sin decimales", "Integers only, no decimals", "Nur ganze Zahlen, keine Dezimalen"]);
  L(["pr_login_buy", "Inicia sesión para comprar créditos", "Log in to buy credits", "Anmelden, um Credits zu kaufen"]);
  L(["pr_order_fail", "No se pudo crear el pedido", "Could not create order", "Bestellung fehlgeschlagen"]);
  L(["pr_no_bonus_li", "Sin bonus", "No bonus", "Kein Bonus"]);
  L(["pr_gift", "de regalo", "bonus free", "gratis Bonus"]);
  L(["pr_choose", "Elegir", "Choose", "Wählen"]);
  L(["pr_cr_short", "créd.", "cr.", "Cr."]);
  L(["pr_vis_24", "Visibilidad 24 h", "24h visibility", "24h Sichtbarkeit"]);
  L(["pr_per_day", "créditos / día", "credits / day", "Credits / Tag"]);
  L(["pr_from_bal", "Se descuenta de tu saldo", "Deducted from your balance", "Wird vom Guthaben abgezogen"]);
  L(["pr_activate", "Activa o renueva en Mi anuncio", "Activate or renew in My ad", "Aktivieren/erneuern unter Mein Inserat"]);
  L(["pr_spend_btn", "Gastar créditos", "Spend credits", "Credits ausgeben"]);
  L(["pr_load_fail", "No se pudieron cargar los packs. ¿Servidor en marcha?", "Could not load packs. Is the server running?", "Packs nicht geladen. Läuft der Server?"]);
  L(["pr_pub_trial", "Publicar · 24h prueba", "Publish · 24h trial", "Inserieren · 24h Test"]);
  L(["cookie_text", "Usamos cookies técnicas y, si las activas, de medición para mejorar EscortBenidorm. Al continuar aceptas la política de privacidad.", "We use technical cookies and, if you enable them, measurement cookies to improve EscortBenidorm. By continuing you accept the privacy policy.", "Wir nutzen technische Cookies und, wenn du sie aktivierst, Mess-Cookies. Mit dem Fortfahren akzeptierst du die Datenschutzrichtlinie.", "Nous utilisons des cookies techniques et, si tu les actives, de mesure. En continuant tu acceptes la politique de confidentialité.", "We gebruiken technische cookies en, als je ze activeert, meetcookies. Door verder te gaan accepteer je het privacybeleid.", "Usiamo cookie tecnici e, se li attivi, di misurazione. Continuando accetti l’informativa sulla privacy.", "Usamos cookies técnicos e, se os ativares, de medição. Ao continuar aceitas a política de privacidade.", "Vi bruker tekniske informasjonskapsler og, hvis du aktiverer dem, måling. Ved å fortsette godtar du personvernreglene.", "Vi använder tekniska cookies och, om du aktiverar dem, mätning. Genom att fortsätta godkänner du integritetspolicyn.", "Мы используем технические cookie и, если вы включите, аналитические. Продолжая, вы принимаете политику конфиденциальности.", "Używamy plików cookie technicznych i, jeśli je włączysz, pomiarowych. Kontynuując, akceptujesz politykę prywatności."]);
  L(["cookie_reject", "Solo técnicas", "Essential only", "Nur technisch", "Essentiels seulement", "Alleen technisch", "Solo tecnici", "Só técnicas", "Kun tekniske", "Endast tekniska", "Только технические", "Tylko techniczne"]);
  L(["cookie_accept", "Aceptar", "Accept", "Akzeptieren", "Accepter", "Accepteren", "Accetta", "Aceitar", "Godta", "Acceptera", "Принять", "Akceptuj"]);
})();

const I18N_STATE = {
  lang: "en",
};

function isValidLang(code) {
  return I18N_CODES.includes(code);
}

/** Persist language hard — survives tabs, pages, and partial storage failures */
function persistLang(code) {
  if (!isValidLang(code)) code = "en";
  try {
    localStorage.setItem("eb_lang", code);
  } catch (_) {}
  try {
    // 400 days — stays until user changes language
    document.cookie = `eb_lang=${code};path=/;max-age=34560000;SameSite=Lax`;
  } catch (_) {}
  return code;
}

function readLangCookie() {
  try {
    const m = document.cookie.match(/(?:^|;\s*)eb_lang=([a-z]{2})/);
    if (m && isValidLang(m[1])) return m[1];
  } catch (_) {}
  return null;
}

/**
 * Detect language in priority order (never forget user choice):
 * 1) ?lang=de  2) localStorage  3) cookie  4) browser  5) English
 */
function i18nDetect() {
  const fromBrowser = () => {
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    const primary = nav.split("-")[0];
    if (primary === "ca" || primary === "gl" || primary === "eu") return "es";
    if (primary === "nb" || primary === "nn" || primary === "da") return "no";
    if (isValidLang(primary)) return primary;
    return "en";
  };

  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q) {
      const code = String(q).toLowerCase().split("-")[0];
      if (isValidLang(code)) return persistLang(code);
    }
  } catch (_) {}

  try {
    const saved = localStorage.getItem("eb_lang");
    if (saved && isValidLang(saved)) {
      persistLang(saved); // refresh cookie
      return saved;
    }
  } catch (_) {}

  const fromCookie = readLangCookie();
  if (fromCookie) {
    try {
      localStorage.setItem("eb_lang", fromCookie);
    } catch (_) {}
    return fromCookie;
  }

  return persistLang(fromBrowser());
}

function t(key, vars) {
  const pack = I18N.dict[key];
  const lang = isValidLang(I18N_STATE.lang) ? I18N_STATE.lang : "en";
  // Active language first, then English, then Spanish — never show raw keys
  let s = (pack && (pack[lang] || pack.en || pack.es)) || "";
  if (!s) s = "";
  if (vars) {
    Object.keys(vars).forEach((k) => {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
    });
  }
  return s;
}

function setLang(code) {
  code = String(code || "en").toLowerCase().split("-")[0];
  if (!isValidLang(code)) code = "en";
  I18N_STATE.lang = persistLang(code);
  document.documentElement.lang = code;
  document.documentElement.setAttribute("data-lang", code);
  // Full re-paint of static + nav chrome
  applyI18n();
  document.querySelectorAll("[data-lang-chips] .lang-chip, [data-lang-option]").forEach((chip) => {
    const c = chip.getAttribute("data-lang-option");
    if (c) chip.classList.toggle("active", c === code);
  });
  updateLangSwitcherUI();
  // Let app.js rebuild dynamic lists/auth bars in the new language
  window.dispatchEvent(new CustomEvent("eb:lang", { detail: { lang: code } }));
  // Second pass after any dynamic injectors
  setTimeout(() => {
    try {
      applyI18n();
      updateLangSwitcherUI();
    } catch (_) {}
  }, 0);
  setTimeout(() => {
    try {
      applyI18n();
    } catch (_) {}
  }, 120);
}

/** Nav / CTA href → i18n key (covers pages without data-i18n on every link) */
const NAV_HREF_MAP = [
  { re: /putas-benidorm\.html/i, key: "nav_putas" },
  { re: /scorts-benidorm\.html/i, key: "nav_scorts" },
  { re: /escorts-benidorm\.html/i, key: "nav_escorts" },
  { re: /anuncios\.html/i, key: "nav_ads" },
  { re: /favoritos\.html/i, key: "nav_favs" },
  { re: /zonas\.html/i, key: "nav_zones" },
  { re: /publicar\.html/i, key: "nav_publish" },
  { re: /precios\.html/i, key: "nav_prices" },
  { re: /registro\.html/i, key: "nav_register" },
  { re: /login\.html/i, key: "nav_login" },
  { re: /mi-anuncio\.html/i, key: "nav_myad" },
  { re: /blog\//i, key: "nav_guide" },
  { re: /contacto\.html/i, key: "nav_ads" }, // fallback if no contact key
  { re: /index\.html$/i, key: "nav_home" },
  { re: /\/$|\/#$/i, key: "nav_home" },
];

function applyNavI18n(root = document) {
  const selectors = [
    ".nav-desktop a",
    ".nav-mobile a",
    ".site-header .header-cta.btn",
    ".site-header a.btn",
    ".mobile-cta-bar a",
    ".footer-bottom a",
    ".breadcrumb a",
    ".hero-actions a",
    ".form-hint a",
  ];
  root.querySelectorAll(selectors.join(",")).forEach((a) => {
    if (a.classList.contains("logo")) return;
    const href = a.getAttribute("href") || "";
    const hit = NAV_HREF_MAP.find((x) => x.re.test(href));

    // Nested i18n span: update span + aria
    const nested = a.querySelector(":scope > [data-i18n]");
    if (nested) {
      const key = (nested.getAttribute("data-i18n") || "").trim();
      if (key && I18N.dict[key]) nested.textContent = t(key);
      if (hit) {
        a.setAttribute("aria-label", t(hit.key));
        a.setAttribute("title", t(hit.key));
      }
      return;
    }

    if (a.hasAttribute("data-i18n") || a.hasAttribute("data-i18n-html")) return;

    if (a.querySelector("[data-icon], .fav-badge, [data-fav-count], svg, img")) {
      if (hit) {
        const label = t(hit.key);
        a.setAttribute("aria-label", label);
        a.setAttribute("title", label);
        a.childNodes.forEach((n) => {
          if (n.nodeType === 3 && n.textContent.trim()) n.textContent = " " + label + " ";
        });
      }
      return;
    }

    if (!hit) return;
    if (a.classList.contains("btn-primary") || a.classList.contains("btn-gold")) {
      if (/publicar/i.test(href)) {
        a.textContent = t("nav_cta");
        return;
      }
      if (/anuncios/i.test(href)) {
        a.textContent = t("see_listings");
        return;
      }
      if (/registro/i.test(href)) {
        a.textContent = t("create_account");
        return;
      }
    }
    a.textContent = t(hit.key);
  });
  root.querySelectorAll(".site-header a.btn-primary, .site-header a.btn-sm.btn-primary").forEach((a) => {
    if (a.hasAttribute("data-i18n")) return;
    if (a.querySelector("[data-i18n], [data-icon]")) return;
    const href = a.getAttribute("href") || "";
    if (/publicar/i.test(href)) a.textContent = t("nav_cta");
    else if (/anuncios/i.test(href)) a.textContent = t("see_listings");
    else if (/registro/i.test(href)) a.textContent = t("create_account");
  });
}

function applyAgeGateI18n(root = document) {
  const gate = root.querySelector("#age-gate") || root;
  const h2 = gate.querySelector?.("#age-gate h2") || document.querySelector("#age-gate h2");
  const p = document.querySelector("#age-gate p");
  const yes = document.querySelector("#age-yes");
  const no = document.querySelector("#age-no");
  if (h2 && !h2.hasAttribute("data-i18n")) h2.textContent = t("age_title");
  if (p && !p.hasAttribute("data-i18n")) p.textContent = t("age_text");
  if (yes && !yes.hasAttribute("data-i18n")) yes.textContent = t("age_yes");
  if (no && !no.hasAttribute("data-i18n")) no.textContent = t("age_no");
  document.querySelectorAll(".menu-toggle").forEach((btn) => {
    if (!btn.hasAttribute("data-i18n")) btn.setAttribute("aria-label", t("menu"));
  });
}

function applyI18n(root = document) {
  const scope = root && root.querySelectorAll ? root : document;
  // Translate every marked node — including nested spans inside nav links
  scope.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = (el.getAttribute("data-i18n") || "").trim();
    if (!key || !I18N.dict[key]) return;
    const attr = el.getAttribute("data-i18n-attr");
    const val = t(key);
    if (!val) return;
    if (attr) {
      el.setAttribute(attr, val);
      // If it's only an aria/title binding, still set visible text when empty of children
      if (!el.children.length && el.childNodes.length <= 1) {
        /* keep text if not purely attr target — attr-only buttons keep glyphs */
      }
    } else {
      el.textContent = val;
    }
  });
  scope.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = (el.getAttribute("data-i18n-html") || "").trim();
    if (!key || !I18N.dict[key]) return;
    const val = t(key);
    if (val) el.innerHTML = val;
  });
  scope.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = (el.getAttribute("data-i18n-placeholder") || "").trim();
    if (!key || !I18N.dict[key]) return;
    const val = t(key);
    if (val) el.placeholder = val;
  });
  // <option data-i18n> — force update (some browsers cache option labels)
  scope.querySelectorAll("option[data-i18n]").forEach((opt) => {
    const key = (opt.getAttribute("data-i18n") || "").trim();
    if (!key || !I18N.dict[key]) return;
    const val = t(key);
    if (val) {
      opt.textContent = val;
      opt.label = val;
    }
  });
  const titleEl = document.querySelector("title[data-i18n-title]");
  if (titleEl) {
    const key = titleEl.getAttribute("data-i18n-title");
    if (key && I18N.dict[key]) document.title = t(key);
  }
  applyNavI18n(document);
  applyAgeGateI18n(document);
  updateLangSwitcherUI();
}

function updateLangSwitcherUI() {
  const cur = I18N.langs.find((l) => l.code === I18N_STATE.lang);
  document.querySelectorAll("[data-lang-current]").forEach((el) => {
    el.textContent = cur ? `${cur.flag} ${cur.short}` : I18N_STATE.lang.toUpperCase();
  });
  document.querySelectorAll("[data-lang-option]").forEach((btn) => {
    const c = btn.getAttribute("data-lang-option");
    btn.classList.toggle("active", c === I18N_STATE.lang);
  });
}

function buildLangSwitcherHTML() {
  const options = I18N.langs
    .map(
      (l) =>
        `<button type="button" class="lang-opt" data-lang-option="${l.code}" role="option">
          <span class="lang-flag">${l.flag}</span>
          <span class="lang-name">${l.name}</span>
          <span class="lang-code">${l.short}</span>
        </button>`
    )
    .join("");
  return `
    <div class="lang-switcher">
      <button type="button" class="lang-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Language">
        <span data-lang-current>🇪🇸 ES</span>
        <span class="lang-caret">▾</span>
      </button>
      <div class="lang-menu" role="listbox" hidden>
        <div class="lang-menu-title" data-i18n="lang_picker">Idioma</div>
        ${options}
      </div>
    </div>
  `;
}

/** Inject language switcher: header + always-visible floating control on every page. */
function ensureLangMounts() {
  // 1) Floating switcher — always present, never hidden by header CSS
  if (!document.getElementById("eb-lang-fab")) {
    const fab = document.createElement("div");
    fab.id = "eb-lang-fab";
    fab.className = "lang-fab";
    fab.setAttribute("data-lang-mount", "");
    fab.setAttribute("data-lang-fab", "1");
    fab.setAttribute("aria-label", "Language");
    (document.body || document.documentElement).appendChild(fab);
  }

  const header = document.querySelector(".site-header");
  if (header) {
    const inner = header.querySelector(".header-inner") || header;
    if (!header.querySelector("[data-lang-mount]:not([data-lang-fab])")) {
      const mount = document.createElement("div");
      mount.setAttribute("data-lang-mount", "");
      mount.className = "header-cta lang-mount-header";
      mount.style.cssText = "display:inline-flex;align-items:center;max-width:none;overflow:visible";

      const actions = header.querySelector(".header-actions");
      if (actions) {
        const primary = actions.querySelector("a.btn-primary, a.btn-gold");
        if (primary) actions.insertBefore(mount, primary);
        else actions.appendChild(mount);
      } else {
        const cta = inner.querySelector("a.btn-primary, a.header-cta.btn, a.btn-sm");
        const toggle = inner.querySelector(".menu-toggle");
        if (cta) inner.insertBefore(mount, cta);
        else if (toggle) inner.insertBefore(mount, toggle);
        else inner.appendChild(mount);
      }
    }

    const mobile = header.querySelector(".nav-mobile");
    if (mobile && !mobile.querySelector("[data-lang-mount]")) {
      const m = document.createElement("div");
      m.setAttribute("data-lang-mount", "");
      m.style.cssText = "padding:0.5rem 1rem;display:flex";
      mobile.appendChild(m);
    }
  }
}

function bindLangSwitcherBox(box) {
  if (!box || box.dataset.bound) return;
  box.dataset.bound = "1";
  const btn = box.querySelector(".lang-btn");
  const menu = box.querySelector(".lang-menu");
  if (!btn || !menu) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".lang-menu").forEach((m) => {
      if (m !== menu) m.hidden = true;
    });
    menu.hidden = !menu.hidden;
    btn.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
  });
  menu.querySelectorAll("[data-lang-option]").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      setLang(opt.getAttribute("data-lang-option"));
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

function initLangSwitcher() {
  ensureLangMounts();

  document.querySelectorAll("[data-lang-mount]").forEach((mount) => {
    if (!mount.dataset.ready) {
      mount.innerHTML = buildLangSwitcherHTML();
      mount.dataset.ready = "1";
    }
    const box = mount.querySelector(".lang-switcher");
    bindLangSwitcherBox(box);
  });

  if (!window.__ebLangDocClick) {
    window.__ebLangDocClick = true;
    document.addEventListener("click", () => {
      document.querySelectorAll(".lang-menu").forEach((m) => {
        m.hidden = true;
      });
      document.querySelectorAll(".lang-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
    });
  }

  document.querySelectorAll("[data-lang-chips]").forEach((bar) => {
    if (bar.dataset.ready) return;
    bar.dataset.ready = "1";
    bar.innerHTML = I18N.langs
      .map(
        (l) =>
          `<button type="button" class="lang-chip ${l.code === I18N_STATE.lang ? "active" : ""}" data-lang-option="${l.code}" title="${l.name}">${l.flag}<span>${l.short}</span></button>`
      )
      .join("");
    bar.querySelectorAll("[data-lang-option]").forEach((b) => {
      b.addEventListener("click", () => setLang(b.getAttribute("data-lang-option")));
    });
  });

  document.documentElement.lang = I18N_STATE.lang;
  document.documentElement.setAttribute("data-lang", I18N_STATE.lang);
  updateLangSwitcherUI();
}

/** Boot UI without waiting for app.js — every page that loads i18n.js gets a switcher. */
function bootI18nUI() {
  if (window.__ebI18nBooted) {
    // re-apply if DOM grew (e.g. late header)
    try {
      ensureLangMounts();
      document.querySelectorAll("[data-lang-mount]").forEach((mount) => {
        if (!mount.dataset.ready) {
          mount.innerHTML = buildLangSwitcherHTML();
          mount.dataset.ready = "1";
          bindLangSwitcherBox(mount.querySelector(".lang-switcher"));
        }
      });
      applyI18n();
    } catch (_) {}
    return;
  }
  window.__ebI18nBooted = true;
  try {
    initLangSwitcher();
    applyI18n();
  } catch (err) {
    console.error("[i18n] boot failed", err);
  }
}

function profileSpeaksUILang(ad) {
  const ui = (I18N_STATE.lang || "en").toUpperCase();
  const aliases = {
    ES: ["ES"],
    EN: ["EN", "UK"],
    DE: ["DE", "AT"],
    FR: ["FR"],
    NL: ["NL", "BE"],
    IT: ["IT"],
    PT: ["PT", "BR"],
    NO: ["NO", "NB", "NN", "DK"],
    SV: ["SV", "SE"],
    RU: ["RU", "UA"],
    PL: ["PL"],
  };
  const want = aliases[ui] || [ui];
  const has = (ad.languages || []).map((x) => String(x).toUpperCase());
  return want.some((w) => has.includes(w));
}

function zoneLabel(slug, fallback) {
  const z = typeof ZONES !== "undefined" ? ZONES.find((x) => x.slug === slug) : null;
  if (!z) return fallback || slug;
  if (I18N_STATE.lang === "es") return z.name;
  return z.nameEn || z.name;
}

// Boot language immediately (before DOM) so first paint can use correct lang
I18N_STATE.lang = i18nDetect();
try {
  if (typeof document !== "undefined") {
    document.documentElement.lang = I18N_STATE.lang;
    document.documentElement.setAttribute("data-lang", I18N_STATE.lang);
  }
} catch (_) {}

// Self-boot on every page that includes this file
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootI18nUI);
  } else {
    bootI18nUI();
  }
  // Retry after late DOM (headers, drawers)
  setTimeout(bootI18nUI, 50);
  setTimeout(bootI18nUI, 400);
  setTimeout(bootI18nUI, 1000);
}
