Autor: Magdalena Mroziuk magdamroziuk@wp.pl, grudzień-styczeń 2020/2021
Projekt na zaliczenie z przedmiotów:
"Obsługa baz danych w serwisach WWW"
"Wprowadzenie do HTML5 i CSS3"
"Techniki programistyczne języka JavaScript"

Aplikacja do obsługi cyklicznych biegów amatorskich.
Aplikacja utworzona w node.js poprzez:

npx express-generator --view=hbs
npm install
npm install --save -dev nodemon
npm add --save mongodb
npm add --save underscore

uruchamiana porzez:
npm run devstart

W katalogu 'routes' znajdują się tylko odwołania do funkcji, które znajdują się w katalogu 'controllers' w plikach odpowiadających odwołaniom do danej kolekcji.

Aplikacja jest z pustą bazą danych do przetestowania.
Przygotowałam też skrypt "enterdata.js" który po uruchomieniu 
 "node enterdata.js"
wypełnia bazę 12 klubów i 75 zawodników do przetestowania, jak zachowuje się aplikacja z danymi. 
Skrypt "drop.js" usuwa wszystkie trzy kolekcje, jeżeli istnieją.

Aplikacja odwołuje się do trzech kolekcji w mongodb: "clubs", "participants", "races" na localhost. Dwie pierwsze kolekcje powstają poprzez dopisywanie kolejnych klubów lub zawodników przez formularz na stronie. Poprawiłam indeksowanie na indeksy przypisywane przez mongodb, dodałam swój drugi indeks do kolekcji "participants" jako pole "start_id" które jest równowazne z numerem startowym oraz dodatkowe indeksowanie do kolekcji "races" z kolejnym numerem biegu.

Kolekcja "races" powstaje poprzez dodanie przez formularz daty biegu nie wcześniejszej niż ostatnio utworzony bieg. 

Po dodaniu biegu możliwe jest dopisanie do niego zawodników z bazy poprzez formularz na stronie. Na tym etapie można jeszcze usunąć "bieg". Po kliknięciu przycisku "Zamknij listę" użytkownik nie może modyfikować listy startowej ani usunąć biegu. Pojawia się natomiast w tabeli biegów nowy link do wpisania wyników w postaci zajętego miejsca.  Po zamknięciu tego formularza możliwe staje się wyświetlenie wyników danego biegu (w dwóch kategoriach), klasyfikacji łącznej oraz klasyfikacji klubowej.
 
Lista startowa (w kolekcji "races" to tablica z kluczami zawodników, wyniki to tablica, w której na odpowiednim indeksie jak w liście startowej znajduje się lokata w danym biegu.
Nie jestem przekonana do słuszności tego, jak zbudowałam tę trzecią kolekcję, chyba możnaby to zrobić inaczej, gdyż obsługa tej kolekcji jest dość skomplikowana i wymaga wielu operacji na danych (może tak nie jest, tylko moje umiejętności jeszcze na to nie pozwalają). Nie zawsze umiałam tu poradzić sobie z samymi zapytaniami do bazy i czasem musiałam ściągnąć dane i operować na nich już sama w JS. 
Do zapytań odnośnie wyników używałam metody aggregate łączącej zapytanie z dwóch kolekcji. Na stronie "Zawodnicy" znajduje się także średni wiek zawodnika wyliczony z użyciem mapReduce na kolekcji "participants".

Chciałabym, aby aplikacja umożliwiała logowanie się przez organizatora/admina (może też przez zawodników z ograniczonymi możliwościami), ale nie umiem jeszcze obsługiwać kont użytkowników.

Wizualnie strona jest ostylowana za pomocą bardzo podstawowych możliwości Bootstrap'a, z użyciem kilku ikonek, przycisków etc. Bootstrap jest używany przez link do strony, nie jest zainstalowany przez npm.

Przepraszam też za pomieszanie języka polskiego i angielskiego w nazwach zmiennych, funkcji i plików, jest to bałagan, którego często nie zauważam podczas pisania, gdyż oba te języki mam równolegle w głowie, są dla mnie tożsame. Przy następnym projekcie będę się już bardziej pilnować i stosować bardziej jednolite (angielskie) nazewnictwo. 