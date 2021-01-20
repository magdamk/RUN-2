var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;


// Require controller modules.
var club_controller = require('../controllers/clubController');
var participant_controller = require('../controllers/participantController');
var race_controller = require('../controllers/raceController');

// Club routes

// GET request for creating a club. NOTE This must come before routes that display club (uses id).
router.get('/club/create/', club_controller.club_create_get);

// POST request for creating Club.
router.post('/club/create/', club_controller.club_create_post);

// POST request for one Club.
router.post('/club/find/', club_controller.club_detail_post);

// GET request for list of all Club items.
router.get('/club/', club_controller.club_list);

// POST request to delete Club.
router.post('/club/delete/', club_controller.club_delete_post);

// POST request to edit Club.
router.post('/club/edit/', club_controller.club_edit_post);

// POST request to update Club.
router.post('/club/update/', club_controller.club_update_post);




// Participant routes

// GET request for creating participant
router.get('/participant/create/', participant_controller.participant_create_get);

// POST request for creating participant.
router.post('/participant/create/', participant_controller.participant_create_post);

// GET request for list of all Participant items.
router.get('/participant/', participant_controller.participant_list);

// POST request for one Participan.
router.post('/participant/find/', participant_controller.participant_detail_post);

// POST request to delete Participant.
router.post('/participant/delete/', participant_controller.participant_delete_post);

// POST request to edit participant.
router.post('/participant/edit/', participant_controller.participant_edit_post);

// POST request to update participant.
router.post('/participant/update/', participant_controller.participant_update_post);


// Race routes

// GET request for creating a race. NOTE This must come before routes that display race (uses id).
router.get('/race/create/', race_controller.race_create_get);

// POST request for creating a race. NOTE This must come before routes that display race (uses id).
router.post('/race/create/', race_controller.race_create_post);

// GET request for making a start list.
router.get('/race/makestartlist/', race_controller.race_start_list);

// GET request for closing a start list.
router.get('/race/makestartlist/close/', race_controller.race_start_list_close);

// GET request for list of all race items.
router.get('/race/', race_controller.race_list);

// GET request for lista startowa for a race
router.get('/race/listastartowa/', race_controller.race_start_list_ready);

// GET request for enter race results for a race
router.get('/race/enterresults/', race_controller.race_enterresults);

// GET request for closing a result list.
router.get('/race/enterresults/close/', race_controller.race_enterresults_close);

// GET request for displaying race results
router.get('/race/results/', race_controller.race_results);

// GET request for displaying classification after n races
router.get('/race/class/', race_controller.race_class);

// GET request for displaying classification after n races
router.get('/race/clubclass/', race_controller.race_club_class);

// GET request for deleting a race
router.get('/race/del/', race_controller.race_del);

module.exports = router;