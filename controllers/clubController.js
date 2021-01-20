const ObjectId = require('mongodb').ObjectId;

// Handle list of all Clubs on GET
exports.club_list = async function(req, res, next) {
    try {
        const collectionName = 'clubs';
        const exists = (await (await req.db.db('app').listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1);
        if (exists) {
            const count = await req.db.db('app')
                .collection('clubs').countDocuments();
            if (count > 0) {
                const pageSize = 5;
                let sort = parseInt(req.query.sort);
                sort = sort ? sort : 1;

                const maxPage = Math.floor((count - 1) / pageSize);
                let page = parseInt(req.query.page);
                page = page >= 0 ? page : 0;
                page = page <= maxPage ? page : maxPage;
                const prevPage = page > 0 ? page - 1 : 0;
                const nextPage = page < maxPage ? page + 1 : maxPage;
                let result = await req.db.db('app').collection('clubs').find({}).sort({ name: sort })
                    .collation({ locale: "pl" }).skip(page * pageSize)
                    .limit(pageSize).toArray();
                let pages = [];
                for (let i = 0; i <= maxPage; i++) {
                    pages[i] = { visible: i + 1, actual: i, selected: false };
                    if (i == page) { pages[i].selected = true }
                };
                res.render("komunikatklub", {
                    title: 'RUN! Lista klubów',
                    data: result,
                    sort: sort,
                    page: page + 1,
                    prevPage: prevPage,
                    nextPage: nextPage,
                    maxPage: maxPage + 1,
                    count: count,
                    pages: pages
                });
            } else {
                res.render("komunikatklub", {
                    title: 'RUN! Lista klubów',
                    sort: 1,
                    count: 0,
                    pages: 0
                });
            }
        } else {
            res.render("komunikatklub", {
                title: 'RUN! Lista klubów',
                sort: 1,
                count: 0,
                pages: 0
            });
        }
    } catch (err) {
        console.error(err);

    };
};

// Handle Club details with members on POST
exports.club_detail_post = async function(req, res) {
    try {
        let id = req.body.club_id.toString();
        let query = { _id: ObjectId(id) };
        let report = await req.db.db('app').collection('clubs').aggregate([{ $match: query }, {
            $lookup: {
                from: 'participants',
                localField: 'name',
                foreignField: 'club',
                as: 'members'
            }
        }, { $sort: { "members.l_name": 1, "members.f_name": 1 } }]).collation({ locale: 'pl' }).toArray();
        let tab = report[0].members;
        tab.sort((a, b) => a.l_name.localeCompare(b.l_name));
        res.render("daneklub.hbs", {
            title: 'RUN! Klub',
            data: report,
        });
    } catch (err) {
        console.error(err);
    }
};

// Handle Club create form on GET.
exports.club_create_get = function(req, res) {
    res.render('formsklub.hbs', { title: 'RUN! Dopisz', text: 'Wszystkie pola wymagane' });
};


// Handle Club create on POST.
exports.club_create_post = async function(req, res) {
    try {
        let club = {
            name: req.body.club_name + ' ' + req.body.club_city,
            city: req.body.club_city,
            email: req.body.club_email
        };
        await req.db.db('app').collection('clubs').insertOne(club);
        res.render("komunikat", { title: 'RUN!', komunikat: 'Klub ' + req.body.club_name + ' ' + req.body.club_city + ' dodany!' });

    } catch (err) {
        console.error(err);
    }

};

// Handle Club delete on POST.
exports.club_delete_post = async function(req, res) {
    try {
        let id = req.body.club_id;
        let query = { _id: ObjectId(id) };
        await req.db.db('app').collection('clubs').deleteOne(query);
        res.render('komunikat.hbs', { title: 'RUN!', komunikat: "Klub usunięty z bazy" });
    } catch (err) {
        console.error(err);
    }
};

// Handle Club edit on POST.
exports.club_edit_post = async function(req, res) {
    try {
        let id = req.body.club_id;
        let query = { _id: ObjectId(id) };
        let result = await req.db.db('app').collection('clubs').find(query).toArray();
        res.render('formsklubedit.hbs', { title: 'RUN! Edytuj', dane: result[0], text: "" });
    } catch (err) {
        console.error(err);
    }
};

// Handley Club update form on POST.
exports.club_update_post = async function(req, res) {
    try {
        let id = req.body.club_id;
        let query = { _id: ObjectId(id) };
        let name = req.body.club_name;
        name = name.replace(" " + req.body.club_city, "");
        var newvalues = { $set: { name: name + ' ' + req.body.club_city, city: req.body.club_city, email: req.body.club_email } };
        await req.db.db('app').collection('clubs').updateOne(query, newvalues);
        res.render('komunikat', { title: 'RUN!', komunikat: "Dane klubu zmienione" });

    } catch (err) {
        console.error(err);
    }

};