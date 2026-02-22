import { Router } from 'express';
import { meController } from '../controllers/me.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';

const router = Router();

router.use(authorizedMiddleware);

// Saved Meditations
router.get('/saved-meditations', meController.getSavedMeditations.bind(meController));
router.post('/saved-meditations', meController.saveMeditation.bind(meController));
router.delete('/saved-meditations/:meditation_id', meController.unsaveMeditation.bind(meController));

// Saved Yogas
router.get('/saved-yogas', meController.getSavedYogas.bind(meController));
router.post('/saved-yogas', meController.saveYoga.bind(meController));
router.delete('/saved-yogas/:yoga_id', meController.unsaveYoga.bind(meController));

// Saved Mantras
router.get('/saved-mantras', meController.getSavedMantras.bind(meController));
router.post('/saved-mantras', meController.saveMantra.bind(meController));
router.delete('/saved-mantras/:mantra_id', meController.unsaveMantra.bind(meController));

// Saved Library (as per schema: /api/v1/me/saved-library)
router.get('/saved-library', meController.getSavedLibraryItems.bind(meController));
router.post('/saved-library', meController.saveLibraryItem.bind(meController));
router.delete('/saved-library/:library_item_id', meController.unsaveLibraryItem.bind(meController));

// Aggregated saved sessions (mixed list)
router.get('/saved-sessions', meController.getSavedSessions.bind(meController));

// Meditation Progress (with PATCH endpoint as per schema)
router.get('/meditation-progress', meController.getMeditationProgress.bind(meController));
router.post('/meditation-progress', meController.upsertMeditationProgress.bind(meController));
router.patch('/meditation-progress/:meditation_id', meController.upsertMeditationProgress.bind(meController));

// Yoga Progress (with PATCH endpoint as per schema)
router.get('/yoga-progress', meController.getYogaProgress.bind(meController));
router.post('/yoga-progress', meController.upsertYogaProgress.bind(meController));
router.patch('/yoga-progress/:yoga_id', meController.upsertYogaProgress.bind(meController));

// Mantra Progress (with PATCH endpoint as per schema)
router.get('/mantra-progress', meController.getMantraProgress.bind(meController));
router.post('/mantra-progress', meController.upsertMantraProgress.bind(meController));
router.patch('/mantra-progress/:mantra_id', meController.upsertMantraProgress.bind(meController));

// Library Progress (with PATCH endpoint as per schema)
router.get('/library-progress', meController.getLibraryProgress.bind(meController));
router.post('/library-progress', meController.upsertLibraryProgress.bind(meController));
router.patch('/library-progress/:library_item_id', meController.upsertLibraryProgress.bind(meController));

// NOTE: Review endpoints moved to content resources as per schema:
// - /api/v1/meditations/{id}/reviews
// - /api/v1/yogas/{id}/reviews
// - /api/v1/mantras/{id}/reviews
// - /api/v1/library/{id}/reviews

export default router;
