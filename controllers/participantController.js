const ObjectId = require('mongodb').ObjectId;

// Handle Participant create form on GET.
exports.participant_create_get = async function(req, res) {
    try {
        let mysort = { name: 1 };
        let result = await req.db.db('app').collection('clubs').find({}).sort(mysort).collation({ locale: "pl" }).toArray();
        let lata = [];
        for (let i = 2007; i >= 1917; i--) { lata[2007 - i] = { year: i, selected: false } };
        res.render('forms.hbs', { title: 'RUN! Dopisz', text: 'Wszystkie pola wymagane oprócz "Klub", w przypadku niezrzeszonego proszę nie wybierać pola "Klub"', kluby: result, lata: lata });
    } catch (err) {
        console.error(err);
    }
};


// Handle participant create on POST.
exports.participant_create_post = async function(req, res) {
    try {
        let pusta = await req.db.db('app').collection('participants').countDocuments();

        let wynik = await req.db.db('app').collection('participants').find({}).sort({ start_id: 1 }).toArray();
        let ind = 101;
        while ((ind <= pusta + 100) && (wynik[ind - 101].start_id == ind)) {
            ind++;
        };
        await req.db.db('app').collection('participants').insertOne({
            start_id: ind,
            f_name: req.body.f_name,
            l_name: req.body.l_name,
            birth: req.body.birth,
            gender: req.body.gender,
            email: req.body.email,
            club: req.body.club,
            city: req.body.city
        });
        res.render("komunikat", {
            title: 'RUN!',
            komunikat: 'Zawodnik ' + req.body.f_name + ' ' + req.body.l_name + ' dodany!'
        });
    } catch (err) {
        console.error(err);

    };
};


// Display list of all Participants
exports.participant_list = async function(req, res, next) {
    try {
        const collectionName = 'participants';
        const exists = (await (await req.db.db('app').listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1);
        if (exists) {
            const search = req.query.search;
            if (!search) { querySearch = {} } else { querySearch = { l_name: { $regex: search, $options: "i" } }; }
            let sort = parseInt(req.query.sort);
            const count = await req.db.db('app')
                .collection('participants').countDocuments(querySearch);
            if (count > 0) {
                const pageSize = 10;

                sort = sort ? sort : 1;

                const maxPage = Math.floor((count - 1) / pageSize);
                let page = parseInt(req.query.page);
                page = page >= 0 ? page : 0;
                page = page <= maxPage ? page : maxPage;
                const prevPage = page > 0 ? page - 1 : 0;
                const nextPage = page < maxPage ? page + 1 : maxPage;
                let pages = [];
                for (let i = 0; i <= maxPage; i++) {
                    pages[i] = { visible: i + 1, actual: i, selected: false };
                    if (i == page) { pages[i].selected = true }
                };
                let result = await req.db.db('app').collection('participants').find(querySearch).collation({ locale: "pl" }).sort({ l_name: sort })
                    .skip(page * pageSize)
                    .limit(pageSize).toArray();
                let report = await req.db.db('app').collection('participants').mapReduce(
                    //map
                    function() {
                        const year = new Date().getFullYear();
                        emit('age', year - this.birth)
                    },
                    //reduce
                    function(key, ages) {
                        return Array.sum(ages);
                    }, { out: { inline: 1 } }
                );
                res.render("komunikatzawodnik", {
                    title: 'RUN! Zawodnicy',
                    data: result,
                    sort: sort,
                    page: page,
                    prevPage: prevPage,
                    nextPage: nextPage,
                    maxPage: maxPage + 1,
                    count: count,
                    pages: pages,
                    search: search,
                    report: (report[0].value / count).toFixed(2)
                });
            } else {
                res.render("komunikatzawodnik", {
                    title: 'RUN! Zawodnicy',
                    sort: 1,
                    count: 0,
                    pages: 0,
                    search: "",
                    report: 0
                });
            }
        } else {
            res.render("komunikatzawodnik", {
                title: 'RUN! Zawodnicy',
                sort: 1,
                count: 0,
                pages: 0,
                search: "",
                report: 0
            });
        }
    } catch (err) {
        console.error(err);
    };
};

exports.participant_detail_post = async function(req, res) {
    try {
        id = req.body._id;
        let query = { _id: ObjectId(id) };
        let result = await req.db.db('app').collection('participants').find(query).toArray();
        res.render("danezawodnik", {
            title: 'RUN! Dane zawodnika',
            dane: result[0]
        });
    } catch (err) {
        console.error(err);
    };
};



// Handle participant delete on POST.
exports.participant_delete_post = async function(req, res) {
    try {
        let id = req.body._id;
        query = { _id: ObjectId(id) };
        await req.db.db('app').collection('participants').deleteOne(query);
        res.render('komunikat.hbs', { title: 'RUN!', komunikat: "Zawodnik usunięty z bazy" });
    } catch (err) {
        console.error(err);
    };
};


// Handle participant edit on POST.
exports.participant_edit_post = async function(req, res) {
    try {
        let mysort = { name: 1 };
        let result_kluby = await req.db.db('app').collection('clubs').find({}).sort(mysort).toArray();
        let id = req.body._id;
        let query = { _id: ObjectId(id) };
        let result = await req.db.db('app').collection('participants').find(query).toArray();
        for (let klub of result_kluby) {
            if (result[0].club == klub.name) { klub.selected = true; } else { klub.selected = false; }
        };
        let lata = [];
        lata[0] = { year: 1917, selected: false };
        for (let i = 1918; i <= 2007; i++) { lata[i - 1917] = { year: i, selected: false } };
        for (let rok of lata) {
            if (result[0].birth == rok.year) { rok.selected = true; } else { rok.selected = false; }
        };
        let gender = false;
        if (result[0].gender == 'K') { gender = true };
        res.render('formsedit.hbs', { title: 'RUN! Edytuj', dane: result[0], text: "", kluby: result_kluby, lata: lata, gender: gender });
    } catch (err) {
        console.error(err);
    };

};

// Display participant update form on post.
exports.participant_update_post = async function(req, res) {
    try {
        id = req.body._id;
        var myquery = { _id: ObjectId(id) };
        var newvalues = {
            $set: {
                f_name: req.body.f_name,
                l_name: req.body.l_name,
                birth: req.body.birth,
                gender: req.body.gender,
                email: req.body.email,
                club: req.body.club || 'BRAK',
                city: req.body.city
            }
        };
        await req.db.db('app').collection('participants').updateOne(myquery, newvalues);
        res.render('komunikat', { title: 'RUN!', komunikat: "Dane zawodnika zmienione" });
    } catch (err) {
        console.error(err);
    };
};