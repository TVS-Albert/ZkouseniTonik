export const modules = [
  { id:'numbers', name:'Čísla 11–20', subtitle:'Spočítej svůj tým', icon:'11', color:'lime', description:'Od eleven až po twenty. Číslice, slovíčka i počítání předmětů.' },
  { id:'school', name:'Ve škole', subtitle:'Sbal si na trénink', icon:'bag', color:'peach', description:'Poznej školní potřeby a vybavení třídy. Česky i anglicky.' },
  { id:'positions', name:'Kde to je?', subtitle:'Najdi správné místo', icon:'pin', color:'blue', description:'In, on, under a next to. Uč se podle obrázků.' },
  { id:'sentences', name:'Poskládej větu', subtitle:'Vymysli herní taktiku', icon:'tactics', color:'purple', description:'There is, isn’t, are a aren’t. Pozoruj, počítej a odpovídej.' },
];
const numberWords = ['eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const numberCzech = ['jedenáct','dvanáct','třináct','čtrnáct','patnáct','šestnáct','sedmnáct','osmnáct','devatenáct','dvacet'];
export const numbers = numberWords.map((en,i)=>({id:`n${i+11}`,en,cs:numberCzech[i],number:i+11,icon:'number'}));
export const school = [
  ['pen','pero','pens'],['pencil','tužka','pencils'],['ruler','pravítko','rulers'],['eraser','guma','erasers'],['book','kniha','books'],['bag','taška','bags'],['desk','školní lavice','desks'],['table','stůl','tables'],['chair','židle','chairs'],['board','tabule','boards'],['cupboard','skříň','cupboards'],['bookcase','knihovna','bookcases'],['door','dveře','doors'],['classroom','třída','classrooms'],['teacher','učitel / učitelka','teachers'],
].map(([en,cs,plural])=>({id:en,en,cs,plural,icon:en}));
export const extras = [
  ['computer','počítač'],['television','televize'],['whiteboard','bílá popisovací tabule'],['wall','zeď'],['poster','plakát'],['tree','strom'],
  ['purple','fialová'],['blue','modrá'],['pink','růžová'],['black','černá'],['yellow','žlutá'],['green','zelená'],['grey','šedá'],['brown','hnědá'],['orange','oranžová'],
].map(([en,cs])=>({id:en,en,cs,icon:en}));
export const positions = [
  {id:'in',en:'in',cs:'v',sentence:'The pencil is in the bag.',translation:'Tužka je v tašce.'},
  {id:'on',en:'on',cs:'na',sentence:'The pencil is on the desk.',translation:'Tužka je na lavici.'},
  {id:'under',en:'under',cs:'pod',sentence:'The pencil is under the desk.',translation:'Tužka je pod lavicí.'},
  {id:'next-to',en:'next to',cs:'vedle',sentence:'The pencil is next to the bag.',translation:'Tužka je vedle tašky.'},
];
export const grammar = [
  {id:'is',en:'There is',cs:'Je tu…',sentence:'There is a book on the desk.',translation:'Na lavici je kniha.',form:'is',kind:'positive-one',note:'Jedna věc: There is a book. Zkráceně také There’s a book.'},
  {id:'isnt',en:'There isn’t',cs:'Není tu…',sentence:'There isn’t a pencil in the bag.',translation:'V tašce není tužka.',form:"isn't",kind:'negative-one',note:'Zápor s jednotným číslem: There isn’t a pencil. Isn’t = is not.'},
  {id:'are',en:'There are',cs:'Jsou tu…',sentence:'There are three books on the desk.',translation:'Na lavici jsou tři knihy.',form:'are',kind:'positive-many',note:'Více věcí: There are three books. Nezapomeň na množné číslo books.'},
  {id:'arent',en:'There aren’t',cs:'Nejsou tu…',sentence:'There aren’t any pencils in the bag.',translation:'V tašce nejsou žádné tužky.',form:"aren't",kind:'negative-many',note:'Zápor s množným číslem: There aren’t any pencils. Aren’t = are not.'},
  {id:'is-there',en:'Is there a ruler?',cs:'Je tu pravítko?',sentence:'Is there a ruler? Yes, there is.',translation:'Je tu pravítko? Ano, je.',kind:'is-question',note:'Ptáš se na jednu věc: Is there…? Odpověď: Yes, there is. / No, there isn’t.'},
  {id:'are-there',en:'Are there three books?',cs:'Jsou tu tři knihy?',sentence:'Are there three books? No, there aren’t. There are two books.',translation:'Jsou tu tři knihy? Ne, nejsou. Jsou tu dvě knihy.',kind:'are-question',note:'Ptáš se na více věcí: Are there…? Odpověď: Yes, there are. / No, there aren’t.'},
  {id:'how-many',en:'How many pencils are there?',cs:'Kolik je tu tužek?',sentence:'How many pencils are there? There are eleven pencils.',translation:'Kolik je tu tužek? Je tu jedenáct tužek.',kind:'count',note:'How many… are there? = Kolik je tu…? Pro jednu věc odpovíš There is one…'},
  {id:'where',en:'Where’s the pencil?',cs:'Kde je tužka?',sentence:'Where’s the pencil? Under the desk.',translation:'Kde je tužka? Pod lavicí.',kind:'where',note:'Where’s = Where is. Místo ukážeš pomocí in, on, under nebo next to.'},
];
// Přímé spojení čísel a předmětů z říkanky Numbers School.
export const textbookCounts = [['eleven','desks',11],['twelve','erasers',12],['thirteen','rulers',13],['fourteen','cupboards',14],['fifteen','classrooms',15],['sixteen','teachers',16],['seventeen','pens',17],['eighteen','boards',18],['nineteen','pencils',19],['twenty','tables',20]];
export const decks = {numbers, school, positions, sentences:grammar, extras};
