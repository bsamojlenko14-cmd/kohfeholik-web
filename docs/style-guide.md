# Style guide — Kaviareň Kohfeholik

Toto je vizuálna referencia, podľa ktorej sa tvorí web kaviarne Kohfeholik.
Štýl vychádza zo sekcie *Vizuálny štýl* v `docs/zadanie-webu.md`: teplá, útulná
kaviareň, prehľadná a čitateľná aj na mobile.

## Celkový dojem

- Teplý, pokojný a vzdušný — „pohár kávy pri okne", nie hlučný e-shop.
- Veľa voľného priestoru, obsah v kartách so zaoblenými rohmi.
- Fotky / ilustrácie jedla a interiéru sú hlavný vizuálny prvok.
- Dôležité informácie (otváracie hodiny, adresa, tlačidlo Rezervovať) sú vždy viditeľné.

## Farby

| Názov | Kód | Použitie |
|---|---|---|
| Espresso | `#3B2A20` | hlavný text, pätička, tmavé pozadie |
| Káva | `#6B4A35` | nadpisy sekcií, ikony |
| Karamel | `#A85723` | hlavné tlačidlá (Rezervovať), odkazy, zvýraznenie |
| Karamel tmavý | `#94491C` | tlačidlo pri prechode myšou |
| Smotana | `#F7F1E8` | pozadie stránky |
| Mliečna pena | `#FFFDF9` | pozadie kariet a formulárov |
| Šalvia | `#5E7457` | štítky „vegánske", „otvorené teraz" |
| Bordó | `#9B2C2C` | chyby vo formulári, „zatvorené" |
| Sivá text | `#5C5048` | doplnkový text (popisy, poznámky) |

Kontrast: všetky kombinácie textu a pozadia spĺňajú WCAG AA (min. 4,5 : 1),
biely text na karamelovom tlačidle `#A85723` ≈ 5,0 : 1 (overené nástrojom Lighthouse).

## Písma

- **Nadpisy:** pätkové písmo — `Georgia, "Times New Roman", serif`, tučné, pôsobí tradične a „kaviarensky".
- **Text, menu, formuláre:** bezpätkové — `system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`.
- Základná veľkosť textu 17 px (1.0625rem), riadkovanie 1,6.
- Nadpis hero: 2,4–3,6 rem (podľa šírky), nadpisy sekcií 2 rem.
- Žiadne písma z internetu (Google Fonts) — iba systémové písma.

## Tlačidlá

- **Hlavné:** karamelové pozadie, biely text, zaoblenie 999 px (tvar „pilulky"), výška min. 44 px.
  Pri prechode myšou tmavší karamel a jemné nadvihnutie.
- **Vedľajšie:** priehľadné pozadie, 2 px rámik vo farbe espresso, rovnaký tvar.
- Viditeľný fokus pri ovládaní klávesnicou: 3 px karamelový obrys s odstupom.

## Karty

- Pozadie mliečna pena, zaoblenie 18 px, jemný tieň `0 6px 20px rgba(59,42,32,.08)`.
- Karta produktu: obrázok/ilustrácia hore, názov, krátky popis, cena vpravo, štítky (vegánske, alergény).

## Ikony a ilustrácie

- Jednoduché čiarové SVG ikony vo farbe káva, hrúbka čiary 2 px.
- Ilustrácie nápojov a dezertov ako SVG vo farbách palety (dajú sa nahradiť fotkami v `img/`).

## Rozloženie

- Max. šírka obsahu 1120 px, okraje 20 px na mobile.
- Hlavička: logo vľavo, menu vpravo, tlačidlo „Rezervovať" vždy viditeľné; na mobile menu cez hamburger.
- Pätička: adresa, otváracie hodiny, kontakt, sociálne siete.
- Mobil first: karty pod sebou, od 700 px 2 stĺpce, od 1000 px 3 stĺpce.
