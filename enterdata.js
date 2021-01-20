const mongo = require('mongodb');
const databaseUrl = 'mongodb://localhost';

async function run() {
    try {
        let client = new mongo.MongoClient(databaseUrl, { useUnifiedTopology: true });
        await client.connect();
        console.log('ok');
        let clubs = [{
                name: 'Wiercipięty Szczecin',
                city: 'Szczecin',
                email: 'wiercipiety@szczecin.pl'
            },
            {
                name: 'Trygław Szczecin',
                city: 'Szczecin',
                email: 'tryglaw@szczecin.pl'
            },
            {
                name: 'Bazyliszki Warszawa',
                city: 'Warszawa',
                email: 'bazyliszki@warszawa.pl'
            },
            {
                name: 'Warszawianka Warszawa',
                city: 'Warszawa',
                email: 'warszawianka@warszawa.pl'
            },
            {
                name: 'Grapa Poronin',
                city: 'Poronin',
                email: 'grapa@podhale.pl'
            },
            {
                name: 'Świtezianka Inowrocław',
                city: 'Inowrocław',
                email: 'switezianka@kujawy.pl'
            },
            {
                name: 'Brda Bydgoszcz',
                city: 'Bydgoszcz',
                email: 'brda@kujawy.pl'
            },
            {
                name: 'Koziołki Poznań',
                city: 'Poznań',
                email: 'koziolki@wielkopolska.pl'
            },
            {
                name: 'Kilof Katowice',
                city: 'Katowice',
                email: 'kilof@silesia.pl'
            },
            {
                name: 'Stragona Strzegom',
                city: 'Strzegom',
                email: 'stragona@dolnyslask.pl'
            },
            {
                name: 'Czarna Hańcza Suwałki',
                city: 'Suwałki',
                email: 'czarna_hancza@suwalszczyzna.pl'
            },
            {
                name: 'Żurawie Gdańsk',
                city: 'Gdańsk',
                email: 'zurawie@pomorze.pl'
            },
        ];
        let result = await client.db('app').collection('clubs').insertMany(clubs);
        console.log('Wpisano ', result.insertedCount, ' klubów do bazy');
        await client.close();
    } catch (err) {
        console.error(err);
    }

    try {
        let client = new mongo.MongoClient(databaseUrl, { useUnifiedTopology: true });
        await client.connect();
        console.log('ok');
        let ind;
        let ifEmpty = await client.db('app').collection('participants').countDocuments();
        if (!ifEmpty) {
            ind = 100;

        } else {
            let result = await client.db('app').collection('participants')
                .aggregate([{ $project: { start_id: 1 } }])
                .sort({ start_id: 1 })
                .toArray();
            ind = result[ifEmpty - 1].start_id;
        }
        let participants = [{
                start_id: ++ind,
                f_name: 'Anna',
                l_name: 'Bielas',
                birth: '1958',
                gender: 'K',
                email: 'annabielas@wp.pl',
                club: 'Grapa Poronin',
                city: 'Poronin'
            },
            {
                start_id: ++ind,
                f_name: 'Beata',
                l_name: 'Chmielewska',
                birth: '1974',
                gender: 'K',
                email: 'beatachmielewska@wp.pl',
                club: 'Grapa Poronin',
                city: 'Poronin'
            },
            {
                start_id: ++ind,
                f_name: 'Celina',
                l_name: 'Dąbrowska',
                birth: '1980',
                gender: 'K',
                email: 'celinadabrowska@wp.pl',
                club: 'Grapa Poronin',
                city: 'Poronin'
            },
            {
                start_id: ++ind,
                f_name: 'Damian',
                l_name: 'Dąbrowski',
                birth: '1979',
                gender: 'M',
                email: 'damiandobrowski@wp.pl',
                club: 'Grapa Poronin',
                city: 'Poronin'
            },
            {
                start_id: ++ind,
                f_name: 'Edmund',
                l_name: 'Frycz',
                birth: '1968',
                gender: 'M',
                email: 'edmundfrycz@wp.pl',
                club: 'Grapa Poronin',
                city: 'Poronin'
            },
            {
                start_id: ++ind,
                f_name: 'Feliks',
                l_name: 'Gąsienica',
                birth: '1958',
                gender: 'M',
                email: 'feliksgasienica@wp.pl',
                club: 'Grapa Poronin',
                city: 'Poronin'
            },
            {
                start_id: ++ind,
                f_name: 'Grzegorz',
                l_name: 'Brzęczyszczykiewicz',
                birth: '1930',
                gender: 'M',
                email: 'grzegorzbrzeczyszczykiewicz@wp.pl',
                club: 'Trygław Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Halina',
                l_name: 'Brzęczyszczykiewicz',
                birth: '1960',
                gender: 'K',
                email: 'halinabrzeczyszczykiewicz@wp.pl',
                club: 'Trygław Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Iwona',
                l_name: 'Jóźwiak',
                birth: '1975',
                gender: 'K',
                email: 'iwonkaj@wp.pl',
                club: 'Trygław Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Jan',
                l_name: 'Jóźwiak',
                birth: '1990',
                gender: 'M',
                email: 'janjozwiak@wp.pl',
                club: 'Trygław Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Karina',
                l_name: 'Kowalewska',
                birth: '1998',
                gender: 'K',
                email: 'karinakowalewska@wp.pl',
                club: 'Trygław Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Lesław',
                l_name: 'Kowalewski',
                birth: '1980',
                gender: 'M',
                email: 'lesiokowalewski@wp.pl',
                club: 'Trygław Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Łukasz',
                l_name: 'Adamski',
                birth: '1999',
                gender: 'M',
                email: 'lukasadamski@wp.pl',
                club: 'Wiercipięty Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Łucja',
                l_name: 'Bagietka',
                birth: '2005',
                gender: 'K',
                email: 'lucjabakietka@wp.pl',
                club: 'Wiercipięty Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Monika',
                l_name: 'Dąbrowska',
                birth: '1971',
                gender: 'K',
                email: 'monikadabrowska@wp.pl',
                club: 'Wiercipięty Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Michał',
                l_name: 'Dąbrowski',
                birth: '1970',
                gender: 'M',
                email: 'michaldabrowski@wp.pl',
                club: 'Wiercipięty Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Norbert',
                l_name: 'Chmielewski',
                birth: '1964',
                gender: 'M',
                email: 'norbertchmielewski@wp.pl',
                club: 'Wiercipięty Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Nikola',
                l_name: 'Kucharska',
                birth: '2006',
                gender: 'K',
                email: 'nikolakucharska@wp.pl',
                club: 'Wiercipięty Szczecin',
                city: 'Szczecin'
            },
            {
                start_id: ++ind,
                f_name: 'Hanna',
                l_name: 'Annowic',
                birth: '1988',
                gender: 'K',
                email: 'hankaannowic@wp.pl',
                club: 'Bazyliszki Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Filip',
                l_name: 'Nawrocki',
                birth: '2000',
                gender: 'M',
                email: 'filipnawrocki@wp.pl',
                club: 'Bazyliszki Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Aniela',
                l_name: 'Microwska',
                birth: '2003',
                gender: 'K',
                email: 'anielkamicro@wp.pl',
                club: 'Bazyliszki Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Jacek',
                l_name: 'Mazrowski',
                birth: '2004',
                gender: 'M',
                email: 'jacqmazrowski@wp.pl',
                club: 'Bazyliszki Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Mikołaj',
                l_name: 'Niezdarek',
                birth: '1992',
                gender: 'M',
                email: 'mikolkaniezdara@wp.pl',
                club: 'Bazyliszki Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Katarzyna',
                l_name: 'Mrocka',
                birth: '2006',
                gender: 'K',
                email: 'kasiamrocka@wp.pl',
                club: 'Bazyliszki Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Romuald',
                l_name: 'Zaborowski',
                birth: '1965',
                gender: 'M',
                email: 'romualdzab@wp.pl',
                club: 'Warszawianka Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Irena',
                l_name: 'Trocka',
                birth: '1974',
                gender: 'K',
                email: 'irenkatro@wp.pl',
                club: 'Warszawianka Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Tadeusz',
                l_name: 'Wiarowski',
                birth: '2005',
                gender: 'M',
                email: 'tadzikwiaro@wp.pl',
                club: 'Warszawianka Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Zofia',
                l_name: 'Ponacka',
                birth: '1999',
                gender: 'K',
                email: 'zosiaponacka@wp.pl',
                club: 'Warszawianka Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Dorota',
                l_name: 'Grocka',
                birth: '2004',
                gender: 'K',
                email: 'dorotkagrota@wp.pl',
                club: 'Warszawianka Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Kamil',
                l_name: 'Niewiarowski',
                birth: '1989',
                gender: 'M',
                email: 'kamilniewiarowski@wp.pl',
                club: 'Warszawianka Warszawa',
                city: 'Warszawa'
            },
            {
                start_id: ++ind,
                f_name: 'Hanna',
                l_name: 'Crawska',
                birth: '2006',
                gender: 'K',
                email: 'hankacrawska@wp.pl',
                club: 'Świtezianka Inowrocław',
                city: 'Inowrocław'
            },
            {
                start_id: ++ind,
                f_name: 'Jan',
                l_name: 'Kowalski',
                birth: '1997',
                gender: 'M',
                email: 'jaskowalski@wp.pl',
                club: 'Świtezianka Inowrocław',
                city: 'Inowrocław'
            },
            {
                start_id: ++ind,
                f_name: 'Aniela',
                l_name: 'Mikowska',
                birth: '1939',
                gender: 'K',
                email: 'anielamikowska@wp.pl',
                club: 'Świtezianka Inowrocław',
                city: 'Inowrocław'
            },
            {
                start_id: ++ind,
                f_name: 'Lena',
                l_name: 'Marcińska',
                birth: '2005',
                gender: 'K',
                email: 'lenkamarcinska@wp.pl',
                club: 'Świtezianka Inowrocław',
                city: 'Inowrocław'
            },
            {
                start_id: ++ind,
                f_name: 'Marcin',
                l_name: 'Marciński',
                birth: '2005',
                gender: 'M',
                email: 'marcinekmarcinski@wp.pl',
                club: 'Świtezianka Inowrocław',
                city: 'Inowrocław'
            },
            {
                start_id: ++ind,
                f_name: 'Konrad',
                l_name: 'Chmielewski',
                birth: '1967',
                gender: 'M',
                email: '@wp.pl',
                club: 'Świtezianka Inowrocław',
                city: 'Inowrocław'
            },
            {
                start_id: ++ind,
                f_name: 'Magdalena',
                l_name: 'Mrozik',
                birth: '2003',
                gender: 'K',
                email: 'magdusiamrozik@wp.pl',
                club: 'Brda Bydgoszcz',
                city: 'Bydgoszcz'
            },
            {
                start_id: ++ind,
                f_name: 'Grzegorz',
                l_name: 'Brzydalski',
                birth: '1987',
                gender: 'M',
                email: 'grzesbrzydki@wp.pl',
                club: 'Brda Bydgoszcz',
                city: 'Bydgoszcz'
            },
            {
                start_id: ++ind,
                f_name: 'Jan',
                l_name: 'Piszczyk',
                birth: '1965',
                gender: 'M',
                email: 'piszczykjan@wp.pl',
                club: 'Brda Bydgoszcz',
                city: 'Bydgoszcz'
            },
            {
                start_id: ++ind,
                f_name: 'Irena',
                l_name: 'Kwiatkowska',
                birth: '1958',
                gender: 'K',
                email: 'irenakwiatkowska@wp.pl',
                club: 'Brda Bydgoszcz',
                city: 'Bydgoszcz'
            },
            {
                start_id: ++ind,
                f_name: 'Paweł',
                l_name: 'Jankowski',
                birth: '1972',
                gender: 'M',
                email: 'paweljaknowski@wp.pl',
                club: 'Brda Bydgoszcz',
                city: 'Bydgoszcz'
            },
            {
                start_id: ++ind,
                f_name: 'Aleksandra',
                l_name: 'Horacka',
                birth: '1975',
                gender: 'K',
                email: 'olahoracka@wp.pl',
                club: 'Brda Bydgoszcz',
                city: 'Bydgoszcz'
            },
            {
                start_id: ++ind,
                f_name: 'Krystyna',
                l_name: 'Makowiecka',
                birth: '1967',
                gender: 'K',
                email: 'krysiamak@wp.pl',
                club: 'Koziołki Poznań',
                city: 'Poznań'
            },
            {
                start_id: ++ind,
                f_name: 'Joanna',
                l_name: 'Grakowska',
                birth: '2000',
                gender: 'K',
                email: 'asiagrak@wp.pl',
                club: 'Koziołki Poznań',
                city: 'Poznań'
            },
            {
                start_id: ++ind,
                f_name: 'Urszula',
                l_name: 'Jakowiecka',
                birth: '1997',
                gender: 'K',
                email: 'ulkajakow@wp.pl',
                club: 'Koziołki Poznań',
                city: 'Poznań'
            },
            {
                start_id: ++ind,
                f_name: 'Henryk',
                l_name: 'Turkowski',
                birth: '1956',
                gender: 'M',
                email: '@wp.pl',
                club: 'Koziołki Poznań',
                city: 'Poznań'
            },
            {
                start_id: ++ind,
                f_name: 'Łukasz',
                l_name: 'Markowski',
                birth: '1967',
                gender: 'M',
                email: '@wp.pl',
                club: 'Koziołki Poznań',
                city: 'Poznań'
            },
            {
                start_id: ++ind,
                f_name: 'Emil',
                l_name: 'Plater',
                birth: '1978',
                gender: 'M',
                email: '@wp.pl',
                club: 'Koziołki Poznań',
                city: 'Poznań'
            },
            {
                start_id: ++ind,
                f_name: 'Patryk',
                l_name: 'Bezimienny',
                birth: '1994',
                gender: 'M',
                email: 'patryk@wp.pl',
                club: 'Kilof Katowice',
                city: 'Katowice'
            },
            {
                start_id: ++ind,
                f_name: 'Patrycja',
                l_name: 'Ironowska',
                birth: '2004',
                gender: 'K',
                email: 'patrycjaironowska@wp.pl',
                club: 'Kilof Katowice',
                city: 'Katowice'
            },
            {
                start_id: ++ind,
                f_name: 'Aleksander',
                l_name: 'Hanuszewski',
                birth: '1975',
                gender: 'M',
                email: 'olekhanuszewski@wp.pl',
                club: 'Kilof Katowice',
                city: 'Katowice'
            },
            {
                start_id: ++ind,
                f_name: 'Olga',
                l_name: 'Mazurkiewicz',
                birth: '1993',
                gender: 'K',
                email: 'olgamazurkiewicz@wp.pl',
                club: 'Kilof Katowice',
                city: 'Katowice'
            },
            {
                start_id: ++ind,
                f_name: 'Zbigniew',
                l_name: 'Chmielnicki',
                birth: '2003',
                gender: 'M',
                email: 'zbiniochmielnicki@wp.pl',
                club: 'Kilof Katowice',
                city: 'Katowice'
            },
            {
                start_id: ++ind,
                f_name: 'Waleria',
                l_name: 'Rakowska',
                birth: '1986',
                gender: 'K',
                email: 'waleriarakowska@wp.pl',
                club: 'Kilof Katowice',
                city: 'Katowice'
            },
            {
                start_id: ++ind,
                f_name: 'Ignacy',
                l_name: 'Rokoszewski',
                birth: '1996',
                gender: 'M',
                email: 'ignacyrokoszewski@wp.pl',
                club: '',
                city: 'Sochaczew'
            },
            {
                start_id: ++ind,
                f_name: 'Liwia',
                l_name: 'Różnicka',
                birth: '2000',
                gender: 'K',
                email: 'liwiaroznicka@wp.pl',
                club: '',
                city: 'Kielce'
            },
            {
                start_id: ++ind,
                f_name: 'Bartosz',
                l_name: 'Zimowski',
                birth: '1937',
                gender: 'M',
                email: 'bartekzima@wp.pl',
                club: '',
                city: 'Płońsk'
            },
            {
                start_id: ++ind,
                f_name: 'Daria',
                l_name: 'Koranowska',
                birth: '1969',
                gender: 'K',
                email: 'dariakoranowska@wp.pl',
                club: '',
                city: 'Teresin'
            },
            {
                start_id: ++ind,
                f_name: 'Żaneta',
                l_name: 'Adamczewska',
                birth: '1952',
                gender: 'K',
                email: 'zanetaadamczewska@wp.pl',
                club: 'Stragona Strzegom',
                city: 'Strzegom'
            },
            {
                start_id: ++ind,
                f_name: 'Zuzanna',
                l_name: 'Górska',
                birth: '1968',
                gender: 'K',
                email: 'zuziazorska@wp.pl',
                club: 'Stragona Strzegom',
                city: 'Strzegom'
            },
            {
                start_id: ++ind,
                f_name: 'Wiesław',
                l_name: 'Huryń',
                birth: '1980',
                gender: 'M',
                email: 'wieslawhuryn@wp.pl',
                club: 'Stragona Strzegom',
                city: 'Strzegom'
            },
            {
                start_id: ++ind,
                f_name: 'Urszula',
                l_name: 'Dąbrowska',
                birth: '1990',
                gender: 'K',
                email: 'uladabrowska@wp.pl',
                club: 'Stragona Strzegom',
                city: 'Strzegom'
            },
            {
                start_id: ++ind,
                f_name: 'Tadeusz',
                l_name: 'Kowalski',
                birth: '1979',
                gender: 'M',
                email: 'tadeuszkowalski@wp.pl',
                club: 'Stragona Strzegom',
                city: 'Strzegom'
            },
            {
                start_id: ++ind,
                f_name: 'Stefan',
                l_name: 'Żaba',
                birth: '1976',
                gender: 'M',
                email: 'stefanzaba@wp.pl',
                club: 'Stragona Strzegom',
                city: 'Strzegom'
            },
            {
                start_id: ++ind,
                f_name: 'Ryszard',
                l_name: 'Kolski',
                birth: '1943',
                gender: 'M',
                email: 'ryszardkolski@op.pl',
                club: 'Czarna Hańcza Suwałki',
                city: 'Suwałki'
            },
            {
                start_id: ++ind,
                f_name: 'Ryszarda',
                l_name: 'Kolska',
                birth: '1944',
                gender: 'K',
                email: 'rysiakolska@op.pl',
                club: 'Czarna Hańcza Suwałki',
                city: 'Suwałki'
            },
            {
                start_id: ++ind,
                f_name: 'Patrycja',
                l_name: 'Orska',
                birth: '1958',
                gender: 'K',
                email: 'patrycjaorska@op.pl',
                club: 'Czarna Hańcza Suwałki',
                city: 'Suwałki'
            },
            {
                start_id: ++ind,
                f_name: 'Patryk',
                l_name: 'Orski',
                birth: '1964',
                gender: 'M',
                email: 'patrykorski@op.pl',
                club: 'Czarna Hańcza Suwałki',
                city: 'Suwałki'
            },
            {
                start_id: ++ind,
                f_name: 'Olga',
                l_name: 'Tańska',
                birth: '1962',
                gender: 'K',
                email: 'olgatanska@op.pl',
                club: 'Czarna Hańcza Suwałki',
                city: 'Suwałki'
            },
            {
                start_id: ++ind,
                f_name: 'Olgierd',
                l_name: 'Tański',
                birth: '1998',
                gender: 'M',
                email: 'olgierdtanski@op.pl',
                club: 'Czarna Hańcza Suwałki',
                city: 'Suwałki'
            },
            {
                start_id: ++ind,
                f_name: 'Norbert',
                l_name: 'Ulski',
                birth: '1986',
                gender: 'M',
                email: 'norbertulski@op.pl',
                club: 'Żurawie Gdańsk',
                city: 'Gdańsk'
            },
            {
                start_id: ++ind,
                f_name: 'Nikola',
                l_name: 'Ulska',
                birth: '1988',
                gender: 'K',
                email: 'nikolaulska@op.pl',
                club: 'Żurawie Gdańsk',
                city: 'Gdańsk'
            },
            {
                start_id: ++ind,
                f_name: 'Ewa',
                l_name: 'Ulska',
                birth: '2007',
                gender: 'K',
                email: 'ewaulska@op.pl',
                club: 'Żurawie Gdańsk',
                city: 'Gdańsk'
            },
            {
                start_id: ++ind,
                f_name: 'Hanna',
                l_name: 'Mirska',
                birth: '1994',
                gender: 'K',
                email: 'hannairska@op.pl',
                club: 'Żurawie Gdańsk',
                city: 'Gdańsk'
            },
            {
                start_id: ++ind,
                f_name: 'Kajetan',
                l_name: 'Mirski',
                birth: '1996',
                gender: 'M',
                email: 'kajetanmisrki@op.pl',
                club: 'Żurawie Gdańsk',
                city: 'Gdańsk'
            }
        ];
        result = await client.db('app').collection('participants').insertMany(participants);
        console.log('Dopisano ', result.result.n, 'zawodnik(ów) do bazy');
        await client.close();
    } catch (err) {
        console.error(err);
    };
}

run();