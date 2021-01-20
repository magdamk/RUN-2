const ObjectId = require('mongodb').ObjectId;
var _ = require('underscore');

/* GET home page. */
exports.race_list = async function(req, res, next) {
    try {
        const collectionName = 'races'
        const exists = (await (await req.db.db('app').listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1)
        if (exists) {
            let result = await req.db.db('app').collection('races').find({}).sort({ date: 1 }).toArray();
            res.render("racelist.hbs", { title: 'RUN! Lista biegów', biegi: result });
        } else
            res.render("racelist.hbs", { title: "RUN! Lista biegów" })
    } catch (err) {
        console.error(err);

    };


};

// Display race create form on GET.
exports.race_create_get = async function(req, res) {
    try {
        const collectionName = 'races'
        const exists = (await (await req.db.db('app').listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1)
        if (exists) {
            const lastRaceId = await req.db.db('app').collection('races').countDocuments();
            if (lastRaceId > 0) {
                const lastRace = await req.db.db('app').collection('races').find({ race_id: lastRaceId }).toArray();
                const last = new Date(lastRace[0].date).toISOString().split("T")[0];
                res.render('formrace.hbs', { title: 'RUN! Utwórz', text: 'Podaj datę biegu po', date: last });
            } else {
                const date = new Date().toISOString().split("T")[0];
                res.render('formrace.hbs', { title: 'RUN! Utwórz', text: 'Podaj datę biegu od', date: date });
            }
        } else {
            const date = new Date().toISOString().split("T")[0];
            res.render('formrace.hbs', { title: 'RUN! Utwórz', text: 'Podaj datę biegu od', date: date });
        }
    } catch (err) {
        console.error(err);
    }
};



// Handle race create on POST.
exports.race_create_post = async function(req, res, next) {
    try {
        let pusta = await req.db.db('app').collection('races').countDocuments();
        let wynik = await req.db.db('app').collection('races').find({}).sort({ start_id: 1 }).toArray();
        let ind = 1;
        while ((ind <= pusta) && (wynik[ind - 1].race_id == ind)) {
            ind++;
        };
        let race = {
            race_id: ind,
            date: req.body.date,
            list: { part: [ind], ready: false },
            results: { part: [ind], ready: false }
        };
        await req.db.db('app').collection('races').insertOne(race);
        res.render("komunikat", { title: 'RUN!', komunikat: 'Bieg ' + req.body.date + ' dodany!' });

    } catch (err) {
        console.error(err);
    }
};

// Display race create form on GET
exports.race_start_list = async function(req, res) {
    try {
        const search = req.query.search;
        const race = parseInt(req.query.race);
        const query = { race_id: race };
        const id = false ? id : req.query._id;
        let wynik = await req.db.db('app').collection('races').findOne(query);
        newList = wynik.list.part;
        if (req.query.del == "true") {
            let where = 0;
            for (let i = 1; i < newList.length; i++) { if (newList[i].toString() == ObjectId(id).toString()) { where = i } };
            newList.splice(where, 1);
            let newValues = { $set: { list: { part: newList, ready: false } } };
            await req.db.db('app').collection('races').updateOne(query, newValues);
        } else {
            if (id) {
                let foundId = false;
                for (let p of newList) { if (p == ObjectId(id).toString()) { foundId = true } };
                if (!foundId) {
                    let add = ObjectId(id);
                    newList.push(add);

                    let newValues = { $set: { list: { part: newList, ready: false } } };
                    await req.db.db('app').collection('races').updateOne(query, newValues)
                };
            }
        };
        if (!search) { querySearch = {} } else { querySearch = { l_name: { $regex: search, $options: "i" } }; }
        const count = await req.db.db('app')
            .collection('participants').countDocuments(querySearch);
        let result = await req.db.db('app').collection('participants').find(querySearch).sort({ l_name: 1 })
            .collation({ locale: "pl" })
            .toArray();
        for (let res of result) {
            let q = ObjectId(res._id);
            res.added = false;
            for (let i = 1; i < newList.length; i++) {

                if (newList[i].toString() == q.toString()) { res.added = true };
            }
        };
        res.render("makestartlist", {
            title: 'RUN! Bieg',
            data: result,
            count: count,
            search: search,
            race: race,
        });
    } catch (err) {
        console.error(err);
    };
};

//Handle closing start list on GET
exports.race_start_list_close = async function(req, res, next) {
    try {
        const race = parseInt(req.query.race);
        const query = { race_id: race };
        let result = await req.db.db('app').collection('races').findOne(query);
        let tab = [+race];
        for (let i = 1; i < result.list.part.length; i++) { tab[i] = null };
        let newValues = {
            $set: {
                list: { part: result.list.part, ready: true },
                results: { part: tab, reasy: false }
            }
        };
        await req.db.db('app').collection('races').updateOne(query, newValues);
        res.render('komunikat', { title: 'RUN!', komunikat: "Lista zamknięta" });
    } catch (err) {
        console.error(err);
    };
};

//Handle start list for a race on GET
exports.race_start_list_ready = async function(req, res, next) {
    try {
        const race = parseInt(req.query.race);
        let reportQuery = await req.db.db('app').collection('races').aggregate([{ $match: { race_id: race } }, {
            $lookup: {
                from: 'participants',
                localField: 'list.part',
                foreignField: '_id',
                as: 'part'
            }
        }]).toArray();
        let tab = reportQuery[0].part;
        tab.sort((a, b) => a.l_name.localeCompare(b.l_name));
        res.render("listastartowa.hbs", { title: 'RUN! Lista startowa', race: race, data: tab });
    } catch (err) {
        console.error(err);
    };

};

//Handle results form on GET
exports.race_enterresults = async function(req, res, next) {
    try {
        const race = parseInt(req.query.race);
        const query = { race_id: race };
        const id = false ? id : req.query._id;
        let wynik = await req.db.db('app').collection('races').findOne(query);
        const startList = wynik.list.part;
        let newList = wynik.results.part;
        if (id) {
            for (let i = 1; i < startList.length; i++) {

                if (startList[i].toString() == ObjectId(id).toString()) {
                    newList[i] = req.query.place;
                };
            };
            let newValues = { $set: { results: { part: newList, ready: false } } };
            await req.db.db('app').collection('races').updateOne(query, newValues);
        };
        let reportQuery = await req.db.db('app').collection('races').aggregate([{ $match: { race_id: race } }, {
            $lookup: {
                from: 'participants',
                localField: 'list.part',
                foreignField: '_id',
                as: 'part'
            }
        }]).toArray();

        const length = reportQuery[0].part.length;

        for (let rep of reportQuery[0].part) {
            let q = ObjectId(rep._id);
            rep.notadded = false;
            for (let i = 1; i < startList.length; i++) {

                if (startList[i].toString() == q.toString()) {
                    if (!newList[i]) { rep.notadded = true } else { rep.place = parseInt(newList[i]) }
                };
            }
        };
        let tab = reportQuery[0].part;
        tab.sort((a, b) => a.l_name.localeCompare(b.l_name));
        tab.sort((a, b) => {
            if ((a.place >= b.place) || (a.place == null)) { return 1 } else if ((a.place < b.place) || (b.place == null)) { return -1 } else { return 0 }
        });
        res.render("enterresults.hbs", {
            title: 'RUN! Podaj wyniki',
            race: race,
            data: tab,
            length: length,
        });
    } catch (err) {
        console.error(err);
    }
};

//Handle closing result form on GET
exports.race_enterresults_close = async function(req, res, next) {
    try {
        const race = parseInt(req.query.race);
        const query = { race_id: race };
        let wynik = await req.db.db('app').collection('races').findOne(query);
        let newList = wynik.results.part;
        let newValues = { $set: { results: { part: newList, ready: true } } };
        await req.db.db('app').collection('races').updateOne(query, newValues);
        res.render('komunikat', { title: 'RUN!', komunikat: "Wyniki biegu " + race + " wpisane!" });

    } catch (err) {
        console.error(err);
    };
};

//Handle results on GET
exports.race_results = async function(req, res, next) {
    try {
        const race = parseInt(req.query.race);
        const query = { race_id: race };
        let wynik = await req.db.db('app').collection('races').findOne(query);
        const startList = wynik.list.part;
        const resultList = wynik.results.part;
        let reportQuery = await req.db.db('app').collection('races').aggregate([{ $match: { race_id: race } }, {
            $lookup: {
                from: 'participants',
                localField: 'list.part',
                foreignField: '_id',
                as: 'part'
            }
        }]).toArray();

        for (let rep of reportQuery[0].part) {
            let q = ObjectId(rep._id);
            for (let i = 1; i < startList.length; i++) {

                if (startList[i].toString() == q.toString()) {
                    if (!resultList[i]) {} else { rep.place = parseInt(resultList[i]) }
                };
            }
        };
        let tab = reportQuery[0].part;
        let tab2 = [];
        tab2.exist = false;
        tab.sort((a, b) => (a.place > b.place) ? 1 : ((b.place > a.place) ? -1 : 0));
        while (tab[0].place == 0) {
            tab2.push(tab[0]);
            tab.shift();
            tab2.exist = true;
        };
        let tab3 = [];
        tab3.exists = false;
        for (t of tab) {
            if (t.gender == 'K') {
                tab3.push(t);
                tab3.exists = true
            }
        };
        for (let i = 0, { length } = tab3; i < length; i++) { tab3[i].placeK = i + 1 };
        res.render("results.hbs", {
            title: 'RUN! Wyniki biegu ' + race,
            race: race,
            data: tab,
            data2: tab2,
            data3: tab3

        });
    } catch (err) {
        console.error(err);
    }

};

//Handle classification on GET
exports.race_class = async function(req, res, next) {
    try {
        const race = parseInt(req.query.race);
        const query = [];
        for (let i = 1; i <= race; i++) { query.push(i) };
        let reportQuery = await req.db.db('app').collection('races').aggregate([{ $match: { 'race_id': { $in: query } } }, {
            $lookup: {
                from: 'participants',
                localField: 'list.part',
                foreignField: '_id',
                as: 'part'
            }
        }]).toArray();
        let classAfter = [];
        for (let report of reportQuery) {
            let startList = report.list.part;
            let resultList = report.results.part;
            for (let part of report.part) {
                let id = ObjectId(part._id);
                for (let i = 1; i < startList.length; i++) {

                    if (startList[i].toString() == id.toString()) {
                        switch (resultList[i]) {
                            case "0" || isNaN(resultList[i]):
                                part.points = 0;
                                break;
                            case "1":
                                part.points = 15;
                                break;
                            case "2":
                                part.points = 12;
                                break;
                            case "3":
                                part.points = 10;
                                break;
                            case "4":
                                part.points = 8;
                                break;
                            case "5":
                                part.points = 7;
                                break;
                            case "6":
                                part.points = 6;
                                break;
                            case "7":
                                part.points = 5;
                                break;
                            case "8":
                                part.points = 4;
                                break;
                            case "9":
                                part.points = 3;
                                break;
                            case "10":
                                part.points = 2;
                                break;
                            default:
                                part.points = 1;
                                break;
                        };

                    };

                };
                part.points = parseInt(part.points);
                if (part.points > 0) {
                    if (classAfter.length == 0) {
                        classAfter.push(part);
                    } else {
                        let found = false;
                        for (let cA of classAfter) {
                            if (cA._id.toString() == id.toString()) {
                                cA.points += part.points;
                                found = true;
                            };

                        };
                        if (!found) {
                            classAfter.push(part);
                        }
                    }
                };
            }
        };
        classAfter.sort((a, b) => (a.points < b.points) ? 1 : ((b.points < a.points) ? -1 : 0));
        let i = 1;
        for (let c of classAfter) {
            c.place = i;
            i++;
        };
        let tab3 = [];
        tab3.exists = false;
        for (t of classAfter) {
            if (t.gender == 'K') {
                tab3.push(t);
                tab3.exists = true
            }
        };
        for (let i = 0, { length } = tab3; i < length; i++) { tab3[i].placeK = i + 1 };
        res.render("klass.hbs", { title: 'RUN! Klasyfikacja po biegu ' + race, race: race, data: classAfter, dataK: tab3 });
    } catch (err) {
        console.error(err);
    };
};

//Handle club classification on GET
exports.race_club_class = async function(req, res, next) {
    try {
        const race = parseInt(req.query.race);
        const query = [];
        for (let i = 1; i <= race; i++) { query.push(i) };
        let reportQuery = await req.db.db('app').collection('races').aggregate([{ $match: { 'race_id': { $in: query } } }, {
            $lookup: {
                from: 'participants',
                localField: 'list.part',
                foreignField: '_id',
                as: 'part'
            }
        }]).toArray();
        let classAfter = [];
        for (let report of reportQuery) {
            let startList = report.list.part;
            let resultList = report.results.part;
            for (let part of report.part) {
                let id = ObjectId(part._id);
                for (let i = 1; i < startList.length; i++) {

                    if (startList[i].toString() == id.toString()) {
                        switch (resultList[i]) {
                            case "0" || isNaN(resultList[i]):
                                part.points = 0;
                                break;
                            case "1":
                                part.points = 15;
                                break;
                            case "2":
                                part.points = 12;
                                break;
                            case "3":
                                part.points = 10;
                                break;
                            case "4":
                                part.points = 8;
                                break;
                            case "5":
                                part.points = 7;
                                break;
                            case "6":
                                part.points = 6;
                                break;
                            case "7":
                                part.points = 5;
                                break;
                            case "8":
                                part.points = 4;
                                break;
                            case "9":
                                part.points = 3;
                                break;
                            case "10":
                                part.points = 2;
                                break;
                            default:
                                part.points = 1;
                                break;
                        };

                    };

                };
                part.points = parseInt(part.points);
                if (part.points > 0) {
                    if (classAfter.length == 0) {
                        classAfter.push(part);
                    } else {
                        let found = false;
                        for (let cA of classAfter) {
                            if (cA._id.toString() == id.toString()) {
                                cA.points += part.points;
                                found = true;
                            };

                        };
                        if (!found) {
                            classAfter.push(part);
                        }
                    }
                };
            }
        };
        let clubClass = _.map(classAfter, function(e) {
            return {
                club: e.club,
                points: parseInt(e.points),
            }
        });
        clubClass = _.groupBy(clubClass, 'club');
        clubClass = _.values(clubClass);
        let result = [];
        for (c of clubClass) {
            if (c[0].club != '') {
                if (c.length > 1) {
                    let points = 0;
                    for (d of c) { points += d.points };
                    result.push({ club: c[0].club, points: points })
                } else { result.push({ club: c[0].club, points: c[0].points }) }
            }
        };
        result.sort((a, b) => (a.points < b.points) ? 1 : ((b.points < a.points) ? -1 : 0));
        let i = 1;
        for (let c of result) {
            c.place = i;
            i++;
        };

        res.render('klubklass', { title: 'RUN! Klasyfikacja klubowa po biegu ' + race, race: race, data: result });
    } catch (err) {
        console.error(err);
    }
};

// Handle Race deletion on GET
exports.race_del = async function(req, res, next) {
    try {
        const race = parseInt(req.query.race);
        await req.db.db('app').collection('races').deleteOne({ race_id: race });
        if (race > 1) {
            let result = await req.db.db('app').collection('races').find({}).sort({ date: 1 }).toArray();
            res.render("racelist.hbs", { title: 'RUN! Lista biegów', biegi: result });
        } else
            res.render("racelist.hbs", { title: "RUN! Lista biegów" })
    } catch (err) {
        console.error(err);
    }
};